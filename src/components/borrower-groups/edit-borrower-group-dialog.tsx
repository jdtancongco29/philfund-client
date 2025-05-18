"use client"

import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface BorrowerGroup {
  id: string
  code: string
  name: string
}

const formSchema = z.object({
  id: z.string(),
  code: z.string().min(1, "Group code is required"),
  name: z.string().min(1, "Group name is required"),
})

type FormValues = z.infer<typeof formSchema>

interface EditBorrowerGroupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  group: BorrowerGroup
  onSubmit: (values: BorrowerGroup) => void
}

export function EditBorrowerGroupDialog({ open, onOpenChange, group, onSubmit }: EditBorrowerGroupDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: group.id,
      code: group.code,
      name: group.name,
    },
  })

  useEffect(() => {
    if (open) {
      form.reset({
        id: group.id,
        code: group.code,
        name: group.name,
      })
    }
  }, [open, group, form])

  const handleSubmit = (values: FormValues) => {
    onSubmit(values)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Edit Group</DialogTitle>
          <DialogDescription className="text-base">Update the borrower group details</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    Group Code <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter group code" {...field} />
                  </FormControl>
                  <p className="text-sm text-muted-foreground">A unique code to identify this borrower group</p>
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
                    Group Name <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter group name" {...field} />
                  </FormControl>
                  <p className="text-sm text-muted-foreground">A descriptive name for this borrower group</p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}