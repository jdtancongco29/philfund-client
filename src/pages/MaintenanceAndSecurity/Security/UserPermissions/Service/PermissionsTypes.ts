// Common Types
export type ApiResponse<T> = {
  status: string
  message: string
  data: T
}

// Permission Types
export interface ModulePermission {
  id: string
  user_id: string
  module_id: string
  module_name: string
  module_description?: string
  can_access: boolean
  can_add: boolean
  can_edit: boolean
  can_delete: boolean
  can_export: boolean
  can_print: boolean
}

export interface UserPermissions {
  user_id: string
  permissions: ModulePermission[]
}

export interface Module {
  id: string
  name: string
//   description?: string
//   status: boolean
//   created_at?: string
//   updated_at?: string
}

export interface GetModulesResponse {
  count: number
  modules: Module[]
  pagination?: {
    current_page: number
    per_page: number
    total_pages: number
    total_items: number
  }
}

export interface GetUserPermissionsResponse {
  user_id: string
  permissions: ModulePermission[]
}

// Request Payload Types
export interface UpdatePermissionPayload {
  user_id: string
  module_id: string
  can_access: number
  can_add: number
  can_edit: number
  can_delete: number
  can_export: number
  can_print: number
}

export interface BulkUpdatePermissionsPayload {
  permissions: UpdatePermissionPayload[]
}

interface BranchItems {
  id: string
  name: string
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
  branches: BranchItems[]
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
