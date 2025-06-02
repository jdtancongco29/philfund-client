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
import type { SalaryLoan, CreateSalaryLoanPayload, UpdateSalaryLoanPayload } from "./Service/SalaryLoanSetupTypes"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import SalaryLoanSetupService from "./Service/SalaryLoanSetupService"
import GroupSetupService from "../GroupSetup/Service/GroupSetupService"
import { Loader2 } from "lucide-react"
import { AxiosError } from "axios"
import ReactSelect from "react-select"
import { debounce } from "lodash"

// Update the form schema with proper validation
const formSchema = z
  .object({
    // Basic Info - all required
    code: z.string().min(1, "Salary loan code is required"),
    name: z.string().min(1, "Loan name is required"),
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
    min_amount: z
      .string()
      .min(1, "Minimum amount is required")
      .refine((val) => !isNaN(Number(val)), "Must be a valid number"),
    max_amount: z
      .string()
      .min(1, "Maximum amount is required")
      .refine((val) => !isNaN(Number(val)), "Must be a valid number"),

    // Client-Visible Fees - all required
    vis_service: z
      .string()
      .min(1, "Service charge is required")
      .refine((val) => Number(val) <= 100, {
        message: "Service charge must not exceed 100%",
      })
      .refine((val) => !isNaN(Number(val)), "Must be a valid number"),
    vis_insurance: z
      .string()
      .min(1, "Insurance is required")
      .refine((val) => !isNaN(Number(val)), "Must be a valid number")
      .refine((val) => Number(val) <= 100, {
        message: "Insurance must not exceed 100%",
      }),
    vis_notarial: z
      .string()
      .min(1, "Notarial fee is required")
      .refine((val) => !isNaN(Number(val)), "Must be a valid number")
      .refine((val) => Number(val) <= 100, {
        message: "Insurance must not exceed 100%",
      }),
    vis_gross_reciept: z
      .string()
      .min(1, "GRT is required")
      .refine((val) => !isNaN(Number(val)), "Must be a valid number")
      .refine((val) => Number(val) <= 100, {
        message: "Gross Receipt Tax must not exceed 100%",
      }),
    vis_computer: z
      .string()
      .min(1, "Computer charges is required")
      .refine((val) => !isNaN(Number(val)), "Must be a valid number")
      .refine((val) => Number(val) <= 100, {
        message: "Computer charges must not exceed 100%",
      }),
    vis_other_charges: z
      .string()
      .min(1, "Other charges is required")
      .refine((val) => !isNaN(Number(val)), "Must be a valid number")
      .refine((val) => Number(val) <= 100, {
        message: "Other charges must not exceed 100%",
      }),

    // PGA Fees & Surcharge - all required
    pga_service_charge: z
      .string()
      .min(1, "PGA service charge is required")
      .refine((val) => !isNaN(Number(val)), "Must be a valid number")
      .refine((val) => Number(val) <= 100, {
        message: "PGA service must not exceed 100%",
      }),
    pga_insurance: z
      .string()
      .min(1, "PGA insurance is required")
      .refine((val) => !isNaN(Number(val)), "Must be a valid number")
      .refine((val) => Number(val) <= 100, {
        message: "PGA insurance must not exceed 100%",
      }),
    pga_notarial: z
      .string()
      .min(1, "PGA notarial fee is required")
      .refine((val) => !isNaN(Number(val)), "Must be a valid number")
      .refine((val) => Number(val) <= 100, {
        message: "PGA notarial must not exceed 100%",
      }),
    pga_gross_reciept: z
      .string()
      .min(1, "PGA gross receipt tax is required")
      .refine((val) => !isNaN(Number(val)), "Must be a valid number")
      .refine((val) => Number(val) <= 100, {
        message: "PGA gross must not exceed 100%",
      }),

    // Branch other charges - all required
    def_interest: z
      .string()
      .min(1, "Interest income is required")
      .refine((val) => !isNaN(Number(val)), "Must be a valid number"),
    def_charge: z
      .string()
      .min(1, "Service charge income is required")
      .refine((val) => !isNaN(Number(val)), "Must be a valid number"),
    def_computer: z
      .string()
      .min(1, "Computer charges is required")
      .refine((val) => !isNaN(Number(val)), "Must be a valid number"),

    // Chart of Accounts - all required
    coa_sl_receivable: z.string().min(1, "SL Receivable account is required"),
    coa_sl_interest_income: z.string().min(1, "Interest Income account is required"),
    coa_service_charge: z.string().min(1, "Service charge account is required"),
    coa_notarial: z.string().min(1, "Notarial account is required"),
    coa_gross_receipt: z.string().min(1, "Gross receipt account is required"),
    coa_computer: z.string().min(1, "Computer charges account is required"),
    coa_pga_accounts_payable: z.string().min(1, "A/P PGA account is required"),
    coa_sl_interest_receivable: z.string().min(1, "Interest receivable account is required"),
    coa_sl_unearned_interest_income: z.string().min(1, "Unearned interest income account is required"),
    coa_sl_other_income_penalty: z.string().min(1, "Other income penalty account is required"),
    coa_sl_allowance_doubtful_account: z.string().min(1, "Allowance for doubtful account is required"),
    coa_sl_bad_dept_expense: z.string().min(1, "Bad debt expense account is required"),
    coa_sl_garnished: z.string().min(1, "Garnished expense account is required"),

    // Groups - at least one required
    eligible_groups: z.array(z.string()).min(1, "At least one group must be selected"),
  })
  .refine(
    (data) => {
      // Validate that all COA values are unique
      const coaValues = [
        data.coa_sl_receivable,
        data.coa_sl_interest_income,
        data.coa_service_charge,
        data.coa_notarial,
        data.coa_gross_receipt,
        data.coa_computer,
        data.coa_pga_accounts_payable,
        data.coa_sl_interest_receivable,
        data.coa_sl_unearned_interest_income,
        data.coa_sl_other_income_penalty,
        data.coa_sl_allowance_doubtful_account,
        data.coa_sl_bad_dept_expense,
        data.coa_sl_garnished,
      ].filter(Boolean) // Remove empty values

      const uniqueValues = new Set(coaValues)
      return uniqueValues.size === coaValues.length
    },
    {
      message: "Each chart of account must be unique. No duplicates allowed.",
      path: ["coa_sl_receivable"], // Show error on the first COA field
    },
  )

