"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { BorrowGroup, CreateGroupPayload, UpdateGroupPayload } from "./Service/GroupSetupTypes"
import { getBranchId } from "@/lib/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import GroupSetupService from "./Service/GroupSetupService"
import { Loader2 } from "lucide-react"
import { useEffect } from "react"
import { AxiosError } from "axios"

// Define the form schema with validation
const formSchema = z.object({
  code: z.string().min(1, "Group code is required"),
  name: z.string().min(1, "Group name is required"),
})

// Define the form values type
type FormValues = z.infer<typeof formSchema>

// Define the component props
interface AddGroupDialogProps {
  item: BorrowGroup | null,
  open: boolean,
  isEditing: boolean,
  onOpenChange: (open: boolean) => void
  onSubmit: () => void
  onCancel: () => void
}

export function GroupDialogForm({ open, isEditing, item, onOpenChange, onCancel, onSubmit }: AddGroupDialogProps) {
  const queryClient = useQueryClient()
  const editingHandler = useMutation({
    mutationFn: (newGroup: UpdateGroupPayload) => {
      return GroupSetupService.updateGroup(item!.id, newGroup);
    },
  })
  const creationHandler = useMutation({
    mutationFn: (newGroup: CreateGroupPayload) => {
      return GroupSetupService.createGroup(newGroup);
    },
  })
  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: item?.code ?? "",
      name: item?.name ?? "",
    },
  })

  useEffect(() => {
    form.setValue("code", item?.code ?? "");
    form.setValue("name", item?.name ?? "");
  }, [item, form])

  const create = async (branch_id: string, values: FormValues) => {
    const payload: CreateGroupPayload = { code: values.code, name: values.name, branch_id: branch_id }
    try {
      await creationHandler.mutateAsync(payload);
      queryClient.invalidateQueries({ queryKey: ['borrower-group-table'] })
      onSubmit();
      form.reset()
    } catch (errorData: unknown) {
      if (errorData instanceof AxiosError) {
        Object.entries(errorData.response?.data.errors).forEach(([field, messages]) => {
          const errorMsg = messages as string[];
          form.setError(field as "code" | "name", {
            type: 'manual',
            message: errorMsg[0]
          });
        }
        )
      }
    }
  }

  const update = async (branch_id: string, values: FormValues) => {
    const payload: UpdateGroupPayload = { code: values.code, name: values.name, branch_id: branch_id }
    try {
      await editingHandler.mutateAsync(payload);
      queryClient.invalidateQueries({ queryKey: ['borrower-group-table'] })
      onSubmit();
      form.reset()
    } catch (errorData: unknown) {
      if (errorData instanceof AxiosError) {
        Object.entries(errorData.response?.data.errors).forEach(([field, messages]) => {
          const errorMsg = messages as string[];
          form.setError(field as "code" | "name", {
            type: 'manual',
            message: errorMsg[0]
          });
        }
        )
      }
    }
  }

  // Handle form submission
  const handleSubmit = async (values: FormValues) => {
    const branch_id = getBranchId();
    if (branch_id) {
      if (isEditing) {
        update(branch_id, values);
      } else {
        create(branch_id, values);
      }
    }
  }

  return (
    <Dialog
      open={open} onOpenChange={(open) => {
        onOpenChange(open)
        if (!open) {
          form.reset()
        }
      }}>
      <DialogContent className="sm:max-w-[500px]" autoFocus={false}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{isEditing ? "Edit" : "Add New"} Group</DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            {isEditing ? "Edit" : "Create a new "} borrower group for organizational purposes
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form autoFocus={false} onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <input
              autoFocus
              type="text"
              style={{
                position: 'absolute',
                left: '-9999px',
                width: '1px',
                height: '1px',
                opacity: 0,
                pointerEvents: 'none',
              }}
            />
            <FormField
              disabled={creationHandler.isPending || editingHandler.isPending}
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem autoFocus={false}>
                  <FormLabel className="text-base font-medium">
                    Group Code <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl autoFocus={false}>
                    <Input placeholder="Enter group code" {...field} autoFocus={false} className="h-12" />
                  </FormControl>
                  <p className="text-sm text-muted-foreground">A unique code to identify this borrower group</p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={creationHandler.isPending || editingHandler.isPending}
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">
                    Group Name <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl autoFocus={false}>
                    <Input autoFocus={false} placeholder="Enter group name" {...field} className="h-12" />
                  </FormControl>
                  <p className="text-sm text-muted-foreground">A descriptive name for this borrower group</p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button
                disabled={creationHandler.isPending || editingHandler.isPending}
                type="button"
                variant="outline"
                onClick={() => {
                  onCancel();
                  onOpenChange(false)
                  form.reset()
                }}
              >
                Cancel
              </Button>
              <Button
                disabled={creationHandler.isPending || editingHandler.isPending}
                type="submit" className="bg-blue-500 hover:bg-blue-600">
                {isEditing ? "Save" : "Add Group "} {(creationHandler.isPending || editingHandler.isPending) && <span><Loader2 className="animate-spin" /></span>}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
