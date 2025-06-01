"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SelectContent, SelectItem, SelectTrigger, SelectValue, Select as ShadSelect } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type {
  CashAdvanceSetup,
  CreateCashAdvanceSetupPayload,
  UpdateCashAdvanceSetupPayload,
} from "./Service/CashAdvanceSetupTypes"
import { getBranchId } from "@/lib/api"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import CashAdvanceSetupService from "./Service/CashAdvanceSetupService"
import { ClassificationSetupService } from "../ClassificationSetup/Service/ClassificationSetupService"
import { BonusLoanSetupService } from "../BonusLoanSetup/Service/BonusLoanSetupService"
import { SalaryLoanSetupService } from "../SalaryLoanSetup/Service/SalaryLoanSetupService"
import { Loader2 } from "lucide-react"
import { useEffect, useState, useCallback } from "react"
import { AxiosError } from "axios"
import Select from "react-select"
import { debounce } from "lodash"

// Define the form schema with comprehensive validation
const formSchema = z
  .object({
    // Basic Info - all required
    code: z.string().min(1, "Cash advance code is required"),
    name: z.string().min(1, "Cash advance name is required"),
    type: z.enum(["bonus loan", "salary loan"], {
      required_error: "Loan type is required",
    }),
    loan_code: z.string().min(1, "Loan code is required"),
    interest_rate: z
      .number()
      .min(1, "Interest rate must be positive")
      .refine((val) => Number(val) <= 100, {
        message: "Interest rate must not exceed 100%",
      })
      .refine((val) => Number(val) <= 100, {
        message: "Interest rate must not exceed 100%",
      }),
    surcharge_rate: z
      .number()
      .min(1, "Surcharge rate must be positive")
      .refine((val) => Number(val) <= 100, {
        message: "Surcharge rate must not exceed 100%",
      })
      .refine((val) => Number(val) <= 100, {
        message: "Surcharge rate must not exceed 100%",
      }),
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

    // Classifications - at least one required
    eligible_class: z.array(z.string()).min(1, "At least one classification must be selected"),

    // Chart of Accounts - required fields
    coa_loan_receivable: z.string().min(1, "Loans receivable is required"),
    coa_interest_receivable: z.string().min(1, "Interest receivable is required"),
    coa_interest_income: z.string().min(1, "Interest income is required"),
    coa_garnished: z.string().min(1, "Garnished expense is required"),

    // Optional COA fields
    coa_unearned_interest: z.string().min(1, "Unearned interest is required"),
    coa_other_income_penalty: z.string().min(1, "Other income penalty is required"),
    coa_allowance_doubtful: z.string().min(1, "Allowance doubtful is required"),
    coa_bad_dept_expense: z.string().min(1, "Bad dept expense is required"),
  })
  .refine(
    (data) => {
      // Validate that all COA values are unique
      const coaValues = [
        data.coa_loan_receivable,
        data.coa_interest_receivable,
        data.coa_interest_income,
        data.coa_garnished,
        data.coa_unearned_interest,
        data.coa_other_income_penalty,
        data.coa_allowance_doubtful,
        data.coa_bad_dept_expense,
      ].filter(Boolean) // Remove empty values

      const uniqueValues = new Set(coaValues)
      return uniqueValues.size === coaValues.length
    },
    {
      message: "Each chart of account must be unique. No duplicates allowed.",
      path: ["coa_loan_receivable"], // Show error on the first COA field
    },
  )

// Define the form values type
type FormValues = z.infer<typeof formSchema>

// Define the component props
interface CashAdvanceFormDialogProps {
  item: CashAdvanceSetup | null
  open: boolean
  isEditing: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: () => void
  onCancel: () => void
}

