import { apiRequest } from "@/lib/api";
import type {
  ApiResponse,
  Division,
  DivisionDetail,
  CreateDivisionPayload,
  GetAllDivisionsResponse,
  UpdateDivisionPayload,
  UpdateDivisionStatusPayload,
} from "./DivisionSetupTypes";
import { toast } from "sonner";
import { AxiosError } from "axios";

// Division Service
export const DivisionSetupService = {
  /**
   * Get all divisions with pagination
   * @param page Optional page number
   * @param limit Optional items per page
   */
  getAllDivisions: async (
    page?: number,
    limit?: number,
    search?: string | null
  ): Promise<ApiResponse<GetAllDivisionsResponse>> => {
    const params = new URLSearchParams();
    if (page) params.append("page", page.toString());
    if (limit) params.append("per_page", limit.toString());
    if (search) params.append("search", search);

    const endpoint = `/borrower/division${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    const response = await apiRequest<ApiResponse<GetAllDivisionsResponse>>(
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
   * Get a specific division by ID
   * @param id The UUID of the division
   */
  getDivisionById: async (id: string): Promise<ApiResponse<DivisionDetail>> => {
    const endpoint = `/borrower/division/${id}`;
    const response = await apiRequest<ApiResponse<DivisionDetail>>(
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
   * Create a new division
   * @param payload The division data to create
   */
  createDivision: async (
    payload: CreateDivisionPayload
  ): Promise<ApiResponse<Division>> => {
    const endpoint = "/borrower/division";
    try {
      const response = await apiRequest<ApiResponse<Division>>(
        "post",
        endpoint,
        payload,
        {
          useAuth: true,
          useBranchId: true,
        }
      );

      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        throw error;
      } else {
        toast.error("Something went wrong");
        throw new Error("Something went wrong");
      }
    }
  },

  /**
   * Update an existing division
   * @param id The UUID of the division to update
   * @param payload The updated division data
   */
  updateDivision: async (
    id: string,
    payload: UpdateDivisionPayload
  ): Promise<ApiResponse<Division>> => {
    const endpoint = `/borrower/division/${id}`;
    try {
      const response = await apiRequest<ApiResponse<Division>>(
        "put",
        endpoint,
        payload,
        {
          useAuth: true,
          useBranchId: true,
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        throw error;
      } else {
        toast.error("Something went wrong");
        throw new Error("Something went wrong");
      }
    }
  },

  /**
   * Delete a division
   * @param id The UUID of the division to delete
   */
  deleteDivision: async (id: string): Promise<ApiResponse<null>> => {
    const endpoint = `/borrower/division/${id}`;
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
   * Update the status of a division
   * @param id The UUID of the division
   * @param payload The status update payload
   */
  updateDivisionStatus: async (
    id: string,
    payload: UpdateDivisionStatusPayload
  ): Promise<ApiResponse<null>> => {
    const endpoint = `/borrower/division/status/${id}`;
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
   * Export to PDF
   */
  exportPdf: async (): Promise<Blob> => {
    const endpoint = `/borrower/division/export-pdf`;
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
    const endpoint = `/borrower/division/export-csv`;
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

export default DivisionSetupService;
