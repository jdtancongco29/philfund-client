// Common Types
export type ApiResponse<T> = {
  status: string
  message: string
  data: T
}

// DepartmentSetup Types
export interface DepartmentSetup {
  id: string
  code: string
  name: string
  status: boolean
}

export interface PaginationInfo {
  current_page: number
  per_page: number
  total_pages: number
  total_items: number
}

export interface GetAllDepartmentResponse {
  count: number
  departments: DepartmentSetup[]
  pagination: PaginationInfo
}

// Request Payload Types
export interface CreateDepartmentPayload {
  code: string
  name: string
  status: number // API expects 1 or 0
}

export interface UpdateDepartmentPayload {
  code: string
  name: string
  status: number // API expects 1 or 0
}
