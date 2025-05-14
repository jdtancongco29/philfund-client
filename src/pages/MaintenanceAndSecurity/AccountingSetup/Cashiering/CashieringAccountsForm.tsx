"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Define the type for account data
interface AccountField {
  accountCode: string
  selectedAccount: string
}

// Define the type for the form data
interface FormData {
  outstandingCashFundSalary: AccountField
  outstandingCashFundBonus: AccountField
  cohEncashmentFund: AccountField
  cohInternalCashier: AccountField
  pettyCashFundTaxable: AccountField
  pettyCashFundNonTaxable: AccountField
}

// Sample account options for the dropdowns
const accountOptions = [
  { value: "1001", label: "Cash on Hand - Main" },
  { value: "1002", label: "Cash on Hand - Branch 1" },
  { value: "1003", label: "Cash on Hand - Branch 2" },
  { value: "1010", label: "Petty Cash - Main Office" },
  { value: "1011", label: "Petty Cash - Branch 1" },
  { value: "1020", label: "Salary Fund" },
  { value: "1021", label: "Bonus Fund" },
]

export default function CashieringAccountsForm() {
  // Initialize form state
  const [formData, setFormData] = useState<FormData>({
    outstandingCashFundSalary: { accountCode: "", selectedAccount: "" },
    outstandingCashFundBonus: { accountCode: "", selectedAccount: "" },
    cohEncashmentFund: { accountCode: "", selectedAccount: "" },
    cohInternalCashier: { accountCode: "", selectedAccount: "" },
    pettyCashFundTaxable: { accountCode: "", selectedAccount: "" },
    pettyCashFundNonTaxable: { accountCode: "", selectedAccount: "" },
  })

  // Handle input change for account code fields
  const handleAccountCodeChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        accountCode: value,
      },
    }))
  }

  // Handle select change for account dropdowns
  const handleSelectChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        selectedAccount: value,
      },
    }))

    // Log the selection
    console.log(`Selected ${field}: ${value}`)
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Saving accounts:", formData)
  }

  // Handle cancel button click
  const handleCancel = () => {
    console.log("Form cancelled")
  }

  return (
    <div className="max-w-3xl">
      <div className="border rounded-lg p-6 h-[calc(100vh - 125px)]">
        <form onSubmit={handleSubmit} className="flex flex-col h-full justify-between">
            <div className="space-y-6">
                <h1 className="text-2xl font-bold mb-6">Cashiering Accounts</h1>
                {/* Outstanding Cash Fund (Salary) */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium">
                    Outstanding Cash Fund (Salary) <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        placeholder="Account Code"
                        value={formData.outstandingCashFundSalary.accountCode}
                        onChange={(e) => handleAccountCodeChange("outstandingCashFundSalary", e.target.value)}
                        required
                    />
                    <Select
                        value={formData.outstandingCashFundSalary.selectedAccount}
                        onValueChange={(value) => handleSelectChange("outstandingCashFundSalary", value)}
                        required
                    >
                        <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                        {accountOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                            {option.label}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    </div>
                </div>

                {/* Outstanding Cash Fund (Bonus) */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium">
                    Outstanding Cash Fund (Bonus) <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        placeholder="Account Code"
                        value={formData.outstandingCashFundBonus.accountCode}
                        onChange={(e) => handleAccountCodeChange("outstandingCashFundBonus", e.target.value)}
                        required
                    />
                    <Select
                        value={formData.outstandingCashFundBonus.selectedAccount}
                        onValueChange={(value) => handleSelectChange("outstandingCashFundBonus", value)}
                        required
                    >
                        <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                        {accountOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                            {option.label}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    </div>
                </div>

                {/* COH: Encashment Fund */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium">
                    COH: Encashment Fund <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        placeholder="Account Code"
                        value={formData.cohEncashmentFund.accountCode}
                        onChange={(e) => handleAccountCodeChange("cohEncashmentFund", e.target.value)}
                        required
                    />
                    <Select
                        value={formData.cohEncashmentFund.selectedAccount}
                        onValueChange={(value) => handleSelectChange("cohEncashmentFund", value)}
                        required
                    >
                        <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                        {accountOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                            {option.label}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    </div>
                </div>

                {/* COH: Internal Cashier */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium">
                    COH: Internal Cashier <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        placeholder="Account Code"
                        value={formData.cohInternalCashier.accountCode}
                        onChange={(e) => handleAccountCodeChange("cohInternalCashier", e.target.value)}
                        required
                    />
                    <Select
                        value={formData.cohInternalCashier.selectedAccount}
                        onValueChange={(value) => handleSelectChange("cohInternalCashier", value)}
                        required
                    >
                        <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                        {accountOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                            {option.label}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    </div>
                </div>

                {/* Petty Cash Fund (Taxable) */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium">
                    Petty Cash Fund (Taxable) <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        placeholder="Account Code"
                        value={formData.pettyCashFundTaxable.accountCode}
                        onChange={(e) => handleAccountCodeChange("pettyCashFundTaxable", e.target.value)}
                        required
                    />
                    <Select
                        value={formData.pettyCashFundTaxable.selectedAccount}
                        onValueChange={(value) => handleSelectChange("pettyCashFundTaxable", value)}
                        required
                    >
                        <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                        {accountOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                            {option.label}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    </div>
                </div>

                {/* Petty Cash Fund (Non-Taxable) */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium">
                    Petty Cash Fund (Non-Taxable) <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        placeholder="Account Code"
                        value={formData.pettyCashFundNonTaxable.accountCode}
                        onChange={(e) => handleAccountCodeChange("pettyCashFundNonTaxable", e.target.value)}
                        required
                    />
                    <Select
                        value={formData.pettyCashFundNonTaxable.selectedAccount}
                        onValueChange={(value) => handleSelectChange("pettyCashFundNonTaxable", value)}
                        required
                    >
                        <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                        {accountOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                            {option.label}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    </div>
                </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
                </Button>
                <Button type="submit">Save Accounts</Button>
            </div>
        </form>
      </div>
    </div>
  )
}