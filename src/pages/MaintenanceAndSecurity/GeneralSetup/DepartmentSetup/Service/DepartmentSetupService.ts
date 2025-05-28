import { apiRequest } from "@/lib/api"
import type {
  ApiResponse,
  DepartmentSetup,
  GetAllDepartmentResponse,
  CreateDepartmentPayload,
  UpdateDepartmentPayload,
} from "./DepartmentSetupTypes"

export const DepartmentSetupService = {
  /**
   * Get all departments with pagination
   */
  getAllDepartments: async (
    page?: number,
    limit?: number,
    search?: string | null,
  ): Promise<ApiResponse<GetAllDepartmentResponse>> => {
    const params = new URLSearchParams()
    if (page) params.append("page", page.toString())
    if (limit) params.append("per_page", limit.toString())
    if (search) params.append("search", search)

    const endpoint = `/department${params.toString() ? `?${params.toString()}` : ""}`
    const response = await apiRequest<ApiResponse<GetAllDepartmentResponse>>("get", endpoint, null, {
      useAuth: true,
      useBranchId: true,
    })

    return response.data
  },

  /**
   * Get a specific department by ID
   */
  getDepartmentById: async (id: string): Promise<ApiResponse<DepartmentSetup>> => {
    const endpoint = `/department/${id}`
    const response = await apiRequest<ApiResponse<DepartmentSetup>>("get", endpoint, null, {
      useAuth: true,
      useBranchId: true,
    })

    return response.data
  },

  /**
   * Create a new department
   */
  createDepartment: async (payload: CreateDepartmentPayload): Promise<ApiResponse<DepartmentSetup>> => {
    const endpoint = "/department/"
    try {
      const response = await apiRequest<ApiResponse<DepartmentSetup>>("post", endpoint, payload, {
        useAuth: true,
        useBranchId: true,
      })

      return response.data
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to create department"
      console.log(errorMessage);
      throw error
    }
  },

  /**
   * Update an existing department
   */
  updateDepartment: async (id: string, payload: UpdateDepartmentPayload): Promise<ApiResponse<DepartmentSetup>> => {
    const endpoint = `/department/${id}`
    try {
      const response = await apiRequest<ApiResponse<DepartmentSetup>>("put", endpoint, payload, {
        useAuth: true,
        useBranchId: true,
      })
      return response.data
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to update department"
      console.log(errorMessage);
      throw error
    }
  },

  /**
   * Delete a department
   */
  deleteDepartment: async (id: string): Promise<ApiResponse<null>> => {
    const endpoint = `/department/${id}`
    try {
      const response = await apiRequest<ApiResponse<null>>("delete", endpoint, null, {
        useAuth: true,
        useBranchId: true,
      })
      return response.data
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to delete department"
      throw new Error(errorMessage)
    }
  },

  /**
   * Update department status
   */
  updateDepartmentStatus: async (id: string, payload: { status: number }): Promise<ApiResponse<null>> => {
    const endpoint = `/department/status/${id}`
    try {
      const response = await apiRequest<ApiResponse<null>>("put", endpoint, payload, {
        useAuth: true,
        useBranchId: true,
      })
      return response.data
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to update department status"
      throw new Error(errorMessage)
    }
  },

  /**
   * Export departments to PDF
   */
  exportPdf: async (): Promise<Blob> => {
    const endpoint = `/department/export-pdf`
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
   * Export departments to CSV
   */
  exportCsv: async () => {
    const endpoint = `/department/export-csv`
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

export default DepartmentSetupService
