"use client"

import type React from "react"

import { DataTableV2, ColumnDefinition } from "@/components/data-table/data-table-v2"
import type { Transaction } from "../Service/TransactionTypes"
import type { PaginationInfo } from "../Service/TransactionTypes"

interface ListOfPaymentTabProps {
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

export function ListOfPaymentTab({
    data,
    pagination,
    isLoading,
    onPaginationChange,
    onRowCountChange,
    actionButtons,
    onSort,
}: ListOfPaymentTabProps) {
    const columns: ColumnDefinition<Transaction>[] = [
        {
            id: "borrower_name",
            header: "Borrower Name",
            accessorKey: "borrower_name",
            enableSorting: true,
        },
        {
            id: "atm_number",
            header: "ATM Number",
            accessorKey: "atm_number",
            enableSorting: true,
            cell: (row) => {
                const atm = row.atm_number || ""
                return atm.replace(/\d(?=\d{3})/g, "*")
            },
        },
        {
            id: "mode_of_payment",
            header: "Mode of Payment",
            accessorKey: "mode_of_payment",
            enableSorting: true,
        },
        {
            id: "payment_amount",
            header: "Payment Amount",
            accessorKey: "payment_amount",
            enableSorting: true,
            cell: (row) => `${row.payment_amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
        },
        {
            id: "remarks",
            header: "Remarks",
            accessorKey: "remarks",
            enableSorting: false,
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
