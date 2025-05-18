"use client"

import { useState } from "react"
import { DataTable, type SearchDefinition, type ColumnDefinition, type FilterDefinition } from "@/components/data-table/data-table"
import { AddDistrictDialog } from "./AddDistrictDialog"

interface District {
    id: string
    divisionCode: React.ReactNode
    districtCode: string
    districtName: string
}

export function DistrictTable() {
    const [addDialogOpen, setAddDialogOpen] = useState(false)
    const [districts, setDistricts] = useState<District[]>([
        {
            id: "1",
            divisionCode: "BUKIDNON",
            districtCode: "DIST1",
            districtName: "District 1",
        },
    ])

    // Define columns
    const columns: ColumnDefinition<District>[] = [
        {
            id: "divisionCode",
            header: "Division Code",
            accessorKey: "divisionCode",
            enableSorting: true,
        },
        {
            id: "districtCode",
            header: "District Code",
            accessorKey: "districtCode",
            enableSorting: true,
        },
        {
            id: "districtName",
            header: "District Name",
            accessorKey: "districtName",
            enableSorting: true,
        }
    ]

    // Define filters
    const filters: FilterDefinition[] = []

    const search: SearchDefinition = {
        title: "Search",
        placeholder: "Search District",
        enableSearch: true,
    };

    // Handle edit
    const handleEdit = (district: District) => {
        console.log("Edit district", district)
        // Open edit modal or navigate to edit page
    }

    // Handle delete
    const handleDelete = (district: District) => {
        console.log("Delete district", district)
        // Show confirmation dialog and delete if confirmed
        if (confirm(`Are you sure you want to delete this district?`)) {
        setDistricts(districts.filter((d) => d.id !== district.id))
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
    const handleAddDistrict = (values: { divisionCode: React.ReactNode, districtCode: string, districtName: string }) => {
        const newDistrict = {
            id: Date.now().toString(),
            ...values,
        }
        setDistricts([...districts, newDistrict])
        setAddDialogOpen(false)
    }
    return (
        <>
            <DataTable
                title="Borrower Districts"
                subtitle="Manage existing borrower districts"
                data={districts}
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

            <AddDistrictDialog
                open={addDialogOpen}
                onOpenChange={setAddDialogOpen}
                onSubmit={handleAddDistrict}
                borrowerGroups={borrowerGroups}
            />
        </>
    )
}