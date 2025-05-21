"use client"

import { useState } from "react"
import { DataTable, type SearchDefinition, type ColumnDefinition, type FilterDefinition } from "@/components/data-table/data-table"
import { AddSalaryLoanDialog } from "./AddSalaryDialog"
interface SalaryLoan {
  id: string
  code: string
  name: string
  interestRate: string
  minAmount: string
  maxAmount: string
}

export function SalaryLoanTable() {
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [salaryLoans, setSalaryLoans] = useState<SalaryLoan[]>([
    {
      id: "1",
      code: "SLO01",
      name: "DEPED Long Term",
      interestRate: "2%",
      minAmount: "₱10,000.00",
      maxAmount: "₱179,999.99",
    },
    {
      id: "2",
      code: "SLO02",
      name: "DEPED Short Term",
      interestRate: "1.75%",
      minAmount: "₱180,000.00",
      maxAmount: "₱250,000.00",
    },
    {
      id: "3",
      code: "SLO03",
      name: "PhilFund Salary Loan",
      interestRate: "1.5%",
      minAmount: "₱10,000.00",
      maxAmount: "₱150,000.00",
    },
  ])

  const columns: ColumnDefinition<SalaryLoan>[] = [
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
      id: "interestRate",
      header: "Interest Rate",
      accessorKey: "interestRate",
      enableSorting: true,
    },
    {
      id: "minAmount",
      header: "Min Amount",
      accessorKey: "minAmount",
      enableSorting: true,
    },
    {
      id: "maxAmount",
      header: "Max Amount",
      accessorKey: "maxAmount",
      enableSorting: true,
    },
  ]

  // Define filters
  const filters: FilterDefinition[] = []

  const search: SearchDefinition = {
    title: "Search",
    placeholder: "Search Division",
    enableSearch: true,
  };


  const handleDelete = (salaryLoan: SalaryLoan) => {
    console.log("Delete salary loan", salaryLoan)
    // Show confirmation dialog and delete if confirmed
    if (confirm(`Are you sure you want to delete this salary loan?`)) {
      setSalaryLoans(salaryLoans.filter((loan) => loan.id !== salaryLoan.id))
    }
  }

  const handleEdit = (salaryLoan: SalaryLoan) => {
    console.log("Edit salary loan", salaryLoan)
    alert("Edit salary loan " + salaryLoan.name)
  }

  const handleNew = () => {
    setAddDialogOpen(true)
  }

  const handleAddSalaryLoan = () => {
    setAddDialogOpen(false)
  }

  return (
    <>
      <DataTable
        title="Salary Loan"
        subtitle=""
        data={salaryLoans}
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
      <AddSalaryLoanDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} onSubmit={handleAddSalaryLoan} />
    </>
  )
}
