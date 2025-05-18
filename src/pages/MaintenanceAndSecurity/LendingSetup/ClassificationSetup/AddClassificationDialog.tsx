"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

// Define the form schema with validation
const formSchema = z.object({
  group: z.string().min(1, "Borrower group code is required"),
  code: z.string().min(1, "Classification code is required"),
  name: z.string().min(1, "Classification name is required"),
  restructureEligibility: z.boolean(),
  bonusLoanEligibility: z.boolean(),
})

// Define the form values type
type FormValues = z.infer<typeof formSchema>

// Define the component props
interface AddClassificationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: FormValues) => void
  borrowerGroups: { label: string; value: string }[]
}

export function AddClassificationDialog({
  open,
  onOpenChange,
  onSubmit,
  borrowerGroups,
}: AddClassificationDialogProps) {
  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      group: "",
      code: "",
      name: "",
      restructureEligibility: false,
      bonusLoanEligibility: false,
    },
  })

  // Handle form submission
  const handleSubmit = (values: FormValues) => {
    console.log(values);
    onSubmit(values)
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Add New Classification</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="group"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">
                    Borrower Group Code <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12 w-full">
                        <SelectValue placeholder="Select group code" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {borrowerGroups.map((group) => (
                        <SelectItem key={group.value} value={group.value}>
                          {group.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Select a group to determine where this classification belongs</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
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
                  <FormDescription>A unique code to identify this classification</FormDescription>
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
                    Classification Name <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter classification name" {...field} className="h-12" />
                  </FormControl>
                  <FormDescription>A descriptive name for this classification</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <h3 className="text-lg font-medium mb-4">Eligibility Rules</h3>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="restructureEligibility"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <div className="flex-1 space-y-1">
                        <FormLabel className="text-base font-medium">Not qualified for Reloan</FormLabel>
                        <FormDescription>
                          If checked, borrowers with this classification will not be allowed to restructure their loans
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bonusLoanEligibility"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <div className="flex-1 space-y-1">
                        <FormLabel className="text-base font-medium">Allow 3 months grace period</FormLabel>
                        <FormDescription>
                          If checked, borrowers with this classification will not be allowed to restructure their loans
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

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
                Add Classification
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}