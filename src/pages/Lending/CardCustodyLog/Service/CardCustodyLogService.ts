import type {
  ApiResponse,
  CardCustodyLog,
  GetAllCardCustodyLogResponse,
  CreateCardCustodyLogPayload,
  UpdateCardCustodyLogPayload,
} from "./CardCustodyLogTypes"

// Sample data for development
const sampleCardCustodyLogs: CardCustodyLog[] = [
  {
    id: "1",
    reference_code: "REF-001",
    reference_name: "NAME-001",
    date: "2023-06-15",
    name: "Juan Dela Cruz",
    card_type: "ATM",
    transaction: "Sign out",
    is_borrower: true,
    custodian: "Maria Santos",
    date_returned: "2023-06-20",
    remarks: "Card issued for salary loan",
    processed_by: "John Doe",
  },
  {
    id: "2",
    reference_code: "REF-002",
    reference_name: "NAME-002",
    date: "2023-06-15",
    name: "Jose Rizal",
    card_type: "UMID",
    transaction: "Returned",
    is_borrower: false,
    custodian: "Pedro Penduko",
    date_returned: "2023-06-18",
    remarks: "Card returned after loan completion",
    processed_by: "John Doe",
  },
  {
    id: "3",
    reference_code: "REF-001",
    reference_name: "NAME-001",
    date: "2023-06-15",
    name: "Maria Clara",
    card_type: "ATM",
    transaction: "Sign out",
    is_borrower: true,
    custodian: "Juan Luna",
    remarks: "",
    processed_by: "Jane Smith",
  },
  {
    id: "4",
    reference_code: "REF-003",
    reference_name: "NAME-003",
    date: "2023-06-14",
    name: "Andres Bonifacio",
    card_type: "UMID",
    transaction: "Sign out",
    is_borrower: true,
    custodian: "Maria Santos",
    remarks: "Emergency loan card issuance",
    processed_by: "John Doe",
  },
  {
    id: "5",
    reference_code: "REF-002",
    reference_name: "NAME-002",
    date: "2023-06-13",
    name: "Emilio Aguinaldo",
    card_type: "ATM",
    transaction: "Returned",
    is_borrower: false,
    custodian: "Pedro Penduko",
    date_returned: "2023-06-16",
    remarks: "Card returned in good condition",
    processed_by: "Jane Smith",
  },
]

export const CardCustodyLogService = {
  /**
   * Get all card custody logs with pagination
   */
  getAllCardCustodyLogs: async (
    page = 1,
    limit = 10,
    search?: string | null,
    order_by?: string | null,
    sort?: string | null,
  ): Promise<ApiResponse<GetAllCardCustodyLogResponse>> => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    let filteredLogs = [...sampleCardCustodyLogs]

    // Apply search filter
    if (search) {
      filteredLogs = filteredLogs.filter(
        (log) =>
          log.name.toLowerCase().includes(search.toLowerCase()) ||
          log.card_type.toLowerCase().includes(search.toLowerCase()) ||
          log.transaction.toLowerCase().includes(search.toLowerCase()) ||
          log.custodian.toLowerCase().includes(search.toLowerCase()),
      )
    }

    // Apply sorting
    if (order_by && sort) {
      filteredLogs.sort((a, b) => {
        const aValue = a[order_by as keyof CardCustodyLog] as string
        const bValue = b[order_by as keyof CardCustodyLog] as string

        if (sort === "asc") {
          return aValue.localeCompare(bValue)
        } else {
          return bValue.localeCompare(aValue)
        }
      })
    }

    // Apply pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedLogs = filteredLogs.slice(startIndex, endIndex)

    return {
      status: "success",
      message: "Card custody logs retrieved successfully",
      data: {
        count: paginatedLogs.length,
        logs: paginatedLogs,
        pagination: {
          current_page: page,
          per_page: limit,
          total_pages: Math.ceil(filteredLogs.length / limit),
          total_items: filteredLogs.length,
        },
      },
    }
  },

  /**
   * Get a specific card custody log by ID
   */
  getCardCustodyLogById: async (id: string): Promise<ApiResponse<CardCustodyLog>> => {
    await new Promise((resolve) => setTimeout(resolve, 300))

    const log = sampleCardCustodyLogs.find((l) => l.id === id)
    if (!log) {
      throw new Error("Card custody log not found")
    }

    return {
      status: "success",
      message: "Card custody log retrieved successfully",
      data: log,
    }
  },

  /**
   * Create a new card custody log
   */
  createCardCustodyLog: async (payload: CreateCardCustodyLogPayload): Promise<ApiResponse<CardCustodyLog>> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // const newLog: CardCustodyLog = {
    //   id: Date.now().toString(),
    //   ...payload,
    //   processed_by: "Current User",
    // }

    // sampleCardCustodyLogs.unshift(newLog)

    return {
      status: "success",
      message: "Card custody log created successfully",
      data: payload as CardCustodyLog, // Return the payload as the created log
    }
  },

  /**
   * Update an existing card custody log
   */
  updateCardCustodyLog: async (
    id: string,
    payload: UpdateCardCustodyLogPayload,
  ): Promise<ApiResponse<CardCustodyLog>> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const index = sampleCardCustodyLogs.findIndex((l) => l.id === id)
    if (index === -1) {
      throw new Error("Card custody log not found")
    }

    // const updatedLog: CardCustodyLog = {
    //   ...sampleCardCustodyLogs[index],
    //   ...payload,
    // }

    // sampleCardCustodyLogs[index] = updatedLog

    return {
      status: "success",
      message: "Card custody log updated successfully",
      data: payload as CardCustodyLog, // Return the payload as the updated log
    }
  },

  /**
   * Delete a card custody log
   */
  deleteCardCustodyLog: async (id: string): Promise<ApiResponse<null>> => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const index = sampleCardCustodyLogs.findIndex((l) => l.id === id)
    if (index === -1) {
      throw new Error("Card custody log not found")
    }

    sampleCardCustodyLogs.splice(index, 1)

    return {
      status: "success",
      message: "Card custody log deleted successfully",
      data: null,
    }
  },

  /**
   * Export card custody logs to PDF
   */
  exportPdf: async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return {
      status: "success",
      message: "PDF export completed",
      data: {
        url: "https://example.com/card-custody-log.pdf",
      },
    }
  },

  /**
   * Export card custody logs to CSV
   */
  exportCsv: async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const csvContent = [
      "Date,Name,Card Type,Transaction,Custodian,Remarks,Processed by",
      ...sampleCardCustodyLogs.map(
        (log) =>
          `${log.date},${log.name},${log.card_type},${log.transaction},${log.custodian},"${log.remarks || ""}",${log.processed_by}`,
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    return blob
  },
}

export default CardCustodyLogService