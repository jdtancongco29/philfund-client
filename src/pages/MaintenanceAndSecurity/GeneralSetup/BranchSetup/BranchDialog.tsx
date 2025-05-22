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
// import { Badge } from "@/components/ui/badge"
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import Multiselect from 'multiselect-react-dropdown';

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// Sample departments data
const departments = [
  { id: "1", name: "Department 1" },
  { id: "2", name: "Department 2" },
  { id: "3", name: "Department 3" },
  { id: "4", name: "Department 4" },
  { id: "5", name: "Department 5" },
]

// Define the form schema with Zod
const formSchema = z.object({
  code: z.string().min(1, "Branch code is required"),
  name: z.string().min(1, "Branch name is required"),
  address: z.string().min(1, "Address is required"),
  contact: z.string().min(1, "Contact is required"),
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
}

export function BranchDialog({ open, onOpenChange, onSubmit, onReset, initialValues }: BranchDialogProps) {
  const [popoverOpen, setPopoverOpen] = React.useState(false)
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
                    <Input placeholder="BR132154" autoFocus={false} {...field} />
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
                  <div className="relative">
                    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                      <div className="border rounded-lg p-1 flex flex-wrap items-center gap-1 bg-white">
                        {field.value.map((department) => {
                          return (
                            <div
                              key={department.id}
                              className="flex items-center gap-1 bg-gray-100 rounded-md px-2 py-1"
                            >
                              <span>{department.name}</span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  const newValue = field.value.filter((value) => value.id !== department.id)
                                  form.setValue("departments", newValue, {
                                    shouldValidate: true,
                                  })
                                }}
                                className="text-gray-500 hover:text-gray-700"
                              >
                                <X className="h-4 w-4" />
                                <span className="sr-only">Remove {department.name}</span>
                              </button>
                            </div>
                          )
                        })}
                        <PopoverTrigger asChild>
                          <FormControl>
                            <button
                              type="button"
                              className="px-2 py-1 text-gray-500 flex-1 text-left focus:outline-none"
                              onClick={(e) => {
                                e.stopPropagation()
                                setPopoverOpen(true)
                              }}
                            >
                              {field.value.length === 0 ? "Select Departments" : "Select Departments"}
                            </button>
                          </FormControl>
                        </PopoverTrigger>
                      </div>
                      <PopoverContent
                        className="w-full p-0"
                        align="start"
                        side="bottom"
                        sideOffset={4}
                        style={{ zIndex: 9999 }}
                        forceMount
                      >
                        <Command>
                          <CommandInput placeholder="Search departments..." />
                          <CommandList>
                            <CommandEmpty>No department found.</CommandEmpty>
                            <CommandGroup>
                              {departments.map((department) => (
                                <CommandItem
                                  key={department.id}
                                  value={department.id}
                                  onSelect={() => {
                                    const isSelected = field.value.some((value) => value.id === department.id)
                                    const newValue = isSelected
                                      ? field.value.filter((value) => value.id !== department.id)
                                      : [...field.value, department]
                                    form.setValue("departments", newValue, {
                                      shouldValidate: true,
                                    })
                                  }}
                                >
                                  {department.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
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
