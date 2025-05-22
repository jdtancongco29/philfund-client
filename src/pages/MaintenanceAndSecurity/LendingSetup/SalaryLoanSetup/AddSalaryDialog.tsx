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
  salaryLoanCode: z.string().min(1, "Salary loan code is required"),
  loanName: z.string().min(1, "Loan name is required"),
  interestRate: z.string().min(1, "Interest rate is required"),
  surchargeRate: z.string().min(1, "Surcharge rate is required"),
  minimumAmount: z.string().min(1, "Minimum amount is required"),
  maximumAmount: z.string().min(1, "Maximum amount is required"),

  // Client-Visible Fees
  serviceCharge: z.string().optional(),
  insurance: z.string().optional(),
  notarialFee: z.string().optional(),
  grt: z.string().min(1, "GRT is required"),
  computerCharges: z.string().optional(),
  otherChargers: z.string().optional(),

  // PGA Fees & Surcharge
  pgaServiceCharge: z.string().optional(),
  pgaInsurance: z.string().optional(),
  pgaNotarialFee: z.string().optional(),
  pgaGrossReceiptTax: z.string().optional(),

  // Branch other chargers
  interestIncome: z.string().optional(),
  serviceChargeIncome: z.string().optional(),
  computerChargesIncome: z.string().optional(),

  // List of Groups
  philFundEmployee: z.boolean().optional(),
  deped: z.boolean().optional(),
  private: z.boolean().optional(),
})

// Define the form values type
type FormValues = z.infer<typeof formSchema>

// Define the component props
interface AddSalaryLoanDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: unknown) => void
}

