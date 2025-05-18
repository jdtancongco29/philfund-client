"use client"

import { useState } from "react"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ChevronsUpDownIcon,
  FileIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  TableIcon,
  TrashIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { NewBorrowerGroupDialog } from "./new-borrower-group-dialog"
import { DeleteBorrowerGroupDialog } from "./delete-borrower-group-dialog"
import { EditBorrowerGroupDialog } from "./edit-borrower-group-dialog"

interface BorrowerGroup {
  id: string
  code: string
  name: string
}

export function BorrowerGroupsTable() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortColumn, setSortColumn] = useState<"code" | "name">("code")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [rowsPerPage, setRowsPerPage] = useState("10")
  const [currentPage, setCurrentPage] = useState(1)
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<BorrowerGroup | null>(null)

  // Mock data - would be replaced with API call
  const [borrowerGroups, setBorrowerGroups] = useState<BorrowerGroup[]>([
    { id: "1", code: "PHILFUND", name: "PhilFund Staff" },
    { id: "2", code: "DEPED", name: "Department of Education" },
    { id: "3", code: "PRIVATE", name: "Private Sector" },
  ])

  const handleSort = (column: "code" | "name") => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const filteredGroups = borrowerGroups.filter(
    (group) =>
      group.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const sortedGroups = [...filteredGroups].sort((a, b) => {
    const compareValue = sortDirection === "asc" ? 1 : -1
    return a[sortColumn].localeCompare(b[sortColumn]) * compareValue
  })

  const totalPages = Math.ceil(sortedGroups.length / Number.parseInt(rowsPerPage))
  const paginatedGroups = sortedGroups.slice(
    (currentPage - 1) * Number.parseInt(rowsPerPage),
    currentPage * Number.parseInt(rowsPerPage),
  )

  const handleAddGroup = (newGroup: Omit<BorrowerGroup, "id">) => {
    const id = (borrowerGroups.length + 1).toString()
    setBorrowerGroups([...borrowerGroups, { id, ...newGroup }])
    setIsNewDialogOpen(false)
  }

  const handleEditGroup = (updatedGroup: BorrowerGroup) => {
    setBorrowerGroups(borrowerGroups.map((group) => (group.id === updatedGroup.id ? updatedGroup : group)))
    setIsEditDialogOpen(false)
    setSelectedGroup(null)
  }

  const handleDeleteGroup = (id: string) => {
    setBorrowerGroups(borrowerGroups.filter((group) => group.id !== id))
    setIsDeleteDialogOpen(false)
    setSelectedGroup(null)
  }

  const exportToPDF = () => {
    // API integration for PDF export would go here
    console.log("Export to PDF")
  }

  const exportToCSV = () => {
    // API integration for CSV export would go here
    console.log("Export to CSV")
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Borrower Groups</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={exportToPDF}>
            <FileIcon className="mr-2 h-4 w-4" />
            PDF
          </Button>
          <Button variant="outline" size="sm" onClick={exportToCSV}>
            <TableIcon className="mr-2 h-4 w-4" />
            CSV
          </Button>
          <Button size="sm" onClick={() => setIsNewDialogOpen(true)}>
            <PlusIcon className="h-4 w-4" />
            New
          </Button>
        </div>
      </div>

      <div>
        <div className="mb-4">
          <p className="mb-2 text-sm">Search</p>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search user..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-[300px]"
            />
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">
                  <div className="flex items-center cursor-pointer" onClick={() => handleSort("code")}>
                    Code
                    {sortColumn === "code" ? (
                      sortDirection === "asc" ? (
                        <ChevronUpIcon className="ml-2 h-4 w-4" />
                      ) : (
                        <ChevronDownIcon className="ml-2 h-4 w-4" />
                      )
                    ) : (
                      <ChevronsUpDownIcon className="ml-2 h-4 w-4 opacity-50" />
                    )}
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center cursor-pointer" onClick={() => handleSort("name")}>
                    Name
                    {sortColumn === "name" ? (
                      sortDirection === "asc" ? (
                        <ChevronUpIcon className="ml-2 h-4 w-4" />
                      ) : (
                        <ChevronDownIcon className="ml-2 h-4 w-4" />
                      )
                    ) : (
                      <ChevronsUpDownIcon className="ml-2 h-4 w-4 opacity-50" />
                    )}
                  </div>
                </TableHead>
                <TableHead className="w-[100px] text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedGroups.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8">
                    No borrower groups found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedGroups.map((group) => (
                  <TableRow key={group.id}>
                    <TableCell>{group.code}</TableCell>
                    <TableCell>{group.name}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedGroup(group)
                            setIsEditDialogOpen(true)
                          }}
                        >
                          <PencilIcon className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedGroup(group)
                            setIsDeleteDialogOpen(true)
                          }}
                        >
                          <TrashIcon className="h-4 w-4 text-destructive" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">Rows per page</p>
            <Select
              value={rowsPerPage}
              onValueChange={(value) => {
                setRowsPerPage(value)
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="h-8 w-16">
                <SelectValue placeholder={rowsPerPage} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-1 text-sm">
            <p className="text-muted-foreground">
              Page {currentPage} of {totalPages || 1}
            </p>
            <div className="flex items-center gap-1 ml-4">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                <ChevronsLeftIcon className="h-4 w-4" />
                <span className="sr-only">First page</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeftIcon className="h-4 w-4" />
                <span className="sr-only">Previous page</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                <ChevronRightIcon className="h-4 w-4" />
                <span className="sr-only">Next page</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                <ChevronsRightIcon className="h-4 w-4" />
                <span className="sr-only">Last page</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <NewBorrowerGroupDialog open={isNewDialogOpen} onOpenChange={setIsNewDialogOpen} onSubmit={handleAddGroup} />

      {selectedGroup && (
        <>
          <EditBorrowerGroupDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            group={selectedGroup}
            onSubmit={handleEditGroup}
          />
          <DeleteBorrowerGroupDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            group={selectedGroup}
            onDelete={() => handleDeleteGroup(selectedGroup.id)}
          />
        </>
      )}
    </div>
  )
}
