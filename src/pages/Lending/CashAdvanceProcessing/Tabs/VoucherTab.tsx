"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import type { CashAdvance } from "../Service/CashAdvanceProcessingTypes"
import { JournalEntryTable } from "../Components/JournalEntryTable"

// Form schema for voucher
const voucherSchema = z.object({
  include_journal_entries: z.boolean(),
})

type VoucherFormValues = z.infer<typeof voucherSchema>

interface VoucherTabProps {
  currentCashAdvance: CashAdvance | null
  onReset: () => void
  onSaveAsDraft: () => void
  onProcess: () => void
}

export function VoucherTab({ currentCashAdvance, onReset, onSaveAsDraft, onProcess }: VoucherTabProps) {
  // Initialize form
  const form = useForm<VoucherFormValues>({
    resolver: zodResolver(voucherSchema),
    defaultValues: {
      include_journal_entries: false,
    },
  })

  const handleSubmit = (values: VoucherFormValues) => {
    console.log(values)
    onSaveAsDraft()
  }

  return (
    <div className="flex flex-col h-full">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-4">
        <div className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {/* Voucher Details */}
              <Card className="border-none shadow-none p-0">
                <CardContent className="px-6">
                  <h3 className="text-lg font-semibold mb-4">Borrower Information</h3>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Reference Code</Label>
                      <div className="h-10 px-3 py-2 border rounded-md bg-gray-50">
                        {currentCashAdvance?.reference_code || "CA-2024-001"}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Reference Number</Label>
                      <div className="h-10 px-3 py-2 border rounded-md bg-gray-50">
                        {currentCashAdvance?.reference_number || "12345"}
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold mb-4">Journal Entry</h3>
                  <JournalEntryTable data={currentCashAdvance?.journal_entries || []} showTotals={true} />

                  <div className="mt-6 flex items-center space-x-2">
                    <Checkbox id="include-journal" />
                    <Label htmlFor="include-journal">Include journal entries in printing</Label>
                  </div>
                </CardContent>
              </Card>
            </form>
          </Form>
        </div>
      </div>

      {/* Sticky Action Buttons */}
      <div className="border-t border-gray-200 bg-white p-4 pb-0 flex justify-end gap-2 flex-shrink-0">
        <Button variant="outline" onClick={onReset} type="button">
          Reset
        </Button>
        <Button variant="outline" onClick={() => form.handleSubmit(handleSubmit)()} type="button">
          Save as Draft
        </Button>
        <Button onClick={onProcess} type="button" disabled={!currentCashAdvance}>
          Process
        </Button>
      </div>
    </div>
  )
}
