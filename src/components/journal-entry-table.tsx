"use client"

import { DataTableV4, type ColumnDefinition } from "@/components/data-table/data-table-v4"

interface JournalEntry {
  id: string
  code: string
  name: string
  debit: number | null
  credit: number | null
}

interface JournalEntryTableProps {
  data: JournalEntry[]
  showTotals?: boolean
  className?: string
}

export function JournalEntryTable({ data, showTotals = false, className }: JournalEntryTableProps) {
  const columns: ColumnDefinition<JournalEntry>[] = [
    {
      id: "code",
      header: "Code",
      accessorKey: "code",
      enableSorting: false,
    },
    {
      id: "name",
      header: "Name",
      accessorKey: "name",
      enableSorting: false,
    },
    {
      id: "debit",
      header: "Debit",
      accessorKey: "debit",
      align: "left",
      enableSorting: false,
      cell: (item) => {
        if (item.debit === null || item.debit === undefined) return "-"
        return `₱${item.debit.toLocaleString()}`
      },
      footer: (data) => {
        const total = data.reduce((sum, item) => sum + (item.debit || 0), 0)
        return `₱${total.toLocaleString()}`
      },
    },
    {
      id: "credit",
      header: "Credit",
      accessorKey: "credit",
      align: "left",
      enableSorting: false,
      cell: (item) => {
        if (item.credit === null || item.credit === undefined) return "-"
        return `₱${item.credit.toLocaleString()}`
      },
      footer: (data) => {
        const total = data.reduce((sum, item) => sum + (item.credit || 0), 0)
        return `₱${total.toLocaleString()}`
      },
    },
  ]

  return (
    <DataTableV4
      data={data}
      columns={columns}
      showHeader={false}
      enablePagination={false}
      enableFilter={false}
      enableSelection={false}
      showTotals={showTotals}
      className={className}
    />
  )
}