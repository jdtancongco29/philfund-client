"use client"

import { useState } from "react"
import {
  ArrowUpDown,
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  FileText,
  Pencil,
  Plus,
  Search,
  Table2,
  Trash2,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AddBranch } from "./AddBranch"

interface Branch {
  code: string
  name: string
  city: string
  departments: string
  departmentCount: string
  status: "Active" | "Inactive"
}

export default function BranchList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [rowsPerPage, setRowsPerPage] = useState("10")
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  // Sample data
  const branches: Branch[] = [
    {
      code: "MAIN",
      name: "Main Branch",
      city: "Makati City",
      departments: "Department 1",
      departmentCount: "2+",
      status: "Active",
    },
    {
      code: "NORTH",
      name: "Main Branch",
      city: "Makati City",
      departments: "Department 1",
      departmentCount: "2+",
      status: "Active",
    },
    {
      code: "SOUTH",
      name: "Main Branch",
      city: "Makati City",
      departments: "Department 1",
      departmentCount: "2+",
      status: "Active",
    },
    {
      code: "EAST",
      name: "Main Branch",
      city: "Makati City",
      departments: "Department 1",
      departmentCount: "2+",
      status: "Active",
    },
    {
      code: "WEST",
      name: "Main Branch",
      city: "Makati City",
      departments: "Department 1",
      departmentCount: "2+",
      status: "Inactive",
    },
    {
      code: "MAIN",
      name: "Main Branch",
      city: "Makati City",
      departments: "Department 1",
      departmentCount: "2+",
      status: "Inactive",
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Branch List</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <FileText className="mr-2 h-4 w-4" />
            PDF
          </Button>
          <Button variant="outline" size="sm">
            <Table2 className="mr-2 h-4 w-4" />
            CSV
          </Button>
          <Button size="sm" onClick={() => setAddDialogOpen(true)} className="cursor-pointer">
            <Plus className="h-4 w-4" />
            New
          </Button>
        </div>
      </div>

      <div>
        <h3 className="mb-2 font-medium">Search</h3>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search user..."
            className="pl-8 w-[300px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">
                <div className="flex items-center">
                  Code
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center">
                  Name
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center">
                  City/Municipality
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center">
                  Departments
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center">
                  Status
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {branches.map((branch, index) => (
              <TableRow key={index}>
                <TableCell>{branch.code}</TableCell>
                <TableCell>{branch.name}</TableCell>
                <TableCell>{branch.city}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span>{branch.departments}</span>
                    <Badge variant="outline">{branch.departmentCount}</Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={branch.status === "Active" ? "default" : "destructive"}
                    className={`rounded-full ${branch.status === "Active" ? "bg-emerald-500 hover:bg-emerald-600" : ""}`}
                  >
                    {branch.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end gap-8">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Rows per page</span>
          <Select value={rowsPerPage} onValueChange={setRowsPerPage}>
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-sm text-muted-foreground">Page 1 of 10</span>
          <div className="flex items-center">
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
      </div>
      <AddBranch open={addDialogOpen} onOpenChange={setAddDialogOpen} />
    </div>
  )
}