"use client"

import { useEffect, useState } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { CircleCheck } from "lucide-react"
import Select from "react-select"

import { apiRequest } from "@/lib/api"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

interface ChartOfAccount {
  id: string
  code: string
  name: string
  description?: string
  major_classification?: string
  category?: string
  is_header?: boolean
  parent_id?: string | null
  is_contra?: boolean
  normal_balance?: string
  special_classification?: string
  status?: boolean
}

interface AccountFieldProps {
  label: string
  description: string
  required?: boolean
  selectedAccount: ChartOfAccount | null
  onAccountSelect: (account: ChartOfAccount | null) => void
  error?: string | null
  chartOfAccounts: ChartOfAccount[]
  loadingCOA: boolean
}

interface ApiResponse {
  status: string
  message: string
  data: any
}

const AccountField = ({
  label,
  description,
  required = false,
  selectedAccount,
  onAccountSelect,
  error,
  chartOfAccounts,
  loadingCOA,
}: AccountFieldProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center">
        <Label className="font-medium">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      </div>
      <div className="space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            className="w-1/3 rounded-md border border-gray-300 px-3 py-2 text-sm"
            placeholder="Account Code"
            value={selectedAccount?.code || ""}
            readOnly
          />
          <div className="w-2/3">
            <Select<{ value: string; label: string }>
              value={
                selectedAccount
                  ? {
                      value: selectedAccount.id,
                      label: selectedAccount.name,
                    }
                  : null
              }
              onChange={(selectedOption) => {
                if (selectedOption) {
                  const account = chartOfAccounts.find((coa) => coa.id === selectedOption.value)
                  onAccountSelect(account || null)
                } else {
                  onAccountSelect(null)
                }
              }}
              options={chartOfAccounts.map((coa) => ({
                value: coa.id,
                label: coa.name,
              }))}
              placeholder={loadingCOA ? "Loading chart of accounts..." : "Select..."}
              isLoading={loadingCOA}
              isClearable
              classNamePrefix={error ? "react-select-error" : "react-select"}
            />
          </div>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

export default function CashieringAccountsForm() {
  const [outstandingCashSalary, setOutstandingCashSalary] = useState<ChartOfAccount | null>(null)
  const [outstandingCashBonus, setOutstandingCashBonus] = useState<ChartOfAccount | null>(null)
  const [encashmentFund, setEncashmentFund] = useState<ChartOfAccount | null>(null)
  const [internalCashier, setInternalCashier] = useState<ChartOfAccount | null>(null)
  const [pettyCashTaxable, setPettyCashTaxable] = useState<ChartOfAccount | null>(null)
  const [pettyCashNonTaxable, setPettyCashNonTaxable] = useState<ChartOfAccount | null>(null)

  const [chartOfAccounts, setChartOfAccounts] = useState<ChartOfAccount[]>([])
  const [loadingCOA, setLoadingCOA] = useState(false)

  const [isLoading, setIsLoading] = useState(true)
  const [, setError] = useState<string | null>(null)
  const [configId, setConfigId] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)

  useEffect(() => {
    const fetchCashieringDefaults = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Fetch chart of accounts first
        await fetchChartOfAccounts()

        const result = await apiRequest<ApiResponse>("get", "/accounting-cashiering-defaults", null, {
          useAuth: true,
          useBranchId: true,
        })

        if (result.status === 200 && result.data) {
          const { data } = result

          setConfigId(data.data.id)
          setOutstandingCashSalary(data.data.coa_outstanding_cash_salary)
          setOutstandingCashBonus(data.data.coa_outstanding_cash_bonus)
          setEncashmentFund(data.data.coa_encashment_fund)
          setInternalCashier(data.data.coa_internal_cashier)
          setPettyCashTaxable(data.data.coa_petty_cash_taxable)
          setPettyCashNonTaxable(data.data.coa_petty_cash_non_taxable)
        }
      } catch (err) {
        console.error("Error fetching cashiering defaults:", err)
        setError(err instanceof Error ? err.message : "An error occurred while fetching data")
      } finally {
        setIsLoading(false)
      }
    }
    fetchCashieringDefaults()
  }, [])

  const fetchChartOfAccounts = async () => {
    setLoadingCOA(true)
    try {
      const response = await apiRequest<{ data: { chartOfAccounts: ChartOfAccount[] } }>("get", "/coa", null, {
        useAuth: true,
        useBranchId: true,
      })
      setChartOfAccounts(response.data.data.chartOfAccounts)
    } catch (error) {
      console.error("Error fetching chart of accounts:", error)
    } finally {
      setLoadingCOA(false)
    }
  }

  const validateDuplicateAccounts = () => {
    const accounts = [
      { field: "coa_outstanding_cash_salary", account: outstandingCashSalary, label: "Outstanding Cash Fund (Salary)" },
      { field: "coa_outstanding_cash_bonus", account: outstandingCashBonus, label: "Outstanding Cash Fund (Bonus)" },
      { field: "coa_encashment_fund", account: encashmentFund, label: "COH: Encashment Fund" },
      { field: "coa_internal_cashier", account: internalCashier, label: "COH: Internal Cashier" },
      { field: "coa_petty_cash_taxable", account: pettyCashTaxable, label: "Petty Cash Fund (Taxable)" },
      { field: "coa_petty_cash_non_taxable", account: pettyCashNonTaxable, label: "Petty Cash Fund (Non-Taxable)" },
    ]

    const newFieldErrors: Record<string, string> = {}
    const accountMap = new Map<string, string[]>()

    // Group fields by account ID
    accounts.forEach(({  account, label }) => {
      if (account?.id) {
        if (!accountMap.has(account.id)) {
          accountMap.set(account.id, [])
        }
        accountMap.get(account.id)?.push(label)
      }
    })

    // Find duplicates and set errors
    accountMap.forEach((labels, accountId) => {
      if (labels.length > 1) {
        const duplicateMessage = `This account is also used in: ${labels.slice(1).join(", ")}`

        accounts.forEach(({ field, account }) => {
          if (account?.id === accountId) {
            newFieldErrors[field] = duplicateMessage
          }
        })
      }
    })

    setFieldErrors(newFieldErrors)
    return Object.keys(newFieldErrors).length === 0
  }

  useEffect(() => {
    validateDuplicateAccounts()
  }, [
    outstandingCashSalary,
    outstandingCashBonus,
    encashmentFund,
    internalCashier,
    pettyCashTaxable,
    pettyCashNonTaxable,
  ])

  const handleSave = async () => {
    try {
      // Validate duplicates before saving
      const isValid = validateDuplicateAccounts()
      if (!isValid) {
        toast.error("Save Failed", {
          description: "Please resolve duplicate account selections before saving.",
          duration: 6000,
        })
        return
      }

      const formData = {
        coa_outstanding_cash_salary: outstandingCashSalary?.id || null,
        coa_outstanding_cash_bonus: outstandingCashBonus?.id || null,
        coa_encashment_fund: encashmentFund?.id || null,
        coa_internal_cashier: internalCashier?.id || null,
        coa_petty_cash_taxable: pettyCashTaxable?.id || null,
        coa_petty_cash_non_taxable: pettyCashNonTaxable?.id || null,
      }

      const endpoint = `/accounting-cashiering-defaults/${configId}`
      const method = "put"

      const saveResult = await apiRequest<ApiResponse>(method, endpoint, formData, {
        useAuth: true,
        useBranchId: true,
      })

      if (saveResult.status === 200) {
        toast.success("Cashiering Accounts Saved", {
          description: `Configuration saved successfully.`,
          icon: <CircleCheck className="h-5 w-5" />,
          duration: 5000,
        })
      }
    } catch (err: any) {
      console.error("Error saving data:", err)
      const apiError = err?.response?.data || err

      if (apiError?.errors) {
        const newFieldErrors: Record<string, string> = {}
        Object.keys(apiError.errors).forEach((field) => {
          if (apiError.errors[field] && apiError.errors[field].length > 0) {
            newFieldErrors[field] = apiError.errors[field][0]
          }
        })

        setFieldErrors(newFieldErrors)

        toast.error("Save Failed", {
          description: "There are errors in the form. Please check the fields.",
          duration: 6000,
        })
      } else if (apiError?.message) {
        toast.error("Save Failed", {
          description: apiError.message,
          duration: 6000,
        })
        setError(apiError.message)
      } else {
        toast.error("Save Failed", {
          description: "An unknown error occurred while saving.",
          duration: 6000,
        })
        setError("An error occurred while saving configuration.")
      }
    }
  }

  const handleCancel = () => {
    setCancelDialogOpen(true)
  }

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading configuration...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Cashiering Accounts</CardTitle>

        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Outstanding Cash Fund Accounts</h3>
            <div className="grid grid-cols-1 gap-8">
              <AccountField
                label="Outstanding Cash Fund (Salary)"
                description="Account for outstanding cash fund for salary payments"
                required
                selectedAccount={outstandingCashSalary}
                onAccountSelect={setOutstandingCashSalary}
                error={fieldErrors.coa_outstanding_cash_salary}
                chartOfAccounts={chartOfAccounts}
                loadingCOA={loadingCOA}
              />
              <AccountField
                label="Outstanding Cash Fund (Bonus)"
                description="Account for outstanding cash fund for bonus payments"
                required
                selectedAccount={outstandingCashBonus}
                onAccountSelect={setOutstandingCashBonus}
                error={fieldErrors.coa_outstanding_cash_bonus}
                chartOfAccounts={chartOfAccounts}
                loadingCOA={loadingCOA}
              />
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Cash On Hand Accounts</h3>
            <div className="grid grid-cols-1 gap-8">
              <AccountField
                label="COH: Encashment Fund"
                description="Account for cash on hand encashment fund"
                required
                selectedAccount={encashmentFund}
                onAccountSelect={setEncashmentFund}
                error={fieldErrors.coa_encashment_fund}
                chartOfAccounts={chartOfAccounts}
                loadingCOA={loadingCOA}
              />
              <AccountField
                label="COH: Internal Cashier"
                description="Account for internal cashier cash on hand"
                required
                selectedAccount={internalCashier}
                onAccountSelect={setInternalCashier}
                error={fieldErrors.coa_internal_cashier}
                chartOfAccounts={chartOfAccounts}
                loadingCOA={loadingCOA}
              />
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Petty Cash Fund Accounts</h3>
            <div className="grid grid-cols-1 gap-8">
              <AccountField
                label="Petty Cash Fund (Taxable)"
                description="Account for taxable petty cash fund transactions"
                required
                selectedAccount={pettyCashTaxable}
                onAccountSelect={setPettyCashTaxable}
                error={fieldErrors.coa_petty_cash_taxable}
                chartOfAccounts={chartOfAccounts}
                loadingCOA={loadingCOA}
              />
              <AccountField
                label="Petty Cash Fund (Non-Taxable)"
                description="Account for non-taxable petty cash fund transactions"
                required
                selectedAccount={pettyCashNonTaxable}
                onAccountSelect={setPettyCashNonTaxable}
                error={fieldErrors.coa_petty_cash_non_taxable}
                chartOfAccounts={chartOfAccounts}
                loadingCOA={loadingCOA}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-4">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </CardFooter>
      </Card>

      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Discard changes?</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to discard all changes? Any unsaved progress will be lost.</p>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
              No, keep editing
            </Button>
            <Button variant="destructive" onClick={() => window.location.reload()}>
              Yes, discard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
