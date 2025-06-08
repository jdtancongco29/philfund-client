// src/pages/Lending/LoanProcessing/Component/UserSearcPanel.tsx
"use client"

import { PrinterIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Borrower } from "../Service/SalaryLoanProcessingTypes"

interface UserDetailsPanelProps {
  selectedBorrower: Borrower | null
  onPrintLoanDisclosure: () => void
  onPrintPromissoryNote: () => void
  onPrintComakerStatement: () => void
  onProcessCheckVoucher: () => void
}

export function UserDetailsPanel({
  selectedBorrower,
  onPrintLoanDisclosure,
  onPrintPromissoryNote,
  onPrintComakerStatement,
  onProcessCheckVoucher,
}: UserDetailsPanelProps) {
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

        <div className="pt-4 border-t">
          <p className="text-sm text-gray-500 mb-2">Saved as Draft</p>

          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start" onClick={onPrintPromissoryNote}>
              <PrinterIcon className="h-4 w-4 mr-2" />
              Promissory Note
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start" onClick={onPrintComakerStatement}>
              <PrinterIcon className="h-4 w-4 mr-2" />
              Comaker Statement
            </Button>
          </div>

          <p className="text-sm text-gray-500 mt-4 mb-2">Processed</p>

          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start" onClick={onPrintLoanDisclosure}>
              <PrinterIcon className="h-4 w-4 mr-2" />
              Print Loan Disclosure Statement
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start" onClick={onPrintPromissoryNote}>
              <PrinterIcon className="h-4 w-4 mr-2" />
              Print Promissory Note
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start" onClick={onPrintComakerStatement}>
              <PrinterIcon className="h-4 w-4 mr-2" />
              Print Comaker's Statement
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start" onClick={onProcessCheckVoucher}>
              Process Check Voucher
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}