"use client"

import type React from "react"

import { DataTableV2, ColumnDefinition } from "@/components/data-table/data-table-v2"
import type { Transaction, PaginationInfo } from "../Service/BonusLoanPaymentTypes"

interface DetailsTabProps {
    data: Transaction[]
    pagination: PaginationInfo | undefined
    isLoading: boolean
    onPaginationChange: (page: number) => void
    onRowCountChange: (row: number) => void
    actionButtons: Array<{
        label: string
        icon: React.ReactNode
        onClick: (item: Transaction) => void
    }>
    onSort: (column: string, sort: string) => void
}

export function DetailsTab({
    data,
    pagination,
    isLoading,
    onPaginationChange,
    onRowCountChange,
    actionButtons,
    onSort,
}: DetailsTabProps) {
    const columns: ColumnDefinition<Transaction>[] = [
        {
            id: "borrower_name",
            header: "Borrower Name",
            accessorKey: "borrower_name",
            enableSorting: true,
        },
        {
            id: "transaction_date",
            header: "Transaction date",
            accessorKey: "transaction_date",
            enableSorting: true,
        },
        {
            id: "loan_type",
            header: "Loan Type",
            accessorKey: "loan_type",
            enableSorting: true,
        },
        {
            id: "pn_number",
            header: "PN number",
            accessorKey: "pn_number",
            enableSorting: true,
        },
        {
            id: "mode_of_payment",
            header: "Mode of payment",
            accessorKey: "mode_of_payment",
            enableSorting: true,
        },
        {
            id: "amount_transacted",
            header: "Amount transacted",
            accessorKey: "amount_transacted",
            enableSorting: true,
            cell: (row) => `${row.amount_transacted.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
        },
        {
            id: "reference",
            header: "Reference",
            accessorKey: "reference",
            enableSorting: true,
        },
        {
            id: "surcharge_amount",
            header: "Surcharge Amt.",
            accessorKey: "surcharge_amount",
            enableSorting: true,
            cell: (row) => `${row.surcharge_amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
        },
        {
            id: "caod",
            header: "CAOD",
            accessorKey: "caod",
            enableSorting: true,
            cell: (row) => `${row.caod.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
        },
        {
            id: "slod",
            header: "SLOD",
            accessorKey: "slod",
            enableSorting: true,
            cell: (row) => `${row.slod.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
        },
        {
            id: "cai",
            header: "CAI",
            accessorKey: "cai",
            enableSorting: true,
            cell: (row) => `${row.cai.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
        },
        {
            id: "sli",
            header: "SLI",
            accessorKey: "sli",
            enableSorting: true,
            cell: (row) => `${row.sli.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
        },
        {
            id: "capod",
            header: "CAPOD",
            accessorKey: "capod",
            enableSorting: true,
            cell: (row) => `${row.capod.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
        },
        {
            id: "lpod",
            header: "LPOD",
            accessorKey: "lpod",
            enableSorting: true,
            cell: (row) => `${row.lpod.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
        },
        {
            id: "cap",
            header: "CAP",
            accessorKey: "cap",
            enableSorting: true,
            cell: (row) => `${row.cap.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
        },
        {
            id: "lp",
            header: "LP",
            accessorKey: "lp",
            enableSorting: true,
            cell: (row) => `${row.lp.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
        },
    ]

    return (
        <DataTableV2
            totalCount={pagination?.total_items ?? 0}
            perPage={pagination?.per_page ?? 10}
            pageNumber={pagination?.current_page ?? 1}
            onPaginationChange={onPaginationChange}
            onRowCountChange={onRowCountChange}
            title=""
            subtitle=""
            data={data}
            columns={columns}
            filters={[]}
            search={{ title: "", placeholder: "", enableSearch: false }}
            actionButtons={actionButtons}
            onLoading={isLoading}
            onNew={() => { }}
            idField="id"
            enableNew={false}
            enablePdfExport={false}
            enableCsvExport={false}
            enableFilter={false}
            onResetTable={false}
            onSearchChange={() => { }}
            onPdfExport={() => { }}
            onCsvExport={() => { }}
            onSort={onSort}
        />
    )
}
