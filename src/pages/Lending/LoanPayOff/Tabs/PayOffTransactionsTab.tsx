"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { DataTableV4, type ColumnDefinition } from "@/components/data-table/data-table-v4"
import { SearchIcon } from "lucide-react"
import type { LoanPayOff } from "../Service/LoanPayOffTypes"

interface PayOffTransaction {
  id: string
  name: string
  reference_number: string
  loan_type: string
  original_amount: number
  balance: number
  insurance: number
  unpaid: number
}

interface PayOffTransactionsTabProps {
  currentLoanPayOff: LoanPayOff | null
  onReset: () => void
  onSaveAsDraft: () => void
  onProcess: () => void
}

export function PayOffTransactionsTab({
  currentLoanPayOff,
  onReset,
  onSaveAsDraft,
  onProcess,
}: PayOffTransactionsTabProps) {
  const [loanType, setLoanType] = useState("")
  const [searchUser, setSearchUser] = useState("")
  const [dateRangeFrom, setDateRangeFrom] = useState("")
  const [dateRangeTo, setDateRangeTo] = useState("")

  // Sample transaction data
  const transactionData: PayOffTransaction[] = [
    {
      id: "1",
      name: "Juan Dela Cruz",
      reference_number: "PN-2023-001",
      loan_type: "Salary Loan",
      original_amount: 50000.0,
      balance: 35000.0,
      insurance: 25000.0,
      unpaid: 12500.0,
    },
    {
      id: "2",
      name: "Juan Dela Cruz",
      reference_number: "PN-2023-001",
      loan_type: "Bonus Loan",
      original_amount: 20000.0,
      balance: 15000.0,
      insurance: 10000.0,
      unpaid: 6000.0,
    },
    {
      id: "3",
      name: "Juan Dela Cruz",
      reference_number: "PN-2023-001",
      loan_type: "Cash Advance Loan",
      original_amount: 10000.0,
      balance: 10000.0,
      insurance: 5000.0,
      unpaid: 5500.0,
    },
  ]

  const columns: ColumnDefinition<PayOffTransaction>[] = [
    {
      id: "name",
      header: "Name",
      accessorKey: "name",
      enableSorting: false,
    },
    {
      id: "reference_number",
      header: "Reference number",
      accessorKey: "reference_number",
      enableSorting: false,
    },
    {
      id: "loan_type",
      header: "Loan Type",
      accessorKey: "loan_type",
      enableSorting: false,
    },
    {
      id: "original_amount",
      header: "Original Amount",
      accessorKey: "original_amount",
      enableSorting: false,
      cell: (item) => `₱${item.original_amount.toLocaleString()}`,
    },
    {
      id: "balance",
      header: "Balance",
      accessorKey: "balance",
      enableSorting: false,
      cell: (item) => `₱${item.balance.toLocaleString()}`,
    },
    {
      id: "insurance",
      header: "Insurance",
      accessorKey: "insurance",
      enableSorting: false,
      cell: (item) => `₱${item.insurance.toLocaleString()}`,
    },
    {
      id: "unpaid",
      header: "Unpaid",
      accessorKey: "unpaid",
      enableSorting: false,
      cell: (item) => `₱${item.unpaid.toLocaleString()}`,
    },
  ]

  const handleReset = () => {
    setLoanType("")
    setSearchUser("")
    setDateRangeFrom("")
    setDateRangeTo("")
    onReset()
  }

  return (
    <div className="flex flex-col h-full">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-4">
        <div className="space-y-6">
          {/* Filter Controls */}
          <Card className="border-none shadow-none p-0">
            <CardContent className="px-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <Label>
                    Select Loan Type <span className="text-red-500">*</span>
                  </Label>
                  <Select value={loanType} onValueChange={setLoanType}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="salary">Salary Loan</SelectItem>
                      <SelectItem value="bonus">Bonus Loan</SelectItem>
                      <SelectItem value="cash-advance">Cash Advance Loan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Label>Search</Label>
                  <div className="relative mt-2">
                    <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search user..."
                      value={searchUser}
                      onChange={(e) => setSearchUser(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="flex-1">
                  <Label>Date range</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Input
                      type="date"
                      value={dateRangeFrom}
                      onChange={(e) => setDateRangeFrom(e.target.value)}
                      className="flex-1"
                    />
                    <span className="text-gray-500">-</span>
                    <Input
                      type="date"
                      value={dateRangeTo}
                      onChange={(e) => setDateRangeTo(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>

                <Button variant="outline" size="sm" className="mt-6" onClick={handleReset}>
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Transactions Table */}
          <Card className="border-none shadow-none p-0">
            <CardContent className="px-6">
              <DataTableV4
                data={transactionData}
                columns={columns}
                showHeader={false}
                enablePagination={false}
                enableFilter={false}
                enableSelection={false}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Sticky Action Buttons */}
      <div className="border-t border-gray-200 bg-white p-4 pb-0 flex justify-end gap-2 flex-shrink-0">
        <Button variant="outline" onClick={handleReset} type="button">
          Reset
        </Button>
        <Button variant="outline" onClick={onSaveAsDraft} type="button">
          Save as Draft
        </Button>
        <Button onClick={onProcess} type="button" disabled={!currentLoanPayOff}>
          Process
        </Button>
      </div>
    </div>
  )
}
