"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { DataTableV4, type ColumnDefinition } from "@/components/data-table/data-table-v4"
import type { LoanPayOff } from "../Service/LoanPayOffTypes"
import { cn } from "@/lib/utils"

// Form schema for loan pay off
const loanPayOffSchema = z.object({
  reference_code: z.string().min(1, "Reference code is required"),
  reference_name: z.string().min(1, "Reference name is required"),
  date_range_from: z.date(),
  date_range_to: z.date(),
  paid_by_insurance: z.number().min(0, "Insurance amount must be positive"),
})

export type LoanPayOffFormValues = z.infer<typeof loanPayOffSchema>

interface LoanOverview {
  id: string
  loan_id: string
  loan_type: string
  original_amount: number
  balance: number
  interest_fees: number
  status: "Active" | "Inactive" | "Paid"
  insurance: number
}

interface LoansOverviewTabProps {
  currentLoanPayOff: LoanPayOff | null
  onSaveAsDraft: (values: LoanPayOffFormValues) => void
  onProcess: () => void
  onReset: () => void
  isLoading: boolean
}

export function LoansOverviewTab({
  currentLoanPayOff,
  onSaveAsDraft,
  onProcess,
  onReset,
  isLoading,
}: LoansOverviewTabProps) {
  // Sample loan data
  const loanData: LoanOverview[] = [
    {
      id: "1",
      loan_id: "PN-2023-001",
      loan_type: "Salary Loan",
      original_amount: 50000.0,
      balance: 35000.0,
      interest_fees: 2500.0,
      status: "Active",
      insurance: 2500.0,
    },
    {
      id: "2",
      loan_id: "PN-2023-001",
      loan_type: "Bonus Loan",
      original_amount: 20000.0,
      balance: 15000.0,
      interest_fees: 1000.0,
      status: "Active",
      insurance: 1000.0,
    },
    {
      id: "3",
      loan_id: "PN-2023-001",
      loan_type: "Cash Advance Loan",
      original_amount: 10000.0,
      balance: 10000.0,
      interest_fees: 500.0,
      status: "Active",
      insurance: 500.0,
    },
  ]

  const columns: ColumnDefinition<LoanOverview>[] = [
    {
      id: "loan_id",
      header: "Loan ID/PN Number",
      accessorKey: "loan_id",
      enableSorting: false,
    },
    {
      id: "loan_type",
      header: "Loan Type",
      accessorKey: "loan_type",
      enableSorting: false,
    },
    {
      id: "original_amount",
      header: "Original Amount",
      accessorKey: "original_amount",
      enableSorting: false,
      cell: (item) => `₱${item.original_amount.toLocaleString()}`,
    },
    {
      id: "balance",
      header: "Balance",
      accessorKey: "balance",
      enableSorting: false,
      cell: (item) => `₱${item.balance.toLocaleString()}`,
    },
    {
      id: "interest_fees",
      header: "Interest/Fees",
      accessorKey: "interest_fees",
      enableSorting: false,
      cell: (item) => `₱${item.interest_fees.toLocaleString()}`,
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      enableSorting: false,
      cell: (item) => (
        <Badge variant={item.status === "Active" ? "default" : "secondary"} className="bg-green-100 text-green-800">
          {item.status}
        </Badge>
      ),
    },
    {
      id: "insurance",
      header: "Insurance",
      accessorKey: "insurance",
      enableSorting: false,
      cell: (item) => `₱${item.insurance.toLocaleString()}`,
    },
  ]

  // Initialize form
  const form = useForm<LoanPayOffFormValues>({
    resolver: zodResolver(loanPayOffSchema),
    defaultValues: {
      reference_code: currentLoanPayOff?.reference_code || "",
      reference_name: currentLoanPayOff?.reference_name || "",
      date_range_from: currentLoanPayOff?.date_range_from ? new Date(currentLoanPayOff.date_range_from) : new Date(),
      date_range_to: currentLoanPayOff?.date_range_to ? new Date(currentLoanPayOff.date_range_to) : new Date(),
      paid_by_insurance: currentLoanPayOff?.paid_by_insurance || 0,
    },
  })

  const handleSubmit = (values: LoanPayOffFormValues) => {
    onSaveAsDraft(values)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-4">
        <div className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {/* Filter Controls */}
              <Card className="border-none shadow-none p-0">
                <CardContent className="px-6">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <FormField
                      control={form.control}
                      name="reference_code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Reference code <span className="text-red-500">*</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="REF-001">REF-001</SelectItem>
                              <SelectItem value="REF-002">REF-002</SelectItem>
                              <SelectItem value="REF-003">REF-003</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="reference_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Reference name <span className="text-red-500">*</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="NAME-001">NAME-001</SelectItem>
                              <SelectItem value="NAME-002">NAME-002</SelectItem>
                              <SelectItem value="NAME-003">NAME-003</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <FormLabel>Date range</FormLabel>
                      <div className="flex items-center gap-2 mt-2">
                        <FormField
                          control={form.control}
                          name="date_range_from"
                          render={({ field }) => (
                            <FormItem className="flex-1">
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
                                      {field.value ? format(field.value, "MM/dd/yyyy") : <span>mm / dd / yyyy</span>}
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <span className="text-gray-500">-</span>
                        <FormField
                          control={form.control}
                          name="date_range_to"
                          render={({ field }) => (
                            <FormItem className="flex-1">
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
                                      {field.value ? format(field.value, "MM/dd/yyyy") : <span>mm / dd / yyyy</span>}
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="mt-6">
                      Reset
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Loans Table */}
              <Card className="border-none shadow-none p-0">
                <CardContent className="px-6">
                  <DataTableV4
                    data={loanData}
                    columns={columns}
                    showHeader={false}
                    enablePagination={false}
                    enableFilter={false}
                    enableSelection={false}
                  />
                </CardContent>
              </Card>

              {/* Paid by Insurance */}
              <Card className="border-none shadow-none p-0">
                <CardContent className="px-6">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="paid_by_insurance"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Paid by Insurance <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <p className="text-sm text-gray-500 mt-1">Input the insurance amount to pay-off loans</p>
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
        <Button onClick={onProcess} type="button" disabled={isLoading || !currentLoanPayOff}>
          Process
        </Button>
      </div>
    </div>
  )
}
