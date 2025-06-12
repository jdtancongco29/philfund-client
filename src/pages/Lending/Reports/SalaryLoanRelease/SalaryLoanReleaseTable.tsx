"use client"

import { useCallback, useState, useEffect } from "react"
import type { SearchDefinition, ColumnDefinition, FilterDefinition } from "@/components/data-table/data-table-v2"
import type { SalaryLoanRelease, SalaryLoanReleaseFilters, FilterOptions } from "./Service/SalaryLoanReleaseTypes"
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query"
import SalaryLoanReleaseService from "./Service/SalaryLoanReleaseService"
import { DataTableV2 } from "@/components/data-table/data-table-v2"
import { toast } from "sonner"
import { downloadFile } from "@/lib/utils"
import type { ModulePermissionProps } from "@/pages/MaintenanceAndSecurity/Security/UserPermissions/Service/PermissionsTypes"

export function SalaryLoanReleaseTable({ canExport }: ModulePermissionProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchQuery, _setSearchQuery] = useState<string | null>(null)
  const [columnSort, setColumnSort] = useState<string | null>(null)
  const [sortQuery, setSortQuery] = useState<string | null>(null)
  const [filters, setFilters] = useState<SalaryLoanReleaseFilters>({})
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    branches: [],
    divisions: [],
    schools: [],
  })

  // Fetch filter options
  const { data: filterOptionsData } = useQuery({
    queryKey: ["salary-loan-release-filter-options"],
    queryFn: SalaryLoanReleaseService.getFilterOptions,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  useEffect(() => {
    if (filterOptionsData?.data) {
      setFilterOptions(filterOptionsData.data)
    }
  }, [filterOptionsData])

  const onPaginationChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  const onRowCountChange = useCallback((row: number) => {
    setRowsPerPage(row)
    setCurrentPage(1)
  }, [])

//   const onSearchChange = useCallback((search: string) => {
//     setSearchQuery(search || null)
//     setCurrentPage(1)
//   }, [])

  // Handle filter changes from DataTableV2
  const handleFilterChange = useCallback((filterId: string, value: any) => {
    setFilters((prev) => {
      if (filterId === "dateRange") {
        // Handle date range filter
        if (value?.from && value?.to) {
          return {
            ...prev,
            dateFrom: value.from.toISOString().split("T")[0],
            dateTo: value.to.toISOString().split("T")[0],
          }
        } else {
          const { dateFrom, dateTo, ...rest } = prev
          return rest
        }
      } else {
        // Handle other filters
        if (value === "all" || !value) {
          const { [filterId]: removed, ...rest } = prev
          return rest
        }
        return {
          ...prev,
          [filterId]: value,
        }
      }
    })
    setCurrentPage(1)
  }, [])

  const {
    isPending,
    error,
    isFetching,
    data: salaryLoans,
  } = useQuery({
    queryKey: ["salary-loan-release-table", currentPage, rowsPerPage, searchQuery, columnSort, sortQuery, filters],
    queryFn: () =>
      SalaryLoanReleaseService.getAllSalaryLoanReleases(
        currentPage,
        rowsPerPage,
        searchQuery,
        columnSort,
        sortQuery,
        filters,
      ),
    staleTime: Number.POSITIVE_INFINITY,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  })

  // Export mutations
  const exportPdfMutation = useMutation({
    mutationFn: () => SalaryLoanReleaseService.exportPdf(filters),
    onSuccess: (data) => {
      const newTab = window.open(data.url, "_blank")
      if (newTab) {
        newTab.focus()
        toast.success("PDF opened in new tab")
      } else {
        toast.error("Failed to open PDF. Please try again.")
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to export PDF")
    },
  })

  const exportCsvMutation = useMutation({
    mutationFn: () => SalaryLoanReleaseService.exportCsv(filters),
    onSuccess: (csvData: Blob) => {
      try {
        const currentDate = new Date().toISOString().split("T")[0]
        downloadFile(csvData, `salary-loan-release-${currentDate}.csv`)
        toast.success("CSV generated successfully")
      } catch (error) {
        toast.error("Failed to process CSV data")
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to export CSV")
    },
  })

  if (error) return "An error has occurred: " + error.message

  // Define columns
  const columns: ColumnDefinition<SalaryLoanRelease>[] = [
    {
      id: "dateGenerated",
      header: "Date Generated",
      accessorKey: "dateGenerated",
      enableSorting: true,
      cell: (row) => new Date(row.dateGenerated).toLocaleDateString(),
    },
    {
      id: "borrowerName",
      header: "Borrower Name",
      accessorKey: "borrowerName",
      enableSorting: true,
    },
    {
      id: "division",
      header: "Division",
      accessorKey: "division",
      enableSorting: true,
    },
    {
      id: "school",
      header: "School",
      accessorKey: "school",
      enableSorting: true,
    },
    {
      id: "loanType",
      header: "Loan Type",
      accessorKey: "loanType",
      enableSorting: true,
    },
    {
      id: "pnNo",
      header: "PN No.",
      accessorKey: "pnNo",
      enableSorting: true,
    },
    {
      id: "reference",
      header: "Reference",
      accessorKey: "reference",
      enableSorting: true,
    },
    {
      id: "principal",
      header: "Principal",
      accessorKey: "principal",
      enableSorting: true,
      align: "right",
      cell: (row) => `₱${row.principal.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
    },
    {
      id: "terms",
      header: "Terms",
      accessorKey: "terms",
      enableSorting: true,
      align: "left",
    },
    {
      id: "deferredInterest",
      header: "Deferred Interest",
      accessorKey: "deferredInterest",
      enableSorting: true,
      align: "left",
      cell: (row) => `₱${row.deferredInterest.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
    },
    {
      id: "totalPayable",
      header: "Total Payable",
      accessorKey: "totalPayable",
      enableSorting: true,
      align: "left",
      cell: (row) => `₱${row.totalPayable.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
    },
    {
      id: "amortization",
      header: "Amortization",
      accessorKey: "amortization",
      enableSorting: true,
      align: "left",
      cell: (row) => `₱${row.amortization.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
    },
    {
      id: "startDate",
      header: "Start Date",
      accessorKey: "startDate",
      enableSorting: true,
      cell: (row) => new Date(row.startDate).toLocaleDateString(),
    },
    {
      id: "dueDate",
      header: "Due Date",
      accessorKey: "dueDate",
      enableSorting: true,
      cell: (row) => new Date(row.dueDate).toLocaleDateString(),
    },
    {
      id: "serviceCharge",
      header: "Service Charge",
      accessorKey: "serviceCharge",
      enableSorting: true,
      align: "left",
      cell: (row) => `₱${row.serviceCharge.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
    },
    {
      id: "fileFee",
      header: "File Fee",
      accessorKey: "fileFee",
      enableSorting: true,
      align: "left",
      cell: (row) => `₱${row.fileFee.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
    },
    {
      id: "notarialFee",
      header: "Notarial Fee",
      accessorKey: "notarialFee",
      enableSorting: true,
      align: "left",
      cell: (row) => `₱${row.notarialFee.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
    },
    {
      id: "netFee",
      header: "Net Fee",
      accessorKey: "netFee",
      enableSorting: true,
      align: "left",
      cell: (row) => `₱${row.netFee.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
    },
    {
      id: "customerNetFee",
      header: "Customer Net Fee",
      accessorKey: "customerNetFee",
      enableSorting: true,
      align: "left",
      cell: (row) => `₱${row.customerNetFee.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
    },
    {
      id: "otherCharges",
      header: "Other Charges",
      accessorKey: "otherCharges",
      enableSorting: true,
      align: "left",
      cell: (row) => `₱${row.otherCharges.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
    },
    {
      id: "loanBalance",
      header: "Loan Balance",
      accessorKey: "loanBalance",
      enableSorting: true,
      align: "left",
      cell: (row) => `₱${row.loanBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
    },
    {
      id: "otherDeductions",
      header: "Other Deductions",
      accessorKey: "otherDeductions",
      enableSorting: true,
      align: "left",
      cell: (row) => `₱${row.otherDeductions.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
    },
    {
      id: "cashAdvance",
      header: "Cash Advance",
      accessorKey: "cashAdvance",
      enableSorting: true,
      align: "left",
      cell: (row) => `₱${row.cashAdvance.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
    },
    {
      id: "salaryDeduction",
      header: "Salary Deduction",
      accessorKey: "salaryDeduction",
      enableSorting: true,
      align: "left",
      cell: (row) => `₱${row.salaryDeduction.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
    },
    {
      id: "netProceeds",
      header: "Net Proceeds",
      accessorKey: "netProceeds",
      enableSorting: true,
      align: "left",
      cell: (row) => `₱${row.netProceeds.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
    },
  ]

  // Define filters with date range support
  const filterDefinitions: FilterDefinition[] = [
    {
      id: "branch",
      label: "Branch",
      type: "select",
      placeholder: "Select...",
      options: filterOptions.branches.map((branch) => ({
        label: branch.name,
        value: branch.id,
      })),
    },
    {
      id: "borrowerName",
      label: "Borrower Name",
      type: "input",
      placeholder: "Select...",
    },
    {
      id: "division",
      label: "Division",
      type: "select",
      placeholder: "Select...",
      options: filterOptions.divisions.map((division) => ({
        label: division.name,
        value: division.id,
      })),
    },
    {
      id: "school",
      label: "School",
      type: "select",
      placeholder: "Select...",
      options: filterOptions.schools.map((school) => ({
        label: school.name,
        value: school.id,
      })),
    },
    {
      id: "dateRange",
      label: "Date range picker",
      type: "dateRange",
      placeholder: "mm / dd / yyyy - mm / dd / yyyy",
    },
  ]

  const search: SearchDefinition = {
    title: "Search",
    placeholder: "Search loans",
    enableSearch: false,
  }

  // Handle exports
  const handlePdfExport = () => {
    exportPdfMutation.mutate()
  }

  const handleCsvExport = () => {
    exportCsvMutation.mutate()
  }

  const handleSort = (column: string, sort: string) => {
    setColumnSort(column)
    setSortQuery(sort)
  }

  // Calculate totals
  const calculateTotals = (data: SalaryLoanRelease[]) => {
    const totals = data.reduce(
      (acc, loan) => {
        return {
          principal: acc.principal + loan.principal,
          deferredInterest: acc.deferredInterest + loan.deferredInterest,
          totalPayable: acc.totalPayable + loan.totalPayable,
          amortization: acc.amortization + loan.amortization,
          serviceCharge: acc.serviceCharge + loan.serviceCharge,
          fileFee: acc.fileFee + loan.fileFee,
          notarialFee: acc.notarialFee + loan.notarialFee,
          netFee: acc.netFee + loan.netFee,
          customerNetFee: acc.customerNetFee + loan.customerNetFee,
          otherCharges: acc.otherCharges + loan.otherCharges,
          loanBalance: acc.loanBalance + loan.loanBalance,
          otherDeductions: acc.otherDeductions + loan.otherDeductions,
          cashAdvance: acc.cashAdvance + loan.cashAdvance,
          salaryDeduction: acc.salaryDeduction + loan.salaryDeduction,
          netProceeds: acc.netProceeds + loan.netProceeds,
        }
      },
      {
        principal: 0,
        deferredInterest: 0,
        totalPayable: 0,
        amortization: 0,
        serviceCharge: 0,
        fileFee: 0,
        notarialFee: 0,
        netFee: 0,
        customerNetFee: 0,
        otherCharges: 0,
        loanBalance: 0,
        otherDeductions: 0,
        cashAdvance: 0,
        salaryDeduction: 0,
        netProceeds: 0,
      },
    )

    // Format totals with currency
    return {
      dateGenerated: "-",
      borrowerName: "-",
      division: "-",
      school: "-",
      loanType: "-",
      pnNo: "-",
      reference: "-",
      principal: `₱${totals.principal.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      terms: "-",
      deferredInterest: `₱${totals.deferredInterest.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      totalPayable: `₱${totals.totalPayable.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      amortization: `₱${totals.amortization.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      startDate: "-",
      dueDate: "-",
      serviceCharge: `₱${totals.serviceCharge.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      fileFee: `₱${totals.fileFee.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      notarialFee: `₱${totals.notarialFee.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      netFee: `₱${totals.netFee.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      customerNetFee: `₱${totals.customerNetFee.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      otherCharges: `₱${totals.otherCharges.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      loanBalance: `₱${totals.loanBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      otherDeductions: `₱${totals.otherDeductions.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      cashAdvance: `₱${totals.cashAdvance.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      salaryDeduction: `₱${totals.salaryDeduction.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      netProceeds: `₱${totals.netProceeds.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
    }
  }

  return (
    <DataTableV2
      totalCount={salaryLoans?.data.pagination.total_items ?? 0}
      perPage={salaryLoans?.data.pagination.per_page ?? 10}
      pageNumber={salaryLoans?.data.pagination.current_page ?? 1}
      onPaginationChange={onPaginationChange}
      onRowCountChange={onRowCountChange}
      title="Salary Loan Release Summary Report"
      subtitle=""
      data={salaryLoans?.data.loans ?? []}
      columns={columns}
      filters={filterDefinitions}
      onLoading={isPending || isFetching}
      idField="id"
      search={search}
      enableNew={false}
      enablePdfExport={canExport}
      enableCsvExport={canExport}
      enableFilter={true}
      onResetTable={false}
      onPdfExport={handlePdfExport}
      onCsvExport={handleCsvExport}
      onSort={handleSort}
      showTotals={true}
      calculateTotals={calculateTotals}
      onFilterChange={handleFilterChange}
    />
  )
}
