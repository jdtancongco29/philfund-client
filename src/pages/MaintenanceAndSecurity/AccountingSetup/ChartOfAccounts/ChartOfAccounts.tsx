"use client"

import { useState, useEffect } from "react"
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
  CircleCheck,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import { toast } from "sonner"
import { apiRequest } from "@/lib/api"
import { AddAccountDialog } from "./AddAccountDialog"
import { DdeleteDialog } from "./DeleteCOADialog"
import { EditAccountDialog } from "./EditAccountDialog "


interface Branch {
  uid: string
  code: string
  name: string
}

interface Parent {
  id: string
  name: string
}

interface ChartOfAccount {
  id: string
  code: string
  name: string
  description: string
  major_classification: string
  category: string
  is_header: boolean
  parent_id: string | null
  parent?: Parent
  is_contra: boolean
  normal_balance: "debit" | "credit"
  special_classification: string
  status: boolean
  branches?: Branch[]
}

interface Pagination {
  current_page: number
  per_page: number
  total_pages: number
  total_items: number
}

interface DataPayload {
  count: number
  chartOfAccounts: ChartOfAccount[]
  pagination: Pagination
}

interface ApiResponse {
  status: string
  message: string
  data: DataPayload
}

export default function ChartOfAccounts() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [accountToDelete, setAccountToDelete] = useState<{ id: string; name: string } | null>(null)

  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedClassification, setSelectedClassification] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [accounts, setAccounts] = useState<ChartOfAccount[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    current_page: 1,
    per_page: 10,
    total_pages: 1,
    total_items: 0
  })

  const classifications = [
    "regular account",
    "cash account",
    "cash in bank account",
    "receivable account",
    "payable account",
    "allowance for bad debts",
    "properties and equipment",
    "accumulated depreciation",
    "accumulated amortization",
    "cost of sales",
    "sales debits",
    "sales",
    "sales discount",
    "other income",
    "retained income"
  ]

  const fetchAccounts = async (page = 1, perPage = 10, search = "", classification = "") => {
    setLoading(true)
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        per_page: perPage.toString(),
        ...(search && { search }),
        ...(classification && classification !== "All" && { classification })
      })

      const response = await apiRequest<ApiResponse>(
        "get",
        `/coa?${queryParams.toString()}`,
        null,
        {
          useAuth: true,
          useBranchId: true,
        }
      )
      
      if (response.data.status === "FETCHED") {
        setAccounts(response.data.data.chartOfAccounts)
        setPagination(response.data.data.pagination)
      } else {
        throw new Error(response.data.message || "Failed to fetch accounts")
      }
    } catch (err) {
      console.error("Error fetching accounts:", err)
      toast.error("Failed to fetch chart of accounts")
      setAccounts([])
      setPagination({
        current_page: 1,
        per_page: 10,
        total_pages: 1,
        total_items: 0
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAccounts(currentPage, rowsPerPage, searchQuery, selectedClassification)
  }, [currentPage, rowsPerPage])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentPage === 1) {
        fetchAccounts(1, rowsPerPage, searchQuery, selectedClassification)
      } else {
        setCurrentPage(1)
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [searchQuery, selectedClassification])

  useEffect(() => {
    if (currentPage !== 1) {
      fetchAccounts(1, rowsPerPage, searchQuery, selectedClassification)
    }
  }, [searchQuery, selectedClassification])

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

  const sortedData = [...accounts].sort((a, b) => {
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
        valueA = a.major_classification
        valueB = b.major_classification
        break
      case "category":
        valueA = a.category
        valueB = b.category
        break
      case "normalBalance":
        valueA = a.normal_balance
        valueB = b.normal_balance
        break
      case "contra":
        valueA = a.is_contra ? "Yes" : "No"
        valueB = b.is_contra ? "Yes" : "No"
        break
      default:
        return 0
    }

    return sortDirection === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA)
  })

  const handleAddAccount = async (newAccount: any) => {
    try {
      const response = await apiRequest<{ status: string; message: string; data: any }>(
        "post",
        "/coa",
        newAccount,
        {
          useAuth: true,
          useBranchId: true,
        }
      )
      
      if (response.data.status === "CREATED" || response.data.status === "SUCCESS") {
        toast.success("Account Added", {
          description: response.data.message || "New account has been successfully added.",
          icon: <CircleCheck className="h-5 w-5" />,
          duration: 5000,
        })
        
        fetchAccounts(currentPage, rowsPerPage, searchQuery, selectedClassification)
        setIsAddDialogOpen(false)
      } else {
        throw new Error(response.data.message || "Failed to add account")
      }
    } catch (err: any) {
      console.error("Error adding account:", err)
      if (err.response && err.response.data && err.response.data.errors) {
        const errorMessages = Object.values(err.response.data.errors).flat().join(", ");
        toast.error("Failed to add account", {
          description: errorMessages
        })
      } else {
        toast.error("Failed to add account", {
          description: err.message || "An error occurred while adding the account"
        })
      }
    }
  }


  const handleDeleteClick = (id: string, name: string) => {
    setAccountToDelete({ id, name })
    setDeleteDialogOpen(true)
  }


  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false)
    setAccountToDelete(null)
  }


  const handleConfirmDelete = async () => {
    if (!accountToDelete) return

    try {
      const response = await apiRequest<{ status: string; message: string }>(
        "delete",
        `/coa/${accountToDelete.id}`,
        null,
        {
          useAuth: true,
          useBranchId: true,
        }
      )

      if (response.data.status === "DELETED" || response.data.status === "SUCCESS") {
        toast.success("Account Deleted", {
          description: response.data.message || `${accountToDelete.name} has been successfully deleted.`,
          icon: <CircleCheck className="h-5 w-5" />,
          duration: 5000,
        })

        fetchAccounts(currentPage, rowsPerPage, searchQuery, selectedClassification)
      } else {
        throw new Error(response.data.message || "Failed to delete account")
      }
    } catch (err: any) {
      console.error("Error deleting account:", err)
      toast.error("Failed to delete account", {
        description: err.message || "An error occurred while deleting the account"
      })
    } finally {
      handleCloseDeleteDialog()
    }
  }


  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
