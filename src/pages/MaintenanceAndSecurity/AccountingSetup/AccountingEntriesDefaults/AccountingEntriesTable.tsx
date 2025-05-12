"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    ChevronDown,
    ChevronFirst,
    ChevronLast,
    ChevronLeft,
    ChevronRight,
    ChevronUp,
    ChevronsUpDown,
    Pencil,
    Plus,
    Search,
    Trash2,
} from "lucide-react"
import AddNewEntryDialog from "./AddNewEntryDialog"

// Mock data for entries
const mockEntries = Array.from({ length: 20 }).map((_, i) => ({
    id: i + 1,
    name: `Entry Name ${i + 1}`,
}))

export default function AccountingEntriesTable() {
    type SortDirection = "asc" | "desc" | null
    type SortColumn = "name" | null

    const [sortColumn, setSortColumn] = useState<SortColumn>("name")
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [entries, setEntries] = useState(mockEntries)

    // Handle sorting
    const handleSort = (column: SortColumn) => {
        if (sortColumn === column) {
        // Toggle direction if same column
        if (sortDirection === "asc") {
            setSortDirection("desc")
        } else if (sortDirection === "desc") {
            setSortDirection("asc")
        }
        } else {
        // Set new column and default to ascending
        setSortColumn(column)
        setSortDirection("asc")
        }
    }

    // Get sort icon based on current sort state
    const getSortIcon = (column: SortColumn) => {
        if (sortColumn !== column) {
        return <ChevronsUpDown className="inline h-4 w-4 ml-1" />
        }

        return sortDirection === "asc" ? (
        <ChevronUp className="inline h-4 w-4 ml-1" />
        ) : (
        <ChevronDown className="inline h-4 w-4 ml-1" />
        )
    }

    // Filter entries based on search query
    const filteredEntries = entries.filter((entry) => entry.name.toLowerCase().includes(searchQuery.toLowerCase()))

    // Sort entries
    const sortedEntries = [...filteredEntries].sort((a, b) => {
        if (sortColumn === "name") {
        const compareResult = a.name.localeCompare(b.name)
        return sortDirection === "asc" ? compareResult : -compareResult
        }
        return 0
    })

    // Calculate pagination
    const totalPages = Math.ceil(sortedEntries.length / rowsPerPage)
    const startIndex = (currentPage - 1) * rowsPerPage
    const paginatedEntries = sortedEntries.slice(startIndex, startIndex + rowsPerPage)

    // Handle adding a new entry
    const handleAddEntry = (entryData: { entryName: string; debateName: string; creditName: string }) => {
        const newEntry = {
        id: entries.length + 1,
        name: entryData.entryName,
        }
        setEntries([...entries, newEntry])
        setIsAddModalOpen(false)
    }

    // Handle deleting an entry
    const handleDeleteEntry = (id: number) => {
            setEntries(entries.filter((entry) => entry.id !== id))
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Accounting Entries Default</h1>
                <Button size="sm" onClick={() => setIsAddModalOpen(true)} className="cursor-pointer">
                    <Plus className="h-4 w-4" />
                    New
                </Button>
            </div>

            <div className="space-y-4">
                <div>
                    <h2 className="text-sm font-medium mb-2">Search</h2>
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

                <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
                            Entry Name {getSortIcon("name")}
                            </TableHead>
                            <TableHead className="w-[100px]"></TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {paginatedEntries.length > 0 ? (
                            paginatedEntries.map((entry) => (
                            <TableRow key={entry.id}>
                                <TableCell>{entry.name}</TableCell>
                                <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    <Button variant="ghost" size="icon">
                                    <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => handleDeleteEntry(entry.id)}>
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </div>
                                </TableCell>
                            </TableRow>
                            ))
                        ) : (
                            <TableRow>
                            <TableCell colSpan={2} className="text-center py-4">
                                No entries found
                            </TableCell>
                            </TableRow>
                        )}
                        </TableBody>
                    </Table>
                </div>

                <div className="flex items-center justify-end gap-6">
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">Rows per page</span>
                        <Select
                        value={rowsPerPage.toString()}
                        onValueChange={(value) => {
                            setRowsPerPage(Number(value))
                            setCurrentPage(1)
                        }}
                        >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={rowsPerPage.toString()} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="5">5</SelectItem>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages}
                        </span>
                        <div className="flex items-center space-x-1">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setCurrentPage(1)}
                            disabled={currentPage === 1}
                        >
                            <ChevronFirst className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={currentPage === totalPages}
                        >
                            <ChevronLast className="h-4 w-4" />
                        </Button>
                        </div>
                    </div>
                </div>
            </div>

            <AddNewEntryDialog isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={handleAddEntry} />
        </div>
    )
}