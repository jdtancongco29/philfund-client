"use client"

import { useState, useMemo } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import { CheckIcon, XIcon, ThumbsUpIcon, ThumbsDownIcon } from "lucide-react"
import { DataTableV2 } from "@/components/data-table/data-table-v2"
import { ApprovalDialog } from "./ApprovalDialog"
import type {
  ColumnDefinition,
  FilterDefinition,
  SearchDefinition,
  BulkActionButton,
} from "@/components/data-table/data-table-v2"
import type { ApprovalRequest, ApprovalRequestFilters } from "./Service/ApprovalType"
import ForApprovalService from "./Service/ApprovalService"
import { toast } from "sonner"

export function ApprovalTable() {
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedBranch, setSelectedBranch] = useState<string>("")
  const [selectedTransactionType, setSelectedTransactionType] = useState<string>("")
  const [selectedItems, setSelectedItems] = useState<ApprovalRequest[]>([])
  const [openDenyModal, setOpenDenyModal] = useState(false)
  const [itemToDeny, setItemToDeny] = useState<ApprovalRequest | null>(null)
  const [resetTable, setResetTable] = useState(false)

  const queryClient = useQueryClient()

  // Build filters object
  const filters: ApprovalRequestFilters = useMemo(
    () => ({
      search: searchQuery || undefined,
      branch_id: selectedBranch || undefined,
      transaction_type: selectedTransactionType || undefined,
      page: currentPage,
      per_page: rowsPerPage,
    }),
    [searchQuery, selectedBranch, selectedTransactionType, currentPage, rowsPerPage],
  )

  // Fetch approval requests
  const {
    data: approvalRequestsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["approval-requests", filters],
    queryFn: () => ForApprovalService.getApprovalRequests(filters),
    staleTime: 30 * 1000, // 30 seconds
  })

  // Fetch branches for filter
  const { data: branchesData } = useQuery({
    queryKey: ["branches-for-filter"],
    queryFn: () => ForApprovalService.getBranches(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Fetch transaction types for filter
  const { data: transactionTypesData } = useQuery({
    queryKey: ["transaction-types-for-filter"],
    queryFn: () => ForApprovalService.getTransactionTypes(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Approve single item mutation
  const approveMutation = useMutation({
    mutationFn: (id: string) => ForApprovalService.approveRequest({ approval_request_id: id }),
    onSuccess: () => {
      toast.success("Request approved successfully")
      queryClient.invalidateQueries({ queryKey: ["approval-requests"] })
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to approve request")
    },
  })

  // Deny single item mutation
  const denyMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      ForApprovalService.denyRequest({ approval_request_id: id, reason }),
    onSuccess: () => {
      toast.success("Request denied successfully")
      queryClient.invalidateQueries({ queryKey: ["approval-requests"] })
      setOpenDenyModal(false)
      setItemToDeny(null)
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to deny request")
    },
  })

  // Bulk approve mutation
  const bulkApproveMutation = useMutation({
    mutationFn: (ids: string[]) => ForApprovalService.bulkApproveRequests({ approval_request_ids: ids }),
    onSuccess: () => {
      toast.success(`${selectedItems.length} requests approved successfully`)
      queryClient.invalidateQueries({ queryKey: ["approval-requests"] })
      setSelectedItems([])
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to approve requests")
    },
  })

  // Bulk deny mutation
  const bulkDenyMutation = useMutation({
    mutationFn: ({ ids, reason }: { ids: string[]; reason: string }) =>
      ForApprovalService.bulkDenyRequests({ approval_request_ids: ids, reason }),
    onSuccess: () => {
      toast.success(`${selectedItems.length} requests denied successfully`)
      queryClient.invalidateQueries({ queryKey: ["approval-requests"] })
      setSelectedItems([])
      setOpenDenyModal(false)
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to deny requests")
    },
  })

  // Export mutations
  const exportPdfMutation = useMutation({
    mutationFn: () => ForApprovalService.exportToPdf(filters),
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `approval-requests-${format(new Date(), "yyyy-MM-dd")}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success("PDF exported successfully")
    },
    onError: () => {
      toast.error("Failed to export PDF")
    },
  })

  const exportCsvMutation = useMutation({
    mutationFn: () => ForApprovalService.exportToCsv(filters),
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `approval-requests-${format(new Date(), "yyyy-MM-dd")}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success("CSV exported successfully")
    },
    onError: () => {
      toast.error("Failed to export CSV")
    },
  })

  if (error) return "An error has occurred: " + error.message

  // Handle approve
  const handleApprove = (item: ApprovalRequest) => {
    approveMutation.mutate(item.id)
  }

  // Handle deny
  const handleDeny = (item: ApprovalRequest) => {
    setItemToDeny(item)
    setOpenDenyModal(true)
  }

  const confirmDeny = (reason: string) => {
    if (itemToDeny) {
      denyMutation.mutate({ id: itemToDeny.id, reason })
    }
  }

  // Handle bulk approve
  const handleBulkApprove = (items: ApprovalRequest[]) => {
    if (items.length > 0) {
      const ids = items.map((item) => item.id)
      bulkApproveMutation.mutate(ids)
    }
  }

  // Handle bulk deny
  const handleBulkDeny = (items: ApprovalRequest[]) => {
    if (items.length > 0) {
      setOpenDenyModal(true)
    }
  }

  const confirmBulkDeny = (reason: string) => {
    if (selectedItems.length > 0) {
      const ids = selectedItems.map((item) => item.id)
      bulkDenyMutation.mutate({ ids, reason })
      setResetTable(true)
    }
  }

  // Handle reset filters
  const handleReset = () => {
    setSearchQuery("")
    setSelectedBranch("")
    setSelectedTransactionType("")
    setSelectedItems([])
    setCurrentPage(1)
  }

  // Handle pagination
  const onPaginationChange = (page: number) => {
    setCurrentPage(page)
  }

  const onRowCountChange = (rows: number) => {
    setRowsPerPage(rows)
    setCurrentPage(1)
  }

  const onSearchChange = (search: string) => {
    setSearchQuery(search)
    setCurrentPage(1)
  }

  // Define columns
  const columns: ColumnDefinition<ApprovalRequest>[] = [
    {
      id: "branch",
      header: "Branch",
      accessorKey: "branch_name",
      enableSorting: true,
    },
    {
      id: "date_time",
      header: "Date & Time",
      accessorKey: "date_time",
      enableSorting: true,
      cell: (row) => format(new Date(row.date_time), "MMM dd, yyyy, HH:mm a"),
    },
    {
      id: "loan_type",
      header: "Loan Type",
      accessorKey: "loan_type",
      enableSorting: true,
    },
    {
      id: "pn_no",
      header: "PN No.",
      accessorKey: "pn_no",
      enableSorting: true,
    },
    {
      id: "reference",
      header: "Reference",
      accessorKey: "reference",
      enableSorting: true,
      cell: (row) => (
        <div>
          <div className="font-medium">{row.reference}</div>
          <div className="text-sm text-muted-foreground">{row.reference_number}</div>
        </div>
      ),
    },
    {
      id: "requested_by",
      header: "Requested By",
      accessorKey: "requested_by",
      enableSorting: true,
    },
    {
      id: "description",
      header: "Description",
      accessorKey: "description",
      enableSorting: true,
      cell: (row) => (
        <div className="max-w-xs truncate" title={row.description}>
          {row.description}
        </div>
      ),
    },
    {
      id: "type",
      header: "Type",
      accessorKey: "type",
      enableSorting: true,
      cell: (row) => (
        <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700">
          {row.type}
        </span>
      ),
    },
  ]

  // Define filters for DataTableV2
  const tableFilters: FilterDefinition[] = [
    {
      id: "branch",
      label: "Branch",
      type: "select",
      placeholder: "Select...",
      options:
        branchesData?.data.branches.map((branch) => ({
          label: branch.name,
          value: branch.id,
        })) || [],
    },
    {
      id: "transaction_type",
      label: "Transaction Type",
      type: "select",
      placeholder: "Select...",
      options:
        transactionTypesData?.data.transaction_types.map((type) => ({
          label: type.name,
          value: type.name,
        })) || [],
    },
  ]

  const search: SearchDefinition = {
    title: "Search",
    placeholder: "Search branch, type...",
    enableSearch: true,
  }

  // Action buttons for individual rows
  const actionButtons = [
    {
      label: "Approve",
      icon: <CheckIcon className="h-4 w-4 text-green-600" />,
      onClick: handleApprove,
      variant: "ghost" as const,
    },
    {
      label: "Deny",
      icon: <XIcon className="h-4 w-4 text-red-600" />,
      onClick: handleDeny,
      variant: "ghost" as const,
    },
  ]

  // Bulk action buttons
  const bulkActionButtons: BulkActionButton<ApprovalRequest>[] = [
    {
      label: "Approve selected",
      icon: <ThumbsUpIcon className="h-4 w-4" />,
      onClick: handleBulkApprove,
      variant: "outline",
    },
    {
      label: "Deny selected",
      icon: <ThumbsDownIcon className="h-4 w-4" />,
      onClick: handleBulkDeny,
      variant: "outline",
    },
    {
      label: "Reset",
      icon: null,
      onClick: handleReset,
      variant: "outline",
    },
  ]

  return (
    <>
      <DataTableV2
        totalCount={approvalRequestsData?.data.pagination.total_items ?? 0}
        perPage={approvalRequestsData?.data.pagination.per_page ?? 10}
        pageNumber={approvalRequestsData?.data.pagination.current_page ?? 1}
        onPaginationChange={onPaginationChange}
        onRowCountChange={onRowCountChange}
        title="For Approval"
        subtitle="Review and approve or deny pending approval requests"
        data={approvalRequestsData?.data.approval_requests ?? []}
        columns={columns}
        filters={tableFilters}
        search={search}
        actionButtons={actionButtons}
        bulkActionButtons={bulkActionButtons}
        enableSelection={true}
        selectedItems={selectedItems}
        onSelectionChange={setSelectedItems}
        onLoading={
          isLoading ||
          approveMutation.isPending ||
          denyMutation.isPending ||
          bulkApproveMutation.isPending ||
          bulkDenyMutation.isPending
        }
        idField="id"
        enableNew={false}
        enablePdfExport={true}
        enableCsvExport={true}
        enableFilter={true}
        onPdfExport={() => exportPdfMutation.mutate()}
        onCsvExport={() => exportCsvMutation.mutate()}
        onResetTable={resetTable}
        onSearchChange={onSearchChange}
      />

      <ApprovalDialog
        item={itemToDeny || (selectedItems.length > 0 ? selectedItems[0] : null)}
        open={openDenyModal}
        onOpenChange={(open) => {
          setOpenDenyModal(open)
          if (!open) {
            setItemToDeny(null)
          }
        }}
        onConfirm={itemToDeny ? confirmDeny : confirmBulkDeny}
        isLoading={denyMutation.isPending || bulkDenyMutation.isPending}
      />
    </>
  )
}
