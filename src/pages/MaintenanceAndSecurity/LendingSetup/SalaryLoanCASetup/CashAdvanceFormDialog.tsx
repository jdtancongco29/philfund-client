"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { useEffect, useState } from "react"

// Define the form schema with validation
const formSchema = z.object({
  code: z.string().min(1, "Cash advance code is required"),
  name: z.string().min(1, "Cash advance name is required"),
  type: z.enum(["bonus loan", "salary loan"], {
    required_error: "Loan type is required",
  }),
  loan_code: z.string().min(1, "Loan code is required"),
  interest_rate: z.number().min(0, "Interest rate must be positive"),
  surcharge_rate: z.number().min(0, "Surcharge rate must be positive"),
  max_amt: z.number().optional(),
  max_rate: z.number().optional(),
  eligible_class: z.array(z.string()).optional(),
  coa_loan_receivable: z.string().min(1, "Loans receivable is required"),
  coa_interest_receivable: z.string().min(1, "Interest receivable is required"),
  coa_unearned_interest: z.string().optional(),
  coa_interest_income: z.string().min(1, "Interest income is required"),
  coa_other_income_penalty: z.string().optional(),
  coa_allowance_doubtful: z.string().optional(),
  coa_bad_dept_expense: z.string().optional(),
  coa_garnished: z.string().min(1, "Garnished expense is required"),
})

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

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      name: "",
      type: "salary loan",
      loan_code: "",
      interest_rate: 0,
      surcharge_rate: 0,
      max_amt: undefined,
      max_rate: undefined,
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

  useEffect(() => {
    if (item) {
      form.reset({
        code: item.code,
        name: item.name,
        type: item.type,
        loan_code: item.loan?.id || "",
        interest_rate: Number.parseFloat(item.interest_rate),
        surcharge_rate: Number.parseFloat(item.surcharge_rate),
        max_amt: item.max_amt ? Number.parseFloat(item.max_amt) : undefined,
        max_rate: item.max_rate ? Number.parseFloat(item.max_rate) : undefined,
        eligible_class: item.classifications?.map((c) => c.id) || [],
        coa_loan_receivable: item.coa_loan_receivable?.id || "",
        coa_interest_receivable: item.coa_interest_receivable?.id || "",
        coa_unearned_interest: item.coa_unearned_interest?.id || "",
        coa_interest_income: item.coa_interest_income?.id || "",
        coa_other_income_penalty: item.coa_other_income_penalty?.id || "",
        coa_allowance_doubtful: item.coa_allowance_doubtful?.id || "",
        coa_bad_dept_expense: item.coa_bad_dept_expense?.id || "",
        coa_garnished: item.coa_garnished?.id || "",
      })
    } else {
      form.reset({
        code: "",
        name: "",
        type: "salary loan",
        loan_code: "",
        interest_rate: 0,
        surcharge_rate: 0,
        max_amt: undefined,
        max_rate: undefined,
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
  }, [item, form])

  const create = async (_branch_id: string, values: FormValues) => {
    const payload: CreateCashAdvanceSetupPayload = {
      ...values,
      max_amt: values.max_amt ?? null,
      max_rate: values.max_rate ?? null,
      eligible_class: values.eligible_class || [],
      coa_unearned_interest: values.coa_unearned_interest || "",
      coa_other_income_penalty: values.coa_other_income_penalty || "",
      coa_allowance_doubtful: values.coa_allowance_doubtful || "",
      coa_bad_dept_expense: values.coa_bad_dept_expense || "",
    }
    try {
      await creationHandler.mutateAsync(payload)
      queryClient.invalidateQueries({ queryKey: ["cash-advance-table"] })
      onSubmit()
      form.reset()
    } catch (errorData: any) {
      console.error(errorData)
    }
  }

  const update = async (_branch_id: string, values: FormValues) => {
    const payload: UpdateCashAdvanceSetupPayload = {
      ...values,
      max_amt: values.max_amt ?? null,
      max_rate: values.max_rate ?? null,
      eligible_class: values.eligible_class || [],
      coa_unearned_interest: values.coa_unearned_interest || "",
      coa_other_income_penalty: values.coa_other_income_penalty || "",
      coa_allowance_doubtful: values.coa_allowance_doubtful || "",
      coa_bad_dept_expense: values.coa_bad_dept_expense || "",
    }
    try {
      await editingHandler.mutateAsync(payload)
      queryClient.invalidateQueries({ queryKey: ["cash-advance-table"] })
      onSubmit()
      form.reset()
    } catch (_error) {
      console.log(_error)
    }
  }

  // Handle form submission
  const onFormSubmit = (values: FormValues) => {
    const branch_id = getBranchId()
    if (branch_id) {
      if (isEditing) {
        update(branch_id, values)
      } else {
        create(branch_id, values)
      }
    }
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
    const typeText = watchedType === "bonus loan" ? "Bonus Loan" : "Salary Loan"
    return `${isEditing ? "Edit" : "Add New"} ${typeText} Cash Advance`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-auto flex flex-col">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-2xl font-bold">{getDialogTitle()}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onFormSubmit)} className="flex flex-col h-full">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="basic-info" className="text-base">
                  Basic Info
                </TabsTrigger>
                <TabsTrigger value="chart-of-accounts" className="text-base">
                  Chart of Accounts
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-y-auto">
                <TabsContent value="basic-info" className="space-y-6 mt-0">
                  <div className="space-y-6">
                    <FormField
                      disabled={creationHandler.isPending || editingHandler.isPending}
                      control={form.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">
                            {watchedType === "bonus loan" ? "Bonus Loan" : "Salary Loan"} CA Code{" "}
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={`Enter ${watchedType === "bonus loan" ? "Bonus Loan" : "Salary Loan"} CA Code`}
                              {...field}
                              className="h-11"
                            />
                          </FormControl>
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
                            {watchedType === "bonus loan" ? "Bonus Loan" : "Salary Loan"} CA Name{" "}
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={`Enter ${watchedType === "bonus loan" ? "Bonus Loan" : "Salary Loan"} CA Name`}
                              {...field}
                              className="h-11"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      disabled={creationHandler.isPending || editingHandler.isPending}
                      control={form.control}
                      name="loan_code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">
                            {watchedType === "bonus loan" ? "Bonus Loan" : "Salary Loan"} Code{" "}
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <Select
                            disabled={creationHandler.isPending || editingHandler.isPending}
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="h-11 w-full">
                                <SelectValue placeholder="Select..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {getAvailableLoans().map((loan) => (
                                <SelectItem key={loan.id} value={loan.id}>
                                  {loan.code} - {loan.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-6">
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
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="Enter interest rate"
                                {...field}
                                onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                                className="h-11"
                              />
                            </FormControl>
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
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="5%"
                                {...field}
                                onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                                className="h-11"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

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
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="Enter maximum amount"
                              {...field}
                              onChange={(e) =>
                                field.onChange(e.target.value ? Number.parseFloat(e.target.value) : undefined)
                              }
                              className="h-11"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Classifications */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">List of Classifications</h3>
                      <div className="border rounded-lg">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-gray-50">
                              <TableHead className="font-medium">Classification</TableHead>
                              <TableHead className="text-center font-medium">Can Avail of CA</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {classificationsData?.data.classifications.map((classification) => (
                              <TableRow key={classification.id}>
                                <TableCell className="font-medium">{classification.name}</TableCell>
                                <TableCell className="text-center">
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
                                            className="w-5 h-5"
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
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="chart-of-accounts" className="space-y-6 mt-0">
                  <div className="space-y-6">
                    {/* Required COA Fields */}
                    <FormField
                      disabled={creationHandler.isPending || editingHandler.isPending}
                      control={form.control}
                      name="coa_loan_receivable"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">
                            Loans Receivable <span className="text-red-500">*</span>
                          </FormLabel>
                          <div className="grid grid-cols-2 gap-4">
                            <Input placeholder="Account Code" className="h-11" readOnly />
                            <Select
                              disabled={creationHandler.isPending || editingHandler.isPending}
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="h-11 w-full">
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
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      disabled={creationHandler.isPending || editingHandler.isPending}
                      control={form.control}
                      name="coa_interest_receivable"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">
                            Interest Receivable <span className="text-red-500">*</span>
                          </FormLabel>
                          <div className="grid grid-cols-2 gap-4">
                            <Input placeholder="Account Code" className="h-11" readOnly />
                            <Select
                              disabled={creationHandler.isPending || editingHandler.isPending}
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="h-11 w-full">
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
                          </div>
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
                          <FormLabel className="text-base font-medium">Unearned Interest</FormLabel>
                          <div className="grid grid-cols-2 gap-4">
                            <Input placeholder="Account Code" className="h-11" readOnly />
                            <Select
                              disabled={creationHandler.isPending || editingHandler.isPending}
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="h-11 w-full">
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
                          </div>
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
                          <FormLabel className="text-base font-medium">
                            Interest Income <span className="text-red-500">*</span>
                          </FormLabel>
                          <div className="grid grid-cols-2 gap-4">
                            <Input placeholder="Account Code" className="h-11" readOnly />
                            <Select
                              disabled={creationHandler.isPending || editingHandler.isPending}
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="h-11 w-full">
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
                          </div>
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
                          <FormLabel className="text-base font-medium">Other Income Penalty</FormLabel>
                          <div className="grid grid-cols-2 gap-4">
                            <Input placeholder="Account Code" className="h-11" readOnly />
                            <Select
                              disabled={creationHandler.isPending || editingHandler.isPending}
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="h-11 w-full">
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
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      disabled={creationHandler.isPending || editingHandler.isPending}
                      control={form.control}
                      name="coa_allowance_doubtful"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">Allowance for Doubtful Account</FormLabel>
                          <div className="grid grid-cols-2 gap-4">
                            <Input placeholder="Account Code" className="h-11" readOnly />
                            <Select
                              disabled={creationHandler.isPending || editingHandler.isPending}
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="h-11 w-full">
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
                          </div>
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
                          <FormLabel className="text-base font-medium">Bad Debt Expense</FormLabel>
                          <div className="grid grid-cols-2 gap-4">
                            <Input placeholder="Account Code" className="h-11" readOnly />
                            <Select
                              disabled={creationHandler.isPending || editingHandler.isPending}
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="h-11 w-full">
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
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      disabled={creationHandler.isPending || editingHandler.isPending}
                      control={form.control}
                      name="coa_garnished"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">
                            Garnished Expense <span className="text-red-500">*</span>
                          </FormLabel>
                          <div className="grid grid-cols-2 gap-4">
                            <Input placeholder="Account Code" className="h-11" readOnly />
                            <Select
                              disabled={creationHandler.isPending || editingHandler.isPending}
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="h-11 w-full">
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
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>
              </div>
            </Tabs>

            <div className="flex justify-end gap-3 pt-6">
              <Button
                disabled={creationHandler.isPending || editingHandler.isPending}
                type="button"
                variant="outline"
                onClick={() => {
                  onCancel()
                  onOpenChange(false)
                  form.reset()
                }}
                className="px-6"
              >
                Cancel
              </Button>
              <Button
                disabled={creationHandler.isPending || editingHandler.isPending}
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 px-6"
              >
                {(creationHandler.isPending || editingHandler.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save {watchedType === "bonus loan" ? "Bonus" : "Salary"} Loan
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
