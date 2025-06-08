"use client";

import { useEffect, useMemo, useState } from "react";

import { ModulePermissionProps } from "../MaintenanceAndSecurity/Security/UserPermissions/Service/PermissionsTypes";
import { toast } from "sonner";
import NoSelected from "@/components/no-selected";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import { useQuery, useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

import { LoanComputationFormValues } from "../Lending/LoanProcessing/SalaryLoanProcessing";

import { UserDetailsDrawer } from "./Drawer/UserDetailsDrawer";
import SalaryLoanService from "./Service/SalaryLoanProcessingService";
import {
  SalaryLoan,
  CoMaker,
  SalaryLoanFilters,
  Borrower,
} from "./Service/SalaryLoanProcessingTypes";
import { BorrowerSearchPanel } from "./Components/BorrowerSearchPanel";
import { VoucherTab } from "./Tabs/VoucherTab";
import { UserDetailsPanel } from "./UserDetailsPanel";
import { InformationTab } from "./Tabs/InformationTab"; // Fixed typo here

export default function BorrowerDashboard({}: //canExport
ModulePermissionProps) {
  // State management
  const [selectedDivision, setSelectedDivision] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [borrowerSearch, setBorrowerSearch] = useState<string>("");
  const [selectedBorrower, setSelectedBorrower] = useState<Borrower | null>(
    null
  );
  const [currentLoan, setCurrentLoan] = useState<SalaryLoan | null>(null);
  const [coMakers, setCoMakers] = useState<CoMaker[]>([]);
  const [activeTab, setActiveTab] = useState("loan-computation");
  const [openProfileDrawer, setOpenProfileDrawer] = useState(false);

  // Build filters
  const filters: SalaryLoanFilters = useMemo(
    () => ({
      division: selectedDivision || undefined,
      district: selectedDistrict || undefined,
      borrower_search: borrowerSearch || undefined,
    }),
    [selectedDivision, selectedDistrict, borrowerSearch]
  );

  // Fetch data queries
  const { data: divisionsData } = useQuery({
    queryKey: ["divisions"],
    queryFn: () => SalaryLoanService.getDivisions(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const { data: districtsData } = useQuery({
    queryKey: ["districts", selectedDivision],
    queryFn: () => SalaryLoanService.getDistricts(selectedDivision),
    enabled: !!selectedDivision,
    staleTime: 10 * 60 * 1000,
  });

  const { data: borrowersData, isLoading: isLoadingBorrowers } = useQuery({
    queryKey: ["borrowers", filters],
    queryFn: () => SalaryLoanService.getBorrowers(filters),
    staleTime: 5 * 60 * 1000,
  });

  const { data: banksData } = useQuery({
    queryKey: ["banks"],
    queryFn: () => SalaryLoanService.getBanks(),
    staleTime: 10 * 60 * 1000,
  });

  // Fetch loan data when borrower is selected
  const { data: loanData } = useQuery({
    queryKey: ["salary-loan", selectedBorrower?.id],
    queryFn: () => SalaryLoanService.getSalaryLoan("1"), // TODO: Use actual loan ID
    enabled: !!selectedBorrower,
    staleTime: 0,
  });

  // Fetch voucher data
  const { data: voucherData } = useQuery({
    queryKey: ["check-voucher", currentLoan?.id],
    queryFn: () => SalaryLoanService.getCheckVoucher(currentLoan!.id),
    enabled: !!currentLoan && activeTab === "voucher",
    staleTime: 0,
  });

  // Fetch amortization schedule

  // Mutations
  const createLoanMutation = useMutation({
    mutationFn: SalaryLoanService.createSalaryLoan,
    onSuccess: (response) => {
      toast.success("Salary loan created successfully");
      setCurrentLoan(response.data);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create salary loan");
    },
  });

  const updateLoanMutation = useMutation({
    mutationFn: SalaryLoanService.updateSalaryLoan,
    onSuccess: (response) => {
      toast.success("Salary loan updated successfully");
      setCurrentLoan(response.data);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update salary loan");
    },
  });

  const processLoanMutation = useMutation({
    mutationFn: SalaryLoanService.processSalaryLoan,
    onSuccess: () => {
      toast.success("Salary loan processed successfully");
      // TODO: Refresh loan data or redirect
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to process salary loan");
    },
  });

  // Effects
  useEffect(() => {
    if (loanData?.data) {
      setCurrentLoan(loanData.data);
      setCoMakers(loanData.data.co_makers);
    }
  }, [loanData]);

  // Event handlers
  const handleBorrowerSelect = (borrower: Borrower) => {
    setSelectedBorrower(borrower);
  };

  const handleSaveAsDraft = (values: LoanComputationFormValues) => {
    const payload = {
      transaction_date: format(values.transaction_date, "yyyy-MM-dd"),
      borrower_id: values.borrower_id,
      date_granted: format(values.date_granted, "yyyy-MM-dd"),
      principal: values.principal,
      terms: values.terms,
      interest_rate: values.interest_rate,
      installment_period: values.installment_period,
      due_date: values.due_date,
      cash_card_amount: values.cash_card_amount,
      computer_fee: values.computer_fee,
      service_charge: values.service_charge,
      insurance: values.insurance,
      notarial_fees: values.notarial_fees,
      gross_receipts_tax: values.gross_receipts_tax,
      processing_fee: values.processing_fee,
      co_makers: coMakers.map((cm) => ({
        name: cm.name,
        address: cm.address,
        contact: cm.contact,
      })),
      prepared_by: values.prepared_by,
      approved_by: values.approved_by || "",
      remarks: values.remarks || "",
    };

    if (currentLoan) {
      updateLoanMutation.mutate({ ...payload, id: currentLoan.id });
    } else {
      createLoanMutation.mutate(payload);
    }
  };

  const handleProcess = () => {
    if (currentLoan) {
      processLoanMutation.mutate(currentLoan.id);
    } else {
      toast.error("Please save the loan first before processing");
    }
  };

  const handleReset = () => {
    setSelectedBorrower(null);
    setCurrentLoan(null);
    setCoMakers([]);
    setSelectedDivision("");
    setSelectedDistrict("");
    setBorrowerSearch("");
  };

  // Print handlers
  const handlePrintLoanDisclosure = () => {
    toast.info("Printing Loan Disclosure Statement...");
    // TODO: Implement actual print functionality
  };

  const handlePrintPromissoryNote = () => {
    toast.info("Printing Promissory Note...");
    // TODO: Implement actual print functionality
  };

  const handlePrintComakerStatement = () => {
    toast.info("Printing Comaker Statement...");
    // TODO: Implement actual print functionality
  };

  const handleProcessCheckVoucher = () => {
    toast.info("Processing Check Voucher...");
    setActiveTab("voucher");
    // TODO: Implement actual check voucher processing
  };

  const handleShowProfile = () => {
    setOpenProfileDrawer((prev) => !prev);
  };

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
            {/* Center Panel - Loan Processing */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Header - Fixed */}
              <div className="bg-white p-6 border-gray-200 flex-shrink-0 md:flex md:item-center md:justify-between">
                <h1 className="text-xl font-semibold">Borrower Information</h1>
                <Button
                  className="block 2xl:hidden"
                  size="sm"
                  onClick={handleShowProfile}
                >
                  View Profile
                </Button>
              </div>

              {/* Tabs Container - Flexible */}
              <div className="flex-1 flex flex-col overflow-hidden">
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="flex-1 flex flex-col overflow-hidden"
                >
                  {/* Tab List - Fixed */}
                  <TabsList className="flex justify-start border-b border-gray-200 bg-transparent rounded-none p-0 w-full flex-shrink-0">
                    <TabsTrigger
                      value="loan-computation"
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
                    <TabsContent
                      value="loan-computation"
                      className="h-full overflow-y-auto p-6 m-0"
                    >
                      <InformationTab
                        currentLoan={currentLoan}
                        borrowers={borrowersData?.data.borrowers || []}
                        coMakers={coMakers}
                        setCoMakers={setCoMakers}
                        onSaveAsDraft={handleSaveAsDraft}
                        onProcess={handleProcess}
                        onReset={handleReset}
                        isLoading={
                          createLoanMutation.isPending ||
                          updateLoanMutation.isPending
                        }
                      />
                    </TabsContent>

                    <TabsContent
                      value="voucher"
                      className="h-full overflow-y-auto p-6 m-0"
                    >
                      <VoucherTab
                        voucherData={voucherData?.data || null}
                        banks={banksData?.data.banks || []}
                        onReset={handleReset}
                        onSaveAsDraft={() =>
                          toast.info("Saving voucher as draft...")
                        }
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
              onPrintLoanDisclosure={handlePrintLoanDisclosure}
              onPrintPromissoryNote={handlePrintPromissoryNote}
              onPrintComakerStatement={handlePrintComakerStatement}
              onProcessCheckVoucher={handleProcessCheckVoucher}
            />
            <UserDetailsDrawer
              open={openProfileDrawer}
              onOpenChange={setOpenProfileDrawer}
              selectedBorrower={selectedBorrower}
              onPrintLoanDisclosure={handlePrintLoanDisclosure}
              onPrintPromissoryNote={handlePrintPromissoryNote}
              onPrintComakerStatement={handlePrintComakerStatement}
              onProcessCheckVoucher={handleProcessCheckVoucher}
            />
          </div>
        </div>
      ) : (
        <NoSelected description="Choose a borrower from the list to view their details." />
      )}
    </div>
  );
}

// export default BorrowerDashboard