const [accountToEdit, setAccountToEdit] = useState<ChartOfAccount | null>(null)

// Add this function to handle edit clicks
const handleEditClick = (account: ChartOfAccount) => {
  setAccountToEdit(account)
  setIsEditDialogOpen(true)
}

// Add this function to handle edit submissions
const handleEditAccount = async (accountId: string, updatedAccount: any) => {
  try {
    const response = await apiRequest<{ status: string; message: string; data: any }>(
      "put",
      `/coa/${accountId}`,
      updatedAccount,
      {
        useAuth: true,
        useBranchId: true,
      }
    )
    
    if (response.data.status === "UPDATED" || response.data.status === "SUCCESS") {
      toast.success("Account Updated", {
        description: response.data.message || "Account has been successfully updated.",
        icon: <CircleCheck className="h-5 w-5" />,
        duration: 5000,
      })
      
      fetchAccounts(currentPage, rowsPerPage, searchQuery, selectedClassification)
      setIsEditDialogOpen(false)
      setAccountToEdit(null)
    } else {
      throw new Error(response.data.message || "Failed to update account")
    }
  } catch (err: any) {
    console.error("Error updating account:", err)
    toast.error("Failed to update account", {
      description: err.message || "An error occurred while updating the account"
    })
  }
}

  
  const handleReset = () => {
    setSearchQuery("")
    setSelectedClassification("")
    setCurrentPage(1)
  }

  const getClassificationBadgeColor = (classification: string) => {
    switch (classification) {
      case "1": return "bg-blue-50 text-blue-700"
      case "2": return "bg-red-50 text-red-700"
      case "3": return "bg-green-50 text-green-700"
      case "4": return "bg-yellow-50 text-yellow-700"
      case "5": return "bg-purple-50 text-purple-700"
      default: return "bg-gray-50"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading chart of accounts...</p>
        </div>
      </div>
    )
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
              <TableHead className="cursor-pointer" onClick={() => handleSort("category")}>
                <div className="flex items-center">
                  Category
                  {getSortIcon("category")}
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
              <TableHead>Branch</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((account) => (
              <TableRow key={account.id}>
                <TableCell className="font-medium">{account.code}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{account.name}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getClassificationBadgeColor(account.special_classification)}>
                    {account.special_classification}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-gray-50">
                    {account.category}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="font-medium">
                    {account.normal_balance.charAt(0).toUpperCase() + account.normal_balance.slice(1)}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={account.is_contra ? "destructive" : "outline"}>
                    {account.is_contra ? "Yes" : "No"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {account.branches && account.branches.length > 0 ? (
                    account.branches.map((branch) => (
                      <Badge key={branch.uid} variant="secondary" className="mr-1">
                        {branch.name}
                      </Badge>
                    ))
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
 <TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8"
        onClick={() => handleEditClick(account)}
      >
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
                            onClick={() => handleDeleteClick(account.id, account.name)}
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

      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-muted-foreground">
          Showing {((pagination.current_page - 1) * pagination.per_page) + 1} to{" "}
          {Math.min(pagination.current_page * pagination.per_page, pagination.total_items)} of{" "}
          {pagination.total_items} results
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-sm">Rows per page</span>
            <Select
              value={rowsPerPage.toString()}
              onValueChange={(value) => {
                const newRowsPerPage = parseInt(value)
                setRowsPerPage(newRowsPerPage)
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="w-16 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm">
            Page {pagination.current_page} of {pagination.total_pages}
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={pagination.current_page === 1}
              onClick={() => {
                setCurrentPage(1)
              }}
            >
              <ChevronFirst className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={pagination.current_page === 1}
              onClick={() => {
                const newPage = Math.max(1, pagination.current_page - 1)
                setCurrentPage(newPage)
              }}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={pagination.current_page === pagination.total_pages}
              onClick={() => {
                const newPage = Math.min(pagination.total_pages, pagination.current_page + 1)
                setCurrentPage(newPage)
              }}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={pagination.current_page === pagination.total_pages}
              onClick={() => {
                setCurrentPage(pagination.total_pages)
              }}
            >
              <ChevronLast className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

<AddAccountDialog 
  open={isAddDialogOpen} 
  onOpenChange={setIsAddDialogOpen} 
  onAddAccount={handleAddAccount} 
/>

      <DdeleteDialog
        isOpen={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        title="Delete Account"
        description="Are you sure you want to delete the account: {name}?"
        itemName={accountToDelete?.name || ""}
      />
      <EditAccountDialog 
  open={isEditDialogOpen} 
  onOpenChange={setIsEditDialogOpen}
  onEditAccount={handleEditAccount}
  account={accountToEdit}
/>
    </>
  )
}