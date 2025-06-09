"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useEffect, useState } from "react"
import { Printer, X } from "lucide-react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { CheckEncashment, JournalEntry } from "../Service/CheckEncashmentTypes"
import CheckEncashmentService from "../Service/CheckEncashmentService"
import { toast } from "sonner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const formSchema = z.object({
  reference_code: z.string().min(1, "Reference code is required"),
  reference_no: z.string().min(1, "Reference number is required"),
  check_no: z.string().min(1, "Check number is required"),
  remarks: z.string().optional(),
})

export type FormValues = z.infer<typeof formSchema>

interface CheckEncashmentDialogProps {
  item: CheckEncashment | null
  open: boolean
  isEditing: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function CheckEncashmentDialog({ item, open, isEditing, onOpenChange, onSuccess }: CheckEncashmentDialogProps) {
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({})
  const [selectedCheck, setSelectedCheck] = useState<any>(null)
  const queryClient = useQueryClient()

  // Sample check details that would be fetched based on check_no selection
  const sampleCheckDetails = {
    payee: "Juan Dela Cruz",
    date: "April 18, 2025",
    amount: 10000.0,
    processing_fee: 100.0,
    net_amount: 7500.0,
  }

  // Sample journal entries
  const journalEntries: JournalEntry[] = [
    {
      id: "1",
      code: "2024-08-15",
      name: "Cash in Bank",
      debit: 181500.0,
      credit: null,
    },
    {
      id: "2",
      code: "2024-08-15",
      name: "Salary Loans Receivable",
      debit: null,
      credit: 18200.0,
    },
    {
      id: "3",
      code: "2024-08-15",
      name: "Unearned Interest Income",
      debit: null,
      credit: null,
    },
  ]

  const createMutation = useMutation({
    mutationFn: CheckEncashmentService.createCheckEncashment,
    onSuccess: () => {
      toast.success("Check encashment created successfully")
      queryClient.invalidateQueries({ queryKey: ["check-encashment-table"] })
      setServerErrors({})
      onSuccess?.()
      onOpenChange(false)
    },
    onError: (error: any) => {
      if (error.response?.data?.errors) {
        const errors: Record<string, string> = {}
        Object.entries(error.response.data.errors).forEach(([field, messages]) => {
          errors[field] = Array.isArray(messages) ? messages[0] : messages
        })
        setServerErrors(errors)

        Object.entries(errors).forEach(([field, message]) => {
          form.setError(field as any, {
            type: "server",
            message: message,
          })
        })
      } else {
        toast.error(error.message || "Failed to create check encashment")
      }
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      CheckEncashmentService.updateCheckEncashment(id, payload),
    onSuccess: () => {
      toast.success("Check encashment updated successfully")
      queryClient.invalidateQueries({ queryKey: ["check-encashment-table"] })
      setServerErrors({})
      onSuccess?.()
      onOpenChange(false)
    },
    onError: (error: any) => {
      if (error.response?.data?.errors) {
        const errors: Record<string, string> = {}
        Object.entries(error.response.data.errors).forEach(([field, messages]) => {
          errors[field] = Array.isArray(messages) ? messages[0] : messages
        })
        setServerErrors(errors)

        Object.entries(errors).forEach(([field, message]) => {
          form.setError(field as any, {
            type: "server",
            message: message,
          })
        })
      } else {
        toast.error(error.message || "Failed to update check encashment")
      }
    },
  })

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reference_code: "",
      reference_no: "",
      check_no: "",
      remarks: "",
    },
  })

  useEffect(() => {
    const subscription = form.watch(({ name }: any) => {
      if (name && serverErrors[name]) {
        setServerErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors[name]
          return newErrors
        })
      }
    })
    return () => subscription.unsubscribe()
  }, [form, serverErrors])

  useEffect(() => {
    Object.entries(serverErrors).forEach(([field, message]) => {
      const currentError = form.formState.errors[field as keyof FormValues]
      if (!currentError) {
        form.setError(field as any, {
          type: "server",
          message: message,
        })
      }
    })
  }, [form.formState.errors, serverErrors, form])

  useEffect(() => {
    if (open) {
      setServerErrors({})
      setSelectedCheck(sampleCheckDetails) // In real app, this would be fetched based on check selection

      if (isEditing && item) {
        form.reset({
          reference_code: item.reference_code || "",
          reference_no: item.reference_no || "",
          check_no: item.check_no || "",
          remarks: item.remarks || "",
        })
      } else {
        form.reset({
          reference_code: "",
          reference_no: "",
          check_no: "",
          remarks: "",
        })
      }
    }
  }, [open, isEditing, item])

  const handleSubmit = (values: FormValues) => {
    setServerErrors({})

    const payload = {
      reference_code: values.reference_code,
      reference_no: values.reference_no,
      check_no: values.check_no,
      payee: selectedCheck?.payee || "",
      date: new Date().toISOString().split("T")[0],
      amount: selectedCheck?.amount || 0,
      processing_fee: selectedCheck?.processing_fee || 0,
      net_amount: selectedCheck?.net_amount || 0,
      remarks: values.remarks || "",
      journal_entries: journalEntries,
    }

    if (isEditing && item) {
      updateMutation.mutate({ id: item.id, payload })
    } else {
      createMutation.mutate(payload)
    }
  }

  const handlePrint = () => {
    toast.info("Print functionality will be implemented")
  }

  const totalDebit = journalEntries.reduce((sum, entry) => sum + (entry.debit || 0), 0)
  const totalCredit = journalEntries.reduce((sum, entry) => sum + (entry.credit || 0), 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] sm:max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">{isEditing ? "Edit Check" : "New Check"}</DialogTitle>
          </div>
        </DialogHeader>

        <div className="overflow-y-auto">
          <div className="space-y-6 pt-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 p-1">
                {/* Reference Fields */}
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
                    name="reference_no"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Reference No. <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Enter reference no." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Check Number */}
                <FormField
                  control={form.control}
                  name="check_no"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Check No <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="CHK-2023-001">CHK-2023-001</SelectItem>
                          <SelectItem value="CHK-2023-002">CHK-2023-002</SelectItem>
                          <SelectItem value="CHK-2023-003">CHK-2023-003</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Check Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Check Details</h3>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <label className="text-sm font-medium text-gray-700">Payee</label>
                      <Input value={selectedCheck?.payee || ""} disabled className="bg-gray-50" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <label className="text-sm font-medium text-gray-700">Date</label>
                      <Input value={selectedCheck?.date || ""} disabled className="bg-gray-50" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <label className="text-sm font-medium text-gray-700">Check Amount</label>
                      <Input
                        value={selectedCheck?.amount?.toLocaleString("en-US", { minimumFractionDigits: 2 }) || ""}
                        disabled
                        className="bg-gray-50"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <label className="text-sm font-medium text-gray-700">Processing fee (1%)</label>
                      <Input
                        value={
                          selectedCheck?.processing_fee?.toLocaleString("en-US", { minimumFractionDigits: 2 }) || ""
                        }
                        disabled
                        className="bg-gray-50"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <label className="text-sm font-medium text-gray-700">Net Amount Received</label>
                      <Input
                        value={selectedCheck?.net_amount?.toLocaleString("en-US", { minimumFractionDigits: 2 }) || ""}
                        disabled
                        className="bg-gray-50"
                      />
                    </div>
                  </div>
                </div>

                {/* Remarks */}
                <FormField
                  control={form.control}
                  name="remarks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Remarks</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Select borrower name" className="min-h-[80px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Journal Entries */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Journal Entries</h3>
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Code</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead className="text-right">Debit</TableHead>
                          <TableHead className="text-right">Credit</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {journalEntries.map((entry) => (
                          <TableRow key={entry.id}>
                            <TableCell>{entry.code}</TableCell>
                            <TableCell>{entry.name}</TableCell>
                            <TableCell className="text-right">
                              {entry.debit
                                ? `₱${entry.debit.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
                                : "-"}
                            </TableCell>
                            <TableCell className="text-right">
                              {entry.credit
                                ? `₱${entry.credit.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
                                : "-"}
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="font-semibold bg-gray-50">
                          <TableCell colSpan={2}>Total</TableCell>
                          <TableCell className="text-right">
                            ₱{totalDebit.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                          </TableCell>
                          <TableCell className="text-right">
                            ₱{totalCredit.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <DialogFooter className="pt-4 mb-2 flex gap-2">
                  <Button variant="outline" onClick={() => onOpenChange(false)} type="button">
                    Cancel
                  </Button>
                  <Button variant="outline" onClick={handlePrint} type="button">
                    <Printer className="h-4 w-4" />
                    Print
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600"
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    {createMutation.isPending || updateMutation.isPending
                      ? "Processing..."
                      : isEditing
                        ? "Update Encash"
                        : "Add Encash"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
