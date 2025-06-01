"use client"

import { useState } from "react"
import type { SearchDefinition, ColumnDefinition, FilterDefinition } from "@/components/data-table/data-table"
import { CashAdvanceFormDialog } from "./CashAdvanceFormDialog"
import type { CashAdvanceSetup } from "./Service/CashAdvanceSetupTypes"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import CashAdvanceSetupService from "./Service/CashAdvanceSetupService"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"
import { DataTableV2 } from "@/components/data-table/data-table-v2"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { downloadFile } from "@/lib/utils"

export function CashAdvanceTable() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<CashAdvanceSetup | null>(null)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const queryClient = useQueryClient()
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState<string | null>(null)
  const [resetTable, setResetTable] = useState(false)

  const {
    isPending,
    error,
    data: cashAdvances,
  } = useQuery({
    queryKey: ["cash-advance-table", currentPage, rowsPerPage, searchQuery],
    queryFn: () => CashAdvanceSetupService.getAllCashAdvanceSetups(currentPage, rowsPerPage, searchQuery),
    staleTime: Number.POSITIVE_INFINITY,
  })

  const deletionHandler = useMutation({
    mutationFn: (uuid: string) => {
      return CashAdvanceSetupService.deleteCashAdvanceSetup(uuid)
    },
  })

  // Export mutations
  const exportPdfMutation = useMutation({
    mutationFn: CashAdvanceSetupService.exportPdf,
    onSuccess: (data) => { // Open PDF in new tab for preview
      const newTab = window.open(data.url, "_blank")
      if (newTab) {
        newTab.focus()
        toast.success("PDF opened in new tab")
      } else {
        toast.error("Failed to open PDF. Please try again.")
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to export PDF")
    },
  })


  const exportCsvMutation = useMutation({
    mutationFn: CashAdvanceSetupService.exportCsv,
    onSuccess: (csvData: Blob) => {
      try {
        const currentDate = new Date().toISOString().split("T")[0]
        downloadFile(csvData, `Cash Advance ${currentDate}.csv`)
        toast.success("CSV generated successfully")
      } catch (error: unknown) {
        console.error(error);
        toast.error("Failed to process CSV data")
      }
    },
    onError: () => {
      toast.error("Failed to export CSV")
    },
  })

  if (error) return "An error has occurred: " + error.message

  // Define columns
  const columns: ColumnDefinition<CashAdvanceSetup>[] = [
    {
      id: "code",
      header: "Code",
      accessorKey: "code",
      enableSorting: true,
    },
    {
      id: "name",
      header: "Cash Advance Name",
      accessorKey: "name",
      enableSorting: true,
    },
    {
      id: "type",
      header: "Loan Type",
      accessorKey: "type",
      enableSorting: true,
      cell: (item) => {
        return (
          <Badge variant={item.type === "bonus loan" ? "default" : "secondary"}>
            {item.type === "bonus loan" ? "Bonus Loan" : "Salary Loan"}
          </Badge>
        )
      },
    },
    {
      id: "interest_rate",
      header: "Interest Rate",
      accessorKey: "interest_rate",
      enableSorting: true,
      cell: (item) => `${item.interest_rate}%`,
    },
    {
      id: "surcharge_rate",
      header: "Surcharge Rate",
      accessorKey: "surcharge_rate",
      enableSorting: true,
      cell: (item) => `${item.surcharge_rate}%`,
    },
    {
      id: "max_amt",
      header: "Max Amount",
      accessorKey: "max_amt",
      enableSorting: true,
      cell: (item) => {
        const amount = item.max_amt
        return amount ? `₱${Number.parseFloat(amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}` : "-"
      },
    },
    {
      id: "max_rate",
      header: "Max Rate",
      accessorKey: "max_rate",
      enableSorting: true,
      cell: (item) => {
        return item.max_rate ? `${item.max_rate}%` : "-"
      },
    },
  ]

  // Define filters
  const filters: FilterDefinition[] = [
    {
      id: "type",
      label: "Loan Type",
      type: "input",
      options: [
        { label: "Bonus Loan", value: "bonus loan" },
        { label: "Salary Loan", value: "salary loan" },
      ],
    },
  ]

  const search: SearchDefinition = {
    title: "Search",
    placeholder: "Search Cash Advance",
    enableSearch: true,
  }

  // Handle edit
  const handleEdit = (item: CashAdvanceSetup) => {
    setSelectedItem(item)
    setIsEditing(true)
    setIsDialogOpen(true)
  }

  // Handle delete
  const handleDelete = async () => {
    setOpenDeleteModal(false)
    if (selectedItem) {
      try {
        if (cashAdvances?.data.cash_advance_setups.length == 1) {
          setResetTable(true)
        }
        await deletionHandler.mutateAsync(selectedItem.id)
        queryClient.invalidateQueries({ queryKey: ["cash-advance-table"] })
        setSelectedItem(null)
        setResetTable(false)
      } catch (error) {
        console.log(error)
      }
    }
  }

  // Handle new
  const handleNew = () => {
    setIsDialogOpen(true)
  }

  const onSubmit = () => {
    setSelectedItem(null)
    setIsDialogOpen(false)
    setIsEditing(false)
  }

  const onPaginationChange = (page: number) => {
    setCurrentPage(page)
  }

  const onRowCountChange = (row: number) => {
    setRowsPerPage(row)
  }

  const onSearchChange = (search: string) => {
    setSearchQuery(search)
  }

  return (
    <>
      <DataTableV2
        totalCount={cashAdvances?.data.pagination.total_items ?? 1}
        perPage={cashAdvances?.data.pagination.per_page ?? 10}
        pageNumber={cashAdvances?.data.pagination.current_page ?? 1}
        onPaginationChange={onPaginationChange}
        onRowCountChange={onRowCountChange}
        title="Cash Advances"
        subtitle="Manage existing cash advance configurations"
        data={cashAdvances?.data.cash_advance_setups ?? []}
        columns={columns}
        filters={filters}
        search={search}
        onEdit={handleEdit}
        onLoading={isPending || deletionHandler.isPending}
        onDelete={(item) => {
          setOpenDeleteModal(true)
          setSelectedItem(item)
        }}
        onNew={handleNew}
        idField="id"
        enableNew={true}
        enablePdfExport={true}
        onPdfExport={exportPdfMutation.mutate}
        onCsvExport={exportCsvMutation.mutate}
        enableCsvExport={true}
        enableFilter={false}
        onResetTable={resetTable}
        onSearchChange={onSearchChange}
      />
      <DeleteConfirmationDialog
        isOpen={openDeleteModal}
        onClose={() => {
          setSelectedItem(null)
          setOpenDeleteModal(false)
          setCurrentPage(1)
        }}
        onConfirm={handleDelete}
        title="Delete Cash Advance"
        description="Are you sure you want to delete the cash advance '{name}'? This action cannot be undone."
        itemName={selectedItem?.name ?? "No cash advance selected"}
      />
      <CashAdvanceFormDialog
        item={selectedItem}
        open={isDialogOpen}
        onCancel={() => {
          setSelectedItem(null)
        }}
        isEditing={isEditing}
        onOpenChange={() => {
          setIsDialogOpen(false)
          setIsEditing(false)
          setSelectedItem(null)
        }}
        onSubmit={onSubmit}
      />
    </>
  )
}
