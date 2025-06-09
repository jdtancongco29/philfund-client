"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { CashAdvance, Borrower } from "../Service/CashAdvanceProcessingTypes"
import { cn } from "@/lib/utils"

// Form schema for cash advance
const cashAdvanceSchema = z.object({
  transaction_date: z.date(),
  promissory_note_number: z.string().min(1, "Promissory note number is required"),
  cash_advance_type: z.enum(["salary", "bonus"]),
  type_of_cash_advance: z.string().min(1, "Please select type of cash advance"),
  interest_rate: z.number().min(0, "Interest rate must be positive"),
  surcharge_rate: z.number().min(0, "Surcharge rate must be positive"),
  principal: z.number().min(1, "Principal amount is required"),
  interest_amount: z.number().min(0, "Interest amount must be positive"),
  date_due: z.date(),
  total_deductions: z.number().min(0, "Total deductions must be positive"),
  net_proceeds: z.number().min(0, "Net proceeds must be positive"),
  borrower_id: z.string().min(1, "Please select a borrower"),
  prepared_by: z.string().min(1, "Prepared by is required"),
  approved_by: z.string().optional(),
  remarks: z.string().optional(),
})

export type CashAdvanceFormValues = z.infer<typeof cashAdvanceSchema>

interface ExistingPayable {
  pn_no: string
  loan_type: string
  monthly_amortization: number
  overdraft: number
  total: number
  amount_paid: number
}

interface InformationTabProps {
  currentCashAdvance: CashAdvance | null
  borrowers: Borrower[]
  onSaveAsDraft: (values: CashAdvanceFormValues) => void
  onProcess: () => void
  onReset: () => void
  isLoading: boolean
}

