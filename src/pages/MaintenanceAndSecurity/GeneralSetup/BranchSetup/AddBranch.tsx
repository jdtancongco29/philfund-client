"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"

interface AddBranchProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddBranch({ open, onOpenChange }: AddBranchProps) {
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>(["Department 1"])
  const [isActive, setIsActive] = useState(true)

  const handleRemoveDepartment = (department: string) => {
    setSelectedDepartments(selectedDepartments.filter((dep) => dep !== department))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add New Branch</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="branchCode" className="flex items-center gap-1">
              Branch Code <span className="text-red-500">*</span>
            </Label>
            <Input id="branchCode" placeholder="BR132154" />
            <p className="text-sm text-muted-foreground">A unique code to identify this branch</p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="branchName" className="flex items-center gap-1">
              Branch Name <span className="text-red-500">*</span>
            </Label>
            <Input id="branchName" placeholder="Enter branch name" />
            <p className="text-sm text-muted-foreground">The full name of the branch</p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="address" className="flex items-center gap-1">
              Address <span className="text-red-500">*</span>
            </Label>
            <Input id="address" placeholder="Enter branch address" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="contact" className="flex items-center gap-1">
              Contact <span className="text-red-500">*</span>
            </Label>
            <Input id="contact" placeholder="Enter contact number" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email" className="flex items-center gap-1">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input id="email" placeholder="Enter email address" type="email" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="city" className="flex items-center gap-1">
              City/Municipality <span className="text-red-500">*</span>
            </Label>
            <Input id="city" placeholder="Enter municipality or city" />
            <p className="text-sm text-muted-foreground">For legal documents</p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="departments" className="flex items-center gap-1">
              Add Departments <span className="text-red-500">*</span>
            </Label>
            <div className="flex flex-wrap items-center gap-2 rounded-md border p-2">
              {selectedDepartments.map((department) => (
                <Badge key={department} variant="secondary" className="flex items-center gap-1">
                  {department}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveDepartment(department)} />
                </Badge>
              ))}
              <Input
                id="departments"
                placeholder="Select Departments"
                className="flex-1 border-0 p-0 shadow-none focus-visible:ring-0"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Select the departments that will be available in this branch
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="status" className="flex items-center gap-1">
              Status (Active) <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center justify-between rounded-md border p-3">
              <p className="text-sm">This branch is currently active.</p>
              <Switch id="status" checked={isActive} onCheckedChange={setIsActive} />
            </div>
          </div>
        </div>
        <DialogFooter className="flex sm:justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="mr-2">
            Cancel
          </Button>
          <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
            Save Branch
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}