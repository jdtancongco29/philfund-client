"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"

interface Department {
  code: string
  name: string
  status: "Active" | "Inactive"
}

interface AddDepartmentFormProps {
  onSave: (department: Department) => void
  onCancel: () => void
}

export default function AddDepartmentForm({ onSave, onCancel }: AddDepartmentFormProps) {
  const [formData, setFormData] = useState<Department>({
    code: "",
    name: "",
    status: "Active",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, status: checked ? "Active" : "Inactive" }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Saving department:", formData)
    onSave(formData)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Add New Department</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="code" className="text-base">
            Department Code <span className="text-red-500">*</span>
          </label>
          <Input
            id="code"
            name="code"
            placeholder="Select department code"
            value={formData.code}
            onChange={handleInputChange}
            required
          />
          <p className="text-sm text-muted-foreground">A unique code to identify this department</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="name" className="text-base">
            Department Name <span className="text-red-500">*</span>
          </label>
          <Input
            id="name"
            name="name"
            placeholder="Enter department name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <p className="text-sm text-muted-foreground">The full name of the department</p>
        </div>

        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-medium">
                Status (Active) <span className="text-red-500">*</span>
              </h3>
              <p className="text-sm text-muted-foreground">This department is currently active.</p>
            </div>
            <Switch checked={formData.status === "Active"} onCheckedChange={handleSwitchChange} />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save Department</Button>
        </div>
      </form>
    </div>
  )
}