"use client"

import { useState, useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon, Plus, PencilIcon, TrashIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CoMakerDialog } from "../CoMakerDialog"
import type { SalaryLoan, CoMaker, Borrower } from "../Service/SalaryLoanProcessingTypes"
import { cn } from "@/lib/utils"

// Form schema for loan computation
const loanComputationSchema = z.object({
  transaction_date: z.date(),
  borrower_id: z.string().min(1, "Please select a borrower"),
  date_granted: z.date(),
  principal: z.number().min(1, "Principal amount is required"),
  terms: z.number().min(1, "Terms is required"),
  interest_rate: z.number().min(0, "Interest rate is required"),
  installment_period: z.string().min(1, "Installment period is required"),
  due_date: z.string().min(1, "Due date is required"),
  cash_card_amount: z.number().min(0),
  computer_fee: z.number().min(0),
  service_charge: z.number().min(0),
  insurance: z.number().min(0),
  notarial_fees: z.number().min(0),
  gross_receipts_tax: z.number().min(0),
  processing_fee: z.number().min(0),
  prepared_by: z.string().min(1, "Prepared by is required"),
  approved_by: z.string().optional(),
  remarks: z.string().optional(),
})

export type LoanComputationFormValues = z.infer<typeof loanComputationSchema>

interface LoanComputationTabProps {
  currentLoan: SalaryLoan | null
  borrowers: Borrower[]
  coMakers: CoMaker[]
  setCoMakers: (coMakers: CoMaker[]) => void
  onSaveAsDraft: (values: LoanComputationFormValues) => void
  onProcess: () => void
  onReset: () => void
  isLoading: boolean
}

