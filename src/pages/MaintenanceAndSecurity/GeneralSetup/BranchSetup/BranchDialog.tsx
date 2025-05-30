"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useEffect, useMemo, useState } from "react"
import { X } from "lucide-react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import Multiselect from "multiselect-react-dropdown"
import type { BranchSetup, Department } from "./Service/BranchSetupTypes"
import BranchSetupService from "./Service/BranchSetupService"
import { toast } from "sonner"

// Define the form schema with Zod
const formSchema = (isEditing: boolean) =>
  z.object({
    code: z.string().min(1, "Branch code is required").max(3, "Branch code must be 3 characters"),
    name: z
      .string()
      .min(3, "Branch name must be at least 3 characters.")
      .max(50, "Branch name must not exceed 50 characters"),
    email: z.string().email("Invalid email address"),
    address: z.string().min(1, "Address is required"),
    contact: z.string().min(11, "Contact must be at least 11 digits").regex(/^\d+$/, "Only digits are allowed"),
    city: z.string().min(1, "City/Municipality is required"),
    departments: z.array(z.object({ id: z.string(), name: z.string() })).min(1, "At least one department is required"),
    status: isEditing ? z.boolean() : z.boolean(),
  })

export type FormValues = z.infer<ReturnType<typeof formSchema>>

