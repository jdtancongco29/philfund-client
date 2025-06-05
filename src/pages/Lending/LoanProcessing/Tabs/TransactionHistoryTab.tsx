"use client"

import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { AmortizationSchedule } from "../Service/SalaryLoanProcessingTypes"

interface TransactionHistoryTabProps {
  amortizationSchedule: AmortizationSchedule[] | null
  onReset: () => void
  onSaveAsDraft: () => void
  onProcess: () => void
}

export function TransactionHistoryTab({
  amortizationSchedule,
  onReset,
  onSaveAsDraft,
  onProcess,
}: TransactionHistoryTabProps) {
  if (!amortizationSchedule || amortizationSchedule.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No transaction history available. Please complete the loan computation first.</p>
      </div>
    )
  }

  return (
    <Card className="border-none shadow-none p-0">
      <CardContent className="px-6">
        <div>
            <h3 className="text-lg font-semibold mb-4">Amortization</h3>

            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Principal Amount Paid</TableHead>
                <TableHead>Principal Interest Paid</TableHead>
                <TableHead>Total Running Balance</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {amortizationSchedule.map((schedule) => (
                <TableRow key={schedule.id}>
                    <TableCell>{format(new Date(schedule.date), "yyyy-MM-dd")}</TableCell>
                    <TableCell>₱{schedule.principal_amount_paid.toLocaleString()}</TableCell>
                    <TableCell>₱{schedule.principal_interest_paid.toLocaleString()}</TableCell>
                    <TableCell>₱{schedule.total_running_balance.toLocaleString()}</TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </div>

        <div className="flex justify-end gap-2 mt-6 p-6">
          <Button variant="outline" onClick={onReset}>
            Reset
          </Button>
          <Button variant="outline" onClick={onSaveAsDraft}>
            Save as Draft
          </Button>
          <Button onClick={onProcess}>Process</Button>
        </div>
      </CardContent>
    </Card>
  )
}
