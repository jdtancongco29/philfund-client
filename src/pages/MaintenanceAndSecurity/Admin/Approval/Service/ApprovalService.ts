import type {
  ApiResponse,
  GetApprovalRequestsResponse,
  GetBranchesResponse,
  GetTransactionTypesResponse,
  ApprovalRequestFilters,
  ApproveRequestPayload,
  DenyRequestPayload,
  BulkApprovePayload,
  BulkDenyPayload,
  ApprovalRequest,
} from "./ApprovalType"

// Sample data for development
const sampleApprovalRequests: ApprovalRequest[] = [
  {
    id: "1",
    branch_id: "branch-1",
    branch_name: "BranchA",
    date_time: "2025-04-12T02:34:00Z",
    loan_type: "Salary Loan",
    pn_no: "PN-2132-231",
    reference: "CA",
    reference_number: "44344-34536",
    requested_by: "David Miller",
    description: "Credit note issuance for customer return",
    type: "CK",
    status: "pending",
    created_at: "2025-04-12T02:34:00Z",
    updated_at: "2025-04-12T02:34:00Z",
  },
  {
    id: "2",
    branch_id: "branch-2",
    branch_name: "BranchB",
    date_time: "2025-04-12T02:34:00Z",
    loan_type: "Salary Loan",
    pn_no: "PN-2132-231",
    reference: "SALARY",
    reference_number: "44344-34536",
    requested_by: "David Miller",
    description: "Credit note issuance for customer return",
    type: "CV",
    status: "pending",
    created_at: "2025-04-12T02:34:00Z",
    updated_at: "2025-04-12T02:34:00Z",
  },
  {
    id: "3",
    branch_id: "branch-3",
    branch_name: "BranchC",
    date_time: "2025-04-12T02:34:00Z",
    loan_type: "Salary Loan",
    pn_no: "PN-2132-231",
    reference: "BONUS",
    reference_number: "44344-34536",
    requested_by: "David Miller",
    description: "Credit note issuance for customer return",
    type: "OR",
    status: "pending",
    created_at: "2025-04-12T02:34:00Z",
    updated_at: "2025-04-12T02:34:00Z",
  },
]

const sampleBranches = [
  { id: "branch-1", name: "BranchA", code: "BA" },
  { id: "branch-2", name: "BranchB", code: "BB" },
  { id: "branch-3", name: "BranchC", code: "BC" },
]

const sampleTransactionTypes = [
  { id: "salary-loan", name: "Salary Loan", code: "SL" },
  { id: "personal-loan", name: "Personal Loan", code: "PL" },
  { id: "business-loan", name: "Business Loan", code: "BL" },
]

