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
import type { SalaryLoan, CreateSalaryLoanPayload, UpdateSalaryLoanPayload } from "./Service/SalaryLoanSetupTypes"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import SalaryLoanSetupService from "./Service/SalaryLoanSetupService"
import GroupSetupService from "../GroupSetup/Service/GroupSetupService"
import { Loader2 } from "lucide-react"

// Update the form schema to properly validate numeric fields
const formSchema = z.object({
  // Basic Info
  code: z.string().min(1, "Salary loan code is required"),
  name: z.string().min(1, "Loan name is required"),
  interest_rate: z
    .string()
    .min(1, "Interest rate is required")
    .refine((val) => !isNaN(Number(val)), "Must be a valid number"),
  surcharge_rate: z
    .string()
    .min(1, "Surcharge rate is required")
    .refine((val) => !isNaN(Number(val)), "Must be a valid number"),
  min_amount: z
    .string()
    .min(1, "Minimum amount is required")
    .refine((val) => !isNaN(Number(val)), "Must be a valid number"),
  max_amount: z
    .string()
    .min(1, "Maximum amount is required")
    .refine((val) => !isNaN(Number(val)), "Must be a valid number"),

  // Client-Visible Fees
  vis_service: z
    .string()
    .optional()
    .refine((val) => val === "" || !isNaN(Number(val)), "Must be a valid number"),
  vis_insurance: z
    .string()
    .optional()
    .refine((val) => val === "" || !isNaN(Number(val)), "Must be a valid number"),
  vis_notarial: z
    .string()
    .optional()
    .refine((val) => val === "" || !isNaN(Number(val)), "Must be a valid number"),
  vis_gross_reciept: z
    .string()
    .min(1, "GRT is required")
    .refine((val) => !isNaN(Number(val)), "Must be a valid number"),
  vis_computer: z
    .string()
    .optional()
    .refine((val) => val === "" || !isNaN(Number(val)), "Must be a valid number"),
  vis_other_charges: z
    .string()
    .optional()
    .refine((val) => val === "" || !isNaN(Number(val)), "Must be a valid number"),

  // PGA Fees & Surcharge
  pga_service_charge: z
    .string()
    .optional()
    .refine((val) => val === "" || !isNaN(Number(val)), "Must be a valid number"),
  pga_insurance: z
    .string()
    .optional()
    .refine((val) => val === "" || !isNaN(Number(val)), "Must be a valid number"),
  pga_notarial: z
    .string()
    .optional()
    .refine((val) => val === "" || !isNaN(Number(val)), "Must be a valid number"),
  pga_gross_reciept: z
    .string()
    .optional()
    .refine((val) => val === "" || !isNaN(Number(val)), "Must be a valid number"),

  // Branch other charges
  def_interest: z
    .string()
    .optional()
    .refine((val) => val === "" || !isNaN(Number(val)), "Must be a valid number"),
  def_charge: z
    .string()
    .optional()
    .refine((val) => val === "" || !isNaN(Number(val)), "Must be a valid number"),
  def_computer: z
    .string()
    .optional()
    .refine((val) => val === "" || !isNaN(Number(val)), "Must be a valid number"),

  // Chart of Accounts
  coa_sl_receivable: z.string().min(1, "SL Receivable account is required"),
  coa_sl_interest_income: z.string().min(1, "Interest Income account is required"),
  coa_service_charge: z.string().optional(),
  coa_notarial: z.string().optional(),
  coa_gross_receipt: z.string().optional(),
  coa_computer: z.string().optional(),
  coa_pga_accounts_payable: z.string().optional(),
  coa_sl_interest_receivable: z.string().optional(),
  coa_sl_unearned_interest_income: z.string().optional(),
  coa_sl_other_income_penalty: z.string().optional(),
  coa_sl_allowance_doubtful_account: z.string().optional(),
  coa_sl_bad_dept_expense: z.string().optional(),
  coa_sl_garnished: z.string().optional(),

  // Groups
  eligible_groups: z.array(z.string()).optional(),
})

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

  // Fetch groups for the checkbox list
  const { data: groupsData } = useQuery({
    queryKey: ["groups-for-salary-loan"],
    queryFn: () => GroupSetupService.getAllGroups(),
    staleTime: Number.POSITIVE_INFINITY,
  })

  // Fetch COA for the dropdowns
  const { data: coaData } = useQuery({
    queryKey: ["coa-for-salary-loan"],
    queryFn: () => SalaryLoanSetupService.getAllCOA(),
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
      def_interest: "",
      def_charge: "",
      def_computer: "",
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

  useEffect(() => {
    if (item) {
      form.reset({
        // code: item.code,
        // name: item.name,
        // interest_rate: item.interest_rate,
        // surcharge_rate: item.surcharge_rate,
        // min_amount: item.min_amount,
        // max_amount: item.max_amount,
        // vis_service: item.vis_service,
        // vis_insurance: item.vis_insurance,
        // vis_notarial: item.vis_notarial,
        // vis_gross_reciept: item.vis_gross_reciept,
        // vis_computer: item.vis_computer,
        // vis_other_charges: item.vis_other_charges,
        // pga_service_charge: item.pga_service_charge,
        // pga_insurance: item.pga_insurance,
        // pga_notarial: item.pga_notarial,
        // pga_gross_reciept: item.pga_gross_reciept,
        // def_interest: item.def_interest || "",
        // def_charge: item.def_charge || "",
        // def_computer: item.def_computer || "",
        // coa_sl_receivable: item.coa_sl_receivable.id,
        // coa_sl_interest_income: item.coa_sl_interest_income.id,
        // coa_service_charge: item.coa_service_charge.id,
        // coa_notarial: item.coa_notarial.id,
        // coa_gross_receipt: item.coa_gross_receipt.id,
        // coa_computer: item.coa_computer.id,
        // coa_pga_accounts_payable: item.coa_pga_accounts_payable.id,
        // coa_sl_interest_receivable: item.coa_sl_interest_receivable.id,
        // coa_sl_unearned_interest_income: item.coa_sl_unearned_interest_income.id,
        // coa_sl_other_income_penalty: item.coa_sl_other_income_penalty.id,
        // coa_sl_allowance_doubtful_account: item.coa_sl_allowance_doubtful_account.id,
        // coa_sl_bad_dept_expense: item.coa_sl_bad_dept_expense.id,
        // coa_sl_garnished: item.coa_sl_garnished.id,
        // eligible_groups: item.groups.map((group) => group.id),
      })
    } else {
      form.reset()
    }
  }, [item, form])

  // Update the create function to ensure proper number conversion
  const create = async (values: FormValues) => {
    const payload: CreateSalaryLoanPayload = {
      code: values.code,
      name: values.name,
      interest_rate: Number.parseFloat(values.interest_rate),
      surcharge_rate: Number.parseFloat(values.surcharge_rate),
      min_amount: Number.parseFloat(values.min_amount),
      max_amount: Number.parseFloat(values.max_amount),
      vis_service: values.vis_service ? Number.parseFloat(values.vis_service) : 0,
      vis_insurance: values.vis_insurance ? Number.parseFloat(values.vis_insurance) : 0,
      vis_notarial: values.vis_notarial ? Number.parseFloat(values.vis_notarial) : 0,
      vis_gross_reciept: Number.parseFloat(values.vis_gross_reciept),
      vis_computer: values.vis_computer ? Number.parseFloat(values.vis_computer) : 0,
      vis_other_charges: values.vis_other_charges ? Number.parseFloat(values.vis_other_charges) : 0,
      pga_service_charge: values.pga_service_charge ? Number.parseFloat(values.pga_service_charge) : 0,
      pga_insurance: values.pga_insurance ? Number.parseFloat(values.pga_insurance) : 0,
      pga_notarial: values.pga_notarial ? Number.parseFloat(values.pga_notarial) : 0,
      pga_gross_reciept: values.pga_gross_reciept ? Number.parseFloat(values.pga_gross_reciept) : 0,
      def_interest: values.def_interest ? Number.parseFloat(values.def_interest) : 0,
      def_charge: values.def_charge ? Number.parseFloat(values.def_charge) : 0,
      def_computer: values.def_computer ? Number.parseFloat(values.def_computer) : 0,
      coa_sl_receivable: values.coa_sl_receivable,
      coa_sl_interest_income: values.coa_sl_interest_income,
      coa_service_charge: values.coa_service_charge || "",
      coa_notarial: values.coa_notarial || "",
      coa_gross_receipt: values.coa_gross_receipt || "",
      coa_computer: values.coa_computer || "",
      coa_pga_accounts_payable: values.coa_pga_accounts_payable || "",
      coa_sl_interest_receivable: values.coa_sl_interest_receivable || "",
      coa_sl_unearned_interest_income: values.coa_sl_unearned_interest_income || "",
      coa_sl_other_income_penalty: values.coa_sl_other_income_penalty || "",
      coa_sl_allowance_doubtful_account: values.coa_sl_allowance_doubtful_account || "",
      coa_sl_bad_dept_expense: values.coa_sl_bad_dept_expense || "",
      coa_sl_garnished: values.coa_sl_garnished || "",
      eligible_groups: values.eligible_groups || [],
    }
    try {
      await creationHandler.mutateAsync(payload)
      queryClient.invalidateQueries({ queryKey: ["salary-loan-table"] })
      onSubmit()
      form.reset()
    } catch (errorData: unknown) {
      console.error(errorData)
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
      vis_service: values.vis_service ? Number.parseFloat(values.vis_service) : 0,
      vis_insurance: values.vis_insurance ? Number.parseFloat(values.vis_insurance) : 0,
      vis_notarial: values.vis_notarial ? Number.parseFloat(values.vis_notarial) : 0,
      vis_gross_reciept: Number.parseFloat(values.vis_gross_reciept),
      vis_computer: values.vis_computer ? Number.parseFloat(values.vis_computer) : 0,
      vis_other_charges: 0,
      pga_service_charge: values.pga_service_charge ? Number.parseFloat(values.pga_service_charge) : 0,
      pga_insurance: values.pga_insurance ? Number.parseFloat(values.pga_insurance) : 0,
      pga_notarial: values.pga_notarial ? Number.parseFloat(values.pga_notarial) : 0,
      pga_gross_reciept: values.pga_gross_reciept ? Number.parseFloat(values.pga_gross_reciept) : 0,
      def_interest: values.def_interest ? Number.parseFloat(values.def_interest) : 0,
      def_charge: values.def_charge ? Number.parseFloat(values.def_charge) : 0,
      def_computer: values.def_computer ? Number.parseFloat(values.def_computer) : 0,
      coa_sl_receivable: values.coa_sl_receivable,
      coa_sl_interest_income: values.coa_sl_interest_income,
      coa_service_charge: values.coa_service_charge || "",
      coa_notarial: values.coa_notarial || "",
      coa_gross_receipt: values.coa_gross_receipt || "",
      coa_computer: values.coa_computer || "",
      coa_pga_accounts_payable: values.coa_pga_accounts_payable || "",
      coa_sl_interest_receivable: values.coa_sl_interest_receivable || "",
      coa_sl_unearned_interest_income: values.coa_sl_unearned_interest_income || "",
      coa_sl_other_income_penalty: values.coa_sl_other_income_penalty || "",
      coa_sl_allowance_doubtful_account: values.coa_sl_allowance_doubtful_account || "",
      coa_sl_bad_dept_expense: values.coa_sl_bad_dept_expense || "",
      coa_sl_garnished: values.coa_sl_garnished || "",
      eligible_groups: values.eligible_groups || [],
    }
    try {
      await editingHandler.mutateAsync(payload)
      queryClient.invalidateQueries({ queryKey: ["salary-loan-table"] })
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
      }
    }}>
      <DialogContent className="min-w-5xl h-5/6 flex flex-col overflow-x-hidden overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{isEditing ? "Edit" : "Add New"} Salary Loan</DialogTitle>
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

              <TabsContent value="basic-info" className="space-y-6 mt-0 w-full">
                {/* Basic Info Section */}
                <div className="grid grid-cols-2 gap-6 w-full">
                  <FormField
                    disabled={creationHandler.isPending || editingHandler.isPending}
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
                    disabled={creationHandler.isPending || editingHandler.isPending}
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
                    disabled={creationHandler.isPending || editingHandler.isPending}
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
                      disabled={creationHandler.isPending || editingHandler.isPending}
                      control={form.control}
                      name="vis_service"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">Service Charge (%)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" placeholder="0.00" {...field} />
                          </FormControl>
                          <FormDescription>Percentage charged as service fee</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      disabled={creationHandler.isPending || editingHandler.isPending}
                      control={form.control}
                      name="vis_insurance"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">Insurance (%)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" placeholder="0.00" {...field} />
                          </FormControl>
                          <FormDescription>Percentage charged for insurance</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      disabled={creationHandler.isPending || editingHandler.isPending}
                      control={form.control}
                      name="vis_notarial"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">Notarial Fee (%)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" placeholder="0.00" {...field} />
                          </FormControl>
                          <FormDescription>Percentage charged for notarial services</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      disabled={creationHandler.isPending || editingHandler.isPending}
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
                      disabled={creationHandler.isPending || editingHandler.isPending}
                      control={form.control}
                      name="vis_computer"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">Computer Charges (%)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" placeholder="0.00" {...field} />
                          </FormControl>
                          <FormDescription>Percentage charged for computer processing</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      disabled={creationHandler.isPending || editingHandler.isPending}
                      control={form.control}
                      name="vis_other_charges"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">Other Charges</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" placeholder="0.00" {...field} />
                          </FormControl>
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
                      disabled={creationHandler.isPending || editingHandler.isPending}
                      control={form.control}
                      name="pga_service_charge"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">PGA Service Charge (%)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" placeholder="0.00" {...field} />
                          </FormControl>
                          <FormDescription>PGA service charge percentage</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      disabled={creationHandler.isPending || editingHandler.isPending}
                      control={form.control}
                      name="pga_insurance"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">PGA Insurance (%)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" placeholder="0.00" {...field} />
                          </FormControl>
                          <FormDescription>PGA insurance percentage</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      disabled={creationHandler.isPending || editingHandler.isPending}
                      control={form.control}
                      name="pga_notarial"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">PGA Notarial Fee (%)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" placeholder="0.00" {...field} />
                          </FormControl>
                          <FormDescription>PGA notarial fee percentage</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      disabled={creationHandler.isPending || editingHandler.isPending}
                      control={form.control}
                      name="pga_gross_reciept"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">PGA Gross Receipt Tax (%)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" placeholder="0.00" {...field} />
                          </FormControl>
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
                      disabled={creationHandler.isPending || editingHandler.isPending}
                      control={form.control}
                      name="def_interest"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">Interest Income (3%)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" placeholder="0.00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      disabled={creationHandler.isPending || editingHandler.isPending}
                      control={form.control}
                      name="def_charge"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">Service Charge Income (1.5%)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" placeholder="0.00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      disabled={creationHandler.isPending || editingHandler.isPending}
                      control={form.control}
                      name="def_computer"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">Computer Charges (0.1%)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" placeholder="0.00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* List of Groups Section */}
                <div className="w-full">
                  <h3 className="text-lg font-medium mb-4">List of Groups</h3>
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
                              disabled={creationHandler.isPending || editingHandler.isPending}
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
                </div>
              </TabsContent>

              <TabsContent value="chart-of-accounts" className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-xl font-bold">Fee Accounts</h2>

                  <div className="space-y-4">
                    <FormField
                      disabled={creationHandler.isPending || editingHandler.isPending}
                      control={form.control}
                      name="coa_service_charge"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="block mb-2">Service Charge Account</FormLabel>
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
                      name="coa_notarial"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="block mb-2">Notarial Account</FormLabel>
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
                      name="coa_gross_receipt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="block mb-2">Gross Receipt Account</FormLabel>
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
                      name="coa_computer"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="block mb-2">Computer Charges Account</FormLabel>
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
                      name="coa_pga_accounts_payable"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="block mb-2">A/P PGA Account</FormLabel>
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

                <div className="space-y-4">
                  <h2 className="text-xl font-bold">Loan Accounts</h2>

                  <div className="space-y-4">
                    <FormField
                      disabled={creationHandler.isPending || editingHandler.isPending}
                      control={form.control}
                      name="coa_sl_receivable"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="block mb-2">
                            Loans Receivable Account <span className="text-red-500">*</span>
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
                      name="coa_sl_interest_income"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="block mb-2">
                            Interest Income Account <span className="text-red-500">*</span>
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
                      name="coa_sl_interest_receivable"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="block mb-2">Interest Receivable Account</FormLabel>
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
                      name="coa_sl_unearned_interest_income"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="block mb-2">Unearned Interest Income Account</FormLabel>
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
                      name="coa_sl_other_income_penalty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="block mb-2">Other Income Penalty Account</FormLabel>
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
                      name="coa_sl_allowance_doubtful_account"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="block mb-2">Allowance for Doubtful Account</FormLabel>
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
                      name="coa_sl_bad_dept_expense"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="block mb-2">Bad Debt Expense Account</FormLabel>
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
                      name="coa_sl_garnished"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="block mb-2">Garnished Expense Account</FormLabel>
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
                {activeTab === "basic-info" ? "Continue" : isEditing ? "Update" : "Save"} Loan Product{" "}
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
