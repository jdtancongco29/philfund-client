"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"
import type { FilterDefinition } from "./data-table"

interface DataTableFilterDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  filters: FilterDefinition[]
  activeFilters: Record<string, any>
  onFilterChange: (filterId: string, value: any) => void
}

export function DataTableFilterDialog({
  open,
  onOpenChange,
  filters,
  activeFilters,
  onFilterChange,
}: DataTableFilterDialogProps) {
  const [localFilters, setLocalFilters] = useState<Record<string, any>>(activeFilters)

  const handleApply = () => {
    // Apply all local filters to the parent component
    Object.entries(localFilters).forEach(([filterId, value]) => {
      onFilterChange(filterId, value)
    })
    onOpenChange(false)
  }

  const handleReset = () => {
    setLocalFilters({})
  }

  const handleLocalFilterChange = (filterId: string, value: any) => {
    setLocalFilters((prev) => ({
      ...prev,
      [filterId]: value,
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Filter</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {filters.map((filter) => (
            <div key={filter.id} className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={filter.id} className="text-right">
                {filter.label}
              </Label>
              <div className="col-span-3">
                {filter.type === "select" && (
                  <Select
                    value={localFilters[filter.id] || ""}
                    onValueChange={(value) => handleLocalFilterChange(filter.id, value)}
                  >
                    <SelectTrigger id={filter.id}>
                      <SelectValue placeholder={filter.placeholder || `Select ${filter.label}`} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All</SelectItem>
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
                    value={localFilters[filter.id] || ""}
                    onChange={(e) => handleLocalFilterChange(filter.id, e.target.value)}
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
                          !localFilters[filter.id] && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {localFilters[filter.id] ? (
                          format(new Date(localFilters[filter.id]), "PPP")
                        ) : (
                          <span>{filter.placeholder || "Pick a date"}</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={localFilters[filter.id] ? new Date(localFilters[filter.id]) : undefined}
                        onSelect={(date) => handleLocalFilterChange(filter.id, date)}
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
                          !localFilters[filter.id]?.from && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {localFilters[filter.id]?.from ? (
                          <>
                            {format(localFilters[filter.id].from, "PPP")} -{" "}
                            {localFilters[filter.id].to ? format(localFilters[filter.id].to, "PPP") : ""}
                          </>
                        ) : (
                          <span>{filter.placeholder || "Pick a date range"}</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="range"
                        selected={localFilters[filter.id] as DateRange}
                        onSelect={(range) => handleLocalFilterChange(filter.id, range)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button onClick={handleApply}>Apply Filters</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
