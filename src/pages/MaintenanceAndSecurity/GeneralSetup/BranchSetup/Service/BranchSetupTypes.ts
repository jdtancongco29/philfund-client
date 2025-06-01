// Common Types
export type ApiResponse<T> = {
  status: string
  message: string
  data: T
}

// BranchSetup Types
export interface BranchSetup {
  id: string
  code: string
  name: string
  email: string
  address: string
  contact: string
  city: string
  status: boolean
  departments: DepartmentItems[]
}

export interface PaginationInfo {
  current_page: number
  per_page: number
  total_pages: number
  total_items: number
}

export interface GetAllBranchResponse {
  count: number
  branches: BranchSetup[]
  pagination: PaginationInfo
}

export interface Department {
  id: string
//   code: string
  name: string
//   description: string
//   status: boolean
}

interface DepartmentItems {
  id: string
  name: string
}

export interface GetAllDepartmentResponse {
  count: number
  departments: Department[]
  pagination: PaginationInfo
}

// Request Payload Types
export interface CreateBranchPayload {
  code: string
  name: string
  email: string
  address: string
  contact: string
  city: string
  status: number // API expects 1 or 0
  departments: string[]
}

export interface UpdateBranchPayload {
  code: string
  name: string
  email: string
  address: string
  contact: string
  city: string
  status: number // API expects 1 or 0
  departments: string[]
}

// Branch Types
export interface Branch {
  id: string
  name: string
}

export interface UserBranchesResponse {
  branches: Branch[]
}