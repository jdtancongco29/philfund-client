"use client"

import { useState, useEffect, useMemo } from "react"
import { useQuery, useMutation } from "@tanstack/react-query"
import * as z from "zod"
import { format } from "date-fns"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import BonusLoanService from "./Service/BonusLoanProcessingService"
import type { BonusLoanFilters, BonusLoan, CoMaker } from "./Service/BonusLoanProcessingTypes"
import { toast } from "sonner"
import { BorrowerSearchPanel, type Borrower } from "@/components/borrower-search/borrower-search-panel"
import { LoanComputationTab } from "./Tabs/LoanComputationTab"
import { VoucherTab } from "./Tabs/VoucherTab"
import { Button } from "@/components/ui/button"
import NoSelected from "@/components/no-selected"
import { BlUserDetailsPanel } from "./Component/BlUserDetails"
import { BlUserDetailsDrawer } from "./Drawer/BlUserDetailsDrawer"

// Form schema for bonus loan computation
const bonusLoanSchema = z.object({
  transaction_date: z.date(),
  borrower_id: z.string().min(1, "Please select a borrower"),
  loan_type: z.string().min(1, "Please select loan type"),
  promissory_no: z.string().min(1, "Promissory number is required"),
  date_granted: z.date(),
  principal_amount: z.number().min(1, "Principal amount is required"),
  interest_amount: z.number().min(0, "Interest amount is required"),
  cut_off_date: z.string().min(1, "Cut-off date is required"),
  no_of_days: z.number().min(1, "Number of days is required"),
  computed_interest: z.number().min(0, "Computed interest is required"),
  total_payable: z.number().min(0, "Total payable is required"),
  prepared_by: z.string().min(1, "Prepared by is required"),
  approved_by: z.string().optional(),
  remarks: z.string().optional(),
})

export type BonusLoanFormValues = z.infer<typeof bonusLoanSchema>

