"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { COADialog } from "./COADialog"

interface ChartOfAccount {
  id: string
  code: string
  name: string
  description: string
  major_classification: {
    code: string
    name: string
  }
  category: string
  is_header: boolean
  parent_id: string | null
  parent?: {
    id: string
    name: string
  }
  is_contra: boolean
  normal_balance: "debit" | "credit"
  special_classification: string
  status: boolean
  branches?: Array<{
    uid: string
    code: string
    name: string
  }>
}

interface AddEditAccountDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddAccount?: (newAccount: any) => Promise<void> | void
  onEditAccount?: (accountId: string, updatedAccount: any) => Promise<void> | void
  editingAccount?: ChartOfAccount | null
  mode?: "add" | "edit"
}

const classificationOptions = [
  { label: "Assets", value: "1" },
  { label: "Liabilities", value: "2" },
  { label: "Owner's Equity", value: "3" },
  { label: "Revenue", value: "4" },
  { label: "Expenses", value: "5" },
]

const categoryOptionsMap: Record<string, string[]> = {
  "1": ["Current Assets", "Non-Current Assets (PPE)", "Other Asset"],
  "2": ["Current Liabilities", "Long-Term Liabilities"],
  "3": ["Capital", "Retained Earnings", "Drawings"],
  "4": ["Direct cost for Balance Sheet", "Non-Operating Income"],
  "5": ["Administrative and Operating Expenses", "Non-Operating Expenses"],
}

