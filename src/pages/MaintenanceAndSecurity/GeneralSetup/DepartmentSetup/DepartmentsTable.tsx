"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, ChevronsUpDown, FileText, Pencil, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import AddDepartmentForm from "./AddDepartmentForm"

// Define the type for department data
interface Department {
  id: string
  code: string
  name: string
  status: "Active" | "Inactive"
}

// Sample data
const initialDepartments: Department[] = [
  {
    id: "1",
    code: "FIN",
    name: "Finance",
    status: "Active",
  },
  {
    id: "2",
    code: "IT",
    name: "Information Technology",
    status: "Active",
  },
  {
    id: "3",
    code: "MKT",
    name: "Marketing",
    status: "Inactive",
  },
  {
    id: "4",
    code: "LEGAL",
    name: "Legal",
    status: "Inactive",
  },
]

// Column definition for sorting
type SortableColumn = "code" | "name" | "status"

export default function DepartmentsTable() {
  const [departments, setDepartments] = useState<Department[]>(initialDepartments)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortColumn, setSortColumn] = useState<SortableColumn | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(null)
  const [rowsPerPage, setRowsPerPage] = useState("10")
  const [currentPage, setCurrentPage] = useState(1)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  // Handle sorting
  const handleSort = (column: SortableColumn) => {
    console.log(`Sorting by ${column}`)

    if (sortColumn === column) {
      if (sortDirection === "asc") {
        setSortDirection("desc")
      } else if (sortDirection === "desc") {
        setSortColumn(null)
        setSortDirection(null)
      }
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  // Get sort icon based on current sort state
  const getSortIcon = (column: SortableColumn) => {
    if (sortColumn !== column) {
      return <ChevronsUpDown className="ml-1 h-4 w-4" />
    }

    return sortDirection === "asc" ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
  }

  // Handle edit button click
  const handleEdit = (id: string) => {
    console.log(`Editing department with ID: ${id}`)
  }

  // Handle delete button click
  const handleDelete = (id: string) => {
    console.log(`Deleting department with ID: ${id}`)
    setDepartments(departments.filter((dept) => dept.id !== id))
  }

  // Handle adding a new department
  const handleAddDepartment = (department: Omit<Department, "id">) => {
    const newDepartment = {
      id: Math.random().toString(36).substring(2, 9),
      ...department,
    }
    setDepartments([...departments, newDepartment])
    setIsAddDialogOpen(false)
  }

  // Filter and sort departments
  let filteredDepartments = [...departments]

  if (searchTerm) {
    filteredDepartments = filteredDepartments.filter(
      (dept) =>
        dept.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }

  if (sortColumn && sortDirection) {
    filteredDepartments.sort((a, b) => {
      const aValue = a[sortColumn].toLowerCase()
      const bValue = b[sortColumn].toLowerCase()

      if (sortDirection === "asc") {
        return aValue.localeCompare(bValue)
      } else {
        return bValue.localeCompare(aValue)
      }
    })
  }

  // Pagination
  const totalPages = Math.ceil(filteredDepartments.length / Number.parseInt(rowsPerPage))
  const startIndex = (currentPage - 1) * Number.parseInt(rowsPerPage)
  const paginatedDepartments = filteredDepartments.slice(startIndex, startIndex + Number.parseInt(rowsPerPage))

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Departments</h1>
        <p className="text-muted-foreground">Manage existing departments</p>
      </div>

      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-sm font-medium">Search</h2>
          <div className="relative">
            <Input
              placeholder="Search user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-[300px] pl-8"
            />
            <div className="absolute left-2.5 top-2.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                className="text-muted-foreground"
              >
                <path
                  d="M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159C8.53901 10.6318 7.56251 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 7.56251 10.6318 8.53901 10.0159 9.30884L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L9.30884 10.0159Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => console.log("PDF export")}>
            <FileText className="h-4 w-4 mr-2" />
            PDF
          </Button>
          <Button variant="outline" size="sm" onClick={() => console.log("CSV export")}>
            <FileText className="h-4 w-4 mr-2" />
            CSV
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" onClick={() => console.log("Add new department")}>
                <Plus className="h-4 w-4 mr-2" />
                New
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <AddDepartmentForm onSave={handleAddDepartment} onCancel={() => setIsAddDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="border rounded-md">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="py-3 px-4 text-left font-medium">
                  <button className="flex items-center" onClick={() => handleSort("code")}>
                    Code
                    {getSortIcon("code")}
                  </button>
                </th>
                <th className="py-3 px-4 text-left font-medium">
                  <button className="flex items-center" onClick={() => handleSort("name")}>
                    Name
                    {getSortIcon("name")}
                  </button>
                </th>
                <th className="py-3 px-4 text-left font-medium">
                  <button className="flex items-center" onClick={() => handleSort("status")}>
                    Status
                    {getSortIcon("status")}
                  </button>
                </th>
                <th className="py-3 px-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedDepartments.map((dept) => (
                <tr key={dept.id} className="border-b">
                  <td className="py-3 px-4">{dept.code}</td>
                  <td className="py-3 px-4">{dept.name}</td>
                  <td className="py-3 px-4">
                    <Badge variant={dept.status === "Active" ? "default" : "destructive"}>{dept.status}</Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(dept.id)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(dept.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-end gap-6">
        <div className="flex items-center gap-2">
          <span className="text-sm">Rows per page</span>
          <Select value={rowsPerPage} onValueChange={setRowsPerPage}>
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

        <div className="flex items-center gap-1">
          <span className="text-sm">
            Page {currentPage} of {totalPages || 1}
          </span>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(1)}
            >
              <span className="sr-only">First page</span>
              <ChevronDown className="h-4 w-4 rotate-90" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              <span className="sr-only">Previous page</span>
              <ChevronDown className="h-4 w-4 -rotate-90" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            >
              <span className="sr-only">Next page</span>
              <ChevronDown className="h-4 w-4 rotate-90" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(totalPages)}
            >
              <span className="sr-only">Last page</span>
              <ChevronDown className="h-4 w-4 -rotate-90" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}