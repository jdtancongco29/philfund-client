"use client"

import { useCallback, useState } from "react"
import type { SearchDefinition, ColumnDefinition, FilterDefinition } from "@/components/data-table/data-table"
import type { BranchSetup } from "./Service/BranchSetupTypes"
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import BranchSetupService from "./Service/BranchSetupService"
import { DataTableV2 } from "@/components/data-table/data-table-v2"
import { BranchDialog } from "./BranchDialog"
import { PencilIcon, TrashIcon } from "lucide-react"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"
import { toast } from "sonner"
import { downloadFile } from "@/lib/utils"

export function BranchSetupTable() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<BranchSetup | null>(null)
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
    data: branches,
  } = useQuery({
    queryKey: ["branch-setup-table", currentPage, rowsPerPage, searchQuery, columnSort, sortQuery],
    queryFn: () => BranchSetupService.getAllBranches(currentPage, rowsPerPage, searchQuery, columnSort, sortQuery),
    staleTime: Number.POSITIVE_INFINITY,
    placeholderData: keepPreviousData, // Use the newer placeholderData with keepPreviousData
    refetchOnWindowFocus: false,
  })

  const deletionHandler = useMutation({
    mutationFn: (uuid: string) => {
      return BranchSetupService.deleteBranch(uuid)
    },
    onSuccess: () => {
      toast.success("Branch deleted successfully")
      // Check if we need to go back a page after deletion
      const shouldGoToPreviousPage = branches?.data.branches.length === 1 && currentPage > 1
      
      
      if (shouldGoToPreviousPage) {
        // Update the page first, then invalidate queries
        setCurrentPage((prev) => prev - 1)
      }
      
      queryClient.invalidateQueries({
        queryKey: ["branch-setup-table"],
        exact: false,
      })
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete branch")
    },
  })

  // Export mutations
  const exportPdfMutation = useMutation({
    mutationFn: BranchSetupService.exportPdf,
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
      toast.error(error.message || "Failed to export PDF")
    },
  })

  const exportCsvMutation = useMutation({
    mutationFn: BranchSetupService.exportCsv,
    onSuccess: (csvData: Blob) => {
      try {
        const currentDate = new Date().toISOString().split("T")[0]
        downloadFile(csvData, `branch-${currentDate}.csv`)
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
  const columns: ColumnDefinition<BranchSetup>[] = [
    {
      id: "code",
      header: "Branch Code",
      accessorKey: "code",
      enableSorting: true,
    },
    {
      id: "name",
      header: "Branch Name",
      accessorKey: "name",
      enableSorting: true,
    },
    {
      id: "city",
      header: "City/Municipality",
      accessorKey: "city",
      enableSorting: true,
    },
    {
      id: "departments",
      header: "Departments",
      accessorKey: "departments",
      enableSorting: false,
      cell: (row) => {
        const departmentsRaw: { id: string; name: string }[] = row.departments ?? []

        if (departmentsRaw.length === 0) return null

        const firstDepartment = departmentsRaw[0].name
        const remainingDepartments = departmentsRaw.slice(1)
        const remainingDepartmentCount = remainingDepartments.length
        const remainingDepartmentNames = remainingDepartments.map((d) => d.name).join(", ")

        return (
          <div className="flex items-center gap-2">
            <span className="border border-[#D0D5DD] rounded-full px-4 py-1 text-sm text-black">{firstDepartment}</span>
            {remainingDepartmentCount > 0 && (
              <span
                className="border border-[#D0D5DD] rounded-full px-3 py-1 text-sm text-black cursor-help"
                title={remainingDepartmentNames}
              >
                +{remainingDepartmentCount}
              </span>
            )}
          </div>
        )
      },
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

  // Define filters
  const filters: FilterDefinition[] = []

  const search: SearchDefinition = {
    title: "Search",
    placeholder: "Search branches",
    enableSearch: true,
  }

  // Handle edit
  const handleEdit = (item: BranchSetup) => {
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
      onClick: (branch: BranchSetup) => {
        setSelectedItem(branch)
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
        totalCount={branches?.data.pagination.total_items ?? 0}
        perPage={branches?.data.pagination.per_page ?? 10}
        pageNumber={branches?.data.pagination.current_page ?? 1}
        onPaginationChange={onPaginationChange}
        onRowCountChange={onRowCountChange}
        title="Branch List"
        subtitle=""
        data={branches?.data.branches ?? []}
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
        title="Delete Branch"
        description={`Are you sure you want to delete the branch '${selectedItem?.name}'? This action cannot be undone.`}
        itemName={selectedItem?.name ?? "No Branch Selected"}
      />

      <BranchDialog
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