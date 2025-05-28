import { apiRequest } from "@/lib/api";
import type {
  ApiResponse,
  BonusLoan,
  BonusLoanDetail,
  CreateBonusLoanPayload,
  GetAllBonusLoansResponse,
  GetAllCOAResponse,
  UpdateBonusLoanPayload,
  UpdateBonusLoanStatusPayload,
} from "./BonusLoanSetupTypes";
import { toast } from "sonner";
import { AxiosError } from "axios";

// Bonus Loan Service
export const BonusLoanSetupService = {
  /**
   * Get all bonus loans with pagination
   * @param page Optional page number
   * @param limit Optional items per page
   */
  getAllBonusLoans: async (
    page?: number,
    limit?: number,
    search?: string | null
  ): Promise<ApiResponse<GetAllBonusLoansResponse>> => {
    const params = new URLSearchParams();
    if (page) params.append("page", page.toString());
    if (limit) params.append("per_page", limit.toString());
    if (search) params.append("search", search);

    const endpoint = `/bonus-loan-setup${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    const response = await apiRequest<ApiResponse<GetAllBonusLoansResponse>>(
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
   * Get a specific bonus loan by ID
   * @param id The UUID of the bonus loan
   */
  getBonusLoanById: async (
    id: string
  ): Promise<ApiResponse<BonusLoanDetail>> => {
    const endpoint = `/bonus-loan-setup/${id}`;
    const response = await apiRequest<ApiResponse<BonusLoanDetail>>(
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
   * Create a new bonus loan
   * @param payload The bonus loan data to create
   */
  createBonusLoan: async (
    payload: CreateBonusLoanPayload
  ): Promise<ApiResponse<BonusLoan>> => {
    const endpoint = "/bonus-loan-setup";
    try {
      const response = await apiRequest<ApiResponse<BonusLoan>>(
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
   * Update an existing bonus loan
   * @param id The UUID of the bonus loan to update
   * @param payload The updated bonus loan data
   */
  updateBonusLoan: async (
    id: string,
    payload: UpdateBonusLoanPayload
  ): Promise<ApiResponse<BonusLoan>> => {
    const endpoint = `/bonus-loan-setup/${id}`;
    try {
      const response = await apiRequest<ApiResponse<BonusLoan>>(
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
   * Delete a bonus loan
   * @param id The UUID of the bonus loan to delete
   */
  deleteBonusLoan: async (id: string): Promise<ApiResponse<null>> => {
    const endpoint = `/bonus-loan-setup/${id}`;
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
      return response.data;
    } catch (error: any) {
      toast.error(error.response.data.message);
      throw new Error(error.response.data.message);
    }
  },

  /**
   * Update the status of a bonus loan
   * @param id The UUID of the bonus loan
   * @param payload The status update payload
   */
  updateBonusLoanStatus: async (
    id: string,
    payload: UpdateBonusLoanStatusPayload
  ): Promise<ApiResponse<null>> => {
    const endpoint = `/bonus-loan-setup/status/${id}`;
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
   * Get all Chart of Accounts
   */
  getAllCOA: async (): Promise<ApiResponse<GetAllCOAResponse>> => {
    const endpoint = "/coa";
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
};

export default BonusLoanSetupService;
