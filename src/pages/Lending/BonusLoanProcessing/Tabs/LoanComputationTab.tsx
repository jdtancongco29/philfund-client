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
import { CoMakerDialog } from "../../LoanProcessing/Dialog/CoMakerDialog"
import type { BonusLoan, CoMaker } from "../Service/BonusLoanProcessingTypes"
import type { Borrower } from "@/components/borrower-search/borroer-search-panel"
import { cn } from "@/lib/utils"

// Form schema for bonus loan computation
const bonusLoanSchema = z.object({
  transaction_date: z.date(),
  borrower_id: z.string().min(1, "Please select a borrower"),
  loan_type: z.string().min(1, "Please select loan type"),
  promissory_no: z.string().min(1, "Promissory number is required"),
  date_granted: z.date(),
  principal_amount: z.number().min(1, "Principal amount is required"),
  interest_amount: z.number().min(0, "Interest amount is required"),
  cut_off_date: z.string().min(1, "Cut-off date is required"),
  no_of_days: z.number().min(1, "Number of days is required"),
  computed_interest: z.number().min(0, "Computed interest is required"),
  total_payable: z.number().min(0, "Total payable is required"),
  prepared_by: z.string().min(1, "Prepared by is required"),
  approved_by: z.string().optional(),
  remarks: z.string().optional(),
})

export type BonusLoanFormValues = z.infer<typeof bonusLoanSchema>

interface LoanComputationTabProps {
  currentBonusLoan: BonusLoan | null
  borrowers: Borrower[]
  coMakers: CoMaker[]
  setCoMakers: (coMakers: CoMaker[]) => void
  onSaveAsDraft: (values: BonusLoanFormValues) => void
  onProcess: () => void
  onReset: () => void
  isLoading: boolean
}

export function LoanComputationTab({
  currentBonusLoan,
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
  const form = useForm<BonusLoanFormValues>({
    resolver: zodResolver(bonusLoanSchema),
    defaultValues: {
      transaction_date: currentBonusLoan?.transaction_date ? new Date(currentBonusLoan.transaction_date) : new Date(),
      borrower_id: currentBonusLoan?.borrower_id || "",
      loan_type: currentBonusLoan?.loan_type || "",
      promissory_no: currentBonusLoan?.promissory_no || "PN-3434-2342",
      date_granted: currentBonusLoan?.date_granted ? new Date(currentBonusLoan.date_granted) : new Date(),
      principal_amount: currentBonusLoan?.principal_amount || 22000,
      interest_amount: currentBonusLoan?.interest_amount || 5,
      cut_off_date: currentBonusLoan?.cut_off_date || "May 31, 2026",
      no_of_days: currentBonusLoan?.no_of_days || 20,
      computed_interest: currentBonusLoan?.computed_interest || 7077.31,
      total_payable: currentBonusLoan?.total_payable || 29077.31,
      prepared_by: currentBonusLoan?.prepared_by || "Current User Name",
      approved_by: currentBonusLoan?.approved_by || "",
      remarks: currentBonusLoan?.remarks || "Borrower is a long-time employee with a good credit history.",
    },
  })

  // Computed values
  const watchedValues = form.watch()
  const totalDeductions = useMemo(() => {
    return 0 // No deductions for bonus loans in this example
  }, [])

  const netProceeds = useMemo(() => {
    return watchedValues.principal_amount - totalDeductions
  }, [watchedValues.principal_amount, totalDeductions])

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

  const handleSubmit = (values: BonusLoanFormValues) => {
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
                  <div className="grid grid-cols-3 gap-4 mb-6">
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
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="bonus">Bonus Loan</SelectItem>
                              <SelectItem value="salary">Salary Loan</SelectItem>
                              <SelectItem value="emergency">Emergency Loan</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="transaction_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Transaction Date</FormLabel>
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
                      name="promissory_no"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Promissory No.</FormLabel>
                          <FormControl>
                            <Input {...field} disabled className="bg-gray-50" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
                      name="principal_amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Principal Amount <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="₱22,000.00"
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
                          <FormLabel>
                            Interest Amount <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="5%"
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
                      name="cut_off_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cut-off Date</FormLabel>
                          <FormControl>
                            <Input placeholder="May 31, 2026" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="no_of_days"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>No. of Days till cut-off</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="20 Days"
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
                      name="computed_interest"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Computed Interest</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="₱7,077.31"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="mt-4">
                    <FormField
                      control={form.control}
                      name="total_payable"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Total Payable</FormLabel>
                          <FormControl>
                            <Input
                              value={`₱${field.value?.toLocaleString()}`}
                              disabled
                              className="bg-gray-50 w-[270px]"
                            />
                          </FormControl>
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
                  <h4 className="text-md font-medium mb-2">List of existing payables</h4>

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
                      <TableRow>
                        <TableCell>29145</TableCell>
                        <TableCell>Salary Loan</TableCell>
                        <TableCell>₱3,500.00</TableCell>
                        <TableCell>₱0.00</TableCell>
                        <TableCell>₱3,500.00</TableCell>
                        <TableCell>
                          <Input placeholder="Type here..." className="w-full" />
                        </TableCell>
                      </TableRow>
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
      <div className="border-t border-gray-200 bg-white p-4 pb-0 flex justify-end gap-2 flex-shrink-0">
        <Button variant="outline" onClick={onReset} type="button">
          Reset
        </Button>
        <Button variant="outline" onClick={() => form.handleSubmit(handleSubmit)()} type="button" disabled={isLoading}>
          Save as Draft
        </Button>
        <Button onClick={onProcess} type="button" disabled={isLoading || !currentBonusLoan}>
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
