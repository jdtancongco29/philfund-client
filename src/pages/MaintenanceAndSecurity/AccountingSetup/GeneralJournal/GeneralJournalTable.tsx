"use client"

import { useEffect, useState } from "react"
import { apiRequest } from "@/lib/api"
import {
  DataTable,
  type ColumnDefinition,
  type FilterDefinition,
  type SearchDefinition,
} from "@/components/data-table/data-table"
import AddEditEntryDialog from "./AddEditDialog"
import { DdeleteReferenceDialog } from "./DdeleteDialog" // Adjust the path if needed
import { CircleCheck } from "lucide-react"
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

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [entryToDelete, setEntryToDelete] = useState<GeneralJournalEntry | null>(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await apiRequest<ApiResponse>("get", "/general-journal/", null, {
        useAuth: true,
        useBranchId: true,
      })
      setData(response.data.data.general_journals)
      setOnResetTable(true)
  
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleNew = () => {
    setEditingEntry(null)
    setIsDialogOpen(true)
  }

  const handleEdit = async (entry: GeneralJournalEntry) => {
    try {
      // Fetch full entry details including items
      const response = await apiRequest<{ data: GeneralJournalEntry }>(
        "get",
        `/general-journal/${entry.id}`,
        null,
        {
          useAuth: true,
          customHeaders: {
            "X-Branch-Id": "56b04822-91f7-4e05-990d-21ea26f93bb4",
          },
        }
      )
      setEditingEntry(response.data.data)
      setIsDialogOpen(true)
    } catch (error) {
      console.error("Failed to fetch entry details:", error)
    }
  }

  // Open delete confirmation dialog
  const requestDelete = (entry: GeneralJournalEntry) => {
    setEntryToDelete(entry)
    setDeleteDialogOpen(true)
  }

  // Confirm delete handler, calls API and refreshes data
  const confirmDelete = async () => {
    if (!entryToDelete) return
    try {
      await apiRequest("delete", `/general-journal/${entryToDelete.id}`, null, {
        useAuth: true,
        useBranchId: true,
      })
      setDeleteDialogOpen(false)
      setEntryToDelete(null)
      fetchData()
              toast.success("General Journal Deleted", {
          description: `General Journal has been successfully deleted.`,
          icon: <CircleCheck className="h-5 w-5" />,
          duration: 5000,
        });
    } catch (error) {
      console.error("Failed to delete entry:", error)
      // Optionally show error notification here
    }
  }

  // Cancel delete dialog
  const cancelDelete = () => {
    setDeleteDialogOpen(false)
    setEntryToDelete(null)
  }

  const handleSave = (savedEntry: GeneralJournalEntry) => {
    if (editingEntry && savedEntry.id) {
      // Update existing entry
      setData((prevData) => prevData.map((item) => (item.id === savedEntry.id ? savedEntry : item)))
    } else {
      // Add new entry
      setData((prevData) => [savedEntry, ...prevData])
    }
    fetchData() // Refresh the table
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingEntry(null)
  }

  const columns: ColumnDefinition<GeneralJournalEntry>[] = [
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
    },
    {
      id: "ref",
      header: "Reference Number",
      accessorKey: "ref",
      cell: (item) => item.ref.number,
      enableSorting: true,
    },
    {
      id: "trans_amount",
      header: "Transaction Amount",
      accessorKey: "trans_amount",
      enableSorting: true,
      cell: (item) =>
        `₱${Number.parseFloat(item.trans_amount).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
    },
    {
      id: "transaction_date",
      header: "Transaction Date",
      accessorKey: "transaction_date",
      enableSorting: true,
      cell: (item) => new Date(item.transaction_date).toLocaleDateString(),
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      enableSorting: true,
      displayCondition: [
        {
          value: true,
          label: "Active",
          className:
            "inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20",
        },
        {
          value: false,
          label: "Inactive",
          className:
            "inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20",
        },
      ],
    },
  ]

  const filters: FilterDefinition[] = []

  const search: SearchDefinition = {
    title: "Search",
    placeholder: "Search by name, particulars, or reference number",
    enableSearch: true,
  }

  const handlePdfExport = () => {
    console.log("Exporting General Journal to PDF...")
    // Implement PDF export logic here
  }

  const handleCsvExport = () => {
    console.log("Exporting General Journal to CSV...")
    // Implement CSV export logic here
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
        onDelete={requestDelete} // Use the dialog trigger here
        onNew={handleNew}
        idField="id"
        enableNew={true}
        enablePdfExport={true}
        enableCsvExport={true}
        enableFilter={true}
        onPdfExport={handlePdfExport}
        onCsvExport={handleCsvExport}
        onLoading={loading}
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
