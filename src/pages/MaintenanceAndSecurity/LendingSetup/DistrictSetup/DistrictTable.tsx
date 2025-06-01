"use client"

import { useState } from "react"
import type { SearchDefinition, ColumnDefinition, FilterDefinition } from "@/components/data-table/data-table"
import { DistrictDialogForm } from "./DistrictFormDialog"
import type { District } from "./Service/DistrictSetupTypes"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import DistrictSetupService from "./Service/DistrictSetupService"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"
import { DataTableV2 } from "@/components/data-table/data-table-v2"
import { downloadFile } from "@/lib/utils"
import { toast } from "sonner"

export function DistrictTable() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<District | null>(null)
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
    data: districts,
  } = useQuery({
    queryKey: ["district-table", currentPage, rowsPerPage, searchQuery],
    queryFn: () => DistrictSetupService.getAllDistricts(currentPage, rowsPerPage, searchQuery),
    staleTime: () => 1000 * 60 * 5,
  })

  const deletionHandler = useMutation({
    mutationFn: (uuid: string) => {
      return DistrictSetupService.deleteDistrict(uuid)
    },
  })
  // Export mutations
  const exportPdfMutation = useMutation({
    mutationFn: DistrictSetupService.exportPdf,
    onSuccess: (data) => {
      // Open PDF in new tab for preview
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
    mutationFn: DistrictSetupService.exportCsv,
    onSuccess: (csvData: Blob) => {
      try {
        const currentDate = new Date().toISOString().split("T")[0]
        downloadFile(csvData, `Districts ${currentDate}.csv`)
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
  const columns: ColumnDefinition<District>[] = [
    {
      id: "division",
      header: "Division Name",
      accessorKey: "code",
      cell: (item) => item.division.name,
      enableSorting: true,
    },
    {
      id: "code",
      header: "District Code",
      accessorKey: "code",
      enableSorting: true,
    },
    {
      id: "name",
      header: "District Name",
      accessorKey: "name",
      enableSorting: true,
    },
  ]

  // Define filters
  const filters: FilterDefinition[] = []

  const search: SearchDefinition = {
    title: "Search",
    placeholder: "Search District",
    enableSearch: true,
  }

  // Handle edit
  const handleEdit = (item: District) => {
    setSelectedItem(item)
    setIsEditing(true)
    setIsDialogOpen(true)
  }

  // Handle delete
  const handleDelete = async () => {
    setOpenDeleteModal(false)
    if (selectedItem) {
      try {
        if (districts?.data.districts.length == 1) {
          setResetTable(true)
        }
        await deletionHandler.mutateAsync(selectedItem.id)
        queryClient.invalidateQueries({ queryKey: ["district-table"] })
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
        totalCount={districts?.data.pagination.total_items ?? 1}
        perPage={districts?.data.pagination.per_page ?? 10}
        pageNumber={districts?.data.pagination.current_page ?? 10}
        onPaginationChange={onPaginationChange}
        onRowCountChange={onRowCountChange}
        title="Borrower Districts"
        subtitle="Manage existing borrower districts"
        data={districts?.data.districts ?? []}
        columns={columns}
        filters={filters}
        search={search}
        onEdit={handleEdit}
        onLoading={isPending || deletionHandler.isPending}
        onDelete={(item) => {
          setOpenDeleteModal(true)
          setSelectedItem(item)
        }}
        onCsvExport={exportCsvMutation.mutate}
        onPdfExport={exportPdfMutation.mutate}
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
        title="Delete District"
        description="Are you sure you want to delete the district '{name}'? This action cannot be undone."
        itemName={selectedItem?.name ?? "No district selected"}
      />
      <DistrictDialogForm
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
