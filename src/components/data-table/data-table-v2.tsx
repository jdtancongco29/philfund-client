"use client"
import debounce from 'lodash.debounce';
import type React from "react"

import { useState, useEffect, useMemo } from "react"
import {
  CalendarIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ChevronsUpDownIcon,
  FileIcon,
  FilterIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  TableIcon,
  TrashIcon,
  XIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { DataTableFilterDialog } from "./data-table-filter-dialog"
// import { DataTableFilters } from "./data-table-filters"
import { Label } from "../ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Calendar } from "../ui/calendar"
import { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"

export type SearchDefinition = {
  title: string
  placeholder: string
  enableSearch?: boolean
}

export type DisplayCondition<T> = {
  value: T;
  label: string;
  className?: string;
};

export type ColumnDefinition<T> = {
  id: string
  header: string
  accessorKey: keyof T
  enableSorting?: boolean
  displayCondition?: DisplayCondition<any>[];
  cell?: (item: T) => React.ReactNode
}

export type FilterDefinition = {
  id: string
  label: string
  type: "select" | "input" | "date" | "dateRange"
  options?: { label: string; value: string }[]
  placeholder?: string
}

export type DataTableProps<T> = {
  title: string
  subtitle?: string
  data: T[]
  columns: ColumnDefinition<T>[]
  filters?: FilterDefinition[]
  search?: SearchDefinition
  onEdit?: (item: T) => void
  onDelete?: (item: T) => void
  onNew?: () => void
  idField?: keyof T
  enableNew?: boolean
  enablePdfExport?: boolean
  enableCsvExport?: boolean
  enableFilter?: boolean
  onPdfExport?: () => void
  onCsvExport?: () => void
  onPaginationChange?: (page: number) => void
  onRowCountChange?: (rows: number) => void
  onSearchChange?: (search: string) => void
  onLoading?: boolean
  onResetTable?: boolean
  totalCount: number
  perPage: number
  pageNumber: number
}

export function DataTableV2<T>({
  title,
  subtitle,
  data,
  columns,
  filters = [],
  search,
  onEdit,
  onDelete,
  onNew,
  idField = "id" as keyof T,
  enableNew = true,
  enablePdfExport = true,
  enableCsvExport = true,
  enableFilter = true,
  onPdfExport,
  onCsvExport,
  onLoading = false,
  onResetTable = false,
  totalCount,
  pageNumber,
  perPage,
  onPaginationChange,
  onRowCountChange,
  onSearchChange,
}: DataTableProps<T>) {
  // State for search, sorting, pagination, and filters
  const [searchQuery, setSearchQuery] = useState("")
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [currentPage, setCurrentPage] = useState(pageNumber ?? 1)
  const [rowsPerPage, setRowsPerPage] = useState(perPage ?? 10)
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({})
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);

  // Debounced function
  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        // Handle the debounced value (e.g., API call)
        if (onSearchChange) {
          onSearchChange(value);
        }
      }, 500), // 500ms debounce delay
    [onSearchChange]
  );

  // Watch searchQuery and call debounced function
  useEffect(() => {
    debouncedSearch(searchQuery);
    // Cleanup debounce on unmount
    return () => debouncedSearch.cancel();
  }, [searchQuery, debouncedSearch]);

  useEffect(() => {
    if (onPaginationChange) {
      onPaginationChange(currentPage);
    }
  }, [currentPage, onPaginationChange])

  // Reset to first page when search or filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, activeFilters])

  useEffect(() => {
    if (onResetTable) {
      if (currentPage != 0) {
        setCurrentPage(currentPage - 1);
      } else {
        setCurrentPage(1);
      }
    }
  }, [currentPage, onResetTable]);

  // Handle sorting
  const handleSort = (columnId: string) => {
    if (sortColumn === columnId) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(columnId)
      setSortDirection("asc")
    }
  }

  // Apply search filter
  const filteredBySearch = data.filter((item) => {
    if (!searchQuery) return true

    // Search across all visible columns
    return columns.some((column) => {
      const value = item[column.accessorKey]
      if (value === null || value === undefined) return false
      return String(value).toLowerCase().includes(searchQuery.toLowerCase())
    })
  })

  // Apply active filters
  const filteredData = filteredBySearch.filter((item) => {
    // If no filters are active, return all items
    if (Object.keys(activeFilters).length === 0) return true

    // Check each active filter
    return Object.entries(activeFilters).every(([filterId, filterValue]) => {
      if (!filterValue) return true

      const filter = filters.find((f) => f.id === filterId)
      if (!filter) return true

      const column = columns.find((col) => col.id === filterId)
      if (!column) return true

      const itemValue = item[column.accessorKey]

      switch (filter.type) {
        case "select":
          return itemValue === filterValue
        case "input":
          return String(itemValue).toLowerCase().includes(String(filterValue).toLowerCase())
        case "date":
          if (!filterValue) return true
          const itemDate = new Date(itemValue as string)
          const filterDate = new Date(filterValue)
          return (
            itemDate.getFullYear() === filterDate.getFullYear() &&
            itemDate.getMonth() === filterDate.getMonth() &&
            itemDate.getDate() === filterDate.getDate()
          )
        case "dateRange":
          if (!filterValue.from || !filterValue.to) return true
          const date = new Date(itemValue as string)
          return date >= filterValue.from && date <= filterValue.to
        default:
          return true
      }
    })
  })

  // Apply sorting
  // const sortedData = [...filteredData].sort((a, b) => {
  //   if (!sortColumn) return 0

  //   const column = columns.find((col) => col.id === sortColumn)
  //   if (!column) return 0

  //   const aValue = a[column.accessorKey]
  //   const bValue = b[column.accessorKey]

  //   if (aValue === bValue) return 0

  //   const modifier = sortDirection === "asc" ? 1 : -1

  //   if (aValue === null || aValue === undefined) return 1 * modifier
  //   if (bValue === null || bValue === undefined) return -1 * modifier

  //   if (typeof aValue === "string" && typeof bValue === "string") {
  //     return aValue.localeCompare(bValue) * modifier
  //   }

  //   return (aValue < bValue ? -1 : 1) * modifier
  // })

  // Apply pagination
  const totalPages = Math.ceil(totalCount / rowsPerPage)
  // const paginatedData = sortedData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
  const paginatedData = data;

  // Handle filter changes
  const handleFilterChange = (filterId: string, value: any) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterId]: value,
    }))
  }

  // Reset all filters
  const resetFilters = () => {
    setActiveFilters({})
    setSearchQuery("")
  }

  // Export handlers
  const handlePdfExport = () => {
    if (onPdfExport) {
      onPdfExport()
    } else {
      console.log("Export to PDF", filteredData)
    }
  }

  const handleCsvExport = () => {
    if (onCsvExport) {
      onCsvExport()
    } else {
      console.log("Export to CSV", filteredData)
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          {enablePdfExport && (
            <Button variant="outline" size="sm" onClick={handlePdfExport}>
              <FileIcon className="h-4 w-4" />
              PDF
            </Button>
          )}
          {enableCsvExport && (
            <Button variant="outline" size="sm" onClick={handleCsvExport}>
              <TableIcon className="h-4 w-4" />
              CSV
            </Button>
          )}
          {enableNew && (
            <Button size="sm" onClick={onNew}>
              <PlusIcon className="h-4 w-4" />
              New
            </Button>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div>
          <div className="flex gap-2">
            <div className="flex gap-2 flex-1">
              <div>
                {
                  search?.enableSearch && (
                    <>
                      <p className="mb-2 text-sm">{search?.title}</p>
                      <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder={search?.placeholder}
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 w-[300px]"
                        />
                      </div>
                    </>
                  )
                }
              </div>

              {
                enableFilter && filters.map((filter) => (
                  <div key={filter.id} className="space-y-2">
                    <Label className="text-sm font-medium">{filter.label}</Label>
                    {filter.type === "select" && (
                      <Select
                        value={activeFilters[filter.id] || ""}
                        onValueChange={(value) => handleFilterChange(filter.id, value)}
                      >
                        <SelectTrigger id={filter.id}>
                          <SelectValue placeholder={filter.placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          {filter.options?.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}

                    {filter.type === "input" && (
                      <Input
                        id={filter.id}
                        value={activeFilters[filter.id] || ""}
                        onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                        placeholder={filter.placeholder || `Enter ${filter.label}`}
                      />
                    )}

                    {filter.type === "date" && (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !activeFilters[filter.id] && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {activeFilters[filter.id] ? (
                              format(new Date(activeFilters[filter.id]), "PPP")
                            ) : (
                              <span>Select...</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={activeFilters[filter.id] ? new Date(activeFilters[filter.id]) : undefined}
                            onSelect={(date) => handleFilterChange(filter.id, date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    )}

                    {filter.type === "dateRange" && (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !activeFilters[filter.id]?.from && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {activeFilters[filter.id]?.from ? (
                              <>
                                {format(activeFilters[filter.id].from, "PPP")} -{" "}
                                {activeFilters[filter.id].to ? format(activeFilters[filter.id].to, "PPP") : ""}
                              </>
                            ) : (
                              <span>Select...</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="range"
                            selected={activeFilters[filter.id] as DateRange}
                            onSelect={(range) => handleFilterChange(filter.id, range)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  </div>
                ))
              }
            </div>
            {
              enableFilter && (
                <div className="flex gap-2 items-end">
                  <Button variant="outline" size="default" onClick={() => setIsFilterDialogOpen(true)} className="cursor-pointer">
                    <FilterIcon className="h-4 w-4" />
                    <span className="">Filter</span>
                  </Button>
                  <Button variant="outline" size="default" onClick={resetFilters} className="cursor-pointer">
                    <XIcon className="h-4 w-4" />
                    <span className="">Reset</span>
                  </Button>
                </div>
              )
            }
          </div>
        </div>
      </div>
      <div>
        {/* Active Filters Display */}
        {Object.keys(activeFilters).length > 0 && (
          <div className="flex flex-wrap gap-2">
            {Object.entries(activeFilters).map(([filterId, value]) => {
              const filter = filters.find((f) => f.id === filterId)
              if (!filter) return null

              let displayValue = ""
              if (filter.type === "select") {
                const option = filter.options?.find((opt) => opt.value === value)
                displayValue = option?.label || String(value)
              } else if (filter.type === "date") {
                displayValue = format(new Date(value), "PPP")
              } else if (filter.type === "dateRange" && value.from && value.to) {
                displayValue = `${format(value.from, "PPP")} - ${format(value.to, "PPP")}`
              } else {
                displayValue = String(value)
              }

              return (
                <div key={filterId} className="flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-sm">
                  <span>
                    {filter.label}: {displayValue}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4"
                    onClick={() => {
                      setActiveFilters((prev) => {
                        const newFilters = { ...prev }
                        delete newFilters[filterId]
                        return newFilters
                      })
                    }}
                  >
                    <XIcon className="h-3 w-3" />
                    <span className="sr-only">Remove filter</span>
                  </Button>
                </div>
              )
            })}
          </div>
        )}
      </div>
      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.id} className={column.enableSorting === false ? "" : "cursor-pointer"}>
                  <div
                    className="flex items-center"
                    onClick={() => column.enableSorting !== false && handleSort(column.id)}
                  >
                    {column.header}
                    {column.enableSorting !== false && (
                      <>
                        {sortColumn === column.id ? (
                          sortDirection === "asc" ? (
                            <ChevronUpIcon className="ml-2 h-4 w-4" />
                          ) : (
                            <ChevronDownIcon className="ml-2 h-4 w-4" />
                          )
                        ) : (
                          <ChevronsUpDownIcon className="ml-2 h-4 w-4 opacity-50" />
                        )}
                      </>
                    )}
                  </div>
                </TableHead>
              ))}
              {(onEdit || onDelete) && <TableHead className="w-[100px] text-right"></TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {onLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                  className="text-center py-4"
                >
                  Loading Data...
                </TableCell>
              </TableRow>
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="text-center py-4">
                  No data found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item) => (
                <TableRow key={String(item[idField])}>
                  {columns.map((column) => (
                    <TableCell key={`${String(item[idField])}-${column.id}`}>
                      {(() => {
                        const value = item[column.accessorKey];

                        // Find matching display condition
                        const match = column.displayCondition?.find(
                          (condition) => condition.value === value
                        );

                        const label = match?.label ?? String(value ?? "");
                        const className = match?.className;

                        const content = column.cell ? column.cell(item) : label;

                        return className ? <span className={className}>{content}</span> : content;
                      })()}
                    </TableCell>
                  ))}
                  {(onEdit || onDelete) && (
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {onEdit && (
                          <Button variant="ghost" size="icon" onClick={() => onEdit(item)}>
                            <PencilIcon className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                        )}
                        {onDelete && (
                          <Button variant="ghost" size="icon" onClick={() => onDelete(item)
                          }>
                            <TrashIcon className="h-4 w-4 text-destructive" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {
        !onLoading &&
        <div className="flex items-center justify-end gap-6">
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">Rows per page</p>
            <Select
              value={String(rowsPerPage)}
              onValueChange={(value) => {
                setRowsPerPage(Number(value))
                setCurrentPage(1);
                if (onRowCountChange) {
                  onRowCountChange(Number(value))
                }
              }}
            >
              <SelectTrigger className="h-8">
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
      }
      {/* Filter Dialog */}
      <DataTableFilterDialog
        open={isFilterDialogOpen}
        onOpenChange={setIsFilterDialogOpen}
        filters={filters}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
      />
    </div>
  )
}
