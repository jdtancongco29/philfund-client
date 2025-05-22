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

// Define the form schema with validation
const formSchema = z.object({
  // Basic Info
  bonusLoanCode: z.string().min(1, "Bonus loan code is required"),
  bonusLoanName: z.string().min(1, "Bonus loan name is required"),
  monthOfRelease: z.string().min(1, "Month of release is required"),
  cutOffDate: z.string().min(1, "Cut-off date is required"),
  interestRate: z.string().min(1, "Interest rate is required"),
  maximumRate: z.string().min(1, "Maximum rate is required"),
  surchargeRate: z.string().optional(),

  // Classifications
  teacher1: z.boolean().optional(),
  teacher2: z.boolean().optional(),
  philFundEmployee: z.boolean().optional(),

  // Chart of Accounts
  loansReceivable: z.string().min(1, "Loans receivable is required"),
  interestReceivable: z.string().min(1, "Interest receivable is required"),
  interestIncome: z.string().min(1, "Interest income is required"),
  garnishedExpense: z.string().min(1, "Garnished expense is required"),
  unearnedInterest: z.string().optional(),
  otherIncomePenalty: z.string().optional(),
  allowanceForDoubtfulAccount: z.string().optional(),
  badDebtExpense: z.string().optional(),
})

// Define the form values type
type FormValues = z.infer<typeof formSchema>

// Define the component props
interface AddBonusLoanDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: unknown) => void
}

export function AddBonusLoanDialog({ open, onOpenChange, onSubmit }: AddBonusLoanDialogProps) {
  const [activeTab, setActiveTab] = useState("basic-info")

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bonusLoanCode: "",
      bonusLoanName: "",
      monthOfRelease: "",
      cutOffDate: "",
      interestRate: "",
      maximumRate: "",
      surchargeRate: "5%",
      teacher1: false,
      teacher2: false,
      philFundEmployee: false,
      loansReceivable: "",
      interestReceivable: "",
      interestIncome: "",
      garnishedExpense: "",
      unearnedInterest: "",
      otherIncomePenalty: "",
      allowanceForDoubtfulAccount: "",
      badDebtExpense: "",
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
          <DialogTitle className="text-2xl font-bold">Add New Bonus Loan</DialogTitle>
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
                    name="bonusLoanCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">
                          Bonus Loan Code <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Enter bonus loan code" {...field} />
                        </FormControl>
                        <FormDescription>A unique code to identify this bonus loan</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bonusLoanName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">
                          Bonus Loan Name <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Enter bonus loan name" {...field} />
                        </FormControl>
                        <FormDescription>The descriptive name of this bonus loan</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="monthOfRelease"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">
                          Month of release <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="January">January</SelectItem>
                            <SelectItem value="February">February</SelectItem>
                            <SelectItem value="March">March</SelectItem>
                            <SelectItem value="April">April</SelectItem>
                            <SelectItem value="May">May</SelectItem>
                            <SelectItem value="June">June</SelectItem>
                            <SelectItem value="July">July</SelectItem>
                            <SelectItem value="August">August</SelectItem>
                            <SelectItem value="September">September</SelectItem>
                            <SelectItem value="October">October</SelectItem>
                            <SelectItem value="November">November</SelectItem>
                            <SelectItem value="December">December</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>Month when the bonus is released</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cutOffDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">
                          Cut-off date <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="mmm - dd" {...field} />
                        </FormControl>
                        <FormDescription>Cut-off date for eligibility</FormDescription>
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
                          Interest rate <span className="text-red-500">*</span>
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
                    name="maximumRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">
                          Maximum Rate <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Enter maximum rate" {...field} />
                        </FormControl>
                        <FormDescription>Maximum rate allowed</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="surchargeRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">Surcharge Rate</FormLabel>
                        <FormControl>
                          <Input placeholder="5%" {...field} />
                        </FormControl>
                        <FormDescription>Penalty rate for late payments</FormDescription>
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
              <Button type="submit">{activeTab === "basic-info" ? "Continue" : "Save Bonus Loan"}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
