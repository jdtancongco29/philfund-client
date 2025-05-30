"use client"

import { useCallback, useState } from "react"
import type { SearchDefinition, ColumnDefinition, FilterDefinition } from "@/components/data-table/data-table"
import type { DepartmentSetup } from "./Service/DepartmentSetupTypes"
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import DepartmentSetupService from "./Service/DepartmentSetupService"
import { DataTableV2 } from "@/components/data-table/data-table-v2"
import { DepartmentDialog } from "./DepartmentDialog"
import { PencilIcon, TrashIcon } from "lucide-react"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"
import { toast } from "sonner"
import { downloadFile } from "@/lib/utils"

export function DepartmentSetupTable() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<DepartmentSetup | null>(null)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState<string | null>(null)
  const [columnSort, setColumnSort] = useState<string | null>(null)
  const [sortQuery, setSortQuery] = useState<string | null>(null)

  const queryClient = useQueryClient()

  const onPaginationChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  const onRowCountChange = useCallback((row: number) => {
    setRowsPerPage(row)
    setCurrentPage(1) // Reset to first page when changing row count
  }, [])

  const onSearchChange = useCallback((search: string) => {
    setSearchQuery(search || null)
    setCurrentPage(1) // Reset to first page when searching
  }, [])
  
  const {
    isPending,
    error,
    isFetching,
    data: departments,
  } = useQuery({
    queryKey: ["department-setup-table", currentPage, rowsPerPage, searchQuery, columnSort, sortQuery],
    queryFn: () => DepartmentSetupService.getAllDepartments(currentPage, rowsPerPage, searchQuery, columnSort, sortQuery),
    staleTime: Number.POSITIVE_INFINITY,
    placeholderData: keepPreviousData, // Use the newer placeholderData with keepPreviousData
    refetchOnWindowFocus: false,
  })

  const deletionHandler = useMutation({
    mutationFn: (uuid: string) => {
      return DepartmentSetupService.deleteDepartment(uuid)
    },
    onSuccess: () => {
      toast.success("Department deleted successfully")
      const shouldGoToPreviousPage = departments?.data.departments.length === 1 && currentPage > 1
      
      
      if (shouldGoToPreviousPage) {
        // Update the page first, then invalidate queries
        setCurrentPage((prev) => prev - 1)
        // Invalidate with the new page number
        setTimeout(() => {
          queryClient.invalidateQueries({
            queryKey: ["department-setup-table"],
            exact: false,
          })
        }, 0)
      } else {
        // Just invalidate the current query
        queryClient.invalidateQueries({
          queryKey: ["department-setup-table", currentPage, rowsPerPage, searchQuery],
          exact: true,
        })
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete department")
    },
  })

  // Export mutations
  const exportPdfMutation = useMutation({
    mutationFn: DepartmentSetupService.exportPdf,
    onSuccess: (data) => {
      // Open PDF in new tab for preview
      const newTab = window.open(data.url, "_blank")
      if (newTab) {
        newTab.focus()
        toast.success("PDF opened in new tab")
      }else{
        toast.error("Failed to open PDF. Please try again.")
      }
    },
    onError: (error: any) => {
      console.error("PDF export error:", error)
      toast.error(error.message || "Failed to export PDF")
    },
  })

  const exportCsvMutation = useMutation({
    mutationFn: DepartmentSetupService.exportCsv,
    onSuccess: (csvData: Blob) => {
      try {
        const currentDate = new Date().toISOString().split("T")[0]
        downloadFile(csvData, `departments-${currentDate}.csv`)
        toast.success("CSV generated successfully")
      } catch (error) {
        toast.error("Failed to process CSV data")
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to export CSV")
    },
  })

  if (error) return "An error has occurred: " + error.message

  // Define columns
  const columns: ColumnDefinition<DepartmentSetup>[] = [
    {
      id: "code",
      header: "Department Code",
      accessorKey: "code",
      enableSorting: true,
    },
    {
      id: "name",
      header: "Department Name",
      accessorKey: "name",
      enableSorting: true,
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      enableSorting: true,
      cell: (row) => {
        const status: boolean = row.status ?? false
        return (
          <div className="flex items-center gap-2">
            <span
              className={`border rounded-full px-4 py-1 text-sm text-white ${status ? "bg-emerald-600" : "bg-red-600"}`}
            >
              {status ? "Active" : "Inactive"}
            </span>
          </div>
        )
      },
    },
  ]

  // Define filters - no filters as requested
  const filters: FilterDefinition[] = []

  const search: SearchDefinition = {
    title: "Search",
    placeholder: "Search departments",
    enableSearch: true,
  }

  // Handle edit
  const handleEdit = (item: DepartmentSetup) => {
    setSelectedItem(item)
    setIsEditing(true)
    setIsDialogOpen(true)
  }

  // Handle delete
  const handleDelete = async () => {
    if (selectedItem) {
      deletionHandler.mutate(selectedItem.id)
    }
  }

  // Handle new
  const handleNew = () => {
    setSelectedItem(null)
    setIsEditing(false)
    setIsDialogOpen(true)
  }

  // Handle exports
  const handlePdfExport = () => {
    exportPdfMutation.mutate()
  }

  const handleCsvExport = () => {
    exportCsvMutation.mutate()
  }

  // Define action buttons
  const actionButtons = [
    {
      label: "Edit",
      icon: <PencilIcon className="h-4 w-4" />,
      onClick: handleEdit,
    },
    {
      label: "Delete",
      icon: <TrashIcon className="h-4 w-4 text-destructive" />,
      onClick: (department: DepartmentSetup) => {
        setSelectedItem(department)
        setOpenDeleteModal(true)
      },
    },
  ]

  const handleSort = (column: string, sort: string) => {
    setColumnSort(column)
    setSortQuery(sort)
  }

  return (
    <>
      <DataTableV2
        totalCount={departments?.data.pagination.total_items ?? 0}
        perPage={departments?.data.pagination.per_page ?? 10}
        pageNumber={departments?.data.pagination.current_page ?? 1}
        onPaginationChange={onPaginationChange}
        onRowCountChange={onRowCountChange}
        title="Department Setup"
        subtitle="Manage system departments"
        data={departments?.data.departments ?? []}
        columns={columns}
        filters={filters}
        search={search}
        actionButtons={actionButtons}
        onLoading={isPending || isFetching || deletionHandler.isPending}
        onNew={handleNew}
        idField="id"
        enableNew={true}
        enablePdfExport={true}
        enableCsvExport={true}
        enableFilter={false}
        onResetTable={false}
        onSearchChange={onSearchChange}
        onPdfExport={handlePdfExport}
        onCsvExport={handleCsvExport}
        onSort={handleSort}
      />

      <DeleteConfirmationDialog
        isOpen={openDeleteModal}
        onClose={() => {
          setSelectedItem(null)
          setOpenDeleteModal(false)
        }}
        onConfirm={handleDelete}
        title="Delete Department?"
        description={`Are you sure you want to delete the department '${selectedItem?.name}'? This action cannot be undone.`}
        itemName={selectedItem?.name ?? "No Department Selected"}
      />

      <DepartmentDialog
        item={selectedItem}
        open={isDialogOpen}
        isEditing={isEditing}
        onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) {
            setSelectedItem(null)
            setIsEditing(false)
          }
        }}
        onSuccess={() => {
          setSelectedItem(null)
          setIsDialogOpen(false)
          setIsEditing(false)

          // Refresh the current page data
          queryClient.invalidateQueries({
            queryKey: ["branch-setup-table", currentPage, rowsPerPage, searchQuery],
            exact: true,
          })
        }}
      />
    </>
  )
}