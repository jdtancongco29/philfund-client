import { apiRequest } from "@/lib/api";
import type {
  ApiResponse,
  CashAdvanceSetup,
  CashAdvanceSetupDetail,
  CreateCashAdvanceSetupPayload,
  GetAllCashAdvanceSetupsResponse,
  GetAllCOAResponse,
  UpdateCashAdvanceSetupPayload,
  UpdateCashAdvanceSetupStatusPayload,
} from "./CashAdvanceSetupTypes";
import { toast } from "sonner";
import { AxiosError } from "axios";

// Cash Advance Setup Service
export const CashAdvanceSetupService = {
  /**
   * Get all cash advance setups with pagination
   */
  getAllCashAdvanceSetups: async (
    page?: number,
    limit?: number,
    search?: string | null
  ): Promise<ApiResponse<GetAllCashAdvanceSetupsResponse>> => {
    const params = new URLSearchParams();
    if (page) params.append("page", page.toString());
    if (limit) params.append("per_page", limit.toString());
    if (search) params.append("search", search);

    const endpoint = `/cash-advance-setup${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    const response = await apiRequest<
      ApiResponse<GetAllCashAdvanceSetupsResponse>
    >("get", endpoint, null, {
      useAuth: true,
      useBranchId: true,
    });

    return response.data;
  },

  /**
   * Get a specific cash advance setup by ID
   */
  getCashAdvanceSetupById: async (
    id: string
  ): Promise<ApiResponse<CashAdvanceSetupDetail>> => {
    const endpoint = `/cash-advance-setup/${id}`;
    const response = await apiRequest<ApiResponse<CashAdvanceSetupDetail>>(
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
   * Create a new cash advance setup
   */
  createCashAdvanceSetup: async (
    payload: CreateCashAdvanceSetupPayload
  ): Promise<ApiResponse<CashAdvanceSetup>> => {
    try {
      const endpoint = "/cash-advance-setup";
      const response = await apiRequest<ApiResponse<CashAdvanceSetup>>(
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
        toast.error(error?.response?.data.message);
        throw error;
      } else {
        toast.error("Something went wrong");
        throw new Error("Something went wrong");
      }
    }
  },

  /**
   * Update an existing cash advance setup
   */
  updateCashAdvanceSetup: async (
    id: string,
    payload: UpdateCashAdvanceSetupPayload
  ): Promise<ApiResponse<CashAdvanceSetup>> => {
    console.log(payload);
    const endpoint = `/cash-advance-setup/${id}`;
    const response = await apiRequest<ApiResponse<CashAdvanceSetup>>(
      "put",
      endpoint,
      payload,
      {
        useAuth: true,
        useBranchId: true,
      }
    );
    return response.data;
  },

  /**
   * Delete a cash advance setup
   */
  deleteCashAdvanceSetup: async (id: string): Promise<ApiResponse<null>> => {
    try {
      const endpoint = `/cash-advance-setup/${id}`;
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
   * Update the status of a cash advance setup
   */
  updateCashAdvanceSetupStatus: async (
    id: string,
    payload: UpdateCashAdvanceSetupStatusPayload
  ): Promise<ApiResponse<null>> => {
    try {
      const endpoint = `/cash-advance-setup/status/${id}`;
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
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data.message);
        throw error;
      } else {
        toast.error("Something went wrong");
        throw new Error("Something went wrong");
      }
    }
  },

  /**
   * Get all Chart of Accounts
   */
  getAllCOA: async (
    name?: string | null,
    code?: string | null
  ): Promise<ApiResponse<GetAllCOAResponse>> => {
    const params = new URLSearchParams();
    if (name) params.append("name", name.toString());
    if (code) params.append("code", code.toString());
    const endpoint = `/coa${params.toString() ? `?${params.toString()}` : ""}`;
    const response = await apiRequest<ApiResponse<GetAllCOAResponse>>(
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
   * Export to PDF
   */
  exportPdf: async () => {
    const endpoint = `/cash-advance-setup/export-pdf`;
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
    const endpoint = `/cash-advance-setup/export-csv`;
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

export default CashAdvanceSetupService;
