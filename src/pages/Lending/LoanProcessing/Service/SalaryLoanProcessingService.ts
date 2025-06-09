// src/pages/Lending/LoanProcessing/Service/SalaryLoanProcessingService.tsx

import type {
  ApiResponse,
  GetBorrowersResponse,
  GetDivisionsResponse,
  GetDistrictsResponse,
  GetBanksResponse,
  SalaryLoan,
  CheckVoucher,
  GetAmortizationScheduleResponse,
  CreateSalaryLoanPayload,
  UpdateSalaryLoanPayload,
  SalaryLoanFilters,
  Borrower,
  Division,
  District,
  Bank,
  ExistingPayable,
  JournalEntry,
  AmortizationSchedule,
} from "./SalaryLoanProcessingTypes"

// TODO: Remove all sample data when integrating with real API
// Sample data for development
const sampleBorrowers: Borrower[] = [
  {
    id: "1",
    name: "Alvin Dela Cruz",
    division: "NCR",
    district: "Manila",
    address: "123 Main St",
    phone: "09123456789",
    email: "alvin@email.com",
  },
  {
    id: "2",
    name: "Marianne Santos",
    division: "NCR",
    district: "Quezon City",
    address: "456 Oak Ave",
    phone: "09234567890",
    email: "marianne@email.com",
  },
  {
    id: "3",
    name: "Jericho Mendoza",
    division: "Region 3",
    district: "Bulacan",
    address: "789 Pine Lane",
    phone: "09345678901",
    email: "jericho@email.com",
  },
  {
    id: "4",
    name: "Clarisse Tan",
    division: "NCR",
    district: "Makati",
    address: "321 Elm St",
    phone: "09456789012",
    email: "clarisse@email.com",
  },
  {
    id: "5",
    name: "Rafael Bautista",
    division: "Region 4A",
    district: "Laguna",
    address: "654 Maple Dr",
    phone: "09567890123",
    email: "rafael@email.com",
  },
  {
    id: "6",
    name: "Kristine Villanueva",
    division: "NCR",
    district: "Pasig",
    address: "987 Cedar Rd",
    phone: "09678901234",
    email: "kristine@email.com",
  },
  {
    id: "7",
    name: "Jonathan Reyes",
    division: "Region 3",
    district: "Pampanga",
    address: "147 Birch Ave",
    phone: "09789012345",
    email: "jonathan@email.com",
  },
  {
    id: "8",
    name: "Bianca Navarro",
    division: "NCR",
    district: "Taguig",
    address: "258 Spruce St",
    phone: "09890123456",
    email: "bianca@email.com",
  },
  {
    id: "9",
    name: "Daniel Ortega",
    division: "Region 4A",
    district: "Cavite",
    address: "369 Willow Ln",
    phone: "09901234567",
    email: "daniel@email.com",
  },
  {
    id: "10",
    name: "Alyssa Gomez",
    division: "NCR",
    district: "Pasay",
    address: "741 Ash Dr",
    phone: "09012345678",
    email: "alyssa@email.com",
  },
  {
    id: "11",
    name: "Juan dela Cruz",
    division: "Region 3",
    district: "Bataan",
    address: "852 Poplar St",
    phone: "09123456780",
    email: "juan@email.com",
  },
]

const sampleDivisions: Division[] = [
  { id: "1", name: "NCR" },
  { id: "2", name: "Region 3" },
  { id: "3", name: "Region 4A" },
  { id: "4", name: "Region 4B" },
]

const sampleDistricts: District[] = [
  { id: "1", name: "Manila", division_id: "1" },
  { id: "2", name: "Quezon City", division_id: "1" },
  { id: "3", name: "Makati", division_id: "1" },
  { id: "4", name: "Pasig", division_id: "1" },
  { id: "5", name: "Taguig", division_id: "1" },
  { id: "6", name: "Pasay", division_id: "1" },
  { id: "7", name: "Bulacan", division_id: "2" },
  { id: "8", name: "Pampanga", division_id: "2" },
  { id: "9", name: "Bataan", division_id: "2" },
  { id: "10", name: "Laguna", division_id: "3" },
  { id: "11", name: "Cavite", division_id: "3" },
]

