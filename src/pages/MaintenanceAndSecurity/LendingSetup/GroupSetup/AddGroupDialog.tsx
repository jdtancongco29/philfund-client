"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CreateGroupPayload } from "./Service/GroupSetupTypes"
import { getBranchId } from "@/lib/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import GroupSetupService from "./Service/GroupSetupService"

// Define the form schema with validation
const formSchema = z.object({
  code: z.string().min(1, "Group code is required"),
  name: z.string().min(1, "Group name is required"),
})

// Define the form values type
type FormValues = z.infer<typeof formSchema>

// Define the component props
interface AddGroupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: () => void
}

export function AddGroupDialog({ open, onOpenChange, onSubmit }: AddGroupDialogProps) {
  const queryClient = useQueryClient()
  const creationHandler = useMutation({
    mutationFn: (newGroup: CreateGroupPayload) => {
      return GroupSetupService.createGroup(newGroup);
    },
  })
  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      name: "",
    },
  })

  // Handle form submission
  const handleSubmit = async (values: FormValues) => {
    const branch_id = getBranchId();
    if (branch_id) {
      const payload: CreateGroupPayload = { code: values.code, name: values.name, branch_id: branch_id }
      try {
        await creationHandler.mutateAsync(payload);
        queryClient.invalidateQueries({ queryKey: ['borrower-group-table'] })
        onSubmit();
        form.reset()
      } catch (_error) {
        console.log(_error);
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Add New Group</DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            Create a new borrower group for organizational purposes
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">
                    Group Code <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter group code" {...field} className="h-12" />
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
                  <FormLabel className="text-base font-medium">
                    Group Name <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter group name" {...field} className="h-12" />
                  </FormControl>
                  <p className="text-sm text-muted-foreground">A descriptive name for this borrower group</p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset()
                  onOpenChange(false)
                }}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
                Add Group
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
