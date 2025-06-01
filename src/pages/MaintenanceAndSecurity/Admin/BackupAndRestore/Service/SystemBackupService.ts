import type { ApiResponse, SystemBackup, GetAllBackupsResponse, CreateBackupPayload } from "./SystemBackupTypes"

// Mock data for development
const mockBackups: SystemBackup[] = [
  {
    id: "1",
    filename: "backup-2024-04-15-08-30-45.sql",
    size: 15728640, // 15 MB in bytes
    created_at: "2025-04-12T02:34:00Z",
    created_by: "Super Admin",
    file_path: "/backups/backup-2024-04-15-08-30-45.sql",
  },
  {
    id: "2",
    filename: "backup-2024-04-15-08-30-45.sql",
    size: 15728640, // 15 MB in bytes
    created_at: "2025-04-12T02:34:00Z",
    created_by: "Super Admin",
    file_path: "/backups/backup-2024-04-15-08-30-45.sql",
  },
  {
    id: "3",
    filename: "backup-2024-04-14-14-22-10.sql",
    size: 12582912, // 12 MB in bytes
    created_at: "2025-04-11T14:22:00Z",
    created_by: "Admin User",
    file_path: "/backups/backup-2024-04-14-14-22-10.sql",
  },
  {
    id: "4",
    filename: "backup-2024-04-13-09-15-33.sql",
    size: 18874368, // 18 MB in bytes
    created_at: "2025-04-10T09:15:00Z",
    created_by: "Super Admin",
    file_path: "/backups/backup-2024-04-13-09-15-33.sql",
  },
  {
    id: "5",
    filename: "backup-2024-04-12-16-45-22.sql",
    size: 14680064, // 14 MB in bytes
    created_at: "2025-04-09T16:45:00Z",
    created_by: "System Admin",
    file_path: "/backups/backup-2024-04-12-16-45-22.sql",
  },
  {
    id: "6",
    filename: "backup-2024-04-11-11-30-15.sql",
    size: 16777216, // 16 MB in bytes
    created_at: "2025-04-08T11:30:00Z",
    created_by: "Super Admin",
    file_path: "/backups/backup-2024-04-11-11-30-15.sql",
  },
  {
    id: "7",
    filename: "backup-2024-04-10-20-12-44.sql",
    size: 13631488, // 13 MB in bytes
    created_at: "2025-04-07T20:12:00Z",
    created_by: "Admin User",
    file_path: "/backups/backup-2024-04-10-20-12-44.sql",
  },
  {
    id: "8",
    filename: "backup-2024-04-09-07-55-18.sql",
    size: 17825792, // 17 MB in bytes
    created_at: "2025-04-06T07:55:00Z",
    created_by: "Super Admin",
    file_path: "/backups/backup-2024-04-09-07-55-18.sql",
  },
]

