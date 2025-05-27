"use client"

import { useEffect, useState, useCallback } from "react"
import { apiRequest } from "@/lib/api"
import {
  DataTable,
  type ColumnDefinition,
  type FilterDefinition,
  type SearchDefinition,
} from "@/components/data-table/data-table"
import AddEditEntryDialog from "./AddEditDialog"
import { DdeleteReferenceDialog } from "./DdeleteDialog"
import { CircleCheck, Download } from "lucide-react"
import { toast } from "sonner"

interface GeneralJournalEntry {
  id?: string
  name: string
  particulars?: string
  ref: {
    id: string
    code: string
    number: number
  }
  trans_amount: string
  transaction_date: string
  status: boolean
  branch: {
    id: string
    name: string
  }
  prepared_by: {
    id: string
    name: string
  }
  checked_by: {
    id: string
    name: string
  }
  approved_by: {
    id: string
    name: string
  }
  items?: Array<{
    id: string
    coa: {
      id: string
      code: string
      name: string
    }
    debit: number
    credit: number
  }>
}

interface DataPayload {
  count: number
  general_journals: GeneralJournalEntry[]
  pagination: Pagination
}

interface ApiResponse {
  status: string
  message: string
  data: DataPayload
}

interface Pagination {
  current_page: number
  per_page: number
  total_pages: number
  total_items: number
}

