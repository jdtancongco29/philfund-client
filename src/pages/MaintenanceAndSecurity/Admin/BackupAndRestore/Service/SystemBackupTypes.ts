// Common Types
export type ApiResponse<T> = {
  status: string
  message: string
  data: T
}

// SystemBackup Types
export interface SystemBackup {
  id: string
  filename: string
  size: number // in bytes
  created_at: string
  created_by: string
  file_path?: string
}

export interface PaginationInfo {
  current_page: number
  per_page: number
  total_pages: number
  total_items: number
}

export interface GetAllBackupsResponse {
  count: number
  backups: SystemBackup[]
  pagination: PaginationInfo
}

// Request Payload Types
export interface CreateBackupPayload {
  description?: string
  include_data?: boolean
}
