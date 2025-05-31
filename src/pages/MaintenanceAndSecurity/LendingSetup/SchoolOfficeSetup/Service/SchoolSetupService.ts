import { apiRequest } from "@/lib/api";
import type {
  ApiResponse,
  School,
  SchoolDetail,
  CreateSchoolPayload,
  GetAllSchoolsResponse,
  UpdateSchoolPayload,
  UpdateSchoolStatusPayload,
} from "./SchoolSetupTypes";
import { toast } from "sonner";

// School Service
export const SchoolSetupService = {
  /**
   * Get all schools with pagination
   * @param page Optional page number
   * @param limit Optional items per page
   */
  getAllSchools: async (
    page?: number,
    limit?: number,
    search?: string | null
  ): Promise<ApiResponse<GetAllSchoolsResponse>> => {
    const params = new URLSearchParams();
    if (page) params.append("page", page.toString());
    if (limit) params.append("per_page", limit.toString());
    if (search) params.append("search", search);

    const endpoint = `/borrower/school${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    const response = await apiRequest<ApiResponse<GetAllSchoolsResponse>>(
      "get",
      endpoint,
      null,
      {
        useAuth: true,
        useBranchId: true,
      }
    );

    return response.data;
  },

  /**
   * Get a specific school by ID
   * @param id The UUID of the school
   */
  getSchoolById: async (id: string): Promise<ApiResponse<SchoolDetail>> => {
    const endpoint = `/borrower/school/${id}`;
    const response = await apiRequest<ApiResponse<SchoolDetail>>(
      "get",
      endpoint,
      null,
      {
        useAuth: true,
        useBranchId: true,
      }
    );

    return response.data;
  },

  /**
   * Create a new school
   * @param payload The school data to create
   */
  createSchool: async (
    payload: CreateSchoolPayload
  ): Promise<ApiResponse<School>> => {
    const endpoint = "/borrower/school";
    try {
      const response = await apiRequest<ApiResponse<School>>(
        "post",
        endpoint,
        payload,
        {
          useAuth: true,
          useBranchId: true,
        }
      );

      return response.data;
    } catch (error: any) {
      toast.error(error.response.data.message);
      throw new Error(error.response.data.message);
    }
  },

  /**
   * Update an existing school
   * @param id The UUID of the school to update
   * @param payload The updated school data
   */
  updateSchool: async (
    id: string,
    payload: UpdateSchoolPayload
  ): Promise<ApiResponse<School>> => {
    const endpoint = `/borrower/school/${id}`;
    try {
      const response = await apiRequest<ApiResponse<School>>(
        "put",
        endpoint,
        payload,
        {
          useAuth: true,
          useBranchId: true,
        }
      );
      return response.data;
    } catch (error: any) {
      toast.error(error.response.data.message);
      throw new Error(error.response.data.message);
    }
  },

  /**
   * Delete a school
   * @param id The UUID of the school to delete
   */
  deleteSchool: async (id: string): Promise<ApiResponse<null>> => {
    const endpoint = `/borrower/school/${id}`;
    try {
      const response = await apiRequest<ApiResponse<null>>(
        "delete",
        endpoint,
        null,
        {
          useAuth: true,
          useBranchId: true,
        }
      );
      toast.success("Record successfully deleted");
      return response.data;
    } catch (error: any) {
      toast.error(error.response.data.message);
      throw new Error(error.response.data.message);
    }
  },

  /**
   * Update the status of a school
   * @param id The UUID of the school
   * @param payload The status update payload
   */
  updateSchoolStatus: async (
    id: string,
    payload: UpdateSchoolStatusPayload
  ): Promise<ApiResponse<null>> => {
    const endpoint = `/borrower/school/status/${id}`;
    try {
      const response = await apiRequest<ApiResponse<null>>(
        "put",
        endpoint,
        payload,
        {
          useAuth: true,
          useBranchId: true,
        }
      );

      return response.data;
    } catch (error: any) {
      toast.error(error.response.data.message);
      throw new Error(error.response.data.message);
    }
  },

  /**
   * Generate a school code
   */
  generateSchoolCode: async (): Promise<ApiResponse<{ data: string }>> => {
    const endpoint = "/borrower/school/generate-code";
    try {
      const response = await apiRequest<ApiResponse<{ data: string }>>(
        "get",
        endpoint,
        null,
        {
          useAuth: true,
          useBranchId: true,
        }
      );

      return response.data;
    } catch (error: any) {
      toast.error(error.response.data.message);
      throw new Error(error.response.data.message);
    }
  },

  /**
   * Export to PDF
   */
  exportPdf: async (): Promise<Blob> => {
    const endpoint = `/borrower/school/export-pdf`;
    try {
      const response = await apiRequest<Blob>("get", endpoint, null, {
        useAuth: true,
        useBranchId: true,
        responseType: "blob",
      });
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to export PDF";
      throw new Error(errorMessage);
    }
  },

  /**
   * Export to CSV
   */
  exportCsv: async () => {
    const endpoint = `/borrower/school/export-csv`;
    try {
      const response = await apiRequest("get", endpoint, null, {
        useAuth: true,
        useBranchId: true,
        responseType: "blob",
      });
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to export CSV";
      throw new Error(errorMessage);
    }
  },
};

export default SchoolSetupService;
