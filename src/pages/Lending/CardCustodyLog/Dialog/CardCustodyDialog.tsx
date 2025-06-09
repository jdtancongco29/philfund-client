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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Label } from "@/components/ui/label"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { CardCustodyLog } from "../Service/CardCustodyLogTypes"
import CardCustodyLogService from "../Service/CardCustodyLogService"
import { toast } from "sonner"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

const formSchema = z.object({
  reference_code: z.string().min(1, "Reference code is required"),
  reference_name: z.string().min(1, "Reference name is required"),
  date: z.date(),
  borrower_name: z.string().min(1, "Borrower name is required"),
  card_type: z.enum(["ATM", "UMID"]),
  transaction_type: z.string().min(1, "Transaction type is required"),
  is_borrower: z.boolean(),
  custodian: z.string().min(1, "Custodian is required"),
  date_returned: z.date().optional(),
  remarks: z.string().optional(),
})

export type FormValues = z.infer<typeof formSchema>

interface CardCustodyDialogProps {
  item: CardCustodyLog | null
  open: boolean
  isEditing: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function CardCustodyDialog({ item, open, isEditing, onOpenChange, onSuccess }: CardCustodyDialogProps) {
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({})
  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: CardCustodyLogService.createCardCustodyLog,
    onSuccess: () => {
      toast.success("Card custody log created successfully")
      queryClient.invalidateQueries({ queryKey: ["card-custody-log-table"] })
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
        toast.error(error.message || "Failed to create card custody log")
      }
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      CardCustodyLogService.updateCardCustodyLog(id, payload),
    onSuccess: () => {
      toast.success("Card custody log updated successfully")
      queryClient.invalidateQueries({ queryKey: ["card-custody-log-table"] })
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
        toast.error(error.message || "Failed to update card custody log")
      }
    },
  })

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reference_code: "",
      reference_name: "",
      date: new Date(),
      borrower_name: "",
      card_type: "ATM",
      transaction_type: "",
      is_borrower: false,
      custodian: "",
      date_returned: undefined,
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

      if (isEditing && item) {
        form.reset({
          reference_code: item.reference_code || "",
          reference_name: item.reference_name || "",
          date: item.date ? new Date(item.date) : new Date(),
          borrower_name: item.name || "",
          card_type: (item.card_type as "ATM" | "UMID") || "ATM",
          transaction_type: item.transaction || "",
          is_borrower: item.is_borrower || false,
          custodian: item.custodian || "",
          date_returned: item.date_returned ? new Date(item.date_returned) : undefined,
          remarks: item.remarks || "",
        })
      } else {
        form.reset({
          reference_code: "",
          reference_name: "",
          date: new Date(),
          borrower_name: "",
          card_type: "ATM",
          transaction_type: "",
          is_borrower: false,
          custodian: "",
          date_returned: undefined,
          remarks: "",
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
      name: values.borrower_name,
      card_type: values.card_type,
      transaction: values.transaction_type,
      is_borrower: values.is_borrower,
      custodian: values.custodian,
      date_returned: values.date_returned ? format(values.date_returned, "yyyy-MM-dd") : null,
      remarks: values.remarks || "",
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
            {isEditing ? "Edit Card Custody Entry" : "New Card Custody Entry"}
          </DialogTitle>
          <p className="text-sm text-gray-500">Record card sign-out or return transactions</p>
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
                  name="borrower_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Borrower Name <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2 p-3 border rounded-md">
                          <span className="bg-gray-100 px-2 py-1 rounded text-sm">Borrower 1</span>
                          <Input
                            placeholder="Select borrower name"
                            {...field}
                            className="border-none shadow-none focus-visible:ring-0"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="card_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Card type <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex flex-row space-x-6"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="ATM" id="atm" />
                            <Label htmlFor="atm">ATM</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="UMID" id="umid" />
                            <Label htmlFor="umid">UMID</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <p className="text-sm text-gray-500">The normal balance side for this account</p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="transaction_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Transaction Type <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Sign out">Sign out</SelectItem>
                          <SelectItem value="Returned">Returned</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_borrower"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Borrower</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="custodian"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Custodian <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Maria Santos">Maria Santos</SelectItem>
                          <SelectItem value="Pedro Penduko">Pedro Penduko</SelectItem>
                          <SelectItem value="Juan Luna">Juan Luna</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-gray-500">Person responsible for the card</p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date_returned"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Date Returned <span className="text-red-500">*</span>
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
                  name="remarks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Remarks</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter any additional notes" className="min-h-[80px]" {...field} />
                      </FormControl>
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
                        ? "Update Card"
                        : "Add Card"}
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
