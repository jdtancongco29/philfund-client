"use client"

import { useState } from "react"
import {
  ArrowUpDown,
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  Copy,
  FileText,
  Filter,
  Key,
  Pencil,
  Plus,
  Search,
  Table2,
  Trash2,
  X,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AddUserDialog } from "./AddUserDialog"
import { RemoveDeviceDialog } from "./RemoveDeviceDialog"

interface User {
  id: string
  username: string
  fullName: string
  position: string
  branch: string
  permissions: string[]
  status: "Active" | "Inactive"
}

export default function UserList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [rowsPerPage, setRowsPerPage] = useState("10")
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false)
  const [removeDeviceDialogOpen, setRemoveDeviceDialogOpen] = useState(false)
  const [selectedRows, setSelectedRows] = useState<string[]>([])

  // Sample data
  const users: User[] = [
    {
      id: "01",
      username: "janedoe",
      fullName: "Jane Doe",
      position: "Loan Officer",
      branch: "Branch Name",
      permissions: ["Loans", "Disbursements"],
      status: "Active",
    },
    {
      id: "02",
      username: "janedoe",
      fullName: "Jane Doe",
      position: "Branch Manager",
      branch: "Downtown Branch",
      permissions: ["Special Transaction"],
      status: "Inactive",
    },
    {
      id: "02",
      username: "janedoe",
      fullName: "Jane Doe",
      position: "Branch Manager",
      branch: "Downtown Branch",
      permissions: ["Special Transaction", "Loans", "Disbursements"],
      status: "Active",
    },
  ]

  const toggleSelectRow = (id: string) => {
    setSelectedRows((prev) => (prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]))
  }

  const isRowSelected = (id: string) => selectedRows.includes(id)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">User Management</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <FileText className="mr-2 h-4 w-4" />
            PDF
          </Button>
          <Button variant="outline" size="sm">
            <Table2 className="mr-2 h-4 w-4" />
            CSV
          </Button>
          <Button variant="outline" size="sm">
            View
          </Button>
          <Button size="sm" onClick={() => setAddUserDialogOpen(true)} className="cursor-pointer">
            <Plus className="h-4 w-4" />
            New
          </Button>
        </div>
      </div>

      <div>
        <h3 className="mb-2 font-medium">Search</h3>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search user..."
              className="pl-8 w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline">
            <X className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">
                <Checkbox />
              </TableHead>
              <TableHead className="w-[80px]">
                <div className="flex items-center">
                  User ID
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center">
                  User Name
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center">
                  Full Name
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center">
                  Position
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center">
                  Branch
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center">
                  Permissions
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center">
                  Status
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="w-[120px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Checkbox checked={isRowSelected(user.id)} onCheckedChange={() => toggleSelectRow(user.id)} />
                </TableCell>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.fullName}</TableCell>
                <TableCell>{user.position}</TableCell>
                <TableCell>{user.branch}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {user.permissions.map((permission, i) => (
                      <Badge key={i} variant="outline">
                        {permission}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={user.status === "Active" ? "default" : "destructive"}
                    className={`rounded-full ${user.status === "Active" ? "bg-emerald-500 hover:bg-emerald-600" : ""}`}
                  >
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Key className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Copy className="h-4 w-4" />
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

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">0 of 100 row(s) selected.</div>
        <div className="flex items-center gap-6">
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
      </div>
      <AddUserDialog open={addUserDialogOpen} onOpenChange={setAddUserDialogOpen} />
      <RemoveDeviceDialog open={removeDeviceDialogOpen} onOpenChange={setRemoveDeviceDialogOpen} />
    </div>
  )
}