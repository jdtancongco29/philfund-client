"use client"

import { useState } from "react"
import type { SearchDefinition, ColumnDefinition, FilterDefinition } from "@/components/data-table/data-table"
import { SalaryLoanFormDialog } from "./SalaryLoanFormDialog"
import type { SalaryLoan } from "./Service/SalaryLoanSetupTypes"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import SalaryLoanSetupService from "./Service/SalaryLoanSetupService"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"
import { DataTableV2 } from "@/components/data-table/data-table-v2"
import { toast } from "sonner"
import { downloadFile } from "@/lib/utils"

export function SalaryLoanTable() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<SalaryLoan | null>(null)
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
    data: salaryLoans,
  } = useQuery({
    queryKey: ["salary-loan-table", currentPage, rowsPerPage, searchQuery],
    queryFn: () => SalaryLoanSetupService.getAllSalaryLoans(currentPage, rowsPerPage, searchQuery),
    staleTime: Number.POSITIVE_INFINITY,
  })

  const deletionHandler = useMutation({
    mutationFn: (uuid: string) => {
      return SalaryLoanSetupService.deleteSalaryLoan(uuid)
    },
  })

  // Export mutations
  const exportPdfMutation = useMutation({
    mutationFn: SalaryLoanSetupService.exportPdf,
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
    mutationFn: SalaryLoanSetupService.exportCsv,
    onSuccess: (csvData: Blob) => {
      try {
        const currentDate = new Date().toISOString().split("T")[0]
        downloadFile(csvData, `Salary Loans ${currentDate}.csv`)
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
  const columns: ColumnDefinition<SalaryLoan>[] = [
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
      id: "interest_rate",
      header: "Interest Rate",
      accessorKey: "interest_rate",
      cell: (item) => {
        const rate = item.interest_rate;
        if (rate == null) return "-";
        const parsed = parseFloat(rate);
        return Number.isInteger(parsed) ? `${parsed}%` : `${parsed.toFixed(2)}%`;
      },
      enableSorting: true,
    },
    {
      id: "min_amount",
      header: "Min Amount",
      accessorKey: "min_amount",
      enableSorting: true,
    },
    {
      id: "max_amount",
      header: "Max Amount",
      accessorKey: "max_amount",
      enableSorting: true,
    },
  ]

  // Define filters
  const filters: FilterDefinition[] = []

  const search: SearchDefinition = {
    title: "Search",
    placeholder: "Search Salary Loan",
    enableSearch: true,
  }

  // Handle edit
  const handleEdit = (item: SalaryLoan) => {
    setSelectedItem(item)
    setIsEditing(true)
    setIsDialogOpen(true)
  }

  // Handle delete
  const handleDelete = async () => {
    setOpenDeleteModal(false)
    if (selectedItem) {
      try {
        if (salaryLoans?.data.salary_loan_setups.length == 1) {
          setResetTable(true)
        }
        await deletionHandler.mutateAsync(selectedItem.id)
        queryClient.invalidateQueries({ queryKey: ["salary-loan-table"] })
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
    setIsEditing(false)
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
        totalCount={salaryLoans?.data.pagination.total_items ?? 1}
        perPage={salaryLoans?.data.pagination.per_page ?? 10}
        pageNumber={salaryLoans?.data.pagination.current_page ?? 10}
        onPaginationChange={onPaginationChange}
        onRowCountChange={onRowCountChange}
        title="Salary Loan"
        subtitle=""
        data={salaryLoans?.data.salary_loan_setups ?? []}
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
        enableCsvExport={true}
        enableFilter={false}
        onResetTable={resetTable}
        onCsvExport={exportCsvMutation.mutate}
        onPdfExport={exportPdfMutation.mutate}
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
        title="Delete Salary Loan"
        description="Are you sure you want to delete the salary loan '{name}'? This action cannot be undone."
        itemName={selectedItem?.name ?? "No salary loan selected"}
      />
      <SalaryLoanFormDialog
        item={selectedItem}
        open={isDialogOpen}
        onCancel={() => {
          setSelectedItem(null)
          setIsEditing(false)
        }}
        isEditing={isEditing}
        onOpenChange={() => {
          setIsDialogOpen(false)
          setSelectedItem(null)
          setIsEditing(false)
        }}
        onSubmit={onSubmit}
      />
    </>
  )
}
