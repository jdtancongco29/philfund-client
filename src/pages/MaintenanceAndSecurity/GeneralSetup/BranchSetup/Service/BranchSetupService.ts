import { apiRequest } from "@/lib/api"
import type {
  ApiResponse,
  BranchSetup,
  GetAllBranchResponse,
  CreateBranchPayload,
  UpdateBranchPayload,
  GetAllDepartmentResponse,
} from "./BranchSetupTypes"

export const BranchSetupService = {
  /**
   * Get departments
   */
  getDepartments: async (): Promise<ApiResponse<GetAllDepartmentResponse>> => {
    const endpoint = `/department`
    const response = await apiRequest<ApiResponse<GetAllDepartmentResponse>>("get", endpoint, null, {
      useAuth: true,
      useBranchId: true,
    })

    return response.data
  },

  /**
   * Get all branches with pagination
   */
  getAllBranches: async (
    page?: number,
    limit?: number,
    search?: string | null,
  ): Promise<ApiResponse<GetAllBranchResponse>> => {
    const params = new URLSearchParams()
    if (page) params.append("page", page.toString())
    if (limit) params.append("per_page", limit.toString())
    if (search) params.append("search", search)

    const endpoint = `/branch${params.toString() ? `?${params.toString()}` : ""}`
    const response = await apiRequest<ApiResponse<GetAllBranchResponse>>("get", endpoint, null, {
      useAuth: true,
      useBranchId: true,
    })

    return response.data
  },

  /**
   * Get a specific branch by ID
   */
  getBranchById: async (id: string): Promise<ApiResponse<BranchSetup>> => {
    const endpoint = `/branch/${id}`
    const response = await apiRequest<ApiResponse<BranchSetup>>("get", endpoint, null, {
      useAuth: true,
      useBranchId: true,
    })

    return response.data
  },

  /**
   * Get current user's branch
   */
  getMyBranch: async (): Promise<ApiResponse<BranchSetup>> => {
    const endpoint = `/branch/my-branch`
    const response = await apiRequest<ApiResponse<BranchSetup>>("get", endpoint, null, {
      useAuth: true,
    })

    return response.data
  },

  /**
   * Get branch users
   */
  getBranchUsers: async (): Promise<ApiResponse<any>> => {
    const endpoint = `/branch/users`
    const response = await apiRequest<ApiResponse<any>>("get", endpoint, null, {
      useAuth: true,
      useBranchId: true,
    })

    return response.data
  },

  /**
   * Get branch COAs
   */
  getBranchCoas: async (): Promise<ApiResponse<any>> => {
    const endpoint = `/branch/coas`
    const response = await apiRequest<ApiResponse<any>>("get", endpoint, null, {
      useAuth: true,
      useBranchId: true,
    })

    return response.data
  },

  /**
   * Create a new branch
   */
  createBranch: async (payload: CreateBranchPayload): Promise<ApiResponse<BranchSetup>> => {
    const endpoint = "/branch"
    try {
      const response = await apiRequest<ApiResponse<BranchSetup>>("post", endpoint, payload, {
        useAuth: true,
        useBranchId: true,
      })

      return response.data
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to create branch"
      console.log(errorMessage);
      throw error
    }
  },

  /**
   * Update an existing branch
   */
  updateBranch: async (id: string, payload: UpdateBranchPayload): Promise<ApiResponse<BranchSetup>> => {
    const endpoint = `/branch/${id}`
    try {
      const response = await apiRequest<ApiResponse<BranchSetup>>("put", endpoint, payload, {
        useAuth: true,
        useBranchId: true,
      })
      return response.data
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to update branch"
      console.log(errorMessage);
      throw error
    }
  },

  /**
   * Delete a branch
   */
  deleteBranch: async (id: string): Promise<ApiResponse<null>> => {
    const endpoint = `/branch/${id}`
    try {
      const response = await apiRequest<ApiResponse<null>>("delete", endpoint, null, {
        useAuth: true,
        useBranchId: true,
      })
      return response.data
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to delete branch"
      throw new Error(errorMessage)
    }
  },

  /**
   * Update branch status
   */
  updateBranchStatus: async (id: string, payload: { status: number }): Promise<ApiResponse<null>> => {
    const endpoint = `/branch/status/${id}`
    try {
      const response = await apiRequest<ApiResponse<null>>("put", endpoint, payload, {
        useAuth: true,
        useBranchId: true,
      })
      return response.data
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to update branch status"
      throw new Error(errorMessage)
    }
  },

  /**
   * Export branches to PDF
   */
  exportPdf: async (): Promise<Blob> => {
    const endpoint = `/branch/export-pdf`
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
   * Export branches to CSV
   */
  exportCsv: async () => {
    const endpoint = `/branch/export-csv`
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

export default BranchSetupService
