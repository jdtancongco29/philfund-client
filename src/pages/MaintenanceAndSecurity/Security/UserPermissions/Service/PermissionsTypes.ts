import { Branch } from "../../UserManagement/Service/UserManagementTypes"

// Common Types
export type ApiResponse<T> = {
  status: string
  message: string
  data: T
}

// Permission Types - Updated to match API response
export interface UserPermissionResponse {
  user_id: string
  module: {
    id: string
    name: string
  }
  can_access: boolean
  can_add: boolean
  can_edit: boolean
  can_delete: boolean
  can_export: boolean
  can_print: boolean
  can_void: boolean
}

export interface ModulePermission {
  user_id: string
  module: {
    id: string
    name: string
  }
  can_access: boolean
  can_add: boolean
  can_edit: boolean
  can_delete: boolean
  can_export: boolean
  can_print: boolean
  can_void: boolean
}

export interface Module {
  id: string
  name: string
}

export interface GetModulesResponse {
  count: number
  module: Module[]
  pagination?: {
    current_page: number
    per_page: number
    total_pages: number
    total_items: number
  }
}

// Updated to match API response structure
export interface GetUserPermissionsResponse {
  data?: UserPermissionResponse[]
}

// Request Payload Types - Updated based on API (fixed typo: mame -> name)
export interface UpdatePermissionPayload {
  user_id: string
  module_id: string
  can_access: boolean
  can_add: boolean
  can_edit: boolean
  can_delete: boolean
  can_export: boolean
  can_print: boolean
  can_void: boolean
}

export interface BulkUpdatePermissionsPayload {
  permissions: UpdatePermissionPayload[]
}

// User Selection Types (reusing from user management)
export interface UserForSelection {
  id: string
  code: string
  username: string
  full_name: string
  email: string
  mobile: string
  position: string
  branches: Branch[]
  status: boolean
}

export interface GetUsersForSelectionResponse {
  count: number
  users: UserForSelection[]
  pagination: {
    current_page: number
    per_page: number
    total_pages: number
    total_items: number
  }
}