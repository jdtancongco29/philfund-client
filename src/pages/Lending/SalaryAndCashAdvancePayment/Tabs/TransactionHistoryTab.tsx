"use client"

import type React from "react"

import { DataTableV2, ColumnDefinition } from "@/components/data-table/data-table-v2"
import type { Transaction } from "../Service/TransactionTypes"
import type { PaginationInfo } from "../Service/TransactionTypes"

interface TransactionHistoryTabProps {
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

export function TransactionHistoryTab({
  data,
  pagination,
  isLoading,
  onPaginationChange,
  onRowCountChange,
  actionButtons,
  onSort,
}: TransactionHistoryTabProps) {
  const columns: ColumnDefinition<Transaction>[] = [
    {
      id: "transaction_date",
      header: "Transaction date",
      accessorKey: "transaction_date",
      enableSorting: true,
    },
    {
      id: "transaction_number",
      header: "Transaction number",
      accessorKey: "transaction_number",
      enableSorting: true,
    },
    {
      id: "borrower_payment_count",
      header: "Number of borrower payment",
      accessorKey: "borrower_payment_count",
      enableSorting: true,
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
