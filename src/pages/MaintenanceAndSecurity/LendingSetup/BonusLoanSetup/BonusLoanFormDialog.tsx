"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { BonusLoan, CreateBonusLoanPayload, UpdateBonusLoanPayload } from "./Service/BonusLoanSetupTypes"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import BonusLoanSetupService from "./Service/BonusLoanSetupService"
import ClassificationSetupService from "../ClassificationSetup/Service/ClassificationSetupService"
import { Loader2 } from "lucide-react"

// Define the form schema with validation
const formSchema = z.object({
  // Basic Info
  code: z.string().min(1, "Bonus loan code is required"),
  name: z.string().min(1, "Bonus loan name is required"),
  interest_rate: z
    .string()
    .min(1, "Interest rate is required")
    .refine((val) => !isNaN(Number(val)), "Must be a valid number"),
  surcharge_rate: z
    .string()
    .min(1, "Surcharge rate is required")
    .refine((val) => !isNaN(Number(val)), "Must be a valid number"),
  release_month: z.string().min(1, "Release month is required"),
  cut_off_date: z.string().min(1, "Cut-off date is required"),
  max_amt: z
    .string()
    .min(1, "Maximum amount is required")
    .refine((val) => !isNaN(Number(val)), "Must be a valid number"),
  max_rate: z
    .string()
    .optional()
    .refine((val) => val === "" || !isNaN(Number(val)), "Must be a valid number"),

  // Chart of Accounts
  coa_loan_interest_recievable: z.string().min(1, "Loan Interest Receivable account is required"),
  coa_interest_income: z.string().min(1, "Interest Income account is required"),
  coa_garnished_expense: z.string().min(1, "Garnished Expense account is required"),
  coa_unearned_interest: z.string().min(1, "Unearned Interest account is required"),
  coa_other_income_penalty: z.string().min(1, "Other Income Penalty account is required"),
  coa_allowance_doubtful_account: z.string().min(1, "Allowance Doubtful Account is required"),
  coa_bad_dept_expense: z.string().min(1, "Bad Debt Expense account is required"),

  // Classifications
  eligible_class: z.array(z.string()).optional(),
})

// Define the form values type
type FormValues = z.infer<typeof formSchema>

// Define the component props
interface BonusLoanFormDialogProps {
  item: BonusLoan | null
  open: boolean
  isEditing: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: () => void
  onCancel: () => void
}

