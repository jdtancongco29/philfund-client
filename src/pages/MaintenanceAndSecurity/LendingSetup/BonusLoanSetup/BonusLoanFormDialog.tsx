"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useState, useEffect, useCallback, useRef } from "react"
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
import { AxiosError } from "axios"
import ReactSelect from "react-select"
import { debounce } from "lodash"

// Define the form schema with comprehensive validation
const formSchema = z
  .object({
    // Basic Info - all required
    code: z.string().min(1, "Bonus loan code is required"),
    name: z.string().min(1, "Bonus loan name is required"),
    interest_rate: z
      .string()
      .min(1, "Interest rate is required")
      .refine((val) => !isNaN(Number(val)), "Must be a valid number")
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
    max_amt: z.number().min(0, "Maximum amount must be positive").optional().nullable(),
    max_rate: z
      .number()
      .min(0, "Maximum rate must be positive")
      .optional()
      .nullable()
      .refine((val) => Number(val) <= 100, {
        message: "Max rate must not exceed 100%",
      })
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
  const [searchLoading, setSearchLoading] = useState<Record<string, boolean>>({})
  const [searchedCoaOptions, setSearchedCoaOptions] = useState<Record<string, any[]>>({})
  const [, setActiveField] = useState<string | null>(null)
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

  const scrollableDivRef = useRef<HTMLDivElement | null>(null);

  const scrollToTop = () => {
    if (scrollableDivRef.current) {
      scrollableDivRef.current.scrollTo({
        top: 0,
        behavior: 'smooth' // use 'auto' for immediate jump
      });
    }
  };

  // Search COA by name or code
  const searchCOA = useCallback(async (searchTerm: string, searchType: "name" | "code", fieldName: string) => {
    if (!searchTerm.trim()) {
      setSearchedCoaOptions((prev) => ({ ...prev, [fieldName]: [] }))
      return
    }

    setSearchLoading((prev) => ({
      ...prev,
      [fieldName]: true,
      [`${fieldName}_code`]: searchType === "code" ? true : prev[`${fieldName}_code`],
      [fieldName]: searchType === "name" ? true : prev[fieldName],
    }))

    try {
      const nameParam = searchType === "name" ? searchTerm : null
      const codeParam = searchType === "code" ? searchTerm : null

      const response = await BonusLoanSetupService.getAllCOA(nameParam, codeParam)

      if (response?.data?.chartOfAccounts) {
        setSearchedCoaOptions((prev) => ({
          ...prev,
          [fieldName]: response.data.chartOfAccounts,
        }))
      }
    } catch (error) {
      console.error("Error searching COA:", error)
      setSearchedCoaOptions((prev) => ({ ...prev, [fieldName]: [] }))
    } finally {
      setSearchLoading((prev) => ({
        ...prev,
        [fieldName]: searchType === "name" ? false : prev[fieldName],
        [`${fieldName}_code`]: searchType === "code" ? false : prev[`${fieldName}_code`],
      }))
    }
  }, [])

  // Debounced search functions
  const debouncedSearchByName = useCallback(
    debounce((searchTerm: string, fieldName: string) => {
      searchCOA(searchTerm, "name", fieldName)
    }, 300),
    [searchCOA],
  )

  const debouncedSearchByCode = useCallback(
    debounce((searchTerm: string, fieldName: string) => {
      searchCOA(searchTerm, "code", fieldName)
    }, 300),
    [searchCOA],
  )

  const getCoaFieldCode = (id: string) => {
    if (!id) return ""

    // First check in the main COA data
    const mainCoa = coaData?.data.chartOfAccounts.find((coa) => coa.id === id)
    if (mainCoa) {
      return mainCoa.code
    }

    // Then check in searched options
    for (const fieldOptions of Object.values(searchedCoaOptions)) {
      const searchedCoa = fieldOptions.find((coa) => coa.id === id)
      if (searchedCoa) {
        return searchedCoa.code
      }
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
      max_amt: null,
      max_rate: null,
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
    "eligible_class",
  ]

  // Get available COA options for each field (excluding already selected values)
  const getAvailableCoaOptions = (currentFieldValue: string, fieldName: string) => {
    const baseOptions = coaData?.data.chartOfAccounts || []
    const searchedOptions = searchedCoaOptions[fieldName] || []

    // Always use search results if they exist, regardless of active field
    let sourceOptions = baseOptions
    if (searchedOptions.length > 0) {
      sourceOptions = searchedOptions
    }

    // Add the currently selected option if it's not in the source options
    // This ensures the selected value is always available in the dropdown
    const allOptions = [...sourceOptions]

    if (currentFieldValue) {
      const selectedOption = [...baseOptions, ...Object.values(searchedCoaOptions).flat()].find(
        (option) => option.id === currentFieldValue,
      )

      if (selectedOption && !allOptions.some((option) => option.id === currentFieldValue)) {
        allOptions.push(selectedOption)
      }
    }

    const usedValues = watchedCoaValues.filter((value) => value && value !== currentFieldValue)
    return allOptions.filter((account) => !usedValues.includes(account.id))
  }

  // Enhanced COA field component with search functionality
  const renderCoaField = (fieldName: string, label: string, required = false) => (
    <FormField
      disabled={isFormDisabled}
      control={form.control}
      name={fieldName as any}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-base font-medium">
            {label} {required && <span className="text-red-500">*</span>}
          </FormLabel>
          <div className="grid grid-cols-2 gap-4">
            <ReactSelect<{ value: string; label: string }>
              placeholder="Search account code..."
              options={getAvailableCoaOptions(field.value, fieldName).map((account) => ({
                value: account.id,
                label: account.code,
              }))}
              onChange={(selectedOption) => {
                if (selectedOption) {
                  field.onChange(selectedOption.value)
                } else {
                  field.onChange("")
                }
                // Only reset search results for this specific field after selection
                setSearchedCoaOptions((prev) => ({
                  ...prev,
                  [fieldName]: [],
                }))
              }}
              onInputChange={(inputValue) => {
                if (inputValue && inputValue.length > 0) {
                  debouncedSearchByCode(inputValue, fieldName)
                } else {
                  // Clear search results if input is empty
                  setSearchedCoaOptions((prev) => ({
                    ...prev,
                    [fieldName]: [],
                  }))
                }
              }}
              onFocus={() => setActiveField(`${fieldName}_code`)}
              value={
                field.value
                  ? {
                    value: field.value,
                    label: getCoaFieldCode(field.value),
                  }
                  : null
              }
              isDisabled={isFormDisabled}
              isClearable
              isLoading={searchLoading[`${fieldName}_code`]}
              filterOption={() => true} // Disable default filtering since we handle it via API
              classNamePrefix="react-select"
              menuPlacement="auto"
            />
            <FormControl>
              <ReactSelect<{ value: string; label: string }>
                value={
                  field.value
                    ? {
                      value: field.value,
                      label:
                        getAvailableCoaOptions(field.value, fieldName).find((account) => account.id === field.value)
                          ?.name || "",
                    }
                    : null
                }
                onChange={(selectedOption) => {
                  if (selectedOption) {
                    field.onChange(selectedOption.value)
                  } else {
                    field.onChange("")
                  }
                  // Only reset search results for this specific field after selection
                  setSearchedCoaOptions((prev) => ({
                    ...prev,
                    [fieldName]: [],
                  }))
                }}
                onInputChange={(inputValue) => {
                  if (inputValue && inputValue.length > 0) {
                    debouncedSearchByName(inputValue, fieldName)
                  } else {
                    // Clear search results if input is empty
                    setSearchedCoaOptions((prev) => ({
                      ...prev,
                      [fieldName]: [],
                    }))
                  }
                }}
                onFocus={() => setActiveField(fieldName)}
                options={getAvailableCoaOptions(field.value, fieldName).map((account) => ({
                  value: account.id,
                  label: account.name,
                }))}
                placeholder="Search account name..."
                classNamePrefix={
                  form.formState.errors[fieldName as keyof typeof form.formState.errors]
                    ? "react-select-error"
                    : "react-select"
                }
                isDisabled={isFormDisabled}
                isClearable
                isLoading={searchLoading[fieldName]}
                filterOption={() => true} // Disable default filtering since we handle it via API
                menuPlacement="auto"
              />
            </FormControl>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  )

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
        max_amt: detail.max_amt ? Number.parseFloat(detail.max_amt) : null,
        max_rate: detail.max_rate ? Number.parseFloat(detail.max_rate) : null,
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
        max_amt: null,
        max_rate: null,
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
      max_amt: values.max_amt ?? null,
      max_rate: values.max_rate ?? null,
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
          const errorMsg = messages as string[]
          form.setError(field as any, {
            type: "manual",
            message: errorMsg[0],
          })
        })
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
      max_amt: values.max_amt ?? null,
      max_rate: values.max_rate ?? null,
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
          const errorMsg = messages as string[]
          form.setError(field as any, {
            type: "manual",
            message: errorMsg[0],
          })
        })
      }
    }
  }

  // Handle form submission
  const onFormSubmit = async (values: FormValues) => {
    if (activeTab === "basic-info") {
      setActiveTab("chart-of-accounts")
      return
    }

    if (isEditing) {
      await update(values)
    } else {
      await create(values)
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
          setSearchedCoaOptions({})
          setSearchLoading({})
          setActiveField(null)
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

        <div className="overflow-x-hidden overflow-y-auto" ref={scrollableDivRef}>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(
                (data) => {
                  // Valid submission
                  onFormSubmit(data)
                },
                (errors) => {
                  // This is called AFTER validation fails
                  const errorKeys = Object.keys(errors)
                  for (const key of errorKeys) {
                    if (nonCoaFields.includes(key)) {
                      setActiveTab("basic-info")
                      return
                    }
                  }
                  if (activeTab != "chart-of-accounts") {
                    // If no specific match, default tab
                    form.clearErrors()
                    setActiveTab("chart-of-accounts")
                  }
                },
              )}
              className="space-y-6"
            >
              <Tabs defaultValue="basic-info" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="border-b w-full justify-start rounded-none h-auto p-0 mb-2">
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
                      disabled={isFormDisabled || form.watch("max_rate") != null}
                      control={form.control}
                      name="max_amt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">Maximum Amount</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              {...field}
                              value={field.value === null || field.value === undefined ? "" : field.value.toString()}
                              onChange={(e) => {
                                const value = e.target.value
                                if (value === "") {
                                  field.onChange(null)
                                } else {
                                  const numValue = Number.parseFloat(value)
                                  field.onChange(isNaN(numValue) ? null : numValue)
                                }
                              }}
                              disabled={isFormDisabled || form.watch("max_rate") != null}
                            />
                          </FormControl>
                          <FormDescription>Maximum loan amount allowed</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      disabled={isFormDisabled || form.watch("max_amt") != null}
                      control={form.control}
                      name="max_rate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">Maximum Rate (%)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              {...field}
                              disabled={isFormDisabled || form.watch("max_amt") != null}
                              value={field.value === null || field.value === undefined ? "" : field.value.toString()}
                              onChange={(e) => {
                                const value = e.target.value
                                if (value === "") {
                                  field.onChange(null)
                                } else {
                                  const numValue = Number.parseFloat(value)
                                  field.onChange(isNaN(numValue) ? null : numValue)
                                }
                              }}
                            />
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

                <TabsContent value="chart-of-accounts" className="space-y-6" >
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold">Chart of Accounts</h2>

                    <div className="space-y-4">
                      {renderCoaField("coa_interest_receivable", "Loan Interest Receivable", true)}
                      {renderCoaField("coa_loan_receivable", "Loan Receivable", true)}
                      {renderCoaField("coa_interest_income", "Interest Income", true)}
                      {renderCoaField("coa_garnished_expense", "Garnished Expense", true)}
                      {renderCoaField("coa_unearned_interest", "Unearned Interest", true)}
                      {renderCoaField("coa_other_income_penalty", "Other Income Penalty", true)}
                      {renderCoaField("coa_allowance_doubtful_account", "Allowance for Doubtful Account", true)}
                      {renderCoaField("coa_bad_dept_expense", "Bad Debt Expense", true)}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              <div className="flex justify-end gap-2 mb-2">
                <Button
                  disabled={isFormDisabled}
                  type="button"
                  variant="outline"
                  onClick={() => {
                    onCancel()
                    onOpenChange(false)
                    form.reset()
                    setSearchedCoaOptions({})
                    setSearchLoading({})
                    setActiveField(null)
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={scrollToTop} disabled={isFormDisabled} type="submit">
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
        </div>
      </DialogContent>
    </Dialog>
  )
}
