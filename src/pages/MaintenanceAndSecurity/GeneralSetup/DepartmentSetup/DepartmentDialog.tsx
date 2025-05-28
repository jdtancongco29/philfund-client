"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { DepartmentSetup } from "./Service/DepartmentSetupTypes"
import DepartmentSetupService from "./Service/DepartmentSetupService"
import { toast } from "sonner"

// Define the form schema with Zod
const formSchema = (isEditing: boolean) =>
  z.object({
    code: z.string().length(3, "Department code must be exactly 3 characters."),
    name: z
      .string()
      .min(3, "Department name must be at least 3 characters.")
      .max(20, "Department name must not exceed 20 characters"),
    status: isEditing ? z.boolean() : z.boolean(),
  })

export type FormValues = z.infer<ReturnType<typeof formSchema>>

interface DepartmentDialogProps {
  item: DepartmentSetup | null
  open: boolean
  isEditing: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function DepartmentDialog({ item, open, isEditing, onOpenChange, onSuccess }: DepartmentDialogProps) {
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({})
  const queryClient = useQueryClient()

  // Create department mutation
  const createDepartmentMutation = useMutation({
    mutationFn: DepartmentSetupService.createDepartment,
    onSuccess: () => {
      toast.success("Department created successfully")
      queryClient.invalidateQueries({ queryKey: ["department-setup-table"] })
      setValidationErrors({})
      onSuccess?.()
      onOpenChange(false)
    },
    onError: (error: any) => {
      if (error.response?.data?.errors) {
        setValidationErrors(error.response.data.errors)
        // Set form errors for each field
        Object.entries(error.response.data.errors).forEach(([field, messages]) => {
          form.setError(field as any, {
            type: "server",
            message: Array.isArray(messages) ? messages[0] : messages,
          })
        })
      } else {
        toast.error(error.message || "Failed to create department")
      }
    },
  })

  // Update department mutation
  const updateDepartmentMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => DepartmentSetupService.updateDepartment(id, payload),
    onSuccess: () => {
      toast.success("Department updated successfully")
      queryClient.invalidateQueries({ queryKey: ["department-setup-table"] })
      setValidationErrors({})
      onSuccess?.()
      onOpenChange(false)
    },
    onError: (error: any) => {
      if (error.response?.data?.errors) {
        setValidationErrors(error.response.data.errors)
        // Set form errors for each field
        Object.entries(error.response.data.errors).forEach(([field, messages]) => {
          form.setError(field as any, {
            type: "server",
            message: Array.isArray(messages) ? messages[0] : messages,
          })
        })
      } else {
        toast.error(error.message || "Failed to update department")
      }
    },
  })

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema(isEditing)),
    defaultValues: {
      code: "",
      name: "",
      status: true,
    },
  })

  // Effect to handle dialog opening and data population
  useEffect(() => {
    if (open) {
      setValidationErrors({}) // Clear validation errors when opening dialog

      if (isEditing && item) {
        // Populate form with existing data
        form.reset({
          code: item.code || "",
          name: item.name || "",
          status: item.status ?? true,
        })
      } else {
        // Reset form for new department
        form.reset({
          code: "",
          name: "",
          status: true,
        })
      }
    }
  }, [open, isEditing, item])

  // Handle form submission
  const handleSubmit = (values: FormValues) => {
    const payload = {
      code: values.code,
      name: values.name,
      status: values.status ? 1 : 0, // Convert boolean to number as expected by API
    }

    if (isEditing && item) {
      updateDepartmentMutation.mutate({ id: item.id, payload })
    } else {
      createDepartmentMutation.mutate(payload)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px] sm:max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {isEditing ? "Edit Department" : "Add New Department"}
            </DialogTitle>
          </DialogHeader>

          <div className="overflow-y-auto">
            <div className="space-y-6 pt-4">
              <h3 className="text-lg font-semibold">Department Information</h3>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 overflow-y-auto">
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">
                          Department Code <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter department code"
                            className="focus-visible:outline-none"
                          />
                        </FormControl>
                        <FormDescription>A unique code to identify this department</FormDescription>
                        <FormMessage />
                        {/* {validationErrors.code && <p className="text-sm text-red-500">{validationErrors.code[0]}</p>} */}
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">
                          Department Name <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter department name"
                            {...field}
                            className="focus-visible:outline-none"
                          />
                        </FormControl>
                        <FormDescription>The full name of the department</FormDescription>
                        <FormMessage />
                        {validationErrors.name && <p className="text-sm text-red-500">{validationErrors.name[0]}</p>}
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-2 pt-2">
                    <div className="rounded-md border p-3 space-y-4">
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between w-full">
                            <div className="space-y-0.5">
                              <FormLabel className="text-sm">
                                Status (Active) <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormDescription>
                                This department is currently {field.value ? "active" : "inactive"}.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="custom-switch"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <DialogFooter className="pt-4">
                    <Button variant="outline" onClick={() => onOpenChange(false)} type="button">
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-600"
                      disabled={createDepartmentMutation.isPending || updateDepartmentMutation.isPending}
                    >
                      {createDepartmentMutation.isPending || updateDepartmentMutation.isPending
                        ? "Saving..."
                        : isEditing
                          ? "Update Department"
                          : "Create Department"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}