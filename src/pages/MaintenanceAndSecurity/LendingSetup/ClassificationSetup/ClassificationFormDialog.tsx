"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type {
  BorrowerClassification,
  CreateClassificationPayload,
  UpdateClassificationPayload,
} from "./Service/ClassificationSetupTypes"
import { getBranchId } from "@/lib/api"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import ClassificationSetupService from "./Service/ClassificationSetupService"
import GroupSetupService from "../GroupSetup/Service/GroupSetupService"
import { Loader2 } from "lucide-react"
import { useEffect } from "react"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Define the form schema with validation
const formSchema = z.object({
  code: z.string().min(1, "Classification code is required"),
  name: z.string().min(1, "Classification name is required"),
  bonus_loan_eligible: z.boolean(),
  qualified_for_restructure: z.boolean(),
  eligible_for_bonus_loan: z.boolean(),
  allow_3mo_grace: z.boolean(),
  group_id: z.string().min(1, "Group is required"),
})

// Define the form values type
type FormValues = z.infer<typeof formSchema>

// Define the component props
interface AddClassificationDialogProps {
  item: BorrowerClassification | null
  open: boolean
  isEditing: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: () => void
  onCancel: () => void
}

export function ClassificationDialogForm({
  open,
  isEditing,
  item,
  onOpenChange,
  onCancel,
  onSubmit,
}: AddClassificationDialogProps) {
  const queryClient = useQueryClient()
  const editingHandler = useMutation({
    mutationFn: (newClassification: UpdateClassificationPayload) => {
      return ClassificationSetupService.updateClassification(item!.id, newClassification)
    },
  })
  const creationHandler = useMutation({
    mutationFn: (newClassification: CreateClassificationPayload) => {
      return ClassificationSetupService.createClassification(newClassification)
    },
  })

  // Fetch groups for the dropdown
  const { data: groupsData } = useQuery({
    queryKey: ["borrower-groups-for-classification"],
    queryFn: () => GroupSetupService.getAllGroups(),
    staleTime: Number.POSITIVE_INFINITY,
  })

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      name: "",
      bonus_loan_eligible: false,
      qualified_for_restructure: false,
      allow_3mo_grace: false,
      group_id: "",
    },
  })

  console.log(item);

  useEffect(() => {
    if (item) {
      form.reset({
        code: item.code,
        name: item.group.id,
        bonus_loan_eligible: item.bonus_loan_eligible,
        qualified_for_restructure: item.qualified_for_restructure || false,
        eligible_for_bonus_loan: item.eligible_for_bonus_loan || false,
        allow_3mo_grace: item.allow_3mo_grace || false,
        group_id: item.group.id,
      })
    } else {
      form.reset({
        code: "",
        name: "",
        bonus_loan_eligible: false,
        qualified_for_restructure: false,
        allow_3mo_grace: false,
        group_id: "",
      })
    }
  }, [item, form])

  const create = async (branch_id: string, values: FormValues) => {
    const payload: CreateClassificationPayload = {
      code: values.code,
      name: values.name,
      qualified_for_restructure: values.qualified_for_restructure ? 1 : 0,
      bonus_loan_eligible: values.bonus_loan_eligible ? 1 : 0,
      allow_3mo_grace: values.allow_3mo_grace ? 1 : 0,
      branch_id: branch_id,
      group_id: values.group_id,
    }
    try {
      await creationHandler.mutateAsync(payload)
      queryClient.invalidateQueries({ queryKey: ["borrower-classification-table"] })
      onSubmit()
      form.reset()
    } catch (errorData: any) {
      console.error(errorData)
    }
  }

  const update = async (branch_id: string, values: FormValues) => {
    const payload: UpdateClassificationPayload = {
      code: values.code,
      name: values.name,
      qualified_for_restructure: values.qualified_for_restructure ? 1 : 0,
      bonus_loan_eligible: values.bonus_loan_eligible ? 1 : 0,
      allow_3mo_grace: values.allow_3mo_grace ? 1 : 0,
      branch_id: branch_id,
      group_id: values.group_id,
    }
    try {
      await editingHandler.mutateAsync(payload)
      queryClient.invalidateQueries({ queryKey: ["borrower-classification-table"] })
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-3/4 overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{isEditing ? "Edit" : "Add New"} Classification</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-6">
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
                      <SelectTrigger className="h-12 w-full">
                        <SelectValue placeholder="Select group code" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {groupsData?.data.groups.map((group) => (
                        <SelectItem key={group.id} value={group.id}>
                          {group.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Select a group to determine where this classification belongs
                  </p>
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
                    Classification Code <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter classification code" {...field} className="h-12" />
                  </FormControl>
                  <p className="text-sm text-muted-foreground">A unique code to identify this classification</p>
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
                    Classification Name <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter classification name" {...field} className="h-12" />
                  </FormControl>
                  <p className="text-sm text-muted-foreground">A descriptive name for this classification</p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Eligibility Rules</h3>

              <FormField
                disabled={creationHandler.isPending || editingHandler.isPending}
                control={form.control}
                name="qualified_for_restructure"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Not qualified for Reloan</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        If checked, borrowers with this classification will not be allowed to reloan
                      </p>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                disabled={creationHandler.isPending || editingHandler.isPending}
                control={form.control}
                name="bonus_loan_eligible"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Eligible for Bonus Loan</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        If checked, borrowers with this classification will be eligible for bonus loans
                      </p>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                disabled={creationHandler.isPending || editingHandler.isPending}
                control={form.control}
                name="allow_3mo_grace"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Allow 3 months grace period</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        If checked, borrowers with this classification will be allowed a 3-month grace period
                      </p>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

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
                {isEditing ? "Edit" : "Add"} Classification{" "}
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
