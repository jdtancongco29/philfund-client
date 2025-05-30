"use client"

import { useState, useMemo } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import { ArchiveIcon, TrashIcon, XIcon } from "lucide-react"
import {
  DataTableV2,
  ColumnDefinition,
  FilterDefinition,
  SearchDefinition,
  BulkActionButton,
} from "@/components/data-table/data-table-v2"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"
import type { ActivityLog, ActivityLogFilters } from "./Service/ActivityLogType"
import ActivityLogService from "./Service/ActivityLogService"
import { toast } from "sonner"
import type { DateRange } from "react-day-picker"
import { downloadFile } from "@/lib/utils"

export function ActivityLogTable() {
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedBranch, setSelectedBranch] = useState<string>("")
  const [selectedModule, setSelectedModule] = useState<string>("")
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [selectedItems, setSelectedItems] = useState<ActivityLog[]>([])
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<ActivityLog | null>(null)
  const [columnSort, setColumnSort] = useState<string | null>(null)
  const [sortQuery, setSortQuery] = useState<string | null>(null)

  const queryClient = useQueryClient()

  // Build filters object
  const filters: ActivityLogFilters = useMemo(
    () => ({
      search: searchQuery || undefined,
      branch_id: selectedBranch || undefined,
      module_name: selectedModule || undefined,
      start_date: dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : undefined,
      end_date: dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : undefined,
      page: currentPage,
      per_page: rowsPerPage,
      order_by: columnSort,
      sort: sortQuery,
    }),
    [searchQuery, selectedBranch, selectedModule, dateRange, currentPage, rowsPerPage, columnSort, sortQuery],
  )

  // Fetch activity logs
  const {
    // isPending,
    data: activityLogsData,
    isLoading,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["activity-logs", filters],
    queryFn: () => ActivityLogService.getActivityLogs(filters),
    staleTime: 30 * 1000, // 30 seconds
  })

  // Fetch branches for filter
  const { data: branchesData } = useQuery({
    queryKey: ["branches-for-filter"],
    queryFn: () => ActivityLogService.getBranches(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Fetch modules for filter
  const { data: modulesData } = useQuery({
    queryKey: ["modules-for-filter"],
    queryFn: () => ActivityLogService.getModules(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Delete single item mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => ActivityLogService.deleteActivityLog(id),
    onSuccess: () => {
      toast.success("Activity log deleted successfully")
      const shouldGoToPreviousPage = activityLogsData?.data.logs.length === 1 && currentPage > 1
      
      
      if (shouldGoToPreviousPage) {
        // Update the page first, then invalidate queries
        setCurrentPage((prev) => prev - 1)
        // Invalidate with the new page number
        setTimeout(() => {
          queryClient.invalidateQueries({
            queryKey: ["activity-logs"],
            exact: false,
          })
        }, 0)
      } else {
        // Just invalidate the current query
        queryClient.invalidateQueries({
          queryKey: ["activity-logs", currentPage, rowsPerPage, searchQuery],
          exact: true,
        })
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete activity log")
    },
  })

  // Bulk delete mutation
  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: string[]) => ActivityLogService.bulkDeleteActivityLogs({ ids }),
    onSuccess: () => {
      toast.success(`${selectedItems.length} activity logs deleted successfully`)
      queryClient.invalidateQueries({ queryKey: ["activity-logs"] })
      setSelectedItems([])
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete activity logs")
    },
  })

  // Export mutations
  const exportPdfMutation = useMutation({
    mutationFn: ActivityLogService.exportPdf,
    onSuccess: (data) => {
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
    mutationFn: ActivityLogService.exportCsv,
    onSuccess: (csvData: Blob) => {
      try {
        const currentDate = new Date().toISOString().split("T")[0]
        downloadFile(csvData, `activity-log-${currentDate}.csv`)
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

  // Handle delete
  const handleDelete = (item: ActivityLog) => {
    setItemToDelete(item)
    setOpenDeleteModal(true)
  }

  const confirmDelete = () => {
    if (itemToDelete) {
      deleteMutation.mutate(itemToDelete.id)
    }
  }

  // Handle bulk delete
  const handleBulkDelete = (items: ActivityLog[]) => {
    if (items.length > 0) {
      const ids = items.map((item) => item.id)
      bulkDeleteMutation.mutate(ids)
    }
  }

  // Handle reset filters
  const handleReset = () => {
    setSearchQuery("")
    setSelectedBranch("")
    setSelectedModule("")
    setDateRange(undefined)
    setSelectedItems([])
    setCurrentPage(1)
  }

  // Handle pagination
  const onPaginationChange = (page: number) => {
    setCurrentPage(page)
  }

  const onRowCountChange = (rows: number) => {
    setRowsPerPage(rows)
    setCurrentPage(1)
  }

  const onSearchChange = (search: string) => {
    setSearchQuery(search)
    setCurrentPage(1)
  }

  // Define columns (removed select column as DataTableV2 handles it)
  const columns: ColumnDefinition<ActivityLog>[] = [
    {
      id: "timestamp",
      header: "Timestamp",
      accessorKey: "created_at",
      enableSorting: true,
      cell: (row) => format(new Date(row.created_on), "MMM dd, yyyy, HH:mm a"),
    },
    {
      id: "user",
      header: "User",
      accessorKey: "username",
      enableSorting: true,
    },
    {
      id: "branch",
      header: "Branch",
      accessorKey: "branch_name",
      enableSorting: true,
    },
    {
      id: "module",
      header: "Module",
      accessorKey: "module",
      enableSorting: true,
    },
    {
      id: "activity",
      header: "Activity",
      accessorKey: "activity",
      enableSorting: true,
    },
    {
      id: "description",
      header: "Description",
      accessorKey: "description",
      enableSorting: true,
      cell: (row) => (
        <div className="max-w-xs truncate" title={row.description}>
          {row.description}
        </div>
      ),
    },
  ]

  // Define filters for DataTableV2
  const tableFilters: FilterDefinition[] = [
    {
      id: "branch",
      label: "Branch",
      type: "select",
      placeholder: "Select...",
      options:
        branchesData?.data.branches.map((branch) => ({
          label: branch.name,
          value: branch.id,
        })) || [],
    },
    {
      id: "module",
      label: "Module",
      type: "select",
      placeholder: "Select...",
      options:
        modulesData?.data.module.map((module) => ({
          label: module.name,
          value: module.name,
        })) || [],
    },
    {
      id: "dateRange",
      label: "Date range",
      type: "dateRange",
      placeholder: "mm / dd / yyyy - mm / dd / yyyy",
    },
  ]

  const search: SearchDefinition = {
    title: "Search",
    placeholder: "Search user...",
    enableSearch: true,
  }

  // Action buttons for individual rows
  const actionButtons = [
    {
      label: "Delete",
      icon: <TrashIcon className="h-4 w-4 text-destructive" />,
      onClick: handleDelete,
    },
  ]

  // Bulk action buttons
  const bulkActionButtons: BulkActionButton<ActivityLog>[] = [
    {
      label: "Archive selected",
      icon: <ArchiveIcon className="h-4 w-4" />,
      onClick: handleBulkDelete,
      variant: "outline",
    },
    {
      label: "Reset",
      icon: <XIcon className="h-4 w-4" />,
      onClick: handleReset,
      variant: "outline",
    },
  ]

  // Handle exports
  const handlePdfExport = () => {
    exportPdfMutation.mutate()
  }

  const handleCsvExport = () => {
    exportCsvMutation.mutate()
  }

  
  const handleSort = (column: string, sort: string) => {
    setColumnSort(column)
    setSortQuery(sort)
  }

  return (
    <>
      <DataTableV2
        totalCount={activityLogsData?.data.pagination.total_items ?? 0}
        perPage={activityLogsData?.data.pagination.per_page ?? 10}
        pageNumber={activityLogsData?.data.pagination.current_page ?? 1}
        onPaginationChange={onPaginationChange}
        onRowCountChange={onRowCountChange}
        title="System Activity"
        subtitle="Track user actions, system changes, and security events across the application"
        data={activityLogsData?.data.logs ?? []}
        columns={columns}
        filters={tableFilters}
        search={search}
        actionButtons={actionButtons}
        bulkActionButtons={bulkActionButtons}
        enableSelection={true}
        selectedItems={selectedItems}
        onSelectionChange={setSelectedItems}
        onLoading={isLoading || isFetching || deleteMutation.isPending || bulkDeleteMutation.isPending}
        idField="id"
        enableNew={false}
        enablePdfExport={true}
        enableCsvExport={true}
        enableFilter={true}
        onResetTable={false}
        onSearchChange={onSearchChange}
        onPdfExport={handlePdfExport}
        onCsvExport={handleCsvExport}
        onSort={handleSort}
      />

      <DeleteConfirmationDialog
        isOpen={openDeleteModal}
        onClose={() => {
          setItemToDelete(null)
          setOpenDeleteModal(false)
        }}
        onConfirm={confirmDelete}
        title="Delete Activity Log"
        description={`Are you sure you want to delete this activity log entry? This action cannot be undone.`}
        itemName={itemToDelete?.description ?? "No Item Selected"}      
      />
    </>
  )
}