"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  ChevronDown,
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronsUpDown,
  FileText,
  Filter,
  Info,
  Pencil,
  Plus,
  Search,
  Table2,
  Trash2,
  X,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AddAccountDialog } from "./AddAccountDialog"

interface AccountData {
  code: string
  name: string
  classification: string
  subGrouping: string
  normalBalance: "Debit" | "Credit"
  contra: "Yes" | "No"
  branch: string[]
}

export default function ChartOfAccounts() {
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [rowsPerPage, setRowsPerPage] = useState("10")
  const [currentPage, setCurrentPage] = useState(1)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedClassification, setSelectedClassification] = useState<string>("")

  const [accountsData, setAccountsData] = useState<AccountData[]>([
    {
      code: "1000",
      name: "Cash in bank",
      classification: "Assets",
      subGrouping: "Current Assets",
      normalBalance: "Debit",
      contra: "No",
      branch: ["Iligan"],
    },
    {
      code: "1010",
      name: "Cash on Hand",
      classification: "Assets",
      subGrouping: "Current Assets",
      normalBalance: "Debit",
      contra: "No",
      branch: ["CDO", "Gingoog"],
    },
    {
      code: "1020",
      name: "Rent Expense",
      classification: "Assets",
      subGrouping: "Administrative and Operating Expense",
      normalBalance: "Debit",
      contra: "No",
      branch: ["Balingasag"],
    },
    {
      code: "1030",
      name: "Interest Receivable – Salary",
      classification: "Assets",
      subGrouping: "Current Assets",
      normalBalance: "Credit",
      contra: "Yes",
      branch: ["Surigao"],
    },
    {
      code: "1060",
      name: "Notes receivable – salary",
      classification: "Assets",
      subGrouping: "Current Assets",
      normalBalance: "Credit",
      contra: "Yes",
      branch: ["Butuan"],
    },
    {
      code: "1040",
      name: "Unearned Interest Income – Salary",
      classification: "Income",
      subGrouping: "Income",
      normalBalance: "Credit",
      contra: "Yes",
      branch: ["Malaybalay"],
    },
    {
      code: "1050",
      name: "Interest Income – salary",
      classification: "Income",
      subGrouping: "Income",
      normalBalance: "Credit",
      contra: "Yes",
      branch: ["Valencia"],
    },
  ])

  const classifications = ["All", "Assets", "Liabilities", "Equity", "Income", "Expense"]

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const getSortIcon = (column: string) => {
    if (sortColumn !== column) {
      return <ChevronsUpDown className="ml-1 h-4 w-4" />
    }
    return sortDirection === "asc" ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
  }

  const filteredData = accountsData.filter((account) => {
    const matchesSearch =
      searchQuery === "" ||
      account.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.name.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesClassification =
      selectedClassification === "" ||
      selectedClassification === "All" ||
      account.classification === selectedClassification

    return matchesSearch && matchesClassification
  })

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0

    let valueA: string
    let valueB: string

    switch (sortColumn) {
      case "code":
        valueA = a.code
        valueB = b.code
        break
      case "name":
        valueA = a.name
        valueB = b.name
        break
      case "classification":
        valueA = a.classification
        valueB = b.classification
        break
      case "subGrouping":
        valueA = a.subGrouping
        valueB = b.subGrouping
        break
      case "normalBalance":
        valueA = a.normalBalance
        valueB = b.normalBalance
        break
      case "contra":
        valueA = a.contra
        valueB = b.contra
        break
      case "branch":
        valueA = a.branch.join(",")
        valueB = b.branch.join(",")
        break
      default:
        return 0
    }

    return sortDirection === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA)
  })

  const handleAddAccount = (newAccount: AccountData) => {
    setAccountsData([...accountsData, newAccount])
  }

  const handleDeleteAccount = (code: string) => {
    setAccountsData(accountsData.filter((account) => account.code !== code))
  }

  const handleReset = () => {
    setSearchQuery("")
    setSelectedClassification("")
  }

  return (
    <>
      <div className="bg-white rounded-lg border p-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
            <Info className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-medium">Chart of Accounts Management</h2>
            <p className="text-sm text-muted-foreground">
              Add, edit, and delete accounts in your chart of accounts. Properly classify accounts by major
              classification, sub-grouping, and special classification. Ensure proper accounting practices by specifying
              normal balances and contra accounts.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-xl font-semibold">Chart of Accounts</h1>
          <p className="text-sm text-muted-foreground">
            Manage the accounts used for recording financial transactions in your organization
          </p>
        </div>
        <Button size="lg" onClick={() => setIsAddDialogOpen(true)} className="cursor-pointer">
            <Plus className="h-4 w-4" />
            New
        </Button>
      </div>

      <div className="flex justify-between mb-4">
        <div className="flex gap-2">
          <div>
            <h3 className="text-sm font-medium mb-2">Search</h3>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search accounts, code..."
                className="pl-8 w-[226.5px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Filter by Classification</h3>
            <Select value={selectedClassification} onValueChange={setSelectedClassification}>
              <SelectTrigger className="w-[226.5px]">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {classifications.map((classification) => (
                  <SelectItem key={classification} value={classification}>
                    {classification}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" className="gap-2" onClick={() => {}}>
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" className="gap-2" onClick={handleReset}>
            <X className="h-4 w-4" />
            Reset
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => {}}>
            <FileText className="h-4 w-4" />
            PDF
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => {}}>
            <Table2 className="h-4 w-4" />
            CSV
          </Button>
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] cursor-pointer" onClick={() => handleSort("code")}>
                <div className="flex items-center">
                  Account Code
                  {getSortIcon("code")}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
                <div className="flex items-center">
                  Account Name
                  {getSortIcon("name")}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("classification")}>
                <div className="flex items-center">
                  Classification
                  {getSortIcon("classification")}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("subGrouping")}>
                <div className="flex items-center">
                  Sub-grouping
                  {getSortIcon("subGrouping")}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("normalBalance")}>
                <div className="flex items-center">
                  Normal Balance
                  {getSortIcon("normalBalance")}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("contra")}>
                <div className="flex items-center">
                  Contra
                  {getSortIcon("contra")}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("branch")}>
                <div className="flex items-center">
                  Branch
                  {getSortIcon("branch")}
                </div>
              </TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((account) => (
              <TableRow key={account.code}>
                <TableCell>{account.code}</TableCell>
                <TableCell>{account.name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-gray-50">
                    {account.classification}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-gray-50">
                    {account.subGrouping}
                  </Badge>
                </TableCell>
                <TableCell>{account.normalBalance}</TableCell>
                <TableCell>{account.contra}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {account.branch.map((branch) => (
                      <Badge key={branch} variant="outline" className="bg-gray-50">
                        {branch}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500"
                            onClick={() => handleDeleteAccount(account.code)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end mt-4 gap-6">
        <div className="flex items-center gap-2">
          <span className="text-sm">Rows per page</span>
          <Select value={rowsPerPage} onValueChange={(value) => {
            setRowsPerPage(value);
            setCurrentPage(1);
          }}>
            <SelectTrigger className="w-16 h-8">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="text-sm">Page {currentPage} of 10</div>

        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ChevronFirst className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ChevronLast className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <AddAccountDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onAddAccount={handleAddAccount} />
    </>
  )
}
