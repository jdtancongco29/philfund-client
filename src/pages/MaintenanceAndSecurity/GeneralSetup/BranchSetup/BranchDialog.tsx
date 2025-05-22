"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"

import Multiselect from 'multiselect-react-dropdown';

type DepartmentItems = {
  id: string,
  name: string
}

// Define the form schema with Zod
const formSchema = z.object({
  code: z
    .string()
    .length(3, "Branch code must be exactly 3 characters."),
  name: z
    .string()
    .min(3, { message: "Branch name must be at least 3 characters."})
    .max(20, { message: "Branch name must must not be greater than 20 characters."}),
  address: z.string().min(1, "Address is required"),
  contact: z.string({
    required_error: "Contact is required",
  }).min(11, "Contact must be atleast 11 digits"),
  email: z.string().email("Invalid email address"),
  city: z.string().min(1, "City/Municipality is required"),
  departments: z.array(z.object({ id: z.string(), name: z.string() })).min(1, "At least one department is required"),
  status: z.boolean(),
})

// Define the form values type
export type FormValues = z.infer<typeof formSchema>

// Define the component props
export interface BranchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: FormValues) => void
  onReset: boolean
  initialValues?: FormValues | null
  departments: DepartmentItems[]
}

export function BranchDialog({ open, onOpenChange, onSubmit, onReset, initialValues, departments }: BranchDialogProps) {
  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || {
      code: "",
      name: "",
      address: "",
      contact: "",
      email: "",
      city: "",
      departments: [],
      status: true,
    },
  })

  // Handle form submission
  const handleSubmit = (values: FormValues) => {
    onSubmit(values)
  }

  // Reset form when onReset changes
  React.useEffect(() => {
    if (onReset) {
      form.reset(
        initialValues || {
          code: "",
          name: "",
          address: "",
          contact: "",
          email: "",
          city: "",
          departments: [],
          status: true,
        },
      )
    }
  }, [onReset, form, initialValues])

  // Update form when initialValues changes
  React.useEffect(() => {
    if (initialValues) {
      form.reset(initialValues)
    }
  }, [initialValues, form])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-hidden flex flex-col " aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Add New Branch</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-2 overflow-y-auto">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    Branch Code <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="BR132154" autoFocus={false} {...field} className="focus-visible:outline-none" />
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
                  <FormLabel className="text-base">
                    Branch Name <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter branch name" {...field} />
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
                  <FormLabel className="text-base">
                    Address <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter branch address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    Contact <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter contact number" {...field} />
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
                  <FormLabel className="text-base">
                    Email <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter email address" type="email" {...field} />
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
                  <FormLabel className="text-base">
                    City/Municipality <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter municipality or city" {...field} />
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
                  <FormLabel className="text-base">
                    Add Departments <span className="text-red-500">*</span>
                  </FormLabel>
                  <Multiselect
                    options={departments}
                    selectedValues={field.value}
                    onSelect={field.onChange}
                    onRemove={field.onChange}
                    displayValue="name"
                    showCheckbox
                    placeholder="Select Departments"
                    id="multiselect-departments"
                    customCloseIcon={<X className="ml-1 w-4 h-4 cursor-pointer"/>}
                    style={{
                      chips: {
                        background: "var(--secondary)",
                        color: "var(--foreground)",
                        fontSize: "14px",
                        margin: "0px",
                        borderRadius: "5px"
                      },
                      searchBox: {
                        display: "flex",
                        gap: "5px",
                        border: "1px solid #cbd5e0",
                        borderRadius: "8px",
                        padding: "6px 12px",
                        fontSize: "14px",
                        flexWrap: "wrap"
                      },
                      inputField: {
                        margin: "0px"
                      }
                    }}
                  />
                  <FormDescription>Select the departments that will be available in this branch</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Status (Active) <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormDescription>This branch is currently {field.value ? "active" : "inactive"}.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} className="custom-switch" />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-500 hover:bg-blue-600">Save Branch</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}