"use client"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Borrower } from "../Service/SalaryLoanProcessingTypes"
import { PrinterIcon } from "lucide-react"

interface UserDetailsDrawerProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    selectedBorrower: Borrower | null
    onPrintLoanDisclosure: () => void
    onPrintPromissoryNote: () => void
    onPrintComakerStatement: () => void
    onProcessCheckVoucher: () => void
}

export function UserDetailsDrawer({
    open,
    onOpenChange,
    selectedBorrower,
    onPrintLoanDisclosure,
    onPrintPromissoryNote,
    onPrintComakerStatement,
    onProcessCheckVoucher,
}: UserDetailsDrawerProps) {

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
            </SheetContent>
        </Sheet>
    )
}
