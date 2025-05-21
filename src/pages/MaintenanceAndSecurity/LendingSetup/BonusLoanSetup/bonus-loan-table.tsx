"use client"

import { useState } from "react"
import {
  DataTable,
  type SearchDefinition,
  type ColumnDefinition,
  type FilterDefinition,
} from "@/components/data-table/data-table"
import { AddBonusLoanDialog } from "./add-bonus-loan-dialog"

interface BonusLoan {
  id: string
  type: string
  monthOfRelease: string
  cutOffDate: string
  maxRate: string
  surcharge: string
}

export function BonusLoanTable() {
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [bonusLoans, setBonusLoans] = useState<BonusLoan[]>([
    {
      id: "1",
      type: "Midyear Bonus",
      monthOfRelease: "November",
      cutOffDate: "May 31",
      maxRate: "75%",
      surcharge: "5%",
    },
    {
      id: "2",
      type: "Year end Bonus",
      monthOfRelease: "May",
      cutOffDate: "November 30",
      maxRate: "75%",
      surcharge: "5%",
    },
    {
      id: "3",
      type: "Clothing Bonus",
      monthOfRelease: "October",
      cutOffDate: "April 30",
      maxRate: "-",
      surcharge: "5%",
    },
    {
      id: "4",
      type: "Cash Allowance Bonus",
      monthOfRelease: "January",
      cutOffDate: "August 31",
      maxRate: "-",
      surcharge: "5%",
    },
    {
      id: "5",
      type: "PEI Bonus",
      monthOfRelease: "June",
      cutOffDate: "December 31",
      maxRate: "-",
      surcharge: "5%",
    },
  ])

  const columns: ColumnDefinition<BonusLoan>[] = [
    {
      id: "type",
      header: "Type of Bonus",
      accessorKey: "type",
      enableSorting: true,
    },
    {
      id: "monthOfRelease",
      header: "Month of Release",
      accessorKey: "monthOfRelease",
      enableSorting: true,
    },
    {
      id: "cutOffDate",
      header: "Cut-off Date",
      accessorKey: "cutOffDate",
      enableSorting: true,
    },
    {
      id: "maxRate",
      header: "Max amt/rate",
      accessorKey: "maxRate",
      enableSorting: true,
    },
    {
      id: "surcharge",
      header: "Surcharge",
      accessorKey: "surcharge",
      enableSorting: true,
    },
  ]

  // Define filters
  const filters: FilterDefinition[] = []

  const search: SearchDefinition = {
    title: "Search",
    placeholder: "Search Bonus Loan",
    enableSearch: true,
  }

  const handleDelete = (bonusLoan: BonusLoan) => {
    console.log("Delete bonus loan", bonusLoan)
    // Show confirmation dialog and delete if confirmed
    if (confirm(`Are you sure you want to delete this bonus loan?`)) {
      setBonusLoans(bonusLoans.filter((loan) => loan.id !== bonusLoan.id))
    }
  }

  const handleEdit = (bonusLoan: BonusLoan) => {
    console.log("Edit bonus loan", bonusLoan)
    alert("Edit bonus loan " + bonusLoan.type)
  }

  const handleNew = () => {
    setAddDialogOpen(true)
  }

  const handleAddBonusLoan = () => {
    setAddDialogOpen(false)
  }

  return (
    <>
      <DataTable
        title="Bonus Loan"
        subtitle=""
        data={bonusLoans}
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
      <AddBonusLoanDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} onSubmit={handleAddBonusLoan} />
    </>
  )
}
