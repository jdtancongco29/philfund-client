"use client"

import { useState, useEffect, useMemo } from "react"
import { useQuery, useMutation } from "@tanstack/react-query"
import * as z from "zod"
import { format } from "date-fns"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CashAdvanceService from "./Service/CashAdvanceProcessingService"
import type { CashAdvanceFilters, CashAdvance } from "./Service/CashAdvanceProcessingTypes"
import { toast } from "sonner"
import { BorrowerSearchPanel, type Borrower } from "@/components/borrower-search/borroer-search-panel"
import { UserDetailsPanel } from "../LoanProcessing/Component/UserDetailsPanel"
import { InformationTab } from "./Tabs/InformationTab"
import { VoucherTab } from "./Tabs/VoucherTab"
import { Button } from "@/components/ui/button"
import { UserDetailsDrawer } from "../LoanProcessing/Drawer/UserDetailsDrawer"
import NoSelected from "@/components/no-selected"

// Form schema for cash advance
const cashAdvanceSchema = z.object({
  transaction_date: z.date(),
  borrower_id: z.string().min(1, "Please select a borrower"),
  reference_code: z.string().min(1, "Reference code is required"),
  reference_number: z.string().min(1, "Reference number is required"),
  amount: z.number().min(1, "Amount is required"),
  prepared_by: z.string().min(1, "Prepared by is required"),
  approved_by: z.string().optional(),
  remarks: z.string().optional(),
})

export type CashAdvanceFormValues = z.infer<typeof cashAdvanceSchema>

