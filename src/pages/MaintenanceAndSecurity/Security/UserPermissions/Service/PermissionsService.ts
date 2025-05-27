import { apiRequest } from "@/lib/api"
import type {
  ApiResponse,
  GetModulesResponse,
  BulkUpdatePermissionsPayload,
  GetUsersForSelectionResponse,
  UserPermissionResponse,
} from "./PermissionsTypes"

export const PermissionsService = {
  /**
   * Get all users for selection dropdown
   * Based on: GET /api/v1/user
   */
  getUsersForSelection: async (
    page?: number,
    limit?: number,
    search?: string | null,
    exclude_admins: boolean = true
  ): Promise<ApiResponse<GetUsersForSelectionResponse>> => {
    const params = new URLSearchParams()
    if (page) params.append("page", page.toString())
    if (limit) params.append("per_page", limit.toString())
    if (search) params.append("search", search)
    if (exclude_admins) params.append("exclude_admins", "true")

    const endpoint = `/user${params.toString() ? `?${params.toString()}` : ""}`
    const response = await apiRequest<ApiResponse<GetUsersForSelectionResponse>>("get", endpoint, null, {
      useAuth: true,
      useBranchId: true, // Always required
    })

    return response.data
  },

  /**
   * Get all available modules
   * Based on: GET /api/v1/module
   */
  getModules: async (): Promise<ApiResponse<GetModulesResponse>> => {
    const endpoint = `/module`
    const response = await apiRequest<ApiResponse<GetModulesResponse>>("get", endpoint, null, {
      useAuth: true,
      useBranchId: true, // Always required
    })

    return response.data
  },

  /**
   * Get user permissions by user ID
   * Based on: GET /api/v1/user/permission/{user_id}
   * Returns array of UserPermissionResponse directly
   */
  getUserPermissions: async (userId: string): Promise<ApiResponse<UserPermissionResponse[]>> => {
    const endpoint = `/user/permission/${userId}`
    const response = await apiRequest<ApiResponse<UserPermissionResponse[]>>("get", endpoint, null, {
      useAuth: true,
      useBranchId: true, // Always required
    })

    return response.data
  },

  /**
   * Get user permissions that can be accessed
   * Based on: GET /api/v1/user/permission/can-access/{user_id}
   */
  getUserAccessiblePermissions: async (userId: string): Promise<ApiResponse<UserPermissionResponse[]>> => {
    const endpoint = `/user/permission/can-access/${userId}`
    const response = await apiRequest<ApiResponse<UserPermissionResponse[]>>("get", endpoint, null, {
      useAuth: true,
      useBranchId: true, // Always required
    })

    return response.data
  },

  /**
   * Update user permissions (bulk update)
   * Based on: POST /api/v1/user/permission
   * Payload structure updated to match new types
   */
  updateUserPermissions: async (payload: BulkUpdatePermissionsPayload): Promise<ApiResponse<null>> => {
    const endpoint = `/user/permission`
    try {
      const response = await apiRequest<ApiResponse<null>>("post", endpoint, payload, {
        useAuth: true,
        useBranchId: true, // Always required
      })
      return response.data
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to update permissions"
      throw new Error(errorMessage)
    }
  },
}

export default PermissionsService