export function LoanComputationTab({
  currentLoan,
  borrowers,
  coMakers,
  setCoMakers,
  onSaveAsDraft,
  onProcess,
  onReset,
  isLoading,
}: LoanComputationTabProps) {
  const [openCoMakerDialog, setOpenCoMakerDialog] = useState(false)

  // Initialize form
  const form = useForm<LoanComputationFormValues>({
    resolver: zodResolver(loanComputationSchema),
    defaultValues: {
      transaction_date: currentLoan?.transaction_date ? new Date(currentLoan.transaction_date) : new Date(),
      borrower_id: currentLoan?.borrower_id || "",
      date_granted: currentLoan?.date_granted ? new Date(currentLoan.date_granted) : new Date(),
      principal: currentLoan?.principal || 0,
      terms: currentLoan?.terms || 0,
      interest_rate: currentLoan?.interest_rate || 0,
      installment_period: currentLoan?.installment_period || "",
      due_date: currentLoan?.due_date || "",
      cash_card_amount: currentLoan?.cash_card_amount || 0,
      computer_fee: currentLoan?.computer_fee || 0,
      service_charge: currentLoan?.service_charge || 0,
      insurance: currentLoan?.insurance || 0,
      notarial_fees: currentLoan?.notarial_fees || 0,
      gross_receipts_tax: currentLoan?.gross_receipts_tax || 0,
      processing_fee: currentLoan?.processing_fee || 0,
      prepared_by: currentLoan?.prepared_by || "Current User Name",
      approved_by: currentLoan?.approved_by || "",
      remarks: currentLoan?.remarks || "",
    },
  })

  // Computed values
  const watchedValues = form.watch()
  const totalDeductions = useMemo(() => {
    return (
      watchedValues.cash_card_amount +
      watchedValues.computer_fee +
      watchedValues.service_charge +
      watchedValues.insurance +
      watchedValues.notarial_fees +
      watchedValues.gross_receipts_tax +
      watchedValues.processing_fee
    )
  }, [watchedValues])

  const netProceeds = useMemo(() => {
    return watchedValues.principal - totalDeductions
  }, [watchedValues.principal, totalDeductions])

  const totalPayable = useMemo(() => {
    const interest = watchedValues.principal * (watchedValues.interest_rate / 100) * watchedValues.terms
    return watchedValues.principal + interest
  }, [watchedValues.principal, watchedValues.interest_rate, watchedValues.terms])

  const monthlyAmortization = useMemo(() => {
    return watchedValues.terms > 0 ? totalPayable / watchedValues.terms : 0
  }, [totalPayable, watchedValues.terms])

  // Event handlers
  const handleAddCoMaker = (coMaker: Omit<CoMaker, "id">) => {
    const newCoMaker: CoMaker = {
      ...coMaker,
      id: (coMakers.length + 1).toString(),
    }
    setCoMakers([...coMakers, newCoMaker])
  }

  const handleRemoveCoMaker = (id: string) => {
    setCoMakers(coMakers.filter((cm) => cm.id !== id))
  }

  const handleSubmit = (values: LoanComputationFormValues) => {
    onSaveAsDraft(values)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-4">
        <div className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {/* Transaction Details */}
              <Card className="border-none shadow-none p-0">
                <CardContent className="px-6">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <FormField
                      control={form.control}
                      name="transaction_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Transaction date</FormLabel>
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
                                  {field.value ? format(field.value, "MM/dd/yyyy") : <span>Pick a date</span>}
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
                    <div>
                      <label className="text-sm font-medium mb-2 block">PN no.</label>
                      <Input value={currentLoan?.pn_no || "29687"} disabled className="bg-gray-50" />
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold mb-4">Loan Computation Details</h3>

                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="date_granted"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Date Granted <span className="text-red-500">*</span>
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
                                  {field.value ? format(field.value, "MM/dd/yyyy") : <span>Pick a date</span>}
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
                      name="principal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Principal <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="₱200,000.00"
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
                      name="terms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Terms <span className="text-red-500">*</span>
                          </FormLabel>
                          <Select
                            onValueChange={(value) => field.onChange(Number(value))}
                            value={field.value?.toString()}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="96 months" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {[12, 24, 36, 48, 60, 72, 84, 96].map((term) => (
                                <SelectItem key={term} value={term.toString()}>
                                  {term} months
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <FormField
                      control={form.control}
                      name="interest_rate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Interest rate</FormLabel>
                          <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="1.75%" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {[1.25, 1.5, 1.75, 2.0, 2.25, 2.5].map((rate) => (
                                <SelectItem key={rate} value={rate.toString()}>
                                  {rate}%
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div>
                      <label className="text-sm font-medium mb-2 block">Interest</label>
                      <Input
                        value={`₱${(watchedValues.principal * (watchedValues.interest_rate / 100) * watchedValues.terms).toLocaleString()}`}
                        disabled
                        className="bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Monthly amortization</label>
                      <Input value={`₱${monthlyAmortization.toLocaleString()}`} disabled className="bg-gray-50" />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <FormField
                      control={form.control}
                      name="installment_period"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Installment Period <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="01/18/2026 - 12/18/2033" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="due_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Due date</FormLabel>
                          <FormControl>
                            <Input placeholder="May 2025" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div>
                      <label className="text-sm font-medium mb-2 block">Total Payable</label>
                      <Input value={`₱${totalPayable.toLocaleString()}`} disabled className="bg-gray-50" />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Total Payable</label>
                      <Input value={`₱${totalPayable.toLocaleString()}`} disabled className="bg-gray-50" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Monthly Amortization</label>
                      <Input value={`₱${monthlyAmortization.toLocaleString()}`} disabled className="bg-gray-50" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Interest Rate</label>
                      <Input value={`${watchedValues.interest_rate}%`} disabled className="bg-gray-50" />
                    </div>
                  </div>

                  <div className="mt-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Total Interest over term</label>
                      <Input
                        value={`₱${(watchedValues.principal * (watchedValues.interest_rate / 100) * watchedValues.terms).toLocaleString()}`}
                        disabled
                        className="bg-gray-50"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Computation */}
              <Card className="border-none shadow-none p-0">
                <CardContent className="px-6">
                  <h3 className="text-lg font-semibold mb-4">Computation</h3>

                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="cash_card_amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Cash card amount <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="₱0.00"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div></div>
                    <div></div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <FormField
                      control={form.control}
                      name="computer_fee"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Computer Fee</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="₱200.00"
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
                      name="service_charge"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Service Charge</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="₱8,000.00"
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
                      name="insurance"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Insurance</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="₱6,000.00"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <FormField
                      control={form.control}
                      name="notarial_fees"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notarial Fees</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="₱3,000.00"
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
                      name="gross_receipts_tax"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gross Receipts Tax</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="₱1,000.00"
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
                      name="processing_fee"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Processing Fee (9.1%)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="₱18,200.00"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Existing Payables */}
              <Card className="border-none shadow-none p-0">
                <CardContent className="px-6">
                  <h3 className="text-lg font-semibold mb-4">List of existing payables</h3>

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
                      {currentLoan?.existing_payables.map((payable) => (
                        <TableRow key={payable.id}>
                          <TableCell>{payable.pn_no}</TableCell>
                          <TableCell>{payable.loan_type}</TableCell>
                          <TableCell>₱{payable.monthly_amortization.toLocaleString()}</TableCell>
                          <TableCell>₱{payable.overdraft.toLocaleString()}</TableCell>
                          <TableCell>₱{payable.total.toLocaleString()}</TableCell>
                          <TableCell>
                            <Input placeholder={payable.amount_paid} className="w-full" />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="text-sm font-medium">Total Deductions</label>
                      <Input value={`₱${totalDeductions.toLocaleString()}`} disabled className="bg-gray-50 w-[270px]" />
                    </div>

                    <div className="space-y-4">
                      <label className="text-lg font-semibold mb-4">Net Proceeds</label>
                      <div className="space-y-2">
                        <div className="text-sm font-medium mt-4">Net Proceeds of Loan</div>
                        <Input value={`₱${netProceeds.toLocaleString()}`} disabled className="bg-gray-50 w-[270px]" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Co-maker */}
              <Card className="border-none shadow-none p-0">
                <CardContent className="px-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Co-maker</h3>
                    <Button
                      type="button"
                      onClick={() => setOpenCoMakerDialog(true)}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      <Plus className="h-4 w-4" />
                      Add comaker
                    </Button>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {coMakers.map((coMaker) => (
                        <TableRow key={coMaker.id}>
                          <TableCell>{coMaker.name}</TableCell>
                          <TableCell>{coMaker.address}</TableCell>
                          <TableCell>{coMaker.contact}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon">
                                <PencilIcon className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleRemoveCoMaker(coMaker.id)}>
                                <TrashIcon className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

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
                            placeholder="Borrower is a long-time employee with a good credit history."
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
      <div className="border-t border-gray-200 bg-white p-4 flex justify-end gap-2 flex-shrink-0">
        <Button variant="outline" onClick={onReset} type="button">
          Reset
        </Button>
        <Button variant="outline" onClick={() => form.handleSubmit(handleSubmit)()} type="button" disabled={isLoading}>
          Save as Draft
        </Button>
        <Button onClick={onProcess} type="button" disabled={isLoading || !currentLoan}>
          Process
        </Button>
      </div>


      {/* Co-maker Dialog */}
      <CoMakerDialog
        open={openCoMakerDialog}
        onOpenChange={setOpenCoMakerDialog}
        onSave={handleAddCoMaker}
        borrowers={borrowers}
      />
    </div>
  )
}