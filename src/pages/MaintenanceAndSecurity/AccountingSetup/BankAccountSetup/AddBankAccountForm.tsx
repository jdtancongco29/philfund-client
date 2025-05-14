"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

interface AddBankAccountFormProps {
  onClose: () => void
}

export default function AddBankAccountForm({ onClose }: AddBankAccountFormProps) {
  const [formData, setFormData] = useState({
    bankCode: "",
    bankName: "",
    address: "",
    branch: "",
    accountCode: "",
    chartOfAccount: "",
    accountType: "",
    isActive: true,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isActive: checked }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Saving bank account:", formData)
    onClose()
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Add New Bank Account</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="bankCode" className="text-base">
            Bank Code <span className="text-red-500">*</span>
          </Label>
          <Input
            id="bankCode"
            name="bankCode"
            placeholder="Enter bank code"
            value={formData.bankCode}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bankName" className="text-base">
            Bank Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="bankName"
            name="bankName"
            placeholder="Enter bank name"
            value={formData.bankName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address" className="text-base">
            Address <span className="text-red-500">*</span>
          </Label>
          <Input
            id="address"
            name="address"
            placeholder="Bank address"
            value={formData.address}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="branch" className="text-base">
            Branch <span className="text-red-500">*</span>
          </Label>
          <Select value={formData.branch} onValueChange={(value) => handleSelectChange("branch", value)} required>
            <SelectTrigger id="branch" className="w-full">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="main">Main Branch</SelectItem>
              <SelectItem value="makati">Makati Branch</SelectItem>
              <SelectItem value="ortigas">Ortigas Branch</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="chartOfAccount" className="text-base">
            Chart of Account <span className="text-red-500">*</span>
          </Label>
          <div className="grid grid-cols-2 gap-4">
            <Input
              id="accountCode"
              name="accountCode"
              placeholder="Account Code"
              value={formData.accountCode}
              onChange={handleInputChange}
            />
            <Select
              value={formData.chartOfAccount}
              onValueChange={(value) => handleSelectChange("chartOfAccount", value)}
              required
            >
              <SelectTrigger id="chartOfAccount">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1010">1010 - Cash in Bank - BDO</SelectItem>
                <SelectItem value="1011">1011 - Cash in Bank - BPI</SelectItem>
                <SelectItem value="1012">1012 - Cash in Bank - Metrobank</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="accountType" className="text-base">
            Type of bank account <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.accountType}
            onValueChange={(value) => handleSelectChange("accountType", value)}
            required
          >
            <SelectTrigger id="accountType" className="w-full">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="savings">Savings Account</SelectItem>
              <SelectItem value="checking">Checking Account</SelectItem>
              <SelectItem value="time">Time Deposit</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-medium">
                Status (Active) <span className="text-red-500">*</span>
              </h3>
              <p className="text-sm text-muted-foreground">This department is currently active.</p>
            </div>
            <Switch checked={formData.isActive} onCheckedChange={handleSwitchChange} />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Save Journal Entry</Button>
        </div>
      </form>
    </div>
  )
}