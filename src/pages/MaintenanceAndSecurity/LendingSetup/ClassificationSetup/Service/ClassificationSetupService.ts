/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiRequest } from "@/lib/api";
import type {
  ApiResponse,
  BorrowerClassification,
  BorrowerClassificationDetail,
  CreateClassificationPayload,
  GetAllClassificationsResponse,
  UpdateClassificationPayload,
  UpdateClassificationStatusPayload,
} from "./ClassificationSetupTypes";
import { toast } from "sonner";

// BorrowerClassification Service
export const ClassificationSetupService = {
  /**
   * Get all borrower classifications with pagination
   * @param page Optional page number
   * @param limit Optional items per page
   */
  getAllClassifications: async (
    page?: number,
    limit?: number,
    search?: string | null
  ): Promise<ApiResponse<GetAllClassificationsResponse>> => {
    const params = new URLSearchParams();
    if (page) params.append("page", page.toString());
    if (limit) params.append("per_page", limit.toString());
    if (search) params.append("search", search);

    const endpoint = `/borrower/classification${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    const response = await apiRequest<
      ApiResponse<GetAllClassificationsResponse>
    >("get", endpoint, null, {
      useAuth: true,
      useBranchId: true,
    });

    return response.data;
  },

  /**
   * Get a specific borrower classification by ID
   * @param id The UUID of the borrower classification
   */
  getClassificationById: async (
    id: string
  ): Promise<ApiResponse<BorrowerClassificationDetail>> => {
    const endpoint = `/borrower/classification/${id}`;
    const response = await apiRequest<
      ApiResponse<BorrowerClassificationDetail>
    >("get", endpoint, null, {
      useAuth: true,
      useBranchId: true,
    });

    return response.data;
  },

  /**
   * Create a new borrower classification
   * @param payload The classification data to create
   */
  createClassification: async (
    payload: CreateClassificationPayload
  ): Promise<ApiResponse<BorrowerClassification>> => {
    const endpoint = "/borrower/classification";
    try {
      const response = await apiRequest<ApiResponse<BorrowerClassification>>(
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
   * Update an existing borrower classification
   * @param id The UUID of the borrower classification to update
   * @param payload The updated classification data
   */
  updateClassification: async (
    id: string,
    payload: UpdateClassificationPayload
  ): Promise<ApiResponse<BorrowerClassification>> => {
    const endpoint = `/borrower/classification/${id}`;
    try {
      const response = await apiRequest<ApiResponse<BorrowerClassification>>(
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
   * Delete a borrower classification
   * @param id The UUID of the borrower classification to delete
   */
  deleteClassification: async (id: string): Promise<ApiResponse<null>> => {
    const endpoint = `/borrower/classification/${id}`;
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
   * Update the status of a borrower classification
   * @param id The UUID of the borrower classification
   * @param payload The status update payload
   */
  updateClassificationStatus: async (
    id: string,
    payload: UpdateClassificationStatusPayload
  ): Promise<ApiResponse<null>> => {
    const endpoint = `/borrower/classification/status/${id}`;
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
  exportPdf: async () => {
    const endpoint = `/borrower/classification/export-pdf`;
    try {
      const response = await apiRequest("get", endpoint, null, {
        useAuth: true,
        useBranchId: true,
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
    const endpoint = `/borrower/classification/export-csv`;
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

export default ClassificationSetupService;
