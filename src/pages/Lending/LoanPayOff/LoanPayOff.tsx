"use client"

import { useState, useEffect, useMemo } from "react"
import { useQuery, useMutation } from "@tanstack/react-query"
import * as z from "zod"
import { format } from "date-fns"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LoanPayOffService from "./Service/LoanPayOffService"
import type { LoanPayOffFilters, LoanPayOff } from "./Service/LoanPayOffTypes"
import { toast } from "sonner"
import { BorrowerSearchPanel, type Borrower } from "@/components/borrower-search/borrower-search-panel"
import { LoansOverviewTab } from "./Tabs/LoansOverviewTab"
import { VoucherTab } from "./Tabs/VoucherTab"
import { PayOffTransactionsTab } from "./Tabs/PayOffTransactionsTab"
import { Button } from "@/components/ui/button"
import NoSelected from "@/components/no-selected"
import { LoanPayOffUserDetailsPanel } from "./Components/LoanPayOffUserDetails"
import { LoanPayOffUserDetailsDrawer } from "./Drawer/LoanPayOffUserDetailsDrawer"

// Form schema for loan pay off
const loanPayOffSchema = z.object({
  reference_code: z.string().min(1, "Reference code is required"),
  reference_name: z.string().min(1, "Reference name is required"),
  date_range_from: z.date(),
  date_range_to: z.date(),
  paid_by_insurance: z.number().min(0, "Insurance amount must be positive"),
  loan_type: z.string().optional(),
  search_user: z.string().optional(),
})

export type LoanPayOffFormValues = z.infer<typeof loanPayOffSchema>

