"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { District, CreateDistrictPayload, UpdateDistrictPayload } from "./Service/DistrictSetupTypes"
import { getBranchId } from "@/lib/api"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import DistrictSetupService from "./Service/DistrictSetupService"
import DivisionSetupService from "../DivisionSetup/Service/DivisionSetupService"
import { Loader2 } from "lucide-react"
import { useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Define the form schema with validation
const formSchema = z.object({
  code: z.string().min(1, "District code is required"),
  name: z.string().min(1, "District name is required"),
  division_id: z.string().min(1, "Division is required"),
})

// Define the form values type
type FormValues = z.infer<typeof formSchema>

// Define the component props
interface DistrictDialogFormProps {
  item: District | null
  open: boolean
  isEditing: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: () => void
  onCancel: () => void
}

export function DistrictDialogForm({
  open,
  isEditing,
  item,
  onOpenChange,
  onCancel,
  onSubmit,
}: DistrictDialogFormProps) {
  const queryClient = useQueryClient()
  const editingHandler = useMutation({
    mutationFn: (newDistrict: UpdateDistrictPayload) => {
      return DistrictSetupService.updateDistrict(item!.id, newDistrict)
    },
  })
  const creationHandler = useMutation({
    mutationFn: (newDistrict: CreateDistrictPayload) => {
      return DistrictSetupService.createDistrict(newDistrict)
    },
  })

  // Fetch divisions for the dropdown
  const { data: divisionsData } = useQuery({
    queryKey: ["divisions-for-district"],
    queryFn: () => DivisionSetupService.getAllDivisions(),
    staleTime: Number.POSITIVE_INFINITY,
  })

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      name: "",
      division_id: "",
    },
  })

  useEffect(() => {
    if (item) {
      form.reset({
        code: item.code,
        name: item.name,
        division_id: item.division.id,
      })
    } else {
      form.reset({
        code: "",
        name: "",
        division_id: "",
      })
    }
  }, [item, form])

  const create = async (branch_id: string, values: FormValues) => {
    const payload: CreateDistrictPayload = {
      code: values.code,
      name: values.name,
      branch_id: branch_id,
      division_id: values.division_id,
    }
    try {
      await creationHandler.mutateAsync(payload)
      queryClient.invalidateQueries({ queryKey: ["district-table"] })
      onSubmit()
      form.reset()
    } catch (errorData: any) {
      console.error(errorData)
    }
  }

  const update = async (branch_id: string, values: FormValues) => {
    const payload: UpdateDistrictPayload = {
      code: values.code,
      name: values.name,
      branch_id: branch_id,
      division_id: values.division_id,
    }
    try {
      await editingHandler.mutateAsync(payload)
      queryClient.invalidateQueries({ queryKey: ["district-table"] })
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{isEditing ? "Edit" : "Add New"} District</DialogTitle>
          <DialogDescription className="text-base">
            {isEditing ? "Edit" : "Create a new"} district within a borrower division
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-4">
            <FormField
              disabled={creationHandler.isPending || editingHandler.isPending}
              control={form.control}
              name="division_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">
                    Borrower Division Code <span className="text-destructive">*</span>
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
                      {divisionsData?.data.division.map((division) => (
                        <SelectItem key={division.id} value={division.id}>
                          {division.code || division.name}
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
                    District Code <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter district code" {...field} className="px-3 py-[9px]" />
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
                    District Name <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter district name" {...field} className="px-3 py-[9px]" />
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
                {isEditing ? "Edit" : "Add"} District{" "}
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
