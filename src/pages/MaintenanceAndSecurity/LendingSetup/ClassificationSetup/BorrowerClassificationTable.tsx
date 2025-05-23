"use client"

import { useState } from "react"
import type { SearchDefinition, ColumnDefinition, FilterDefinition } from "@/components/data-table/data-table"
import { ClassificationDialogForm } from "./ClassificationFormDialog"
import type { BorrowerClassification } from "./Service/ClassificationSetupTypes"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import ClassificationSetupService from "./Service/ClassificationSetupService"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"
import { DataTableV2 } from "@/components/data-table/data-table-v2"

export function BorrowerClassificationTable() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<BorrowerClassification | null>(null)
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
    data: borrowerClassifications,
  } = useQuery({
    queryKey: ["borrower-classification-table", currentPage, rowsPerPage, searchQuery],
    queryFn: () => ClassificationSetupService.getAllClassifications(currentPage, rowsPerPage, searchQuery),
    staleTime: Infinity,
  })

  const deletionHandler = useMutation({
    mutationFn: (uuid: string) => {
      return ClassificationSetupService.deleteClassification(uuid)
    },
  })

  if (error) return "An error has occurred: " + error.message

  // Define columns
  const columns: ColumnDefinition<BorrowerClassification>[] = [
    {
      id: "group",
      header: "Group",
      accessorKey: "name",
      enableSorting: true,
    },
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
      accessorKey: "qualified_for_restructure",
      id: "qualified_for_restructure",
      header: "Reloan Eligible",
      cell: (row) => (
        <div className="flex justify-start">
          {row.qualified_for_restructure ? (
            "Yes"
          ) : (
            <span className="text-red-500">
              No
            </span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "bonus_loan_eligible",
      id: "bonus_loan_eligible",
      header: "Eligible for Bonus Loan",
      cell: (row) => (
        <div className="flex justify-start">
          {row.bonus_loan_eligible ? (
            "Yes"
          ) : (
            <span className="text-red-500">
              No
            </span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "allow_3mo_grace",
      id: "allow_3mo_grace",
      header: "3 Month Grace Period Eligble",
      cell: (row) => (
        <div className="flex justify-start">
          {row.allow_3mo_grace ? (
            "Yes"
          ) : (
            <span className="text-red-500">
              No
            </span>
          )}
        </div>
      ),
    },
  ]

  // Define filters
  const filters: FilterDefinition[] = []

  const search: SearchDefinition = {
    title: "Search",
    placeholder: "Search classifications",
    enableSearch: true,
  }

  // Handle edit
  const handleEdit = (item: BorrowerClassification) => {
    setSelectedItem(item)
    setIsEditing(true)
    setIsDialogOpen(true)
  }

  // Handle delete
  const handleDelete = async () => {
    setOpenDeleteModal(false)
    if (selectedItem) {
      try {
        if (borrowerClassifications?.data.classifications.length == 1) {
          setResetTable(true)
        }
        await deletionHandler.mutateAsync(selectedItem.id)
        queryClient.invalidateQueries({ queryKey: ["borrower-classification-table"] })
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
    setSelectedItem(null)
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
        totalCount={borrowerClassifications?.data.pagination.total_items ?? 1}
        perPage={borrowerClassifications?.data.pagination.per_page ?? 10}
        pageNumber={borrowerClassifications?.data.pagination.current_page ?? 10}
        onPaginationChange={onPaginationChange}
        onRowCountChange={onRowCountChange}
        title="Classifications"
        subtitle=""
        data={borrowerClassifications?.data.classifications ?? []}
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
        title="Delete Borrower Classification"
        description="Are you sure you want to delete the classification '{name}'? This action cannot be undone."
        itemName={selectedItem?.name ?? "No classification selected"}
      />
      <ClassificationDialogForm
        item={selectedItem}
        open={isDialogOpen}
        onCancel={() => {
          setSelectedItem(null)
        }}
        isEditing={isEditing}
        onOpenChange={() => {
          setSelectedItem(null)
          setIsDialogOpen(false)
          setIsEditing(false)
        }}
        onSubmit={onSubmit}
      />
    </>
  )
}
