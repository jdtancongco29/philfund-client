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

interface Department {
  id: string
  name: string
}

interface Branch {
  id: string
  code: string
  name: string
  email: string
  address: string
  contact: string
  city: string
  status: boolean
  departments: Department[]
}

interface BranchDropdownProps {
  value?: string
  onSelect: (branch: Branch) => void
  placeholder?: string
  className?: string
  error?: boolean
}

export function BranchDropdown({
  value,
  onSelect,
  placeholder = "Select branch...",
  className,
  error = false,
}: BranchDropdownProps) {
  const [open, setOpen] = useState(false)
  const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null)

  useEffect(() => {
    fetchBranches()
  }, [])

  useEffect(() => {
    if (value && branches.length > 0) {
      const branch = branches.find((b) => b.id === value)
      setSelectedBranch(branch || null)
    }
  }, [value, branches])

  const fetchBranches = async () => {
    setLoading(true)
    try {
      const response = await apiRequest<{ data: { branches: Branch[] } }>(
        "get",
        "/branch",
        null,
        {
          useAuth: true,
          useBranchId: true,
        }
      )
      setBranches(response.data.data.branches)
    } catch (error) {
      console.error("Error fetching branches:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = (branch: Branch) => {
    setSelectedBranch(branch)
    onSelect(branch)
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
            !selectedBranch && "text-muted-foreground",
            error && "border-red-500",
            className
          )}
        >
          {selectedBranch ? selectedBranch.name : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Search branch..." />
          <CommandList>
            <CommandEmpty>
              {loading ? "Loading branches..." : "No branch found."}
            </CommandEmpty>
            <CommandGroup>
              {branches.map((branch) => (
                <CommandItem
                  key={branch.id}
                  value={branch.name}
                  onSelect={() => handleSelect(branch)}
                  className="flex flex-col items-start gap-1"
                >
                  <div className="flex items-center gap-2 w-full">
                    <Check
                      className={cn(
                        "h-4 w-4",
                        selectedBranch?.id === branch.id
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    <div className="flex-1">
                      <div className="font-medium">{branch.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {branch.city} • {branch.contact}
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