// Define the form values type
type FormValues = z.infer<typeof formSchema>

// Define the component props
interface SalaryLoanFormDialogProps {
  item: SalaryLoan | null
  open: boolean
  isEditing: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: () => void
  onCancel: () => void
}

export function SalaryLoanFormDialog({
  open,
  isEditing,
  item,
  onOpenChange,
  onCancel,
  onSubmit,
}: SalaryLoanFormDialogProps) {
  const [activeTab, setActiveTab] = useState("basic-info")
  const [searchLoading, setSearchLoading] = useState<Record<string, boolean>>({})
  const [searchedCoaOptions, setSearchedCoaOptions] = useState<Record<string, any[]>>({})
  const [, setActiveField] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const editingHandler = useMutation({
    mutationFn: (newSalaryLoan: UpdateSalaryLoanPayload) => {
      return SalaryLoanSetupService.updateSalaryLoan(item!.id, newSalaryLoan)
    },
  })
  const creationHandler = useMutation({
    mutationFn: (newSalaryLoan: CreateSalaryLoanPayload) => {
      return SalaryLoanSetupService.createSalaryLoan(newSalaryLoan)
    },
  })

  // Fetch detailed salary loan data when editing
  const { data: salaryLoanDetail, isLoading: isLoadingDetail } = useQuery({
    queryKey: [`salary-loan-detail-${item?.id}`, item?.id],
    queryFn: () => SalaryLoanSetupService.getSalaryLoanById(item!.id),
    enabled: isEditing && !!item?.id,
    staleTime: 0, // Always fetch fresh data
  })

  // Fetch groups for the checkbox list
  const { data: groupsData, isLoading: isLoadingGroups } = useQuery({
    queryKey: ["groups-for-salary-loan"],
    queryFn: () => GroupSetupService.getAllGroups(),
    staleTime: Number.POSITIVE_INFINITY,
  })

  // Fetch COA for the dropdowns
  const { data: coaData, isLoading: isLoadingCOA } = useQuery({
    queryKey: ["coa-for-salary-loan", item],
    queryFn: () => SalaryLoanSetupService.getAllCOA(),
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

      const response = await SalaryLoanSetupService.getAllCOA(nameParam, codeParam)

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

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      name: "",
      interest_rate: "",
      surcharge_rate: "",
      min_amount: "",
      max_amount: "",
      vis_service: "",
      vis_insurance: "",
      vis_notarial: "",
      vis_gross_reciept: "",
      vis_computer: "",
      vis_other_charges: "",
      pga_service_charge: "",
      pga_insurance: "",
      pga_notarial: "",
      pga_gross_reciept: "",
      def_interest: "3.00",
      def_charge: "1.50",
      def_computer: "0.10",
      coa_sl_receivable: "",
      coa_sl_interest_income: "",
      coa_service_charge: "",
      coa_notarial: "",
      coa_gross_receipt: "",
      coa_computer: "",
      coa_pga_accounts_payable: "",
      coa_sl_interest_receivable: "",
      coa_sl_unearned_interest_income: "",
      coa_sl_other_income_penalty: "",
      coa_sl_allowance_doubtful_account: "",
      coa_sl_bad_dept_expense: "",
      coa_sl_garnished: "",
      eligible_groups: [],
    },
  })

  // Watch all COA values to filter out duplicates
  const watchedCoaValues = form.watch([
    "coa_sl_receivable",
    "coa_sl_interest_income",
    "coa_service_charge",
    "coa_notarial",
    "coa_gross_receipt",
    "coa_computer",
    "coa_pga_accounts_payable",
    "coa_sl_interest_receivable",
    "coa_sl_unearned_interest_income",
    "coa_sl_other_income_penalty",
    "coa_sl_allowance_doubtful_account",
    "coa_sl_bad_dept_expense",
    "coa_sl_garnished",
  ])

  const nonCOAFields = [
    // Basic Info
    "code",
    "name",
    "interest_rate",
    "surcharge_rate",
    "min_amount",
    "max_amount",

    // Client-Visible Fees
    "vis_service",
    "vis_insurance",
    "vis_notarial",
    "vis_gross_reciept",
    "vis_computer",
    "vis_other_charges",

    // PGA Fees & Surcharge
    "pga_service_charge",
    "pga_insurance",
    "pga_notarial",
    "pga_gross_reciept",

    // Branch other charges
    "def_interest",
    "def_charge",
    "def_computer",

    // Groups
    "eligible_groups",
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

  const scrollableDivRef = useRef<HTMLDivElement | null>(null);

  const scrollToTop = () => {
    if (scrollableDivRef.current) {
      scrollableDivRef.current.scrollTo({
        top: 0,
        behavior: 'smooth' // use 'auto' for immediate jump
      });
    }
  };

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

  useEffect(() => {
    if (isEditing && salaryLoanDetail?.data) {
      const detail = salaryLoanDetail.data
      form.reset({
        code: detail.code,
        name: detail.name,
        interest_rate: detail.interest_rate,
        surcharge_rate: detail.surcharge_rate,
        min_amount: detail.min_amount,
        max_amount: detail.max_amount,
        vis_service: detail.vis_service,
        vis_insurance: detail.vis_insurance,
        vis_notarial: detail.vis_notarial,
        vis_gross_reciept: detail.vis_gross_reciept,
        vis_computer: detail.vis_computer,
        vis_other_charges: detail.vis_other_charges,
        pga_service_charge: detail.pga_service_charge,
        pga_insurance: detail.pga_insurance,
        pga_notarial: detail.pga_notarial,
        pga_gross_reciept: detail.pga_gross_reciept,
        def_interest: detail.def_interest || "3.00",
        def_charge: detail.def_charge || "1.50",
        def_computer: detail.def_computer || "0.10",
        coa_sl_receivable: detail.coa_sl_receivable?.id || "",
        coa_sl_interest_income: detail.coa_sl_interest_income?.id || "",
        coa_service_charge: detail.coa_service_charge?.id || "",
        coa_notarial: detail.coa_notarial?.id || "",
        coa_gross_receipt: detail.coa_gross_receipt?.id || "",
        coa_computer: detail.coa_computer?.id || "",
        coa_pga_accounts_payable: detail.coa_pga_accounts_payable?.id || "",
        coa_sl_interest_receivable: detail.coa_sl_interest_receivable?.id || "",
        coa_sl_unearned_interest_income: detail.coa_sl_unearned_interest_income?.id || "",
        coa_sl_other_income_penalty: detail.coa_sl_other_income_penalty?.id || "",
        coa_sl_allowance_doubtful_account: detail.coa_sl_allowance_doubtful_account?.id || "",
        coa_sl_bad_dept_expense: detail.coa_sl_bad_dept_expense?.id || "",
        coa_sl_garnished: detail.coa_sl_garnished?.id || "",
        eligible_groups: detail.groups?.map((group) => group.id) || [],
      })
    } else {
      form.reset({
        code: "",
        name: "",
        interest_rate: "",
        surcharge_rate: "",
        min_amount: "",
        max_amount: "",
        vis_service: "",
        vis_insurance: "",
        vis_notarial: "",
        vis_gross_reciept: "",
        vis_computer: "",
        vis_other_charges: "",
        pga_service_charge: "",
        pga_insurance: "",
        pga_notarial: "",
        pga_gross_reciept: "",
        def_interest: "3.00",
        def_charge: "1.50",
        def_computer: "0.10",
        coa_sl_receivable: "",
        coa_sl_interest_income: "",
        coa_service_charge: "",
        coa_notarial: "",
        coa_gross_receipt: "",
        coa_computer: "",
        coa_pga_accounts_payable: "",
        coa_sl_interest_receivable: "",
        coa_sl_unearned_interest_income: "",
        coa_sl_other_income_penalty: "",
        coa_sl_allowance_doubtful_account: "",
        coa_sl_bad_dept_expense: "",
        coa_sl_garnished: "",
        eligible_groups: [],
      })
    }
  }, [isEditing, salaryLoanDetail, form, open])

  // Check if form should be disabled (loading or pending operations)
  const isFormDisabled =
    creationHandler.isPending ||
    editingHandler.isPending ||
    (isEditing && isLoadingDetail) ||
    isLoadingCOA ||
    isLoadingGroups

  // Update the create function to ensure proper number conversion
  const create = async (values: FormValues) => {
    const payload: CreateSalaryLoanPayload = {
      code: values.code,
      name: values.name,
      interest_rate: Number.parseFloat(values.interest_rate),
      surcharge_rate: Number.parseFloat(values.surcharge_rate),
      min_amount: Number.parseFloat(values.min_amount),
      max_amount: Number.parseFloat(values.max_amount),
      vis_service: Number.parseFloat(values.vis_service),
      vis_insurance: Number.parseFloat(values.vis_insurance),
      vis_notarial: Number.parseFloat(values.vis_notarial),
      vis_gross_reciept: Number.parseFloat(values.vis_gross_reciept),
      vis_computer: Number.parseFloat(values.vis_computer),
      vis_other_charges: Number.parseFloat(values.vis_other_charges),
      pga_service_charge: Number.parseFloat(values.pga_service_charge),
      pga_insurance: Number.parseFloat(values.pga_insurance),
      pga_notarial: Number.parseFloat(values.pga_notarial),
      pga_gross_reciept: Number.parseFloat(values.pga_gross_reciept),
      def_interest: 3.0,
      def_charge: 1.5,
      def_computer: 0.1,
      coa_sl_receivable: values.coa_sl_receivable,
      coa_sl_interest_income: values.coa_sl_interest_income,
      coa_service_charge: values.coa_service_charge,
      coa_notarial: values.coa_notarial,
      coa_gross_receipt: values.coa_gross_receipt,
      coa_computer: values.coa_computer,
      coa_pga_accounts_payable: values.coa_pga_accounts_payable,
      coa_sl_interest_receivable: values.coa_sl_interest_receivable,
      coa_sl_unearned_interest_income: values.coa_sl_unearned_interest_income,
      coa_sl_other_income_penalty: values.coa_sl_other_income_penalty,
      coa_sl_allowance_doubtful_account: values.coa_sl_allowance_doubtful_account,
      coa_sl_bad_dept_expense: values.coa_sl_bad_dept_expense,
      coa_sl_garnished: values.coa_sl_garnished,
      eligible_groups: values.eligible_groups,
    }
    try {
      await creationHandler.mutateAsync(payload)
      queryClient.invalidateQueries({ queryKey: ["salary-loan-table"] })
      onSubmit()
      setActiveTab("basic-info")
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

  // Update the update function to ensure proper number conversion
  const update = async (values: FormValues) => {
    const payload: UpdateSalaryLoanPayload = {
      code: values.code,
      name: values.name,
      interest_rate: Number.parseFloat(values.interest_rate),
      surcharge_rate: Number.parseFloat(values.surcharge_rate),
      min_amount: Number.parseFloat(values.min_amount),
      max_amount: Number.parseFloat(values.max_amount),
      vis_service: Number.parseFloat(values.vis_service),
      vis_insurance: Number.parseFloat(values.vis_insurance),
      vis_notarial: Number.parseFloat(values.vis_notarial),
      vis_gross_reciept: Number.parseFloat(values.vis_gross_reciept),
      vis_computer: Number.parseFloat(values.vis_computer),
      vis_other_charges: Number.parseFloat(values.vis_other_charges),
      pga_service_charge: Number.parseFloat(values.pga_service_charge),
      pga_insurance: Number.parseFloat(values.pga_insurance),
      pga_notarial: Number.parseFloat(values.pga_notarial),
      pga_gross_reciept: Number.parseFloat(values.pga_gross_reciept),
      def_interest: 3.0,
      def_charge: 1.5,
      def_computer: 0.1,
      coa_sl_receivable: values.coa_sl_receivable,
      coa_sl_interest_income: values.coa_sl_interest_income,
      coa_service_charge: values.coa_service_charge,
      coa_notarial: values.coa_notarial,
      coa_gross_receipt: values.coa_gross_receipt,
      coa_computer: values.coa_computer,
      coa_pga_accounts_payable: values.coa_pga_accounts_payable,
      coa_sl_interest_receivable: values.coa_sl_interest_receivable,
      coa_sl_unearned_interest_income: values.coa_sl_unearned_interest_income,
      coa_sl_other_income_penalty: values.coa_sl_other_income_penalty,
      coa_sl_allowance_doubtful_account: values.coa_sl_allowance_doubtful_account,
      coa_sl_bad_dept_expense: values.coa_sl_bad_dept_expense,
      coa_sl_garnished: values.coa_sl_garnished,
      eligible_groups: values.eligible_groups,
    }
    try {
      await editingHandler.mutateAsync(payload)
      queryClient.invalidateQueries({ queryKey: ["salary-loan-table"] })
      onSubmit()
      setActiveTab("basic-info")
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
      <DialogContent className="min-w-5xl h-5/6 flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{isEditing ? "Edit" : "Add New"} Salary Loan</DialogTitle>
        </DialogHeader>

        {/* Show loading indicator when fetching detailed data for editing */}
        {isEditing && isLoadingDetail && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading salary loan details...</span>
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
                    if (nonCOAFields.includes(key)) {
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

                <TabsContent value="basic-info" className="space-y-6 mt-0 w-full">
                  {/* Basic Info Section */}
                  <div className="grid grid-cols-2 gap-6 w-full">
                    <FormField
                      disabled={isFormDisabled}
                      control={form.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">
                            Salary Loan Code <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Enter loan code" {...field} />
                          </FormControl>
                          <FormDescription>A unique code to identify this loan product</FormDescription>
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
                      name="min_amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">
                            Minimum Amount <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" placeholder="0.00" {...field} />
                          </FormControl>
                          <FormDescription>Minimum loan amount allowed</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      disabled={isFormDisabled}
                      control={form.control}
                      name="max_amount"
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
                  </div>

                  {/* Client-Visible Fees Section */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Client-Visible Fees</h3>
                    <div className="grid grid-cols-3 gap-6">
                      <FormField
                        disabled={isFormDisabled}
                        control={form.control}
                        name="vis_service"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium">
                              Service Charge (%) <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" placeholder="0.00" {...field} />
                            </FormControl>
                            <FormDescription>Percentage charged as service fee</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        disabled={isFormDisabled}
                        control={form.control}
                        name="vis_insurance"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium">
                              Insurance (%) <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" placeholder="0.00" {...field} />
                            </FormControl>
                            <FormDescription>Percentage charged for insurance</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        disabled={isFormDisabled}
                        control={form.control}
                        name="vis_notarial"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium">
                              Notarial Fee (%) <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" placeholder="0.00" {...field} />
                            </FormControl>
                            <FormDescription>Percentage charged for notarial services</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        disabled={isFormDisabled}
                        control={form.control}
                        name="vis_gross_reciept"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium">
                              GRT (%) <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" placeholder="0.00" {...field} />
                            </FormControl>
                            <FormDescription>Gross Receipts Tax percentage</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        disabled={isFormDisabled}
                        control={form.control}
                        name="vis_computer"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium">
                              Computer Charges (%) <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" placeholder="0.00" {...field} />
                            </FormControl>
                            <FormDescription>Percentage charged for computer processing</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        disabled={isFormDisabled}
                        control={form.control}
                        name="vis_other_charges"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium">
                              Other Charges <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" placeholder="0.00" {...field} value={field.value} />
                            </FormControl>
                            <FormDescription className="select-none text-white">
                              This is for layout alignment
                            </FormDescription>
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
                        disabled={isFormDisabled}
                        control={form.control}
                        name="pga_service_charge"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium">
                              PGA Service Charge (%) <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" placeholder="0.00" {...field} />
                            </FormControl>
                            <FormDescription>PGA service charge percentage</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        disabled={isFormDisabled}
                        control={form.control}
                        name="pga_insurance"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium">
                              PGA Insurance (%) <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" placeholder="0.00" {...field} />
                            </FormControl>
                            <FormDescription>PGA insurance percentage</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        disabled={isFormDisabled}
                        control={form.control}
                        name="pga_notarial"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium">
                              PGA Notarial Fee (%) <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" placeholder="0.00" {...field} />
                            </FormControl>
                            <FormDescription>PGA notarial fee percentage</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        disabled={isFormDisabled}
                        control={form.control}
                        name="pga_gross_reciept"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium">
                              PGA Gross Receipt Tax (%) <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" placeholder="0.00" {...field} />
                            </FormControl>
                            <FormDescription className="select-none text-white">
                              This is for layout alignment
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Branch other charges Section */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Branch Other Charges</h3>
                    <div className="grid grid-cols-3 gap-6">
                      <FormField
                        disabled
                        control={form.control}
                        name="def_interest"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium">
                              Interest Income (%) <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" placeholder="0.00" {...field} value={3.0} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        disabled
                        control={form.control}
                        name="def_charge"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium">
                              Service Charge Income (%) <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" placeholder="0.00" {...field} value={1.5} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        disabled
                        control={form.control}
                        name="def_computer"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium">
                              Computer Charges (%) <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" placeholder="0.00" {...field} value={0.1} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* List of Groups Section */}
                  <div className="w-full">
                    <h3 className="text-lg font-medium mb-4">
                      List of Groups <span className="text-red-500">*</span>
                    </h3>
                    <FormField
                      disabled={isFormDisabled}
                      control={form.control}
                      name="eligible_groups"
                      render={() => (
                        <FormItem>
                          <Table className="w-full">
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-[200px]">Group</TableHead>
                                <TableHead className="text-right">Can Avail of SL</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody className="w-full">
                              {groupsData?.data.groups.map((group) => (
                                <TableRow className="justify-between w-full" key={group.id}>
                                  <TableCell className="w-full">{group.name}</TableCell>
                                  <TableCell className="flex justify-end mr-2">
                                    <FormField
                                      disabled={isFormDisabled}
                                      control={form.control}
                                      name="eligible_groups"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormControl>
                                            <Checkbox
                                              checked={field.value?.includes(group.id)}
                                              onCheckedChange={(checked) => {
                                                const currentValue = field.value || []
                                                if (checked) {
                                                  field.onChange([...currentValue, group.id])
                                                } else {
                                                  field.onChange(currentValue.filter((id) => id !== group.id))
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
                      {renderCoaField("coa_service_charge", "Service Charge Account", true)}
                      {renderCoaField("coa_notarial", "Notarial Account", true)}
                      {renderCoaField("coa_gross_receipt", "Gross Receipt Account", true)}
                      {renderCoaField("coa_computer", "Computer Charges Account", true)}
                      {renderCoaField("coa_pga_accounts_payable", "A/P PGA Account", true)}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-xl font-bold">Loan Accounts</h2>

                    <div className="space-y-4">
                      {renderCoaField("coa_sl_receivable", "Loans Receivable Account", true)}
                      {renderCoaField("coa_sl_interest_income", "Interest Income Account", true)}
                      {renderCoaField("coa_sl_interest_receivable", "Interest Receivable Account", true)}
                      {renderCoaField("coa_sl_unearned_interest_income", "Unearned Interest Income Account", true)}
                      {renderCoaField("coa_sl_other_income_penalty", "Other Income Penalty Account", true)}
                      {renderCoaField("coa_sl_allowance_doubtful_account", "Allowance for Doubtful Account", true)}
                      {renderCoaField("coa_sl_bad_dept_expense", "Bad Debt Expense Account", true)}
                      {renderCoaField("coa_sl_garnished", "Garnished Expense Account", true)}
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
                    setSearchedCoaOptions({})
                    setSearchLoading({})
                    setActiveField(null)
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={() => { scrollToTop() }} disabled={isFormDisabled} type="submit">
                  {activeTab === "basic-info" ? "Continue" : isEditing ? "Update" : "Save"} Salary Loan{" "}
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