export function InformationTab({
  currentCashAdvance,
  // borrowers,
  onSaveAsDraft,
  onProcess,
  onReset,
  isLoading,
}: InformationTabProps) {
  // Sample existing payables data
  const existingPayables: ExistingPayable[] = [
    {
      pn_no: "29145",
      loan_type: "Salary Loan",
      monthly_amortization: 3500.0,
      overdraft: 0.0,
      total: 3500.0,
      amount_paid: 0,
    },
  ]

  // Initialize form
  const form = useForm<CashAdvanceFormValues>({
    resolver: zodResolver(cashAdvanceSchema),
    defaultValues: {
      transaction_date: currentCashAdvance?.transaction_date
        ? new Date(currentCashAdvance.transaction_date)
        : new Date(),
      promissory_note_number: currentCashAdvance?.reference_number || "PN-2024-08-1234",
      cash_advance_type: "salary",
      type_of_cash_advance: "",
      interest_rate: 5,
      surcharge_rate: 5,
      principal: currentCashAdvance?.amount || 5000,
      interest_amount: 3500,
      date_due: new Date("2025-05-01"),
      total_deductions: 0,
      net_proceeds: 22000,
      borrower_id: currentCashAdvance?.borrower_id || "",
      prepared_by: currentCashAdvance?.prepared_by || "Current User Name",
      approved_by: currentCashAdvance?.approved_by || "",
      remarks: currentCashAdvance?.remarks || "",
    },
  })

  const handleSubmit = (values: CashAdvanceFormValues) => {
    onSaveAsDraft(values)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-4">
        <div className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {/* Cash Advance Details */}
              <Card className="border-none shadow-none p-0">
                <CardContent className="px-6">
                  <h3 className="text-lg font-semibold mb-4">Cash Advance Details</h3>

                  {/* First Row */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <FormField
                      control={form.control}
                      name="transaction_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Transaction Date <span className="text-red-500">*</span>
                          </FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground",
                                  )}
                                >
                                  {field.value ? format(field.value, "yyyy-MM-dd") : <span>Pick a date</span>}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="promissory_note_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Promissory Note Number</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-gray-50" readOnly />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Second Row */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <FormField
                      control={form.control}
                      name="cash_advance_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Cash Advance type <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="flex flex-row space-x-6"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="salary" id="salary" />
                                <Label htmlFor="salary">Salary</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="bonus" id="bonus" />
                                <Label htmlFor="bonus">Bonus</Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="type_of_cash_advance"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Type of Cash Advance to make <span className="text-red-500">*</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="emergency">Emergency</SelectItem>
                              <SelectItem value="medical">Medical</SelectItem>
                              <SelectItem value="educational">Educational</SelectItem>
                              <SelectItem value="personal">Personal</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Third Row */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <FormField
                      control={form.control}
                      name="interest_rate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Interest Rate</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                              className="bg-gray-50"
                              readOnly
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="surcharge_rate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Surcharge Rate</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                              className="bg-gray-50"
                              readOnly
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Fourth Row */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <FormField
                      control={form.control}
                      name="principal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Principal <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="₱5,000.00"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="interest_amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Interest Amount</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                              className="bg-gray-50"
                              readOnly
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Fifth Row */}
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="date_due"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Date Due <span className="text-red-500">*</span>
                          </FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground",
                                  )}
                                >
                                  {field.value ? format(field.value, "MMM - yyyy") : <span>Pick a date</span>}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Computation */}
              <Card className="border-none shadow-none p-0">
                <CardContent className="px-6">
                  <h3 className="text-lg font-semibold mb-4">Computation</h3>

                  <div className="mb-4">
                    <Label className="text-sm font-medium mb-2 block">List of existing payables</Label>
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>PN no.</TableHead>
                            <TableHead>Loan type</TableHead>
                            <TableHead>Monthly amortization</TableHead>
                            <TableHead>Overdraft</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Amount Paid</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {existingPayables.map((payable, index) => (
                            <TableRow key={index}>
                              <TableCell>{payable.pn_no}</TableCell>
                              <TableCell>{payable.loan_type}</TableCell>
                              <TableCell>
                                ₱{payable.monthly_amortization.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                              </TableCell>
                              <TableCell>
                                ₱{payable.overdraft.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                              </TableCell>
                              <TableCell>
                                ₱{payable.total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                              </TableCell>
                              <TableCell>
                                <Input placeholder="Type here..." className="w-full" type="number" step="0.01" />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="total_deductions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Total Deductions</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                              className="bg-gray-50"
                              readOnly
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Net Proceeds */}
              <Card className="border-none shadow-none p-0">
                <CardContent className="px-6">
                  <h3 className="text-lg font-semibold mb-4">Net Proceeds</h3>

                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="net_proceeds"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Net Proceeds of Loan</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                              className="bg-gray-50"
                              readOnly
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Remarks */}
              <Card className="border-none shadow-none p-0">
                <CardContent className="px-6">
                  <FormField
                    control={form.control}
                    name="remarks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Remarks</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Cash advance for employee expenses."
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Approval */}
              <Card className="border-none shadow-none p-0">
                <CardContent className="px-6">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="prepared_by"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prepared by</FormLabel>
                          <FormControl>
                            <Input {...field} disabled className="bg-gray-50" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="approved_by"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Approved by <span className="text-red-500">*</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="manager1">Branch Manager 1</SelectItem>
                              <SelectItem value="manager2">Branch Manager 2</SelectItem>
                              <SelectItem value="supervisor">Supervisor</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </form>
          </Form>
        </div>
      </div>

      {/* Sticky Action Buttons */}
      <div className="border-t border-gray-200 bg-white p-4 pb-0 flex justify-end gap-2 flex-shrink-0">
        <Button variant="outline" onClick={onReset} type="button">
          Reset
        </Button>
        <Button variant="outline" onClick={() => form.handleSubmit(handleSubmit)()} type="button" disabled={isLoading}>
          Save as Draft
        </Button>
        <Button onClick={onProcess} type="button" disabled={isLoading || !currentCashAdvance}>
          Process
        </Button>
      </div>
    </div>
  )
}