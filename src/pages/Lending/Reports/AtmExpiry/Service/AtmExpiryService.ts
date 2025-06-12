import type {
  ApiResponse,
  AtmExpiryItem,
  GetAllAtmExpiryResponse,
  UpdateAtmExpiryPayload,
  AtmExpiryFilters,
} from "./AtmExpiryTypes"

// Dummy data for development
const dummyData: AtmExpiryItem[] = [
  {
    id: "1",
    borrowerName: "Juan Dela Cruz",
    expiryDate: "2025-05-01",
    daysRemaining: 2,
    accountNumber: "xxx-xxxx-xxxx-5678",
    atmCardNumber: "xxx-xxxx-xxxx-5678",
    bankBranch: "Cebu Main Branch",
    bankName: "BDO",
    status: "Expiring Soon",
    phoneNumber: "+63 912 345 6789",
    email: "juan.delacruz@email.com",
    issueDate: "2020-05-01",
    cardType: "Debit Card",
    lastUsed: "2024-04-28",
  },
  {
    id: "2",
    borrowerName: "Maria Santos",
    expiryDate: "2025-05-10",
    daysRemaining: 2,
    accountNumber: "xxx-xxxx-xxxx-5678",
    atmCardNumber: "xxx-xxxx-xxxx-5678",
    bankBranch: "Mandaue Branch",
    bankName: "Metrobank",
    status: "Expiring Soon",
    phoneNumber: "+63 923 456 7890",
    email: "maria.santos@email.com",
    issueDate: "2020-05-10",
    cardType: "Debit Card",
    lastUsed: "2024-04-29",
  },
  {
    id: "3",
    borrowerName: "Pedro Reyes",
    expiryDate: "2025-05-15",
    daysRemaining: 2,
    accountNumber: "xxx-xxxx-xxxx-5678",
    atmCardNumber: "xxx-xxxx-xxxx-5678",
    bankBranch: "Talisay Branch",
    bankName: "BPI",
    status: "Expiring Soon",
    phoneNumber: "+63 934 567 8901",
    email: "pedro.reyes@email.com",
    issueDate: "2020-05-15",
    cardType: "Debit Card",
    lastUsed: "2024-04-30",
  },
  {
    id: "4",
    borrowerName: "Ana Garcia",
    expiryDate: "2025-06-01",
    daysRemaining: 33,
    accountNumber: "xxx-xxxx-xxxx-9012",
    atmCardNumber: "xxx-xxxx-xxxx-9012",
    bankBranch: "Lapu-Lapu Branch",
    bankName: "UnionBank",
    status: "Active",
    phoneNumber: "+63 945 678 9012",
    email: "ana.garcia@email.com",
    issueDate: "2020-06-01",
    cardType: "Debit Card",
    lastUsed: "2024-04-27",
  },
  {
    id: "5",
    borrowerName: "Carlos Mendoza",
    expiryDate: "2024-04-15",
    daysRemaining: -15,
    accountNumber: "xxx-xxxx-xxxx-3456",
    atmCardNumber: "xxx-xxxx-xxxx-3456",
    bankBranch: "Bohol Branch",
    bankName: "Security Bank",
    status: "Expired",
    phoneNumber: "+63 956 789 0123",
    email: "carlos.mendoza@email.com",
    issueDate: "2019-04-15",
    cardType: "Debit Card",
    lastUsed: "2024-04-10",
  },
]

