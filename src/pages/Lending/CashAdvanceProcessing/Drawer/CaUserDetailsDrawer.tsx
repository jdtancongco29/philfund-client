// src/pages/Lending/LoanProcessing/Drawer/UserDetailsDrawer.tsx
"use client"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import type { Borrower } from "../../LoanProcessing/Service/SalaryLoanProcessingTypes"
import { PrinterIcon } from "lucide-react"

interface CaUserDetailsDrawerProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    selectedBorrower: Borrower | null
    onPrintLoanDisclosure: () => void
    onPrintPromissoryNote: () => void
    onPrintComakerStatement: () => void
    onProcessCheckVoucher: () => void
}

export function CaUserDetailsDrawer({
    open,
    onOpenChange,
    selectedBorrower,
    onPrintLoanDisclosure,
    onPrintPromissoryNote,
    onPrintComakerStatement,
    onProcessCheckVoucher,
}: CaUserDetailsDrawerProps) {

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

                    <div className="pt-4 border-t">
                        <p className="text-sm text-gray-500 mb-2">Salary Loan Processing</p>

                        <div className="space-y-2 flex flex-col">
                            <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => console.log('Print CA Promissory Note')}>
                                <PrinterIcon className="h-4 w-4 mr-2" />
                                Print CA Promissory Note
                            </Button>
                            <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => console.log('Print CA with journal entries')}>
                                <PrinterIcon className="h-4 w-4 mr-2" />
                                Print CA with journal entries
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full justify-start whitespace-normal text-left"
                                onClick={() => console.log('Print Cash Voucher without Journal entries')}
                                >
                                <PrinterIcon className="h-4 w-4 mr-2 shrink-0" />
                                Print Cash Voucher without Journal entries
                            </Button>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}
