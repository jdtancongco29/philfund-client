"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface AddReferenceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddReference: (reference: { code: string; name: string; modules: string[] }) => void
}

export function AddReferenceDialog({ open, onOpenChange, onAddReference }: AddReferenceDialogProps) {
  const [code, setCode] = useState("")
  const [name, setName] = useState("")
  const [module, setModule] = useState("")
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  const availableModules = [
    "Journal Module",
    "Lending Module",
    "Payroll Module",
    "POS / Sales Module",
    "Bonus Module",
    "AP Module",
  ]

  const handleSubmit = () => {
    const newErrors: Record<string, boolean> = {}

    if (!code.trim()) newErrors.code = true
    if (!name.trim()) newErrors.name = true
    if (!module) newErrors.module = true

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      onAddReference({
        code: code.trim(),
        name: name.trim(),
        modules: [module],
      })

      // Reset form
      setCode("")
      setName("")
      setModule("")
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add New Reference</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="reference-code" className={cn(errors.code && "text-red-500")}>
              Reference Code <span className="text-red-500">*</span>
            </Label>
            <Input
              id="reference-code"
              placeholder="Enter reference code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className={cn(errors.code && "border-red-500")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reference-name" className={cn(errors.name && "text-red-500")}>
              Reference Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="reference-name"
              placeholder="Enter reference name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={cn(errors.name && "border-red-500")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="module-used" className={cn(errors.module && "text-red-500")}>
              Module Used <span className="text-red-500">*</span>
            </Label>
            <Select value={module} onValueChange={setModule}>
              <SelectTrigger id="module-used" className={`w-full ${cn(errors.module && "border-red-500")}`}>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {availableModules.map((mod) => (
                  <SelectItem key={mod} value={mod}>
                    {mod}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-600">
            Add Reference
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}