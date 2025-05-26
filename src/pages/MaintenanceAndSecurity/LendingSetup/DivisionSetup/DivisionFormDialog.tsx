"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { Division, CreateDivisionPayload, UpdateDivisionPayload } from "./Service/DivisionSetupTypes"
import { getBranchId } from "@/lib/api"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import DivisionSetupService from "./Service/DivisionSetupService"
import GroupSetupService from "../GroupSetup/Service/GroupSetupService"
import { Loader2 } from "lucide-react"
import { useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Define the form schema with validation
const formSchema = z.object({
  code: z.string().min(1, "Division code is required"),
  name: z.string().min(1, "Division name is required"),
  group_id: z.string().min(1, "Borrower group is required"),
})

// Define the form values type
type FormValues = z.infer<typeof formSchema>

// Define the component props
interface DivisionDialogFormProps {
  item: Division | null
  open: boolean
  isEditing: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: () => void
  onCancel: () => void
}

export function DivisionDialogForm({
  open,
  isEditing,
  item,
  onOpenChange,
  onCancel,
  onSubmit,
}: DivisionDialogFormProps) {
  const queryClient = useQueryClient()
  const editingHandler = useMutation({
    mutationFn: (newDivision: UpdateDivisionPayload) => {
      return DivisionSetupService.updateDivision(item!.id, newDivision)
    },
  })
  const creationHandler = useMutation({
    mutationFn: (newDivision: CreateDivisionPayload) => {
      return DivisionSetupService.createDivision(newDivision)
    },
  })

  // Fetch groups for the dropdown
  const { data: groupsData } = useQuery({
    queryKey: ["borrower-groups-for-division"],
    queryFn: () => GroupSetupService.getAllGroups(),
    staleTime: Number.POSITIVE_INFINITY,
  })

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      name: "",
      group_id: "",
    },
  })

  useEffect(() => {
    if (item) {
      form.reset({
        code: item.code,
        name: item.name,
        group_id: item.group.id,
      })
    } else {
      form.reset({
        code: "",
        name: "",
        group_id: "",
      })
    }
  }, [item, form])

  const create = async (branch_id: string, values: FormValues) => {
    const payload: CreateDivisionPayload = {
      code: values.code,
      name: values.name,
      branch_id: branch_id,
      group_id: values.group_id,
    }
    try {
      await creationHandler.mutateAsync(payload)
      queryClient.invalidateQueries({ queryKey: ["division-table"] })
      onSubmit()
      form.reset()
    } catch (errorData: any) {
      console.error(errorData)
    }
  }

  const update = async (branch_id: string, values: FormValues) => {
    const payload: UpdateDivisionPayload = {
      code: values.code,
      name: values.name,
      branch_id: branch_id,
      group_id: values.group_id,
    }
    try {
      await editingHandler.mutateAsync(payload)
      queryClient.invalidateQueries({ queryKey: ["division-table"] })
      onSubmit()
      form.reset()
    } catch (_error) {
      console.log(_error)
    }
  }

  // Handle form submission
  const onFormSubmit = (values: FormValues) => {
    const branch_id = getBranchId()
    if (branch_id) {
      if (isEditing) {
        update(branch_id, values)
      } else {
        create(branch_id, values)
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={(open) => {
      onOpenChange(open)
      if (!open) {
        form.reset()
      }
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{isEditing ? "Edit" : "Add New"} Division</DialogTitle>
          <DialogDescription className="text-base">
            {isEditing ? "Edit" : "Create a new"} division for a borrower group
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-4">
            <FormField
              disabled={creationHandler.isPending || editingHandler.isPending}
              control={form.control}
              name="group_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">
                    Borrower Group Code <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select
                    disabled={creationHandler.isPending || editingHandler.isPending}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="px-3 py-[9px] w-full">
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {groupsData?.data.groups.map((group) => (
                        <SelectItem key={group.id} value={group.id}>
                          {group.code || group.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              disabled={creationHandler.isPending || editingHandler.isPending}
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">
                    Division Code <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter division code" {...field} className="px-3 py-[9px]" />
                  </FormControl>
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
                    Division Name <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter division name" {...field} className="px-3 py-[9px]" />
                  </FormControl>
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
                  onCancel()
                  onOpenChange(false)
                  form.reset()
                }}
              >
                Cancel
              </Button>
              <Button
                disabled={creationHandler.isPending || editingHandler.isPending}
                type="submit"
                className="bg-blue-500 hover:bg-blue-600"
              >
                {isEditing ? "Edit" : "Add"} Division{" "}
                {(creationHandler.isPending || editingHandler.isPending) && (
                  <span>
                    <Loader2 className="animate-spin" />
                  </span>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
