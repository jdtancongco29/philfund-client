"use client"

import { useEffect } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

// ✅ Zod Schema
const formSchema = z.object({
  code: z
    .string()
    .length(3, "Department code must be exactly 3 characters."), // simpler and better than min/max
  name: z
    .string()
    .min(3, "Department name must be at least 3 characters."),
  status: z.boolean(),
})

export type FormValues = z.infer<typeof formSchema>

interface DepartmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: FormValues) => void
  onReset: boolean
  initialValues?: FormValues | null
}

export function DepartmentDialog({
  open,
  onOpenChange,
  onSubmit,
  onReset,
  initialValues,
}: DepartmentDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      name: "",
      status: true,
    },
  })

  const isEditMode = Boolean(initialValues)

  // Reset with initialValues
  useEffect(() => {
    if (open) {
      form.reset(initialValues || {
        code: "",
        name: "",
        status: true,
      })
      setTimeout(() => {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      }, 0);
    }
  }, [initialValues, open, form])

  useEffect(() => {
    form.reset()
  }, [onReset])

  function handleSubmit(values: FormValues) {
    onSubmit(values)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {isEditMode ? "Edit Department" : "Add New Department"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 py-4">
            {/* Code */}
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department Code <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Enter department code" autoFocus={false} {...field} />
                  </FormControl>
                  <FormDescription>A unique code to identify this department</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department Name <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Enter department name" {...field} />
                  </FormControl>
                  <FormDescription>The full name of the department</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status */}
            <div className="border rounded-lg p-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between">
                    <div className="space-y-0.5">
                      <FormLabel>Status (Active)</FormLabel>
                      <FormDescription>This department is currently active.</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Actions */}
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => {
                form.reset()
                onOpenChange(false)
              }}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
                {isEditMode ? "Save Changes" : "Add Department"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}