export function BonusLoanProcessing() {
  // State management
  const [selectedDivision, setSelectedDivision] = useState<string>("")
  const [selectedDistrict, setSelectedDistrict] = useState<string>("")
  const [borrowerSearch, setBorrowerSearch] = useState<string>("")
  const [selectedBorrower, setSelectedBorrower] = useState<Borrower | null>(null)
  const [currentBonusLoan, setCurrentBonusLoan] = useState<BonusLoan | null>(null)
  const [coMakers, setCoMakers] = useState<CoMaker[]>([])
  const [activeTab, setActiveTab] = useState("loan-computation")
  const [openProfileDrawer, setOpenProfileDrawer] = useState(false)

  // Build filters
  const filters: BonusLoanFilters = useMemo(
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
    queryFn: () => BonusLoanService.getDivisions(),
    staleTime: 10 * 60 * 1000,
  })

  const { data: districtsData } = useQuery({
    queryKey: ["districts", selectedDivision],
    queryFn: () => BonusLoanService.getDistricts(selectedDivision),
    enabled: !!selectedDivision,
    staleTime: 10 * 60 * 1000,
  })

  const { data: borrowersData, isLoading: isLoadingBorrowers } = useQuery({
    queryKey: ["borrowers", filters],
    queryFn: () => BonusLoanService.getBorrowers(filters),
    staleTime: 5 * 60 * 1000,
  })

  // Fetch bonus loan data when borrower is selected
  const { data: bonusLoanData } = useQuery({
    queryKey: ["bonus-loan", selectedBorrower?.id],
    queryFn: () => BonusLoanService.getBonusLoan("1"),
    enabled: !!selectedBorrower,
    staleTime: 0,
  })

  // Mutations
  const createBonusLoanMutation = useMutation({
    mutationFn: BonusLoanService.createBonusLoan,
    onSuccess: (response) => {
      toast.success("Bonus loan created successfully")
      setCurrentBonusLoan(response.data)
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create bonus loan")
    },
  })

  const updateBonusLoanMutation = useMutation({
    mutationFn: BonusLoanService.updateBonusLoan,
    onSuccess: (response) => {
      toast.success("Bonus loan updated successfully")
      setCurrentBonusLoan(response.data)
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update bonus loan")
    },
  })

  const processBonusLoanMutation = useMutation({
    mutationFn: BonusLoanService.processBonusLoan,
    onSuccess: () => {
      toast.success("Bonus loan processed successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to process bonus loan")
    },
  })

  // Effects
  useEffect(() => {
    if (bonusLoanData?.data) {
      setCurrentBonusLoan(bonusLoanData.data)
      setCoMakers(bonusLoanData.data.co_makers)
    }
  }, [bonusLoanData])

  // Event handlers
  const handleBorrowerSelect = (borrower: Borrower) => {
    setSelectedBorrower(borrower)
  }

  const handleSaveAsDraft = (values: BonusLoanFormValues) => {
    const payload = {
      transaction_date: format(values.transaction_date, "yyyy-MM-dd"),
      borrower_id: values.borrower_id,
      loan_type: values.loan_type,
      promissory_no: values.promissory_no,
      date_granted: format(values.date_granted, "yyyy-MM-dd"),
      principal_amount: values.principal_amount,
      interest_amount: values.interest_amount,
      cut_off_date: values.cut_off_date,
      no_of_days: values.no_of_days,
      computed_interest: values.computed_interest,
      total_payable: values.total_payable,
      co_makers: coMakers.map((cm) => ({ name: cm.name, address: cm.address, contact: cm.contact })),
      prepared_by: values.prepared_by,
      approved_by: values.approved_by || "",
      remarks: values.remarks || "",
    }

    if (currentBonusLoan) {
      updateBonusLoanMutation.mutate({ ...payload, id: currentBonusLoan.id })
    } else {
      createBonusLoanMutation.mutate(payload)
    }
  }

  const handleProcess = () => {
    if (currentBonusLoan) {
      processBonusLoanMutation.mutate(currentBonusLoan.id)
    } else {
      toast.error("Please save the bonus loan first before processing")
    }
  }

  const handleReset = () => {
    setSelectedBorrower(null)
    setCurrentBonusLoan(null)
    setCoMakers([])
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
            {/* Center Panel - Bonus Loan Processing */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Header - Fixed */}
              <div className="bg-white p-6 border-gray-200 flex-shrink-0 md:flex md:item-center md:justify-between">
                <h1 className="text-xl font-semibold">Bonus Loan Processing</h1>
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
                      value="loan-computation"
                      className="shadow-transparent mb-[-3px] relative flex-none border-none rounded-none bg-transparent px-4 py-2 text-sm font-medium text-black data-[state=active]:text-black data-[state=active]:after:absolute data-[state=active]:after:left-0 data-[state=active]:after:bottom-0 data-[state=active]:after:h-0.5 data-[state=active]:after:w-full data-[state=active]:after:bg-blue-600"
                    >
                      Loan Computation
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
                    <TabsContent value="loan-computation" className="h-full overflow-y-auto p-6 m-0">
                      <LoanComputationTab
                        currentBonusLoan={currentBonusLoan}
                        borrowers={borrowersData?.data.borrowers || []}
                        coMakers={coMakers}
                        setCoMakers={setCoMakers}
                        onSaveAsDraft={handleSaveAsDraft}
                        onProcess={handleProcess}
                        onReset={handleReset}
                        isLoading={createBonusLoanMutation.isPending || updateBonusLoanMutation.isPending}
                      />
                    </TabsContent>

                    <TabsContent value="voucher" className="h-full overflow-y-auto p-6 m-0">
                      <VoucherTab
                        currentBonusLoan={currentBonusLoan}
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
            <BlUserDetailsPanel
              selectedBorrower={selectedBorrower}
              onPrintLoanDisclosure={() => toast.info("Printing Bonus Loan Calculation...")}
              onPrintPromissoryNote={() => toast.info("Printing Bonus Promissory Note...")}
              onPrintComakerStatement={() => toast.info("Printing Bonus Check Voucher...")}
              onProcessCheckVoucher={() => toast.info("Processing Bonus Check Voucher...")}
            />
            <BlUserDetailsDrawer
              open={openProfileDrawer}
              onOpenChange={setOpenProfileDrawer}
              selectedBorrower={selectedBorrower}
              onPrintLoanDisclosure={() => toast.info("Printing Bonus Loan Calculation...")}
              onPrintPromissoryNote={() => toast.info("Printing Bonus Promissory Note...")}
              onPrintComakerStatement={() => toast.info("Printing Bonus Check Voucher...")}
              onProcessCheckVoucher={() => toast.info("Processing Bonus Check Voucher...")}
            />
          </div>
        </div>
      ) : (
        <NoSelected description="Choose a borrower from the list to view their details." />
      )}
    </div>
  )
}
