import type {
  ApiResponse,
  CheckEncashment,
  GetAllCheckEncashmentResponse,
  CreateCheckEncashmentPayload,
  UpdateCheckEncashmentPayload,
  JournalEntry,
} from "./CheckEncashmentTypes"

// Sample journal entries
const sampleJournalEntries: JournalEntry[] = [
  {
    id: "1",
    code: "2024-08-15",
    name: "Cash in Bank",
    debit: 181500.0,
    credit: null,
  },
  {
    id: "2",
    code: "2024-08-15",
    name: "Salary Loans Receivable",
    debit: null,
    credit: 18200.0,
  },
  {
    id: "3",
    code: "2024-08-15",
    name: "Unearned Interest Income",
    debit: null,
    credit: null,
  },
]

// Sample data for development
const sampleCheckEncashments: CheckEncashment[] = [
  {
    id: "1",
    reference_code: "REF-001",
    reference_no: "REF-2023-001",
    check_no: "CHK-2023-001",
    payee: "Jane Doe",
    date: "2025-04-18",
    amount: 10000.0,
    processing_fee: 100.0,
    net_amount: 9900.0,
    remarks: "Check encashment for salary",
    journal_entries: sampleJournalEntries,
  },
  {
    id: "2",
    reference_code: "REF-002",
    reference_no: "REF-2023-002",
    check_no: "CHK-2023-002",
    payee: "Juan Dela Cruz",
    date: "2025-04-18",
    amount: 15000.0,
    processing_fee: 150.0,
    net_amount: 14850.0,
    remarks: "Bonus check encashment",
    journal_entries: sampleJournalEntries,
  },
  {
    id: "3",
    reference_code: "REF-001",
    reference_no: "REF-2023-003",
    check_no: "CHK-2023-003",
    payee: "Maria Santos",
    date: "2025-04-17",
    amount: 8000.0,
    processing_fee: 80.0,
    net_amount: 7920.0,
    remarks: "Emergency check encashment",
    journal_entries: sampleJournalEntries,
  },
  {
    id: "4",
    reference_code: "REF-003",
    reference_no: "REF-2023-004",
    check_no: "CHK-2023-004",
    payee: "Pedro Penduko",
    date: "2025-04-17",
    amount: 12000.0,
    processing_fee: 120.0,
    net_amount: 11880.0,
    remarks: "Overtime pay check",
    journal_entries: sampleJournalEntries,
  },
  {
    id: "5",
    reference_code: "REF-002",
    reference_no: "REF-2023-005",
    check_no: "CHK-2023-005",
    payee: "Jose Rizal",
    date: "2025-04-16",
    amount: 20000.0,
    processing_fee: 200.0,
    net_amount: 19800.0,
    remarks: "Commission check encashment",
    journal_entries: sampleJournalEntries,
  },
  {
    id: "6",
    reference_code: "REF-001",
    reference_no: "REF-2023-006",
    check_no: "CHK-2023-006",
    payee: "Andres Bonifacio",
    date: "2025-04-16",
    amount: 5000.0,
    processing_fee: 50.0,
    net_amount: 4950.0,
    remarks: "Allowance check",
    journal_entries: sampleJournalEntries,
  },
  {
    id: "7",
    reference_code: "REF-003",
    reference_no: "REF-2023-007",
    check_no: "CHK-2023-007",
    payee: "Emilio Aguinaldo",
    date: "2025-04-15",
    amount: 25000.0,
    processing_fee: 250.0,
    net_amount: 24750.0,
    remarks: "Performance bonus check",
    journal_entries: sampleJournalEntries,
  },
  {
    id: "8",
    reference_code: "REF-002",
    reference_no: "REF-2023-008",
    check_no: "CHK-2023-008",
    payee: "Apolinario Mabini",
    date: "2025-04-15",
    amount: 7500.0,
    processing_fee: 75.0,
    net_amount: 7425.0,
    remarks: "Consultant fee check",
    journal_entries: sampleJournalEntries,
  },
  {
    id: "9",
    reference_code: "REF-001",
    reference_no: "REF-2023-009",
    check_no: "CHK-2023-009",
    payee: "Marcelo del Pilar",
    date: "2025-04-14",
    amount: 18000.0,
    processing_fee: 180.0,
    net_amount: 17820.0,
    remarks: "Project completion bonus",
    journal_entries: sampleJournalEntries,
  },
  {
    id: "10",
    reference_code: "REF-003",
    reference_no: "REF-2023-010",
    check_no: "CHK-2023-010",
    payee: "Graciano Lopez Jaena",
    date: "2025-04-14",
    amount: 13000.0,
    processing_fee: 130.0,
    net_amount: 12870.0,
    remarks: "Training allowance check",
    journal_entries: sampleJournalEntries,
  },
]

