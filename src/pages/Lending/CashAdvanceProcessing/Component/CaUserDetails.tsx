// src/pages/Lending/LoanProcessing/Component/UserSearcPanel.tsx
"use client"

import { PrinterIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Borrower } from "../../LoanProcessing/Service/SalaryLoanProcessingTypes"

interface CaUserDetailsPanelProps {
    selectedBorrower: Borrower | null
    onPrintLoanDisclosure: () => void
    onPrintPromissoryNote: () => void
    onPrintComakerStatement: () => void
    onProcessCheckVoucher: () => void
}

export function CaUserDetailsPanel({
    selectedBorrower,
    //   onPrintLoanDisclosure,
    //   onPrintPromissoryNote,
    //   onPrintComakerStatement,
    //   onProcessCheckVoucher,
}: CaUserDetailsPanelProps) {
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
                    <p className="text-sm text-gray-500 mb-2">Salary Loan Processing</p>

                    <div className="space-y-2">
                        <Button variant="outline" size="sm" className="w-full justify-start whitespace-normal text-left p-1 h-full" onClick={() => console.log('Print CA Promissory Note')}>
                            <PrinterIcon className="h-4 w-4 mr-2" />
                            Print CA Promissory Note
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start whitespace-normal text-left p-1 h-full" onClick={() => console.log('Print CA with journal entries')}>
                            <PrinterIcon className="h-4 w-4 mr-2" />
                            Print CA with journal entries
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-start whitespace-normal text-left p-1 h-full"
                            onClick={() => console.log('Print Cash Voucher without Journal entries')}
                        >
                            <PrinterIcon className="h-4 w-4 mr-2 shrink-0" />
                            Print Cash Voucher without Journal entries
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}