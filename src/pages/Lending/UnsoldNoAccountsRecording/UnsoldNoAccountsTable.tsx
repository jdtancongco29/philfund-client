"use client"

import { useCallback, useState } from "react"
import type { SearchDefinition, ColumnDefinition, FilterDefinition } from "@/components/data-table/data-table"
import type { UnsoldNoAccountsRecord } from "./Service/UnsoldNoAccountsTypes"
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import UnsoldNoAccountsService from "./Service/UnsoldNoAccountsService"
import { DataTableV2 } from "@/components/data-table/data-table-v2"
import { UnsoldNoAccountsDialog } from "./Dialog/UnsoldNoAccountsDialog"
import { PencilIcon, TrashIcon, PrinterIcon } from "lucide-react"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"
import { toast } from "sonner"
import { downloadFile } from "@/lib/utils"
import type { ModulePermissionProps } from "../../MaintenanceAndSecurity/Security/UserPermissions/Service/PermissionsTypes"

export function UnsoldNoAccountsTable({ canAdd, canEdit, canDelete, canExport }: ModulePermissionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<UnsoldNoAccountsRecord | null>(null)
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
    data: unsoldRecords,
  } = useQuery({
    queryKey: ["unsold-no-accounts-table", currentPage, rowsPerPage, searchQuery, columnSort, sortQuery],
    queryFn: () =>
      UnsoldNoAccountsService.getAllUnsoldNoAccountsRecords(
        currentPage,
        rowsPerPage,
        searchQuery,
        columnSort,
        sortQuery,
      ),
    staleTime: Number.POSITIVE_INFINITY,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  })

  const deletionHandler = useMutation({
    mutationFn: (uuid: string) => {
      return UnsoldNoAccountsService.deleteUnsoldNoAccountsRecord(uuid)
    },
    onSuccess: () => {
      toast.success("Record deleted successfully")
      const shouldGoToPreviousPage = unsoldRecords?.data.records.length === 1 && currentPage > 1

      if (shouldGoToPreviousPage) {
        setCurrentPage((prev) => prev - 1)
      }

      queryClient.invalidateQueries({
        queryKey: ["unsold-no-accounts-table"],
        exact: false,
      })
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete record")
    },
  })

  const exportPdfMutation = useMutation({
    mutationFn: UnsoldNoAccountsService.exportPdf,
    onSuccess: (data) => {
      const newTab = window.open(data.data.url, "_blank")
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
    mutationFn: UnsoldNoAccountsService.exportCsv,
    onSuccess: (csvData: Blob) => {
      try {
        const currentDate = new Date().toISOString().split("T")[0]
        downloadFile(csvData, `unsold-no-accounts-${currentDate}.csv`)
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

  const columns: ColumnDefinition<UnsoldNoAccountsRecord>[] = [
    {
      id: "date",
      header: "Date",
      accessorKey: "date",
      enableSorting: true,
    },
    {
      id: "name",
      header: "Name",
      accessorKey: "name",
      enableSorting: true,
    },
    {
      id: "card_type",
      header: "Card Type",
      accessorKey: "card_type",
      enableSorting: true,
    },
    {
      id: "category",
      header: "Category",
      accessorKey: "category",
      enableSorting: true,
    },
    {
      id: "amount",
      header: "Amount",
      accessorKey: "amount",
      enableSorting: true,
      cell: (row) => `₱${row.amount.toLocaleString()}`,
    },
  ]

  const filters: FilterDefinition[] = []

  const search: SearchDefinition = {
    title: "Search",
    placeholder: "Search user...",
    enableSearch: true,
  }

  const handleEdit = (item: UnsoldNoAccountsRecord) => {
    setSelectedItem(item)
    setIsEditing(true)
    setIsDialogOpen(true)
  }

  const handleDelete = async () => {
    if (selectedItem) {
      deletionHandler.mutate(selectedItem.id)
    }
  }

  const handleNew = () => {
    setSelectedItem(null)
    setIsEditing(false)
    setIsDialogOpen(true)
  }

  const handlePdfExport = () => {
    exportPdfMutation.mutate()
  }

  const handleCsvExport = () => {
    exportCsvMutation.mutate()
  }

  const handlePrint = (item: UnsoldNoAccountsRecord) => {
    toast.info(`Printing record for ${item.name}`)
  }

  const actionButtons = []

  actionButtons.push({
    label: "Print",
    icon: <PrinterIcon className="h-4 w-4" />,
    onClick: handlePrint,
  })

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
      onClick: (record: UnsoldNoAccountsRecord) => {
        setSelectedItem(record)
        setOpenDeleteModal(true)
      },
    })
  }

  const handleSort = (column: string, sort: string) => {
    setColumnSort(column)
    setSortQuery(sort)
  }

  return (
    <>
      <DataTableV2
        totalCount={unsoldRecords?.data.pagination.total_items ?? 0}
        perPage={unsoldRecords?.data.pagination.per_page ?? 10}
        pageNumber={unsoldRecords?.data.pagination.current_page ?? 1}
        onPaginationChange={onPaginationChange}
        onRowCountChange={onRowCountChange}
        title="Unsold/No Accounts Recording"
        subtitle="Record unsold accounts and generate acknowledgments"
        data={unsoldRecords?.data.records ?? []}
        columns={columns}
        filters={filters}
        search={search}
        actionButtons={actionButtons}
        onLoading={isPending || isFetching || deletionHandler.isPending}
        onNew={handleNew}
        idField="id"
        enableNew={canAdd}
        newButtonText="New"
        enablePdfExport={canExport}
        enableCsvExport={canExport}
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
          setSelectedItem(null)
          setOpenDeleteModal(false)
        }}
        onConfirm={handleDelete}
        title="Delete Record"
        description={`Are you sure you want to delete this unsold/no accounts record? This action cannot be undone.`}
        itemName={selectedItem?.name ?? "No Record Selected"}
      />

      <UnsoldNoAccountsDialog
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

          queryClient.invalidateQueries({
            queryKey: ["unsold-no-accounts-table", currentPage, rowsPerPage, searchQuery],
            exact: true,
          })
        }}
      />
    </>
  )
}
