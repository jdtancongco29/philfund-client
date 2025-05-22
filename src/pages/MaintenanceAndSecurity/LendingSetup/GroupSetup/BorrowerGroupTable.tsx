"use client"

import { useState } from "react"
import { DataTable, type SearchDefinition, type ColumnDefinition, type FilterDefinition } from "@/components/data-table/data-table"
import { AddGroupDialog } from "./AddGroupDialog"
import { BorrowGroup } from "./Service/GroupSetupTypes"
import { useQuery } from "@tanstack/react-query"
import GroupSetupService from "./Service/GroupSetupService"

export function BorrowerGroupTable() {
  const [addDialogOpen, setAddDialogOpen] = useState(false)

  const { isPending, error, data: borrowerGroups } = useQuery({
    queryKey: ['borrower-group-table'],
    queryFn: () => GroupSetupService.getAllGroups()
  })

  if (isPending) return 'Loading...'

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
  const handleEdit = (borrowerGroup: BorrowGroup) => {
    console.log("Edit borrower group", borrowerGroup)
    // Open edit modal or navigate to edit page
  }

  // Handle delete
  const handleDelete = (borrowerGroup: BorrowGroup) => {
    console.log("Delete borrower group", borrowerGroup)
  }

  // Handle new
  const handleNew = () => {
    setAddDialogOpen(true)
  }

  const onSubmit = () => {
    setAddDialogOpen(false)
  }


  return (
    <>
      <DataTable
        title="Borrower Groups"
        subtitle=""
        data={borrowerGroups.data.groups}
        columns={columns}
        filters={filters}
        search={search}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onNew={handleNew}
        idField="id"
        enableNew={true}
        enablePdfExport={true}
        enableCsvExport={true}
        enableFilter={false}
      />
      <AddGroupDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} onSubmit={onSubmit} />
    </>
  )
}
