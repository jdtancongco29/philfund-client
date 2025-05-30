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
import { Loader2 } from 'lucide-react'
import { AxiosError } from "axios"

// Define the form schema with comprehensive validation
const formSchema = z
  .object({
    // Basic Info - all required
    code: z.string().min(1, "Bonus loan code is required"),
    name: z.string().min(1, "Bonus loan name is required"),
    interest_rate: z
      .string()
      .min(1, "Interest rate is required")
      .refine((val) =>
        !isNaN(Number(val)), "Must be a valid number")
      .refine((val) => Number(val) <= 100, {
        message: "Interest rate must not exceed 100%",
      }),
    surcharge_rate: z
      .string()
      .min(1, "Surcharge rate is required")
      .refine((val) => !isNaN(Number(val)), "Must be a valid number")
      .refine((val) => Number(val) <= 100, {
        message: "Surcharge rate must not exceed 100%",
      }),
    release_month: z.string().min(1, "Release month is required"),
    cut_off_date: z.string().min(1, "Cut-off date is required"),
    max_amt: z
      .string()
      .refine((val) => !isNaN(Number(val)), "Must be a valid number").nullable(),
    max_rate: z
      .string()
      .optional()
      .refine((val) => val === "" || !isNaN(Number(val)), "Must be a valid number")
      .refine((val) => Number(val) <= 100, {
        message: "Maximum rate must not exceed 100%",
      }),

    // Chart of Accounts - all required
    coa_interest_receivable: z.string().min(1, "Loan Interest Receivable account is required"),
    coa_loan_receivable: z.string().min(1, "Loan Receivable account is required"),
    coa_interest_income: z.string().min(1, "Interest Income account is required"),
    coa_garnished_expense: z.string().min(1, "Garnished Expense account is required"),
    coa_unearned_interest: z.string().min(1, "Unearned Interest account is required"),
    coa_other_income_penalty: z.string().min(1, "Other Income Penalty account is required"),
    coa_allowance_doubtful_account: z.string().min(1, "Allowance Doubtful Account is required"),
    coa_bad_dept_expense: z.string().min(1, "Bad Debt Expense account is required"),

    // Classifications - at least one required
    eligible_class: z.array(z.string()).min(1, "At least one classification must be selected"),
  })
  .refine(
    (data) => {
      // Validate that all COA values are unique
      const coaValues = [
        data.coa_interest_receivable,
        data.coa_loan_receivable,
        data.coa_interest_income,
        data.coa_garnished_expense,
        data.coa_unearned_interest,
        data.coa_other_income_penalty,
        data.coa_allowance_doubtful_account,
        data.coa_bad_dept_expense,
      ].filter(Boolean) // Remove empty values

      const uniqueValues = new Set(coaValues)
      return uniqueValues.size === coaValues.length
    },
    {
      message: "Each chart of account must be unique. No duplicates allowed.",
      path: ["coa_loan_interest_recievable"], // Show error on the first COA field
    },
  )

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

  // Fetch detailed bonus loan data when editing
  const { data: bonusLoanDetail, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["bonus-loan-detail", item?.id],
    queryFn: () => BonusLoanSetupService.getBonusLoanById(item!.id),
    enabled: isEditing && !!item?.id,
    staleTime: 0, // Always fetch fresh data
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

  const getCoaFieldCode = (id: string) => {
    const coa = coaData?.data.chartOfAccounts.filter((coa) => coa.id == id)
    if (coa?.length != 0 || false) {
      return coa![0].code
    }
    return ""
  }

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
      coa_interest_receivable: "",
      coa_loan_receivable: "",
      coa_interest_income: "",
      coa_garnished_expense: "",
      coa_unearned_interest: "",
      coa_other_income_penalty: "",
      coa_allowance_doubtful_account: "",
      coa_bad_dept_expense: "",
      eligible_class: [],
    },
  })

  // Watch all COA values to filter out duplicates
  const watchedCoaValues = form.watch([
    "coa_interest_receivable",
    "coa_loan_receivable",
    "coa_interest_income",
    "coa_garnished_expense",
    "coa_unearned_interest",
    "coa_other_income_penalty",
    "coa_allowance_doubtful_account",
    "coa_bad_dept_expense",
  ])

  const nonCoaFields = [
    "code",
    "name",
    "interest_rate",
    "surcharge_rate",
    "release_month",
    "cut_off_date",
    "max_amt",
    "max_rate",
    "eligible_class"
  ];



  // Get available COA options for each field (excluding already selected values)
  const getAvailableCoaOptions = (currentFieldValue: string) => {
    if (!coaData?.data.chartOfAccounts) return []

    const usedValues = watchedCoaValues.filter((value) => value && value !== currentFieldValue)
    return coaData.data.chartOfAccounts.filter((account) => !usedValues.includes(account.id))
  }

  // Check if form should be disabled (loading or pending operations)
  const isFormDisabled = creationHandler.isPending || editingHandler.isPending || (isEditing && isLoadingDetail)

  useEffect(() => {
    if (isEditing && bonusLoanDetail?.data) {
      const detail = bonusLoanDetail.data
      form.reset({
        code: detail.code,
        name: detail.name,
        interest_rate: detail.interest_rate,
        surcharge_rate: detail.surcharge_rate,
        release_month: detail.release_month.toString(),
        cut_off_date: detail.cut_off_date,
        max_amt: detail.max_amt,
        max_rate: detail.max_rate || "",
        coa_interest_receivable: detail.coa_interest_receivable?.id || "",
        coa_loan_receivable: detail.coa_loan_receivable?.id || "",
        coa_interest_income: detail.coa_interest_income?.id || "",
        coa_garnished_expense: detail.coa_garnished_expense?.id || "",
        coa_unearned_interest: detail.coa_unearned_interest?.id || "",
        coa_other_income_penalty: detail.coa_other_income_penalty?.id || "",
        coa_allowance_doubtful_account: detail.coa_allowance_doubtful_account?.id || "",
        coa_bad_dept_expense: detail.coa_bad_dept_expense?.id || "",
        eligible_class: detail.classifications?.map((classification) => classification.id) || [],
      })
    } else if (!isEditing) {
      form.reset({
        code: "",
        name: "",
        interest_rate: "",
        surcharge_rate: "",
        release_month: "",
        cut_off_date: "",
        max_amt: "",
        max_rate: "",
        coa_interest_receivable: "",
        coa_loan_receivable: "",
        coa_interest_income: "",
        coa_garnished_expense: "",
        coa_unearned_interest: "",
        coa_other_income_penalty: "",
        coa_allowance_doubtful_account: "",
        coa_bad_dept_expense: "",
        eligible_class: [],
      })
    }
  }, [isEditing, bonusLoanDetail, form])

  const create = async (values: FormValues) => {
    const payload: CreateBonusLoanPayload = {
      code: values.code,
      name: values.name,
      interest_rate: Number.parseFloat(values.interest_rate),
      surcharge_rate: Number.parseFloat(values.surcharge_rate),
      release_month: Number.parseInt(values.release_month),
      cut_off_date: values.cut_off_date,
      max_amt: Number.parseFloat(values?.max_amt ?? ""),
      max_rate: values.max_rate ? Number.parseFloat(values.max_rate) : null,
      eligible_class: values.eligible_class,
      coa_loan_receivable: values.coa_loan_receivable,
      coa_interest_receivable: values.coa_interest_receivable,
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
      if (errorData instanceof AxiosError) {
        Object.entries(errorData.response?.data.errors).forEach(([field, messages]) => {
          const errorMsg = messages as string[];
          form.setError(field as any, {
            type: 'manual',
            message: errorMsg[0]
          });
        }
        )
      }
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
      max_amt: Number.parseFloat(values?.max_amt ?? ""),
      max_rate: values.max_rate ? Number.parseFloat(values.max_rate) : null,
      eligible_class: values.eligible_class,
      coa_loan_receivable: values.coa_loan_receivable,
      coa_interest_receivable: values.coa_interest_receivable,
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
    } catch (errorData: unknown) {
      if (errorData instanceof AxiosError) {
        Object.entries(errorData.response?.data.errors).forEach(([field, messages]) => {
          const errorMsg = messages as string[];
          form.setError(field as any, {
            type: 'manual',
            message: errorMsg[0]
          });
        }
        )
      }
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
    setActiveTab("basic-info")
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        onOpenChange(open)
        if (!open) {
          form.reset()
          setActiveTab("basic-info")
        }
      }}
    >
      <DialogContent className="min-w-5xl h-5/6 flex flex-col overflow-x-hidden overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{isEditing ? "Edit" : "Add New"} Bonus Loan</DialogTitle>
        </DialogHeader>

        {/* Show loading indicator when fetching detailed data for editing */}
        {isEditing && isLoadingDetail && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading bonus loan details...</span>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(
            (data) => {
              // Valid submission
              onFormSubmit(data);
            },
            (errors) => {
              // This is called AFTER validation fails
              const errorKeys = Object.keys(errors);
              for (const key of errorKeys) {
                if (nonCoaFields.includes(key)) {
                  setActiveTab("basic-info");
                  return;
                }
              }
              if (activeTab != "chart-of-accounts") {
                // If no specific match, default tab
                form.clearErrors()
                setActiveTab("chart-of-accounts");
              }
            }
          )} className="space-y-6">
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
                    disabled={isFormDisabled}
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
                    disabled={isFormDisabled}
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
                    disabled={isFormDisabled}
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
                    disabled={isFormDisabled}
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
                    disabled={isFormDisabled}
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
                    disabled={isFormDisabled}
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
                    disabled={isFormDisabled}
                    control={form.control}
                    name="max_amt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">
                          Maximum Amount
                        </FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="0.00" {...field} value={field.value ?? ""} />
                        </FormControl>
                        <FormDescription>Maximum loan amount allowed</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    disabled={isFormDisabled}
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
                  <h3 className="text-lg font-medium mb-4">
                    List of Classifications <span className="text-red-500">*</span>
                  </h3>
                  <FormField
                    disabled={isFormDisabled}
                    control={form.control}
                    name="eligible_class"
                    render={() => (
                      <FormItem>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[200px]">Classification</TableHead>
                              <TableHead className="text-right">Can Avail of Bonus Loan</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {classificationsData?.data.classifications.map((classification) => (
                              <TableRow key={classification.id} className="">
                                <TableCell>{classification.name}</TableCell>
                                <TableCell className="flex justify-end mr-2">
                                  <FormField
                                    disabled={isFormDisabled}
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              <TabsContent value="chart-of-accounts" className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-xl font-bold">Chart of Accounts</h2>

                  <div className="space-y-4">
                    <FormField
                      disabled={isFormDisabled}
                      control={form.control}
                      name="coa_interest_receivable"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">
                            Loan Interest Receivable <span className="text-red-500">*</span>
                          </FormLabel>
                          <div className="grid grid-cols-2 gap-4">
                            <Input
                              value={getCoaFieldCode(field.value)}
                              placeholder="Account Code"
                              className="h-11"
                              readOnly
                            />
                            <Select disabled={isFormDisabled} onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-11 w-full">
                                  <SelectValue placeholder="Select..." />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {getAvailableCoaOptions(field.value).map((account) => (
                                  <SelectItem key={account.id} value={account.id}>
                                    {account.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      disabled={isFormDisabled}
                      control={form.control}
                      name="coa_loan_receivable"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">
                            Loan Receivable <span className="text-red-500">*</span>
                          </FormLabel>
                          <div className="grid grid-cols-2 gap-4">
                            <Input
                              value={getCoaFieldCode(field.value)}
                              placeholder="Account Code"
                              className="h-11"
                              readOnly
                            />
                            <Select disabled={isFormDisabled} onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-11 w-full">
                                  <SelectValue placeholder="Select..." />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {getAvailableCoaOptions(field.value).map((account) => (
                                  <SelectItem key={account.id} value={account.id}>
                                    {account.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      disabled={isFormDisabled}
                      control={form.control}
                      name="coa_interest_income"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">
                            Interest Income <span className="text-red-500">*</span>
                          </FormLabel>
                          <div className="grid grid-cols-2 gap-4">
                            <Input
                              value={getCoaFieldCode(field.value)}
                              placeholder="Account Code"
                              className="h-11"
                              readOnly
                            />
                            <Select disabled={isFormDisabled} onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-11 w-full">
                                  <SelectValue placeholder="Select..." />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {getAvailableCoaOptions(field.value).map((account) => (
                                  <SelectItem key={account.id} value={account.id}>
                                    {account.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      disabled={isFormDisabled}
                      control={form.control}
                      name="coa_garnished_expense"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">
                            Garnished Expense <span className="text-red-500">*</span>
                          </FormLabel>
                          <div className="grid grid-cols-2 gap-4">
                            <Input
                              value={getCoaFieldCode(field.value)}
                              placeholder="Account Code"
                              className="h-11"
                              readOnly
                            />
                            <Select disabled={isFormDisabled} onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-11 w-full">
                                  <SelectValue placeholder="Select..." />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {getAvailableCoaOptions(field.value).map((account) => (
                                  <SelectItem key={account.id} value={account.id}>
                                    {account.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      disabled={isFormDisabled}
                      control={form.control}
                      name="coa_unearned_interest"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">
                            Unearned Interest <span className="text-red-500">*</span>
                          </FormLabel>
                          <div className="grid grid-cols-2 gap-4">
                            <Input
                              value={getCoaFieldCode(field.value)}
                              placeholder="Account Code"
                              className="h-11"
                              readOnly
                            />
                            <Select disabled={isFormDisabled} onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-11 w-full">
                                  <SelectValue placeholder="Select..." />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {getAvailableCoaOptions(field.value).map((account) => (
                                  <SelectItem key={account.id} value={account.id}>
                                    {account.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      disabled={isFormDisabled}
                      control={form.control}
                      name="coa_other_income_penalty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">
                            Other Income Penalty <span className="text-red-500">*</span>
                          </FormLabel>
                          <div className="grid grid-cols-2 gap-4">
                            <Input
                              value={getCoaFieldCode(field.value)}
                              placeholder="Account Code"
                              className="h-11"
                              readOnly
                            />
                            <Select disabled={isFormDisabled} onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-11 w-full">
                                  <SelectValue placeholder="Select..." />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {getAvailableCoaOptions(field.value).map((account) => (
                                  <SelectItem key={account.id} value={account.id}>
                                    {account.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      disabled={isFormDisabled}
                      control={form.control}
                      name="coa_allowance_doubtful_account"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">
                            Allowance for Doubtful Account <span className="text-red-500">*</span>
                          </FormLabel>
                          <div className="grid grid-cols-2 gap-4">
                            <Input
                              value={getCoaFieldCode(field.value)}
                              placeholder="Account Code"
                              className="h-11"
                              readOnly
                            />
                            <Select disabled={isFormDisabled} onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-11 w-full">
                                  <SelectValue placeholder="Select..." />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {getAvailableCoaOptions(field.value).map((account) => (
                                  <SelectItem key={account.id} value={account.id}>
                                    {account.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      disabled={isFormDisabled}
                      control={form.control}
                      name="coa_bad_dept_expense"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">
                            Bad Debt Expense <span className="text-red-500">*</span>
                          </FormLabel>
                          <div className="grid grid-cols-2 gap-4">
                            <Input
                              value={getCoaFieldCode(field.value)}
                              placeholder="Account Code"
                              className="h-11"
                              readOnly
                            />
                            <Select disabled={isFormDisabled} onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-11 w-full">
                                  <SelectValue placeholder="Select..." />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {getAvailableCoaOptions(field.value).map((account) => (
                                  <SelectItem key={account.id} value={account.id}>
                                    {account.name}
                                  </SelectItem>
                                ))}
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
                disabled={isFormDisabled}
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
              <Button disabled={isFormDisabled} type="submit">
                {activeTab === "basic-info" ? "Continue" : isEditing ? "Update" : "Save"} Bonus Loan{" "}
                {isFormDisabled && (
                  <span>
                    <Loader2 className="animate-spin ml-2" />
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
