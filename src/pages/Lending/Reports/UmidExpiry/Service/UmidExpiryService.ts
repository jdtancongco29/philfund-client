import type {
  ApiResponse,
  UmidExpiryItem,
  GetAllUmidExpiryResponse,
  UmidExpiryFilters,
  CreateUmidExpiryPayload,
  UpdateUmidExpiryPayload,
} from "./UmidExpiryTypes"

// Dummy data for development
const dummyUmidCards: UmidExpiryItem[] = [
  {
    id: "1",
    borrowerName: "Juan Dela Cruz",
    expiryDate: "2025-05-01",
    daysRemaining: 20,
    accountNumber: "xxx-xxx-xxx-1234",
    umidCardNumber: "xxx-xxx-xxx-1234",
    typeOfUmidCard: "Landbank",
    status: "Active",
    phoneNumber: "+63 912 345 6789",
    email: "juan.delacruz@email.com",
    branch: "Cebu Main Branch",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    borrowerName: "Maria Santos",
    expiryDate: "2025-05-10",
    daysRemaining: 20,
    accountNumber: "xxx-xxx-xxx-1234",
    umidCardNumber: "xxx-xxx-xxx-1234",
    typeOfUmidCard: "Landbank",
    status: "Active",
    phoneNumber: "+63 912 345 6790",
    email: "maria.santos@email.com",
    branch: "Mandaue Branch",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "3",
    borrowerName: "Pedro Reyes",
    expiryDate: "2025-05-15",
    daysRemaining: 20,
    accountNumber: "xxx-xxx-xxx-1234",
    umidCardNumber: "xxx-xxx-xxx-1234",
    typeOfUmidCard: "Union Bank",
    status: "Active",
    phoneNumber: "+63 912 345 6791",
    email: "pedro.reyes@email.com",
    branch: "Talisay Branch",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
]

export const UmidExpiryService = {
  /**
   * Get all UMID cards with pagination and filters
   */
  getAllUmidCards: async (
    page?: number,
    limit?: number,
    search?: string | null,
    _order_by?: string | null,
    _sort?: string | null,
    filters?: UmidExpiryFilters,
  ): Promise<ApiResponse<GetAllUmidExpiryResponse>> => {
    // For development, return dummy data
    const filteredData = dummyUmidCards.filter((card) => {
      if (search && !card.borrowerName.toLowerCase().includes(search.toLowerCase())) {
        return false
      }
      if (filters?.branch && card.branch !== filters.branch) {
        return false
      }
      if (filters?.expiryThreshold) {
        const threshold = Number.parseInt(filters.expiryThreshold)
        if (card.daysRemaining > threshold) {
          return false
        }
      }
      return true
    })

    return {
      status: "success",
      message: "UMID cards retrieved successfully",
      data: {
        count: filteredData.length,
        umidCards: filteredData,
        pagination: {
          current_page: page || 1,
          per_page: limit || 10,
          total_pages: Math.ceil(filteredData.length / (limit || 10)),
          total_items: filteredData.length,
        },
      },
    }

    // Uncomment for real API integration
    /*
    const params = new URLSearchParams()
    if (page) params.append("page", page.toString())
    if (limit) params.append("per_page", limit.toString())
    if (search) params.append("search", search)
    if (order_by) params.append("order_by", order_by)
    if (sort) params.append("sort", sort)
    if (filters?.branch) params.append("branch", filters.branch)
    if (filters?.bank) params.append("bank", filters.bank)
    if (filters?.expiryThreshold) params.append("expiry_threshold", filters.expiryThreshold)

    const endpoint = `/umid-expiry${params.toString() ? `?${params.toString()}` : ""}`
    const response = await apiRequest<ApiResponse<GetAllUmidExpiryResponse>>("get", endpoint, null, {
      useAuth: true,
      useBranchId: true,
    })

    return response.data
    */
  },

  /**
   * Get a specific UMID card by ID
   */
  getUmidCardById: async (id: string): Promise<ApiResponse<UmidExpiryItem>> => {
    const card = dummyUmidCards.find((c) => c.id === id)
    if (!card) {
      throw new Error("UMID card not found")
    }

    return {
      status: "success",
      message: "UMID card retrieved successfully",
      data: card,
    }

    // Uncomment for real API integration
    /*
    const endpoint = `/umid-expiry/${id}`
    const response = await apiRequest<ApiResponse<UmidExpiryItem>>("get", endpoint, null, {
      useAuth: true,
      useBranchId: true,
    })

    return response.data
    */
  },

  /**
   * Create a new UMID card record
   */
  createUmidCard: async (payload: CreateUmidExpiryPayload): Promise<ApiResponse<UmidExpiryItem>> => {
    // For development, simulate creation
    const newCard: UmidExpiryItem = {
      id: Date.now().toString(),
      ...payload,
      status: "Active",
      daysRemaining: Math.floor(
        (new Date(payload.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
      ),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    return {
      status: "success",
      message: "UMID card created successfully",
      data: newCard,
    }

    // Uncomment for real API integration
    /*
    const endpoint = "/umid-expiry"
    const response = await apiRequest<ApiResponse<UmidExpiryItem>>("post", endpoint, payload, {
      useAuth: true,
      useBranchId: true,
    })

    return response.data
    */
  },

  /**
   * Update an existing UMID card
   */
  updateUmidCard: async (_id: string, payload: UpdateUmidExpiryPayload): Promise<ApiResponse<UmidExpiryItem>> => {
    // For development, simulate update
    const updatedCard: UmidExpiryItem = {
      ...payload,
      status: "Active",
      daysRemaining: Math.floor(
        (new Date(payload.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
      ),
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: new Date().toISOString(),
    }

    return {
      status: "success",
      message: "UMID card updated successfully",
      data: updatedCard,
    }

    // Uncomment for real API integration
    /*
    const endpoint = `/umid-expiry/${id}`
    const response = await apiRequest<ApiResponse<UmidExpiryItem>>("put", endpoint, payload, {
      useAuth: true,
      useBranchId: true,
    })

    return response.data
    */
  },

  /**
   * Delete a UMID card
   */
  deleteUmidCard: async (_id: string): Promise<ApiResponse<null>> => {
    return {
      status: "success",
      message: "UMID card deleted successfully",
      data: null,
    }

    // Uncomment for real API integration
    /*
    const endpoint = `/umid-expiry/${id}`
    const response = await apiRequest<ApiResponse<null>>("delete", endpoint, null, {
      useAuth: true,
      useBranchId: true,
    })

    return response.data
    */
  },

  /**
   * Export UMID cards to PDF
   */
  exportPdf: async () => {
    return {
      url: "https://example.com/umid-expiry-report.pdf",
    }

    // Uncomment for real API integration
    /*
    const endpoint = `/umid-expiry/export-pdf`
    const response = await apiRequest("get", endpoint, null, {
      useAuth: true,
      useBranchId: true,
    })
    return response.data
    */
  },

  /**
   * Export UMID cards to CSV
   */
  exportCsv: async () => {
    // For development, create a simple CSV blob
    const csvContent = [
      "Borrower Name,Expiry Date,Days Remaining,Account Number,UMID Card Number,Type of UMID Card",
      ...dummyUmidCards.map(
        (card) =>
          `${card.borrowerName},${card.expiryDate},${card.daysRemaining},${card.accountNumber},${card.umidCardNumber},${card.typeOfUmidCard}`,
      ),
    ].join("\n")

    return new Blob([csvContent], { type: "text/csv" })

    // Uncomment for real API integration
    /*
    const endpoint = `/umid-expiry/export-csv`
    const response = await apiRequest("get", endpoint, null, {
      useAuth: true,
      useBranchId: true,
      responseType: "blob",
    })
    return response.data
    */
  },
}

export default UmidExpiryService
