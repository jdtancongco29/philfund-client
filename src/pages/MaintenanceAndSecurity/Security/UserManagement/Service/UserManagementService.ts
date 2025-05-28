import { apiRequest } from "@/lib/api"
import type {
  ApiResponse,
  UserManagement,
  GetAllUserResponse,
  CreateUserPayload,
  UpdateUserPayload,
  GetAllBranchResponse,
  GetUserDevicesResponse,
} from "./UserManagementTypes"

export const UserManagementService = {
  /**
   * Get generated user code
   */
  generateUserCode: async (): Promise<string> => {
    const endpoint = `/user/generate-code`
    const response = await apiRequest<ApiResponse<string>>("get", endpoint, null, {
      useAuth: true,
      useBranchId: true,
    })

    return response.data.data
  },

  /**
   * Get branches
   */
  getBranches: async (): Promise<ApiResponse<GetAllBranchResponse>> => {
    const endpoint = `/branch`
    const response = await apiRequest<ApiResponse<GetAllBranchResponse>>("get", endpoint, null, {
      useAuth: true,
      useBranchId: true,
    })

    return response.data
  },

  /**
   * Get all users with pagination
   */
  getAllUsers: async (
    page?: number,
    limit?: number,
    search?: string | null,
  ): Promise<ApiResponse<GetAllUserResponse>> => {
    const params = new URLSearchParams()
    if (page) params.append("page", page.toString())
    if (limit) params.append("per_page", limit.toString())
    if (search) params.append("search", search)

    const endpoint = `/user${params.toString() ? `?${params.toString()}` : ""}`
    const response = await apiRequest<ApiResponse<GetAllUserResponse>>("get", endpoint, null, {
      useAuth: true,
      useBranchId: true,
    })

    return response.data
  },

  /**
   * Get a specific user by ID
   */
  getUserById: async (id: string): Promise<ApiResponse<UserManagement>> => {
    const endpoint = `/user/${id}`
    const response = await apiRequest<ApiResponse<UserManagement>>("get", endpoint, null, {
      useAuth: true,
      useBranchId: true,
    })

    return response.data
  },

  /**
   * Create a new user
   */
  createUser: async (payload: CreateUserPayload): Promise<ApiResponse<UserManagement>> => {
    const endpoint = "/user"
    try {
      const response = await apiRequest<ApiResponse<UserManagement>>("post", endpoint, payload, {
        useAuth: true,
        useBranchId: true,
      })

      return response.data
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to create user"
      throw new Error(errorMessage)
    }
  },

  /**
   * Update an existing user
   */
  updateUser: async (id: string, payload: UpdateUserPayload): Promise<ApiResponse<UserManagement>> => {
    const endpoint = `/user/${id}`
    try {
      const response = await apiRequest<ApiResponse<UserManagement>>("put", endpoint, payload, {
        useAuth: true,
        useBranchId: true,
      })
      return response.data
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to update user"
      throw new Error(errorMessage)
    }
  },

  /**
   * Delete a user
   */
  deleteUser: async (id: string): Promise<ApiResponse<null>> => {
    const endpoint = `/user/${id}`
    try {
      const response = await apiRequest<ApiResponse<null>>("delete", endpoint, null, {
        useAuth: true,
        useBranchId: true,
      })
      return response.data
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to delete user"
      throw new Error(errorMessage)
    }
  },

  /**
   * Change user password (admin)
   */
  changeUserPassword: async (
    id: string,
    payload: { password: string; password_confirmation: string },
  ): Promise<ApiResponse<null>> => {
    const endpoint = `/user/admin-change-pass/${id}`
    try {
      const response = await apiRequest<ApiResponse<null>>("put", endpoint, payload, {
        useAuth: true,
        useBranchId: true,
      })
      return response.data
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to change password"
      throw new Error(errorMessage)
    }
  },

  /**
   * Get user devices
   */
  getUserDevices: async (userId: string): Promise<ApiResponse<GetUserDevicesResponse>> => {
    const endpoint = `/user-device?user_id=${userId}`
    try {
      const response = await apiRequest<ApiResponse<GetUserDevicesResponse>>("get", endpoint, null, {
        useAuth: true,
        useBranchId: true,
      })
      return response.data
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to fetch user devices"
      throw new Error(errorMessage)
    }
  },

  /**
   * Delete user device
   */
  deleteUserDevice: async (deviceId: string): Promise<ApiResponse<null>> => {
    const endpoint = `/user-device/${deviceId}`
    try {
      const response = await apiRequest<ApiResponse<null>>("delete", endpoint, null, {
        useAuth: true,
        useBranchId: true,
      })
      return response.data
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to delete device"
      throw new Error(errorMessage)
    }
  },

  /**
   * Update user status
   */
  updateUserStatus: async (id: string, payload: { status: number }): Promise<ApiResponse<null>> => {
    const endpoint = `/user/status/${id}`
    try {
      const response = await apiRequest<ApiResponse<null>>("put", endpoint, payload, {
        useAuth: true,
        useBranchId: true,
      })
      return response.data
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to update user status"
      throw new Error(errorMessage)
    }
  },

  /**
   * Unblock user
   */
  unblockUser: async (id: string): Promise<ApiResponse<null>> => {
    const endpoint = `/user/unblocked/${id}`
    try {
      const response = await apiRequest<ApiResponse<null>>("put", endpoint, null, {
        useAuth: true,
        useBranchId: true,
      })
      return response.data
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to unblock user"
      throw new Error(errorMessage)
    }
  },

  /**
   * Export users to PDF
   */
  exportPdf: async (): Promise<Blob> => {
    const endpoint = `/user/export-pdf`
    try {
      const response = await apiRequest<Blob>("get", endpoint, null, {
        useAuth: true,
        useBranchId: true,
        responseType: "blob",
      })
      return response.data
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to export PDF"
      throw new Error(errorMessage)
    }
  },

  /**
   * Export users to CSV
   */
  exportCsv: async () => {
    const endpoint = `/user/export-csv`
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
  },
}

export default UserManagementService
