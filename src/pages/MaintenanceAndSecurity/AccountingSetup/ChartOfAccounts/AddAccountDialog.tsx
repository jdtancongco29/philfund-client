"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface AccountData {
  code: string
  name: string
  classification: string
  subGrouping: string
  normalBalance: "Debit" | "Credit"
  contra: "Yes" | "No"
  branch: string[]
}

interface AddAccountDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddAccount: (account: AccountData) => void
}

export function AddAccountDialog({ open, onOpenChange, onAddAccount }: AddAccountDialogProps) {
  const [accountType, setAccountType] = useState<"header" | "subsidiary">("subsidiary")
  const [normalBalance, setNormalBalance] = useState<"Debit" | "Credit">("Debit")
  const [isContraAccount, setIsContraAccount] = useState(false)
  const [selectedBranches, setSelectedBranches] = useState<string[]>(["Branch 1"])
  const [branchInput, setBranchInput] = useState("")
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    majorClassification: "",
    category: "",
    headerAccount: "",
    specialClassification: "",
    description: "",
  })
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  const majorClassifications = ["Assets", "Liabilities", "Equity", "Income", "Expense"]
  const categories = ["Current Assets", "Fixed Assets", "Current Liabilities", "Long-term Liabilities"]
  const headerAccounts = ["Cash and Cash Equivalents", "Accounts Receivable", "Inventory", "Fixed Assets"]
  const specialClassifications = ["Operating", "Non-operating", "Restricted", "Unrestricted"]

  const handleInputChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    })
    // Clear error when user types
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: false,
      })
    }
  }

  const handleAddBranch = () => {
    if (branchInput.trim() && !selectedBranches.includes(branchInput.trim())) {
      setSelectedBranches([...selectedBranches, branchInput.trim()])
      setBranchInput("")
    }
  }

  const handleRemoveBranch = (branch: string) => {
    setSelectedBranches(selectedBranches.filter((b) => b !== branch))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddBranch()
    }
  }

  const handleSubmit = () => {
    const newErrors: Record<string, boolean> = {}

    // Validate required fields
    if (!formData.majorClassification) newErrors.majorClassification = true
    if (!formData.category) newErrors.category = true
    if (accountType === "subsidiary" && !formData.headerAccount) newErrors.headerAccount = true
    if (!formData.code.trim()) newErrors.code = true
    if (!formData.name.trim()) newErrors.name = true
    if (!formData.description.trim()) newErrors.description = true
    if (!formData.specialClassification) newErrors.specialClassification = true
    if (selectedBranches.length === 0) newErrors.branch = true

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      // Create subgrouping based on category
      const subGrouping = formData.category

      onAddAccount({
        code: formData.code,
        name: formData.name,
        classification: formData.majorClassification,
        subGrouping,
        normalBalance,
        contra: isContraAccount ? "Yes" : "No",
        branch: selectedBranches,
      })

      // Reset form
      setFormData({
        code: "",
        name: "",
        majorClassification: "",
        category: "",
        headerAccount: "",
        specialClassification: "",
        description: "",
      })
      setAccountType("subsidiary")
      setNormalBalance("Debit")
      setIsContraAccount(false)
      setSelectedBranches(["Branch 1"])
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add New Account</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
          <div className="space-y-2">
            <Label htmlFor="major-classification" className={cn(errors.majorClassification && "text-red-500")}>
              Major Classification <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.majorClassification}
              onValueChange={(value) => handleInputChange("majorClassification", value)}
            >
              <SelectTrigger id="major-classification" className={cn(errors.majorClassification && "border-red-500")}>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {majorClassifications.map((classification) => (
                  <SelectItem key={classification} value={classification}>
                    {classification}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className={cn(errors.category && "text-red-500")}>
              Category <span className="text-red-500">*</span>
            </Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
              <SelectTrigger id="category" className={cn(errors.category && "border-red-500")}>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className={cn(errors.headerAccount && "text-red-500")}>
              Header <span className="text-red-500">*</span>
            </Label>
            <RadioGroup
              value={accountType}
              onValueChange={(value) => setAccountType(value as "header" | "subsidiary")}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="header" id="header-account" />
                <Label htmlFor="header-account">Header Account</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="subsidiary" id="subsidiary-account" />
                <Label htmlFor="subsidiary-account">Subsidiary Account</Label>
              </div>
            </RadioGroup>
          </div>

          {accountType === "subsidiary" && (
            <div className="space-y-2">
              <Label htmlFor="header-account-select" className={cn(errors.headerAccount && "text-red-500")}>
                Header account <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.headerAccount}
                onValueChange={(value) => handleInputChange("headerAccount", value)}
              >
                <SelectTrigger id="header-account-select" className={cn(errors.headerAccount && "border-red-500")}>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  {headerAccounts.map((account) => (
                    <SelectItem key={account} value={account}>
                      {account}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label className={cn(errors.normalBalance && "text-red-500")}>
              Normal Balance <span className="text-red-500">*</span>
            </Label>
            <RadioGroup
              value={normalBalance}
              onValueChange={(value) => setNormalBalance(value as "Debit" | "Credit")}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Debit" id="debit" />
                <Label htmlFor="debit">Debit</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Credit" id="credit" />
                <Label htmlFor="credit">Credit</Label>
              </div>
            </RadioGroup>
            <p className="text-sm text-muted-foreground">The normal balance side for this account</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="account-code" className={cn(errors.code && "text-red-500")}>
              Account Code <span className="text-red-500">*</span>
            </Label>
            <Input
              id="account-code"
              placeholder="Enter account code"
              value={formData.code}
              onChange={(e) => handleInputChange("code", e.target.value)}
              className={cn(errors.code && "border-red-500")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="account-name" className={cn(errors.name && "text-red-500")}>
              Account Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="account-name"
              placeholder="Enter account name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={cn(errors.name && "border-red-500")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className={cn(errors.description && "text-red-500")}>
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Enter a description of the account and when to use it."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className={cn(errors.description && "border-red-500")}
            />
          </div>

          <div className="flex items-start space-x-2 pt-2">
            <Checkbox
              id="contra-account"
              checked={isContraAccount}
              onCheckedChange={(checked) => setIsContraAccount(checked as boolean)}
            />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="contra-account">Contra Account</Label>
              <p className="text-sm text-muted-foreground">
                Check this if the account is a contra account (reduces the balance of another account)
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="special-classification" className={cn(errors.specialClassification && "text-red-500")}>
              Special Classification <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.specialClassification}
              onValueChange={(value) => handleInputChange("specialClassification", value)}
            >
              <SelectTrigger
                id="special-classification"
                className={cn(errors.specialClassification && "border-red-500")}
              >
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {specialClassifications.map((classification) => (
                  <SelectItem key={classification} value={classification}>
                    {classification}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">The special classification of this account</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="branch" className={cn(errors.branch && "text-red-500")}>
              Branch <span className="text-red-500">*</span>
            </Label>
            <div className="flex flex-wrap gap-2 p-2 border rounded-md">
              {selectedBranches.map((branch) => (
                <Badge key={branch} variant="secondary" className="flex items-center gap-1">
                  {branch}
                  <button
                    type="button"
                    onClick={() => handleRemoveBranch(branch)}
                    className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              <Input
                id="branch"
                placeholder="Select special classifications..."
                value={branchInput}
                onChange={(e) => setBranchInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 min-w-[150px] border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-7"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-600">
            Add Account
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}