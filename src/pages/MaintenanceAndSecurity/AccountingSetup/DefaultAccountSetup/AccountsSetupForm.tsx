import { useEffect, useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { CircleCheck } from "lucide-react"

import { apiRequest } from "@/lib/api"
import { COADialog } from "./COADialog"

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
}

interface ApiResponse {
  status: string
  message: string
  data: any
}

const AccountField = ({ label, description, required = false, selectedAccount, onAccountSelect, error }: AccountFieldProps) => {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <div className="space-y-2">
      <div className="flex items-center">
        <Label className="font-medium">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      </div>
      <div className="space-y-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label>Account Code</Label>
            <Input
              readOnly
              placeholder="Select account..."
              value={selectedAccount?.code || ""}
              onClick={() => setDialogOpen(true)}
              className={error ? "border-red-500" : ""}
            />
          </div>
          <div className="space-y-1">
            <Label>Account Name</Label>
            <Input
              readOnly
              placeholder="Select account..."
              value={selectedAccount?.name || ""}
              onClick={() => setDialogOpen(true)}
              className={error ? "border-red-500" : ""}
            />
          </div>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        {selectedAccount && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onAccountSelect(null)}
            className="text-red-500 hover:text-red-700"
          >
            Clear Selection
          </Button>
        )}
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
      <COADialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSelect={(account) => {
          onAccountSelect(account)
          setDialogOpen(false)
        }}
      />
    </div>
  )
}

