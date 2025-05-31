// Common Types
export type ApiResponse<T> = {
  status: string
  message: string
  data: T
}

// Group reference type
export interface Group {
  id: string
  name: string
  code: string
}

// Division Types
export interface Division {
  id: string
  code: string
  group: Group
  branch_id: string
  name: string
  status: boolean
  districts?: unknown[]
}

export interface DivisionDetail extends Division {
  districts: unknown[]
}

export interface PaginationInfo {
  current_page: number
  per_page: number
  total_pages: number
  total_items: number
}

export interface GetAllDivisionsResponse {
  count: number
  division: Division[]
  pagination: PaginationInfo
}

// Request Payload Types
export interface CreateDivisionPayload {
  code: string
  name: string
  branch_id: string
  group_id: string
}

export interface UpdateDivisionPayload {
  code: string
  name: string
  branch_id: string
  group_id: string
}

export interface UpdateDivisionStatusPayload {
  status: number
}
