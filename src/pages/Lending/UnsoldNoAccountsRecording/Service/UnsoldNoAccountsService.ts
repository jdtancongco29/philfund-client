import type {
  ApiResponse,
  UnsoldNoAccountsRecord,
  GetAllUnsoldNoAccountsResponse,
  CreateUnsoldNoAccountsPayload,
  UpdateUnsoldNoAccountsPayload,
} from "./UnsoldNoAccountsTypes"

// Sample data for development
const sampleUnsoldNoAccountsRecords: UnsoldNoAccountsRecord[] = [
  {
    id: "1",
    reference_code: "REF-001",
    reference_name: "NAME-001",
    date: "2023-06-15",
    name: "Juan Dela Cruz",
    card_type: "ATM",
    category: "Bonus",
    remarks: "Bonus loan for employee performance",
    amount: 25000.0,
    released_by: "John Doe",
    received_by: "Maria Santos",
  },
  {
    id: "2",
    reference_code: "REF-002",
    reference_name: "NAME-002",
    date: "2023-06-15",
    name: "Jose Rizal",
    card_type: "UMID",
    category: "BL-CA",
    remarks: "Cash advance for medical expenses",
    amount: 10000.0,
    released_by: "Jane Smith",
    received_by: "Pedro Penduko",
  },
  {
    id: "3",
    reference_code: "REF-001",
    reference_name: "NAME-001",
    date: "2023-06-15",
    name: "Maria Clara",
    card_type: "ATM",
    category: "Bonus",
    remarks: "",
    amount: 5000.0,
    released_by: "John Doe",
    received_by: "Juan Luna",
  },
  {
    id: "4",
    reference_code: "REF-003",
    reference_name: "NAME-003",
    date: "2023-06-14",
    name: "Andres Bonifacio",
    card_type: "UMID",
    category: "Special",
    remarks: "Special bonus for project completion",
    amount: 15000.0,
    released_by: "Admin User",
    received_by: "Maria Santos",
  },
  {
    id: "5",
    reference_code: "REF-002",
    reference_name: "NAME-002",
    date: "2023-06-13",
    name: "Emilio Aguinaldo",
    card_type: "ATM",
    category: "BL-CA",
    remarks: "Emergency cash advance",
    amount: 8000.0,
    released_by: "Jane Smith",
    received_by: "Pedro Penduko",
  },
  {
    id: "6",
    reference_code: "REF-001",
    reference_name: "NAME-001",
    date: "2023-06-12",
    name: "Apolinario Mabini",
    card_type: "ATM",
    category: "Bonus",
    remarks: "Year-end bonus",
    amount: 30000.0,
    released_by: "John Doe",
    received_by: "Juan Luna",
  },
  {
    id: "7",
    reference_code: "REF-003",
    reference_name: "NAME-003",
    date: "2023-06-11",
    name: "Marcelo del Pilar",
    card_type: "UMID",
    category: "Special",
    remarks: "Special allowance for overtime work",
    amount: 12000.0,
    released_by: "Admin User",
    received_by: "Maria Santos",
  },
]

export const UnsoldNoAccountsService = {
  /**
   * Get all unsold/no accounts records with pagination
   */
  getAllUnsoldNoAccountsRecords: async (
    page = 1,
    limit = 10,
    search?: string | null,
    order_by?: string | null,
    sort?: string | null,
  ): Promise<ApiResponse<GetAllUnsoldNoAccountsResponse>> => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    let filteredRecords = [...sampleUnsoldNoAccountsRecords]

    // Apply search filter
    if (search) {
      filteredRecords = filteredRecords.filter(
        (record) =>
          record.name.toLowerCase().includes(search.toLowerCase()) ||
          record.card_type.toLowerCase().includes(search.toLowerCase()) ||
          record.category.toLowerCase().includes(search.toLowerCase()) ||
          record.released_by.toLowerCase().includes(search.toLowerCase()) ||
          record.received_by.toLowerCase().includes(search.toLowerCase()),
      )
    }

    // Apply sorting
    if (order_by && sort) {
      filteredRecords.sort((a, b) => {
        const aValue = a[order_by as keyof UnsoldNoAccountsRecord]
        const bValue = b[order_by as keyof UnsoldNoAccountsRecord]

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
    const paginatedRecords = filteredRecords.slice(startIndex, endIndex)

    return {
      status: "success",
      message: "Unsold/No accounts records retrieved successfully",
      data: {
        count: paginatedRecords.length,
        records: paginatedRecords,
        pagination: {
          current_page: page,
          per_page: limit,
          total_pages: Math.ceil(filteredRecords.length / limit),
          total_items: filteredRecords.length,
        },
      },
    }
  },

  /**
   * Get a specific record by ID
   */
  getUnsoldNoAccountsRecordById: async (id: string): Promise<ApiResponse<UnsoldNoAccountsRecord>> => {
    await new Promise((resolve) => setTimeout(resolve, 300))

    const record = sampleUnsoldNoAccountsRecords.find((r) => r.id === id)
    if (!record) {
      throw new Error("Record not found")
    }

    return {
      status: "success",
      message: "Record retrieved successfully",
      data: record,
    }
  },

  /**
   * Create a new record
   */
  createUnsoldNoAccountsRecord: async (
    payload: CreateUnsoldNoAccountsPayload,
  ): Promise<ApiResponse<UnsoldNoAccountsRecord>> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newRecord: UnsoldNoAccountsRecord = {
      id: Date.now().toString(),
      ...payload,
    }

    sampleUnsoldNoAccountsRecords.unshift(newRecord)

    return {
      status: "success",
      message: "Record created successfully",
      data: newRecord,
    }
  },

  /**
   * Update an existing record
   */
  updateUnsoldNoAccountsRecord: async (
    id: string,
    payload: UpdateUnsoldNoAccountsPayload,
  ): Promise<ApiResponse<UnsoldNoAccountsRecord>> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const index = sampleUnsoldNoAccountsRecords.findIndex((r) => r.id === id)
    if (index === -1) {
      throw new Error("Record not found")
    }

    const updatedRecord: UnsoldNoAccountsRecord = {
      ...sampleUnsoldNoAccountsRecords[index],
      ...payload,
    }

    sampleUnsoldNoAccountsRecords[index] = updatedRecord

    return {
      status: "success",
      message: "Record updated successfully",
      data: updatedRecord,
    }
  },

  /**
   * Delete a record
   */
  deleteUnsoldNoAccountsRecord: async (id: string): Promise<ApiResponse<null>> => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const index = sampleUnsoldNoAccountsRecords.findIndex((r) => r.id === id)
    if (index === -1) {
      throw new Error("Record not found")
    }

    sampleUnsoldNoAccountsRecords.splice(index, 1)

    return {
      status: "success",
      message: "Record deleted successfully",
      data: null,
    }
  },

  /**
   * Export records to PDF
   */
  exportPdf: async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return {
      status: "success",
      message: "PDF export completed",
      data: {
        url: "https://example.com/unsold-no-accounts.pdf",
      },
    }
  },

  /**
   * Export records to CSV
   */
  exportCsv: async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const csvContent = [
      "Date,Name,Card Type,Category,Amount,Released by,Received by,Remarks",
      ...sampleUnsoldNoAccountsRecords.map(
        (record) =>
          `${record.date},${record.name},${record.card_type},${record.category},${record.amount},${record.released_by},${record.received_by},"${record.remarks || ""}"`,
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    return blob
  },
}

export default UnsoldNoAccountsService
