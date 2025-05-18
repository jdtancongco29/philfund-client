"use client"

import { useState } from "react"
import { DataTable, type SearchDefinition, type ColumnDefinition, type FilterDefinition } from "@/components/data-table/data-table"
import { AddDivisionDialog } from "./AddDivisionDialog"

interface Division {
    id: string
    borrowerGroupCode: React.ReactNode
    divisionCode: string
    divisionName: string
}

export function DivisionTable() {
    const [addDialogOpen, setAddDialogOpen] = useState(false)
    const [divisions, setDivisions] = useState<Division[]>([
        {
            id: "1",
            borrowerGroupCode: "Group A",
            divisionCode: "PHILFUND",
            divisionName: "PhilFund Staff",
        },
    ])

    // Define columns
    const columns: ColumnDefinition<Division>[] = [
        {
            id: "borrowerGroupCode",
            header: "Group",
            accessorKey: "borrowerGroupCode",
            enableSorting: true,
        },
        {
            id: "divisionCode",
            header: "Division Code",
            accessorKey: "divisionCode",
            enableSorting: true,
        },
        {
            id: "divisionName",
            header: "Division Name",
            accessorKey: "divisionName",
            enableSorting: true,
        }
    ]

    // Define filters
    const filters: FilterDefinition[] = []

    const search: SearchDefinition = {
        title: "Search",
        placeholder: "Search Division",
        enableSearch: true,
    };

    // Handle edit
    const handleEdit = (division: Division) => {
        console.log("Edit division", division)
        // Open edit modal or navigate to edit page
    }

    // Handle delete
    const handleDelete = (division: Division) => {
        console.log("Delete division", division)
        // Show confirmation dialog and delete if confirmed
        if (confirm(`Are you sure you want to delete this division?`)) {
        setDivisions(divisions.filter((d) => d.id !== division.id))
        }
    }

    // Handle new
    const handleNew = () => {
        setAddDialogOpen(true)
        console.log("Create new classification")
        // Open create modal or navigate to create page
    }

    const borrowerGroups = [
        { label: "PHILFUND", value: "PHILFUND" },
        { label: "DEPED", value: "DEPED" },
        { label: "PRIVATE", value: "PRIVATE" },
        { label: "BUKIDNON", value: "BUKIDNON" },
    ]
    const handleAddDivision = (values: { borrowerGroupCode: string, divisionCode: string, divisionName: string }) => {
        const newDivision = {
            id: Date.now().toString(),
            ...values,
        }
        setDivisions([...divisions, newDivision])
        setAddDialogOpen(false)
    }
    return (
        <>
            <DataTable
                title="Division Setup"
                subtitle=""
                data={divisions}
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

            <AddDivisionDialog
                open={addDialogOpen}
                onOpenChange={setAddDialogOpen}
                onSubmit={handleAddDivision}
                borrowerGroups={borrowerGroups}
            />
        </>
    )
}