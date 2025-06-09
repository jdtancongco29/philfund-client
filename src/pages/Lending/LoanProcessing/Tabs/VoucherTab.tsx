// src/pages/Lending/LoanProcessing/Tabs/VoucherTab.tsx


"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Form } from "@/components/ui/form"
import type { CheckVoucher, Bank } from "../Service/SalaryLoanProcessingTypes"
import Loader from "@/components/loader"
import { JournalEntryTable } from "@/components/journal-entry-table"

interface VoucherTabProps {
  voucherData: CheckVoucher | null
  banks: Bank[]
  onReset: () => void
  onSaveAsDraft: () => void
  onProcess: () => void
}

export function VoucherTab({ voucherData, banks, onReset, onSaveAsDraft, onProcess }: VoucherTabProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [currentLoan, _setCurrentLoan] = useState(voucherData)

  const form = useForm()
  const handleSubmit = () => {
    setIsLoading(true)
    setTimeout(() => {
      onSaveAsDraft()
      setIsLoading(false)
    }, 1000) // simulate async save
  }

  if (!voucherData) {
    return (
      <Loader />
    )
  }

  // const totalDebit = voucherData.journal_entries.reduce((sum, entry) => sum + (entry.debit || 0), 0)
  // const totalCredit = voucherData.journal_entries.reduce((sum, entry) => sum + (entry.credit || 0), 0)

  return (
    <div className="flex flex-col h-full">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-4">
        <div className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <Card className="border-none shadow-none p-0">
                <CardContent className="px-6">
                  <h3 className="text-lg font-semibold mb-4">Check voucher</h3>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div>
                      <label className="text-sm font-medium mb-2 block">For promissory note number</label>
                      <Input value={voucherData.promissory_note_number} disabled className="bg-gray-50" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Reference code <span className="text-red-500">*</span></label>
                      <Input value={voucherData.reference_code} disabled className="bg-gray-50" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Reference number <span className="text-red-500">*</span></label>
                      <Input value={voucherData.reference_number} disabled className="bg-gray-50" />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Name of borrower</label>
                      <Input value={voucherData.borrower_name} disabled className="bg-gray-50" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Bank <span className="text-red-500">*</span></label>
                      <Select value={voucherData.bank} disabled>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {banks.map((bank) => (
                            <SelectItem key={bank.id} value={bank.name}>
                              {bank.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Check number <span className="text-red-500">*</span></label>
                      <Input value={voucherData.check_number} disabled className="bg-gray-50" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Amount on check</label>
                      <Input value={`₱${voucherData.amount_on_check.toLocaleString()}`} disabled className="bg-gray-50" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Amount in words <span className="text-red-500">*</span></label>
                      <Input value={voucherData.amount_in_words} disabled className="bg-gray-50" />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Monthly amortization amount</label>
                      <Input value={`₱${voucherData.monthly_amortization_amount.toLocaleString()}`} disabled className="bg-gray-50" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Interest rate</label>
                      <Input value={`${voucherData.interest_rate}%`} disabled className="bg-gray-50" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Installment Period</label>
                      <Input value={voucherData.installment_period} disabled className="bg-gray-50" />
                    </div>
                  </div>

                  <h4 className="text-md font-semibold mb-4">Journal Entries</h4>
                  {/* <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Code</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Debit</TableHead>
                        <TableHead>Credit</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {voucherData.journal_entries.map((entry) => (
                        <TableRow key={entry.id}>
                          <TableCell>{entry.code}</TableCell>
                          <TableCell>{entry.name}</TableCell>
                          <TableCell>{entry.debit ? `₱${entry.debit.toLocaleString()}` : "-"}</TableCell>
                          <TableCell>{entry.credit ? `₱${entry.credit.toLocaleString()}` : "-"}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="font-semibold">
                        <TableCell colSpan={2}>Total</TableCell>
                        <TableCell>₱{totalDebit.toLocaleString()}</TableCell>
                        <TableCell>₱{totalCredit.toLocaleString()}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table> */}
                  <JournalEntryTable data={voucherData?.journal_entries || []} showTotals={true} />

                  <div className="mt-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="include-journal" checked={voucherData.include_journal_entries_in_printing} disabled />
                      <label htmlFor="include-journal" className="text-sm">
                        Include journal entries in printing
                      </label>
                    </div>
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
        <Button variant="outline" onClick={() => form.handleSubmit(handleSubmit)()} type="button" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save as Draft"}
        </Button>
        <Button onClick={onProcess} type="button" disabled={isLoading || !currentLoan}>
          {isLoading ? "Processing..." : "Process"}
        </Button>
      </div>
    </div>
  )
}
