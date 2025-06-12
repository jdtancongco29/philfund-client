"use client"

import { useCallback, useState } from "react"
import type { ColumnDefinition } from "@/components/data-table/data-table"
import type { AtmExpiryItem, AtmExpiryFilters } from "./Service/AtmExpiryTypes"
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query"
import AtmExpiryService from "./Service/AtmExpiryService"
import { DataTableV2 } from "@/components/data-table/data-table-v2"
import { FileText } from "lucide-react"
import { toast } from "sonner"
import { downloadFile } from "@/lib/utils"
import type { ModulePermissionProps } from "@/pages/MaintenanceAndSecurity/Security/UserPermissions/Service/PermissionsTypes"

export function AtmExpiryTable({
    // canAdd,
    // canEdit,
    // canDelete,
    canExport
}: ModulePermissionProps) {
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [searchQuery, setSearchQuery] = useState<string | null>(null)
    const [columnSort, setColumnSort] = useState<string | null>(null)
    const [sortQuery, setSortQuery] = useState<string | null>(null)
    const [filters, _setFilters] = useState<AtmExpiryFilters>({
        search: null,
        branch: null,
        bank: null,
        expiryThreshold: null,
    })

    // const queryClient = useQueryClient()

    const onPaginationChange = useCallback((page: number) => {
        setCurrentPage(page)
    }, [])

    const onRowCountChange = useCallback((row: number) => {
        setRowsPerPage(row)
        setCurrentPage(1) // Reset to first page when changing row count
    }, [])

    const onSearchChange = useCallback((search: string) => {
        setSearchQuery(search || null)
        setCurrentPage(1) // Reset to first page when searching
    }, [])

    const {
        isPending,
        error,
        isFetching,
        data: atmCards,
    } = useQuery({
        queryKey: ["atm-expiry-table", currentPage, rowsPerPage, searchQuery, columnSort, sortQuery, filters],
        queryFn: () =>
            AtmExpiryService.getAllAtmCards(currentPage, rowsPerPage, searchQuery, columnSort, sortQuery, filters),
        staleTime: Number.POSITIVE_INFINITY,
        placeholderData: keepPreviousData,
        refetchOnWindowFocus: false,
    })

    // Export mutations
    const exportPdfMutation = useMutation({
        mutationFn: AtmExpiryService.exportPdf,
        onSuccess: (data) => {
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
        mutationFn: AtmExpiryService.exportCsv,
        onSuccess: (csvData: Blob) => {
            try {
                const currentDate = new Date().toISOString().split("T")[0]
                downloadFile(csvData, `atm-expiry-${currentDate}.csv`)
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

    // Define columns
    const columns: ColumnDefinition<AtmExpiryItem>[] = [
        {
            id: "borrowerName",
            header: "Borrower's Name",
            accessorKey: "borrowerName",
            enableSorting: true,
        },
        {
            id: "expiryDate",
            header: "Expiry Date",
            accessorKey: "expiryDate",
            enableSorting: true,
        },
        {
            id: "daysRemaining",
            header: "No. of Days",
            accessorKey: "daysRemaining",
            enableSorting: true,
            cell: (row) => {
                const days = row.daysRemaining
                return (
                    <div className={`${days <= 7 ? "text-red-600" : days <= 30 ? "text-yellow-600" : "text-green-600"}`}>
                        {days} days
                    </div>
                )
            },
        },
        {
            id: "accountNumber",
            header: "Account Number",
            accessorKey: "accountNumber",
            enableSorting: true,
        },
        {
            id: "atmCardNumber",
            header: "ATM Card Number",
            accessorKey: "atmCardNumber",
            enableSorting: true,
        },
        {
            id: "bankBranch",
            header: "Bank Branch",
            accessorKey: "bankBranch",
            enableSorting: true,
        },
        {
            id: "bankName",
            header: "Bank Name",
            accessorKey: "bankName",
            enableSorting: true,
        },
    ]

    // Handle exports
    const handlePdfExport = () => {
        exportPdfMutation.mutate()
    }

    const handleCsvExport = () => {
        exportCsvMutation.mutate()
    }

    // Define action buttons
    const actionButtons = [
        {
            label: "Print Report",
            icon: <FileText className="h-4 w-4" />,
            onClick: (item: AtmExpiryItem) => {
                toast.info(`Printing report for ${item.borrowerName}...`)
                // Implement print functionality
            },
        },
    ]

    const handleSort = (column: string, sort: string) => {
        setColumnSort(column)
        setSortQuery(sort)
    }

    return (
        <>
            <DataTableV2
                totalCount={atmCards?.data.pagination.total_items ?? 0}
                perPage={atmCards?.data.pagination.per_page ?? 10}
                pageNumber={atmCards?.data.pagination.current_page ?? 1}
                onPaginationChange={onPaginationChange}
                onRowCountChange={onRowCountChange}
                title="ATM Expiry List"
                subtitle=""
                data={atmCards?.data.atmCards ?? []}
                columns={columns}
                filters={[
                    {
                        id: "branch",
                        label: "Branch",
                        type: "select",
                        options: [
                            { label: "Cebu Main Branch", value: "Cebu Main Branch" },
                            { label: "Mandaue Branch", value: "Mandaue Branch" },
                            { label: "Talisay Branch", value: "Talisay Branch" },
                            { label: "Lapu-Lapu Branch", value: "Lapu-Lapu Branch" },
                        ],
                        placeholder: "Select branch",
                    },
                    {
                        id: "bank",
                        label: "Bank",
                        type: "select",
                        options: [
                            { label: "BDO", value: "BDO" },
                            { label: "Metrobank", value: "Metrobank" },
                            { label: "BPI", value: "BPI" },
                            { label: "UnionBank", value: "UnionBank" },
                        ],
                        placeholder: "Select bank",
                    },
                    {
                        id: "expiryThreshold",
                        label: "Expiry Threshold",
                        type: "select",
                        options: [
                            { label: "7 days", value: "7" },
                            { label: "14 days", value: "14" },
                            { label: "30 days", value: "30" },
                            { label: "60 days", value: "60" },
                            { label: "90 days", value: "90" },
                        ],
                        placeholder: "Select threshold",
                    },
                ]}
                search={{
                    title: "Search",
                    placeholder: "Search user...",
                    enableSearch: true,
                }}
                actionButtons={actionButtons}
                onLoading={isPending || isFetching || exportPdfMutation.isPending || exportCsvMutation.isPending}
                idField="id"
                enableNew={false}
                enablePdfExport={canExport}
                enableCsvExport={canExport}
                enableFilter={true}
                onResetTable={false}
                onSearchChange={onSearchChange}
                onPdfExport={handlePdfExport}
                onCsvExport={handleCsvExport}
                onSort={handleSort}
            />
        </>
    )
}
