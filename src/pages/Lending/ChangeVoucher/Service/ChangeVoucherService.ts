import type {
  ApiResponse,
  GetBorrowersResponse,
  GetDivisionsResponse,
  GetDistrictsResponse,
  GetChangeVoucherEntriesResponse,
  ChangeVoucherFilters,
  UpdateChangeVoucherEntryPayload,
} from "./ChangeVoucherTypes"

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

const sampleChangeVoucherEntries = Array.from({ length: 6 }, (_, i) => ({
  id: (i + 1).toString(),
  date: "04/18/2025",
  change_voucher: "CHG-2023-001",
  payee: "Jane Doe",
  amount_paid: 10000.0,
  change: 100.0,
  reference_code: "CHG-2024-001",
  reference_no: "12345",
  transaction_date: "April 14, 2025",
  change_voucher_number: "CV-001",
  borrower_name: "Jane Doe",
}))

export const ChangeVoucherService = {
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

  getBorrowers: async (filters: ChangeVoucherFilters = {}): Promise<ApiResponse<GetBorrowersResponse>> => {
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

  getChangeVoucherEntries: async (
    filters: ChangeVoucherFilters = {},
  ): Promise<ApiResponse<GetChangeVoucherEntriesResponse>> => {
    console.log(filters)
    await new Promise((resolve) => setTimeout(resolve, 500))

    return {
      status: "success",
      message: "Change voucher entries retrieved successfully",
      data: {
        count: sampleChangeVoucherEntries.length,
        entries: sampleChangeVoucherEntries,
      },
    }
  },

  updateChangeVoucherEntry: async (payload: UpdateChangeVoucherEntryPayload): Promise<ApiResponse<null>> => {
    console.log(payload)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return {
      status: "success",
      message: "Change voucher entry updated successfully",
      data: null,
    }
  },

  deleteChangeVoucherEntry: async (id: string): Promise<ApiResponse<null>> => {
    console.log(id)
    await new Promise((resolve) => setTimeout(resolve, 500))

    return {
      status: "success",
      message: "Change voucher entry deleted successfully",
      data: null,
    }
  },
}

export default ChangeVoucherService
