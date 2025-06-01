import { apiRequest } from "@/lib/api";
import type {
  ApiResponse,
  BorrowGroup,
  BorrowGroupDetail,
  CreateGroupPayload,
  GetAllGroupsResponse,
  UpdateGroupPayload,
  UpdateGroupStatusPayload,
} from "./GroupSetupTypes";
import { toast } from "sonner";
import { AxiosError } from "axios";

// BorrowGroup Service
export const GroupSetupService = {
  /**
   * Get all borrower groups with pagination
   * @param page Optional page number
   * @param limit Optional items per page
   */
  getAllGroups: async (
    page?: number,
    limit?: number,
    search?: string | null
  ): Promise<ApiResponse<GetAllGroupsResponse>> => {
    const params = new URLSearchParams();
    if (page) params.append("page", page.toString());
    if (limit) params.append("per_page", limit.toString());
    if (search) params.append("search", search);

    const endpoint = `/borrower/group${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    const response = await apiRequest<ApiResponse<GetAllGroupsResponse>>(
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
   * Get a specific borrower group by ID
   * @param id The UUID of the borrower group
   */
  getGroupById: async (id: string): Promise<ApiResponse<BorrowGroupDetail>> => {
    const endpoint = `/borrower/group/${id}`;
    const response = await apiRequest<ApiResponse<BorrowGroupDetail>>(
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
   * Create a new borrower group
   * @param payload The group data to create
   */
  createGroup: async (
    payload: CreateGroupPayload
  ): Promise<ApiResponse<BorrowGroup>> => {
    const endpoint = "/borrower/group";
    try {
      const response = await apiRequest<ApiResponse<BorrowGroup>>(
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
   * Update an existing borrower group
   * @param id The UUID of the borrower group to update
   * @param payload The updated group data
   */
  updateGroup: async (
    id: string,
    payload: UpdateGroupPayload
  ): Promise<ApiResponse<BorrowGroup>> => {
    const endpoint = `/borrower/group/${id}`;
    try {
      const response = await apiRequest<ApiResponse<BorrowGroup>>(
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
   * Delete a borrower group
   * @param id The UUID of the borrower group to delete
   */
  deleteGroup: async (id: string): Promise<ApiResponse<null>> => {
    const endpoint = `/borrower/group/${id}`;
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
   * Update the status of a borrower group
   * @param id The UUID of the borrower group
   * @param payload The status update payload
   */
  updateGroupStatus: async (
    id: string,
    payload: UpdateGroupStatusPayload
  ): Promise<ApiResponse<null>> => {
    const endpoint = `/borrower/group/status/${id}`;
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
    const endpoint = `/borrower/group/export-pdf`;
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
    const endpoint = `/borrower/group/export-csv`;
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

export default GroupSetupService;
