import { apiRequest } from "@/lib/api"
import type {
  ApiResponse,
  GetAllSalaryLoanReleaseResponse,
  FilterOptions,
  SalaryLoanReleaseFilters,
  SalaryLoanRelease,
} from "./SalaryLoanReleaseTypes"

// Dummy data for development
const DUMMY_LOANS: SalaryLoanRelease[] = [
  {
    id: "1",
    dateGenerated: "2024-01-15",
    borrowerName: "Jane Doe",
    division: "SL",
    school: "2023-2123",
    loanType: "Salary Loan",
    pnNo: "PN-234-4234",
    reference: "02100-2023-31",
    principal: 50000.0,
    terms: 12,
    deferredInterest: 30500.0,
    totalPayable: 50500.0,
    amortization: 875.0,
    startDate: "2024-05-07",
    dueDate: "2025-05-01",
    serviceCharge: 10600.0,
    fileFee: 500,
    notarialFee: 0,
    netFee: 0,
    customerNetFee: 5000,
    otherCharges: 0,
    loanBalance: 0,
    otherDeductions: 500,
    cashAdvance: 0,
    salaryDeduction: 12000.0,
    netProceeds: 12000.0,
  },
  {
    id: "2",
    dateGenerated: "2024-01-15",
    borrowerName: "Jane Doe",
    division: "SL",
    school: "2023-2123",
    loanType: "Salary Loan",
    pnNo: "PN-234-4234",
    reference: "02100-2023-31",
    principal: 50000.0,
    terms: 12,
    deferredInterest: 30500.0,
    totalPayable: 50500.0,
    amortization: 875.0,
    startDate: "2024-05-07",
    dueDate: "2025-05-01",
    serviceCharge: 10600.0,
    fileFee: 500,
    notarialFee: 0,
    netFee: 0,
    customerNetFee: 5000,
    otherCharges: 0,
    loanBalance: 0,
    otherDeductions: 500,
    cashAdvance: 0,
    salaryDeduction: 12000.0,
    netProceeds: 12000.0,
  },
  {
    id: "3",
    dateGenerated: "2024-01-15",
    borrowerName: "Jane Doe",
    division: "SL",
    school: "2023-2123",
    loanType: "Salary Loan",
    pnNo: "PN-234-4234",
    reference: "02100-2023-31",
    principal: 50000.0,
    terms: 12,
    deferredInterest: 30500.0,
    totalPayable: 50500.0,
    amortization: 875.0,
    startDate: "2024-05-07",
    dueDate: "2025-05-01",
    serviceCharge: 10600.0,
    fileFee: 500,
    notarialFee: 0,
    netFee: 0,
    customerNetFee: 5000,
    otherCharges: 0,
    loanBalance: 0,
    otherDeductions: 500,
    cashAdvance: 0,
    salaryDeduction: 12000.0,
    netProceeds: 12000.0,
  },
  {
    id: "4",
    dateGenerated: "2024-01-15",
    borrowerName: "Jane Doe",
    division: "SL",
    school: "2023-2123",
    loanType: "Salary Loan",
    pnNo: "PN-234-4234",
    reference: "02100-2023-31",
    principal: 50000.0,
    terms: 12,
    deferredInterest: 30500.0,
    totalPayable: 50500.0,
    amortization: 875.0,
    startDate: "2024-05-07",
    dueDate: "2025-05-01",
    serviceCharge: 10600.0,
    fileFee: 500,
    notarialFee: 0,
    netFee: 0,
    customerNetFee: 5000,
    otherCharges: 0,
    loanBalance: 0,
    otherDeductions: 500,
    cashAdvance: 0,
    salaryDeduction: 12000.0,
    netProceeds: 12000.0,
  },
  {
    id: "5",
    dateGenerated: "2024-01-15",
    borrowerName: "Jane Doe",
    division: "SL",
    school: "2023-2123",
    loanType: "Salary Loan",
    pnNo: "PN-234-4234",
    reference: "02100-2023-31",
    principal: 50000.0,
    terms: 12,
    deferredInterest: 30500.0,
    totalPayable: 50500.0,
    amortization: 875.0,
    startDate: "2024-05-07",
    dueDate: "2025-05-01",
    serviceCharge: 10600.0,
    fileFee: 500,
    notarialFee: 0,
    netFee: 0,
    customerNetFee: 5000,
    otherCharges: 0,
    loanBalance: 0,
    otherDeductions: 500,
    cashAdvance: 0,
    salaryDeduction: 12000.0,
    netProceeds: 12000.0,
  },
]