export function LoanPayOffProcessing() {
  // State management
  const [selectedDivision, setSelectedDivision] = useState<string>("")
  const [selectedDistrict, setSelectedDistrict] = useState<string>("")
  const [borrowerSearch, setBorrowerSearch] = useState<string>("")
  const [selectedBorrower, setSelectedBorrower] = useState<Borrower | null>(null)
  const [currentLoanPayOff, setCurrentLoanPayOff] = useState<LoanPayOff | null>(null)
  const [activeTab, setActiveTab] = useState("loans-overview")
  const [openProfileDrawer, setOpenProfileDrawer] = useState(false)

  // Build filters
  const filters: LoanPayOffFilters = useMemo(
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
    queryFn: () => LoanPayOffService.getDivisions(),
    staleTime: 10 * 60 * 1000,
  })

  const { data: districtsData } = useQuery({
    queryKey: ["districts", selectedDivision],
    queryFn: () => LoanPayOffService.getDistricts(selectedDivision),
    enabled: !!selectedDivision,
    staleTime: 10 * 60 * 1000,
  })

  const { data: borrowersData, isLoading: isLoadingBorrowers } = useQuery({
    queryKey: ["borrowers", filters],
    queryFn: () => LoanPayOffService.getBorrowers(filters),
    staleTime: 5 * 60 * 1000,
  })

  // Fetch loan pay off data when borrower is selected
  const { data: loanPayOffData } = useQuery({
    queryKey: ["loan-pay-off", selectedBorrower?.id],
    queryFn: () => LoanPayOffService.getLoanPayOff("1"),
    enabled: !!selectedBorrower,
    staleTime: 0,
  })

  // Mutations
  const createLoanPayOffMutation = useMutation({
    mutationFn: LoanPayOffService.createLoanPayOff,
    onSuccess: (response) => {
      toast.success("Loan pay off created successfully")
      setCurrentLoanPayOff(response.data)
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create loan pay off")
    },
  })

  const updateLoanPayOffMutation = useMutation({
    mutationFn: LoanPayOffService.updateLoanPayOff,
    onSuccess: (response) => {
      toast.success("Loan pay off updated successfully")
      setCurrentLoanPayOff(response.data)
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update loan pay off")
    },
  })

  const processLoanPayOffMutation = useMutation({
    mutationFn: LoanPayOffService.processLoanPayOff,
    onSuccess: () => {
      toast.success("Loan pay off processed successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to process loan pay off")
    },
  })

  // Effects
  useEffect(() => {
    if (loanPayOffData?.data) {
      setCurrentLoanPayOff(loanPayOffData.data)
    }
  }, [loanPayOffData])

  // Event handlers
  const handleBorrowerSelect = (borrower: Borrower) => {
    setSelectedBorrower(borrower)
  }

  const handleSaveAsDraft = (values: LoanPayOffFormValues) => {
    const payload = {
      reference_code: values.reference_code,
      reference_name: values.reference_name,
      date_range_from: format(values.date_range_from, "yyyy-MM-dd"),
      date_range_to: format(values.date_range_to, "yyyy-MM-dd"),
      paid_by_insurance: values.paid_by_insurance,
      loan_type: values.loan_type || "",
      search_user: values.search_user || "",
      borrower_id: selectedBorrower?.id || "",
    }

    if (currentLoanPayOff) {
      updateLoanPayOffMutation.mutate({ ...payload, id: currentLoanPayOff.id })
    } else {
      createLoanPayOffMutation.mutate(payload)
    }
  }

  const handleProcess = () => {
    if (currentLoanPayOff) {
      processLoanPayOffMutation.mutate(currentLoanPayOff.id)
    } else {
      toast.error("Please save the loan pay off first before processing")
    }
  }

  const handleReset = () => {
    setSelectedBorrower(null)
    setCurrentLoanPayOff(null)
    setSelectedDivision("")
    setSelectedDistrict("")
    setBorrowerSearch("")
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
        onSearch={() => {}}
      />

      {/* Main Content */}
      {selectedBorrower ? (
        <div className="flex-1 flex flex-col border rounded-[8px] h-full overflow-hidden">
          <div className="flex-1 flex overflow-hidden">
            {/* Center Panel - Loan Pay Off Processing */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Header - Fixed */}
              <div className="bg-white p-6 border-gray-200 flex-shrink-0 md:flex md:item-center md:justify-between">
                <h1 className="text-xl font-semibold">Loan Pay Off</h1>
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
                      value="loans-overview"
                      className="shadow-transparent mb-[-3px] relative flex-none border-none rounded-none bg-transparent px-4 py-2 text-sm font-medium text-black data-[state=active]:text-black data-[state=active]:after:absolute data-[state=active]:after:left-0 data-[state=active]:after:bottom-0 data-[state=active]:after:h-0.5 data-[state=active]:after:w-full data-[state=active]:after:bg-blue-600"
                    >
                      Loans Overview
                    </TabsTrigger>
                    <TabsTrigger
                      value="voucher"
                      className="shadow-transparent mb-[-3px] relative flex-none border-none rounded-none bg-transparent px-4 py-2 text-sm font-medium text-black data-[state=active]:text-black data-[state=active]:after:absolute data-[state=active]:after:left-0 data-[state=active]:after:bottom-0 data-[state=active]:after:h-0.5 data-[state=active]:after:w-full data-[state=active]:after:bg-blue-600"
                    >
                      Voucher
                    </TabsTrigger>
                    <TabsTrigger
                      value="pay-off-transactions"
                      className="shadow-transparent mb-[-3px] relative flex-none border-none rounded-none bg-transparent px-4 py-2 text-sm font-medium text-black data-[state=active]:text-black data-[state=active]:after:absolute data-[state=active]:after:left-0 data-[state=active]:after:bottom-0 data-[state=active]:after:h-0.5 data-[state=active]:after:w-full data-[state=active]:after:bg-blue-600"
                    >
                      Pay Off Transactions
                    </TabsTrigger>
                  </TabsList>

                  {/* Tab Content - Scrollable */}
                  <div className="flex-1 overflow-hidden">
                    <TabsContent value="loans-overview" className="h-full overflow-y-auto p-6 m-0">
                      <LoansOverviewTab
                        currentLoanPayOff={currentLoanPayOff}
                        onSaveAsDraft={handleSaveAsDraft}
                        onProcess={handleProcess}
                        onReset={handleReset}
                        isLoading={createLoanPayOffMutation.isPending || updateLoanPayOffMutation.isPending}
                      />
                    </TabsContent>

                    <TabsContent value="voucher" className="h-full overflow-y-auto p-6 m-0">
                      <VoucherTab
                        currentLoanPayOff={currentLoanPayOff}
                        onReset={handleReset}
                        onSaveAsDraft={() => toast.info("Saving voucher as draft...")}
                        onProcess={handleProcess}
                      />
                    </TabsContent>

                    <TabsContent value="pay-off-transactions" className="h-full overflow-y-auto p-6 m-0">
                      <PayOffTransactionsTab
                        currentLoanPayOff={currentLoanPayOff}
                        onReset={handleReset}
                        onSaveAsDraft={() => toast.info("Saving transactions as draft...")}
                        onProcess={handleProcess}
                      />
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
            </div>

            {/* Right Sidebar - User Details */}
            <LoanPayOffUserDetailsPanel
              selectedBorrower={selectedBorrower}
              onPrintLoanDisclosure={() => toast.info("Printing Loan Disclosure...")}
              onPrintPromissoryNote={() => toast.info("Printing Promissory Note...")}
              onPrintComakerStatement={() => toast.info("Printing Comaker Statement...")}
              onProcessCheckVoucher={() => toast.info("Processing Check Voucher...")}
            />
            <LoanPayOffUserDetailsDrawer
              open={openProfileDrawer}
              onOpenChange={setOpenProfileDrawer}
              selectedBorrower={selectedBorrower}
              onPrintLoanDisclosure={() => toast.info("Printing Loan Disclosure...")}
              onPrintPromissoryNote={() => toast.info("Printing Promissory Note...")}
              onPrintComakerStatement={() => toast.info("Printing Comaker Statement...")}
              onProcessCheckVoucher={() => toast.info("Processing Check Voucher...")}
            />
          </div>
        </div>
      ) : (
        <NoSelected description="Choose a borrower from the list to view their loan details." />
      )}
    </div>
  )
}
