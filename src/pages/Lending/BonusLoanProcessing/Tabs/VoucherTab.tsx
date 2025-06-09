"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import type { BonusLoan } from "../Service/BonusLoanProcessingTypes"
import { JournalEntryTable } from "@/components/journal-entry-table"

// Form schema for voucher
const voucherSchema = z.object({
  include_journal_entries: z.boolean(),
})

type VoucherFormValues = z.infer<typeof voucherSchema>

interface VoucherTabProps {
  currentBonusLoan: BonusLoan | null
  onReset: () => void
  onSaveAsDraft: () => void
  onProcess: () => void
}

export function VoucherTab({ currentBonusLoan, onReset, onSaveAsDraft, onProcess }: VoucherTabProps) {
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

  // Sample journal entries for bonus loan
  const journalEntries = [
    { id: "1", code: "2024-08-15", name: "Loan Receivable - Bonus Loan", debit: 22000, credit: null },
    { id: "2", code: "2024-08-15", name: "Interest Receivable - Bonus Loan", debit: 7077.31, credit: null },
    { id: "3", code: "2024-08-15", name: "Cash in Bank", debit: null, credit: 22000 },
    { id: "4", code: "2024-08-15", name: "Unearned Interest Income - Bonus", debit: null, credit: 7077.31 },
  ]

  return (
    <div className="flex flex-col h-full">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-4">
        <div className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {/* Check voucher */}
              <Card className="border-none shadow-none p-0">
                <CardContent className="px-6">
                  <h3 className="text-lg font-semibold mb-4">Check voucher</h3>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">For promissory note number</Label>
                      <div className="h-10 px-3 py-2 border rounded-md bg-gray-50">
                        {currentBonusLoan?.promissory_no || "PN-2024-08-001"}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Reference code</Label>
                      <div className="h-10 px-3 py-2 border rounded-md bg-gray-50">CV-2024-08-001</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Reference number</Label>
                      <div className="h-10 px-3 py-2 border rounded-md bg-gray-50">12345</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Name of borrower</Label>
                      <div className="h-10 px-3 py-2 border rounded-md bg-gray-50">Jane Doe</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Bank</Label>
                      <div className="h-10 px-3 py-2 border rounded-md bg-gray-50">Select...</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Check number</Label>
                      <div className="h-10 px-3 py-2 border rounded-md bg-gray-50">67890</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Amount on check</Label>
                      <div className="h-10 px-3 py-2 border rounded-md bg-gray-50">22,000.00</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Amount in words</Label>
                      <div className="h-10 px-3 py-2 border rounded-md bg-gray-50">Twenty-Two Thousand Only</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Interest rate</Label>
                      <div className="h-10 px-3 py-2 border rounded-md bg-gray-50">5%</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 mb-6">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Date granted and Cut-off date</Label>
                      <div className="h-10 px-3 py-2 border rounded-md bg-gray-50">11/20/2025 - 05/31/2026</div>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold mb-4">Journal Entries</h3>
                  <JournalEntryTable data={journalEntries} showTotals={true} />

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
        <Button onClick={onProcess} type="button" disabled={!currentBonusLoan}>
          Process
        </Button>
      </div>
    </div>
  )
}
