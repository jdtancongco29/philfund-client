"use client"

import { useCallback, useState } from "react"
import type { ColumnDefinition } from "@/components/data-table/data-table"
import type { CheckEncashment } from "./Service/CheckEncashmentTypes"
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import CheckEncashmentService from "./Service/CheckEncashmentService"
import { DataTableV2 } from "@/components/data-table/data-table-v2"
import { CheckEncashmentDialog } from "./Dialog/CheckEncashmentDialog"
import { PencilIcon, TrashIcon } from "lucide-react"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"
import { toast } from "sonner"
import { downloadFile } from "@/lib/utils"
import type { ModulePermissionProps } from "../../MaintenanceAndSecurity/Security/UserPermissions/Service/PermissionsTypes"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { CalendarIcon } from "lucide-react"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
// import { cn } from "@/lib/utils"

export function CheckEncashmentTable({ canAdd, canEdit, canDelete, canExport }: ModulePermissionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<CheckEncashment | null>(null)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchQuery, _setSearchQuery] = useState<string>("")
  const [dateFrom, _setDateFrom] = useState<Date | undefined>(undefined)
  const [dateTo, _setDateTo] = useState<Date | undefined>(undefined)
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

  const {
    isPending,
    error,
    isFetching,
    data: checkEncashments,
  } = useQuery({
    queryKey: [
      "check-encashment-table",
      currentPage,
      rowsPerPage,
      searchQuery,
      dateFrom,
      dateTo,
      columnSort,
      sortQuery,
    ],
    queryFn: () =>
      CheckEncashmentService.getAllCheckEncashments(
        currentPage,
        rowsPerPage,
        searchQuery || null,
        dateFrom ? format(dateFrom, "yyyy-MM-dd") : null,
        dateTo ? format(dateTo, "yyyy-MM-dd") : null,
        columnSort,
        sortQuery,
      ),
    staleTime: Number.POSITIVE_INFINITY,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  })

  const deletionHandler = useMutation({
    mutationFn: (uuid: string) => {
      return CheckEncashmentService.deleteCheckEncashment(uuid)
    },
    onSuccess: () => {
      toast.success("Check encashment deleted successfully")
      const shouldGoToPreviousPage = checkEncashments?.data.encashments.length === 1 && currentPage > 1

      if (shouldGoToPreviousPage) {
        setCurrentPage((prev) => prev - 1)
      }

      queryClient.invalidateQueries({
        queryKey: ["check-encashment-table"],
        exact: false,
      })
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete check encashment")
    },
  })

  const exportPdfMutation = useMutation({
    mutationFn: CheckEncashmentService.exportPdf,
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
    mutationFn: CheckEncashmentService.exportCsv,
    onSuccess: (csvData: Blob) => {
      try {
        const currentDate = new Date().toISOString().split("T")[0]
        downloadFile(csvData, `check-encashment-${currentDate}.csv`)
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

  const columns: ColumnDefinition<CheckEncashment>[] = [
    {
      id: "date",
      header: "Date",
      accessorKey: "date",
      enableSorting: true,
    },
    {
      id: "check_no",
      header: "Check No.",
      accessorKey: "check_no",
      enableSorting: true,
    },
    {
      id: "payee",
      header: "Payee",
      accessorKey: "payee",
      enableSorting: true,
    },
    {
      id: "amount",
      header: "Amount",
      accessorKey: "amount",
      enableSorting: true,
      cell: (row) => `₱${row.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
    },
    {
      id: "processing_fee",
      header: "1% amount",
      accessorKey: "processing_fee",
      enableSorting: true,
      cell: (row) => `₱${row.processing_fee.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
    },
    {
      id: "net_amount",
      header: "Net Amount Received",
      accessorKey: "net_amount",
      enableSorting: true,
      cell: (row) => `₱${row.net_amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
    },
  ]

  const handleEdit = (item: CheckEncashment) => {
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

  // const handleReset = () => {
  //   setSearchQuery("")
  //   setDateFrom(undefined)
  //   setDateTo(undefined)
  //   setCurrentPage(1)
  // }

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
      onClick: (encashment: CheckEncashment) => {
        setSelectedItem(encashment)
        setOpenDeleteModal(true)
      },
    })
  }

  const handleSort = (column: string, sort: string) => {
    setColumnSort(column)
    setSortQuery(sort)
  }

  return (
    <div className="space-y-4">
      {/* Data Table */}
      <DataTableV2
        totalCount={checkEncashments?.data.pagination.total_items ?? 0}
        perPage={checkEncashments?.data.pagination.per_page ?? 10}
        pageNumber={checkEncashments?.data.pagination.current_page ?? 1}
        onPaginationChange={onPaginationChange}
        onRowCountChange={onRowCountChange}
        title="Check Encashment"
        subtitle=""
        data={checkEncashments?.data.encashments ?? []}
        columns={columns}
        filters={[
        {
          id: "date_from",
          label: "Date From",
          type: "date",
        },
        {
          id: "date_to",
          label: "Date To",
          type: "date"
        }]}
        search={{ title: "Keywords", placeholder: "Search check number", enableSearch: true }}
        actionButtons={actionButtons}
        onLoading={isPending || isFetching || deletionHandler.isPending}
        onNew={handleNew}
        idField="id"
        enableNew={canAdd}
        enablePdfExport={canExport}
        enableCsvExport={canExport}
        enableFilter={true}
        onResetTable={false}
        onSearchChange={() => {}}
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
        title="Delete Check Encashment"
        description={`Are you sure you want to delete this check encashment record? This action cannot be undone.`}
        itemName={selectedItem?.check_no ?? "No Record Selected"}
      />

      <CheckEncashmentDialog
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
            queryKey: ["check-encashment-table"],
            exact: false,
          })
        }}
      />
    </div>
  )
}
