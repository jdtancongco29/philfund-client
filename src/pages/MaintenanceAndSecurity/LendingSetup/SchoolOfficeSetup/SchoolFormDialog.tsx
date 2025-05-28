"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { School, CreateSchoolPayload, UpdateSchoolPayload } from "./Service/SchoolSetupTypes"
import { getBranchId } from "@/lib/api"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import SchoolSetupService from "./Service/SchoolSetupService"
import DivisionSetupService from "../DivisionSetup/Service/DivisionSetupService"
import DistrictSetupService from "../DistrictSetup/Service/DistrictSetupService"
import { Loader2, RefreshCw } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

// Define the form schema with validation
const formSchema = z.object({
  code: z.string().min(1, "School code is required"),
  name: z.string().min(1, "School name is required"),
  division_id: z.string().min(1, "Division is required"),
  district_id: z.string().min(1, "District is required"),
})

// Define the form values type
type FormValues = z.infer<typeof formSchema>

// Define the component props
interface SchoolFormDialogProps {
  item: School | null
  open: boolean
  isEditing: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: () => void
  onCancel: () => void
}

export function SchoolFormDialog({ open, isEditing, item, onOpenChange, onCancel, onSubmit }: SchoolFormDialogProps) {
  const queryClient = useQueryClient()
  const [selectedDivisionId, setSelectedDivisionId] = useState<string>("")
  const [isGeneratingCode, setIsGeneratingCode] = useState(false)

  const editingHandler = useMutation({
    mutationFn: (newSchool: UpdateSchoolPayload) => {
      return SchoolSetupService.updateSchool(item!.id, newSchool)
    },
  })
  const creationHandler = useMutation({
    mutationFn: (newSchool: CreateSchoolPayload) => {
      return SchoolSetupService.createSchool(newSchool)
    },
  })

  // Fetch divisions for the dropdown
  const { data: divisionsData } = useQuery({
    queryKey: ["divisions-for-school"],
    queryFn: () => DivisionSetupService.getAllDivisions(),
    staleTime: Number.POSITIVE_INFINITY,
  })

  // Fetch districts for the dropdown, filtered by division if selected
  const { data: districtsData } = useQuery({
    queryKey: ["districts-for-school", selectedDivisionId],
    queryFn: () => DistrictSetupService.getAllDistricts(),
    staleTime: Number.POSITIVE_INFINITY,
  })

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      name: "",
      division_id: "",
      district_id: "",
    },
  })

  useEffect(() => {
    if (item) {
      form.reset({
        code: item.code,
        name: item.name,
        division_id: item.division.id,
        district_id: item.district_id,
      })
      console.log(item.division.id);
      setSelectedDivisionId(item.division.id)
    } else {
      form.reset({
        code: "",
        name: "",
        division_id: "",
        district_id: "",
      })
      setSelectedDivisionId("")
    }
  }, [item, form])

  // Handle division change to filter districts
  const handleDivisionChange = (divisionId: string) => {
    setSelectedDivisionId(divisionId)
    form.setValue("division_id", divisionId)
    form.setValue("district_id", "")
  }

  const create = async (branch_id: string, values: FormValues) => {
    const payload: CreateSchoolPayload = {
      code: values.code,
      name: values.name,
      branch_id: branch_id,
      division_id: values.division_id,
      district_id: values.district_id,
    }
    try {
      await creationHandler.mutateAsync(payload)
      queryClient.invalidateQueries({ queryKey: ["school-table"] })
      onSubmit()
      form.reset()
    } catch (errorData: unknown) {
      console.error(errorData)
    }
  }

  const update = async (branch_id: string, values: FormValues) => {
    const payload: UpdateSchoolPayload = {
      code: values.code,
      name: values.name,
      branch_id: branch_id,
      division_id: values.division_id,
      district_id: values.district_id,
    }
    try {
      await editingHandler.mutateAsync(payload)
      queryClient.invalidateQueries({ queryKey: ["school-table"] })
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

  // Generate school code
  const generateSchoolCode = useCallback(async () => {
    setIsGeneratingCode(true)
    try {
      const response = await SchoolSetupService.generateSchoolCode()
      console.log(response);
      if (response.data) {
        form.setValue("code", response.data.toString())
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to generate school code")
    } finally {
      setIsGeneratingCode(false)
    }
  }, [form])

  useEffect(() => {
    if (form.watch('code') == "") {
      generateSchoolCode();
    }
  }, [form, generateSchoolCode, open])

  // Filter districts by selected division
  const filteredDistricts = districtsData?.data.districts.filter(
    (district) => {
      return !selectedDivisionId || district.division.id === selectedDivisionId
    },
  )

  return (
    <Dialog open={open} onOpenChange={(open) => {
      onOpenChange(open)
      if (!open) {
        form.reset()
      }
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{isEditing ? "Edit" : "Add New"} School</DialogTitle>
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
                    Division Code <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select
                    disabled={creationHandler.isPending || editingHandler.isPending}
                    onValueChange={(value) => handleDivisionChange(value)}
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
              disabled={creationHandler.isPending || editingHandler.isPending || !selectedDivisionId}
              control={form.control}
              name="district_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">
                    District Code <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select
                    disabled={creationHandler.isPending || editingHandler.isPending || !selectedDivisionId}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="px-3 py-[9px] w-full">
                        <SelectValue placeholder={selectedDivisionId ? "Select..." : "Select a division first"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {filteredDistricts?.map((district) => (
                        <SelectItem key={district.id} value={district.id}>
                          {district.code || district.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              disabled={creationHandler.isPending || editingHandler.isPending || isEditing}
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">
                    School Code <span className="text-destructive">*</span>
                  </FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input placeholder="Enter school code" {...field} disabled className="px-3 py-[9px]" />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={generateSchoolCode}
                      disabled={isGeneratingCode || creationHandler.isPending || editingHandler.isPending || isEditing}
                    >
                      {isGeneratingCode ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
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
                    School Name <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter school name" {...field} className="px-3 py-[9px]" />
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
                {isEditing ? "Edit" : "Add"} School{" "}
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
