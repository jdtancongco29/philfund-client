"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useEffect, useState } from "react"
import { CalendarIcon } from "lucide-react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { UnsoldNoAccountsRecord } from "../Service/UnsoldNoAccountsTypes"
import UnsoldNoAccountsService from "../Service/UnsoldNoAccountsService"
import { toast } from "sonner"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

const formSchema = z.object({
  reference_code: z.string().min(1, "Reference code is required"),
  reference_name: z.string().min(1, "Reference name is required"),
  date: z.date(),
  borrower: z.string().min(1, "Borrower is required"),
  bonus_loan_type: z.string().min(1, "Bonus loan type is required"),
  remarks: z.string().optional(),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  released_by: z.string().min(1, "Released by is required"),
  received_by: z.string().min(1, "Received by is required"),
})

export type FormValues = z.infer<typeof formSchema>

interface UnsoldNoAccountsDialogProps {
  item: UnsoldNoAccountsRecord | null
  open: boolean
  isEditing: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function UnsoldNoAccountsDialog({
  item,
  open,
  isEditing,
  onOpenChange,
  onSuccess,
}: UnsoldNoAccountsDialogProps) {
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({})
  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: UnsoldNoAccountsService.createUnsoldNoAccountsRecord,
    onSuccess: () => {
      toast.success("Record created successfully")
      queryClient.invalidateQueries({ queryKey: ["unsold-no-accounts-table"] })
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
        toast.error(error.message || "Failed to create record")
      }
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      UnsoldNoAccountsService.updateUnsoldNoAccountsRecord(id, payload),
    onSuccess: () => {
      toast.success("Record updated successfully")
      queryClient.invalidateQueries({ queryKey: ["unsold-no-accounts-table"] })
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
        toast.error(error.message || "Failed to update record")
      }
    },
  })

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reference_code: "",
      reference_name: "",
      date: new Date(),
      borrower: "",
      bonus_loan_type: "",
      remarks: "",
      amount: 0,
      released_by: "",
      received_by: "",
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

      if (isEditing && item) {
        form.reset({
          reference_code: item.reference_code || "",
          reference_name: item.reference_name || "",
          date: item.date ? new Date(item.date) : new Date(),
          borrower: item.name || "",
          bonus_loan_type: item.category || "",
          remarks: item.remarks || "",
          amount: item.amount || 0,
          released_by: item.released_by || "",
          received_by: item.received_by || "",
        })
      } else {
        form.reset({
          reference_code: "",
          reference_name: "",
          date: new Date(),
          borrower: "",
          bonus_loan_type: "",
          remarks: "",
          amount: 0,
          released_by: "",
          received_by: "",
        })
      }
    }
  }, [open, isEditing, item])

  const handleSubmit = (values: FormValues) => {
    setServerErrors({})

    const payload = {
      reference_code: values.reference_code,
      reference_name: values.reference_name,
      date: format(values.date, "yyyy-MM-dd"),
      name: values.borrower,
      card_type: "ATM", // Default value based on the images
      category: values.bonus_loan_type,
      remarks: values.remarks || "",
      amount: values.amount,
      released_by: values.released_by,
      received_by: values.received_by,
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] sm:max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {isEditing ? "Edit Unsold/No Accounts Record" : "Add New Unsold/No Accounts Record"}
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto">
          <div className="space-y-6 pt-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 p-1">
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
                  name="reference_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Reference Name <span className="text-red-500">*</span>
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

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Date <span className="text-red-500">*</span>
                      </FormLabel>
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
                              {field.value ? format(field.value, "MMMM dd, yyyy") : <span>Pick a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="borrower"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Borrower <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Juan Dela Cruz">Juan Dela Cruz</SelectItem>
                          <SelectItem value="Jose Rizal">Jose Rizal</SelectItem>
                          <SelectItem value="Maria Clara">Maria Clara</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bonus_loan_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Bonus loan type <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Bonus">Bonus</SelectItem>
                          <SelectItem value="BL-CA">BL-CA</SelectItem>
                          <SelectItem value="Special">Special</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="remarks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Remarks</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Add remarks..." className="min-h-[80px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                          step="0.01"
                          placeholder="Enter amount"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="released_by"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Released by <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="John Doe">John Doe</SelectItem>
                          <SelectItem value="Jane Smith">Jane Smith</SelectItem>
                          <SelectItem value="Admin User">Admin User</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="received_by"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Received by <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="John Doe">John Doe</SelectItem>
                          <SelectItem value="Jane Smith">Jane Smith</SelectItem>
                          <SelectItem value="Admin User">Admin User</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter className="pt-4 mb-2 flex gap-2">
                  <Button variant="outline" onClick={() => onOpenChange(false)} type="button">
                    Cancel
                  </Button>
                  <Button variant="outline" onClick={handlePrint} type="button">
                    Print
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600"
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    {createMutation.isPending || updateMutation.isPending
                      ? "Saving..."
                      : isEditing
                        ? "Update Record"
                        : "Save Record"}
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
