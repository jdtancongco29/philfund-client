"use client"

import { useState } from "react"
import { type SearchDefinition, type ColumnDefinition, type FilterDefinition } from "@/components/data-table/data-table"
import { GroupDialogForm } from "./GroupFormDialog"
import { BorrowGroup } from "./Service/GroupSetupTypes"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import GroupSetupService from "./Service/GroupSetupService"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"
import { DataTableV2 } from "@/components/data-table/data-table-v2"

export function BorrowerGroupTable() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<BorrowGroup | null>(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient()
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const [resetTable, setResetTable] = useState(false);

  const { isPending, error, data: borrowerGroups } = useQuery({
    queryKey: ['borrower-group-table', currentPage, rowsPerPage, searchQuery],
    queryFn: () => GroupSetupService.getAllGroups(currentPage, rowsPerPage, searchQuery),
    staleTime: Infinity
  })

  const deletionHandler = useMutation({
    mutationFn: (uuid: string) => {
      return GroupSetupService.deleteGroup(uuid);
    },
  })

  if (error) return 'An error has occurred: ' + error.message

  // Define columns
  const columns: ColumnDefinition<BorrowGroup>[] = [
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
  ]

  // Define filters
  const filters: FilterDefinition[] = []

  const search: SearchDefinition = {
    title: "Search",
    placeholder: "Search groups",
    enableSearch: true,
  };

  // Handle edit
  const handleEdit = (item: BorrowGroup) => {
    setSelectedItem(item);
    setIsEditing(true);
    setIsDialogOpen(true)
  }

  // Handle delete
  const handleDelete = async () => {
    setOpenDeleteModal(false);
    if (selectedItem) {
      try {
        if (borrowerGroups?.data.groups.length == 1) {
          setResetTable(true);
        }
        await deletionHandler.mutateAsync(selectedItem.id);
        queryClient.invalidateQueries({ queryKey: ['borrower-group-table'] })
        setSelectedItem(null);
        setResetTable(false);
      } catch (error) {
        console.log(error);
      }
    }
  }

  // Handle new
  const handleNew = () => {
    setIsDialogOpen(true)
  }

  const onSubmit = () => {
    setSelectedItem(null);
    setIsDialogOpen(false)
  }

  const onPaginationChange = (page: number) => {
    setCurrentPage(page);
  }

  const onRowCountChange = (row: number) => {
    setRowsPerPage(row);
  }

  const onSearchChange = (search: string) => {
    setSearchQuery(search);
  }


  return (
    <>
      <DataTableV2
        totalCount={borrowerGroups?.data.pagination.total_items ?? 1}
        perPage={borrowerGroups?.data.pagination.per_page ?? 10}
        pageNumber={borrowerGroups?.data.pagination.current_page ?? 10}
        onPaginationChange={onPaginationChange}
        onRowCountChange={onRowCountChange}
        title="Borrower Groups"
        subtitle=""
        data={borrowerGroups?.data.groups ?? []}
        columns={columns}
        filters={filters}
        search={search}
        onEdit={handleEdit}
        onLoading={isPending || deletionHandler.isPending}
        onDelete={(item) => {
          setOpenDeleteModal(true);
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
          setOpenDeleteModal(false);
          setCurrentPage(1);
        }}
        onConfirm={handleDelete}
        title="Delete Borrower Group"
        description="Are you sure you want to delete the Group '{name}'? This action cannot be undone."
        itemName={selectedItem?.name ?? "No group selected"}
      />
      <GroupDialogForm
        item={selectedItem}
        open={isDialogOpen}
        onCancel={() => {
          setSelectedItem(null);
        }}
        isEditing={isEditing}
        onOpenChange={() => {
          setIsDialogOpen(false);
          setIsEditing(false);
          setSelectedItem(null);
        }}
        onSubmit={onSubmit} />
    </>
  )
}
