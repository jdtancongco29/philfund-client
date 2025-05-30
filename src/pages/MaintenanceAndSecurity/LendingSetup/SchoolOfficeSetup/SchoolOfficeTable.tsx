"use client"

import { useState } from "react"
import type { SearchDefinition, ColumnDefinition, FilterDefinition } from "@/components/data-table/data-table"
import { SchoolFormDialog } from "./SchoolFormDialog"
import type { School } from "./Service/SchoolSetupTypes"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import SchoolSetupService from "./Service/SchoolSetupService"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"
import { DataTableV2 } from "@/components/data-table/data-table-v2"
import { toast } from "sonner"
import { downloadFile } from "@/lib/utils"

export function SchoolOfficeTable() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<School | null>(null)
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
    data: schools,
  } = useQuery({
    queryKey: ["school-table", currentPage, rowsPerPage, searchQuery],
    queryFn: () => SchoolSetupService.getAllSchools(currentPage, rowsPerPage, searchQuery),
    staleTime: 1000 * 60 * 5,
  })

  const deletionHandler = useMutation({
    mutationFn: (uuid: string) => {
      return SchoolSetupService.deleteSchool(uuid)
    },
  })
  // Export mutations
  const exportPdfMutation = useMutation({
    mutationFn: SchoolSetupService.exportPdf,
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob)
      // Open PDF in new tab for preview
      const newTab = window.open(url, "_blank")
      if (newTab) {
        newTab.focus()
      } else {
        // Fallback if popup is blocked
        const link = document.createElement("a")
        link.href = url
        link.download = `borrower-schools-${new Date().toISOString().split("T")[0]}.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
      toast.success("PDF opened in new tab")
    },
    onError: () => {
      toast.error("Failed to export PDF")
    },
  })

  const exportCsvMutation = useMutation({
    mutationFn: SchoolSetupService.exportCsv,
    onSuccess: (csvData: Blob) => {
      try {
        const currentDate = new Date().toISOString().split("T")[0]
        downloadFile(csvData, `borrower-schools-${currentDate}.csv`)
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
  const columns: ColumnDefinition<School>[] = [
    {
      id: "division",
      header: "Division Code",
      accessorKey: "code",
      cell: (item) => item.division.code,
      enableSorting: true,
    },
    {
      id: "district",
      header: "District Code",
      cell: (item) => item.district.code,
      accessorKey: "name",
      enableSorting: true,
    },
    {
      id: "code",
      header: "School Code",
      accessorKey: "code",
      enableSorting: true,
    },
    {
      id: "name",
      header: "School Name",
      accessorKey: "name",
      enableSorting: true,
    },
  ]

  // Define filters
  const filters: FilterDefinition[] = []

  const search: SearchDefinition = {
    title: "Search",
    placeholder: "Search School/Office",
    enableSearch: true,
  }

  // Handle edit
  const handleEdit = (item: School) => {
    setSelectedItem(item)
    setIsEditing(true)
    setIsDialogOpen(true)
  }

  // Handle delete
  const handleDelete = async () => {
    setOpenDeleteModal(false)
    if (selectedItem) {
      try {
        if (schools?.data.schools.length == 1) {
          setResetTable(true)
        }
        await deletionHandler.mutateAsync(selectedItem.id)
        queryClient.invalidateQueries({ queryKey: ["school-table"] })
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

  return (
    <>
      <DataTableV2
        totalCount={schools?.data.pagination.total_items ?? 1}
        perPage={schools?.data.pagination.per_page ?? 10}
        pageNumber={schools?.data.pagination.current_page ?? 10}
        onPaginationChange={onPaginationChange}
        onRowCountChange={onRowCountChange}
        title="School List"
        subtitle="Manage existing borrower schools"
        data={schools?.data.schools ?? []}
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
        onCsvExport={exportCsvMutation.mutate}
        onPdfExport={exportPdfMutation.mutate}
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
        title="Delete School"
        description="Are you sure you want to delete the school '{name}'? This action cannot be undone."
        itemName={selectedItem?.name ?? "No school selected"}
      />
      <SchoolFormDialog
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