const sampleBanks: Bank[] = [
  { id: "1", name: "BDO Unibank", code: "BDO" },
  { id: "2", name: "Bank of the Philippine Islands", code: "BPI" },
  { id: "3", name: "Metrobank", code: "MBTC" },
  { id: "4", name: "Land Bank of the Philippines", code: "LBP" },
  { id: "5", name: "Philippine National Bank", code: "PNB" },
]

const sampleExistingPayables: ExistingPayable[] = [
  {
    id: "1",
    pn_no: "29145",
    loan_type: "Salary Loan",
    monthly_amortization: 3500.0,
    overdraft: 0.0,
    total: 10500.0,
    amount_paid: "Type here...",
  },
]

const sampleJournalEntries: JournalEntry[] = [
  { id: "1", code: "2024-08-15", name: "Interest Receivable - Salary", debit: 336.0, credit: null },
  { id: "2", code: "2024-08-15", name: "Loans receivable - salary", debit: 200000, credit: null },
  { id: "3", code: "2024-08-15", name: "A/P Notarial (5 of LR)", debit: null, credit: 336000.0 },
  { id: "4", code: "2024-08-15", name: "Income - Service Charge SL (3 of LR)", debit: null, credit: 6000 },
  { id: "5", code: "2024-08-15", name: "AP Insurance (2% of LR)", debit: null, credit: 4000 },
  { id: "6", code: "2024-08-15", name: "A/P Income Tax (5 of LR)", debit: null, credit: 1000 },
  { id: "7", code: "2024-08-15", name: "Other Income computer (1% of LR)", debit: null, credit: 200 },
  { id: "8", code: "2024-08-15", name: "A/P PGA", debit: null, credit: 6000 },
  { id: "9", code: "2024-08-15", name: "Cash in Bank", debit: null, credit: 181800 },
]

const sampleAmortizationSchedule: AmortizationSchedule[] = [
  {
    id: "1",
    loan_id: "1",
    date: "2025-03-18",
    principal_amount_paid: 2083.33,
    principal_interest_paid: 3500.0,
    total_running_balance: 519250.01,
  },
  {
    id: "2",
    loan_id: "1",
    date: "2025-02-18",
    principal_amount_paid: 2083.33,
    principal_interest_paid: 3500.0,
    total_running_balance: 524833.34,
  },
  {
    id: "3",
    loan_id: "1",
    date: "2025-01-18",
    principal_amount_paid: 2083.33,
    principal_interest_paid: 3500.0,
    total_running_balance: 530416.67,
  },
]