const DUMMY_FILTER_OPTIONS: FilterOptions = {
  branches: [
    { id: "1", name: "Main Branch" },
    { id: "2", name: "North Branch" },
    { id: "3", name: "South Branch" },
  ],
  divisions: [
    { id: "1", name: "SL" },
    { id: "2", name: "HR" },
    { id: "3", name: "Finance" },
  ],
  schools: [
    { id: "1", name: "2023-2024" },
    { id: "2", name: "2024-2025" },
    { id: "3", name: "2022-2023" },
  ],
}

// Helper function to simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Helper function to filter dummy data
const filterDummyData = (
  data: SalaryLoanRelease[],
  filters?: SalaryLoanReleaseFilters,
  search?: string | null,
): SalaryLoanRelease[] => {
  let filteredData = [...data]

  // Apply search filter
  if (search) {
    filteredData = filteredData.filter((loan) =>
      Object.values(loan).some((value) => String(value).toLowerCase().includes(search.toLowerCase())),
    )
  }

  // Apply filters
  if (filters?.branch) {
    // In real implementation, you would filter by branch
    // For dummy data, we'll just keep all data
  }

  if (filters?.borrowerName) {
    filteredData = filteredData.filter((loan) =>
      loan.borrowerName.toLowerCase().includes(filters.borrowerName!.toLowerCase()),
    )
  }

  if (filters?.division) {
    filteredData = filteredData.filter((loan) => loan.division === filters.division)
  }

  if (filters?.school) {
    filteredData = filteredData.filter((loan) => loan.school === filters.school)
  }

  // Apply date range filter
  if (filters?.dateFrom && filters?.dateTo) {
    const fromDate = new Date(filters.dateFrom)
    const toDate = new Date(filters.dateTo)
    filteredData = filteredData.filter((loan) => {
      const loanDate = new Date(loan.dateGenerated)
      return loanDate >= fromDate && loanDate <= toDate
    })
  }

  return filteredData
}

// Helper function to paginate data
const paginateData = (data: SalaryLoanRelease[], page: number, limit: number) => {
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  return data.slice(startIndex, endIndex)
}

