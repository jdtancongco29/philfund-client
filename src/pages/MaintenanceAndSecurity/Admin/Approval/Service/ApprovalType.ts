// Common Types
export type ApiResponse<T> = {
  status: string
  message: string
  data: T
}

// For Approval Types
export interface ApprovalRequest {
  id: string
  branch_id: string
  branch_name: string
  date_time: string
  loan_type: string
  pn_no: string
  reference: string
  reference_number: string
  requested_by: string
  description: string
  type: "CK" | "CV" | "OR" | "OTHER"
  status: "pending" | "approved" | "denied"
  created_at: string
  updated_at: string
}

export interface PaginationInfo {
  current_page: number
  per_page: number
  total_pages: number
  total_items: number
}

export interface GetApprovalRequestsResponse {
  count: number
  approval_requests: ApprovalRequest[]
  pagination: PaginationInfo
}

// Filter Types
export interface ApprovalRequestFilters {
  search?: string
  branch_id?: string
  transaction_type?: string
  start_date?: string
  end_date?: string
  page?: number
  per_page?: number
}

// Branch and Transaction Types for filters
export interface Branch {
  id: string
  name: string
  code: string
}

export interface TransactionType {
  id: string
  name: string
  code: string
}

export interface GetBranchesResponse {
  count: number
  branches: Branch[]
  pagination: PaginationInfo
}

export interface GetTransactionTypesResponse {
  count: number
  transaction_types: TransactionType[]
  pagination?: PaginationInfo
}

// Request Payload Types
export interface ApproveRequestPayload {
  approval_request_id: string
  notes?: string
}

export interface DenyRequestPayload {
  approval_request_id: string
  reason: string
}

// Bulk Operations
export interface BulkApprovePayload {
  approval_request_ids: string[]
  notes?: string
}

export interface BulkDenyPayload {
  approval_request_ids: string[]
  reason: string
}
