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
import type { CashAdvance, Borrower } from "../Service/CashAdvanceProcessingTypes"
import { cn } from "@/lib/utils"
import { JournalEntryTable } from "../Components/JournalEntryTable"

// Form schema for cash advance
const cashAdvanceSchema = z.object({
  transaction_date: z.date(),
  borrower_id: z.string().min(1, "Please select a borrower"),
  reference_code: z.string().min(1, "Reference code is required"),
  reference_number: z.string().min(1, "Reference number is required"),
  amount: z.number().min(1, "Amount is required"),
  prepared_by: z.string().min(1, "Prepared by is required"),
  approved_by: z.string().optional(),
  remarks: z.string().optional(),
})

export type CashAdvanceFormValues = z.infer<typeof cashAdvanceSchema>

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
  borrowers,
  onSaveAsDraft,
  onProcess,
  onReset,
  isLoading,
}: InformationTabProps) {
  // Initialize form
  const form = useForm<CashAdvanceFormValues>({
    resolver: zodResolver(cashAdvanceSchema),
    defaultValues: {
      transaction_date: currentCashAdvance?.transaction_date
        ? new Date(currentCashAdvance.transaction_date)
        : new Date(),
      borrower_id: currentCashAdvance?.borrower_id || "",
      reference_code: currentCashAdvance?.reference_code || "",
      reference_number: currentCashAdvance?.reference_number || "",
      amount: currentCashAdvance?.amount || 0,
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
              {/* Transaction Details */}
              <Card className="border-none shadow-none p-0">
                <CardContent className="px-6">
                  <h3 className="text-lg font-semibold mb-4">Borrower Information</h3>
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
                    <FormField
                      control={form.control}
                      name="borrower_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Borrower <span className="text-red-500">*</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select borrower" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {borrowers.map((borrower) => (
                                <SelectItem key={borrower.id} value={borrower.id}>
                                  {borrower.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="reference_code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Reference Code <span className="text-red-500">*</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="CA-2024-001">CA-2024-001</SelectItem>
                              <SelectItem value="CA-2024-002">CA-2024-002</SelectItem>
                              <SelectItem value="CA-2024-003">CA-2024-003</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="reference_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Reference Number <span className="text-red-500">*</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="12345">12345</SelectItem>
                              <SelectItem value="12346">12346</SelectItem>
                              <SelectItem value="12347">12347</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Journal Entry */}
              <Card className="border-none shadow-none p-0">
                <CardContent className="px-6">
                  <h3 className="text-lg font-semibold mb-4">Journal Entry</h3>
                  <JournalEntryTable data={currentCashAdvance?.journal_entries || []} showTotals={true} />
                </CardContent>
              </Card>

              {/* Amount */}
              <Card className="border-none shadow-none p-0">
                <CardContent className="px-6">
                  <h3 className="text-lg font-semibold mb-4">Amount</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Amount <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="₱5,000.00"
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
