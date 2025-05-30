"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { X } from 'lucide-react'
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

interface BranchSelectionDialogProps {
  open: boolean
  onClose: () => void
  onSelect: (branches: Branch[]) => void
  selectedBranchIds?: string[]
  multiple?: boolean
}

export function BranchSelectionDialog({
  open,
  onClose,
  onSelect,
  selectedBranchIds = [],
  multiple = true,
}: BranchSelectionDialogProps) {
  const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [tempSelectedIds, setTempSelectedIds] = useState<string[]>(selectedBranchIds)

  useEffect(() => {
    if (open) {
      fetchBranches()
      setTempSelectedIds(selectedBranchIds)
    }
  }, [open, selectedBranchIds])

  const fetchBranches = async () => {
    setLoading(true)
    try {
      const response = await apiRequest<{ data: { branches: Branch[] } }>("get", "/branch", null, {
        useAuth: true,
        useBranchId: true,
      })
      setBranches(response.data.data.branches)
    } catch (error) {
      console.error("Error fetching branches:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredBranches = branches.filter(
    (branch) =>
      branch.name.toLowerCase().includes(search.toLowerCase()) ||
      branch.code.toLowerCase().includes(search.toLowerCase()) ||
      branch.city.toLowerCase().includes(search.toLowerCase()),
  )

  const handleBranchToggle = (branchId: string) => {
    if (multiple) {
      setTempSelectedIds((prev) =>
        prev.includes(branchId) ? prev.filter((id) => id !== branchId) : [...prev, branchId],
      )
    } else {
      setTempSelectedIds([branchId])
    }
  }

  const handleConfirm = () => {
    const selectedBranches = branches.filter((branch) => tempSelectedIds.includes(branch.id))
    onSelect(selectedBranches)
    onClose()
  }

  const handleSelectAll = () => {
    if (tempSelectedIds.length === filteredBranches.length) {
      setTempSelectedIds([])
    } else {
      setTempSelectedIds(filteredBranches.map((branch) => branch.id))
    }
  }

  const selectedBranches = branches.filter((branch) => tempSelectedIds.includes(branch.id))

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{multiple ? "Select Branches" : "Select Branch"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden">
          <Input placeholder="Search branches..." value={search} onChange={(e) => setSearch(e.target.value)} />

          {multiple && selectedBranches.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium">Selected Branches ({selectedBranches.length})</div>
              <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto">
                {selectedBranches.map((branch) => (
                  <Badge key={branch.id} variant="secondary" className="flex items-center gap-1">
                    {branch.name}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => handleBranchToggle(branch.id)} />
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {multiple && (
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                disabled={loading || filteredBranches.length === 0}
              >
                {tempSelectedIds.length === filteredBranches.length ? "Deselect All" : "Select All"}
              </Button>
              <span className="text-sm text-muted-foreground">
                {tempSelectedIds.length} of {filteredBranches.length} selected
              </span>
            </div>
          )}

          <div className="flex-1 overflow-y-auto space-y-2 max-h-[300px]">
            {loading ? (
              <p className="text-center py-4">Loading branches...</p>
            ) : filteredBranches.length === 0 ? (
              <p className="text-center py-4">No branches found.</p>
            ) : (
              filteredBranches.map((branch) => (
                <div
                  key={branch.id}
                  className="flex items-center space-x-3 p-3 border rounded hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleBranchToggle(branch.id)}
                >
                  {multiple && (
                    <Checkbox
                      checked={tempSelectedIds.includes(branch.id)}
                      onChange={() => handleBranchToggle(branch.id)}
                    />
                  )}
                  <div className="flex-1">
                    <div className="font-semibold">{branch.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {branch.code} • {branch.city} • {branch.contact}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={loading}>
            {multiple
              ? `Select ${tempSelectedIds.length} Branch${tempSelectedIds.length !== 1 ? "es" : ""}`
              : "Select Branch"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
