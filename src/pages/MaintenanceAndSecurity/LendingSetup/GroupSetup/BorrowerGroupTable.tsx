"use client"

import { useState } from "react"
import { DataTable, type SearchDefinition, type ColumnDefinition, type FilterDefinition } from "@/components/data-table/data-table"
import { GroupDialogForm } from "./GroupFormDialog"
import { BorrowGroup } from "./Service/GroupSetupTypes"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import GroupSetupService from "./Service/GroupSetupService"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"

export function BorrowerGroupTable() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<BorrowGroup | null>(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient()

  const { isPending, error, data: borrowerGroups } = useQuery({
    queryKey: ['borrower-group-table'],
    queryFn: () => GroupSetupService.getAllGroups()
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
        await deletionHandler.mutateAsync(selectedItem.id);
        queryClient.invalidateQueries({ queryKey: ['borrower-group-table'] })
        setSelectedItem(null);
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


  return (
    <>
      <DataTable
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
      />
      <DeleteConfirmationDialog
        isOpen={openDeleteModal}
        onClose={() => setSelectedItem(null)}
        onConfirm={handleDelete}
        title="Delete Borrower Group"
        description="Are you sure you want to delete the department '{name}'? This action cannot be undone."
        itemName={selectedItem?.name ?? "No group selected"}
      />
      <GroupDialogForm item={selectedItem} open={isDialogOpen} onCancel={() => {
        setSelectedItem(null);
      }} isEditing={isEditing} onOpenChange={() => {
        setIsDialogOpen(false);
        setIsEditing(false);
      }} onSubmit={onSubmit} />
    </>
  )
}