export default function GeneralJournalTable() {
  const [loading, setLoading] = useState(true)
  const [onResetTable, setOnResetTable] = useState(false)
  const [data, setData] = useState<GeneralJournalEntry[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<GeneralJournalEntry | null>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [entryToDelete, setEntryToDelete] = useState<GeneralJournalEntry | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const response = await apiRequest<ApiResponse>("get", "/general-journal/", null, {
        useAuth: true,
        useBranchId: true,
      })
      
      if (response.data?.data?.general_journals) {
        setData(response.data.data.general_journals)
        setOnResetTable(true)
      } else {
        console.warn("Unexpected API response structure:", response)
        setData([])
      }
    } catch (err) {
      console.error("Failed to fetch general journal data:", err)
      toast.error("Failed to Load Data", {
        description: "Could not fetch general journal entries. Please try again.",
        duration: 5000,
      })
      setData([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleNew = useCallback(() => {
    setEditingEntry(null)
    setIsDialogOpen(true)
  }, [])

  const handleEdit = useCallback(async (entry: GeneralJournalEntry) => {
    if (!entry.id) {
      toast.error("Invalid Entry", {
        description: "Cannot edit entry without ID.",
        duration: 3000,
      })
      return
    }

    try {
      const response = await apiRequest<{ data: GeneralJournalEntry }>(
        "get",
        `/general-journal/${entry.id}`,
        null,
        {
          useAuth: true,
          useBranchId: true,
        }
      )
      
      if (response.data?.data) {
        setEditingEntry(response.data.data)
        setIsDialogOpen(true)
      } else {
        throw new Error("Invalid response structure")
      }
    } catch (error) {
      console.error("Failed to fetch entry details:", error)
      toast.error("Failed to Load Entry", {
        description: "Could not load entry details for editing.",
        duration: 5000,
      })
    }
  }, [])

  const requestDelete = useCallback((entry: GeneralJournalEntry) => {
    setEntryToDelete(entry)
    setDeleteDialogOpen(true)
  }, [])

  const confirmDelete = useCallback(async () => {
    if (!entryToDelete?.id) return

    try {
      await apiRequest("delete", `/general-journal/${entryToDelete.id}`, null, {
        useAuth: true,
        useBranchId: true,
      })
      
      setDeleteDialogOpen(false)
      setEntryToDelete(null)
      
      // Optimistic update - remove from local state immediately
      setData(prevData => prevData.filter(item => item.id !== entryToDelete.id))
      
      toast.success("General Journal Deleted", {
        description: "General Journal entry has been successfully deleted.",
        icon: <CircleCheck className="h-5 w-5" />,
        duration: 5000,
      })
      
      // Refresh data to ensure consistency
      fetchData()
    } catch (error) {
      console.error("Failed to delete entry:", error)
      toast.error("Delete Failed", {
        description: "Failed to delete the entry. Please try again.",
        duration: 5000,
      })
    }
  }, [entryToDelete, fetchData])

  const cancelDelete = useCallback(() => {
    setDeleteDialogOpen(false)
    setEntryToDelete(null)
  }, [])

  const handleSave = useCallback((savedEntry: GeneralJournalEntry) => {
    if (editingEntry && savedEntry.id) {
      // Update existing entry
      setData(prevData => 
        prevData.map(item => item.id === savedEntry.id ? savedEntry : item)
      )
    } else {
      // Add new entry
      setData(prevData => [savedEntry, ...prevData])
    }
    
    // Refresh to ensure data consistency
    fetchData()
  }, [editingEntry, fetchData])

  const handleCloseDialog = useCallback(() => {
    setIsDialogOpen(false)
    setEditingEntry(null)
  }, [])

  const downloadFile = useCallback((blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }, [])

  const getAuthHeaders = useCallback(() => {
    const authToken = localStorage.getItem('authToken')
    const branchId = localStorage.getItem('branchId')
    
    if (!authToken) {
      throw new Error("Authentication token not found")
    }

    return {
      'Authorization': `Bearer ${authToken}`,
      'X-Branch-ID': branchId || '',
      'Content-Type': 'application/json',
    }
  }, [])

  const safeCsvValue = useCallback((value: any): string => {
    if (value === null || value === undefined) return '""'
    const stringValue = String(value).replace(/"/g, '""')
    return `"${stringValue}"`
  }, [])

  const generateCsvFromData = useCallback(() => {
    try {
      const headers = [
        'Transaction Date',
        'Reference Number', 
        'Name',
        'Particulars',
        'Debit Amount',
        'Credit Amount',
        'Status',
        'Branch',
        'Prepared By',
        'Checked By',
        'Approved By'
      ]

      const csvRows = [headers.join(',')]

      // Process each entry with proper error handling
      data.forEach(entry => {
        try {
          const row = [
            safeCsvValue(new Date(entry.transaction_date).toLocaleDateString()),
            safeCsvValue(`${entry.ref?.code || 'N/A'}-${entry.ref?.number || '0'}`),
            safeCsvValue(entry.name || ''),
            safeCsvValue(entry.particulars || ''),
            parseFloat(entry.trans_amount || '0').toFixed(2),
            parseFloat(entry.trans_amount || '0').toFixed(2),
            entry.status ? 'Active' : 'Inactive',
            safeCsvValue(entry.branch?.name || 'N/A'),
            safeCsvValue(entry.prepared_by?.name || 'N/A'),
            safeCsvValue(entry.checked_by?.name || 'N/A'),
            safeCsvValue(entry.approved_by?.name || 'N/A')
          ]
          csvRows.push(row.join(','))
        } catch (entryError) {
          console.warn('Error processing entry for CSV:', entryError, entry)
          // Add a basic row even if there's an error
          csvRows.push([
            safeCsvValue('Error'),
            safeCsvValue('Error'),
            safeCsvValue(entry.name || 'Unknown'),
            '""',
            '0.00',
            '0.00',
            'Unknown',
            '""',
            '""',
            '""',
            '""'
          ].join(','))
        }
      })

      // Add totals row
      try {
        const totalDebit = data.reduce((sum, entry) => {
          const amount = parseFloat(entry.trans_amount || '0')
          return sum + (isNaN(amount) ? 0 : amount)
        }, 0)
        const totalCredit = totalDebit // Assuming balanced entries
        
        csvRows.push([
          '"TOTAL"',
          '""',
          '""', 
          '""',
          totalDebit.toFixed(2),
          totalCredit.toFixed(2),
          '""',
          '""',
          '""',
          '""',
          '""'
        ].join(','))
      } catch (totalError) {
        console.warn('Error calculating totals for CSV:', totalError)
      }

      return csvRows.join('\n')
    } catch (error) {
      console.error('Error generating CSV data:', error)
      // Return minimal CSV with headers only
      return 'Transaction Date,Reference Number,Name,Particulars,Debit Amount,Credit Amount,Status,Branch,Prepared By,Checked By,Approved By\n"Error generating data","","","",0.00,0.00,"","","","",""'
    }
  }, [data, safeCsvValue])

  const handleCsvExport = useCallback(async () => {
    setIsExporting(true)
    try {
      // First try the API endpoint
      const headers = getAuthHeaders()
      const response = await fetch('/api/general-journal/export-csv', {
        method: 'GET',
        headers,
      })

      if (response.ok) {
        const blob = await response.blob()
        const currentDate = new Date().toISOString().split('T')[0]
        downloadFile(blob, `general-journal-${currentDate}.csv`)
        
        toast.success("CSV Export Successful", {
          description: "General Journal has been exported to CSV successfully.",
          icon: <Download className="h-5 w-5" />,
          duration: 5000,
        })
        return // Success, exit early
      } else {
        throw new Error(`API endpoint returned status: ${response.status}`)
      }
    } catch (apiError) {
      console.warn("API CSV export failed, using fallback:", apiError)
      
      // Fallback: Generate CSV from current data
      try {
        console.log('Attempting CSV fallback with data:', data.length, 'entries')
        
        if (!data || data.length === 0) {
          toast.error("No Data to Export", {
            description: "There are no entries to export. Please refresh and try again.",
            duration: 5000,
          })
          return
        }

        const csvContent = generateCsvFromData()
        console.log('Generated CSV content length:', csvContent.length)
        
        if (!csvContent || csvContent.length < 50) { // Basic sanity check
          throw new Error('Generated CSV content appears to be empty or invalid')
        }

        // Create blob with explicit UTF-8 BOM for Excel compatibility
        const BOM = '\uFEFF'
        const blob = new Blob([BOM + csvContent], { 
          type: 'text/csv;charset=utf-8;' 
        })
        
        const currentDate = new Date().toISOString().split('T')[0]
        downloadFile(blob, `general-journal-${currentDate}.csv`)
        
        toast.success("CSV Export Successful", {
          description: `General Journal exported successfully (${data.length} entries).`,
          icon: <Download className="h-5 w-5" />,
          duration: 5000,
        })
        
      } catch (fallbackError) {
        console.error("Fallback CSV generation failed:", fallbackError)
        console.error("Data structure:", data)
        
        toast.error("CSV Export Failed", {
          description: "Failed to export General Journal to CSV. Please check the data and try again.",
          duration: 5000,
        })
      }
    } finally {
      setIsExporting(false)
    }
  }, [getAuthHeaders, downloadFile, generateCsvFromData, data])

  const generatePdfFromData = useCallback(async () => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      throw new Error('Could not open print window')
    }

    const currentDate = new Date().toLocaleDateString()
    const totalDebit = data.reduce((sum, entry) => sum + parseFloat(entry.trans_amount || '0'), 0)
    const totalCredit = totalDebit // Assuming balanced entries
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>General Journal Report</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 20px; 
              color: #333;
              line-height: 1.4;
            }
            h1 { 
              color: #333; 
              text-align: center; 
              border-bottom: 3px solid #007bff;
              padding-bottom: 10px;
              margin-bottom: 5px;
            }
            .header { 
              text-align: center; 
              margin-bottom: 30px; 
              background: #f8f9fa;
              padding: 15px;
              border-radius: 5px;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-top: 20px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            th, td { 
              border: 1px solid #ddd; 
              padding: 12px 8px; 
              text-align: left; 
              font-size: 12px;
            }
            th { 
              background-color: #007bff; 
              color: white;
              font-weight: bold; 
              text-align: center;
            }
            .amount { text-align: right; font-family: monospace; }
            .date { text-align: center; }
            .total-row { 
              background-color: #f8f9fa; 
              font-weight: bold; 
              border-top: 2px solid #007bff;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              font-size: 10px;
              color: #666;
            }
            @media print {
              body { margin: 0; }
              .header { page-break-inside: avoid; }
              @page { margin: 1cm; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>General Journal Report</h1>
            <p><strong>Generated on:</strong> ${currentDate}</p>
            <p><strong>Total Entries:</strong> ${data.length}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Reference</th>
                <th>Name</th>
                <th>Particulars</th>
                <th>Debit Amount</th>
                <th>Credit Amount</th>
              </tr>
            </thead>
            <tbody>
              ${data.map(entry => `
                <tr>
                  <td class="date">${new Date(entry.transaction_date).toLocaleDateString()}</td>
                  <td>${entry.ref.code}-${entry.ref.number}</td>
                  <td>${entry.name}</td>
                  <td>${entry.particulars || '-'}</td>
                  <td class="amount">${parseFloat(entry.trans_amount || '0').toFixed(2)}</td>
                  <td class="amount">${parseFloat(entry.trans_amount || '0').toFixed(2)}</td>
                </tr>
              `).join('')}
              <tr class="total-row">
                <td colspan="4"><strong>TOTAL</strong></td>
                <td class="amount"><strong>${totalDebit.toFixed(2)}</strong></td>
                <td class="amount"><strong>${totalCredit.toFixed(2)}</strong></td>
              </tr>
            </tbody>
          </table>
          <div class="footer">
            <p>This report was generated automatically from the General Journal system.</p>
          </div>
        </body>
      </html>
    `

    printWindow.document.write(htmlContent)
    printWindow.document.close()
    
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print()
        printWindow.close()
      }, 250)
    }
    
    toast.success("PDF Export Initiated", {
      description: "PDF print dialog has been opened.",
      icon: <Download className="h-5 w-5" />,
      duration: 3000,
    })
  }, [data])

  const handlePdfExport = useCallback(async () => {
    setIsExporting(true)
    try {
      const headers = getAuthHeaders()
      const response = await fetch('/api/general-journal/export-pdf', {
        method: 'GET',
        headers,
      })

      if (response.ok) {
        const blob = await response.blob()
        const currentDate = new Date().toISOString().split('T')[0]
        downloadFile(blob, `general-journal-${currentDate}.pdf`)
        
        toast.success("PDF Export Successful", {
          description: "General Journal has been exported to PDF successfully.",
          icon: <Download className="h-5 w-5" />,
          duration: 5000,
        })
      } else {
        throw new Error(`API endpoint returned status: ${response.status}`)
      }
    } catch (error) {
      console.warn("API PDF export failed, using fallback:", error)
      
      try {
        await generatePdfFromData()
      } catch (fallbackError) {
        console.error("Fallback PDF generation failed:", fallbackError)
        toast.error("PDF Export Failed", {
          description: "Failed to export General Journal to PDF. Please try again.",
          duration: 5000,
        })
      }
    } finally {
      setIsExporting(false)
    }
  }, [getAuthHeaders, downloadFile, generatePdfFromData])

  const columns: ColumnDefinition<GeneralJournalEntry>[] = [
    {
      id: "transaction_date",
      header: "Transaction Date",
      accessorKey: "transaction_date",
      enableSorting: true,
      cell: (item) => new Date(item.transaction_date).toLocaleDateString(),
    },
    {
      id: "ref",
      header: "Reference Number",
      accessorKey: "ref",
      cell: (item) => `${item.ref.code}-${item.ref.number}`,
      enableSorting: true,
    },
    {
      id: "name",
      header: "Name",
      accessorKey: "name",
      enableSorting: true,
    },
    {
      id: "particulars",
      header: "Particulars",
      accessorKey: "particulars",
      enableSorting: true,
      cell: (item) => item.particulars || "-",
    },
    {
      id: "debit_amount",
      header: "Debit Amount",
      accessorKey: "trans_amount",
      cell: (item) => parseFloat(item.trans_amount || '0').toFixed(2),
      enableSorting: true,
    },
    {
      id: "credit_amount",
      header: "Credit Amount",
      accessorKey: "trans_amount",
      cell: (item) => parseFloat(item.trans_amount || '0').toFixed(2),
      enableSorting: true,
    },
  ]

  const filters: FilterDefinition[] = []

  const search: SearchDefinition = {
    title: "Search",
    placeholder: "Search by name, particulars, or reference number",
    enableSearch: true,
  }

  return (
    <>
      <DataTable
        title="General Journal"
        subtitle="Manage general journal entries"
        data={data}
        columns={columns}
        filters={filters}
        search={search}
        onEdit={handleEdit}
        onDelete={requestDelete}
        onNew={handleNew}
        idField="id"
        enableNew={true}
        enablePdfExport={true}
        enableCsvExport={true}
        enableFilter={true}
        onPdfExport={handlePdfExport}
        onCsvExport={handleCsvExport}
        onLoading={loading || isExporting}
        onResetTable={onResetTable}
      />

      <AddEditEntryDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSave}
        editingEntry={editingEntry}
      />

      <DdeleteReferenceDialog
        isOpen={deleteDialogOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Delete General Journal Entry"
        description="Are you sure you want to delete the entry '{name}'? This action cannot be undone."
        itemName={entryToDelete?.name ?? ""}
      />
    </>
  )
}