export const ForApprovalService = {
  /**
   * Get approval requests with filters and pagination
   */
  getApprovalRequests: async (
    filters: ApprovalRequestFilters = {},
  ): Promise<ApiResponse<GetApprovalRequestsResponse>> => {
    // TODO: Replace with actual API call when ready
    // const endpoint = `/approval-requests`
    // const params = new URLSearchParams()
    // if (filters.branch_id) params.append("branch_id", filters.branch_id)
    // if (filters.transaction_type) params.append("transaction_type", filters.transaction_type)
    // if (filters.start_date) params.append("start_date", filters.start_date)
    // if (filters.end_date) params.append("end_date", filters.end_date)
    // if (filters.search) params.append("search", filters.search)
    // if (filters.page) params.append("page", filters.page.toString())
    // if (filters.per_page) params.append("per_page", filters.per_page.toString())

    // const finalEndpoint = `${endpoint}${params.toString() ? `?${params.toString()}` : ""}`
    // const response = await apiRequest<ApiResponse<GetApprovalRequestsResponse>>("get", finalEndpoint, null, {
    //   useAuth: true,
    //   useBranchId: true,
    // })

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Filter sample data based on filters
    let filteredData = [...sampleApprovalRequests]

    if (filters.search) {
      filteredData = filteredData.filter(
        (item) =>
          item.branch_name.toLowerCase().includes(filters.search!.toLowerCase()) ||
          item.requested_by.toLowerCase().includes(filters.search!.toLowerCase()) ||
          item.description.toLowerCase().includes(filters.search!.toLowerCase()),
      )
    }

    if (filters.branch_id) {
      filteredData = filteredData.filter((item) => item.branch_id === filters.branch_id)
    }

    if (filters.transaction_type) {
      filteredData = filteredData.filter((item) => item.loan_type === filters.transaction_type)
    }

    const page = filters.page || 1
    const perPage = filters.per_page || 10
    const startIndex = (page - 1) * perPage
    const endIndex = startIndex + perPage
    const paginatedData = filteredData.slice(startIndex, endIndex)

    return {
      status: "success",
      message: "Approval requests retrieved successfully",
      data: {
        count: filteredData.length,
        approval_requests: paginatedData,
        pagination: {
          current_page: page,
          per_page: perPage,
          total_pages: Math.ceil(filteredData.length / perPage),
          total_items: filteredData.length,
        },
      },
    }
  },

  /**
   * Get branches for filter dropdown
   */
  getBranches: async (): Promise<ApiResponse<GetBranchesResponse>> => {
    // TODO: Replace with actual API call when ready
    // const endpoint = `/branch`
    // const response = await apiRequest<ApiResponse<GetBranchesResponse>>("get", endpoint, null, {
    //   useAuth: true,
    //   useBranchId: true,
    // })

    await new Promise((resolve) => setTimeout(resolve, 200))

    return {
      status: "success",
      message: "Branches retrieved successfully",
      data: {
        count: sampleBranches.length,
        branches: sampleBranches,
        pagination: {
          current_page: 1,
          per_page: sampleBranches.length,
          total_pages: 1,
          total_items: sampleBranches.length,
        },
      },
    }
  },

  /**
   * Get transaction types for filter dropdown
   */
  getTransactionTypes: async (): Promise<ApiResponse<GetTransactionTypesResponse>> => {
    // TODO: Replace with actual API call when ready
    // const endpoint = `/transaction-types`
    // const response = await apiRequest<ApiResponse<GetTransactionTypesResponse>>("get", endpoint, null, {
    //   useAuth: true,
    //   useBranchId: false,
    // })

    await new Promise((resolve) => setTimeout(resolve, 200))

    return {
      status: "success",
      message: "Transaction types retrieved successfully",
      data: {
        count: sampleTransactionTypes.length,
        transaction_types: sampleTransactionTypes,
      },
    }
  },

  /**
   * Approve a single request
   */
  approveRequest: async (payload: ApproveRequestPayload): Promise<ApiResponse<null>> => {
    console.log(payload)
    // TODO: Replace with actual API call when ready
    // const endpoint = `/approval-requests/${payload.approval_request_id}/approve`
    // try {
    //   const response = await apiRequest<ApiResponse<null>>("post", endpoint, payload, {
    //     useAuth: true,
    //     useBranchId: true,
    //   })
    //   return response.data
    // } catch (error: any) {
    //   const errorMessage = error.response?.data?.message || "Failed to approve request"
    //   throw new Error(errorMessage)
    // }

    await new Promise((resolve) => setTimeout(resolve, 1000))

    return {
      status: "success",
      message: "Request approved successfully",
      data: null,
    }
  },

  /**
   * Deny a single request
   */
  denyRequest: async (payload: DenyRequestPayload): Promise<ApiResponse<null>> => {
    console.log(payload)
    // TODO: Replace with actual API call when ready
    // const endpoint = `/approval-requests/${payload.approval_request_id}/deny`
    // try {
    //   const response = await apiRequest<ApiResponse<null>>("post", endpoint, payload, {
    //     useAuth: true,
    //     useBranchId: true,
    //   })
    //   return response.data
    // } catch (error: any) {
    //   const errorMessage = error.response?.data?.message || "Failed to deny request"
    //   throw new Error(errorMessage)
    // }

    await new Promise((resolve) => setTimeout(resolve, 1000))

    return {
      status: "success",
      message: "Request denied successfully",
      data: null,
    }
  },

  /**
   * Bulk approve requests
   */
  bulkApproveRequests: async (payload: BulkApprovePayload): Promise<ApiResponse<null>> => {
    console.log(payload)
    // TODO: Replace with actual API call when ready
    // const endpoint = `/approval-requests/bulk-approve`
    // try {
    //   const response = await apiRequest<ApiResponse<null>>("post", endpoint, payload, {
    //     useAuth: true,
    //     useBranchId: true,
    //   })
    //   return response.data
    // } catch (error: any) {
    //   const errorMessage = error.response?.data?.message || "Failed to approve requests"
    //   throw new Error(errorMessage)
    // }

    await new Promise((resolve) => setTimeout(resolve, 1500))

    return {
      status: "success",
      message: "Requests approved successfully",
      data: null,
    }
  },

  /**
   * Bulk deny requests
   */
  bulkDenyRequests: async (payload: BulkDenyPayload): Promise<ApiResponse<null>> => {
    console.log(payload)
    // TODO: Replace with actual API call when ready
    // const endpoint = `/approval-requests/bulk-deny`
    // try {
    //   const response = await apiRequest<ApiResponse<null>>("post", endpoint, payload, {
    //     useAuth: true,
    //     useBranchId: true,
    //   })
    //   return response.data
    // } catch (error: any) {
    //   const errorMessage = error.response?.data?.message || "Failed to deny requests"
    //   throw new Error(errorMessage)
    // }

    await new Promise((resolve) => setTimeout(resolve, 1500))

    return {
      status: "success",
      message: "Requests denied successfully",
      data: null,
    }
  },

  /**
   * Export approval requests to PDF
   */
  exportToPdf: async (filters: ApprovalRequestFilters = {}): Promise<Blob> => {
    console.log(filters)
    // TODO: Replace with actual API call when ready
    // const endpoint = `/approval-requests/export-pdf`
    // const params = new URLSearchParams()
    // if (filters.branch_id) params.append("branch_id", filters.branch_id)
    // if (filters.transaction_type) params.append("transaction_type", filters.transaction_type)
    // if (filters.start_date) params.append("start_date", filters.start_date)
    // if (filters.end_date) params.append("end_date", filters.end_date)
    // if (filters.search) params.append("search", filters.search)

    // const finalEndpoint = `${endpoint}${params.toString() ? `?${params.toString()}` : ""}`
    // const response = await apiRequest<Blob>("get", finalEndpoint, null, {
    //   useAuth: true,
    //   useBranchId: true,
    //   responseType: "blob",
    // })

    // return response.data

    // Simulate PDF generation
    await new Promise((resolve) => setTimeout(resolve, 2000))
    const blob = new Blob(["Sample PDF content"], { type: "application/pdf" })
    return blob
  },

  /**
   * Export approval requests to CSV
   */
  exportToCsv: async (filters: ApprovalRequestFilters = {}): Promise<Blob> => {
    console.log(filters)
    // TODO: Replace with actual API call when ready
    // const endpoint = `/approval-requests/export-csv`
    // const params = new URLSearchParams()
    // if (filters.branch_id) params.append("branch_id", filters.branch_id)
    // if (filters.transaction_type) params.append("transaction_type", filters.transaction_type)
    // if (filters.start_date) params.append("start_date", filters.start_date)
    // if (filters.end_date) params.append("end_date", filters.end_date)
    // if (filters.search) params.append("search", filters.search)

    // const finalEndpoint = `${endpoint}${params.toString() ? `?${params.toString()}` : ""}`
    // const response = await apiRequest<Blob>("get", finalEndpoint, null, {
    //   useAuth: true,
    //   useBranchId: true,
    //   responseType: "blob",
    // })

    // return response.data

    // Simulate CSV generation
    await new Promise((resolve) => setTimeout(resolve, 1500))
    const csvContent = "Branch,Date & Time,Loan Type,PN No.,Reference,Requested By,Description,Type\n"
    const blob = new Blob([csvContent], { type: "text/csv" })
    return blob
  },
}

export default ForApprovalService
