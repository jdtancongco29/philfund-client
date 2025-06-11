"use client"

import type { Borrower } from "../Service/LoanPayOffTypes"

interface LoanPayOffUserDetailsPanelProps {
  selectedBorrower: Borrower | null
  onPrintLoanDisclosure: () => void
  onPrintPromissoryNote: () => void
  onPrintComakerStatement: () => void
  onProcessCheckVoucher: () => void
}

export function LoanPayOffUserDetailsPanel({ selectedBorrower }: LoanPayOffUserDetailsPanelProps) {
  return (
    <div className="w-80 bg-white border-l border-gray-200 p-6 hidden 2xl:block">
      <h2 className="text-lg font-semibold mb-4">User Details</h2>

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
    </div>
  )
}