import { apiRequest } from "@/lib/api"
import type {
  ApiResponse,
  GetUserPermissionsResponse,
  GetModulesResponse,
  BulkUpdatePermissionsPayload,
  GetUsersForSelectionResponse,
} from "./PermissionsTypes"

export const PermissionsService = {
  /**
   * Get all users for selection dropdown
   */
  getUsersForSelection: async (
    page?: number,
    limit?: number,
    search?: string | null,
  ): Promise<ApiResponse<GetUsersForSelectionResponse>> => {
    const params = new URLSearchParams()
    if (page) params.append("page", page.toString())
    if (limit) params.append("per_page", limit.toString())
    if (search) params.append("search", search)

    const endpoint = `/user${params.toString() ? `?${params.toString()}` : ""}`
    const response = await apiRequest<ApiResponse<GetUsersForSelectionResponse>>("get", endpoint, null, {
      useAuth: true,
      useBranchId: true,
    })

    return response.data
  },

  /**
   * Get all available modules
   */
  getModules: async (): Promise<ApiResponse<GetModulesResponse>> => {
    const endpoint = `/module`
    const response = await apiRequest<ApiResponse<GetModulesResponse>>("get", endpoint, null, {
      useAuth: true,
      useBranchId: true,
    })

    return response.data
  },

  /**
   * Get user permissions by user ID
   */
  getUserPermissions: async (userId: string): Promise<ApiResponse<GetUserPermissionsResponse>> => {
    const endpoint = `/user/permission/${userId}`
    const response = await apiRequest<ApiResponse<GetUserPermissionsResponse>>("get", endpoint, null, {
      useAuth: true,
      useBranchId: true,
    })

    return response.data
  },

  /**
   * Get user permissions that can be accessed
   */
  getUserAccessiblePermissions: async (userId: string): Promise<ApiResponse<GetUserPermissionsResponse>> => {
    const endpoint = `/user/permission/can-access/${userId}`
    const response = await apiRequest<ApiResponse<GetUserPermissionsResponse>>("get", endpoint, null, {
      useAuth: true,
      useBranchId: true,
    })

    return response.data
  },

  /**
   * Update user permissions (bulk update)
   */
  updateUserPermissions: async (payload: BulkUpdatePermissionsPayload): Promise<ApiResponse<null>> => {
    const endpoint = `/user/permission`
    try {
      const response = await apiRequest<ApiResponse<null>>("post", endpoint, payload, {
        useAuth: true,
        useBranchId: true,
      })
      return response.data
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to update permissions"
      throw new Error(errorMessage)
    }
  },
}

export default PermissionsService