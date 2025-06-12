"use client"

import { useCallback, useState } from "react"
import type { ColumnDefinition } from "@/components/data-table/data-table"
import type { CardsMonitoringItem, CardsMonitoringFilters } from "./Service/CardsMonitoringTypes"
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query"
import CardsMonitoringService from "./Service/CardsMonitoringService"
import { DataTableV2 } from "@/components/data-table/data-table-v2"
import { FileText } from "lucide-react"
import { toast } from "sonner"
import { downloadFile } from "@/lib/utils"
import type { ModulePermissionProps } from "@/pages/MaintenanceAndSecurity/Security/UserPermissions/Service/PermissionsTypes"

export function CardsMonitoringTable({ 
    // canAdd, 
    // canEdit, 
    // canDelete, 
    canExport 
}: ModulePermissionProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState<string | null>(null)
  const [columnSort, setColumnSort] = useState<string | null>(null)
  const [sortQuery, setSortQuery] = useState<string | null>(null)
  const [filters, _setFilters] = useState<CardsMonitoringFilters>({
    search: null,
    branch: null,
    districtName: null,
    division: null,
    cardType: null,
    cardStatus: null,
  })

//   const queryClient = useQueryClient()

  const onPaginationChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  const onRowCountChange = useCallback((row: number) => {
    setRowsPerPage(row)
    setCurrentPage(1)
  }, [])

  const onSearchChange = useCallback((search: string) => {
    setSearchQuery(search || null)
    setCurrentPage(1)
  }, [])

  const {
    isPending,
    error,
    isFetching,
    data: cards,
  } = useQuery({
    queryKey: ["cards-monitoring-table", currentPage, rowsPerPage, searchQuery, columnSort, sortQuery, filters],
    queryFn: () =>
      CardsMonitoringService.getAllCards(currentPage, rowsPerPage, searchQuery, columnSort, sortQuery, filters),
    staleTime: Number.POSITIVE_INFINITY,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  })

  // Export mutations
  const exportPdfMutation = useMutation({
    mutationFn: CardsMonitoringService.exportPdf,
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
    mutationFn: CardsMonitoringService.exportCsv,
    onSuccess: (csvData: Blob) => {
      try {
        const currentDate = new Date().toISOString().split("T")[0]
        downloadFile(csvData, `cards-monitoring-${currentDate}.csv`)
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
  const columns: ColumnDefinition<CardsMonitoringItem>[] = [
    {
      id: "borrowerName",
      header: "Borrower's Name",
      accessorKey: "borrowerName",
      enableSorting: true,
    },
    {
      id: "cardType",
      header: "Card Type",
      accessorKey: "cardType",
      enableSorting: true,
    },
    {
      id: "cardStatus",
      header: "Card Status",
      accessorKey: "cardStatus",
      enableSorting: true,
    },
    {
      id: "dateSignedOut",
      header: "Date Signed Out",
      accessorKey: "dateSignedOut",
      enableSorting: true,
    },
    {
      id: "signedOutBy",
      header: "Signed Out By",
      accessorKey: "signedOutBy",
      enableSorting: true,
    },
    {
      id: "reasonForRelease",
      header: "Reason for Release",
      accessorKey: "reasonForRelease",
      enableSorting: true,
    },
    {
      id: "custodian",
      header: "Custodian",
      accessorKey: "custodian",
      enableSorting: true,
    },
  ]

  // Handle exports
  const handlePdfExport = () => {
    exportPdfMutation.mutate()
  }

  const handleCsvExport = () => {
    exportCsvMutation.mutate()
  }

  // Define action buttons
  const actionButtons = [
    {
      label: "Print Report",
      icon: <FileText className="h-4 w-4" />,
      onClick: (item: CardsMonitoringItem) => {
        toast.info(`Printing report for ${item.borrowerName}...`)
        // Implement print functionality
      },
    },
  ]

  const handleSort = (column: string, sort: string) => {
    setColumnSort(column)
    setSortQuery(sort)
  }

  return (
    <DataTableV2
      totalCount={cards?.data.pagination.total_items ?? 0}
      perPage={cards?.data.pagination.per_page ?? 10}
      pageNumber={cards?.data.pagination.current_page ?? 1}
      onPaginationChange={onPaginationChange}
      onRowCountChange={onRowCountChange}
      title="Cards Monitoring"
      subtitle=""
      data={cards?.data.cards ?? []}
      columns={columns}
      filters={[
        {
          id: "branch",
          label: "Branch",
          type: "select",
          options: [
            { label: "Cebu Main Branch", value: "Cebu Main Branch" },
            { label: "Mandaue Branch", value: "Mandaue Branch" },
            { label: "Talisay Branch", value: "Talisay Branch" },
            { label: "Lapu-Lapu Branch", value: "Lapu-Lapu Branch" },
          ],
          placeholder: "Select...",
        },
        {
          id: "districtName",
          label: "District Name",
          type: "select",
          options: [
            { label: "District 1", value: "District 1" },
            { label: "District 2", value: "District 2" },
            { label: "District 3", value: "District 3" },
          ],
          placeholder: "Select...",
        },
        {
          id: "division",
          label: "Division",
          type: "select",
          options: [
            { label: "Division A", value: "Division A" },
            { label: "Division B", value: "Division B" },
            { label: "Division C", value: "Division C" },
          ],
          placeholder: "Select...",
        },
        {
          id: "cardType",
          label: "Card Type",
          type: "select",
          options: [
            { label: "ATM", value: "ATM" },
            { label: "UMID", value: "UMID" },
          ],
          placeholder: "Select...",
        },
        {
          id: "cardStatus",
          label: "Card Status",
          type: "select",
          options: [
            { label: "Sign out", value: "Sign out" },
            { label: "Available", value: "Available" },
            { label: "Lost", value: "Lost" },
            { label: "Damaged", value: "Damaged" },
          ],
          placeholder: "Select...",
        },
      ]}
      actionButtons={actionButtons}
      onLoading={isPending || isFetching || exportPdfMutation.isPending || exportCsvMutation.isPending}
      idField="id"
      enableNew={false}
      enablePdfExport={canExport}
      enableCsvExport={canExport}
      enableFilter={true}
      onResetTable={false}
      onSearchChange={onSearchChange}
      onPdfExport={handlePdfExport}
      onCsvExport={handleCsvExport}
      onSort={handleSort}
    />
  )
}
