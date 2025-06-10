"use client"

import { useCallback, useState } from "react"
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { EyeIcon, PrinterIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import type { ModulePermissionProps } from "../../MaintenanceAndSecurity/Security/UserPermissions/Service/PermissionsTypes"
import { downloadFile } from "@/lib/utils"
import type { Transaction } from "./Service/TransactionTypes"
import TransactionService from "./Service/TransactionService"

import { ListOfPaymentTab } from "./Tabs/ListOfPaymentTab"
import { DetailsTab } from "./Tabs/DetailsTab"
import { TransactionHistoryTab } from "./Tabs/TransactionHistoryTab"

import { TransactionDetailsDialog } from "./Dialog/TransactionDetailsDialog"
import { TransactionVoucherDialog } from "./Dialog/TransactionVoucherDialog"

export function SalaryAndCashAdvancePaymentTable({
    // canAdd,
    // canEdit, 
    // canDelete, 
    canExport
}: ModulePermissionProps) {
    const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
    const [isVoucherDialogOpen, setIsVoucherDialogOpen] = useState(false)
    const [selectedItem, setSelectedItem] = useState<Transaction | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [searchQuery, setSearchQuery] = useState<string>("")
    const [selectedDivision, setSelectedDivision] = useState<string>("")
    const [selectedDistrict, setSelectedDistrict] = useState<string>("")
    const [selectedPaymentMode, setSelectedPaymentMode] = useState<string>("")
    const [activeTab, setActiveTab] = useState("list-of-payment")
    const [columnSort, setColumnSort] = useState<string | null>(null)
    const [sortQuery, setSortQuery] = useState<string | null>(null)

    const queryClient = useQueryClient()

    const onPaginationChange = useCallback((page: number) => {
        setCurrentPage(page)
    }, [])

    const onRowCountChange = useCallback((row: number) => {
        setRowsPerPage(row)
        setCurrentPage(1)
    }, [])

    const {
        isPending,
        error,
        isFetching,
        data: transactions,
    } = useQuery({
        queryKey: [
            "transactions-table",
            currentPage,
            rowsPerPage,
            searchQuery,
            selectedDivision,
            selectedDistrict,
            selectedPaymentMode,
            activeTab,
            columnSort,
            sortQuery,
        ],
        queryFn: () =>
            TransactionService.getAllTransactions(
                currentPage,
                rowsPerPage,
                searchQuery || null,
                selectedDivision || null,
                selectedDistrict || null,
                selectedPaymentMode || null,
                activeTab,
                columnSort,
                sortQuery,
            ),
        staleTime: Number.POSITIVE_INFINITY,
        placeholderData: keepPreviousData,
        refetchOnWindowFocus: false,
    })

    const exportPdfMutation = useMutation({
        mutationFn: TransactionService.exportPdf,
        onSuccess: (data) => {
            const newTab = window.open(data.data.url, "_blank")
            if (newTab) {
                newTab.focus()
                toast.success("PDF opened in new tab")
            } else {
                toast.error("Failed to open PDF. Please try again.")
            }
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to export PDF")
        },
    })

    const exportCsvMutation = useMutation({
        mutationFn: TransactionService.exportCsv,
        onSuccess: (csvData: Blob) => {
            try {
                const currentDate = new Date().toISOString().split("T")[0]
                downloadFile(csvData, `transactions-${currentDate}.csv`)
                toast.success("CSV generated successfully")
            } catch (error) {
                toast.error("Failed to process CSV data")
            }
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to export CSV")
        },
    })

    const processPaymentMutation = useMutation({
        mutationFn: TransactionService.processPayment,
        onSuccess: () => {
            toast.success("Payment processed successfully")
            queryClient.invalidateQueries({
                queryKey: ["transactions-table"],
                exact: false,
            })
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to process payment")
        },
    })

    if (error) return "An error has occurred: " + error.message

    const handleReset = () => {
        setSearchQuery("")
        setSelectedDivision("")
        setSelectedDistrict("")
        setSelectedPaymentMode("")
        setCurrentPage(1)
    }

    const handlePdfExport = () => {
        exportPdfMutation.mutate()
    }

    const handleCsvExport = () => {
        exportCsvMutation.mutate()
    }

    const handleViewDetails = (item: Transaction) => {
        setSelectedItem(item)
        setIsDetailsDialogOpen(true)
    }

    //   const handleViewVoucher = (item: Transaction) => {
    //     setSelectedItem(item)
    //     setIsVoucherDialogOpen(true)
    //   }

    const handlePrint = (item: Transaction) => {
        toast.info(`Printing transaction ${item.transaction_number}`)
    }

    const handleProcessPayment = () => {
        processPaymentMutation.mutate()
    }

    const handleSort = (column: string, sort: string) => {
        setColumnSort(column)
        setSortQuery(sort)
    }

    const actionButtons = [
        {
            label: "View",
            icon: <EyeIcon className="h-4 w-4" />,
            onClick: handleViewDetails,
        },
    ]

    if (activeTab === "transaction-history") {
        actionButtons.push({
            label: "Print",
            icon: <PrinterIcon className="h-4 w-4" />,
            onClick: handlePrint,
        })
    }

    return (
        <div className="space-y-4">
            <div className="flex-1 flex flex-col border rounded-[8px] h-full overflow-hidden">
                <div className="flex-1 flex overflow-hidden">
                    {/* Main Content */}
                    <div className="flex-1 flex flex-col overflow-hidden">
                        {/* Header - Fixed */}
                        <div className="bg-white p-6 flex-shrink-0 flex items-center justify-between">
                            <h1 className="text-xl font-semibold">List of Transactions</h1>
                            <Button onClick={handleProcessPayment} className="bg-blue-500 hover:bg-blue-600">
                                Process Payment
                            </Button>
                        </div>

                        {/* Tabs Container - Flexible */}
                        <div className="flex-1 flex flex-col overflow-hidden">
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
                                {/* Tab List - Fixed */}
                                <TabsList className="flex justify-start gap-6 border-b border-gray-200 bg-transparent rounded-none px-6 py-0 w-full flex-shrink-0">
                                    <TabsTrigger
                                        value="list-of-payment"
                                        className="shadow-transparent mb-[-3px] relative flex-none border-none rounded-none bg-transparent p-0 text-sm font-medium text-black data-[state=active]:text-black data-[state=active]:after:absolute data-[state=active]:after:left-0 data-[state=active]:after:bottom-0 data-[state=active]:after:h-0.5 data-[state=active]:after:w-full data-[state=active]:after:bg-blue-600"
                                    >
                                        List of Payment
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="details"
                                        className="shadow-transparent mb-[-3px] relative flex-none border-none rounded-none bg-transparent p-0 text-sm font-medium text-black data-[state=active]:text-black data-[state=active]:after:absolute data-[state=active]:after:left-0 data-[state=active]:after:bottom-0 data-[state=active]:after:h-0.5 data-[state=active]:after:w-full data-[state=active]:after:bg-blue-600"
                                    >
                                        Details
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="transaction-history"
                                        className="shadow-transparent mb-[-3px] relative flex-none border-none rounded-none bg-transparent p-0 text-sm font-medium text-black data-[state=active]:text-black data-[state=active]:after:absolute data-[state=active]:after:left-0 data-[state=active]:after:bottom-0 data-[state=active]:after:h-0.5 data-[state=active]:after:w-full data-[state=active]:after:bg-blue-600"
                                    >
                                        Transaction history
                                    </TabsTrigger>
                                </TabsList>

                                {/* Tab Content - Scrollable */}
                                <div className="flex-1 overflow-hidden">
                                    <TabsContent value="list-of-payment" className="h-full overflow-y-auto p-6 m-0">
                                        <div className="space-y-4">
                                            {/* Search and Filter Controls */}
                                            <div className="flex flex-wrap gap-4 mb-4">
                                                <div className="flex items-center gap-4 mb-4">
                                                    <div className="flex-1 min-w-[200px]">
                                                        <label className="text-sm font-medium text-gray-700 mb-2 block">Search</label>
                                                        <Input
                                                            placeholder="Search user..."
                                                            value={searchQuery}
                                                            onChange={(e) => setSearchQuery(e.target.value)}
                                                            className="max-w-sm w-[226.5px]"
                                                        />
                                                    </div>

                                                    <div className="flex-1 min-w-[200px]">
                                                        <label className="text-sm font-medium text-gray-700 mb-2 block">Division</label>
                                                        <Select value={selectedDivision} onValueChange={setSelectedDivision}>
                                                            <SelectTrigger className="w-[226.5px]">
                                                                <SelectValue placeholder="Select..." />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="division1">Division 1</SelectItem>
                                                                <SelectItem value="division2">Division 2</SelectItem>
                                                                <SelectItem value="division3">Division 3</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    <div className="flex-1 min-w-[200px]">
                                                        <label className="text-sm font-medium text-gray-700 mb-2 block">District</label>
                                                        <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                                                            <SelectTrigger className="w-[226.5px]">
                                                                <SelectValue placeholder="Select..." />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="district1">District 1</SelectItem>
                                                                <SelectItem value="district2">District 2</SelectItem>
                                                                <SelectItem value="district3">District 3</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                                <div className="flex flex-1 flex-wrap gap-4 mb-4">
                                                    <div className="flex items-start ml-auto gap-2">
                                                        <Button variant="outline" onClick={handleReset} className="mb-0.5">
                                                            Reset
                                                        </Button>
                                                        <Button variant="outline" onClick={handlePdfExport} className="mb-0.5" disabled={!canExport}>
                                                            PDF
                                                        </Button>
                                                        <Button variant="outline" onClick={handleCsvExport} className="mb-0.5" disabled={!canExport}>
                                                            CSV
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Payment Mode Filter */}
                                            <div className="mb-4 flex items-center px-4 py-6.5 bg-gray-50 rounded-lg">
                                                <label className="flex-1 text-sm font-semibold text-gray-700 block">Select Mode of Payment</label>
                                                <div className="flex items-end">
                                                    <Select value={selectedPaymentMode} onValueChange={setSelectedPaymentMode}>
                                                        <SelectTrigger className="min-w-[480px]">
                                                            <SelectValue placeholder="Select mode of payment..." />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="cash">Cash</SelectItem>
                                                            <SelectItem value="check">Check</SelectItem>
                                                            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                                            <SelectItem value="pos">POS</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>

                                            <ListOfPaymentTab
                                                data={transactions?.data.transactions ?? []}
                                                pagination={transactions?.data.pagination}
                                                isLoading={isPending || isFetching}
                                                onPaginationChange={onPaginationChange}
                                                onRowCountChange={onRowCountChange}
                                                actionButtons={actionButtons}
                                                onSort={handleSort}
                                            />
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="details" className="h-full overflow-y-auto p-6 m-0">
                                        <div className="space-y-4">
                                            {/* Search and Filter Controls */}
                                            <div className="flex flex-wrap gap-4 mb-4">
                                                <div className="flex items-center gap-4 mb-4">
                                                    <div className="flex-1 min-w-[200px]">
                                                        <label className="text-sm font-medium text-gray-700 mb-2 block">Search</label>
                                                        <Input
                                                            placeholder="Search user..."
                                                            value={searchQuery}
                                                            onChange={(e) => setSearchQuery(e.target.value)}
                                                            className="max-w-sm w-[226.5px]"
                                                        />
                                                    </div>

                                                    <div className="flex-1 min-w-[200px]">
                                                        <label className="text-sm font-medium text-gray-700 mb-2 block">Division</label>
                                                        <Select value={selectedDivision} onValueChange={setSelectedDivision}>
                                                            <SelectTrigger className="w-[226.5px]">
                                                                <SelectValue placeholder="Select..." />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="division1">Division 1</SelectItem>
                                                                <SelectItem value="division2">Division 2</SelectItem>
                                                                <SelectItem value="division3">Division 3</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    <div className="flex-1 min-w-[200px]">
                                                        <label className="text-sm font-medium text-gray-700 mb-2 block">District</label>
                                                        <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                                                            <SelectTrigger className="w-[226.5px]">
                                                                <SelectValue placeholder="Select..." />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="district1">District 1</SelectItem>
                                                                <SelectItem value="district2">District 2</SelectItem>
                                                                <SelectItem value="district3">District 3</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                                <div className="flex flex-1 flex-wrap gap-4 mb-4">
                                                    <div className="flex items-start ml-auto gap-2">
                                                        <Button variant="outline" onClick={handleReset} className="mb-0.5">
                                                            Reset
                                                        </Button>
                                                        <Button variant="outline" onClick={handlePdfExport} className="mb-0.5" disabled={!canExport}>
                                                            PDF
                                                        </Button>
                                                        <Button variant="outline" onClick={handleCsvExport} className="mb-0.5" disabled={!canExport}>
                                                            CSV
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>

                                            <DetailsTab
                                                data={transactions?.data.transactions ?? []}
                                                pagination={transactions?.data.pagination}
                                                isLoading={isPending || isFetching}
                                                onPaginationChange={onPaginationChange}
                                                onRowCountChange={onRowCountChange}
                                                actionButtons={actionButtons}
                                                onSort={handleSort}
                                            />
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="transaction-history" className="h-full overflow-y-auto p-6 m-0">
                                        <div className="space-y-4">
                                            {/* Search and Filter Controls */}
                                            <div className="flex flex-wrap gap-4 mb-4">
                                                <div className="flex items-center gap-4 mb-4">
                                                    <div className="flex-1 min-w-[200px]">
                                                        <label className="text-sm font-medium text-gray-700 mb-2 block">Search</label>
                                                        <Input
                                                            placeholder="Search user..."
                                                            value={searchQuery}
                                                            onChange={(e) => setSearchQuery(e.target.value)}
                                                            className="max-w-sm w-[226.5px]"
                                                        />
                                                    </div>

                                                    <div className="flex-1 min-w-[200px]">
                                                        <label className="text-sm font-medium text-gray-700 mb-2 block">Division</label>
                                                        <Select value={selectedDivision} onValueChange={setSelectedDivision}>
                                                            <SelectTrigger className="w-[226.5px]">
                                                                <SelectValue placeholder="Select..." />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="division1">Division 1</SelectItem>
                                                                <SelectItem value="division2">Division 2</SelectItem>
                                                                <SelectItem value="division3">Division 3</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    <div className="flex-1 min-w-[200px]">
                                                        <label className="text-sm font-medium text-gray-700 mb-2 block">District</label>
                                                        <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                                                            <SelectTrigger className="w-[226.5px]">
                                                                <SelectValue placeholder="Select..." />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="district1">District 1</SelectItem>
                                                                <SelectItem value="district2">District 2</SelectItem>
                                                                <SelectItem value="district3">District 3</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                                <div className="flex flex-1 flex-wrap gap-4 mb-4">
                                                    <div className="flex items-start ml-auto gap-2">
                                                        <Button variant="outline" onClick={handleReset} className="mb-0.5">
                                                            Reset
                                                        </Button>
                                                        <Button variant="outline" onClick={handlePdfExport} className="mb-0.5" disabled={!canExport}>
                                                            PDF
                                                        </Button>
                                                        <Button variant="outline" onClick={handleCsvExport} className="mb-0.5" disabled={!canExport}>
                                                            CSV
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>

                                            <TransactionHistoryTab
                                                data={transactions?.data.transactions ?? []}
                                                pagination={transactions?.data.pagination}
                                                isLoading={isPending || isFetching}
                                                onPaginationChange={onPaginationChange}
                                                onRowCountChange={onRowCountChange}
                                                actionButtons={actionButtons}
                                                onSort={handleSort}
                                            />
                                        </div>
                                    </TabsContent>
                                </div>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>

            <TransactionDetailsDialog
                item={selectedItem}
                open={isDetailsDialogOpen}
                onOpenChange={(open) => {
                    setIsDetailsDialogOpen(open)
                    if (!open) {
                        setSelectedItem(null)
                    }
                }}
            />

            <TransactionVoucherDialog
                item={selectedItem}
                open={isVoucherDialogOpen}
                onOpenChange={(open) => {
                    setIsVoucherDialogOpen(open)
                    if (!open) {
                        setSelectedItem(null)
                    }
                }}
            />
        </div>
    )
}
