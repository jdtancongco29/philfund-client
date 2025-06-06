import { apiRequest } from "@/lib/api";
import type {
  ApiResponse,
  SalaryLoan,
  SalaryLoanDetail,
  CreateSalaryLoanPayload,
  GetAllSalaryLoansResponse,
  GetAllCOAResponse,
  UpdateSalaryLoanPayload,
  UpdateSalaryLoanStatusPayload,
} from "./SalaryLoanSetupTypes";
import { toast } from "sonner";
import { AxiosError } from "axios";

// Salary Loan Service
export const SalaryLoanSetupService = {
  /**
   * Get all salary loans with pagination
   * @param page Optional page number
   * @param limit Optional items per page
   */
  getAllSalaryLoans: async (
    page?: number,
    limit?: number,
    search?: string | null
  ): Promise<ApiResponse<GetAllSalaryLoansResponse>> => {
    const params = new URLSearchParams();
    if (page) params.append("page", page.toString());
    if (limit) params.append("per_page", limit.toString());
    if (search) params.append("search", search);

    const endpoint = `/salary-loan-setup${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    const response = await apiRequest<ApiResponse<GetAllSalaryLoansResponse>>(
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
   * Get a specific salary loan by ID
   * @param id The UUID of the salary loan
   */
  getSalaryLoanById: async (
    id: string
  ): Promise<ApiResponse<SalaryLoanDetail>> => {
    const endpoint = `/salary-loan-setup/${id}`;
    const response = await apiRequest<ApiResponse<SalaryLoanDetail>>(
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
   * Create a new salary loan
   * @param payload The salary loan data to create
   */
  createSalaryLoan: async (
    payload: CreateSalaryLoanPayload
  ): Promise<ApiResponse<SalaryLoan>> => {
    const endpoint = "/salary-loan-setup";
    try {
      const response = await apiRequest<ApiResponse<SalaryLoan>>(
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
   * Update an existing salary loan
   * @param id The UUID of the salary loan to update
   * @param payload The updated salary loan data
   */
  updateSalaryLoan: async (
    id: string,
    payload: UpdateSalaryLoanPayload
  ): Promise<ApiResponse<SalaryLoan>> => {
    const endpoint = `/salary-loan-setup/${id}`;
    try {
      const response = await apiRequest<ApiResponse<SalaryLoan>>(
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
   * Delete a salary loan
   * @param id The UUID of the salary loan to delete
   */
  deleteSalaryLoan: async (id: string): Promise<ApiResponse<null>> => {
    const endpoint = `/salary-loan-setup/${id}`;
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
   * Update the status of a salary loan
   * @param id The UUID of the salary loan
   * @param payload The status update payload
   */
  updateSalaryLoanStatus: async (
    id: string,
    payload: UpdateSalaryLoanStatusPayload
  ): Promise<ApiResponse<null>> => {
    const endpoint = `/salary-loan-setup/status/${id}`;
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
    const endpoint = `/salary-loan-setup/export-pdf`;
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
    const endpoint = `/salary-loan-setup/export-csv`;
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

export default SalaryLoanSetupService;
