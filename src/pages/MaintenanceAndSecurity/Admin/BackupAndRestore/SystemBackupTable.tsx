"use client"

import { useCallback, useState } from "react"
import type { SearchDefinition, ColumnDefinition, FilterDefinition } from "@/components/data-table/data-table"
import type { SystemBackup } from "./Service/SystemBackupTypes"
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import SystemBackupService from "./Service/SystemBackupService"
import { DataTableV2 } from "@/components/data-table/data-table-v2"
import { CreateBackupDrawer } from "./CreateBackupDrawer"
import { DownloadIcon, RotateCcwIcon, TrashIcon } from "lucide-react"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"
import { RestoreConfirmationDialog } from "./RestoreConfirmationDialog"
import { toast } from "sonner"
import { downloadFile } from "@/lib/utils"

export function SystemBackupTable() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<SystemBackup | null>(null)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [openRestoreModal, setOpenRestoreModal] = useState(false)
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
    setCurrentPage(1)
  }, [])

  const onSearchChange = useCallback((search: string) => {
    setSearchQuery(search || null)
    setCurrentPage(1)
  }, [])

  const {
    isPending,
    error,
    isFetching,
    data: backups,
  } = useQuery({
    queryKey: ["system-backup-table", currentPage, rowsPerPage, searchQuery, columnSort, sortQuery],
    queryFn: () => SystemBackupService.getAllBackups(currentPage, rowsPerPage, searchQuery, columnSort, sortQuery),
    staleTime: Number.POSITIVE_INFINITY,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  })

  // Delete backup mutation
  const deletionHandler = useMutation({
    mutationFn: (uuid: string) => {
      return SystemBackupService.deleteBackup(uuid)
    },
    onSuccess: () => {
      toast.success("Backup deleted successfully")
      const shouldGoToPreviousPage = backups?.data.backups.length === 1 && currentPage > 1

      if (shouldGoToPreviousPage) {
        setCurrentPage((prev) => prev - 1)
        setTimeout(() => {
          queryClient.invalidateQueries({
            queryKey: ["system-backup-table"],
            exact: false,
          })
        }, 0)
      } else {
        queryClient.invalidateQueries({
          queryKey: ["system-backup-table", currentPage, rowsPerPage, searchQuery],
          exact: true,
        })
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete backup")
    },
  })

  // Download backup mutation
  const downloadMutation = useMutation({
    mutationFn: SystemBackupService.downloadBackup,
    onSuccess: (data: Blob, variables) => {
      try {
        downloadFile(data, variables.filename)
        toast.success("Backup downloaded successfully")
      } catch (error) {
        toast.error("Failed to process backup file")
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to download backup")
    },
  })

  // Restore backup mutation
  const restoreMutation = useMutation({
    mutationFn: ({ id, password }: { id: string; password: string }) => SystemBackupService.restoreBackup(id, password),
    onSuccess: () => {
      toast.success("Backup restored successfully")
      setOpenRestoreModal(false)
      setSelectedItem(null)
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to restore backup")
    },
  })

  if (error) return "An error has occurred: " + error.message

  // Define columns
  const columns: ColumnDefinition<SystemBackup>[] = [
    {
      id: "filename",
      header: "Backup File",
      accessorKey: "filename",
      enableSorting: true,
    },
    {
      id: "created_at",
      header: "Created On",
      accessorKey: "created_at",
      enableSorting: true,
      cell: (row) => {
        const date = new Date(row.created_at)
        return date.toLocaleString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      },
    },
    {
      id: "created_by",
      header: "Created By",
      accessorKey: "created_by",
      enableSorting: true,
    },
    {
      id: "size",
      header: "Size",
      accessorKey: "size",
      enableSorting: true,
      cell: (row) => {
        const sizeInMB = (row.size / (1024 * 1024)).toFixed(0)
        return `${sizeInMB} MB`
      },
    },
  ]

  // Define filters
  const filters: FilterDefinition[] = []

  const search: SearchDefinition = {
    title: "Search",
    placeholder: "Search backups...",
    enableSearch: true,
  }

  // Handle actions
  const handleDownload = (item: SystemBackup) => {
    downloadMutation.mutate({ id: item.id, filename: item.filename })
  }

  const handleRestore = (item: SystemBackup) => {
    setSelectedItem(item)
    setOpenRestoreModal(true)
  }

  const handleDelete = async () => {
    if (selectedItem) {
      deletionHandler.mutate(selectedItem.id)
    }
  }

  const handleCreateBackup = () => {
    setIsDrawerOpen(true)
  }

  const handleSort = (column: string, sort: string) => {
    setColumnSort(column)
    setSortQuery(sort)
  }

  // Define action buttons
  const actionButtons = [
    {
      label: "Download",
      icon: <DownloadIcon className="h-4 w-4" />,
      onClick: handleDownload,
    },
    {
      label: "Restore",
      icon: <RotateCcwIcon className="h-4 w-4" />,
      onClick: handleRestore,
    },
    {
      label: "Delete",
      icon: <TrashIcon className="h-4 w-4 text-destructive" />,
      onClick: (backup: SystemBackup) => {
        setSelectedItem(backup)
        setOpenDeleteModal(true)
      },
    },
  ]

  return (
    <>
      <DataTableV2
        totalCount={backups?.data.pagination.total_items ?? 0}
        perPage={backups?.data.pagination.per_page ?? 10}
        pageNumber={backups?.data.pagination.current_page ?? 1}
        onPaginationChange={onPaginationChange}
        onRowCountChange={onRowCountChange}
        title="System Backup & Restore"
        subtitle=""
        data={backups?.data.backups ?? []}
        columns={columns}
        filters={filters}
        search={search}
        actionButtons={actionButtons}
        onLoading={isPending || isFetching || deletionHandler.isPending || downloadMutation.isPending}
        onNew={handleCreateBackup}
        idField="id"
        enableNew={true}
        newButtonText="Create a Backup"
        enablePdfExport={false}
        enableCsvExport={false}
        enableFilter={false}
        onResetTable={false}
        onSearchChange={onSearchChange}
        onSort={handleSort}
        />
        <div className="mt-6">
            <p className="text-base"><span className="font-bold">Note: </span>The backup process will not affect your current database or system operation.</p>
        </div>

      <DeleteConfirmationDialog
        isOpen={openDeleteModal}
        onClose={() => {
          setSelectedItem(null)
          setOpenDeleteModal(false)
        }}
        onConfirm={handleDelete}
        title="Delete Backup"
        description={`Are you sure you want to delete the backup '${selectedItem?.filename}'? This action cannot be undone.`}
        itemName={selectedItem?.filename ?? "No Backup Selected"}
      />

      <RestoreConfirmationDialog
        isOpen={openRestoreModal}
        onClose={() => {
          setSelectedItem(null)
          setOpenRestoreModal(false)
        }}
        onConfirm={(password: string) => {
          if (selectedItem) {
            restoreMutation.mutate({ id: selectedItem.id, password })
          }
        }}
        isLoading={restoreMutation.isPending}
        backupName={selectedItem?.filename ?? ""}
      />

      <CreateBackupDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        onSuccess={() => {
          setIsDrawerOpen(false)
          queryClient.invalidateQueries({
            queryKey: ["system-backup-table", currentPage, rowsPerPage, searchQuery],
            exact: true,
          })
        }}
      />
    </>
  )
}
