"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useState } from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

// Define the form schema with validation
const formSchema = z.object({
  // Basic Info
  cashAdvanceCode: z.string().min(1, "Cash advance code is required"),
  cashAdvanceName: z.string().min(1, "Cash advance name is required"),
  loanType: z.enum(["Bonus Loan", "Salary Loan"], {
    required_error: "Loan type is required",
  }),
  loanCode: z.string().min(1, "Loan code is required"),
  interestRate: z.string().min(1, "Interest rate is required"),
  surchargeRate: z.string().min(1, "Surcharge rate is required"),
  maximumAmount: z.string().optional(),
  maximumRate: z.string().optional(),

  // Classifications
  teacher1: z.boolean().optional(),
  teacher2: z.boolean().optional(),
  philFundEmployee: z.boolean().optional(),

  // Chart of Accounts
  loansReceivable: z.string().min(1, "Loans receivable is required"),
  interestReceivable: z.string().min(1, "Interest receivable is required"),
  unearnedInterest: z.string().optional(),
  interestIncome: z.string().min(1, "Interest income is required"),
  otherIncomePenalty: z.string().optional(),
  allowanceForDoubtfulAccount: z.string().optional(),
  badDebtExpense: z.string().optional(),
  garnishedExpense: z.string().min(1, "Garnished expense is required"),
})

// Define the form values type
type FormValues = z.infer<typeof formSchema>

// Define the component props
interface AddCashAdvanceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: unknown) => void
}

