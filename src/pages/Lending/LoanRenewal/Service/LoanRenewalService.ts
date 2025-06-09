import type {
  ApiResponse,
  GetBorrowersResponse,
  GetDivisionsResponse,
  GetDistrictsResponse,
  GetExistingLoansResponse,
  LoanRenewalFilters,
  RenewLoansPayload,
} from "./LoanRenewalTypes"

// Sample data
const sampleBorrowers = [
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
    name: "Juan dela Cruz",
    division: "Region 3",
    district: "Bataan",
    address: "852 Poplar St",
    phone: "09123456780",
    email: "juan@email.com",
    age: 30,
  },
]

const sampleDivisions = [
  { id: "1", name: "NCR" },
  { id: "2", name: "Region 3" },
  { id: "3", name: "Region 4A" },
]

const sampleDistricts = [
  { id: "1", name: "Manila", division_id: "1" },
  { id: "2", name: "Quezon City", division_id: "1" },
  { id: "9", name: "Bataan", division_id: "2" },
]

const sampleExistingLoans = [
  {
    id: "1",
    pn_number: "PN-2023-001",
    loan_type: "Salary Loan",
    original_amount: 50000.0,
    interest_rate: 0.015,
    term: 12,
    total_payable: 910180.0,
    months_paid: 6,
    total_payments: 5090.0,
    outstanding_balance: 1090.0,
    rebates: 1090.0,
  },
  {
    id: "2",
    pn_number: "PN-2023-002",
    loan_type: "Salary Loan",
    original_amount: 75000.0,
    interest_rate: 0.015,
    term: 24,
    total_payable: 920180.0,
    months_paid: 8,
    total_payments: 6090.0,
    outstanding_balance: 2090.0,
    rebates: 2090.0,
  },
]

export const LoanRenewalService = {
  getDivisions: async (): Promise<ApiResponse<GetDivisionsResponse>> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return {
      status: "success",
      message: "Divisions retrieved successfully",
      data: {
        count: sampleDivisions.length,
        divisions: sampleDivisions,
      },
    }
  },

  getDistricts: async (divisionId?: string): Promise<ApiResponse<GetDistrictsResponse>> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    let filteredDistricts = sampleDistricts
    if (divisionId) {
      filteredDistricts = sampleDistricts.filter((d) => d.division_id === divisionId)
    }
    return {
      status: "success",
      message: "Districts retrieved successfully",
      data: {
        count: filteredDistricts.length,
        districts: filteredDistricts,
      },
    }
  },

  getBorrowers: async (filters: LoanRenewalFilters = {}): Promise<ApiResponse<GetBorrowersResponse>> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    let filteredBorrowers = [...sampleBorrowers]

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

  getExistingLoans: async (borrowerId: string): Promise<ApiResponse<GetExistingLoansResponse>> => {
    console.log(borrowerId)
    await new Promise((resolve) => setTimeout(resolve, 500))

    return {
      status: "success",
      message: "Existing loans retrieved successfully",
      data: {
        count: sampleExistingLoans.length,
        loans: sampleExistingLoans,
      },
    }
  },

  renewLoans: async (payload: RenewLoansPayload): Promise<ApiResponse<null>> => {
    console.log(payload)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return {
      status: "success",
      message: "Loans renewed successfully",
      data: null,
    }
  },
}

export default LoanRenewalService
