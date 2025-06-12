"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { PrinterIcon } from "lucide-react"
import type { ChangeVoucherEntry } from "../Service/ChangeVoucherTypes"
import { JournalEntryTable } from "@/components/journal-entry-table"
import { DataTableV2 } from "@/components/data-table/data-table-v2"

const changeVoucherSchema = z.object({
  reference_code: z.string().min(1, "Reference code is required"),
  reference_no: z.string().min(1, "Reference number is required"),
  transaction_date: z.string().min(1, "Transaction date is required"),
  change_voucher_number: z.string().min(1, "Change voucher number is required"),
  borrower_name: z.string().min(1, "Borrower name is required"),
})

type ChangeVoucherFormValues = z.infer<typeof changeVoucherSchema>

interface ChangeVoucherDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  entry: ChangeVoucherEntry | null
  onSave: (entryData: ChangeVoucherFormValues) => void
  isLoading: boolean
}

export function ChangeVoucherDialog({ open, onOpenChange, entry, onSave, isLoading }: ChangeVoucherDialogProps) {
  const form = useForm<ChangeVoucherFormValues>({
    resolver: zodResolver(changeVoucherSchema),
    defaultValues: {
      reference_code: entry?.reference_code || "",
      reference_no: entry?.reference_no || "",
      transaction_date: entry?.transaction_date || "April 14, 2025",
      change_voucher_number: entry?.change_voucher_number || "",
      borrower_name: entry?.borrower_name || "",
    },
  })

  // Sample data for the tables
  const summaryData = [
    {
      id: "1",
      reference: "CA 44344-34536",
      loan_type: "Cash in Bank",
      amount_paid: 181500.0,
      total_payable: 181500.0,
      change: 120000.0,
    },
    {
      id: "2",
      reference: "CA 44344-34536",
      loan_type: "Cash in Bank",
      amount_paid: 21500.0,
      total_payable: 0,
      change: 0,
    },
    {
      id: "3",
      reference: "CA 44344-34536",
      loan_type: "Cash in Bank",
      amount_paid: 21500.0,
      total_payable: 0,
      change: 0,
    },
    {
      id: "4",
      reference: "CA 44344-34536",
      loan_type: "Cash in Bank",
      amount_paid: 21500.0,
      total_payable: 0,
      change: 0,
    },
  ]

  const journalEntries = [
    { id: "1", code: "2024-08-15", name: "Cash in Bank", debit: 181500.0, credit: null },
    { id: "2", code: "2024-08-15", name: "Salary Loans Receivable", debit: null, credit: 18200.0 },
    { id: "3", code: "2024-08-15", name: "Unearned Interest Income", debit: null, credit: null },
  ]

  const handleSubmit = (values: ChangeVoucherFormValues) => {
    onSave(values)
  }

  const handleClose = () => {
    form.reset()
    onOpenChange(false)
  }

  const handlePrint = () => {
    // Implement print functionality
    console.log("Printing change voucher...")
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-bold">Change voucher</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="reference_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Reference Code <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="CHG-2024-001">CHG-2024-001</SelectItem>
                        <SelectItem value="CHG-2024-002">CHG-2024-002</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reference_no"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Reference No. <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter reference no." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Transaction date</label>
                <Input value="April 14, 2025" disabled className="bg-gray-50" />
              </div>
              <FormField
                control={form.control}
                name="change_voucher_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Change voucher number <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="CV-001">CV-001</SelectItem>
                        <SelectItem value="CV-002">CV-002</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="borrower_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Borrower's Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="jane-doe">Jane Doe</SelectItem>
                        <SelectItem value="john-smith">John Smith</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Summary Table */}
            <div className="space-y-4">
              <DataTableV2
                title="Change Voucher Summary"
                data={summaryData}
                columns={[
                  {
                    id: "reference",
                    header: "Reference",
                    accessorKey: "reference",
                    enableSorting: false,
                  },
                  {
                    id: "loan_type",
                    header: "Loan Type",
                    accessorKey: "loan_type",
                    enableSorting: false,
                  },
                  {
                    id: "amount_paid",
                    header: "Amount paid",
                    accessorKey: "amount_paid",
                    enableSorting: false,
                    cell: (item) => `₱${item.amount_paid.toLocaleString()}`,
                  },
                  {
                    id: "total_payable",
                    header: "Total payable",
                    accessorKey: "total_payable",
                    enableSorting: false,
                    cell: (item) => (item.total_payable > 0 ? `₱${item.total_payable.toLocaleString()}` : "-"),
                  },
                  {
                    id: "change",
                    header: "Change",
                    accessorKey: "change",
                    enableSorting: false,
                    cell: (item) => (item.change > 0 ? `₱${item.change.toLocaleString()}` : "-"),
                  },
                ]}
                enableNew={false}
                enablePdfExport={false}
                enableCsvExport={false}
                enableFilter={false}
                enableSelection={false}
                totalCount={summaryData.length}
                pageNumber={1}
                perPage={10}
              />
            </div>

            {/* Journal Entries */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Journal Entries</h3>
              <JournalEntryTable data={journalEntries} showTotals={true} />
            </div>

            <div className="flex justify-end items-center pt-4">
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleClose} type="button">
                  Cancel
                </Button>
                <Button variant="outline" onClick={handlePrint} type="button">
                  <PrinterIcon className="h-4 w-4 mr-2" />
                  Print
                </Button>
                <Button className="bg-[#2B7FFF] " type="submit" disabled={isLoading}>
                  Save
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}