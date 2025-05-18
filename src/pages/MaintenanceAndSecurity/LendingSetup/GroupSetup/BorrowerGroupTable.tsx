"use client"

import { useState } from "react"
import { DataTable, type SearchDefinition, type ColumnDefinition, type FilterDefinition } from "@/components/data-table/data-table"
import { AddGroupDialog } from "./AddGroupDialog"

interface BorrowerGroup {
    id: string
    code: string
    name: string
    referenceNumber?: string
}

export function BorrowerGroupTable() {
    const [addDialogOpen, setAddDialogOpen] = useState(false)
    const [borrowerGroups, setBorrowerGroup] = useState<BorrowerGroup[]>([
        {
            id: "1",
            code: "PHILFUND",
            name: "PhilFund Staff",
        },
        {
            id: "2",
            code: "DEPED",
            name: "Department of Education",
        },
        {
            id: "3",
            code: "PRIVATE",
            name: "Private Sector",
        },
    ])

    // Define columns
    const columns: ColumnDefinition<BorrowerGroup>[] = [
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
    const handleEdit = (borrowerGroup: BorrowerGroup) => {
        console.log("Edit borrower group", borrowerGroup)
        // Open edit modal or navigate to edit page
    }

    // Handle delete
    const handleDelete = (borrowerGroup: BorrowerGroup) => {
        console.log("Delete borrower group", borrowerGroup)
        // Show confirmation dialog and delete if confirmed
        if (confirm(`Are you sure you want to delete borrower group?`)) {
        setBorrowerGroup(borrowerGroups.filter((d) => d.id !== borrowerGroup.id))
        }
    }

    // Handle new
    const handleNew = () => {
        setAddDialogOpen(true)
        console.log("Create new group")
        // Open create modal or navigate to create page
    }

    const handleAddGroup = (values: { code: string; name: string }) => {
        const newGroup = {
        id: Date.now().toString(),
        ...values,
        }
        setBorrowerGroup([...borrowerGroups, newGroup])
        setAddDialogOpen(false)
    }

    return (
        <>
            <DataTable
                title="Borrower Groups"
                subtitle=""
                data={borrowerGroups}
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
            <AddGroupDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} onSubmit={handleAddGroup}/>
        </>
    )
}