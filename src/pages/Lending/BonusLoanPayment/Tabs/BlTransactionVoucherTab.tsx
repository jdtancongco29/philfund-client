    "use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Transaction } from "../Service/BonusLoanPaymentTypes"
import { JournalEntryTable } from "@/components/journal-entry-table"

interface BlTransactionVoucherTabProps {
  item: Transaction | null
  referenceCode: string
  setReferenceCode: (value: string) => void
  referenceNo: string
  setReferenceNo: (value: string) => void
}

export function BlTransactionVoucherTab({
//   item,
  referenceCode,
  setReferenceCode,
  referenceNo,
  setReferenceNo,
}: BlTransactionVoucherTabProps) {
  // Sample journal entries
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
      credit: 18200.0,
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
    <div className="space-y-6 pt-6">
      {/* Reference Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
            Reference Code <span className="text-red-500 ml-1">*</span>
          </label>
          <Select value={referenceCode} onValueChange={setReferenceCode}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="REF-001">REF-001</SelectItem>
              <SelectItem value="REF-002">REF-002</SelectItem>
              <SelectItem value="REF-003">REF-003</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
            Reference No. <span className="text-red-500 ml-1">*</span>
          </label>
          <Input
            placeholder="Enter reference no."
            value={referenceNo}
            onChange={(e) => setReferenceNo(e.target.value)}
          />
        </div>
      </div>

      {/* Journal Entries */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Journal Entries</h3>
        <JournalEntryTable data={journalEntries} showTotals={true}/>
      </div>
    </div>
  )
}
