import { apiRequest } from "@/lib/api"
import type {
    ApiResponse,
    GetActivityLogsResponse,
    GetBranchesResponse,
    GetModulesResponse,
    ActivityLogFilters,
    BulkDeletePayload,
} from "./ActivityLogType"

export const ActivityLogService = {
    /**
     * Get activity logs with filters and pagination
     */
    getActivityLogs: async (filters: ActivityLogFilters = {}): Promise<ApiResponse<GetActivityLogsResponse>> => {
        const endpoint = `/activity-log`

        // Prepare query parameters
        const params = new URLSearchParams()

        // Add filters as query parameters
        if (filters.branch_id) params.append("branch_id", filters.branch_id)
        if (filters.module_name) params.append("module_name", filters.module_name)
        if (filters.start_date) params.append("start_date", filters.start_date)
        if (filters.end_date) params.append("end_date", filters.end_date)
        if (filters.search) params.append("search", filters.search)
        if (filters.page) params.append("page", filters.page.toString())
        if (filters.per_page) params.append("per_page", filters.per_page.toString())

        const finalEndpoint = `${endpoint}${params.toString() ? `?${params.toString()}` : ""}`
        const response = await apiRequest<ApiResponse<GetActivityLogsResponse>>("get", finalEndpoint, null, {
            useAuth: true,
            useBranchId: true,
        })

        return response.data
    },

    /**
     * Get branches for filter dropdown
     */
    getBranches: async (): Promise<ApiResponse<GetBranchesResponse>> => {
        const endpoint = `/branch`
        const response = await apiRequest<ApiResponse<GetBranchesResponse>>("get", endpoint, null, {
            useAuth: true,
            useBranchId: true,
        })

        return response.data
    },

    /**
     * Get modules for filter dropdown
     */
    getModules: async (): Promise<ApiResponse<GetModulesResponse>> => {
        const endpoint = `/module`
        const response = await apiRequest<ApiResponse<GetModulesResponse>>("get", endpoint, null, {
            useAuth: true,
            useBranchId: true,
        })

        return response.data
    },

    /**
     * Delete a single activity log entry
     */
    deleteActivityLog: async (id: string): Promise<ApiResponse<null>> => {
        const endpoint = `/activity-log/${id}`
        try {
            const response = await apiRequest<ApiResponse<null>>("delete", endpoint, null, {
                useAuth: true,
                useBranchId: true,
            })
            return response.data
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Failed to delete activity log"
            throw new Error(errorMessage)
        }
    },

    /**
     * Bulk delete activity log entries (Note: API doesn't seem to support this based on Postman collection)
     * This method is kept for future implementation or if the API gets updated
     */
    async bulkDeleteActivityLogs(payload: BulkDeletePayload): Promise<ApiResponse<null>> {
        try {
            const deletePromises = payload.ids.map((id) => this.deleteActivityLog(id))
            await Promise.all(deletePromises)

            return {
                status: "success",
                message: "Activity logs deleted successfully",
                data: null,
            }
        } catch (error: any) {
            const errorMessage = error?.message || "Failed to delete activity logs"
            throw new Error(errorMessage)
        }
    },

    /**
     * Export activity logs to PDF
     */
    exportToPdf: async (filters: ActivityLogFilters = {}): Promise<Blob> => {
        const endpoint = `/activity-log/export-pdf`

        // Prepare query parameters for export
        const params = new URLSearchParams()
        if (filters.branch_id) params.append("branch_id", filters.branch_id)
        if (filters.module_name) params.append("module_name", filters.module_name)
        if (filters.start_date) params.append("start_date", filters.start_date)
        if (filters.end_date) params.append("end_date", filters.end_date)
        if (filters.search) params.append("search", filters.search)

        const finalEndpoint = `${endpoint}${params.toString() ? `?${params.toString()}` : ""}`

        const response = await apiRequest<Blob>("get", finalEndpoint, null, {
            useAuth: true,
            useBranchId: true,
            responseType: "blob",
        })

        return response.data
    },

    /**
     * Export activity logs to CSV
     */
    exportToCsv: async (filters: ActivityLogFilters = {}): Promise<Blob> => {
        const endpoint = `/activity-log/export-csv`

        // Prepare query parameters for export
        const params = new URLSearchParams()
        if (filters.branch_id) params.append("branch_id", filters.branch_id)
        if (filters.module_name) params.append("module_name", filters.module_name)
        if (filters.start_date) params.append("start_date", filters.start_date)
        if (filters.end_date) params.append("end_date", filters.end_date)
        if (filters.search) params.append("search", filters.search)

        const finalEndpoint = `${endpoint}${params.toString() ? `?${params.toString()}` : ""}`

        const response = await apiRequest<Blob>("get", finalEndpoint, null, {
            useAuth: true,
            useBranchId: true,
            responseType: "blob",
        })

        return response.data
    },
}

export default ActivityLogService
