"use client"

import { useEffect, useState, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { CircleCheck, Download } from "lucide-react"
import { apiRequest } from "@/lib/api"
import { DataTable, type ColumnDefinition, type FilterDefinition } from "@/components/data-table/data-table"
import { toast } from "sonner"
import { EditBankDialog, type FormValues } from "./EditBankDialog"
import { DeleteDataDialog } from "./DeleteDataDialog"

interface Coa {
  id: string
  code: string
  name: string
}

interface Bank {
  id: string
  branch_id: string
  branch_name: string
  coa: Coa
  code: string
  name: string
  address: string
  account_type: string
  status: number
}

interface Pagination {
  current_page: number
  per_page: number
  total_pages: number
  total_items: number
}

interface BankDataPayload {
  count: number
  banks: Bank[]
  pagination: Pagination
}

interface ApiResponse {
  status: string
  message: string
  data: BankDataPayload
}

export default function BankAccountsTable() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [item, setItem] = useState<Bank[]>([])
  const [loading, setLoading] = useState(true)
  const [reset, setReset] = useState(false)
  const [selectedItem, setSelectedItem] = useState<FormValues | null>(null)
  const [selectedItemId, setSelectedItemId] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDeleteId, setItemToDeleteId] = useState("")
  const [itemToDelete, setItemToDelete] = useState("")
  const [onResetTable, setOnResetTable] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await apiRequest<ApiResponse>("get", "/bank/", null, {
        useAuth: true,
        useBranchId: true,
      })
      setItem(response.data.data.banks)
      setOnResetTable(true)
    } catch (err) {
      console.error(err)
      toast.error("Failed to Load Data", {
        description: "Could not fetch bank accounts. Please try again.",
        duration: 5000,
      })
    } finally {
      setLoading(false)
    }
  }

  const columns: ColumnDefinition<Bank>[] = [
    {
      id: "code",
      header: "Code",
      accessorKey: "code",
      enableSorting: true,
    },
    {
      id: "name",
      header: "Name",
      accessorKey: "name",
      enableSorting: true,
    },
    {
      id: "branch_name",
      header: "Branch",
      accessorKey: "branch_name",
      enableSorting: true,
    },
    {
      id: "coa",
      header: "Chart of Account",
      accessorKey: "coa",
      cell: (item) => (
        <div>
          <div>{item.coa.code}</div>
          <div>{item.coa.name}</div>
        </div>
      ),
      enableSorting: true,
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      enableSorting: true,
      displayCondition: [
        {
          value: 1,
          label: "Active",
          className:
            "inline-flex items-center rounded-full bg-[#059669] px-2 py-1 text-xs font-medium text-white ring-1 ring-inset ring-[#059669]/20",
        },
        {
          value: 0,
          label: "Inactive",
          className:
            "inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20",
        },
      ],
    },
  ]

  const filters: FilterDefinition[] = []

  const resetTable = () => {
    setOnResetTable(true)
    setTimeout(() => setOnResetTable(false), 100)
  }

  const search = {
    title: "Search",
    placeholder: "Search Bank Account",
    enableSearch: true,
  }

  const handleEdit = (bank: Bank) => {
    setSelectedItem({
      code: bank.code,
      name: bank.name,
      address: bank.address,
      branch_id: bank.branch_id,
      branch_name: bank.branch_name,
      coa_name: bank.coa.name,
      coa_id: bank.coa.id,
      account_type: bank.account_type,
      status: bank.status,
    })
    setSelectedItemId(bank.id)
    setDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    try {
      await apiRequest("delete", `/bank/${itemToDeleteId}`, null, {
        useAuth: true,
        useBranchId: true,
      })

      toast.success("Bank Deleted", {
        description: `${itemToDelete} has been successfully deleted.`,
        icon: <CircleCheck className="h-5 w-5" />,
        duration: 5000,
      })

      resetTable()
      fetchData()
    } catch (err) {
      console.error("Error deleting Bank:", err)
      toast.error("Failed to delete Bank.")
    } finally {
      setDeleteDialogOpen(false)
    }
  }

  const handleDelete = (bank: Bank) => {
    setDeleteDialogOpen(true)
    setItemToDeleteId(bank.id)
    setItemToDelete(bank.name)
  }

  const handleSaveItem = async (values: FormValues) => {
    try {
      const method = selectedItemId ? "put" : "post"
      const endpoint = selectedItemId ? `/bank/${selectedItemId}` : "/bank/"
      const payloadData = {
        code: values.code,
        name: values.name,
        address: values.address,
        branch_id: values.branch_id,
        coa_id: values.coa_id,
        account_type: values.account_type,
        status: values.status,
      }

      const response = await apiRequest<{ data: { name: string } }>(method, endpoint, payloadData, {
        useAuth: true,
        useBranchId: true,
      })

      toast.success(selectedItemId ? "Bank Account Updated" : "Bank Account Added", {
        description: `${response.data.data.name} has been successfully ${selectedItemId ? "updated" : "added"}.`,
        icon: <CircleCheck className="h-5 w-5" />,
        duration: 5000,
      })

      setReset(true)
      resetTable()
      fetchData()
    } catch (err) {
      console.error("Error saving Bank Account:", err)
      throw err
    }
  }

  const handleNew = () => {
    setReset(false)
    setSelectedItem(null)
    setSelectedItemId("")
    setDialogOpen(true)
  }

  // Export functionality
  const getAuthHeaders = useCallback(() => {
    const authToken = localStorage.getItem("authToken")
    const branchId = localStorage.getItem("branchId")

    if (!authToken) {
      throw new Error("Authentication token not found")
    }

    return {
      Authorization: `Bearer ${authToken}`,
      "X-Branch-ID": branchId || "",
      "Content-Type": "application/json",
    }
  }, [])

  const downloadFile = useCallback((blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }, [])

  const safeCsvValue = useCallback((value: any): string => {
    if (value === null || value === undefined) return '""'
    const stringValue = String(value).replace(/"/g, '""')
    return `"${stringValue}"`
  }, [])

  const generateCsvFromData = useCallback(() => {
    try {
      const headers = ["Code", "Name", "Branch", "Chart of Account", "Type", "Address", "Status"]

      const csvRows = [headers.join(",")]

      // Process each bank account entry
      item.forEach((bank) => {
        try {
          const row = [
            safeCsvValue(bank.code || ""),
            safeCsvValue(bank.name || ""),
            safeCsvValue(bank.branch_name || ""),
            safeCsvValue(bank.coa.name || ""),
            safeCsvValue(bank.account_type || ""),
            safeCsvValue(bank.address || ""),
            bank.status === 1 ? "Active" : "Inactive",
          ]
          csvRows.push(row.join(","))
        } catch (entryError) {
          console.warn("Error processing bank entry for CSV:", entryError, bank)
          // Add a basic row even if there's an error
          csvRows.push(
            [
              safeCsvValue(bank.code || "Error"),
              safeCsvValue(bank.name || "Unknown"),
              '""',
              '""',
              '""',
              '""',
              "Unknown",
            ].join(","),
          )
        }
      })

      // Add summary row
      csvRows.push(['"TOTAL ACCOUNTS"', `"${item.length}"`, '""', '""', '""', '""', '""'].join(","))

      return csvRows.join("\n")
    } catch (error) {
      console.error("Error generating CSV data:", error)
      // Return minimal CSV with headers only
      return 'Code,Name,Branch,Chart of Account,Type,Address,Status\n"Error generating data","","","","","",""'
    }
  }, [item, safeCsvValue])

  const handleCsvExport = useCallback(async () => {
    setIsExporting(true)
    try {
      // First try the API endpoint
      const headers = getAuthHeaders()
      const response = await fetch("/bank/export-csv", {
        method: "GET",
        headers,
      })

      if (response.ok) {
        const blob = await response.blob()
        const currentDate = new Date().toISOString().split("T")[0]
        downloadFile(blob, `bank-accounts-${currentDate}.csv`)

        toast.success("CSV Export Successful", {
          description: "Bank Accounts have been exported to CSV successfully.",
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
        console.log("Attempting CSV fallback with data:", item.length, "entries")

        if (!item || item.length === 0) {
          toast.error("No Data to Export", {
            description: "There are no bank accounts to export. Please refresh and try again.",
            duration: 5000,
          })
          return
        }

        const csvContent = generateCsvFromData()
        console.log("Generated CSV content length:", csvContent.length)

        if (!csvContent || csvContent.length < 50) {
          // Basic sanity check
          throw new Error("Generated CSV content appears to be empty or invalid")
        }

        // Create blob with explicit UTF-8 BOM for Excel compatibility
        const BOM = "\uFEFF"
        const blob = new Blob([BOM + csvContent], {
          type: "text/csv;charset=utf-8;",
        })

        const currentDate = new Date().toISOString().split("T")[0]
        downloadFile(blob, `bank-accounts-${currentDate}.csv`)

        toast.success("CSV Export Successful", {
          description: `Bank Accounts exported successfully (${item.length} entries).`,
          icon: <Download className="h-5 w-5" />,
          duration: 5000,
        })
      } catch (fallbackError) {
        console.error("Fallback CSV generation failed:", fallbackError)
        console.error("Data structure:", item)

        toast.error("CSV Export Failed", {
          description: "Failed to export Bank Accounts to CSV. Please check the data and try again.",
          duration: 5000,
        })
      }
    } finally {
      setIsExporting(false)
    }
  }, [getAuthHeaders, downloadFile, generateCsvFromData, item])

 const exportPdf = async (): Promise<Blob> => {
  const endpoint = `/bank/export-pdf` // adjust endpoint if needed
  try {
    const response = await apiRequest<Blob>("get", endpoint, null, {
      useAuth: true,
      useBranchId: true,
      responseType: "blob",
    })
    return response.data
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to export PDF"
    throw new Error(errorMessage)
  }
}
const handlePdfExport = useCallback(async () => {
  setIsExporting(true)
  try {
    const blob = await exportPdf()
    const url = window.URL.createObjectURL(blob)
    
    const newTab = window.open(url, "_blank")
    if (newTab) {
      newTab.focus()
    } else {
      const link = document.createElement("a")
      link.href = url
      link.download = `general-journal-${new Date().toISOString().split("T")[0]}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }

    toast.success("PDF opened in new tab")
  } catch (error: any) {
    toast.error("PDF Export Failed", {
      description: error.message || "Could not export General Journal PDF.",
    })
  } finally {
    setIsExporting(false)
  }
}, [])


  useEffect(() => {
    fetchData()
  }, [])

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <DataTable
          title="Bank Accounts"
          subtitle="Manage existing bank accounts"
          data={item}
          columns={columns}
          filters={filters}
          search={search}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onNew={handleNew}
          idField="id"
          enableNew
          enablePdfExport
          enableCsvExport
          enableFilter={false}
          onPdfExport={handlePdfExport}
          onCsvExport={handleCsvExport}
          onLoading={loading || isExporting}
          onResetTable={onResetTable}
        />
      </CardContent>
      <EditBankDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSaveItem}
        onReset={reset}
        initialValues={selectedItem}
      />
      <DeleteDataDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Bank Account"
        description={`Are you sure you want to delete the bank account: ${itemToDelete}?`}
        itemName={itemToDelete}
      />
    </Card>
  )
}
