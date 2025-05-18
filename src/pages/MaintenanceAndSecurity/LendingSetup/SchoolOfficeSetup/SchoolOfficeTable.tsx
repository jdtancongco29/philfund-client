"use client"

import { useState } from "react"
import { DataTable, type SearchDefinition, type ColumnDefinition, type FilterDefinition } from "@/components/data-table/data-table"
import { AddDivisionDialog } from "./AddSchoolOfficeDialog"
// import { AddDistrictDialog } from "./AddDistrictDialog"

interface SchoolOffice {
    id: string
    districtCode: React.ReactNode
    divisionCode: React.ReactNode
    schoolCode: string
    schoolName: string
}

export function SchoolOfficeTable() {
    const [addDialogOpen, setAddDialogOpen] = useState(false)
    const [schoolOffices, setSchooOffices] = useState<SchoolOffice[]>([
        {
            id: "1",
            districtCode: "DIST1",
            divisionCode: "BUKIDNON",
            schoolCode: "SCHL1",
            schoolName: "School 1",
        },
    ])

    // Define columns
    const columns: ColumnDefinition<SchoolOffice>[] = [
        {
            id: "districtCode",
            header: "Division Code",
            accessorKey: "districtCode",
            enableSorting: true,
        },
        {
            id: "divisionCode",
            header: "Division Code",
            accessorKey: "divisionCode",
            enableSorting: true,
        },
        {
            id: "schoolCode",
            header: "School Code",
            accessorKey: "schoolCode",
            enableSorting: true,
        },
        {
            id: "schoolName",
            header: "School Name",
            accessorKey: "schoolName",
            enableSorting: true,
        }
    ]

    // Define filters
    const filters: FilterDefinition[] = []

    const search: SearchDefinition = {
        title: "Search",
        placeholder: "Search School/Office",
        enableSearch: true,
    };

    // Handle edit
    const handleEdit = (schoolOffice: SchoolOffice) => {
        console.log("Edit School/Office", schoolOffice)
        // Open edit modal or navigate to edit page
    }

    // Handle delete
    const handleDelete = (schoolOffice: SchoolOffice) => {
        console.log("Delete School/Office", schoolOffice)
        // Show confirmation dialog and delete if confirmed
        if (confirm(`Are you sure you want to delete this School/Office?`)) {
        setSchooOffices(schoolOffices.filter((d) => d.id !== schoolOffice.id))
        }
    }

    // Handle new
    const handleNew = () => {
        setAddDialogOpen(true)
        console.log("Create new School/Office")
        // Open create modal or navigate to create page
    }

    const borrowerGroups = [
        { label: "PHILFUND", value: "PHILFUND" },
        { label: "DEPED", value: "DEPED" },
        { label: "PRIVATE", value: "PRIVATE" },
        { label: "BUKIDNON", value: "BUKIDNON" },
    ]
    const handleAddSchoolOffice = (values: { districtCode: React.ReactNode, divisionCode: React.ReactNode, schoolName: string, schoolCode: string}) => {
        const newSchoolOffices = {
            id: Date.now().toString(),
            ...values,
        }
        setSchooOffices([...schoolOffices, newSchoolOffices])
        setAddDialogOpen(false)
    }
    return (
        <>
            <DataTable
                title="School List"
                subtitle="Manage existing borrower districts"
                data={schoolOffices}
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
                onSubmit={handleAddSchoolOffice}
                borrowerGroups={borrowerGroups}
            />
        </>
    )
}