export function CashAdvanceFormDialog({
  open,
  isEditing,
  item,
  onOpenChange,
  onCancel,
  onSubmit,
}: CashAdvanceFormDialogProps) {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState("basic-info")
  const [searchLoading, setSearchLoading] = useState<Record<string, boolean>>({})
  const [searchedCoaOptions, setSearchedCoaOptions] = useState<Record<string, any[]>>({})
  const [, setActiveField] = useState<string | null>(null)

  const basicInfoFields = [
    "code",
    "name",
    "type",
    "loan_code",
    "interest_rate",
    "surcharge_rate",
    "max_amt",
    "max_rate",
    "eligible_class",
  ]

  const editingHandler = useMutation({
    mutationFn: (newCashAdvance: UpdateCashAdvanceSetupPayload) => {
      return CashAdvanceSetupService.updateCashAdvanceSetup(item!.id, newCashAdvance)
    },
  })

  const creationHandler = useMutation({
    mutationFn: (newCashAdvance: CreateCashAdvanceSetupPayload) => {
      return CashAdvanceSetupService.createCashAdvanceSetup(newCashAdvance)
    },
  })

  // Fetch detailed cash advance data when editing
  const { data: cashAdvanceDetail, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["cash-advance-detail", item?.id],
    queryFn: () => CashAdvanceSetupService.getCashAdvanceSetupById(item!.id),
    enabled: isEditing && !!item?.id,
    staleTime: 0, // Always fetch fresh data
  })

  // Fetch dependencies
  const { data: classificationsData } = useQuery({
    queryKey: ["classifications-for-cash-advance"],
    queryFn: () => ClassificationSetupService.getAllClassifications(),
    staleTime: Number.POSITIVE_INFINITY,
  })

  const { data: bonusLoansData } = useQuery({
    queryKey: ["bonus-loans-for-cash-advance"],
    queryFn: () => BonusLoanSetupService.getAllBonusLoans(),
    staleTime: Number.POSITIVE_INFINITY,
  })

  const { data: salaryLoansData } = useQuery({
    queryKey: ["salary-loans-for-cash-advance"],
    queryFn: () => SalaryLoanSetupService.getAllSalaryLoans(),
    staleTime: Number.POSITIVE_INFINITY,
  })

  const { data: coaData } = useQuery({
    queryKey: ["coa-for-cash-advance"],
    queryFn: () => CashAdvanceSetupService.getAllCOA(),
    staleTime: Number.POSITIVE_INFINITY,
  })

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

      const response = await CashAdvanceSetupService.getAllCOA(nameParam, codeParam)

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
    }, 500),
    [searchCOA],
  )

  const debouncedSearchByCode = useCallback(
    debounce((searchTerm: string, fieldName: string) => {
      searchCOA(searchTerm, "code", fieldName)
    }, 500),
    [searchCOA],
  )

  // Reset search results when changing fields
  // useEffect(() => {
  //   if (activeField) {
  //     // Keep the search results only for the active field
  //     const fieldsToReset = Object.keys(searchedCoaOptions).filter(
  //       (field) => field !== activeField && field !== `${activeField}_code`,
  //     )

  //     if (fieldsToReset.length > 0) {
  //       const newSearchedOptions = { ...searchedCoaOptions }
  //       fieldsToReset.forEach((field) => {
  //         newSearchedOptions[field] = []
  //       })
  //       setSearchedCoaOptions(newSearchedOptions)
  //     }
  //   }
  // }, [activeField, searchedCoaOptions])

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      name: "",
      type: "bonus loan",
      loan_code: "",
      interest_rate: 0,
      surcharge_rate: 0,
      max_amt: null,
      max_rate: null,
      eligible_class: [],
      coa_loan_receivable: "",
      coa_interest_receivable: "",
      coa_unearned_interest: "",
      coa_interest_income: "",
      coa_other_income_penalty: "",
      coa_allowance_doubtful: "",
      coa_bad_dept_expense: "",
      coa_garnished: "",
    },
  })

  const watchedType = form.watch("type")

  // Watch all COA values to filter out duplicates
  const watchedCoaValues = form.watch([
    "coa_loan_receivable",
    "coa_interest_receivable",
    "coa_interest_income",
    "coa_garnished",
    "coa_unearned_interest",
    "coa_other_income_penalty",
    "coa_allowance_doubtful",
    "coa_bad_dept_expense",
  ])

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
          <div className="grid grid-cols-5 gap-4">
            <div className="col-span-2">
              <Select<{ value: string; label: string }>
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
            </div>
            <div className="col-span-3">
              <FormControl>
                <Select<{ value: string; label: string }>
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
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  )

  const isFormDisabled = creationHandler.isPending || editingHandler.isPending || (isEditing && isLoadingDetail)

  useEffect(() => {
    if (isEditing && cashAdvanceDetail?.data && bonusLoansData != null) {
      const detail = cashAdvanceDetail.data
      form.reset({
        code: detail.code,
        name: detail.name,
        type: detail.type,
        loan_code: detail.loan?.id ?? "",
        interest_rate: Number.parseFloat(detail.interest_rate),
        surcharge_rate: Number.parseFloat(detail.surcharge_rate),
        max_amt: detail.max_amt ? Number.parseFloat(detail.max_amt) : null,
        max_rate: detail.max_rate ? Number.parseFloat(detail.max_rate) : null,
        eligible_class: detail.classifications?.map((c) => c.id) || [],
        coa_loan_receivable: detail.coa_loan_receivable?.id || "",
        coa_interest_receivable: detail.coa_interest_receivable?.id || "",
        coa_unearned_interest: detail.coa_unearned_interest?.id || "",
        coa_interest_income: detail.coa_interest_income?.id || "",
        coa_other_income_penalty: detail.coa_other_income_penalty?.id || "",
        coa_allowance_doubtful: detail.coa_allowance_doubtful?.id || "",
        coa_bad_dept_expense: detail.coa_bad_dept_expense?.id || "",
        coa_garnished: detail.coa_garnished?.id || "",
      })
    } else {
      form.reset({
        code: "",
        name: "",
        type: "bonus loan",
        loan_code: "",
        interest_rate: 0,
        surcharge_rate: 0,
        max_amt: null,
        max_rate: null,
        eligible_class: [],
        coa_loan_receivable: "",
        coa_interest_receivable: "",
        coa_unearned_interest: "",
        coa_interest_income: "",
        coa_other_income_penalty: "",
        coa_allowance_doubtful: "",
        coa_bad_dept_expense: "",
        coa_garnished: "",
      })
    }
  }, [isEditing, cashAdvanceDetail, form, bonusLoansData, salaryLoansData])

  const create = async (_branch_id: string, values: FormValues) => {
    const payload: CreateCashAdvanceSetupPayload = {
      ...values,
      max_amt: values.max_amt ?? null,
      max_rate: values.max_rate ?? null,
      eligible_class: values.eligible_class,
      coa_unearned_interest: values.coa_unearned_interest || "",
      coa_other_income_penalty: values.coa_other_income_penalty || "",
      coa_allowance_doubtful: values.coa_allowance_doubtful || "",
      coa_bad_dept_expense: values.coa_bad_dept_expense || "",
    }
    try {
      await creationHandler.mutateAsync(payload)
      queryClient.invalidateQueries({ queryKey: ["cash-advance-table"] })
      onSubmit()
      form.reset({
        code: "",
        name: "",
        type: "bonus loan",
        loan_code: "",
        interest_rate: 0,
        surcharge_rate: 0,
        max_amt: null,
        max_rate: null,
        eligible_class: [],
        coa_loan_receivable: "",
        coa_interest_receivable: "",
        coa_unearned_interest: "",
        coa_interest_income: "",
        coa_other_income_penalty: "",
        coa_allowance_doubtful: "",
        coa_bad_dept_expense: "",
        coa_garnished: "",
      })
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

  const update = async (_branch_id: string, values: FormValues) => {
    const payload: UpdateCashAdvanceSetupPayload = {
      ...values,
      max_amt: values.max_amt ?? null,
      max_rate: values.max_rate ?? null,
      eligible_class: values.eligible_class,
      coa_unearned_interest: values.coa_unearned_interest || "",
      coa_other_income_penalty: values.coa_other_income_penalty || "",
      coa_allowance_doubtful: values.coa_allowance_doubtful || "",
      coa_bad_dept_expense: values.coa_bad_dept_expense || "",
    }
    try {
      await editingHandler.mutateAsync(payload)
      queryClient.invalidateQueries({ queryKey: ["cash-advance-table"] })
      onSubmit()
      form.reset({
        code: "",
        name: "",
        type: "bonus loan",
        loan_code: "",
        interest_rate: 0,
        surcharge_rate: 0,
        max_amt: null,
        max_rate: null,
        eligible_class: [],
        coa_loan_receivable: "",
        coa_interest_receivable: "",
        coa_unearned_interest: "",
        coa_interest_income: "",
        coa_other_income_penalty: "",
        coa_allowance_doubtful: "",
        coa_bad_dept_expense: "",
        coa_garnished: "",
      })
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
    const branch_id = getBranchId()
    if (branch_id) {
      if (isEditing) {
        await update(branch_id, values)
      } else {
        await create(branch_id, values)
      }
    }
    setActiveTab("basic-info")
  }

  // Get available loans based on type
  const getAvailableLoans = () => {
    if (watchedType === "bonus loan") {
      return bonusLoansData?.data.bonus_loan_setups || []
    }
    return salaryLoansData?.data.salary_loan_setups || []
  }

  // Get dialog title based on type
  const getDialogTitle = () => {
    return `${isEditing ? "Edit" : "Add New"} Cash Advance`
  }
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        onOpenChange(open)
        if (!open) {
          setActiveTab("basic-info")
          form.reset()
          setSearchedCoaOptions({})
          setSearchLoading({})
          setActiveField(null)
        }
      }}
    >
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-auto flex flex-col">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-2xl font-bold">{getDialogTitle()}</DialogTitle>
        </DialogHeader>

        {/* Show loading indicator when fetching detailed data for editing */}
        {isEditing && isLoadingDetail && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading cash advance details...</span>
          </div>
        )}

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
                  if (basicInfoFields.includes(key)) {
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
            className="flex flex-col h-full"
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <TabsList className="border-b w-full justify-start rounded-none h-auto p-0 mb-6">
                <TabsTrigger
                  disabled={isFormDisabled}
                  value="basic-info"
                  className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-b-blue-500 data-[state=active]:shadow-none px-4 py-2"
                >
                  Basic Info
                </TabsTrigger>
                <TabsTrigger
                  disabled={isFormDisabled}
                  value="chart-of-accounts"
                  className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-b-blue-500 data-[state=active]:shadow-none px-4 py-2"
                >
                  Chart of Accounts
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-y-auto">
                <TabsContent value="basic-info" className="space-y-6 mt-0">
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <FormField
                        disabled={isFormDisabled}
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium">
                              Cash Advance Code
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="Enter cash advance code" {...field} className="h-11" />
                            </FormControl>
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
                              Cash Advance Name
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="Enter cash advance name" {...field} className="h-11" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      disabled={isFormDisabled}
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">
                            Loan Type <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <div className="flex gap-6">
                              <div className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  id="bonus-loan"
                                  value="bonus loan"
                                  checked={field.value === "bonus loan"}
                                  onChange={() => {
                                    field.onChange("bonus loan")
                                    form.setValue("loan_code", "")
                                  }}
                                  disabled={isFormDisabled}
                                  className="w-4 h-4"
                                />
                                <label htmlFor="bonus-loan" className="text-sm font-medium">
                                  Bonus Loan
                                </label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  id="salary-loan"
                                  value="salary loan"
                                  checked={field.value === "salary loan"}
                                  onChange={() => {
                                    field.onChange("salary loan")
                                    form.setValue("loan_code", "")
                                  }}
                                  disabled={isFormDisabled}
                                  className="w-4 h-4"
                                />
                                <label htmlFor="salary-loan" className="text-sm font-medium">
                                  Salary Loan
                                </label>
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      disabled={isFormDisabled}
                      control={form.control}
                      name="loan_code"
                      render={({ field }) => {
                        return (
                          <FormItem key={field.value}>
                            <FormLabel className="text-base font-medium">
                              Loan Code
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <ShadSelect disabled={isFormDisabled} onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-11 w-full">
                                  <SelectValue placeholder="Select..." />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {getAvailableLoans().map((loan) => (
                                  <SelectItem key={loan.id} value={loan.id}>
                                    {loan.code}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </ShadSelect>
                            <FormMessage />
                          </FormItem>
                        )
                      }}
                    />
                    <div className="grid grid-cols-2 gap-6">
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
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={field.value === 0 ? "" : field.value.toString()}
                                onChange={(e) => {
                                  const value = e.target.value
                                  if (value === "") {
                                    field.onChange(0)
                                  } else {
                                    const numValue = Number.parseFloat(value)
                                    field.onChange(isNaN(numValue) ? 0 : numValue)
                                  }
                                }}
                                className="h-11"
                              />
                            </FormControl>
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
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={field.value === 0 ? "" : field.value.toString()}
                                onChange={(e) => {
                                  const value = e.target.value
                                  if (value === "") {
                                    field.onChange(0)
                                  } else {
                                    const numValue = Number.parseFloat(value)
                                    field.onChange(isNaN(numValue) ? 0 : numValue)
                                  }
                                }}
                                className="h-11"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
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
                                placeholder="Enter maximum amount"
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
                                className="h-11"
                              />
                            </FormControl>
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
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
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
                                disabled={isFormDisabled || form.watch("max_amt") != null}
                                className="h-11"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Classifications */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">
                        List of Classifications <span className="text-red-500">*</span>
                      </h3>
                      <FormField
                        disabled={isFormDisabled}
                        control={form.control}
                        name="eligible_class"
                        render={() => (
                          <FormItem>
                            <div className="border rounded-lg">
                              <Table>
                                <TableHeader>
                                  <TableRow className="bg-gray-50">
                                    <TableHead className="font-medium">Classification</TableHead>
                                    <TableHead className="text-end font-medium">Can Avail of CA</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {classificationsData?.data.classifications.map((classification) => (
                                    <TableRow key={classification.id}>
                                      <TableCell className="font-medium">{classification.name}</TableCell>
                                      <TableCell className="flex w-full justify-end">
                                        <FormField
                                          control={form.control}
                                          name="eligible_class"
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormControl>
                                                <Checkbox
                                                  checked={field.value?.includes(classification.id)}
                                                  onCheckedChange={(checked) => {
                                                    const current = field.value || []
                                                    if (checked) {
                                                      field.onChange([...current, classification.id])
                                                    } else {
                                                      field.onChange(current.filter((id) => id !== classification.id))
                                                    }
                                                  }}
                                                  className="mr-22 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
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
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="chart-of-accounts" className="space-y-6 mt-0 overflow-hidden">
                  <div className="space-y-6">
                    {/* Required COA Fields with enhanced search */}
                    {renderCoaField("coa_loan_receivable", "Loans Receivable", true)}
                    {renderCoaField("coa_interest_receivable", "Interest Receivable", true)}
                    {renderCoaField("coa_interest_income", "Interest Income", true)}
                    {renderCoaField("coa_garnished", "Garnished Expense", true)}

                    {/* Optional COA Fields with enhanced search */}
                    {renderCoaField("coa_unearned_interest", "Unearned Interest")}
                    {renderCoaField("coa_other_income_penalty", "Other Income Penalty")}
                    {renderCoaField("coa_allowance_doubtful", "Allowance for Doubtful Account")}
                    {renderCoaField("coa_bad_dept_expense", "Bad Debt Expense")}
                  </div>
                </TabsContent>
              </div>
            </Tabs>

            <div className="flex justify-end gap-3 pt-6">
              <Button
                disabled={isFormDisabled}
                type="button"
                variant="outline"
                onClick={() => {
                  onCancel()
                  onOpenChange(false)
                  setActiveTab("basic-info")
                  form.reset()
                  setSearchedCoaOptions({})
                  setSearchLoading({})
                  setActiveField(null)
                }}
                className="px-6"
              >
                Cancel
              </Button>
              <Button disabled={isFormDisabled} type="submit" className="bg-blue-500 hover:bg-blue-600 px-6">
                {isFormDisabled && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {activeTab === "basic-info" ? "Continue" : isEditing ? "Update Cash Advance" : "Save Cash Advance"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
