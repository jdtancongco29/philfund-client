import { apiRequest } from "@/lib/api"
import type {
  ApiResponse,
  District,
  DistrictDetail,
  CreateDistrictPayload,
  GetAllDistrictsResponse,
  UpdateDistrictPayload,
  UpdateDistrictStatusPayload,
} from "./DistrictSetupTypes"
import { toast } from "sonner"

// District Service
export const DistrictSetupService = {
  /**
   * Get all districts with pagination
   * @param page Optional page number
   * @param limit Optional items per page
   */
  getAllDistricts: async (
    page?: number,
    limit?: number,
    search?: string | null,
  ): Promise<ApiResponse<GetAllDistrictsResponse>> => {
    const params = new URLSearchParams()
    if (page) params.append("page", page.toString())
    if (limit) params.append("per_page", limit.toString())
    if (search) params.append("search", search)

    const endpoint = `/borrower/district${params.toString() ? `?${params.toString()}` : ""}`
    const response = await apiRequest<ApiResponse<GetAllDistrictsResponse>>("get", endpoint, null, {
      useAuth: true,
      useBranchId: true,
    })

    return response.data
  },

  /**
   * Get a specific district by ID
   * @param id The UUID of the district
   */
  getDistrictById: async (id: string): Promise<ApiResponse<DistrictDetail>> => {
    const endpoint = `/borrower/district/${id}`
    const response = await apiRequest<ApiResponse<DistrictDetail>>("get", endpoint, null, {
      useAuth: true,
      useBranchId: true,
    })

    return response.data
  },

  /**
   * Create a new district
   * @param payload The district data to create
   */
  createDistrict: async (payload: CreateDistrictPayload): Promise<ApiResponse<District>> => {
    const endpoint = "/borrower/district"
    try {
      const response = await apiRequest<ApiResponse<District>>("post", endpoint, payload, {
        useAuth: true,
        useBranchId: true,
      })

      return response.data
    } catch (error: any) {
      toast.error(error.response.data.message)
      throw new Error(error.response.data.message)
    }
  },

  /**
   * Update an existing district
   * @param id The UUID of the district to update
   * @param payload The updated district data
   */
  updateDistrict: async (id: string, payload: UpdateDistrictPayload): Promise<ApiResponse<District>> => {
    const endpoint = `/borrower/district/${id}`
    try {
      const response = await apiRequest<ApiResponse<District>>("put", endpoint, payload, {
        useAuth: true,
        useBranchId: true,
      })
      return response.data
    } catch (error: any) {
      toast.error(error.response.data.message)
      throw new Error(error.response.data.message)
    }
  },

  /**
   * Delete a district
   * @param id The UUID of the district to delete
   */
  deleteDistrict: async (id: string): Promise<ApiResponse<null>> => {
    const endpoint = `/borrower/district/${id}`
    try {
      const response = await apiRequest<ApiResponse<null>>("delete", endpoint, null, {
        useAuth: true,
        useBranchId: true,
      })
      return response.data
    } catch (error: any) {
      toast.error(error.response.data.message)
      throw new Error(error.response.data.message)
    }
  },

  /**
   * Update the status of a district
   * @param id The UUID of the district
   * @param payload The status update payload
   */
  updateDistrictStatus: async (id: string, payload: UpdateDistrictStatusPayload): Promise<ApiResponse<null>> => {
    const endpoint = `/borrower/district/status/${id}`
    try {
      const response = await apiRequest<ApiResponse<null>>("put", endpoint, payload, {
        useAuth: true,
        useBranchId: true,
      })

      return response.data
    } catch (error: any) {
      toast.error(error.response.data.message)
      throw new Error(error.response.data.message)
    }
  },
}

export default DistrictSetupService
