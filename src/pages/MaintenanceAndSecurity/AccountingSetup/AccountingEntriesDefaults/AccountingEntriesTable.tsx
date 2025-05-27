"use client"

import { useEffect, useState } from "react"
import { apiRequest } from "@/lib/api"
import {
  DataTable,
  type ColumnDefinition,
  type FilterDefinition,
  type SearchDefinition,
} from "@/components/data-table/data-table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

import { CircleCheck } from "lucide-react"
import { toast } from "sonner"
import AddEditEntryDialog from "./AddNewEntryDialog";
// Import the updated dialog component

interface AccountEntry {
  id?: string
  name: string
  particulars?: string
  transaction_amount: string
  status: boolean
  details?: Array<{
    coa: {
      id: string
      code: string
      name: string
    }
    debit: string
    credit: string
  }>
}

interface DataPayload {
  count: number
  default_accounts: AccountEntry[]
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

export default function AccountEntriesTable() {
  const [loading, setLoading] = useState(true)
  const [onResetTable, setOnResetTable] = useState(false)
  const [data, setData] = useState<AccountEntry[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<AccountEntry | null>(null)

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [entryToDelete, setEntryToDelete] = useState<AccountEntry | null>(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await apiRequest<ApiResponse>("get", "/default-entry", null, {
        useAuth: true,
        useBranchId: true,
      })
      setData(response.data.data.default_accounts)
      setOnResetTable(true)
  
    } catch (err) {
      console.error(err)
      toast.error("Error", {
        description: "Failed to load account entries. Please try again.",
        duration: 3000,
      });
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

  const handleEdit = async (entry: AccountEntry) => {
    try {
      // Fetch full entry details including account details
      const response = await apiRequest<{ data: AccountEntry }>(
        "get",
        `/default-entry/${entry.id}`,
        null,
        {
          useAuth: true,
          useBranchId: true,
        }
      )
      setEditingEntry(response.data.data)
      setIsDialogOpen(true)
    } catch (error) {
      console.error("Failed to fetch entry details:", error)
      toast.error("Error", {
        description: "Failed to load entry details. Please try again.",
        duration: 3000,
      });
      // If individual fetch fails, use the existing entry data
      setEditingEntry(entry)
      setIsDialogOpen(true)
    }
  }

  // Open delete confirmation dialog
  const requestDelete = (entry: AccountEntry) => {
    setEntryToDelete(entry)
    setDeleteDialogOpen(true)
  }

  // Confirm delete handler, calls API and refreshes data
  const confirmDelete = async () => {
    if (!entryToDelete) return
    try {
      await apiRequest("delete", `/default-entry/${entryToDelete.id}`, null, {
        useAuth: true,
        useBranchId: true,
      })
      setDeleteDialogOpen(false)
      setEntryToDelete(null)
      fetchData()
      toast.success("Account Entry Deleted", {
        description: `Account Entry has been successfully deleted.`,
        icon: <CircleCheck className="h-5 w-5" />,
        duration: 5000,
      });
    } catch (error) {
      console.error("Failed to delete entry:", error)
      toast.error("Delete Failed", {
        description: "Failed to delete the account entry. Please try again.",
        duration: 5000,
      });
    }
  }

  // Cancel delete dialog
  const cancelDelete = () => {
    setDeleteDialogOpen(false)
    setEntryToDelete(null)
  }

  const handleSave = (savedEntry: AccountEntry) => {
    if (editingEntry && savedEntry.id) {
      // Update existing entry
      setData((prevData) => prevData.map((item) => (item.id === savedEntry.id ? savedEntry : item)))
    } else {
      // Add new entry
      setData((prevData) => [savedEntry, ...prevData])
    }
    fetchData() // Refresh the table to get the latest data
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingEntry(null)
  }

  const columns: ColumnDefinition<AccountEntry>[] = [
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
      id: "transaction_amount",
      header: "Transaction Amount",
      accessorKey: "transaction_amount",
      enableSorting: true,
      cell: (item) =>
        `₱${Number.parseFloat(item.transaction_amount).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
    },
    {
      id: "accounts_count",
      header: "Accounts",
      accessorKey: "details",
      enableSorting: false,
      cell: (item) => `${item.details?.length || 0} account(s)`,
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

  const filters: FilterDefinition[] = [
    {
        id: "status",
        label: "Status",
        options: [
            { label: "Active", value: "true" },
            { label: "Inactive", value: "false" },
        ],
        type: "input"
    },
  ]

  const search: SearchDefinition = {
    title: "Search",
    placeholder: "Search by name or particulars",
    enableSearch: true,
  }

  const handlePdfExport = () => {
    console.log("Exporting Account Entries to PDF...")
    // Implement PDF export logic here
  }

  const handleCsvExport = () => {
    console.log("Exporting Account Entries to CSV...")
    // Implement CSV export logic here
  }

  return (
    <>
      <DataTable
        title="Default Account Entries"
        subtitle="Manage default account entries"
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
        onLoading={loading}
        onResetTable={onResetTable}
      />

      {/* Add/Edit Entry Dialog */}
      <AddEditEntryDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSave}
        editingEntry={editingEntry}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete the entry "{entryToDelete?.name}"? This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={cancelDelete}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}