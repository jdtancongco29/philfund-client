"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for select options
const accountOptions = [
  { value: "1000", label: "Cash" },
  { value: "1100", label: "Accounts Receivable" },
  { value: "1200", label: "Inventory" },
  { value: "2000", label: "Accounts Payable" },
  { value: "3000", label: "Equity" },
  { value: "4000", label: "Revenue" },
  { value: "5000", label: "Expenses" },
]

interface AccountFieldProps {
  label: string
  description: string
  required?: boolean
  accountCode: string
  onAccountCodeChange: (value: string) => void
  selectedAccount: string
  onSelectedAccountChange: (value: string) => void
}

const AccountField = ({
  label,
  description,
  required = false,
  accountCode,
  onAccountCodeChange,
  selectedAccount,
  onSelectedAccountChange,
}: AccountFieldProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center">
        <Label htmlFor={`${label.toLowerCase().replace(/\s/g, "-")}-code`} className="font-medium">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Input
            id={`${label.toLowerCase().replace(/\s/g, "-")}-code`}
            placeholder="Account Code"
            value={accountCode}
            onChange={(e) => onAccountCodeChange(e.target.value)}
          />
        </div>
        <div>
          <Select value={selectedAccount} onValueChange={onSelectedAccountChange}>
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
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

export default function AccountsSetupForm() {
  // State for each account field
  const [retainedEarnings, setRetainedEarnings] = useState({ code: "", account: "" })
  const [incomeSummary, setIncomeSummary] = useState({ code: "", account: "" })
  const [nonLoansAR, setNonLoansAR] = useState({ code: "", account: "" })
  const [ap, setAP] = useState({ code: "", account: "" })
  const [arDebit, setARDebit] = useState({ code: "", account: "" })
  const [collections, setCollections] = useState({ code: "", account: "" })
  const [apCredit, setAPCredit] = useState({ code: "", account: "" })
  const [accountingPayable, setAccountingPayable] = useState({ code: "", account: "" })
  const [incomeTax, setIncomeTax] = useState({ code: "", account: "" })
  const [inputTax, setInputTax] = useState({ code: "", account: "" })
  const [outputTax, setOutputTax] = useState({ code: "", account: "" })
  const [vatRate, setVatRate] = useState("12%")

  const handleSave = () => {
    // Handle form submission
    console.log("Form data saved")
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
        {/* General Accounts */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">General Accounts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AccountField
              label="Retained Earnings"
              description="Account for retained earnings"
              required
              accountCode={retainedEarnings.code}
              onAccountCodeChange={(value) => setRetainedEarnings({ ...retainedEarnings, code: value })}
              selectedAccount={retainedEarnings.account}
              onSelectedAccountChange={(value) => setRetainedEarnings({ ...retainedEarnings, account: value })}
            />
            <AccountField
              label="Income & Expense Summary"
              description="Account for income and expense summary"
              required
              accountCode={incomeSummary.code}
              onAccountCodeChange={(value) => setIncomeSummary({ ...incomeSummary, code: value })}
              selectedAccount={incomeSummary.account}
              onSelectedAccountChange={(value) => setIncomeSummary({ ...incomeSummary, account: value })}
            />
          </div>
        </div>

        {/* Receivable & Payables */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Receivable & Payables</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AccountField
              label="Non-loans A/R"
              description="Account for non-loan accounts receivable"
              required
              accountCode={nonLoansAR.code}
              onAccountCodeChange={(value) => setNonLoansAR({ ...nonLoansAR, code: value })}
              selectedAccount={nonLoansAR.account}
              onSelectedAccountChange={(value) => setNonLoansAR({ ...nonLoansAR, account: value })}
            />
            <AccountField
              label="A/P"
              description="Account for accounts payable"
              required
              accountCode={ap.code}
              onAccountCodeChange={(value) => setAP({ ...ap, code: value })}
              selectedAccount={ap.account}
              onSelectedAccountChange={(value) => setAP({ ...ap, account: value })}
            />
            <AccountField
              label="A/R Debit"
              description="Account for accounts receivable debit"
              required
              accountCode={arDebit.code}
              onAccountCodeChange={(value) => setARDebit({ ...arDebit, code: value })}
              selectedAccount={arDebit.account}
              onSelectedAccountChange={(value) => setARDebit({ ...arDebit, account: value })}
            />
            <AccountField
              label="Collections"
              description="Account for collections"
              required
              accountCode={collections.code}
              onAccountCodeChange={(value) => setCollections({ ...collections, code: value })}
              selectedAccount={collections.account}
              onSelectedAccountChange={(value) => setCollections({ ...collections, account: value })}
            />
            <AccountField
              label="A/P Credit"
              description="Account for accounts payable credit"
              required
              accountCode={apCredit.code}
              onAccountCodeChange={(value) => setAPCredit({ ...apCredit, code: value })}
              selectedAccount={apCredit.account}
              onSelectedAccountChange={(value) => setAPCredit({ ...apCredit, account: value })}
            />
            <AccountField
              label="Accounting Payable PGA"
              description="Account for accounting payable PGA"
              required
              accountCode={accountingPayable.code}
              onAccountCodeChange={(value) => setAccountingPayable({ ...accountingPayable, code: value })}
              selectedAccount={accountingPayable.account}
              onSelectedAccountChange={(value) => setAccountingPayable({ ...accountingPayable, account: value })}
            />
          </div>
        </div>

        {/* Tax Accounts */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Tax Accounts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AccountField
              label="Income Tax"
              description="Account for income tax"
              required
              accountCode={incomeTax.code}
              onAccountCodeChange={(value) => setIncomeTax({ ...incomeTax, code: value })}
              selectedAccount={incomeTax.account}
              onSelectedAccountChange={(value) => setIncomeTax({ ...incomeTax, account: value })}
            />
            <AccountField
              label="Input Tax"
              description="Account for input tax"
              required
              accountCode={inputTax.code}
              onAccountCodeChange={(value) => setInputTax({ ...inputTax, code: value })}
              selectedAccount={inputTax.account}
              onSelectedAccountChange={(value) => setInputTax({ ...inputTax, account: value })}
            />
            <AccountField
              label="Output Tax"
              description="Account for output tax"
              required
              accountCode={outputTax.code}
              onAccountCodeChange={(value) => setOutputTax({ ...outputTax, code: value })}
              selectedAccount={outputTax.account}
              onSelectedAccountChange={(value) => setOutputTax({ ...outputTax, account: value })}
            />
            <div className="space-y-2">
              <div className="flex items-center">
                <Label htmlFor="vat-rate" className="font-medium">
                  VAT Rate
                </Label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input id="vat-rate" value={vatRate} onChange={(e) => setVatRate(e.target.value)} />
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