"use client"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"
import type { FilterDefinition } from "./data-table"

interface DataTableFiltersProps {
  filters: FilterDefinition[]
  activeFilters: Record<string, any>
  onFilterChange: (filterId: string, value: any) => void
}

export function DataTableFilters({ filters, activeFilters, onFilterChange }: DataTableFiltersProps) {
  if (!filters.length) return null

  return (
    <div className="flex flex-wrap gap-4 py-4">
      {filters.map((filter) => (
        <div key={filter.id} className="flex flex-col gap-1.5">
          <Label htmlFor={filter.id}>{filter.label}</Label>
          <div className="min-w-[200px]">
            {filter.type === "select" && (
              <Select
                value={activeFilters[filter.id] || ""}
                onValueChange={(value) => onFilterChange(filter.id, value)}
              >
                <SelectTrigger id={filter.id}>
                  <SelectValue placeholder={filter.placeholder || `Select ${filter.label}`} />
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
                onChange={(e) => onFilterChange(filter.id, e.target.value)}
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
                      <span>{filter.placeholder || "Pick a date"}</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={activeFilters[filter.id] ? new Date(activeFilters[filter.id]) : undefined}
                    onSelect={(date) => onFilterChange(filter.id, date)}
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
                      <span>{filter.placeholder || "Pick a date range"}</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={activeFilters[filter.id] as DateRange}
                    onSelect={(range) => onFilterChange(filter.id, range)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
