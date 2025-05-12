"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for select options
const debitOptions = [
  { value: "debit1", label: "Debit Account 1" },
  { value: "debit2", label: "Debit Account 2" },
  { value: "debit3", label: "Debit Account 3" },
]

const creditOptions = [
  { value: "credit1", label: "Credit Account 1" },
  { value: "credit2", label: "Credit Account 2" },
  { value: "credit3", label: "Credit Account 3" },
]

interface AddNewEntryDialogProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (data: { entryName: string; debateName: string; creditName: string }) => void
}

export default function AddNewEntryDialog({ isOpen, onClose, onAdd }: AddNewEntryDialogProps) {
  const [entryName, setEntryName] = useState("")
  const [debateName, setDebateName] = useState("")
  const [creditName, setCreditName] = useState("")

  const handleSubmit = () => {
    if (entryName && debateName && creditName) {
      onAdd({ entryName, debateName, creditName })
      resetForm()
    }
  }

  const resetForm = () => {
    setEntryName("")
    setDebateName("")
    setCreditName("")
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Add New Entry</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="entry-name">
              Entry Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="entry-name"
              placeholder="Enter entry name"
              value={entryName}
              onChange={(e) => setEntryName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="debate-name">
              Debate Name <span className="text-red-500">*</span>
            </Label>
            <Select value={debateName} onValueChange={setDebateName}>
              <SelectTrigger id="debate-name">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {debitOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="credit-name">
              Credit Name <span className="text-red-500">*</span>
            </Label>
            <Select value={creditName} onValueChange={setCreditName}>
              <SelectTrigger id="credit-name">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {creditOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="flex justify-end space-x-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!entryName || !debateName || !creditName}>
            Add Entry
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}