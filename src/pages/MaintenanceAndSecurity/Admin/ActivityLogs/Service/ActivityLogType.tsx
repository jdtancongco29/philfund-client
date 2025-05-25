// Common Types
export type ApiResponse<T> = {
  status: string
  message: string
  data: T
}

// Activity Log Types
export interface ActivityLog {
  id: string
  user_id: string
  username: string
  branch_id: string
  branch_name: string
  module: string
  activity: string
  description: string
  created_on: string
  ip_address?: string
  user_agent?: string
  created_at?: string
  updated_at?: string
}

export interface PaginationInfo {
  current_page: number
  per_page: number
  total_pages: number
  total_items: number
}

export interface GetActivityLogsResponse {
  count: number
  logs: ActivityLog[]
  pagination: PaginationInfo
}

// Filter Types
export interface ActivityLogFilters {
  search?: string
  branch_id?: string
  module_name?: string
  start_date?: string
  end_date?: string
  page?: number
  per_page?: number
}

// Branch and Module Types for filters
export interface Branch {
  id: string
  name: string
  code: string
}

export interface Module {
  id: string
  name: string
}

export interface GetBranchesResponse {
  count: number
  branches: Branch[]
  pagination: PaginationInfo
}

export interface GetModulesResponse {
  count: number
  module: Module[]
  pagination?: PaginationInfo
}

// Bulk Operations
export interface BulkDeletePayload {
  ids: string[]
}
