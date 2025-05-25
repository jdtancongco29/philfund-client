"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import type { ApprovalRequest } from "./Service/ApprovalType"

const denySchema = z.object({
  reason: z.string().min(10, "Reason must be at least 10 characters long"),
})

type DenyFormValues = z.infer<typeof denySchema>

interface DenyApprovalDialogProps {
  item: ApprovalRequest | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (reason: string) => void
  isLoading?: boolean
}

export function ApprovalDialog({
//   item,
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
}: DenyApprovalDialogProps) {
  const form = useForm<DenyFormValues>({
    resolver: zodResolver(denySchema),
    defaultValues: {
      reason: "",
    },
  })

  const handleSubmit = (values: DenyFormValues) => {
    onConfirm(values.reason)
    form.reset()
  }

  const handleClose = () => {
    form.reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Deny Approval Request</DialogTitle>
          <p className="text-muted-foreground">
            Please provide a reason for denying this approval request. This information will be recorded and visible to
            the requester.
          </p>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">Reason for denial</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter the reason of denying the request..."
                      className="min-h-[120px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={handleClose} type="button" disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" variant="destructive" disabled={isLoading} className="bg-red-500 hover:bg-red-600">
                {isLoading ? "Submitting..." : "Submit Denial"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