export const CheckEncashmentService = {
  /**
   * Get all check encashments with pagination and filters
   */
  getAllCheckEncashments: async (
    page = 1,
    limit = 10,
    search?: string | null,
    dateFrom?: string | null,
    dateTo?: string | null,
    order_by?: string | null,
    sort?: string | null,
  ): Promise<ApiResponse<GetAllCheckEncashmentResponse>> => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    let filteredEncashments = [...sampleCheckEncashments]

    // Apply search filter
    if (search) {
      filteredEncashments = filteredEncashments.filter(
        (encashment) =>
          encashment.check_no.toLowerCase().includes(search.toLowerCase()) ||
          encashment.payee.toLowerCase().includes(search.toLowerCase()) ||
          encashment.reference_no.toLowerCase().includes(search.toLowerCase()),
      )
    }

    // Apply date range filter
    if (dateFrom) {
      filteredEncashments = filteredEncashments.filter((encashment) => encashment.date >= dateFrom)
    }
    if (dateTo) {
      filteredEncashments = filteredEncashments.filter((encashment) => encashment.date <= dateTo)
    }

    // Apply sorting
    if (order_by && sort) {
      filteredEncashments.sort((a, b) => {
        const aValue = a[order_by as keyof CheckEncashment]
        const bValue = b[order_by as keyof CheckEncashment]

        if (typeof aValue === "number" && typeof bValue === "number") {
          return sort === "asc" ? aValue - bValue : bValue - aValue
        }

        const aStr = String(aValue)
        const bStr = String(bValue)

        if (sort === "asc") {
          return aStr.localeCompare(bStr)
        } else {
          return bStr.localeCompare(aStr)
        }
      })
    }

    // Apply pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedEncashments = filteredEncashments.slice(startIndex, endIndex)

    return {
      status: "success",
      message: "Check encashments retrieved successfully",
      data: {
        count: paginatedEncashments.length,
        encashments: paginatedEncashments,
        pagination: {
          current_page: page,
          per_page: limit,
          total_pages: Math.ceil(filteredEncashments.length / limit),
          total_items: filteredEncashments.length,
        },
      },
    }
  },

  /**
   * Get a specific check encashment by ID
   */
  getCheckEncashmentById: async (id: string): Promise<ApiResponse<CheckEncashment>> => {
    await new Promise((resolve) => setTimeout(resolve, 300))

    const encashment = sampleCheckEncashments.find((e) => e.id === id)
    if (!encashment) {
      throw new Error("Check encashment not found")
    }

    return {
      status: "success",
      message: "Check encashment retrieved successfully",
      data: encashment,
    }
  },

  /**
   * Create a new check encashment
   */
  createCheckEncashment: async (payload: CreateCheckEncashmentPayload): Promise<ApiResponse<CheckEncashment>> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newEncashment: CheckEncashment = {
      id: Date.now().toString(),
      ...payload,
    }

    sampleCheckEncashments.unshift(newEncashment)

    return {
      status: "success",
      message: "Check encashment created successfully",
      data: newEncashment,
    }
  },

  /**
   * Update an existing check encashment
   */
  updateCheckEncashment: async (
    id: string,
    payload: UpdateCheckEncashmentPayload,
  ): Promise<ApiResponse<CheckEncashment>> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const index = sampleCheckEncashments.findIndex((e) => e.id === id)
    if (index === -1) {
      throw new Error("Check encashment not found")
    }

    const updatedEncashment: CheckEncashment = {
      ...sampleCheckEncashments[index],
      ...payload,
    }

    sampleCheckEncashments[index] = updatedEncashment

    return {
      status: "success",
      message: "Check encashment updated successfully",
      data: updatedEncashment,
    }
  },

  /**
   * Delete a check encashment
   */
  deleteCheckEncashment: async (id: string): Promise<ApiResponse<null>> => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const index = sampleCheckEncashments.findIndex((e) => e.id === id)
    if (index === -1) {
      throw new Error("Check encashment not found")
    }

    sampleCheckEncashments.splice(index, 1)

    return {
      status: "success",
      message: "Check encashment deleted successfully",
      data: null,
    }
  },

  /**
   * Export check encashments to PDF
   */
  exportPdf: async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return {
      status: "success",
      message: "PDF export completed",
      data: {
        url: "https://example.com/check-encashment.pdf",
      },
    }
  },

  /**
   * Export check encashments to CSV
   */
  exportCsv: async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const csvContent = [
      "Date,Check No.,Payee,Amount,Processing Fee,Net Amount,Remarks",
      ...sampleCheckEncashments.map(
        (encashment) =>
          `${encashment.date},${encashment.check_no},${encashment.payee},${encashment.amount},${encashment.processing_fee},${encashment.net_amount},"${encashment.remarks || ""}"`,
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    return blob
  },
}

export default CheckEncashmentService