export default function AccountsSetupForm() {
  const [retainedEarnings, setRetainedEarnings] = useState<ChartOfAccount | null>(null)
  const [incomeSummary, setIncomeSummary] = useState<ChartOfAccount | null>(null)
  const [nonLoansAR, setNonLoansAR] = useState<ChartOfAccount | null>(null)
  const [ap, setAP] = useState<ChartOfAccount | null>(null)
  const [arDebit, setARDebit] = useState<ChartOfAccount | null>(null)
  const [collections, setCollections] = useState<ChartOfAccount | null>(null)
  const [apCredit, setAPCredit] = useState<ChartOfAccount | null>(null)
  const [accountingPayable, setAccountingPayable] = useState<ChartOfAccount | null>(null)
  const [incomeTax, setIncomeTax] = useState<ChartOfAccount | null>(null)
  const [inputTax, setInputTax] = useState<ChartOfAccount | null>(null)
  const [outputTax, setOutputTax] = useState<ChartOfAccount | null>(null)
  const [vatRate, setVatRate] = useState("12%")

  const [isLoading, setIsLoading] = useState(true)
  const [, setError] = useState<string | null>(null)
  const [configId, setConfigId] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const fetchAccountingDefaults = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const result = await apiRequest<ApiResponse>("get", "/accounting-general-defaults", null, {
          useAuth: true,
          useBranchId: true,
        })

        if (result.status === 200 && result.data) {
          const { data } = result

          setConfigId(data.data.id)
          setRetainedEarnings(data.data.coa_retained_earnings_account)
          setIncomeSummary(data.data.coa_income_expense_summary_account)
          setNonLoansAR(data.data.coa_non_loans_ar_account)
          setAP(data.data.coa_accounts_payable_account)
          setARDebit(data.data.coa_ar_collected_debit_account)
          setAPCredit(data.data.coa_ap_paid_credit_account)
          setIncomeTax(data.data.coa_income_tax_account)
          setInputTax(data.data.coa_input_tax_account)
          setOutputTax(data.data.coa_output_tax_account)

          const vatRateValue = parseFloat(data.data.vat_rate)
          setVatRate(`${vatRateValue}%`)
        }
      } catch (err) {
        console.error('Error fetching accounting defaults:', err)
        setError(err instanceof Error ? err.message : 'An error occurred while fetching data')
      } finally {
        setIsLoading(false)
      }
    }
    fetchAccountingDefaults()
  }, [])

  const handleSave = async () => {
    try {
      setFieldErrors({})
      const formData = {
        coa_retained_earnings_account: retainedEarnings?.id || null,
        coa_income_expense_summary_account: incomeSummary?.id || null,
        coa_non_loans_ar_account: nonLoansAR?.id || null,
        coa_accounts_payable_account: ap?.id || null,
        coa_ar_collected_debit_account: arDebit?.id || null,
        coa_ap_paid_credit_account: apCredit?.id || null,
        coa_income_tax_account: incomeTax?.id || null,
        coa_input_tax_account: inputTax?.id || null,
        coa_output_tax_account: outputTax?.id || null,
        vat_rate: parseFloat(vatRate.replace('%', '')),
      }

      const endpoint = configId ? `/accounting-general-defaults/${configId}` : "/accounting-general-defaults"
      const method = configId ? "put" : "post"

      const saveResult = await apiRequest<ApiResponse>(method, endpoint, formData, {
        useAuth: true,
        useBranchId: true,
      })

      if (saveResult.status === 200) {
        toast.success("Account Setup Saved", {
          description: `Configuration saved successfully.`,
          icon: <CircleCheck className="h-5 w-5" />,
          duration: 5000,
        })

        if (!configId && saveResult.data?.data?.id) {
          setConfigId(saveResult.data.data.id)
        }
      }
    } catch (err: any) {
      console.error("Error saving data:", err)
      const apiError = err?.response?.data || err

      if (apiError?.errors?.coa_fields?.length) {
        const fieldErrorMsg = apiError.errors.coa_fields[0] || "Duplicate data in fields"
        toast.error("Save Failed", {
          description: "There are duplicate data in the fields.",
          duration: 6000,
        })
        setFieldErrors({ coa_fields: fieldErrorMsg })
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Default Accounts Configuration</CardTitle>
        <CardDescription>
          Specify accounts for various financial aspects that will be used for auto-journal entries
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">General Accounts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AccountField label="Retained Earnings" description="Account for retained earnings" required selectedAccount={retainedEarnings} onAccountSelect={setRetainedEarnings} error={fieldErrors.coa_fields} />
            <AccountField label="Income & Expense Summary" description="Account for income and expense summary" required selectedAccount={incomeSummary} onAccountSelect={setIncomeSummary} error={fieldErrors.coa_fields} />
          </div>
        </div>
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Receivable & Payables</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AccountField label="Non-loans A/R" description="Account for non-loan accounts receivable" required selectedAccount={nonLoansAR} onAccountSelect={setNonLoansAR} error={fieldErrors.coa_fields} />
            <AccountField label="A/P" description="Account for accounts payable" required selectedAccount={ap} onAccountSelect={setAP} error={fieldErrors.coa_fields} />
            <AccountField label="A/R Debit" description="Account for accounts receivable debit" required selectedAccount={arDebit} onAccountSelect={setARDebit} error={fieldErrors.coa_fields} />
            <AccountField label="Collections" description="Account for collections" required selectedAccount={collections} onAccountSelect={setCollections} error={fieldErrors.coa_fields} />
            <AccountField label="A/P Credit" description="Account for accounts payable credit" required selectedAccount={apCredit} onAccountSelect={setAPCredit} error={fieldErrors.coa_fields} />
            <AccountField label="Accounting Payable PGA" description="Account for accounting payable PGA" required selectedAccount={accountingPayable} onAccountSelect={setAccountingPayable} error={fieldErrors.coa_fields} />
          </div>
        </div>
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Tax Accounts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AccountField label="Income Tax" description="Account for income tax" required selectedAccount={incomeTax} onAccountSelect={setIncomeTax} error={fieldErrors.coa_fields} />
            <AccountField label="Input Tax" description="Account for input tax" required selectedAccount={inputTax} onAccountSelect={setInputTax} error={fieldErrors.coa_fields} />
            <AccountField label="Output Tax" description="Account for output tax" required selectedAccount={outputTax} onAccountSelect={setOutputTax} error={fieldErrors.coa_fields} />
            <div className="space-y-2">
              <div className="flex items-center">
                <Label htmlFor="vat-rate" className="font-medium">VAT Rate</Label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input id="vat-rate" value={vatRate} onChange={(e) => setVatRate(e.target.value)} placeholder="e.g., 12%" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Current VAT rate to be applied</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-4">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleSave}>Save Changes</Button>
      </CardFooter>
    </Card>
  )
}
