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
  },

  /**
   * Delete a borrower group
   * @param id The UUID of the borrower group to delete
   */
  deleteGroup: async (id: string): Promise<ApiResponse<null>> => {
    const endpoint = `/borrower/group/${id}`;
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
  },
};

export default GroupSetupService;
