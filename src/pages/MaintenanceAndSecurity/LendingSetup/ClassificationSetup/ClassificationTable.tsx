"use client"

import { useState } from "react"
import { DataTable, type SearchDefinition, type ColumnDefinition, type FilterDefinition } from "@/components/data-table/data-table"
import { AddClassificationDialog } from "./AddClassificationDialog"

interface Classification {
    id: string
    group: string
    code: string
    name: string
    restructureEligibility: boolean
    bonusLoanEligibility: boolean
    referenceNumber?: string
}

export function ClassificationTable() {
    const [addDialogOpen, setAddDialogOpen] = useState(false)
    const [classifications, setClassifications] = useState<Classification[]>([
        {
            id: "1",
            group: "Group A",
            code: "PHILFUND",
            name: "PhilFund Staff",
            restructureEligibility: true,
            bonusLoanEligibility: false,
        },
        {
            id: "2",
            group: "Group A",
            code: "DEPED",
            name: "Department of Education",
            restructureEligibility: true,
            bonusLoanEligibility: true,
        },
        {
            id: "3",
            group: "Group A",
            code: "PRIVATE",
            name: "Private Sector",
            restructureEligibility: false,
            bonusLoanEligibility: true,
        },
        {
            id: "4",
            group: "Group A",
            code: "PRIVATE",
            name: "Private Sector",
            restructureEligibility: false,
            bonusLoanEligibility: true,
        },
        {
            id: "5",
            group: "Group A",
            code: "PRIVATE",
            name: "Private Sector",
            restructureEligibility: false,
            bonusLoanEligibility: true,
        },
        {
            id: "6",
            group: "Group A",
            code: "PRIVATE",
            name: "Private Sector",
            restructureEligibility: false,
            bonusLoanEligibility: true,
        },
        {
            id: "7",
            group: "Group A",
            code: "PRIVATE",
            name: "Private Sector",
            restructureEligibility: false,
            bonusLoanEligibility: true,
        }
    ])

    // Define columns
    const columns: ColumnDefinition<Classification>[] = [
        {
            id: "group",
            header: "Group",
            accessorKey: "group",
            enableSorting: true,
        },
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
        {
            id: "restructureEligibility",
            header: "Restructure Eligible",
            accessorKey: "restructureEligibility",
            displayCondition: [
                {
                    value: true,
                    label: "Yes",
                    className: "",
                },
                {
                    value: false,
                    label: "No",
                    className: "text-[var(--destructive)]",
                },
            ],
            enableSorting: true,
        },
        {
            id: "bonusLoanEligibility",
            header: "Bonus Loan Eligible",
            accessorKey: "bonusLoanEligibility",
            displayCondition: [
                {
                    value: true,
                    label: "Yes",
                    className: "",
                },
                {
                    value: false,
                    label: "No",
                    className: "text-[var(--destructive)]",
                },
            ],
            enableSorting: true,
        }
    ]

    // Define filters
    const filters: FilterDefinition[] = []

    const search: SearchDefinition = {
        title: "Search",
        placeholder: "Search Classification",
        enableSearch: true,
    };

    // Handle edit
    const handleEdit = (classification: Classification) => {
        console.log("Edit classification", classification)
        // Open edit modal or navigate to edit page
    }

    // Handle delete
    const handleDelete = (classification: Classification) => {
        console.log("Delete classification", classification)
        // Show confirmation dialog and delete if confirmed
        if (confirm(`Are you sure you want to delete this classification?`)) {
        setClassifications(classifications.filter((d) => d.id !== classification.id))
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
    const handleAddClassification = (values: { group: string, code: string, name: string, restructureEligibility: boolean, bonusLoanEligibility: boolean }) => {
        const newClassification = {
            id: Date.now().toString(),
            ...values,
        }
        setClassifications([...classifications, newClassification])
        setAddDialogOpen(false)
    }
    return (
        <>
            <DataTable
                title="Classifications"
                subtitle=""
                data={classifications}
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

            <AddClassificationDialog
                open={addDialogOpen}
                onOpenChange={setAddDialogOpen}
                onSubmit={handleAddClassification}
                borrowerGroups={borrowerGroups}
            />
        </>
    )
}