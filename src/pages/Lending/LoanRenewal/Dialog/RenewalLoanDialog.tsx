"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import type { ExistingLoan } from "../Service/LoanRenewalTypes"

const renewalSchema = z.object({
  loan_type: z.string().min(1, "Please select loan type"),
  new_term: z.string().min(1, "Please select new term"),
  new_principal_amount: z.number().min(1, "New principal amount is required"),
})

type RenewalFormValues = z.infer<typeof renewalSchema>

interface RenewalLoanDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedLoans: ExistingLoan[]
  onRenew: (renewalData: RenewalFormValues) => void
  isLoading: boolean
}

export function RenewalLoanDialog({ open,
    onOpenChange,
    // selectedLoans,
    onRenew,
    isLoading
}: RenewalLoanDialogProps) {
  const form = useForm<RenewalFormValues>({
    resolver: zodResolver(renewalSchema),
    defaultValues: {
      loan_type: "",
      new_term: "",
      new_principal_amount: 200000,
    },
  })

//   const watchedValues = form.watch()

  // Calculated values
  const interest = 352800.0
  const remainingMonths = 84.0
  const loan1Balance = 469000.04
  const loan1Rebates = 294000.0
  const loan2Balance = 22222.2
  const loan2Rebates = 16000.0
  const loanBalanceLessRebates = 197222.24
  const amortization = 5862.5
  const processingFees = 562.5
  const netProceed = -6332.24

  const handleSubmit = (values: RenewalFormValues) => {
    onRenew(values)
  }

  const handleClose = () => {
    form.reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">New Renewal Loan Details</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="loan_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Select Loan Type <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="salary">Salary Loan</SelectItem>
                      <SelectItem value="bonus">Bonus Loan</SelectItem>
                      <SelectItem value="emergency">Emergency Loan</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="new_term"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    New Term <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="12">12 months</SelectItem>
                      <SelectItem value="24">24 months</SelectItem>
                      <SelectItem value="36">36 months</SelectItem>
                      <SelectItem value="48">48 months</SelectItem>
                      <SelectItem value="60">60 months</SelectItem>
                      <SelectItem value="72">72 months</SelectItem>
                      <SelectItem value="84">84 months</SelectItem>
                      <SelectItem value="96">96 months</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="new_principal_amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    New Principal Amount <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="200,000.00"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Calculated Fields */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Interest</label>
                  <Input value={interest.toLocaleString()} disabled className="bg-gray-50" />
                </div>
                <div>
                  <label className="text-sm font-medium">Remaining Months</label>
                  <Input value={remainingMonths.toString()} disabled className="bg-gray-50" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Loan #1 Balance</label>
                  <Input value={loan1Balance.toLocaleString()} disabled className="bg-gray-50" />
                </div>
                <div>
                  <label className="text-sm font-medium">Loan #1 Rebates</label>
                  <Input value={loan1Rebates.toLocaleString()} disabled className="bg-gray-50" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Loan #2 Balance</label>
                  <Input value={loan2Balance.toLocaleString()} disabled className="bg-gray-50" />
                </div>
                <div>
                  <label className="text-sm font-medium">Loan #2 Rebates</label>
                  <Input value={loan2Rebates.toLocaleString()} disabled className="bg-gray-50" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Loan Balance (less Rebates)</label>
                <Input value={loanBalanceLessRebates.toLocaleString()} disabled className="bg-gray-50" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Amortization</label>
                  <Input value={amortization.toLocaleString()} disabled className="bg-gray-50" />
                </div>
                <div>
                  <label className="text-sm font-medium">Processing fees</label>
                  <Input value={processingFees.toLocaleString()} disabled className="bg-gray-50" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Net Proceed</label>
                <Input value={netProceed.toLocaleString()} disabled className="bg-gray-50" />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={handleClose} type="button">
                Cancel
              </Button>
              <Button variant="outline" type="button">
                Save as Draft
              </Button>
              <Button type="submit" disabled={isLoading}>
                Process
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
