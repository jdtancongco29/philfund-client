// src/pages/Lending/CashAdvanceProcessing/Service/CashAdvanceProcessingService.ts

import type {
  ApiResponse,
  GetBorrowersResponse,
  GetDivisionsResponse,
  GetDistrictsResponse,
  CashAdvance,
  CreateCashAdvancePayload,
  UpdateCashAdvancePayload,
  CashAdvanceFilters,
  Borrower,
  Division,
  District,
  JournalEntry,
} from "./CashAdvanceProcessingTypes"

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
    age: 30,
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

const sampleJournalEntries: JournalEntry[] = [
  { id: "1", code: "2024-08-05", name: "Loans Receivable - CA", debit: 5000.0, credit: null },
  { id: "2", code: "2024-08-05", name: "Interest Receivable - CA", debit: 250.0, credit: null },
  { id: "3", code: "2024-08-05", name: "Cash on Hand - OCF", debit: 5000.0, credit: null },
  { id: "4", code: "2024-08-05", name: "Cash on Hand - OCF", debit: null, credit: 5000.0 },
  { id: "5", code: "2024-08-05", name: "Unearned Interest Income", debit: null, credit: 250.0 },
]

export const CashAdvanceService = {
  /**
   * Get all divisions
   * TODO: Replace with actual API call: GET /api/v1/divisions
   */
  getDivisions: async (): Promise<ApiResponse<GetDivisionsResponse>> => {
    // TODO: Remove simulation delay
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
  getBorrowers: async (filters: CashAdvanceFilters = {}): Promise<ApiResponse<GetBorrowersResponse>> => {
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
   * Get cash advance by ID
   * TODO: Replace with actual API call: GET /api/v1/cash-advances/{id}
   */
  getCashAdvance: async (id: string): Promise<ApiResponse<CashAdvance>> => {
    console.log(id)
    // TODO: Remove simulation delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Sample cash advance data
    const sampleCashAdvance: CashAdvance = {
      id: "1",
      transaction_date: "2024-08-05",
      borrower_id: "11",
      borrower_name: "Juan dela Cruz",
      reference_code: "CA-2024-001",
      reference_number: "12345",
      amount: 5000.0,
      journal_entries: sampleJournalEntries,
      prepared_by: "Current User Name",
      approved_by: "",
      status: "draft",
      remarks: "Cash advance for employee expenses.",
    }

    return {
      status: "success",
      message: "Cash advance retrieved successfully",
      data: sampleCashAdvance,
    }
  },

  /**
   * Create cash advance
   * TODO: Replace with actual API call: POST /api/v1/cash-advances
   */
  createCashAdvance: async (payload: CreateCashAdvancePayload): Promise<ApiResponse<CashAdvance>> => {
    // TODO: Remove simulation delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Simulate successful creation
    const newCashAdvance: CashAdvance = {
      id: Date.now().toString(),
      ...payload,
      borrower_name: sampleBorrowers.find((b) => b.id === payload.borrower_id)?.name || "Unknown",
      journal_entries: sampleJournalEntries,
      status: "draft",
    }

    return {
      status: "success",
      message: "Cash advance created successfully",
      data: newCashAdvance,
    }
  },

  /**
   * Update cash advance
   * TODO: Replace with actual API call: PUT /api/v1/cash-advances/{id}
   */
  updateCashAdvance: async (payload: UpdateCashAdvancePayload): Promise<ApiResponse<CashAdvance>> => {
    // TODO: Remove simulation delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Simulate successful update
    const updatedCashAdvance: CashAdvance = {
      ...payload,
      borrower_name: sampleBorrowers.find((b) => b.id === payload.borrower_id)?.name || "Unknown",
      journal_entries: sampleJournalEntries,
      status: "draft",
    }

    return {
      status: "success",
      message: "Cash advance updated successfully",
      data: updatedCashAdvance,
    }
  },

  /**
   * Process cash advance (change status to processed)
   * TODO: Replace with actual API call: POST /api/v1/cash-advances/{id}/process
   */
  processCashAdvance: async (id: string): Promise<ApiResponse<null>> => {
    console.log(id)
    // TODO: Remove simulation delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return {
      status: "success",
      message: "Cash advance processed successfully",
      data: null,
    }
  },
}

export default CashAdvanceService