export const AtmExpiryService = {
  /**
   * Get all ATM cards with pagination
   */
  getAllAtmCards: async (
    page?: number,
    limit?: number,
    search?: string | null,
    order_by?: string | null,
    sort?: string | null,
    filters?: AtmExpiryFilters,
  ): Promise<ApiResponse<GetAllAtmExpiryResponse>> => {
    const params = new URLSearchParams()
    if (page) params.append("page", page.toString())
    if (limit) params.append("per_page", limit.toString())
    if (search) params.append("search", search)
    if (order_by) params.append("order_by", order_by)
    if (sort) params.append("sort", sort)

    // Add filters if provided
    if (filters) {
      if (filters.branch) params.append("branch", filters.branch)
      if (filters.bank) params.append("bank", filters.bank)
      if (filters.expiryThreshold) params.append("expiry_threshold", filters.expiryThreshold)
    }

    // For development, return dummy data
    // In production, uncomment the API call below
    /*
    const endpoint = `/atm-expiry${params.toString() ? `?${params.toString()}` : ""}`
    const response = await apiRequest<ApiResponse<GetAllAtmExpiryResponse>>("get", endpoint, null, {
      useAuth: true,
      useBranchId: true,
    })
    return response.data
    */

    // Simulate API response with dummy data
    await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate network delay

    // Apply filters to dummy data
    let filteredData = [...dummyData]

    if (search) {
      const searchLower = search.toLowerCase()
      filteredData = filteredData.filter(
        (item) =>
          item.borrowerName.toLowerCase().includes(searchLower) ||
          item.accountNumber.toLowerCase().includes(searchLower) ||
          item.atmCardNumber.toLowerCase().includes(searchLower),
      )
    }

    if (filters?.branch) {
      filteredData = filteredData.filter((item) => item.bankBranch === filters.branch)
    }

    if (filters?.bank) {
      filteredData = filteredData.filter((item) => item.bankName === filters.bank)
    }

    if (filters?.expiryThreshold) {
      const threshold = Number.parseInt(filters.expiryThreshold)
      filteredData = filteredData.filter((item) => item.daysRemaining <= threshold)
    }

    // Apply sorting
    if (order_by && sort) {
      filteredData.sort((a, b) => {
        const aValue = a[order_by as keyof AtmExpiryItem]
        const bValue = b[order_by as keyof AtmExpiryItem]

        if (sort === "desc") {
          return aValue < bValue ? 1 : -1
        }
        return aValue > bValue ? 1 : -1
      })
    }

    // Apply pagination
    const startIndex = ((page || 1) - 1) * (limit || 10)
    const endIndex = startIndex + (limit || 10)
    const paginatedData = filteredData.slice(startIndex, endIndex)

    return {
      status: "success",
      message: "ATM cards retrieved successfully",
      data: {
        count: filteredData.length,
        atmCards: paginatedData,
        pagination: {
          current_page: page || 1,
          per_page: limit || 10,
          total_pages: Math.ceil(filteredData.length / (limit || 10)),
          total_items: filteredData.length,
        },
      },
    }
  },

  /**
   * Get a specific ATM card by ID
   */
  getAtmCardById: async (id: string): Promise<ApiResponse<AtmExpiryItem>> => {
    // For development, return dummy data
    // In production, uncomment the API call below
    /*
    const endpoint = `/atm-expiry/${id}`
    const response = await apiRequest<ApiResponse<AtmExpiryItem>>("get", endpoint, null, {
      useAuth: true,
      useBranchId: true,
    })
    return response.data
    */

    await new Promise((resolve) => setTimeout(resolve, 300)) // Simulate network delay

    const item = dummyData.find((card) => card.id === id)

    if (!item) {
      throw new Error("ATM card not found")
    }

    return {
      status: "success",
      message: "ATM card retrieved successfully",
      data: item,
    }
  },

  /**
   * Update an existing ATM card
   */
  updateAtmCard: async (id: string, payload: UpdateAtmExpiryPayload): Promise<ApiResponse<AtmExpiryItem>> => {
    // For development, update dummy data
    // In production, uncomment the API call below
    /*
    const endpoint = `/atm-expiry/${id}`
    try {
      const response = await apiRequest<ApiResponse<AtmExpiryItem>>("put", endpoint, payload, {
        useAuth: true,
        useBranchId: true,
      })
      return response.data
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to update ATM card"
      console.log(errorMessage);
      throw error
    }
    */

    await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate network delay

    const index = dummyData.findIndex((card) => card.id === id)

    if (index === -1) {
      throw new Error("ATM card not found")
    }

    // Update the card
    dummyData[index] = {
      ...dummyData[index],
      ...payload,
    }

    return {
      status: "success",
      message: "ATM card updated successfully",
      data: dummyData[index],
    }
  },

  /**
   * Export ATM cards to PDF
   */
  exportPdf: async () => {
    // For development, simulate PDF export
    // In production, uncomment the API call below
    /*
    const endpoint = `/atm-expiry/export-pdf`
    try {
      const response = await apiRequest("get", endpoint, null, {
        useAuth: true,
        useBranchId: true,
      })
      return response.data
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to export PDF"
      throw new Error(errorMessage)
    }
    */

    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate network delay

    return {
      status: "success",
      message: "PDF exported successfully",
      url: "https://example.com/sample.pdf", // Dummy URL
    }
  },

  /**
   * Export ATM cards to CSV
   */
  exportCsv: async () => {
    // For development, simulate CSV export
    // In production, uncomment the API call below
    /*
    const endpoint = `/atm-expiry/export-csv`
    try {
      const response = await apiRequest("get", endpoint, null, {
        useAuth: true,
        useBranchId: true,
        responseType: "blob",
      })
      return response.data
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to export CSV"
      throw new Error(errorMessage)
    }
    */

    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate network delay

    // Create a simple CSV string
    const csvContent = [
      "Borrower Name,Expiry Date,Days Remaining,Account Number,ATM Card Number,Bank Branch,Bank Name",
      ...dummyData.map(
        (item) =>
          `${item.borrowerName},${item.expiryDate},${item.daysRemaining},${item.accountNumber},${item.atmCardNumber},${item.bankBranch},${item.bankName}`,
      ),
    ].join("\n")

    // Convert to Blob
    return new Blob([csvContent], { type: "text/csv" })
  },
}

export default AtmExpiryService
