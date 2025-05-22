// Common Types
export type ApiResponse<T> = {
  status: string;
  message: string;
  data: T;
};

// BorrowGroup Types
export interface BorrowGroup {
  id: string;
  branch_id: string;
  code: string;
  name: string;
  status: boolean;
}

export interface BorrowGroupDetail extends BorrowGroup {
  divisons: unknown[]; // You can replace 'any' with a more specific type if needed
}

export interface PaginationInfo {
  current_page: number;
  per_page: number;
  total_pages: number;
  total_items: number;
}

export interface GetAllGroupsResponse {
  count: number;
  groups: BorrowGroup[];
  pagination: PaginationInfo;
}

// Request Payload Types
export interface CreateGroupPayload {
  code: string;
  name: string;
  branch_id: string;
}

export interface UpdateGroupPayload {
  code: string;
  name: string;
  branch_id: string;
}

export interface UpdateGroupStatusPayload {
  status: number;
}