export function AddCashAdvanceDialog({ open, onOpenChange, onSubmit }: AddCashAdvanceDialogProps) {
  const [activeTab, setActiveTab] = useState("basic-info")

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cashAdvanceCode: "",
      cashAdvanceName: "",
      loanType: "Salary Loan",
      loanCode: "",
      interestRate: "0.00",
      surchargeRate: "0.00",
      maximumAmount: "5000.00",
      maximumRate: "5000.00",
      teacher1: false,
      teacher2: false,
      philFundEmployee: false,
      loansReceivable: "",
      interestReceivable: "",
      unearnedInterest: "",
      interestIncome: "",
      otherIncomePenalty: "",
      allowanceForDoubtfulAccount: "",
      badDebtExpense: "",
      garnishedExpense: "",
    },
  })

  // Handle form submission
  const handleSubmit = (values: FormValues) => {
    onSubmit(values)
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-5xl h-5/6 flex flex-col overflow-x-hidden overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Add New Salary Loan Cash Advance</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <Tabs defaultValue="basic-info" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="border-b w-full justify-start rounded-none h-auto p-0 mb-6">
                <TabsTrigger
                  value="basic-info"
                  className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-b-blue-500 data-[state=active]:shadow-none px-4 py-2"
                >
                  Basic Info
                </TabsTrigger>
                <TabsTrigger
                  value="chart-of-accounts"
                  className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-b-blue-500 data-[state=active]:shadow-none px-4 py-2"
                >
                  Chart of Accounts
                </TabsTrigger>
              </TabsList>

              <TabsContent value="basic-info" className="space-y-6 mt-0">
                {/* Basic Info Section */}
                <div className="grid grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="cashAdvanceCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">
                          Cash Advance Code <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Enter cash advance code" {...field} />
                        </FormControl>
                        <FormDescription>A unique code to identify this cash advance</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cashAdvanceName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">
                          Cash Advance Name <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Enter cash advance name" {...field} />
                        </FormControl>
                        <FormDescription>The descriptive name of this cash advance</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="loanType"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-base font-medium">
                          Loan Type <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-row space-x-4"
                          >
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="Bonus Loan" />
                              </FormControl>
                              <FormLabel className="font-normal">Bonus Loan</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="Salary Loan" />
                              </FormControl>
                              <FormLabel className="font-normal">Salary Loan</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="loanCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">
                          Loan Code <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="SLO01">SLO01 - DEPED Long Term</SelectItem>
                            <SelectItem value="SLO02">SLO02 - DEPED Short Term</SelectItem>
                            <SelectItem value="SLO03">SLO03 - PhilFund Salary Loan</SelectItem>
                            <SelectItem value="BL001">BL001 - Midyear Bonus</SelectItem>
                            <SelectItem value="BL002">BL002 - Year end Bonus</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>Select the associated loan code</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="interestRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">
                          Interest Rate (%) <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="0.00" {...field} />
                        </FormControl>
                        <FormDescription>Annual interest rate percentage</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="surchargeRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">
                          Surcharge Rate (%) <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="0.00" {...field} />
                        </FormControl>
                        <FormDescription>Penalty rate for late payments</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="maximumAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">Maximum Amount</FormLabel>
                        <FormControl>
                          <Input placeholder="0.00" {...field} />
                        </FormControl>
                        <FormDescription>Maximum loan amount allowed</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="maximumRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">Maximum Rate</FormLabel>
                        <FormControl>
                          <Input placeholder="0.00" {...field} />
                        </FormControl>
                        <FormDescription>Maximum rate allowed</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* List of Classifications Section */}
                <div>
                  <h3 className="text-lg font-medium mb-4">List of Classifications</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[200px]">Classification</TableHead>
                        <TableHead className="text-right">Can Avail of CA</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Teacher1</TableCell>
                        <TableCell className="text-right">
                          <FormField
                            control={form.control}
                            name="teacher1"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Teacher2</TableCell>
                        <TableCell className="text-right">
                          <FormField
                            control={form.control}
                            name="teacher2"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>PhilFund Employee</TableCell>
                        <TableCell className="text-right">
                          <FormField
                            control={form.control}
                            name="philFundEmployee"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="chart-of-accounts" className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-xl font-bold">Chart of Accounts</h2>

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="loansReceivable"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">
                            Loans Receivable <span className="text-red-500">*</span>
                          </FormLabel>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input placeholder="Account Code" {...field} />
                            <Select>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select..." />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="account1">Account 1</SelectItem>
                                <SelectItem value="account2">Account 2</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="interestReceivable"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">
                            Interest Receivable <span className="text-red-500">*</span>
                          </FormLabel>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input placeholder="Account Code" {...field} />
                            <Select>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select..." />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="account1">Account 1</SelectItem>
                                <SelectItem value="account2">Account 2</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="unearnedInterest"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">Unearned Interest</FormLabel>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input placeholder="Account Code" {...field} />
                            <Select>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select..." />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="account1">Account 1</SelectItem>
                                <SelectItem value="account2">Account 2</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="interestIncome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">
                            Interest Income <span className="text-red-500">*</span>
                          </FormLabel>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input placeholder="Account Code" {...field} />
                            <Select>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select..." />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="account1">Account 1</SelectItem>
                                <SelectItem value="account2">Account 2</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="otherIncomePenalty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">Other Income Penalty</FormLabel>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input placeholder="Account Code" {...field} />
                            <Select>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select..." />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="account1">Account 1</SelectItem>
                                <SelectItem value="account2">Account 2</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="allowanceForDoubtfulAccount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">Allowance for Doubtful Account</FormLabel>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input placeholder="Account Code" {...field} />
                            <Select>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select..." />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="account1">Account 1</SelectItem>
                                <SelectItem value="account2">Account 2</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="badDebtExpense"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">Bad Debt Expense</FormLabel>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input placeholder="Account Code" {...field} />
                            <Select>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select..." />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="account1">Account 1</SelectItem>
                                <SelectItem value="account2">Account 2</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="garnishedExpense"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">
                            Garnished Expense <span className="text-red-500">*</span>
                          </FormLabel>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input placeholder="Account Code" {...field} />
                            <Select>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select..." />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="account1">Account 1</SelectItem>
                                <SelectItem value="account2">Account 2</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset()
                  onOpenChange(false)
                }}
              >
                Cancel
              </Button>
              <Button type="submit">{activeTab === "basic-info" ? "Continue" : "Save CA Loan"}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
