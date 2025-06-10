"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { Transaction } from "../Service/TransactionTypes"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TransactionDetailsTab } from "../Tabs/TransactionDetailsTab"
import { TransactionVoucherTab } from "../Tabs/TransactionVoucherTab"

interface TransactionDetailsDialogProps {
    item: Transaction | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function TransactionDetailsDialog({ item, open, onOpenChange }: TransactionDetailsDialogProps) {
    const [activeTab, setActiveTab] = useState("details")
    const [receivedBy, setReceivedBy] = useState<string>("")
    const [referenceCode, setReferenceCode] = useState("")
    const [referenceNo, setReferenceNo] = useState("")

    const handlePrint = () => {
        toast.info("Print functionality will be implemented")
    }

    const handleClose = () => {
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[800px] sm:max-h-[90vh] overflow-hidden flex flex-col p-0">
                <DialogHeader className="p-6 pb-0">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-xl font-bold">Transaction Details</DialogTitle>
                    </div>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex flex-col flex-grow overflow-hidden">
                    <TabsList className="flex justify-start border-b border-gray-200 bg-transparent rounded-none p-0 w-full px-6">
                        <TabsTrigger
                            value="details"
                            className="shadow-transparent mb-[-1px] relative flex-none border-none rounded-none bg-transparent px-4 py-2 text-sm font-medium text-gray-600 data-[state=active]:text-black data-[state=active]:after:absolute data-[state=active]:after:left-0 data-[state=active]:after:bottom-0 data-[state=active]:after:h-0.5 data-[state=active]:after:w-full data-[state=active]:after:bg-blue-600"
                        >
                            Details
                        </TabsTrigger>
                        <TabsTrigger
                            value="voucher"
                            className="shadow-transparent mb-[-1px] relative flex-none border-none rounded-none bg-transparent px-4 py-2 text-sm font-medium text-gray-600 data-[state=active]:text-black data-[state=active]:after:absolute data-[state=active]:after:left-0 data-[state=active]:after:bottom-0 data-[state=active]:after:h-0.5 data-[state=active]:after:w-full data-[state=active]:after:bg-blue-600"
                        >
                            Voucher
                        </TabsTrigger>
                    </TabsList>

                    {/* Scrollable area */}
                    <div className="flex-grow overflow-y-auto">
                        <TabsContent value="details" className="p-6 pt-0">
                            <TransactionDetailsTab item={item} receivedBy={receivedBy} setReceivedBy={setReceivedBy} />
                        </TabsContent>
                        <TabsContent value="voucher" className="p-6 pt-0">
                            <TransactionVoucherTab
                                item={item}
                                referenceCode={referenceCode}
                                setReferenceCode={setReferenceCode}
                                referenceNo={referenceNo}
                                setReferenceNo={setReferenceNo}
                            />
                        </TabsContent>
                    </div>
                </Tabs>

                <DialogFooter className="pt-4 flex gap-2 px-6 pb-6">
                    <Button variant="outline" onClick={handleClose} type="button">
                        Close
                    </Button>
                    <Button onClick={handlePrint} className="bg-blue-500 hover:bg-blue-600">
                        Print
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}