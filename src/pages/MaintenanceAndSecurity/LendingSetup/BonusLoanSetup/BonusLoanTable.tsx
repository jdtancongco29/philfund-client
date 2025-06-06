"use client"

import { useState } from "react"
import type { SearchDefinition, ColumnDefinition, FilterDefinition } from "@/components/data-table/data-table"
import { BonusLoanFormDialog } from "./BonusLoanFormDialog"
import type { BonusLoan } from "./Service/BonusLoanSetupTypes"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import BonusLoanSetupService from "./Service/BonusLoanSetupService"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"
import { DataTableV2 } from "@/components/data-table/data-table-v2"
import { toast } from "sonner"
import { downloadFile } from "@/lib/utils"
import { ModulePermissionProps } from "../../Security/UserPermissions/Service/PermissionsTypes"
import { PencilIcon, TrashIcon } from "lucide-react"

export function BonusLoanTable({
  canAdd,
  canEdit,
  canDelete,
  canExport,
}: ModulePermissionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<BonusLoan | null>(null)
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
    data: bonusLoans,
  } = useQuery({
    queryKey: ["bonus-loan-table", currentPage, rowsPerPage, searchQuery],
    queryFn: () => BonusLoanSetupService.getAllBonusLoans(currentPage, rowsPerPage, searchQuery),
    staleTime: Number.POSITIVE_INFINITY,
  })

  const deletionHandler = useMutation({
    mutationFn: (uuid: string) => {
      return BonusLoanSetupService.deleteBonusLoan(uuid)
    },
  })

  // Export mutations
  const exportPdfMutation = useMutation({
    mutationFn: BonusLoanSetupService.exportPdf,
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
    mutationFn: BonusLoanSetupService.exportCsv,
    onSuccess: (csvData: Blob) => {
      try {
        const currentDate = new Date().toISOString().split("T")[0]
        downloadFile(csvData, `Bonus Loan ${currentDate}.csv`)
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

  // Helper function to get month name
  const getMonthName = (monthNumber: number) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]
    return months[monthNumber - 1] || ""
  }

  // Define columns
  const columns: ColumnDefinition<BonusLoan>[] = [
    {
      id: "name",
      header: "Type of Bonus",
      accessorKey: "name",
      enableSorting: true,
    },
    {
      id: "release_month",
      header: "Month of Release",
      cell: (item) => getMonthName(item.release_month),
      accessorKey: "release_month",
      enableSorting: true,
    },
    {
      id: "cut_off_date",
      header: "Cut-off Date",
      accessorKey: "cut_off_date",
      enableSorting: true,
    },
    {
      id: "max_amt",
      header: "Max Amount",
      accessorKey: "max_amt",
      enableSorting: true,
      cell: (item) => item.max_amt == null ? "-" : item.max_amt,
    },
    {
      id: "max_rate",
      header: "Max Rate",
      accessorKey: "max_rate",
      cell: (item) => {
        const rate = item.max_rate;
        if (rate == null) return "-";
        const parsed = parseFloat(rate);
        return Number.isInteger(parsed) ? `${parsed}%` : `${parsed.toFixed(2)}%`;
      },
      enableSorting: true,
    },
    {
      id: "surcharge_rate",
      header: "Surcharge",
      accessorKey: "surcharge_rate",
      cell: (item) => {
        const rate = item.surcharge_rate;
        if (rate == null) return "-";
        const parsed = parseFloat(rate);
        return Number.isInteger(parsed) ? `${parsed}%` : `${parsed.toFixed(2)}%`;
      },
      enableSorting: true,
    },
  ]

  // Define filters
  const filters: FilterDefinition[] = []

  const search: SearchDefinition = {
    title: "Search",
    placeholder: "Search Bonus Loan",
    enableSearch: true,
  }

  // Handle edit
  const handleEdit = (item: BonusLoan) => {
    setSelectedItem(item)
    setIsEditing(true)
    setIsDialogOpen(true)
  }

  // Handle delete
  const handleDelete = async () => {
    setOpenDeleteModal(false)
    if (selectedItem) {
      try {
        if (bonusLoans?.data.bonus_loan_setups.length == 1) {
          setResetTable(true)
        }
        await deletionHandler.mutateAsync(selectedItem.id)
        queryClient.invalidateQueries({ queryKey: ["bonus-loan-table"] })
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
    setIsEditing(false);
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

    // Define action buttons
  const actionButtons = []

  if (canEdit) {
    actionButtons.push({
      label: "Edit",
      icon: <PencilIcon className="h-4 w-4" />,
      onClick: handleEdit,
    })
  }

  if (canDelete) {
    actionButtons.push({
      label: "Delete",
      icon: <TrashIcon className="h-4 w-4 text-destructive" />,
      onClick: (branch: BonusLoan) => {
        setSelectedItem(branch)
        setOpenDeleteModal(true)
      },
    })
  }

  return (
    <>
      <DataTableV2
        totalCount={bonusLoans?.data.pagination.total_items ?? 1}
        perPage={bonusLoans?.data.pagination.per_page ?? 10}
        pageNumber={bonusLoans?.data.pagination.current_page ?? 10}
        onPaginationChange={onPaginationChange}
        onRowCountChange={onRowCountChange}
        title="Bonus Loan"
        subtitle=""
        data={bonusLoans?.data.bonus_loan_setups ?? []}
        columns={columns}
        filters={filters}
        search={search}
        actionButtons={actionButtons}
        onLoading={isPending || deletionHandler.isPending}
        onNew={handleNew}
        idField="id"
        enableNew={canAdd}
        enablePdfExport={canExport}
        onPdfExport={exportPdfMutation.mutate}
        onCsvExport={exportCsvMutation.mutate}
        enableCsvExport={canExport}
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
        title="Delete Bonus Loan"
        description="Are you sure you want to delete the bonus loan '{name}'? This action cannot be undone."
        itemName={selectedItem?.name ?? "No bonus loan selected"}
      />
      <BonusLoanFormDialog
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