export function AddSalaryLoanDialog({ open, onOpenChange, onSubmit }: AddSalaryLoanDialogProps) {
  const [activeTab, setActiveTab] = useState("basic-info")

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      salaryLoanCode: "",
      loanName: "",
      interestRate: "",
      surchargeRate: "",
      minimumAmount: "",
      maximumAmount: "",
      serviceCharge: "",
      insurance: "",
      notarialFee: "",
      grt: "",
      computerCharges: "",
      otherChargers: "",
      pgaServiceCharge: "",
      pgaInsurance: "",
      pgaNotarialFee: "",
      pgaGrossReceiptTax: "",
      interestIncome: "",
      serviceChargeIncome: "",
      computerChargesIncome: "",
      philFundEmployee: false,
      deped: false,
      private: false,
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
          <DialogTitle className="text-2xl font-bold">Add New Salary Loan</DialogTitle>
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
                    name="salaryLoanCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">
                          Salary Loan Code <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Enter load code" {...field} />
                        </FormControl>
                        <FormDescription>A unique code to identify this loan product</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="loanName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">
                          Loan Name <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Enter loan name" {...field} />
                        </FormControl>
                        <FormDescription>The descriptive name of this loan product</FormDescription>
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
                    name="minimumAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">
                          Minimum Amount <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="0.00" {...field} />
                        </FormControl>
                        <FormDescription>Minimum loan amount allowed</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="maximumAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">
                          Maximum Amount <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="0.00" {...field} />
                        </FormControl>
                        <FormDescription>Maximum loan amount allowed</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Client-Visible Fees Section */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Client-Visible Fees</h3>
                  <div className="grid grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="serviceCharge"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">Service Charge (%)</FormLabel>
                          <FormControl>
                            <Input placeholder="0.00" {...field} />
                          </FormControl>
                          <FormDescription>Percentage charged as service fee</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="insurance"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">Insurance (%)</FormLabel>
                          <FormControl>
                            <Input placeholder="0.00" {...field} />
                          </FormControl>
                          <FormDescription>Percentage charged for insurance</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="notarialFee"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">Notarial Fee (%)</FormLabel>
                          <FormControl>
                            <Input placeholder="0.00" {...field} />
                          </FormControl>
                          <FormDescription>Percentage charged for notarial services</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="grt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">
                            GRT (%) <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="0.00" {...field} />
                          </FormControl>
                          <FormDescription>Gross Receipts Tax percentage</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="computerCharges"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">Computer Charges (%)</FormLabel>
                          <FormControl>
                            <Input placeholder="0.00" {...field} />
                          </FormControl>
                          <FormDescription>Percentage charged for computer processing</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="otherChargers"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">Other Chargers</FormLabel>
                          <FormControl>
                            <Input placeholder="0.00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* PGA Fees & Surcharge Section */}
                <div>
                  <h3 className="text-lg font-medium mb-4">PGA Fees & Surcharge</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="pgaServiceCharge"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">PGA Service Charge (%)</FormLabel>
                          <FormControl>
                            <Input placeholder="0.00" {...field} />
                          </FormControl>
                          <FormDescription>PGA service charge percentage</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="pgaInsurance"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">PGA Insurance (%)</FormLabel>
                          <FormControl>
                            <Input placeholder="0.00" {...field} />
                          </FormControl>
                          <FormDescription>PGA insurance percentage</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="pgaNotarialFee"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">PGA Notarial Fee (%)</FormLabel>
                          <FormControl>
                            <Input placeholder="0.00" {...field} />
                          </FormControl>
                          <FormDescription>PGA notarial fee percentage</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="pgaGrossReceiptTax"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">PGA Gross Receipt Tax (%)</FormLabel>
                          <FormControl>
                            <Input placeholder="0.00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Branch other chargers Section */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Branch other chargers</h3>
                  <div className="grid grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="interestIncome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">Interest income (3%)</FormLabel>
                          <FormControl>
                            <Input placeholder="00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="serviceChargeIncome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">Service charge Income (1.5%)</FormLabel>
                          <FormControl>
                            <Input placeholder="00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="computerChargesIncome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">Computer Charges (0.1%)</FormLabel>
                          <FormControl>
                            <Input placeholder="0.00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* List of Groups Section */}
                <div>
                  <h3 className="text-lg font-medium mb-4">List of Groups</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[200px]">Group</TableHead>
                        <TableHead className="text-right">Can Avail of SL</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
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
                      <TableRow>
                        <TableCell>DEPED</TableCell>
                        <TableCell className="text-right">
                          <FormField
                            control={form.control}
                            name="deped"
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
                        <TableCell>Private</TableCell>
                        <TableCell className="text-right">
                          <FormField
                            control={form.control}
                            name="private"
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
                  <h2 className="text-xl font-bold">Fee Accounts</h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block mb-2">Service Charge Account</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input placeholder="Account Code" />
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
                    </div>

                    <div>
                      <label className="block mb-2">Notarial Account</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input placeholder="Account Code" />
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
                    </div>

                    <div>
                      <label className="block mb-2">Gross Account</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input placeholder="Account Code" />
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
                    </div>

                    <div>
                      <label className="block mb-2">Computer Charges Account</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input placeholder="Account Code" />
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
                    </div>

                    <div>
                      <label className="block mb-2">A/P PGA Account</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input placeholder="Account Code" />
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
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-xl font-bold">Loan Accounts</h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block mb-2">
                        Loans Receivable Account <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input placeholder="Account Code" />
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
                    </div>

                    <div>
                      <label className="block mb-2">
                        Interest Income Account <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input placeholder="Account Code" />
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
                    </div>

                    <div>
                      <label className="block mb-2">Interest Receivable Account</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input placeholder="Account Code" />
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
                    </div>

                    <div>
                      <label className="block mb-2">Unearned Interest Income Account</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input placeholder="Account Code" />
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
                    </div>

                    <div>
                      <label className="block mb-2">Other Income Penalty Account</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input placeholder="Account Code" />
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
                    </div>

                    <div>
                      <label className="block mb-2">Allowance for Doubtful Account</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input placeholder="Account Code" />
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
                    </div>

                    <div>
                      <label className="block mb-2">Bad Debt Expense Account</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input placeholder="Account Code" />
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
                    </div>

                    <div>
                      <label className="block mb-2">Garnished Expense Account</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input placeholder="Account Code" />
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
                    </div>
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
              <Button type="submit">{activeTab == "basic-info" ? "Continue" : "Save Loan Product"}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
