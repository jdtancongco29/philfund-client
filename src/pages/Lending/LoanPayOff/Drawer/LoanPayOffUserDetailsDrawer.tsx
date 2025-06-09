"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import type { Borrower } from "../Service/LoanPayOffTypes"

interface LoanPayOffUserDetailsDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedBorrower: Borrower | null
  onPrintLoanDisclosure: () => void
  onPrintPromissoryNote: () => void
  onPrintComakerStatement: () => void
  onProcessCheckVoucher: () => void
}

export function LoanPayOffUserDetailsDrawer({
  open,
  onOpenChange,
  selectedBorrower,
}: LoanPayOffUserDetailsDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-80 sm:max-w-[320px] p-4 overflow-y-auto">
        <SheetHeader className="p-0">
          <SheetTitle className="text-2xl font-semibold">User Details</SheetTitle>
        </SheetHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-500">Name</label>
            <p className="font-medium">{selectedBorrower?.name || "Juan dela Cruz"}</p>
          </div>

          <div>
            <label className="text-sm text-gray-500">Address</label>
            <p className="text-sm">{selectedBorrower?.address || "123 Main St, Anytown, USA"}</p>
          </div>

          <div>
            <label className="text-sm text-gray-500">Phone number</label>
            <p className="text-sm">{selectedBorrower?.phone || "09123456789"}</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
