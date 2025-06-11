import type {
  ApiResponse,
  GetBorrowersResponse,
  GetDivisionsResponse,
  GetDistrictsResponse,
  LoanPayOff,
  CreateLoanPayOffPayload,
  UpdateLoanPayOffPayload,
  LoanPayOffFilters,
  Borrower,
  Division,
  District,
  JournalEntry,
} from "./LoanPayOffTypes"

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
    name: "Juan dela Cruz",
    division: "Region 3",
    district: "Bataan",
    address: "852 Poplar St",
    phone: "09123456780",
    email: "juan@email.com",
    age: 30,
  },
]

const sampleDivisions: Division[] = [
  { id: "1", name: "NCR" },
  { id: "2", name: "Region 3" },
  { id: "3", name: "Region 4A" },
]

const sampleDistricts: District[] = [
  { id: "1", name: "Manila", division_id: "1" },
  { id: "2", name: "Quezon City", division_id: "1" },
  { id: "3", name: "Bataan", division_id: "2" },
]

const sampleJournalEntries: JournalEntry[] = [
  { id: "1", code: "2024-08-15", name: "Cash in Bank", debit: 181500.0, credit: null },
  { id: "2", code: "2024-08-15", name: "Salary Loans Receivable", debit: null, credit: 181200.0 },
  { id: "3", code: "2024-08-15", name: "Unearned Interest Income", debit: null, credit: null },
]

export const LoanPayOffService = {
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

  getBorrowers: async (filters: LoanPayOffFilters = {}): Promise<ApiResponse<GetBorrowersResponse>> => {
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

  getLoanPayOff: async (id: string): Promise<ApiResponse<LoanPayOff>> => {
    console.log(id)
    await new Promise((resolve) => setTimeout(resolve, 500))

    const sampleLoanPayOff: LoanPayOff = {
      id: "1",
      borrower_id: "3",
      borrower_name: "Juan dela Cruz",
      reference_code: "REF-001",
      reference_name: "NAME-001",
      date_range_from: "2024-01-01",
      date_range_to: "2024-12-31",
      paid_by_insurance: 0,
      loan_type: "salary",
      search_user: "",
      status: "draft",
      journal_entries: sampleJournalEntries,
    }

    return {
      status: "success",
      message: "Loan pay off retrieved successfully",
      data: sampleLoanPayOff,
    }
  },

  createLoanPayOff: async (payload: CreateLoanPayOffPayload): Promise<ApiResponse<LoanPayOff>> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newLoanPayOff: LoanPayOff = {
      id: Date.now().toString(),
      ...payload,
      borrower_name: sampleBorrowers.find((b) => b.id === payload.borrower_id)?.name || "Unknown",
      journal_entries: sampleJournalEntries,
      status: "draft",
    }

    return {
      status: "success",
      message: "Loan pay off created successfully",
      data: newLoanPayOff,
    }
  },

  updateLoanPayOff: async (payload: UpdateLoanPayOffPayload): Promise<ApiResponse<LoanPayOff>> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const updatedLoanPayOff: LoanPayOff = {
      ...payload,
      borrower_name: sampleBorrowers.find((b) => b.id === payload.borrower_id)?.name || "Unknown",
      journal_entries: sampleJournalEntries,
      status: "draft",
    }

    return {
      status: "success",
      message: "Loan pay off updated successfully",
      data: updatedLoanPayOff,
    }
  },

  processLoanPayOff: async (id: string): Promise<ApiResponse<null>> => {
    console.log(id)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return {
      status: "success",
      message: "Loan pay off processed successfully",
      data: null,
    }
  },
}

export default LoanPayOffService
