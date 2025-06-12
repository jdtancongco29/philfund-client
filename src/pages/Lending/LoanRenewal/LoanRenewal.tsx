"use client"

import { useState, useMemo } from "react"
import { useQuery, useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { BorrowerSearchPanel, type Borrower } from "@/components/borrower-search/borrower-search-panel"
import { DataTableV2, type ColumnDefinition } from "@/components/data-table/data-table-v2"
import { Button } from "@/components/ui/button"
import LoanRenewalService from "./Service/LoanRenewalService"
import type { LoanRenewalFilters, ExistingLoan } from "./Service/LoanRenewalTypes"
import { RenewalLoanDialog } from "./Dialog/RenewalLoanDialog"
import NoSelected from "@/components/no-selected"

export function LoanRenewal() {
  // State management
  const [selectedDivision, setSelectedDivision] = useState<string>("")
  const [selectedDistrict, setSelectedDistrict] = useState<string>("")
  const [borrowerSearch, setBorrowerSearch] = useState<string>("")
  const [selectedBorrower, setSelectedBorrower] = useState<Borrower | null>(null)
  const [selectedLoans, setSelectedLoans] = useState<ExistingLoan[]>([])
  const [openRenewalDialog, setOpenRenewalDialog] = useState(false)

  // Build filters
  const filters: LoanRenewalFilters = useMemo(
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
    queryFn: () => LoanRenewalService.getDivisions(),
    staleTime: 10 * 60 * 1000,
  })

  const { data: districtsData } = useQuery({
    queryKey: ["districts", selectedDivision],
    queryFn: () => LoanRenewalService.getDistricts(selectedDivision),
    enabled: !!selectedDivision,
    staleTime: 10 * 60 * 1000,
  })

  const { data: borrowersData, isLoading: isLoadingBorrowers } = useQuery({
    queryKey: ["borrowers", filters],
    queryFn: () => LoanRenewalService.getBorrowers(filters),
    staleTime: 5 * 60 * 1000,
  })

  // Fetch existing loans when borrower is selected
  const { data: existingLoansData, isLoading: isLoadingLoans } = useQuery({
    queryKey: ["existing-loans", selectedBorrower?.id],
    queryFn: () => LoanRenewalService.getExistingLoans(selectedBorrower!.id),
    enabled: !!selectedBorrower,
    staleTime: 0,
  })

  // Mutations
  const renewLoansMutation = useMutation({
    mutationFn: LoanRenewalService.renewLoans,
    onSuccess: () => {
      toast.success("Loans renewed successfully")
      setSelectedLoans([])
      setOpenRenewalDialog(false)
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to renew loans")
    },
  })

  // Event handlers
  const handleBorrowerSelect = (borrower: Borrower) => {
    setSelectedBorrower(borrower)
    setSelectedLoans([])
  }

  const handleReset = () => {
    setSelectedBorrower(null)
    setSelectedLoans([])
    setSelectedDivision("")
    setSelectedDistrict("")
    setBorrowerSearch("")
  }

  const handleLoanSelection = (loans: ExistingLoan[]) => {
    setSelectedLoans(loans)
  }

  const handleRenewLoans = () => {
    if (selectedLoans.length === 0) {
      toast.error("Please select loans to renew")
      return
    }
    setOpenRenewalDialog(true)
  }

//   const handleRestructure = () => {
//     if (selectedLoans.length === 0) {
//       toast.error("Please select loans to restructure")
//       return
//     }
//     toast.info("Restructuring loans...")
//   }

  const handleReloan = () => {
    if (selectedLoans.length === 0) {
      toast.error("Please select loans to reloan")
      return
    }
    toast.info("Processing reloan...")
  }

  // Table columns
  const columns: ColumnDefinition<ExistingLoan>[] = [
    {
      id: "pn_number",
      header: "PN Number",
      accessorKey: "pn_number",
      enableSorting: true,
    },
    {
      id: "loan_type",
      header: "Loan Type",
      accessorKey: "loan_type",
      enableSorting: true,
    },
    {
      id: "original_amount",
      header: "Original Amount",
      accessorKey: "original_amount",
      align: "right",
      cell: (item) => `₱${item.original_amount.toLocaleString()}`,
    },
    {
      id: "interest_rate",
      header: "Interest Rate",
      accessorKey: "interest_rate",
      align: "center",
      cell: (item) => `${item.interest_rate}%`,
    },
    {
      id: "term",
      header: "Term",
      accessorKey: "term",
      align: "center",
    },
    {
      id: "total_payable",
      header: "Total Payable",
      accessorKey: "total_payable",
      align: "right",
      cell: (item) => `₱${item.total_payable.toLocaleString()}`,
    },
    {
      id: "months_paid",
      header: "Months Paid",
      accessorKey: "months_paid",
      align: "center",
    },
    {
      id: "total_payments",
      header: "Total Payments",
      accessorKey: "total_payments",
      align: "right",
      cell: (item) => `₱${item.total_payments.toLocaleString()}`,
    },
    {
      id: "outstanding_balance",
      header: "Outstanding Bal.",
      accessorKey: "outstanding_balance",
      align: "right",
      cell: (item) => `₱${item.outstanding_balance.toLocaleString()}`,
    },
    {
      id: "rebates",
      header: "Rebates",
      accessorKey: "rebates",
      align: "right",
      cell: (item) => `₱${item.rebates.toLocaleString()}`,
    },
  ]

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
          <div className="flex-1 overflow-hidden p-6">
            <h1 className="text-2xl font-semibold mb-4">Loan Restructuring</h1>
            <DataTableV2
              title="Existing Loans"
              subtitle="Select for Reconstruction"
              data={existingLoansData?.data.loans || []}
              columns={columns}
              enableSelection={true}
              onLoading={isLoadingLoans}
              selectedItems={selectedLoans}
              onSelectionChange={handleLoanSelection}
              totalCount={existingLoansData?.data.count || 0}
              pageNumber={1}
              perPage={10}
              enableFilter={false}
              enableNew={false}
              enableCsvExport={false}
              enablePdfExport={false}
              search={{
                title: "Search",
                placeholder: "Search user...",
                enableSearch: true,
              }}
            />
          </div>

          <div className="border-t border-gray-200 bg-white p-4 flex justify-end gap-2 flex-shrink-0">
            <Button variant="outline" onClick={() => setSelectedLoans([])}>
              Cancel
            </Button>
            <Button variant="outline" onClick={handleReloan}>
              Reloan
            </Button>
            <Button onClick={handleRenewLoans}>Restructure</Button>
          </div>
        </div>
      ) : (
        <NoSelected description="Choose a borrower from the list to view their existing loans." />
      )}

      {/* Renewal Dialog */}
      <RenewalLoanDialog
        open={openRenewalDialog}
        onOpenChange={setOpenRenewalDialog}
        selectedLoans={selectedLoans}
        onRenew={(renewalData) => {
          renewLoansMutation.mutate({
            loan_ids: selectedLoans.map((loan) => loan.id),
            ...renewalData,
          })
        }}
        isLoading={renewLoansMutation.isPending}
      />
    </div>
  )
}