interface BranchDialogProps {
  item: BranchSetup | null
  open: boolean
  isEditing: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function BranchDialog({ item, open, isEditing, onOpenChange, onSuccess }: BranchDialogProps) {
  const [departmentsData, setDepartmentsData] = useState<Department[]>([])
  const queryClient = useQueryClient()

  // Fetch departments mutation
  const { mutate: fetchDepartments } = useMutation({
    mutationFn: BranchSetupService.getDepartments,
    onSuccess: (data) => {
      const newDepartmentCollection =
        data.data.departments?.map((department: { id: string; name: string }) => ({
          id: department.id,
          name: department.name,
        })) || []
      setDepartmentsData(newDepartmentCollection)
    },
    onError: (error) => {
      toast.error("Failed to fetch departments")
      console.error(error)
    },
  })

  // Create branch mutation
  const createBranchMutation = useMutation({
    mutationFn: BranchSetupService.createBranch,
    onSuccess: () => {
      toast.success("Branch created successfully")
      queryClient.invalidateQueries({ queryKey: ["branch-setup-table"] })
      onSuccess?.()
      onOpenChange(false)
    },
    onError: (error: any) => {
      if (error.response?.data?.errors) {
        // Set form errors for each field
        Object.entries(error.response.data.errors).forEach(([field, messages]) => {
          form.setError(field as any, {
            type: "server",
            message: Array.isArray(messages) ? messages[0] : messages,
          })
        })
      } else {
        toast.error(error.message || "Failed to create branch")
      }
    },
  })

  // Update branch mutation
  const updateBranchMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => BranchSetupService.updateBranch(id, payload),
    onSuccess: () => {
      toast.success("Branch updated successfully")
      queryClient.invalidateQueries({ queryKey: ["branch-setup-table"] })
      onSuccess?.()
      onOpenChange(false)
    },
    onError: (error: any) => {
      if (error.response?.data?.errors) {
        // Set form errors for each field
        Object.entries(error.response.data.errors).forEach(([field, messages]) => {
          form.setError(field as any, {
            type: "server",
            message: Array.isArray(messages) ? messages[0] : messages,
          })
        })
      } else {
        toast.error(error.message || "Failed to update branch")
      }
    },
  })

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema(isEditing)),
    defaultValues: {
      code: "",
      name: "",
      email: "",
      address: "",
      contact: "",
      city: "",
      departments: [],
      status: true,
    },
  })

  // Effect to handle dialog opening and data fetching
  useEffect(() => {
    if (open) {
      fetchDepartments()

      if (isEditing && item) {
        // Populate form with existing data
        const departmentObjects =
          item.departments?.map((department) => ({
            id: typeof department === "object" ? department.id : department,
            name: typeof department === "object" ? department.name : department,
          })) || []

        form.reset({
          code: item.code || "",
          name: item.name || "",
          email: item.email || "",
          address: item.address || "",
          contact: item.contact || "",
          city: item.city || "",
          departments: departmentObjects,
          status: item.status ?? true,
        })
      } else {
        // Reset form for new branch
        form.reset({
          code: "",
          name: "",
          email: "",
          address: "",
          contact: "",
          city: "",
          departments: [],
          status: true,
        })
      }
    }
  }, [open, isEditing, item])

  const departments = useMemo(() => {
    return departmentsData ?? []
  }, [departmentsData])

  // Handle form submission
  const handleSubmit = (values: FormValues) => {
    const payload = {
      code: values.code,
      name: values.name,
      email: values.email,
      address: values.address,
      contact: values.contact,
      city: values.city,
      status: values.status ? 1 : 0, // Convert boolean to number as expected by API
      departments: values.departments.map((department) => department.id),
    }

    if (isEditing && item) {
      updateBranchMutation.mutate({ id: item.id, payload })
    } else {
      createBranchMutation.mutate(payload)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] sm:max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{isEditing ? "Edit Branch" : "Add New Branch"}</DialogTitle>
          </DialogHeader>

          <div className="overflow-y-auto">
            <div className="space-y-6 pt-4">
              <h3 className="text-lg font-semibold">Branch Information</h3>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 p-1">
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">
                          Branch Code <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter branch code" className="focus:outline-none focus-visible:outline-none" />
                        </FormControl>
                        <FormDescription>A unique code to identify this branch</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">
                          Branch Name <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Enter branch name" {...field} className="focus-visible:outline-none" />
                        </FormControl>
                        <FormDescription>The full name of the branch</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">
                          Address <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Enter branch address" {...field} className="focus-visible:outline-none" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contact"
                    rules={{ pattern: /^[0-9]+$/, required: "Contact number is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">
                          Contact <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter contact number"
                            inputMode="numeric"
                            {...field}
                            className="focus-visible:outline-none"
                            onChange={(e) => {
                              const digitsOnly = e.target.value.replace(/\D/g, "");
                              field.onChange(digitsOnly);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">
                          Email <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter email address"
                            type="email"
                            {...field}
                            className="focus-visible:outline-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">
                          City/Municipality <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter city or municipality"
                            {...field}
                            className="focus-visible:outline-none"
                          />
                        </FormControl>
                        <FormDescription>For legal documents</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="departments"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">
                          Departments <span className="text-red-500">*</span>
                        </FormLabel>
                        <Multiselect
                          options={departments}
                          selectedValues={field.value}
                          onSelect={field.onChange}
                          onRemove={field.onChange}
                          displayValue="name"
                          showCheckbox
                          placeholder="Select Departments"
                          customCloseIcon={<X className="ml-1 w-4 h-4 cursor-pointer" />}
                          style={{
                            chips: {
                              background: "var(--secondary)",
                              color: "var(--foreground)",
                              fontSize: "14px",
                              margin: "0px",
                              borderRadius: "5px",
                            },
                            searchBox: {
                              display: "flex",
                              gap: "5px",
                              border: "1px solid #cbd5e0",
                              borderRadius: "8px",
                              padding: "6px 12px",
                              fontSize: "14px",
                              flexWrap: "wrap",
                            },
                            inputField: {
                              margin: "0px",
                            },
                            optionContainer: {
                              maxHeight: "250px",
                              overflowY: "auto",
                            },
                            option: {
                              fontSize: "14px",
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            },
                          }}
                        />
                        <FormDescription>Select the departments that will be available in this branch</FormDescription>
                        <FormMessage />
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
                                This branch is currently {field.value ? "active" : "inactive"}.
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

                  <DialogFooter className="pt-4 mb-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)} type="button">
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-600"
                      disabled={createBranchMutation.isPending || updateBranchMutation.isPending}
                    >
                      {createBranchMutation.isPending || updateBranchMutation.isPending
                        ? "Saving..."
                        : isEditing
                          ? "Update Branch"
                          : "Create Branch"}
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