export const SalaryLoanService = {
  /**
   * Get all divisions
   * TODO: Replace with actual API call: GET /api/v1/divisions
   */
  getDivisions: async (): Promise<ApiResponse<GetDivisionsResponse>> => {
    // TODO: Remove simulation delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    // TODO: Replace with actual API call
    // const response = await apiRequest<ApiResponse<GetDivisionsResponse>>("get", "/divisions", null, {
    //   useAuth: true,
    //   useBranchId: true,
    // })
    // return response.data

    return {
      status: "success",
      message: "Divisions retrieved successfully",
      data: {
        count: sampleDivisions.length,
        divisions: sampleDivisions,
      },
    }
  },

  /**
   * Get districts by division
   * TODO: Replace with actual API call: GET /api/v1/districts?division_id={divisionId}
   */
  getDistricts: async (divisionId?: string): Promise<ApiResponse<GetDistrictsResponse>> => {
    // TODO: Remove simulation delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    let filteredDistricts = sampleDistricts
    if (divisionId) {
      filteredDistricts = sampleDistricts.filter((d) => d.division_id === divisionId)
    }

    // TODO: Replace with actual API call
    // const params = new URLSearchParams()
    // if (divisionId) params.append("division_id", divisionId)
    // const endpoint = `/districts${params.toString() ? `?${params.toString()}` : ""}`
    // const response = await apiRequest<ApiResponse<GetDistrictsResponse>>("get", endpoint, null, {
    //   useAuth: true,
    //   useBranchId: true,
    // })
    // return response.data

    return {
      status: "success",
      message: "Districts retrieved successfully",
      data: {
        count: filteredDistricts.length,
        districts: filteredDistricts,
      },
    }
  },

  /**
   * Get borrowers with filters
   * TODO: Replace with actual API call: GET /api/v1/borrowers
   */
  getBorrowers: async (filters: SalaryLoanFilters = {}): Promise<ApiResponse<GetBorrowersResponse>> => {
    // TODO: Remove simulation delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    let filteredBorrowers = [...sampleBorrowers]

    // Apply filters
    if (filters.division) {
      const division = sampleDivisions.find((d) => d.id === filters.division)
      if (division) {
        filteredBorrowers = filteredBorrowers.filter((b) => b.division === division.name)
      }
    }

    if (filters.district) {
      const district = sampleDistricts.find((d) => d.id === filters.district)
      if (district) {
        filteredBorrowers = filteredBorrowers.filter((b) => b.district === district.name)
      }
    }

    if (filters.borrower_search) {
      filteredBorrowers = filteredBorrowers.filter((b) =>
        b.name.toLowerCase().includes(filters.borrower_search!.toLowerCase()),
      )
    }

    // TODO: Replace with actual API call
    // const params = new URLSearchParams()
    // if (filters.division) params.append("division", filters.division)
    // if (filters.district) params.append("district", filters.district)
    // if (filters.borrower_search) params.append("search", filters.borrower_search)
    // const endpoint = `/borrowers${params.toString() ? `?${params.toString()}` : ""}`
    // const response = await apiRequest<ApiResponse<GetBorrowersResponse>>("get", endpoint, null, {
    //   useAuth: true,
    //   useBranchId: true,
    // })
    // return response.data

    return {
      status: "success",
      message: "Borrowers retrieved successfully",
      data: {
        count: filteredBorrowers.length,
        borrowers: filteredBorrowers,
        pagination: {
          current_page: 1,
          per_page: filteredBorrowers.length,
          total_pages: 1,
          total_items: filteredBorrowers.length,
        },
      },
    }
  },

  /**
   * Get banks
   * TODO: Replace with actual API call: GET /api/v1/banks
   */
  getBanks: async (): Promise<ApiResponse<GetBanksResponse>> => {
    // TODO: Remove simulation delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    // TODO: Replace with actual API call
    // const response = await apiRequest<ApiResponse<GetBanksResponse>>("get", "/banks", null, {
    //   useAuth: true,
    //   useBranchId: true,
    // })
    // return response.data

    return {
      status: "success",
      message: "Banks retrieved successfully",
      data: {
        count: sampleBanks.length,
        banks: sampleBanks,
      },
    }
  },

  /**
   * Get salary loan by ID
   * TODO: Replace with actual API call: GET /api/v1/salary-loans/{id}
   */
  getSalaryLoan: async (id: string): Promise<ApiResponse<SalaryLoan>> => {
    console.log(id)
    // TODO: Remove simulation delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // TODO: Replace with actual API call
    // const response = await apiRequest<ApiResponse<SalaryLoan>>("get", `/salary-loans/${id}`, null, {
    //   useAuth: true,
    //   useBranchId: true,
    // })
    // return response.data

    // Sample loan data
    const sampleLoan: SalaryLoan = {
      id: "1",
      transaction_date: "2025-04-24",
      pn_no: "29687",
      borrower_id: "11",
      borrower_name: "Juan dela Cruz",
      date_granted: "2025-12-18",
      principal: 200000.0,
      terms: 96,
      interest_rate: 1.75,
      interest: 135000.0,
      installment_period: "01/18/2026 - 12/18/2033",
      due_date: "May 2025",
      total_payable: 224000.0,
      monthly_amortization: 2000.0,
      total_interest_over_term: 224000.0,
      cash_card_amount: 0.0,
      computer_fee: 200.0,
      service_charge: 8000.0,
      insurance: 6000.0,
      notarial_fees: 3000.0,
      gross_receipts_tax: 1000.0,
      processing_fee: 18200.0,
      total_deductions: 18200.0,
      net_proceeds: 181800.0,
      co_makers: [{ id: "1", name: "Sarah Williams", address: "789 Pine Lane", contact: "555-246-8012" }],
      existing_payables: sampleExistingPayables,
      prepared_by: "Current User Name",
      approved_by: "",
      status: "draft",
      remarks: "Borrower is a long-time employee with a good credit history.",
    }

    return {
      status: "success",
      message: "Salary loan retrieved successfully",
      data: sampleLoan,
    }
  },

  /**
   * Create salary loan
   * TODO: Replace with actual API call: POST /api/v1/salary-loans
   */
  createSalaryLoan: async (payload: CreateSalaryLoanPayload): Promise<ApiResponse<SalaryLoan>> => {
    // TODO: Remove simulation delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // TODO: Replace with actual API call
    // try {
    //   const response = await apiRequest<ApiResponse<SalaryLoan>>("post", "/salary-loans", payload, {
    //     useAuth: true,
    //     useBranchId: true,
    //   })
    //   return response.data
    // } catch (error: any) {
    //   const errorMessage = error.response?.data?.message || "Failed to create salary loan"
    //   throw new Error(errorMessage)
    // }

    // Simulate successful creation
    const newLoan: SalaryLoan = {
      id: Date.now().toString(),
      ...payload,
      pn_no: `PN-${Date.now()}`,
      borrower_name: sampleBorrowers.find((b) => b.id === payload.borrower_id)?.name || "Unknown",
      interest: payload.principal * (payload.interest_rate / 100) * payload.terms,
      total_payable: payload.principal + payload.principal * (payload.interest_rate / 100) * payload.terms,
      monthly_amortization:
        (payload.principal + payload.principal * (payload.interest_rate / 100) * payload.terms) / payload.terms,
      total_interest_over_term: payload.principal * (payload.interest_rate / 100) * payload.terms,
      total_deductions:
        payload.cash_card_amount +
        payload.computer_fee +
        payload.service_charge +
        payload.insurance +
        payload.notarial_fees +
        payload.gross_receipts_tax +
        payload.processing_fee,
      net_proceeds:
        payload.principal -
        (payload.cash_card_amount +
          payload.computer_fee +
          payload.service_charge +
          payload.insurance +
          payload.notarial_fees +
          payload.gross_receipts_tax +
          payload.processing_fee),
      co_makers: payload.co_makers.map((cm, index) => ({ ...cm, id: (index + 1).toString() })),
      existing_payables: sampleExistingPayables,
      status: "draft",
    }

    return {
      status: "success",
      message: "Salary loan created successfully",
      data: newLoan,
    }
  },

  /**
   * Update salary loan
   * TODO: Replace with actual API call: PUT /api/v1/salary-loans/{id}
   */
  updateSalaryLoan: async (payload: UpdateSalaryLoanPayload): Promise<ApiResponse<SalaryLoan>> => {
    // TODO: Remove simulation delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // TODO: Replace with actual API call
    // try {
    //   const response = await apiRequest<ApiResponse<SalaryLoan>>("put", `/salary-loans/${payload.id}`, payload, {
    //     useAuth: true,
    //     useBranchId: true,
    //   })
    //   return response.data
    // } catch (error: any) {
    //   const errorMessage = error.response?.data?.message || "Failed to update salary loan"
    //   throw new Error(errorMessage)
    // }

    // Simulate successful update
    const updatedLoan: SalaryLoan = {
      ...payload,
      pn_no: "29687",
      borrower_name: sampleBorrowers.find((b) => b.id === payload.borrower_id)?.name || "Unknown",
      interest: payload.principal * (payload.interest_rate / 100) * payload.terms,
      total_payable: payload.principal + payload.principal * (payload.interest_rate / 100) * payload.terms,
      monthly_amortization:
        (payload.principal + payload.principal * (payload.interest_rate / 100) * payload.terms) / payload.terms,
      total_interest_over_term: payload.principal * (payload.interest_rate / 100) * payload.terms,
      total_deductions:
        payload.cash_card_amount +
        payload.computer_fee +
        payload.service_charge +
        payload.insurance +
        payload.notarial_fees +
        payload.gross_receipts_tax +
        payload.processing_fee,
      net_proceeds:
        payload.principal -
        (payload.cash_card_amount +
          payload.computer_fee +
          payload.service_charge +
          payload.insurance +
          payload.notarial_fees +
          payload.gross_receipts_tax +
          payload.processing_fee),
      co_makers: payload.co_makers.map((cm, index) => ({ ...cm, id: (index + 1).toString() })),
      existing_payables: sampleExistingPayables,
      status: "draft",
    }

    return {
      status: "success",
      message: "Salary loan updated successfully",
      data: updatedLoan,
    }
  },

  /**
   * Get check voucher by loan ID
   * TODO: Replace with actual API call: GET /api/v1/salary-loans/{loanId}/voucher
   */
  getCheckVoucher: async (loanId: string): Promise<ApiResponse<CheckVoucher>> => {
    // TODO: Remove simulation delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // TODO: Replace with actual API call
    // const response = await apiRequest<ApiResponse<CheckVoucher>>("get", `/salary-loans/${loanId}/voucher`, null, {
    //   useAuth: true,
    //   useBranchId: true,
    // })
    // return response.data

    const sampleVoucher: CheckVoucher = {
      id: "1",
      loan_id: loanId,
      promissory_note_number: "PN-2024-08-001",
      reference_code: "CV-2024-08-001",
      reference_number: "12345",
      borrower_name: "Jane Doe",
      bank: "BDO Unibank",
      check_number: "67890",
      amount_on_check: 181800.0,
      amount_in_words: "One hundred eighty-one thousand eight hundred pesos",
      monthly_amortization_amount: 5583.33,
      interest_rate: 1.75,
      installment_period: "01/18/2025 - 12/18/2033",
      journal_entries: sampleJournalEntries,
      include_journal_entries_in_printing: false,
    }

    return {
      status: "success",
      message: "Check voucher retrieved successfully",
      data: sampleVoucher,
    }
  },

  /**
   * Get amortization schedule by loan ID
   * TODO: Replace with actual API call: GET /api/v1/salary-loans/{loanId}/amortization
   */
  getAmortizationSchedule: async (loanId: string): Promise<ApiResponse<GetAmortizationScheduleResponse>> => {
    console.log(loanId)
    // TODO: Remove simulation delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // TODO: Replace with actual API call
    // const response = await apiRequest<ApiResponse<GetAmortizationScheduleResponse>>("get", `/salary-loans/${loanId}/amortization`, null, {
    //   useAuth: true,
    //   useBranchId: true,
    // })
    // return response.data

    return {
      status: "success",
      message: "Amortization schedule retrieved successfully",
      data: {
        count: sampleAmortizationSchedule.length,
        schedule: sampleAmortizationSchedule,
      },
    }
  },

  /**
   * Process salary loan (change status to processed)
   * TODO: Replace with actual API call: POST /api/v1/salary-loans/{id}/process
   */
  processSalaryLoan: async (id: string): Promise<ApiResponse<null>> => {
    console.log(id)
    // TODO: Remove simulation delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // TODO: Replace with actual API call
    // try {
    //   const response = await apiRequest<ApiResponse<null>>("post", `/salary-loans/${id}/process`, null, {
    //     useAuth: true,
    //     useBranchId: true,
    //   })
    //   return response.data
    // } catch (error: any) {
    //   const errorMessage = error.response?.data?.message || "Failed to process salary loan"
    //   throw new Error(errorMessage)
    // }

    return {
      status: "success",
      message: "Salary loan processed successfully",
      data: null,
    }
  },
}

export default SalaryLoanService
