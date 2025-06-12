"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { JournalEntryTable } from "@/components/journal-entry-table"
import type { LoanPayOff } from "../Service/LoanPayOffTypes"

interface VoucherTabProps {
  currentLoanPayOff: LoanPayOff | null
  onReset: () => void
  onSaveAsDraft: () => void
  onProcess: () => void
}

export function VoucherTab({ currentLoanPayOff, onReset, onSaveAsDraft, onProcess }: VoucherTabProps) {
  // Sample journal entries for voucher
  const journalEntries = [
    {
      id: "1",
      code: "2024-08-15",
      name: "Cash in Bank",
      debit: 181500.0,
      credit: null,
    },
    {
      id: "2",
      code: "2024-08-15",
      name: "Salary Loans Receivable",
      debit: null,
      credit: 181200.0,
    },
    {
      id: "3",
      code: "2024-08-15",
      name: "Unearned Interest Income",
      debit: null,
      credit: null,
    },
  ]

  return (
    <div className="flex flex-col h-full">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-4">
        <div className="space-y-6">
          {/* Voucher Journal Entries */}
          <Card className="border-none shadow-none p-0">
            <CardContent className="px-6">
              <JournalEntryTable data={journalEntries} showTotals={true} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Sticky Action Buttons */}
      <div className="border-t border-gray-200 bg-white p-4 pb-0 flex justify-end gap-2 flex-shrink-0">
        <Button variant="outline" onClick={onReset} type="button">
          Reset
        </Button>
        <Button variant="outline" onClick={onSaveAsDraft} type="button">
          Save as Draft
        </Button>
        <Button onClick={onProcess} type="button" disabled={!currentLoanPayOff}>
          Process
        </Button>
      </div>
    </div>
  )
}