// Helper function to simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Helper function to filter and paginate mock data
const filterAndPaginateBackups = (
  backups: SystemBackup[],
  page = 1,
  limit = 10,
  search?: string | null,
  order_by?: string | null,
  sort?: string | null,
) => {
  let filteredBackups = [...backups]

  // Apply search filter
  if (search) {
    filteredBackups = filteredBackups.filter(
      (backup) =>
        backup.filename.toLowerCase().includes(search.toLowerCase()) ||
        backup.created_by.toLowerCase().includes(search.toLowerCase()),
    )
  }

  // Apply sorting
  if (order_by && sort) {
    filteredBackups.sort((a, b) => {
      let aValue: any = a[order_by as keyof SystemBackup]
      let bValue: any = b[order_by as keyof SystemBackup]

      // Handle date sorting
      if (order_by === "created_at") {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      }

      if (sort === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })
  }

  // Apply pagination
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedBackups = filteredBackups.slice(startIndex, endIndex)

  return {
    backups: paginatedBackups,
    pagination: {
      current_page: page,
      per_page: limit,
      total_pages: Math.ceil(filteredBackups.length / limit),
      total_items: filteredBackups.length,
    },
  }
}

export const SystemBackupService = {
  /**
   * Get all backups with pagination
   */
  getAllBackups: async (
    page?: number,
    limit?: number,
    search?: string | null,
    order_by?: string | null,
    sort?: string | null,
  ): Promise<ApiResponse<GetAllBackupsResponse>> => {
    // Simulate API delay
    await delay(500)

    const result = filterAndPaginateBackups(mockBackups, page, limit, search, order_by, sort)

    return {
      status: "success",
      message: "Backups retrieved successfully",
      data: {
        count: result.backups.length,
        backups: result.backups,
        pagination: result.pagination,
      },
    }

    // TODO: Replace with actual API call when ready
    /*
    const params = new URLSearchParams()
    if (page) params.append("page", page.toString())
    if (limit) params.append("per_page", limit.toString())
    if (search) params.append("search", search)
    if (order_by) params.append("order_by", order_by)
    if (sort) params.append("sort", sort)

    const endpoint = `/system/backup${params.toString() ? `?${params.toString()}` : ""}`
    const response = await apiRequest<ApiResponse<GetAllBackupsResponse>>("get", endpoint, null, {
      useAuth: true,
      useBranchId: true,
    })

    return response.data
    */
  },

  /**
   * Create a new backup
   */
  createBackup: async (payload?: CreateBackupPayload): Promise<ApiResponse<SystemBackup>> => {
    // Simulate API delay
    await delay(2000)

    // Generate new backup with current timestamp
    const now = new Date()
    const timestamp = now.toISOString().replace(/[:.]/g, "-").slice(0, 19)
    const newBackup: SystemBackup = {
      id: (mockBackups.length + 1).toString(),
      filename: `backup-${timestamp}.sql`,
      size: Math.floor(Math.random() * 10000000) + 10000000, // Random size between 10-20 MB
      created_at: now.toISOString(),
      created_by: "Current User",
      file_path: `/backups/backup-${timestamp}.sql`,
    }
    console.log(payload);

    // Add to mock data
    mockBackups.unshift(newBackup)

    return {
      status: "success",
      message: "Backup created successfully",
      data: newBackup,
    }

    // TODO: Replace with actual API call when ready
    /*
    const endpoint = "/system/backup"
    try {
      const response = await apiRequest<ApiResponse<SystemBackup>>("post", endpoint, payload || {}, {
        useAuth: true,
        useBranchId: true,
      })

      return response.data
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to create backup"
      console.log(errorMessage)
      throw error
    }
    */
  },

  /**
   * Download a backup file
   */
  downloadBackup: async ({ id, filename }: { id: string; filename: string }) => {
    console.log(id)
    // Simulate API delay
    await delay(1000)

    // Create a mock blob for download
    const mockContent = `-- Database Backup: ${filename}\n-- Created: ${new Date().toISOString()}\n-- This is a mock backup file for development\n\nCREATE DATABASE IF NOT EXISTS sample_db;\nUSE sample_db;\n\n-- Sample table structure\nCREATE TABLE users (\n  id INT PRIMARY KEY,\n  name VARCHAR(255),\n  email VARCHAR(255)\n);\n\n-- Sample data\nINSERT INTO users VALUES (1, 'John Doe', 'john@example.com');`

    const blob = new Blob([mockContent], { type: "application/sql" })
    return blob

    // TODO: Replace with actual API call when ready
    /*
    const endpoint = `/system/backup/${id}/download`
    try {
      const response = await apiRequest("get", endpoint, null, {
        useAuth: true,
        useBranchId: true,
        responseType: "blob",
      })
      return response.data
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to download backup"
      throw new Error(errorMessage)
    }
    */
  },

  /**
   * Restore a backup
   */
  restoreBackup: async (id: string, password: string): Promise<ApiResponse<null>> => {
    console.log(id)
    // Simulate API delay
    await delay(3000)

    // Mock password validation
    if (password !== "admin123") {
      throw new Error("Invalid password")
    }

    return {
      status: "success",
      message: "Backup restored successfully",
      data: null,
    }

    // TODO: Replace with actual API call when ready
    /*
    const endpoint = `/system/backup/${id}/restore`
    try {
      const response = await apiRequest<ApiResponse<null>>(
        "post",
        endpoint,
        { password },
        {
          useAuth: true,
          useBranchId: true,
        },
      )
      return response.data
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to restore backup"
      throw new Error(errorMessage)
    }
    */
  },

  /**
   * Delete a backup
   */
  deleteBackup: async (id: string): Promise<ApiResponse<null>> => {
    // Simulate API delay
    await delay(1000)

    // Remove from mock data
    const index = mockBackups.findIndex((backup) => backup.id === id)
    if (index > -1) {
      mockBackups.splice(index, 1)
    }

    return {
      status: "success",
      message: "Backup deleted successfully",
      data: null,
    }

    // TODO: Replace with actual API call when ready
    /*
    const endpoint = `/system/backup/${id}`
    try {
      const response = await apiRequest<ApiResponse<null>>("delete", endpoint, null, {
        useAuth: true,
        useBranchId: true,
      })
      return response.data
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to delete backup"
      throw new Error(errorMessage)
    }
    */
  },
}

export default SystemBackupService
