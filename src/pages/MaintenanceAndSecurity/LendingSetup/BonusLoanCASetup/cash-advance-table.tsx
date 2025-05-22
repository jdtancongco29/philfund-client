"use client"

import { useState } from "react"
import {
  DataTable,
  type SearchDefinition,
  type ColumnDefinition,
  type FilterDefinition,
} from "@/components/data-table/data-table"
import { AddCashAdvanceDialog } from "./add-cash-advance-dialog"

interface CashAdvance {
  id: string
  code: string
  name: string
  loanType: string
  interestRate: string
  maxAmount: string
  maxRate: string
  surchargeRate: string
}

export function CashAdvanceTable() {
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [cashAdvances, setCashAdvances] = useState<CashAdvance[]>([
    {
      id: "1",
      code: "CA001",
      name: "SL Cash Advance",
      loanType: "Bonus Loan",
      interestRate: "5%",
      maxAmount: "₱5,000.00",
      maxRate: "75%",
      surchargeRate: "5%",
    },
    {
      id: "2",
      code: "CA002",
      name: "SL Cash Advance",
      loanType: "Bonus Loan",
      interestRate: "5%",
      maxAmount: "₱5,000.00",
      maxRate: "75%",
      surchargeRate: "5%",
    },
    {
      id: "3",
      code: "CA003",
      name: "BL Cash Advance",
      loanType: "Salary Loan",
      interestRate: "5%",
      maxAmount: "₱5,000.00",
      maxRate: "75%",
      surchargeRate: "5%",
    },
  ])

  const columns: ColumnDefinition<CashAdvance>[] = [
    {
      id: "code",
      header: "Code",
      accessorKey: "code",
      enableSorting: true,
    },
    {
      id: "name",
      header: "Cash Advance Name",
      accessorKey: "name",
      enableSorting: true,
    },
    {
      id: "loanType",
      header: "Loan Type",
      accessorKey: "loanType",
      enableSorting: true,
    },
    {
      id: "interestRate",
      header: "Interest Rate",
      accessorKey: "interestRate",
      enableSorting: true,
    },
    {
      id: "maxAmount",
      header: "Max Amount",
      accessorKey: "maxAmount",
      enableSorting: true,
    },
    {
      id: "maxRate",
      header: "Max Rate",
      accessorKey: "maxRate",
      enableSorting: true,
    },
    {
      id: "surchargeRate",
      header: "Surcharge Rate",
      accessorKey: "surchargeRate",
      enableSorting: true,
    },
  ]

  // Define filters
  const filters: FilterDefinition[] = []

  const search: SearchDefinition = {
    title: "Search",
    placeholder: "Search Cash Advance",
    enableSearch: true,
  }

  const handleDelete = (cashAdvance: CashAdvance) => {
    console.log("Delete cash advance", cashAdvance)
    // Show confirmation dialog and delete if confirmed
    if (confirm(`Are you sure you want to delete this cash advance?`)) {
      setCashAdvances(cashAdvances.filter((ca) => ca.id !== cashAdvance.id))
    }
  }

  const handleEdit = (cashAdvance: CashAdvance) => {
    console.log("Edit cash advance", cashAdvance)
    alert("Edit cash advance " + cashAdvance.name)
  }

  const handleNew = () => {
    setAddDialogOpen(true)
  }

  const handleAddCashAdvance = () => {
    setAddDialogOpen(false)
  }

  return (
    <>
      <DataTable
        title="Cash Advances"
        subtitle="Manage existing salary loan cash advance configurations"
        data={cashAdvances}
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
        enableFilter={true}
      />
      <AddCashAdvanceDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} onSubmit={handleAddCashAdvance} />
    </>
  )
}