export function CashAdvanceProcessing() {
  // State management
  const [selectedDivision, setSelectedDivision] = useState<string>("")
  const [selectedDistrict, setSelectedDistrict] = useState<string>("")
  const [borrowerSearch, setBorrowerSearch] = useState<string>("")
  const [selectedBorrower, setSelectedBorrower] = useState<Borrower | null>(null)
  const [currentCashAdvance, setCurrentCashAdvance] = useState<CashAdvance | null>(null)
  const [activeTab, setActiveTab] = useState("information")
  const [openProfileDrawer, setOpenProfileDrawer] = useState(false)

  // Build filters
  const filters: CashAdvanceFilters = useMemo(
    () => ({
      division: selectedDivision || undefined,
      district: selectedDistrict || undefined,
      borrower_search: borrowerSearch || undefined,
    }),
    [selectedDivision, selectedDistrict, borrowerSearch],
  )

  // Fetch data queries
  const { data: divisionsData } = useQuery({
    queryKey: ["divisions"],
    queryFn: () => CashAdvanceService.getDivisions(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })

  const { data: districtsData } = useQuery({
    queryKey: ["districts", selectedDivision],
    queryFn: () => CashAdvanceService.getDistricts(selectedDivision),
    enabled: !!selectedDivision,
    staleTime: 10 * 60 * 1000,
  })

  const { data: borrowersData, isLoading: isLoadingBorrowers } = useQuery({
    queryKey: ["borrowers", filters],
    queryFn: () => CashAdvanceService.getBorrowers(filters),
    staleTime: 5 * 60 * 1000,
  })

  // Fetch cash advance data when borrower is selected
  const { data: cashAdvanceData } = useQuery({
    queryKey: ["cash-advance", selectedBorrower?.id],
    queryFn: () => CashAdvanceService.getCashAdvance("1"), // TODO: Use actual cash advance ID
    enabled: !!selectedBorrower,
    staleTime: 0,
  })

  // Mutations
  const createCashAdvanceMutation = useMutation({
    mutationFn: CashAdvanceService.createCashAdvance,
    onSuccess: (response) => {
      toast.success("Cash advance created successfully")
      setCurrentCashAdvance(response.data)
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create cash advance")
    },
  })

  const updateCashAdvanceMutation = useMutation({
    mutationFn: CashAdvanceService.updateCashAdvance,
    onSuccess: (response) => {
      toast.success("Cash advance updated successfully")
      setCurrentCashAdvance(response.data)
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update cash advance")
    },
  })

  const processCashAdvanceMutation = useMutation({
    mutationFn: CashAdvanceService.processCashAdvance,
    onSuccess: () => {
      toast.success("Cash advance processed successfully")
      // TODO: Refresh cash advance data or redirect
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to process cash advance")
    },
  })

  // Effects
  useEffect(() => {
    if (cashAdvanceData?.data) {
      setCurrentCashAdvance(cashAdvanceData.data)
    }
  }, [cashAdvanceData])

  // Event handlers
  const handleBorrowerSelect = (borrower: Borrower) => {
    setSelectedBorrower(borrower)
  }

  const handleSaveAsDraft = (values: CashAdvanceFormValues) => {
    const payload = {
      transaction_date: format(values.transaction_date, "yyyy-MM-dd"),
      borrower_id: values.borrower_id,
      reference_code: values.reference_code,
      reference_number: values.reference_number,
      amount: values.amount,
      prepared_by: values.prepared_by,
      approved_by: values.approved_by || "",
      remarks: values.remarks || "",
    }

    if (currentCashAdvance) {
      updateCashAdvanceMutation.mutate({ ...payload, id: currentCashAdvance.id })
    } else {
      createCashAdvanceMutation.mutate(payload)
    }
  }

  const handleProcess = () => {
    if (currentCashAdvance) {
      processCashAdvanceMutation.mutate(currentCashAdvance.id)
    } else {
      toast.error("Please save the cash advance first before processing")
    }
  }

  const handleReset = () => {
    setSelectedBorrower(null)
    setCurrentCashAdvance(null)
    setSelectedDivision("")
    setSelectedDistrict("")
    setBorrowerSearch("")
  }

  // Print handlers
  const handlePrintCashAdvancePromissoryNote = () => {
    toast.info("Printing Cash Advance Promissory Note...")
    // TODO: Implement actual print functionality
  }

  const handlePrintVoucher = () => {
    toast.info("Printing Voucher...")
    // TODO: Implement actual print functionality
  }

  const handleShowProfile = () => {
    setOpenProfileDrawer((prev) => !prev)
  }

  return (
    <div className="flex gap-6 h-full overflow-hidden">
      {/* Left Sidebar - Borrower Search */}
      <BorrowerSearchPanel
        divisions={divisionsData?.data.divisions || []}
        districts={districtsData?.data.districts || []}
        borrowers={borrowersData?.data.borrowers || []}
        selectedDivision={selectedDivision}
        selectedDistrict={selectedDistrict}
        borrowerSearch={borrowerSearch}
        selectedBorrower={selectedBorrower}
        isLoadingBorrowers={isLoadingBorrowers}
        onDivisionChange={setSelectedDivision}
        onDistrictChange={setSelectedDistrict}
        onBorrowerSearchChange={setBorrowerSearch}
        onBorrowerSelect={handleBorrowerSelect}
        onReset={handleReset}
        onSearch={() => {
          /* Implement search functionality if needed */
        }}
      />

      {/* Main Content */}
      {selectedBorrower ? (
        <div className="flex-1 flex flex-col border rounded-[8px] h-full overflow-hidden">
          <div className="flex-1 flex overflow-hidden">
            {/* Center Panel - Cash Advance Processing */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Header - Fixed */}
              <div className="bg-white p-6 border-gray-200 flex-shrink-0 md:flex md:item-center md:justify-between">
                <h1 className="text-xl font-semibold">Cash Advance Processing</h1>
                <Button className="block 2xl:hidden" size="sm" onClick={handleShowProfile}>
                  View Profile
                </Button>
              </div>

              {/* Tabs Container - Flexible */}
              <div className="flex-1 flex flex-col overflow-hidden">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
                  {/* Tab List - Fixed */}
                  <TabsList className="flex justify-start border-b border-gray-200 bg-transparent rounded-none p-0 w-full flex-shrink-0">
                    <TabsTrigger
                      value="information"
                      className="shadow-transparent mb-[-3px] relative flex-none border-none rounded-none bg-transparent px-4 py-2 text-sm font-medium text-black data-[state=active]:text-black data-[state=active]:after:absolute data-[state=active]:after:left-0 data-[state=active]:after:bottom-0 data-[state=active]:after:h-0.5 data-[state=active]:after:w-full data-[state=active]:after:bg-blue-600"
                    >
                      Information
                    </TabsTrigger>
                    <TabsTrigger
                      value="voucher"
                      className="shadow-transparent mb-[-3px] relative flex-none border-none rounded-none bg-transparent px-4 py-2 text-sm font-medium text-black data-[state=active]:text-black data-[state=active]:after:absolute data-[state=active]:after:left-0 data-[state=active]:after:bottom-0 data-[state=active]:after:h-0.5 data-[state=active]:after:w-full data-[state=active]:after:bg-blue-600"
                    >
                      Voucher
                    </TabsTrigger>
                  </TabsList>

                  {/* Tab Content - Scrollable */}
                  <div className="flex-1 overflow-hidden">
                    <TabsContent value="information" className="h-full overflow-y-auto p-6 m-0">
                      <InformationTab
                        currentCashAdvance={currentCashAdvance}
                        borrowers={borrowersData?.data.borrowers || []}
                        onSaveAsDraft={handleSaveAsDraft}
                        onProcess={handleProcess}
                        onReset={handleReset}
                        isLoading={createCashAdvanceMutation.isPending || updateCashAdvanceMutation.isPending}
                      />
                    </TabsContent>

                    <TabsContent value="voucher" className="h-full overflow-y-auto p-6 m-0">
                      <VoucherTab
                        currentCashAdvance={currentCashAdvance}
                        onReset={handleReset}
                        onSaveAsDraft={() => toast.info("Saving voucher as draft...")}
                        onProcess={handleProcess}
                      />
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
            </div>

            {/* Right Sidebar - User Details */}
            <UserDetailsPanel
              selectedBorrower={selectedBorrower}
              onPrintLoanDisclosure={handlePrintCashAdvancePromissoryNote}
              onPrintPromissoryNote={handlePrintCashAdvancePromissoryNote}
              onPrintComakerStatement={handlePrintVoucher}
              onProcessCheckVoucher={handlePrintVoucher}
            />
            <UserDetailsDrawer
              open={openProfileDrawer}
              onOpenChange={setOpenProfileDrawer}
              selectedBorrower={selectedBorrower}
              onPrintLoanDisclosure={handlePrintCashAdvancePromissoryNote}
              onPrintPromissoryNote={handlePrintCashAdvancePromissoryNote}
              onPrintComakerStatement={handlePrintVoucher}
              onProcessCheckVoucher={handlePrintVoucher}
            />
          </div>
        </div>
      ) : (
        <NoSelected description="Choose a borrower from the list to view their details." />
      )}
    </div>
  )
}
