"use client"

import { useEffect, useState } from "react"
import { Check, ChevronsUpDown } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { apiRequest } from "@/lib/api"

interface ChartOfAccount {
  id: string
  code: string
  name: string
  description: string
  major_classification: string
  category: string
  is_header: boolean
  parent_id: string | null
  is_contra: boolean
  normal_balance: string
  special_classification: string
  status: boolean
}

interface COADropdownProps {
  value?: string
  onSelect: (coa: ChartOfAccount) => void
  placeholder?: string
  className?: string
  error?: boolean
}

export function COADropdown({
  value,
  onSelect,
  placeholder = "Select chart of account...",
  className,
  error = false,
}: COADropdownProps) {
  const [open, setOpen] = useState(false)
  const [chartOfAccounts, setChartOfAccounts] = useState<ChartOfAccount[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedCOA, setSelectedCOA] = useState<ChartOfAccount | null>(null)

  useEffect(() => {
    fetchChartOfAccounts()
  }, [])

  useEffect(() => {
    if (value && chartOfAccounts.length > 0) {
      const coa = chartOfAccounts.find((c) => c.id === value)
      setSelectedCOA(coa || null)
    }
  }, [value, chartOfAccounts])

  const fetchChartOfAccounts = async () => {
    setLoading(true)
    try {
      const response = await apiRequest<{ data: { chartOfAccounts: ChartOfAccount[] } }>(
        "get",
        "/coa",
        null,
        {
          useAuth: true,
          useBranchId: true,
        }
      )
      setChartOfAccounts(response.data.data.chartOfAccounts)
    } catch (error) {
      console.error("Error fetching chart of accounts:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = (coa: ChartOfAccount) => {
    setSelectedCOA(coa)
    onSelect(coa)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between",
            !selectedCOA && "text-muted-foreground",
            error && "border-red-500",
            className
          )}
        >
          {selectedCOA ? `${selectedCOA.code} - ${selectedCOA.name}` : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Search by name or code..." />
          <CommandList>
            <CommandEmpty>
              {loading ? "Loading chart of accounts..." : "No matching accounts found."}
            </CommandEmpty>
            <CommandGroup>
              {chartOfAccounts.map((coa) => (
                <CommandItem
                  key={coa.id}
                  value={`${coa.code} ${coa.name}`}
                  onSelect={() => handleSelect(coa)}
                  className="flex flex-col items-start gap-1"
                >
                  <div className="flex items-center gap-2 w-full">
                    <Check
                      className={cn(
                        "h-4 w-4",
                        selectedCOA?.id === coa.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex-1">
                      <div className="font-medium">
                        {coa.code} - {coa.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {coa.category} | {coa.normal_balance}
                      </div>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
