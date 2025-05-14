"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    ChevronDown,
    ChevronFirst,
    ChevronLast,
    ChevronLeft,
    ChevronRight,
    ChevronsUpDown,
    ChevronUp,
    Filter,
    Info,
    Pencil,
    Plus,
    Search,
    Trash2,
    X,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AddReferenceDialog } from "./AddReferenceDialog"

interface ReferenceData {
    code: string
    name: string
    modules: string[]
}

export default function ReferenceManagement() {
    const [sortColumn, setSortColumn] = useState<string | null>(null)
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
    const [rowsPerPage, setRowsPerPage] = useState("10")
    const [currentPage, setCurrentPage] = useState(1)
    const [referenceData, setReferenceData] = useState<ReferenceData[]>([
        { code: "GJ", name: "General Journal", modules: ["Journal Module"] },
        { code: "PN", name: "Promissory Note", modules: ["Lending Module"] },
        { code: "CK", name: "Check Voucher", modules: ["Payroll Module"] },
        { code: "OR", name: "Official Receipt", modules: ["POS / Sales Module"] },
        { code: "CV", name: "Cash Voucher", modules: ["Bonus Module"] },
        { code: "VP", name: "Vouchers Payable", modules: ["AP Module"] },
    ])
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const handleSort = (column: string) => {
        if (sortColumn === column) {
        setSortDirection(sortDirection === "asc" ? "desc" : "asc")
        } else {
        setSortColumn(column)
        setSortDirection("asc")
        }
    }

    const sortedData = [...referenceData].sort((a, b) => {
        if (!sortColumn) return 0

        let valueA: string
        let valueB: string

        if (sortColumn === "code") {
        valueA = a.code
        valueB = b.code
        } else if (sortColumn === "name") {
        valueA = a.name
        valueB = b.name
        } else {
        valueA = a.modules.join(",")
        valueB = b.modules.join(",")
        }

        return sortDirection === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA)
    })

  const handleAddReference = (newReference: ReferenceData) => {
    setReferenceData([...referenceData, newReference])
  }
  return (
    <>
      <div className="bg-white rounded-lg border p-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
            <Info className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-medium">Global Reference Data</h2>
            <p className="text-sm text-muted-foreground">
              Reference settings defined here are globally accessible and applicable across all branches of the
              application. Changes made here will affect all modules that use these references.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-xl font-semibold">Reference Management</h1>
          <p className="text-sm text-muted-foreground">
            Create, edit, and delete reference entries used throughout the system
          </p>
        </div>
        <Button size="lg" onClick={() => setIsAddDialogOpen(true)} className="cursor-pointer">
            <Plus className="h-4 w-4" />
            New
        </Button>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-medium mb-2">Search</h3>
        <div className="flex justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="text" placeholder="Search user..." className="pl-8 w-[300px]" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" className="gap-2">
              <X className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px] cursor-pointer" onClick={() => handleSort("code")}>
                <div className="flex items-center gap-1">
                    Reference Code
                    { 
                        sortColumn !== "code" ? (
                            <ChevronsUpDown className="ml-2 h-4 w-4" />
                        ) : (
                            <span className="ml-2 h-4 w-4 text-xs">
                            {sortDirection === "asc" ? (
                                <ChevronUp className="h-4 w-4" />
                            ) : (
                                <ChevronDown className="h-4 w-4" />
                            )}
                            </span>
                        )
                    }
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
                <div className="flex items-center gap-1">
                    Reference Name
                    { 
                        sortColumn !== "name" ? (
                            <ChevronsUpDown className="ml-2 h-4 w-4" />
                        ) : (
                            <span className="ml-2 h-4 w-4 text-xs">
                            {sortDirection === "asc" ? (
                                <ChevronUp className="h-4 w-4" />
                            ) : (
                                <ChevronDown className="h-4 w-4" />
                            )}
                            </span>
                        )
                    }
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("modules")}>
                <div className="flex items-center gap-1">
                    Associated Modules
                    { 
                        sortColumn !== "modules" ? (
                            <ChevronsUpDown className="ml-2 h-4 w-4" />
                        ) : (
                            <span className="ml-2 h-4 w-4 text-xs">
                            {sortDirection === "asc" ? (
                                <ChevronUp className="h-4 w-4" />
                            ) : (
                                <ChevronDown className="h-4 w-4" />
                            )}
                            </span>
                        )
                    }
                </div>
              </TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((item) => (
              <TableRow key={item.code}>
                <TableCell>{item.code}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {item.modules.map((module) => (
                      <Badge key={module} variant="outline" className="bg-gray-50">
                        {module}
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
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
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

      <AddReferenceDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAddReference={handleAddReference}
      />
    </>
  )
}