export function BonusLoanFormDialog({
  open,
  isEditing,
  item,
  onOpenChange,
  onCancel,
  onSubmit,
}: BonusLoanFormDialogProps) {
  const [activeTab, setActiveTab] = useState("basic-info")
  const queryClient = useQueryClient()

  const editingHandler = useMutation({
    mutationFn: (newBonusLoan: UpdateBonusLoanPayload) => {
      return BonusLoanSetupService.updateBonusLoan(item!.id, newBonusLoan)
    },
  })
  const creationHandler = useMutation({
    mutationFn: (newBonusLoan: CreateBonusLoanPayload) => {
      return BonusLoanSetupService.createBonusLoan(newBonusLoan)
    },
  })

  // Fetch classifications for the checkbox list
  const { data: classificationsData } = useQuery({
    queryKey: ["classifications-for-bonus-loan"],
    queryFn: () => ClassificationSetupService.getAllClassifications(),
    staleTime: Number.POSITIVE_INFINITY,
  })

  // Fetch COA for the dropdowns
  const { data: coaData } = useQuery({
    queryKey: ["coa-for-bonus-loan"],
    queryFn: () => BonusLoanSetupService.getAllCOA(),
    staleTime: Number.POSITIVE_INFINITY,
  })

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      name: "",
      interest_rate: "",
      surcharge_rate: "",
      release_month: "",
      cut_off_date: "",
      max_amt: "",
      max_rate: "",
      coa_loan_interest_recievable: "",
      coa_interest_income: "",
      coa_garnished_expense: "",
      coa_unearned_interest: "",
      coa_other_income_penalty: "",
      coa_allowance_doubtful_account: "",
      coa_bad_dept_expense: "",
      eligible_class: [],
    },
  })

  console.log(item);

  useEffect(() => {
    if (item) {
      form.reset({
        code: item.code,
        name: item.name,
        interest_rate: item.interest_rate,
        surcharge_rate: item.surcharge_rate,
        release_month: item.release_month.toString(),
        cut_off_date: item.cut_off_date,
        max_amt: item.max_amt,
        max_rate: item.max_rate || "",
        coa_loan_interest_recievable: item.coa_interest_recievable?.id ?? 0,
        coa_interest_income: item.coa_interest_income?.id ?? 0,
        coa_garnished_expense: item.coa_garnished_expense?.id ?? 0,
        coa_unearned_interest: item.coa_unearned_interest?.id ?? 0,
        coa_other_income_penalty: item.coa_other_income_penalty?.id ?? 0,
        coa_allowance_doubtful_account: item.coa_allowance_doubtful_account?.id ?? 0,
        coa_bad_dept_expense: item.coa_bad_dept_expense?.id ?? 0,
        // eligible_class: item.classifications.map((classification) => classification.id),
        eligible_class: [],
      })
    } else {
      form.reset()
    }
  }, [item, form])

  const create = async (values: FormValues) => {
    const payload: CreateBonusLoanPayload = {
      code: values.code,
      name: values.name,
      interest_rate: Number.parseFloat(values.interest_rate),
      surcharge_rate: Number.parseFloat(values.surcharge_rate),
      release_month: Number.parseInt(values.release_month),
      cut_off_date: values.cut_off_date,
      max_amt: Number.parseFloat(values.max_amt),
      max_rate: values.max_rate ? Number.parseFloat(values.max_rate) : null,
      eligible_class: values.eligible_class || [],
      coa_loan_interest_recievable: values.coa_loan_interest_recievable,
      coa_interest_income: values.coa_interest_income,
      coa_garnished_expense: values.coa_garnished_expense,
      coa_unearned_interest: values.coa_unearned_interest,
      coa_other_income_penalty: values.coa_other_income_penalty,
      coa_allowance_doubtful_account: values.coa_allowance_doubtful_account,
      coa_bad_dept_expense: values.coa_bad_dept_expense,
    }
    try {
      await creationHandler.mutateAsync(payload)
      queryClient.invalidateQueries({ queryKey: ["bonus-loan-table"] })
      onSubmit()
      form.reset()
    } catch (errorData: unknown) {
      console.error(errorData)
    }
  }

  const update = async (values: FormValues) => {
    const payload: UpdateBonusLoanPayload = {
      code: values.code,
      name: values.name,
      interest_rate: Number.parseFloat(values.interest_rate),
      surcharge_rate: Number.parseFloat(values.surcharge_rate),
      release_month: Number.parseInt(values.release_month),
      cut_off_date: values.cut_off_date,
      max_amt: Number.parseFloat(values.max_amt),
      max_rate: values.max_rate ? Number.parseFloat(values.max_rate) : null,
      eligible_class: values.eligible_class || [],
      coa_loan_interest_recievable: values.coa_loan_interest_recievable,
      coa_interest_income: values.coa_interest_income,
      coa_garnished_expense: values.coa_garnished_expense,
      coa_unearned_interest: values.coa_unearned_interest,
      coa_other_income_penalty: values.coa_other_income_penalty,
      coa_allowance_doubtful_account: values.coa_allowance_doubtful_account,
      coa_bad_dept_expense: values.coa_bad_dept_expense,
    }
    try {
      await editingHandler.mutateAsync(payload)
      queryClient.invalidateQueries({ queryKey: ["bonus-loan-table"] })
      onSubmit()
      form.reset()
    } catch (_error) {
      console.log(_error)
    }
  }

  // Handle form submission
  const onFormSubmit = (values: FormValues) => {
    if (activeTab === "basic-info") {
      setActiveTab("chart-of-accounts")
      return
    }

    if (isEditing) {
      update(values)
    } else {
      create(values)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(open) => {
      onOpenChange(open)
      if (!open) {
        form.reset()
        setActiveTab("basic-info")
      }
    }}>
      <DialogContent className="min-w-5xl h-5/6 flex flex-col overflow-x-hidden overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{isEditing ? "Edit" : "Add New"} Bonus Loan</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-6">
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
                    disabled={creationHandler.isPending || editingHandler.isPending}
                    control={form.control}
                    name="code"
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
                    disabled={creationHandler.isPending || editingHandler.isPending}
                    control={form.control}
                    name="name"
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
                    disabled={creationHandler.isPending || editingHandler.isPending}
                    control={form.control}
                    name="release_month"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">
                          Month of Release <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">January</SelectItem>
                            <SelectItem value="2">February</SelectItem>
                            <SelectItem value="3">March</SelectItem>
                            <SelectItem value="4">April</SelectItem>
                            <SelectItem value="5">May</SelectItem>
                            <SelectItem value="6">June</SelectItem>
                            <SelectItem value="7">July</SelectItem>
                            <SelectItem value="8">August</SelectItem>
                            <SelectItem value="9">September</SelectItem>
                            <SelectItem value="10">October</SelectItem>
                            <SelectItem value="11">November</SelectItem>
                            <SelectItem value="12">December</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>Month when the bonus is released</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    disabled={creationHandler.isPending || editingHandler.isPending}
                    control={form.control}
                    name="cut_off_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">
                          Cut-off Date <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., May 31" {...field} />
                        </FormControl>
                        <FormDescription>Cut-off date for eligibility</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    disabled={creationHandler.isPending || editingHandler.isPending}
                    control={form.control}
                    name="interest_rate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">
                          Interest Rate (%) <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="0.00" {...field} />
                        </FormControl>
                        <FormDescription>Annual interest rate percentage</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    disabled={creationHandler.isPending || editingHandler.isPending}
                    control={form.control}
                    name="surcharge_rate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">
                          Surcharge Rate (%) <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="0.00" {...field} />
                        </FormControl>
                        <FormDescription>Penalty rate for late payments</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    disabled={creationHandler.isPending || editingHandler.isPending}
                    control={form.control}
                    name="max_amt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">
                          Maximum Amount <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="0.00" {...field} />
                        </FormControl>
                        <FormDescription>Maximum loan amount allowed</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    disabled={creationHandler.isPending || editingHandler.isPending}
                    control={form.control}
                    name="max_rate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">Maximum Rate (%)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="0.00" {...field} />
                        </FormControl>
                        <FormDescription>Maximum rate percentage (optional)</FormDescription>
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
                        <TableHead className="text-right">Can Avail of Bonus Loan</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {classificationsData?.data.classifications.map((classification) => (
                        <TableRow key={classification.id}>
                          <TableCell>{classification.name}</TableCell>
                          <TableCell className="text-right">
                            <FormField
                              disabled={creationHandler.isPending || editingHandler.isPending}
                              control={form.control}
                              name="eligible_class"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(classification.id)}
                                      onCheckedChange={(checked) => {
                                        const currentValue = field.value || []
                                        if (checked) {
                                          field.onChange([...currentValue, classification.id])
                                        } else {
                                          field.onChange(currentValue.filter((id) => id !== classification.id))
                                        }
                                      }}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="chart-of-accounts" className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-xl font-bold">Chart of Accounts</h2>

                  <div className="space-y-4">
                    <FormField
                      disabled={creationHandler.isPending || editingHandler.isPending}
                      control={form.control}
                      name="coa_loan_interest_recievable"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="block mb-2">
                            Loan Interest Receivable <span className="text-red-500">*</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {coaData?.data.chartOfAccounts.map((account) => (
                                <SelectItem key={account.id} value={account.id}>
                                  {account.code} - {account.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      disabled={creationHandler.isPending || editingHandler.isPending}
                      control={form.control}
                      name="coa_interest_income"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="block mb-2">
                            Interest Income <span className="text-red-500">*</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {coaData?.data.chartOfAccounts.map((account) => (
                                <SelectItem key={account.id} value={account.id}>
                                  {account.code} - {account.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      disabled={creationHandler.isPending || editingHandler.isPending}
                      control={form.control}
                      name="coa_garnished_expense"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="block mb-2">
                            Garnished Expense <span className="text-red-500">*</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {coaData?.data.chartOfAccounts.map((account) => (
                                <SelectItem key={account.id} value={account.id}>
                                  {account.code} - {account.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      disabled={creationHandler.isPending || editingHandler.isPending}
                      control={form.control}
                      name="coa_unearned_interest"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="block mb-2">
                            Unearned Interest <span className="text-red-500">*</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {coaData?.data.chartOfAccounts.map((account) => (
                                <SelectItem key={account.id} value={account.id}>
                                  {account.code} - {account.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      disabled={creationHandler.isPending || editingHandler.isPending}
                      control={form.control}
                      name="coa_other_income_penalty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="block mb-2">
                            Other Income Penalty <span className="text-red-500">*</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {coaData?.data.chartOfAccounts.map((account) => (
                                <SelectItem key={account.id} value={account.id}>
                                  {account.code} - {account.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      disabled={creationHandler.isPending || editingHandler.isPending}
                      control={form.control}
                      name="coa_allowance_doubtful_account"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="block mb-2">
                            Allowance for Doubtful Account <span className="text-red-500">*</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {coaData?.data.chartOfAccounts.map((account) => (
                                <SelectItem key={account.id} value={account.id}>
                                  {account.code} - {account.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      disabled={creationHandler.isPending || editingHandler.isPending}
                      control={form.control}
                      name="coa_bad_dept_expense"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="block mb-2">
                            Bad Debt Expense <span className="text-red-500">*</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {coaData?.data.chartOfAccounts.map((account) => (
                                <SelectItem key={account.id} value={account.id}>
                                  {account.code} - {account.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
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
                disabled={creationHandler.isPending || editingHandler.isPending}
                type="button"
                variant="outline"
                onClick={() => {
                  onCancel()
                  onOpenChange(false)
                  form.reset()
                }}
              >
                Cancel
              </Button>
              <Button disabled={creationHandler.isPending || editingHandler.isPending} type="submit">
                {activeTab === "basic-info" ? "Continue" : isEditing ? "Update" : "Save"} Bonus Loan{" "}
                {(creationHandler.isPending || editingHandler.isPending) && (
                  <span>
                    <Loader2 className="animate-spin" />
                  </span>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
