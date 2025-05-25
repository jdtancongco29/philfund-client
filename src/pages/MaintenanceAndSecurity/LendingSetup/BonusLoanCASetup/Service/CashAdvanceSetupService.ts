import { apiRequest } from "@/lib/api"
import type {
  ApiResponse,
  CashAdvanceSetup,
  CashAdvanceSetupDetail,
  CreateCashAdvanceSetupPayload,
  GetAllCashAdvanceSetupsResponse,
  GetAllCOAResponse,
  UpdateCashAdvanceSetupPayload,
  UpdateCashAdvanceSetupStatusPayload,
} from "./CashAdvanceSetupTypes"

// Cash Advance Setup Service
export const CashAdvanceSetupService = {
  /**
   * Get all cash advance setups with pagination
   */
  getAllCashAdvanceSetups: async (
    page?: number,
    limit?: number,
    search?: string | null,
  ): Promise<ApiResponse<GetAllCashAdvanceSetupsResponse>> => {
    const params = new URLSearchParams()
    if (page) params.append("page", page.toString())
    if (limit) params.append("per_page", limit.toString())
    if (search) params.append("search", search)

    const endpoint = `/cash-advance-setup${params.toString() ? `?${params.toString()}` : ""}`
    const response = await apiRequest<ApiResponse<GetAllCashAdvanceSetupsResponse>>("get", endpoint, null, {
      useAuth: true,
      useBranchId: true,
    })

    return response.data
  },

  /**
   * Get a specific cash advance setup by ID
   */
  getCashAdvanceSetupById: async (id: string): Promise<ApiResponse<CashAdvanceSetupDetail>> => {
    const endpoint = `/cash-advance-setup/${id}`
    const response = await apiRequest<ApiResponse<CashAdvanceSetupDetail>>("get", endpoint, null, {
      useAuth: true,
      useBranchId: true,
    })

    return response.data
  },

  /**
   * Create a new cash advance setup
   */
  createCashAdvanceSetup: async (payload: CreateCashAdvanceSetupPayload): Promise<ApiResponse<CashAdvanceSetup>> => {
    const endpoint = "/cash-advance-setup"
    const response = await apiRequest<ApiResponse<CashAdvanceSetup>>("post", endpoint, payload, {
      useAuth: true,
      useBranchId: true,
    })

    return response.data
  },

  /**
   * Update an existing cash advance setup
   */
  updateCashAdvanceSetup: async (
    id: string,
    payload: UpdateCashAdvanceSetupPayload,
  ): Promise<ApiResponse<CashAdvanceSetup>> => {
    const endpoint = `/cash-advance-setup/${id}`
    const response = await apiRequest<ApiResponse<CashAdvanceSetup>>("put", endpoint, payload, {
      useAuth: true,
      useBranchId: true,
    })
    return response.data
  },

  /**
   * Delete a cash advance setup
   */
  deleteCashAdvanceSetup: async (id: string): Promise<ApiResponse<null>> => {
    const endpoint = `/cash-advance-setup/${id}`
    const response = await apiRequest<ApiResponse<null>>("delete", endpoint, null, {
      useAuth: true,
      useBranchId: true,
    })
    return response.data
  },

  /**
   * Update the status of a cash advance setup
   */
  updateCashAdvanceSetupStatus: async (
    id: string,
    payload: UpdateCashAdvanceSetupStatusPayload,
  ): Promise<ApiResponse<null>> => {
    const endpoint = `/cash-advance-setup/status/${id}`
    const response = await apiRequest<ApiResponse<null>>("put", endpoint, payload, {
      useAuth: true,
      useBranchId: true,
    })

    return response.data
  },

  /**
   * Get all Chart of Accounts
   */
  getAllCOA: async (): Promise<ApiResponse<GetAllCOAResponse>> => {
    const endpoint = "/coa"
    const response = await apiRequest<ApiResponse<GetAllCOAResponse>>("get", endpoint, null, {
      useAuth: true,
      useBranchId: true,
    })

    return response.data
  },
}

export default CashAdvanceSetupService
