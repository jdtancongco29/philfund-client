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

export function BlUserDetailsPanel({
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

                <div className="pt-4 border-t space">
                    <p className="text-sm text-gray-500 mb-2">Saved as Draft</p>

                    <div className="space-y-2">
                        <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => console.log('Print Bonus Loan Calculation')}>
                            <PrinterIcon className="h-4 w-4 mr-2" />
                            Print Bonus Loan Calculation
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => console.log('Print Bonus promissory note')}>
                            <PrinterIcon className="h-4 w-4 mr-2" />
                            Print Bonus promissory note
                        </Button>
                    </div>

                    <p className="text-sm text-gray-500 mt-4 mb-2">Processed</p>

                    <div className="space-y-2">
                        
                        <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => console.log('Bonus Promissory Note')}>
                            <PrinterIcon className="h-4 w-4 mr-2" />
                        Bonus Promissory Note
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => console.log('Loan Disclosure')}>
                            <PrinterIcon className="h-4 w-4 mr-2" />
                            Loan Disclosure
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => console.log('Bonus Check voucher')}>
                            <PrinterIcon className="h-4 w-4 mr-2" />
                            Bonus Check voucher
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}