export const SalaryLoanReleaseService = {
  /**
   * Get all salary loan releases with pagination and filters
   */
  getAllSalaryLoanReleases: async (
    page = 1,
    limit = 10,
    search?: string | null,
    order_by?: string | null,
    sort?: string | null,
    filters?: SalaryLoanReleaseFilters,
  ): Promise<ApiResponse<GetAllSalaryLoanReleaseResponse>> => {
    // Simulate API delay
    await delay(500)

    // For development: use dummy data
    const USE_DUMMY_DATA = true // Set to false when API is ready

    if (USE_DUMMY_DATA) {
      // Filter dummy data
      const filteredData = filterDummyData(DUMMY_LOANS, filters, search)

      // Sort data if needed
      if (order_by && sort) {
        filteredData.sort((a, b) => {
          const aValue = a[order_by as keyof SalaryLoanRelease]
          const bValue = b[order_by as keyof SalaryLoanRelease]

          if (sort === "asc") {
            return aValue > bValue ? 1 : -1
          } else {
            return aValue < bValue ? 1 : -1
          }
        })
      }

      // Paginate data
      const paginatedData = paginateData(filteredData, page, limit)
      const totalPages = Math.ceil(filteredData.length / limit)

      return {
        status: "success",
        message: "Data retrieved successfully",
        data: {
          count: filteredData.length,
          loans: paginatedData,
          pagination: {
            current_page: page,
            per_page: limit,
            total_pages: totalPages,
            total_items: filteredData.length,
          },
        },
      }
    }

    // Real API implementation (when ready)
    const params = new URLSearchParams()
    if (page) params.append("page", page.toString())
    if (limit) params.append("per_page", limit.toString())
    if (search) params.append("search", search)
    if (order_by) params.append("order_by", order_by)
    if (sort) params.append("sort", sort)

    // Add filters
    if (filters?.branch) params.append("branch", filters.branch)
    if (filters?.borrowerName) params.append("borrower_name", filters.borrowerName)
    if (filters?.division) params.append("division", filters.division)
    if (filters?.school) params.append("school", filters.school)
    if (filters?.dateFrom) params.append("date_from", filters.dateFrom)
    if (filters?.dateTo) params.append("date_to", filters.dateTo)

    const endpoint = `/salary-loan-release${params.toString() ? `?${params.toString()}` : ""}`
    const response = await apiRequest<ApiResponse<GetAllSalaryLoanReleaseResponse>>("get", endpoint, null, {
      useAuth: true,
      useBranchId: true,
    })

    return response.data
  },

  /**
   * Get filter options (branches, divisions, schools)
   */
  getFilterOptions: async (): Promise<ApiResponse<FilterOptions>> => {
    // Simulate API delay
    await delay(300)

    // For development: use dummy data
    const USE_DUMMY_DATA = true // Set to false when API is ready

    if (USE_DUMMY_DATA) {
      return {
        status: "success",
        message: "Filter options retrieved successfully",
        data: DUMMY_FILTER_OPTIONS,
      }
    }

    // Real API implementation (when ready)
    const endpoint = `/salary-loan-release/filter-options`
    const response = await apiRequest<ApiResponse<FilterOptions>>("get", endpoint, null, {
      useAuth: true,
      useBranchId: true,
    })

    return response.data
  },

  /**
   * Export to PDF
   */
  exportPdf: async (filters?: SalaryLoanReleaseFilters) => {
    // Simulate API delay
    await delay(1000)

    // For development: simulate PDF export
    const USE_DUMMY_DATA = true // Set to false when API is ready

    if (USE_DUMMY_DATA) {
      // Create a dummy PDF blob URL
      const dummyPdfContent = "Dummy PDF content for Salary Loan Release Report"
      const blob = new Blob([dummyPdfContent], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)

      return {
        status: "success",
        message: "PDF generated successfully",
        url: url,
      }
    }

    // Real API implementation (when ready)
    const params = new URLSearchParams()
    if (filters?.branch) params.append("branch", filters.branch)
    if (filters?.borrowerName) params.append("borrower_name", filters.borrowerName)
    if (filters?.division) params.append("division", filters.division)
    if (filters?.school) params.append("school", filters.school)
    if (filters?.dateFrom) params.append("date_from", filters.dateFrom)
    if (filters?.dateTo) params.append("date_to", filters.dateTo)

    const endpoint = `/salary-loan-release/export-pdf${params.toString() ? `?${params.toString()}` : ""}`
    try {
      const response = await apiRequest("get", endpoint, null, {
        useAuth: true,
        useBranchId: true,
      })
      return response.data
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to export PDF"
      throw new Error(errorMessage)
    }
  },

  /**
   * Export to CSV
   */
  exportCsv: async (filters?: SalaryLoanReleaseFilters) => {
    // Simulate API delay
    await delay(1000)

    // For development: simulate CSV export
    const USE_DUMMY_DATA = true // Set to false when API is ready

    if (USE_DUMMY_DATA) {
      // Create dummy CSV content
      const filteredData = filterDummyData(DUMMY_LOANS, filters)
      const csvHeaders = [
        "Date Generated",
        "Borrower Name",
        "Division",
        "School",
        "Loan Type",
        "PN No.",
        "Reference",
        "Principal",
        "Terms",
        "Deferred Interest",
        "Total Payable",
        "Amortization",
        "Start Date",
        "Due Date",
        "Service Charge",
        "File Fee",
        "Notarial Fee",
        "Net Fee",
        "Customer Net Fee",
        "Other Charges",
        "Loan Balance",
        "Other Deductions",
        "Cash Advance",
        "Salary Deduction",
        "Net Proceeds",
      ]

      const csvRows = filteredData.map((loan) => [
        loan.dateGenerated,
        loan.borrowerName,
        loan.division,
        loan.school,
        loan.loanType,
        loan.pnNo,
        loan.reference,
        loan.principal,
        loan.terms,
        loan.deferredInterest,
        loan.totalPayable,
        loan.amortization,
        loan.startDate,
        loan.dueDate,
        loan.serviceCharge,
        loan.fileFee,
        loan.notarialFee,
        loan.netFee,
        loan.customerNetFee,
        loan.otherCharges,
        loan.loanBalance,
        loan.otherDeductions,
        loan.cashAdvance,
        loan.salaryDeduction,
        loan.netProceeds,
      ])

      const csvContent = [csvHeaders, ...csvRows].map((row) => row.join(",")).join("\n")
      const blob = new Blob([csvContent], { type: "text/csv" })

      return blob
    }

    // Real API implementation (when ready)
    const params = new URLSearchParams()
    if (filters?.branch) params.append("branch", filters.branch)
    if (filters?.borrowerName) params.append("borrower_name", filters.borrowerName)
    if (filters?.division) params.append("division", filters.division)
    if (filters?.school) params.append("school", filters.school)
    if (filters?.dateFrom) params.append("date_from", filters.dateFrom)
    if (filters?.dateTo) params.append("date_to", filters.dateTo)

    const endpoint = `/salary-loan-release/export-csv${params.toString() ? `?${params.toString()}` : ""}`
    try {
      const response = await apiRequest("get", endpoint, null, {
        useAuth: true,
        useBranchId: true,
        responseType: "blob",
      })
      return response.data
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to export CSV"
      throw new Error(errorMessage)
    }
  },
}

export default SalaryLoanReleaseService
