// Common Types
export type ApiResponse<T> = {
  status: string
  message: string
  data: T
}

export type Permission = "Special Loan" | "Loans" | "Disbursement" | "Branch Opener" | "New Client Approver"

export type Permissions = Permission[]

export type Schedules = {
  day_of_week: number
  start_time: string
  end_time: string
}

// UserManagement Types
export interface UserManagement {
  id: string
  code: string
  full_name: string
  email: string
  username: string
  position: string
  mobile: string
  inactive_from?: string
  inactive_to?: string
  password: string
  password_confirmation: string
  special_approver: boolean
  loan_approver: boolean
  disbursement_approver: boolean
  branch_opener: boolean
  new_client_approver: boolean
  status: boolean
  branches: BranchItems[]
  permissions: Permissions
  last_pass_date?: string
  access_schedules: Schedules[]
}

export interface PaginationInfo {
  current_page: number
  per_page: number
  total_pages: number
  total_items: number
}

export interface GetAllUserResponse {
  count: number
  users: UserManagement[]
  pagination: PaginationInfo
}

export interface Branch {
  id: string
  code: string
  name: string
  email: string
  address: string
  contact: string
  city: string
  departments: { id: string; name: string }[]
  status: boolean
}

interface BranchItems {
  id: string
  name: string
}

export interface GetAllBranchResponse {
  count: number
  branches: Branch[]
  pagination: PaginationInfo
}

export interface UserDevice {
  id: string
  name: string
  last_login: string | null
  ip_address: string
  browser: string
}

export interface GetUserDevicesResponse {
  devices: UserDevice[]
}

// Request Payload Types
export interface CreateUserPayload {
  code: string
  username: string
  full_name: string
  email: string
  mobile: string
  position: string
  status: boolean
  special_approver: boolean
  loan_approver: boolean
  disbursement_approver: boolean
  branch_opener: boolean
  new_client_approver: boolean
  password: string
  password_confirmation: string
  branches: string[]
  inactive_from?: string
  inactive_to?: string
  access_schedules: Schedules[]
}

export interface UpdateUserPayload {
  code: string
  username: string
  full_name: string
  email: string
  mobile: string
  position: string
  status: boolean
  special_approver: boolean
  loan_approver: boolean
  disbursement_approver: boolean
  branch_opener: boolean
  new_client_approver: boolean
  password?: string
  password_confirmation?: string
  branches: string[]
  inactive_from?: string
  inactive_to?: string
  access_schedules: Schedules[]
}
