"use client"

import { useState } from "react"
import type { SearchDefinition, ColumnDefinition, FilterDefinition } from "@/components/data-table/data-table"
import { DivisionDialogForm } from "./DivisionFormDialog"
import type { Division } from "./Service/DivisionSetupTypes"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import DivisionSetupService from "./Service/DivisionSetupService"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"
import { DataTableV2 } from "@/components/data-table/data-table-v2"
import { toast } from "sonner"
import { downloadFile } from "@/lib/utils"
import { ModulePermissionProps } from "../../Security/UserPermissions/Service/PermissionsTypes"
import { PencilIcon, TrashIcon } from "lucide-react"

export function DivisionTable({
  canAdd,
  canEdit,
  canDelete,
  canExport,
}: ModulePermissionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Division | null>(null)
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
    data: divisions,
  } = useQuery({
    queryKey: ["division-table", currentPage, rowsPerPage, searchQuery],
    queryFn: () => DivisionSetupService.getAllDivisions(currentPage, rowsPerPage, searchQuery),
    staleTime: 1000 * 60 * 5,
  })

  const deletionHandler = useMutation({
    mutationFn: (uuid: string) => {
      return DivisionSetupService.deleteDivision(uuid)
    },
  })

  // Export mutations
  const exportPdfMutation = useMutation({
    mutationFn: DivisionSetupService.exportPdf,
    onSuccess: (data) => {
      console.log(data);

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
    mutationFn: DivisionSetupService.exportCsv,
    onSuccess: (csvData: Blob) => {
      try {
        const currentDate = new Date().toISOString().split("T")[0]
        downloadFile(csvData, `Divisions ${currentDate}.csv`)
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
  const columns: ColumnDefinition<Division>[] = [
    {
      id: "group",
      header: "Group",
      accessorKey: "group",
      cell: (row) => <div><p className="font-bold">{row.group?.code ?? row.group.name}</p>
        <p className="text-xs">{row.group.name}</p>
      </div>,
      enableSorting: true,
    },
    {
      id: "code",
      header: "Division Code",
      accessorKey: "code",
      enableSorting: true,
    },
    {
      id: "name",
      header: "Division Name",
      accessorKey: "name",
      enableSorting: true,
    },
  ]

  // Define filters
  const filters: FilterDefinition[] = []

  const search: SearchDefinition = {
    title: "Search",
    placeholder: "Search Division",
    enableSearch: true,
  }

  // Handle edit
  const handleEdit = (item: Division) => {
    setSelectedItem(item)
    setIsEditing(true)
    setIsDialogOpen(true)
  }

  // Handle delete
  const handleDelete = async () => {
    setOpenDeleteModal(false)
    if (selectedItem) {
      try {
        if (divisions?.data.division.length == 1) {
          setResetTable(true)
        }
        await deletionHandler.mutateAsync(selectedItem.id)
        queryClient.invalidateQueries({ queryKey: ["division-table"] })
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

    // Define action buttons
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
      onClick: (branch: Division) => {
        setSelectedItem(branch)
        setOpenDeleteModal(true)
      },
    })
  }

  return (
    <>
      <DataTableV2
        totalCount={divisions?.data.pagination.total_items ?? 1}
        perPage={divisions?.data.pagination.per_page ?? 10}
        pageNumber={divisions?.data.pagination.current_page ?? 10}
        onPaginationChange={onPaginationChange}
        onRowCountChange={onRowCountChange}
        title="Division Setup"
        subtitle=""
        data={divisions?.data.division ?? []}
        columns={columns}
        filters={filters}
        search={search}
        actionButtons={actionButtons}
        onLoading={isPending || deletionHandler.isPending}
        onNew={handleNew}
        idField="id"
        enableNew={canAdd}
        enablePdfExport={canExport}
        enableCsvExport={canExport}
        enableFilter={false}
        onResetTable={resetTable}
        onSearchChange={onSearchChange}
        onPdfExport={exportPdfMutation.mutate}
        onCsvExport={exportCsvMutation.mutate}
      />
      <DeleteConfirmationDialog
        isOpen={openDeleteModal}
        onClose={() => {
          setSelectedItem(null)
          setOpenDeleteModal(false)
          setCurrentPage(1)
        }}
        onConfirm={handleDelete}
        title="Delete Division"
        description="Are you sure you want to delete the division '{name}'? This action cannot be undone."
        itemName={selectedItem?.name ?? "No division selected"}
      />
      <DivisionDialogForm
        item={selectedItem}
        open={isDialogOpen}
        onCancel={() => {
          setSelectedItem(null)
        }}
        isEditing={isEditing}
        onOpenChange={() => {
          setIsDialogOpen(false);
          setIsEditing(false);
          setSelectedItem(null);
        }}
        onSubmit={onSubmit}
      />
    </>
  )
}
