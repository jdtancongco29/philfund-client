// src/pages/Lending/LoanProcessing/Tabs/TransactionHistoryTab.tsx

"use client"

import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { AmortizationSchedule } from "../Service/SalaryLoanProcessingTypes"
import Loader from "@/components/loader"
import { useForm } from "react-hook-form"

interface TransactionHistoryTabProps {
  amortizationSchedule: AmortizationSchedule[] | null
  loading?: boolean
  onReset: () => void
  onSaveAsDraft: () => void
  onProcess: () => void
  currentLoan?: any // optional, or you can type it properly
  isLoading?: boolean
}

export function TransactionHistoryTab({
  amortizationSchedule,
  loading = false,
  onReset,
  // onSaveAsDraft,
  onProcess,
  currentLoan,
  isLoading = false,
}: TransactionHistoryTabProps) {
  // Setup react-hook-form (if you want to handle form)
  const form = useForm()

  // Dummy handleSubmit wrapper — replace with your real submit logic
  function handleSubmit(data: any) {
    // you can do something with form data here if needed
    // currently just placeholder
    console.log("Form submitted:", data)
  }

  if (loading) {
    return <Loader />
  }

  if (!amortizationSchedule || amortizationSchedule.length === 0) {
    return (
      <Loader />
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-4">
        <div className="space-y-6">
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
            noValidate
          >
            <Card className="border-none shadow-none p-0">
              <CardContent className="px-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Amortization</h3>
                  <div className="border rounded-lg overflow-hidden">
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
                            <TableCell>
                              {format(new Date(schedule.date), "yyyy-MM-dd")}
                            </TableCell>
                            <TableCell>
                              ₱{schedule.principal_amount_paid.toLocaleString()}
                            </TableCell>
                            <TableCell>
                              ₱{schedule.principal_interest_paid.toLocaleString()}
                            </TableCell>
                            <TableCell>
                              ₱{schedule.total_running_balance.toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div >
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>

      {/* Sticky Action Buttons */}
      <div className="border-t border-gray-200 bg-white p-4 pb-0 flex justify-end gap-2 flex-shrink-0">
        <Button variant="outline" onClick={onReset} type="button">
          Reset
        </Button>
        <Button
          variant="outline"
          onClick={() => form.handleSubmit(handleSubmit)()}
          type="button"
          disabled={isLoading}
        >
          Save as Draft
        </Button>
        <Button
          onClick={onProcess}
          type="button"
          disabled={isLoading || !currentLoan}
        >
          Process
        </Button>
      </div>
    </div>
  )
}