export function AddEditAccountDialog({
  open,
  onOpenChange,
  onAddAccount,
  onEditAccount,
  editingAccount,
  mode = "add",
}: AddEditAccountDialogProps) {
  const [code, setCode] = useState("")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [majorClassification, setMajorClassification] = useState("")
  const [category, setCategory] = useState("")
  const [specialClassification, setSpecialClassification] = useState("")
  const [accountType, setAccountType] = useState<"header" | "subsidiary">("header")
  const [headerAccountLabel, setHeaderAccountLabel] = useState("")
  const [selectedHeader, setSelectedHeader] = useState<{ id: string; code: string; name: string } | null>(null)
  const [isContraAccount, setIsContraAccount] = useState(false)
  const [normalBalance, setNormalBalance] = useState<"debit" | "credit">("debit")
  const [selectedBranches, setSelectedBranches] = useState<string[]>(["a050d30b-e7ae-4673-bf69-9e3ee5585d33"])

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showCOADialog, setShowCOADialog] = useState(false)

  const isEditMode = mode === "edit" && editingAccount

  // Reset form when dialog opens/closes or mode changes
  useEffect(() => {
    if (open) {
      if (isEditMode) {
        // Populate form with editing account data
        setCode(editingAccount.code)
        setName(editingAccount.name)
        setDescription(editingAccount.description)
        setMajorClassification(editingAccount.major_classification.code)
        setCategory(editingAccount.category)
        setSpecialClassification(editingAccount.special_classification)
        setAccountType(editingAccount.is_header ? "header" : "subsidiary")
        setIsContraAccount(editingAccount.is_contra)
        setNormalBalance(editingAccount.normal_balance)

        // Handle parent account for subsidiary accounts
        if (!editingAccount.is_header && editingAccount.parent) {
          setSelectedHeader({
            id: editingAccount.parent.id,
            code: editingAccount.code, // You might need to get the parent code from API
            name: editingAccount.parent.name,
          })
          setHeaderAccountLabel(`${editingAccount.parent.name}`)
        } else {
          setSelectedHeader(null)
          setHeaderAccountLabel("")
        }

        // Handle branches
        if (editingAccount.branches && editingAccount.branches.length > 0) {
          setSelectedBranches(editingAccount.branches.map((branch) => branch.uid))
        }
      } else {
        // Reset form for add mode
        resetForm()
      }
    }
  }, [open, isEditMode, editingAccount])

  const resetForm = () => {
    setCode("")
    setName("")
    setDescription("")
    setMajorClassification("")
    setCategory("")
    setSpecialClassification("")
    setAccountType("header")
    setHeaderAccountLabel("")
    setSelectedHeader(null)
    setIsContraAccount(false)
    setNormalBalance("debit")
    setSelectedBranches(["a050d30b-e7ae-4673-bf69-9e3ee5585d33"])
    setErrors({})
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!code.trim()) newErrors.code = "Account code is required."
    if (!name.trim()) newErrors.name = "Account name is required."
    if (!description.trim()) newErrors.description = "Description is required."
    if (!majorClassification.trim()) newErrors.major_classification = "Major classification is required."
    if (!category.trim()) newErrors.category = "Category is required."
    if (!specialClassification.trim()) newErrors.special_classification = "Special classification is required."
    if (accountType === "subsidiary" && !selectedHeader) {
      newErrors.headerAccount = "Header account selection is required."
    }
    return newErrors
  }

  const handleSubmit = async () => {
    const validationErrors = validate()
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    const payload = {
      code: code.trim(),
      name: name.trim(),
      description: description.trim(),
      major_classification: majorClassification.trim(),
      category: category.trim(),
      is_header: accountType === "header",
      parent_id: accountType === "subsidiary" ? selectedHeader?.id : null,
      is_contra: isContraAccount,
      normal_balance: normalBalance,
      special_classification: specialClassification.trim(),
      branches: selectedBranches,
    }

    setIsLoading(true)
    try {
      if (isEditMode && onEditAccount && editingAccount) {
        await onEditAccount(editingAccount.id, payload)
      } else if (onAddAccount) {
        await onAddAccount(payload)
      }

      resetForm()
      onOpenChange(false)
    } catch (error: any) {
      console.error(`Failed to ${isEditMode ? "update" : "add"} account:`, error)
      if (error?.response?.data?.errors) {
        const apiErrors: Record<string, string> = {}
        for (const key in error.response.data.errors) {
          if (error.response.data.errors[key]?.length > 0) {
            apiErrors[key] = error.response.data.errors[key][0]
          }
        }
        setErrors(apiErrors)
      } else {
        setErrors({ general: "An unexpected error occurred." })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const dialogTitle = isEditMode ? "Edit Account" : "Add New Account"
  const submitButtonText = isEditMode ? (isLoading ? "Updating..." : "Update") : isLoading ? "Adding..." : "Add Account"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className={errors.code ? "text-red-500" : undefined}>
              Account Code <span className="text-red-500">*</span>
            </Label>
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className={errors.code ? "border-red-500" : undefined}
            />
            {errors.code && <p className="text-sm text-red-600">{errors.code}</p>}
          </div>

          <div>
            <Label className={errors.name ? "text-red-500" : undefined}>
              Account Name <span className="text-red-500">*</span>
            </Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={errors.name ? "border-red-500" : undefined}
            />
            {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
          </div>

          <div className="col-span-2">
            <Label className={errors.description ? "text-red-500" : undefined}>
              Description <span className="text-red-500">*</span>
            </Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={errors.description ? "border-red-500" : undefined}
            />
            {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
          </div>

          <div>
            <Label className={errors.major_classification ? "text-red-500" : undefined}>
              Major Classification <span className="text-red-500">*</span>
            </Label>
            <select
              value={majorClassification}
              onChange={(e) => {
                setMajorClassification(e.target.value)
                setCategory("")
              }}
              className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.major_classification ? "border-red-500" : ""}`}
            >
              <option value="">Select...</option>
              {classificationOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.major_classification && <p className="text-sm text-red-600">{errors.major_classification}</p>}
          </div>

          <div>
            <Label className={errors.category ? "text-red-500" : undefined}>
              Category <span className="text-red-500">*</span>
            </Label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.category ? "border-red-500" : ""}`}
              disabled={!majorClassification}
            >
              <option value="">Select...</option>
              {(categoryOptionsMap[majorClassification] || []).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && <p className="text-sm text-red-600">{errors.category}</p>}
          </div>

          <div className="col-span-2">
            <Label className={errors.special_classification ? "text-red-500" : undefined}>
              Special Classification <span className="text-red-500">*</span>
            </Label>
            <select
              value={specialClassification}
              onChange={(e) => setSpecialClassification(e.target.value)}
              className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.special_classification ? "border-red-500" : ""}`}
            >
              <option value="">Select...</option>
              <option value="regular account">Regular account</option>
              <option value="cash account">Cash account</option>
              <option value="cash in bank account">Cash in bank account</option>
              <option value="receivable account">Receivable account</option>
              <option value="payable account">Payable account</option>
              <option value="allowance for bad debts">Allowance for bad debts</option>
              <option value="properties and equipment">Properties and equipment</option>
              <option value="accumulated depreciation">Accumulated depreciation</option>
              <option value="accumulated amortization">Accumulated amortization</option>
              <option value="cost of sales">Cost of sales</option>
              <option value="sales debits">Sales debits</option>
              <option value="sales">Sales</option>
              <option value="sales discount">Sales discount</option>
              <option value="other income">Other income</option>
              <option value="retained income">Retained income</option>
            </select>
            {errors.special_classification && <p className="text-sm text-red-600">{errors.special_classification}</p>}
          </div>

          <div>
            <Label>Account Type</Label>
            <div className="flex gap-4 mt-2">
              <Button
                type="button"
                variant={accountType === "header" ? "default" : "outline"}
                onClick={() => setAccountType("header")}
              >
                Header
              </Button>
              <Button
                type="button"
                variant={accountType === "subsidiary" ? "default" : "outline"}
                onClick={() => setAccountType("subsidiary")}
              >
                Subsidiary
              </Button>
            </div>
          </div>

          <div>
            <Label>Normal Balance</Label>
            <div className="flex gap-4 mt-2">
              <Button
                type="button"
                variant={normalBalance === "debit" ? "default" : "outline"}
                onClick={() => setNormalBalance("debit")}
              >
                Debit
              </Button>
              <Button
                type="button"
                variant={normalBalance === "credit" ? "default" : "outline"}
                onClick={() => setNormalBalance("credit")}
              >
                Credit
              </Button>
            </div>
          </div>

          {accountType === "subsidiary" && (
            <div className="col-span-2">
              <Label className={errors.headerAccount ? "text-red-500" : undefined}>
                Header Account <span className="text-red-500">*</span>
              </Label>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={headerAccountLabel}
                  className={errors.headerAccount ? "border-red-500" : undefined}
                  placeholder="Select a header account"
                />
                <Button type="button" onClick={() => setShowCOADialog(true)}>
                  Select
                </Button>
              </div>
              {errors.headerAccount && <p className="text-sm text-red-600">{errors.headerAccount}</p>}
            </div>
          )}

          <div className="col-span-2">
            <div className="flex items-center space-x-2">
              <Switch id="contra-account" checked={isContraAccount} onCheckedChange={setIsContraAccount} />
              <Label htmlFor="contra-account">Contra Account</Label>
            </div>
          </div>

          {errors.general && (
            <div className="col-span-2">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}

          <div className="col-span-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSubmit} disabled={isLoading}>
              {submitButtonText}
            </Button>
          </div>
        </div>

        <COADialog
          open={showCOADialog}
          onClose={() => setShowCOADialog(false)}
          onSelect={(coa) => {
            setHeaderAccountLabel(`${coa.code} - ${coa.name}`)
            setSelectedHeader({ id: coa.id, code: coa.code, name: coa.name })
            setShowCOADialog(false)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}

// Export both the new combined component and maintain backward compatibility
export { AddEditAccountDialog as AddAccountDialog }
