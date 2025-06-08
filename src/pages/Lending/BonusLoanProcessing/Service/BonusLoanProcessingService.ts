import type {
  ApiResponse,
  GetBorrowersResponse,
  GetDivisionsResponse,
  GetDistrictsResponse,
  BonusLoan,
  CreateBonusLoanPayload,
  UpdateBonusLoanPayload,
  BonusLoanFilters,
} from "./BonusLoanProcessingTypes"

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

export const BonusLoanService = {
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

  getBorrowers: async (filters: BonusLoanFilters = {}): Promise<ApiResponse<GetBorrowersResponse>> => {
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

  getBonusLoan: async (id: string): Promise<ApiResponse<BonusLoan>> => {
    console.log(id)
    await new Promise((resolve) => setTimeout(resolve, 500))

    const sampleBonusLoan: BonusLoan = {
      id: "1",
      transaction_date: "2025-04-24",
      borrower_id: "2",
      borrower_name: "Juan dela Cruz",
      loan_type: "bonus",
      promissory_no: "PN-3434-2342",
      date_granted: "2025-11-20",
      principal_amount: 22000.0,
      interest_amount: 5.0,
      cut_off_date: "May 31, 2026",
      no_of_days: 20,
      computed_interest: 7077.31,
      total_payable: 29077.31,
      co_makers: [{ id: "1", name: "Sarah Williams", address: "789 Pine Lane", contact: "555-246-8012" }],
      existing_payables: [
        {
          id: "1",
          pn_no: "29145",
          loan_type: "Salary Loan",
          monthly_amortization: 3500.0,
          overdraft: 0.0,
          total: 3500.0,
          amount_paid: "Type here...",
        },
      ],
      prepared_by: "Current User Name",
      approved_by: "",
      status: "draft",
      remarks: "Borrower is a long-time employee with a good credit history.",
    }

    return {
      status: "success",
      message: "Bonus loan retrieved successfully",
      data: sampleBonusLoan,
    }
  },

  createBonusLoan: async (payload: CreateBonusLoanPayload): Promise<ApiResponse<BonusLoan>> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newBonusLoan: BonusLoan = {
      id: Date.now().toString(),
      ...payload,
      borrower_name: sampleBorrowers.find((b) => b.id === payload.borrower_id)?.name || "Unknown",
      co_makers: payload.co_makers.map((cm, index) => ({ ...cm, id: (index + 1).toString() })),
      existing_payables: [],
      status: "draft",
    }

    return {
      status: "success",
      message: "Bonus loan created successfully",
      data: newBonusLoan,
    }
  },

  updateBonusLoan: async (payload: UpdateBonusLoanPayload): Promise<ApiResponse<BonusLoan>> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const updatedBonusLoan: BonusLoan = {
      ...payload,
      borrower_name: sampleBorrowers.find((b) => b.id === payload.borrower_id)?.name || "Unknown",
      co_makers: payload.co_makers.map((cm, index) => ({ ...cm, id: (index + 1).toString() })),
      existing_payables: [],
      status: "draft",
    }

    return {
      status: "success",
      message: "Bonus loan updated successfully",
      data: updatedBonusLoan,
    }
  },

  processBonusLoan: async (id: string): Promise<ApiResponse<null>> => {
    console.log(id)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return {
      status: "success",
      message: "Bonus loan processed successfully",
      data: null,
    }
  },
}

export default BonusLoanService