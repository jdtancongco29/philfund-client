import type {
  ApiResponse,
  CardsMonitoringItem,
  GetAllCardsMonitoringResponse,
  CardsMonitoringFilters,
} from "./CardsMonitoringTypes"

// Dummy data for development
const dummyCards: CardsMonitoringItem[] = [
  {
    id: "1",
    borrowerName: "Juan Dela Cruz",
    cardType: "ATM",
    cardStatus: "Sign out",
    dateSignedOut: "2025-05-01",
    signedOutBy: "admin1",
    reasonForRelease: "Card claim",
    custodian: "cashier2",
    branch: "Cebu Main Branch",
    districtName: "District 1",
    division: "Division A",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    borrowerName: "Juan Dela Cruz",
    cardType: "ATM",
    cardStatus: "Sign out",
    dateSignedOut: "2025-05-01",
    signedOutBy: "admin1",
    reasonForRelease: "Card claim",
    custodian: "cashier2",
    branch: "Cebu Main Branch",
    districtName: "District 1",
    division: "Division A",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "3",
    borrowerName: "Juan Dela Cruz",
    cardType: "UMID",
    cardStatus: "Sign out",
    dateSignedOut: "2025-05-01",
    signedOutBy: "admin1",
    reasonForRelease: "Card claim",
    custodian: "cashier2",
    branch: "Cebu Main Branch",
    districtName: "District 1",
    division: "Division A",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
]

export const CardsMonitoringService = {
  /**
   * Get all cards with pagination and filters
   */
  getAllCards: async (
    page?: number,
    limit?: number,
    search?: string | null,
    _order_by?: string | null,
    _sort?: string | null,
    filters?: CardsMonitoringFilters,
  ): Promise<ApiResponse<GetAllCardsMonitoringResponse>> => {
    // For development, return dummy data
    const filteredData = dummyCards.filter((card) => {
      if (search && !card.borrowerName.toLowerCase().includes(search.toLowerCase())) {
        return false
      }
      if (filters?.branch && card.branch !== filters.branch) {
        return false
      }
      if (filters?.cardType && card.cardType !== filters.cardType) {
        return false
      }
      if (filters?.cardStatus && card.cardStatus !== filters.cardStatus) {
        return false
      }
      if (filters?.districtName && card.districtName !== filters.districtName) {
        return false
      }
      if (filters?.division && card.division !== filters.division) {
        return false
      }
      return true
    })

    return {
      status: "success",
      message: "Cards retrieved successfully",
      data: {
        count: filteredData.length,
        cards: filteredData,
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
    if (filters?.cardType) params.append("card_type", filters.cardType)
    if (filters?.cardStatus) params.append("card_status", filters.cardStatus)
    if (filters?.districtName) params.append("district_name", filters.districtName)
    if (filters?.division) params.append("division", filters.division)

    const endpoint = `/cards-monitoring${params.toString() ? `?${params.toString()}` : ""}`
    const response = await apiRequest<ApiResponse<GetAllCardsMonitoringResponse>>("get", endpoint, null, {
      useAuth: true,
      useBranchId: true,
    })

    return response.data
    */
  },

  /**
   * Export cards to PDF
   */
  exportPdf: async () => {
    return {
      url: "https://example.com/cards-monitoring-report.pdf",
    }

    // Uncomment for real API integration
    /*
    const endpoint = `/cards-monitoring/export-pdf`
    const response = await apiRequest("get", endpoint, null, {
      useAuth: true,
      useBranchId: true,
    })
    return response.data
    */
  },

  /**
   * Export cards to CSV
   */
  exportCsv: async () => {
    // For development, create a simple CSV blob
    const csvContent = [
      "Borrower Name,Card Type,Card Status,Date Signed Out,Signed Out By,Reason for Release,Custodian",
      ...dummyCards.map(
        (card) =>
          `${card.borrowerName},${card.cardType},${card.cardStatus},${card.dateSignedOut},${card.signedOutBy},${card.reasonForRelease},${card.custodian}`,
      ),
    ].join("\n")

    return new Blob([csvContent], { type: "text/csv" })

    // Uncomment for real API integration
    /*
    const endpoint = `/cards-monitoring/export-csv`
    const response = await apiRequest("get", endpoint, null, {
      useAuth: true,
      useBranchId: true,
      responseType: "blob",
    })
    return response.data
    */
  },
}

export default CardsMonitoringService
