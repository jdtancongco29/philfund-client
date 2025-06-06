"use client"

import { useState, useCallback } from "react"
import type { SearchDefinition, ColumnDefinition, FilterDefinition } from "@/components/data-table/data-table"
import type { UserManagement } from "./Service/UserManagementTypes"
import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query"
import UserManagementService from "./Service/UserManagementService"
import { DataTableV2 } from "@/components/data-table/data-table-v2"
import { UserDialog } from "./UserDialog"
import { KeyRound, MonitorSmartphone, PencilIcon, TrashIcon } from "lucide-react"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"
import { toast } from "sonner"
import { downloadFile } from "@/lib/utils"
import { format, parseISO } from "date-fns"
import { ModulePermissionProps } from "../../Security/UserPermissions/Service/PermissionsTypes"

UserManagementTable
export function UserManagementTable({
  canAdd,
  canEdit,
  canDelete,
  canExport,
}: ModulePermissionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<UserManagement | null>(null)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState<string | null>(null)
  const [columnSort, setColumnSort] = useState<string | null>(null)
  const [sortQuery, setSortQuery] = useState<string | null>(null)
  const [focusPassword, setFocusPassword] = useState(false)
  const [activeTabOnOpen, setActiveTabOnOpen] = useState("basic-info")

  const queryClient = useQueryClient()

  const onPaginationChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  const onRowCountChange = useCallback((row: number) => {
    setRowsPerPage(row)
    setCurrentPage(1) // Reset to first page when changing row count
  }, [])

  const onSearchChange = useCallback((search: string) => {
    setSearchQuery(search || null)
    setCurrentPage(1) // Reset to first page when searching
  }, [])

  const {
    isPending,
    error,
    data: users,
    isFetching,
  } = useQuery({
    queryKey: ["user-management-table", currentPage, rowsPerPage, searchQuery, columnSort, sortQuery],
    queryFn: () => UserManagementService.getAllUsers(currentPage, rowsPerPage, searchQuery, columnSort, sortQuery),
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: keepPreviousData, // Use the newer placeholderData with keepPreviousData
    refetchOnWindowFocus: false,
  })

  const { mutate: fetchUserById } = useMutation({
    mutationFn: (userId: string) => UserManagementService.getUserById(userId),
    onSuccess: (res) => {
      const user = res?.data ?? []
      const formattedUser = {
        ...user,
        last_pass_date: user.last_pass_date ? format(parseISO(user?.last_pass_date), "MMMM d, yyyy 'at' h:mm a") : "",
      }
      setSelectedItem(formattedUser)
    },
    onError: (error) => {
      toast.error("Failed to fetch user details")
      console.error(error)
    },
  })

  const deletionHandler = useMutation({
    mutationFn: (uuid: string) => {
      return UserManagementService.deleteUser(uuid)
    },
    onSuccess: () => {
      toast.success("User deleted successfully")

      // Check if we need to go back a page after deletion
      const shouldGoToPreviousPage = users?.data.users.length === 1 && currentPage > 1

      if (shouldGoToPreviousPage) {
        // Update the page first, then invalidate queries
        setCurrentPage((prev) => prev - 1)
      }
      queryClient.invalidateQueries({
        queryKey: ["user-management-table"],
        exact: false,
      })
      setOpenDeleteModal(false)
      setSelectedItem(null)
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete user")
    },
  })

  // Export mutations
  const exportPdfMutation = useMutation({
    mutationFn: UserManagementService.exportPdf,
    onSuccess: (data) => {
      const newTab = window.open(data.url, "_blank")
      if (newTab) {
        newTab.focus()
        toast.success("PDF opened in new tab")
      }else{
        toast.error("Failed to open PDF. Please try again.")
      }
    },
    onError: (error: any) => {
      console.error("PDF export error:", error)
      toast.error(error.message || "Failed to export PDF")
    },
  })

  const exportCsvMutation = useMutation({
    mutationFn: UserManagementService.exportCsv,
    onSuccess: (csvData: Blob) => {
      try {
        const currentDate = new Date().toISOString().split("T")[0]
        downloadFile(csvData, `user-management-${currentDate}.csv`)
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
  const columns: ColumnDefinition<UserManagement>[] = [
    {
      id: "code",
      header: "User Id",
      accessorKey: "code",
      enableSorting: true,
    },
    {
      id: "username",
      header: "Username",
      accessorKey: "username",
      enableSorting: true,
    },
    {
      id: "full_name",
      header: "Full Name",
      accessorKey: "full_name",
      enableSorting: true,
    },
    {
      id: "position",
      header: "Position",
      accessorKey: "position",
      enableSorting: true,
    },
    {
      id: "branches",
      header: "Branch",
      accessorKey: "branches",
      enableSorting: false,
      cell: (row) => {
        const branchesRaw: { id: string; name: string }[] = row.branches ?? []

        if (branchesRaw.length === 0) return null

        const firstBranch = branchesRaw[0].name
        const remainingBranches = branchesRaw.slice(1)
        const remainingBranchCount = remainingBranches.length
        const remainingBranchNames = remainingBranches.map((b) => b.name).join(", ")

        return (
          <div className="flex items-center gap-2">
            <span className="border border-[#D0D5DD] rounded-full px-4 py-1 text-sm text-black">{firstBranch}</span>
            {remainingBranchCount > 0 && (
              <span
                className="border border-[#D0D5DD] rounded-full px-3 py-1 text-sm text-black cursor-help"
                title={remainingBranchNames}
              >
                +{remainingBranchCount}
              </span>
            )}
          </div>
        )
      },
    },
    {
      id: "permissions",
      header: "Permissions",
      accessorKey: "permissions",
      enableSorting: false,
      cell: (row) => {
        const permissions: string[] = row.permissions ?? []

        if (permissions.length === 0) return null

        const firstPermission = permissions[0]
        const remainingPermissions = permissions.slice(1)
        const remainingPermissionCount = remainingPermissions.length

        return (
          <div className="flex items-center gap-2">
            <span className="border border-[#D0D5DD] rounded-full px-4 py-1 text-sm text-black">{firstPermission}</span>
            {remainingPermissionCount > 0 && (
              <span
                className="border border-[#D0D5DD] rounded-full px-3 py-1 text-sm text-black cursor-help"
                title={remainingPermissions.join(", ")}
              >
                {remainingPermissionCount}+
              </span>
            )}
          </div>
        )
      },
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      enableSorting: true,
      cell: (row) => {
        const status: boolean = row.status ?? false
        return (
          <div className="flex items-center gap-2">
            <span
              className={`border rounded-full px-4 py-1 text-sm text-white ${status ? "bg-emerald-600" : "bg-red-600"}`}
            >
              {status ? "Active" : "Inactive"}
            </span>
          </div>
        )
      },
    },
  ]

  // Define filters
  const filters: FilterDefinition[] = []

  const search: SearchDefinition = {
    title: "Search",
    placeholder: "Search users",
    enableSearch: true,
  }

  // Handle edit
  const handleEdit = (item: UserManagement) => {
    setIsEditing(true)
    setActiveTabOnOpen("basic-info")
    fetchUserById(item.id)
    setIsDialogOpen(true)
  }

  // Handle delete
  const handleDelete = async () => {
    if (selectedItem) {
      deletionHandler.mutate(selectedItem.id)
    }
  }

  // Handle change password
  const handleChangePassword = (item: UserManagement) => {
    fetchUserById(item.id)
    setIsEditing(true)
    setActiveTabOnOpen("basic-info")
    setIsDialogOpen(true)
    // Set a flag to focus on password after dialog opens
    setTimeout(() => {
      setFocusPassword(true)
    }, 100)
  }

  // Handle devices
  const handleDevices = (item: UserManagement) => {
    setSelectedItem(item)
    setIsEditing(true)
    setActiveTabOnOpen("devices")
    setIsDialogOpen(true)
  }

  // Handle new
  const handleNew = () => {
    setSelectedItem(null)
    setIsEditing(false)
    setActiveTabOnOpen("basic-info")
    setIsDialogOpen(true)
  }

  // Use useCallback to prevent unnecessary re-renders

  // Define action buttons
  const actionButtons = [
    ...(canEdit
      ? [
          {
            label: "Edit",
            icon: <PencilIcon className="h-4 w-4" />,
            onClick: handleEdit,
          },
          {
            label: "Change Password",
            icon: <KeyRound className="h-4 w-4" />,
            onClick: handleChangePassword,
          },
        ]
      : []),
    ...(canDelete
      ? [
          {
            label: "Devices",
            icon: <MonitorSmartphone className="h-4 w-4" />,
            onClick: handleDevices,
          },
          {
            label: "Delete",
            icon: <TrashIcon className="h-4 w-4 text-destructive" />,
            onClick: (user: UserManagement) => {
              setSelectedItem(user);
              setOpenDeleteModal(true);
            },
          },
        ]
      : []),
  ];

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

  return (
    <>
      <DataTableV2
        totalCount={users?.data.pagination.total_items ?? 0}
        perPage={users?.data.pagination.per_page ?? 10}
        pageNumber={users?.data.pagination.current_page ?? 1}
        onPaginationChange={onPaginationChange}
        onRowCountChange={onRowCountChange}
        title="User Management"
        subtitle=""
        data={users?.data.users ?? []}
        columns={columns}
        filters={filters}
        search={search}
        actionButtons={actionButtons}
        onLoading={isPending || isFetching || deletionHandler.isPending}
        onNew={handleNew}
        idField="id"
        enableNew={canAdd}
        enablePdfExport={canExport}
        enableCsvExport={canExport}
        enableFilter={false}
        onResetTable={false}
        onSearchChange={onSearchChange}
        onPdfExport={handlePdfExport}
        onCsvExport={handleCsvExport}
        onSort={handleSort}
      />

      <DeleteConfirmationDialog
        isOpen={openDeleteModal}
        onClose={() => {
          setSelectedItem(null)
          setOpenDeleteModal(false)
        }}
        onConfirm={handleDelete}
        title="Delete User?"
        description={`Are you sure you want to delete the user '${selectedItem?.username}'? This action cannot be undone.`}
        itemName={selectedItem?.username ?? "No User Selected"}
        // isLoading={deletionHandler.isPending}
      />

      <UserDialog
        item={selectedItem}
        open={isDialogOpen}
        isEditing={isEditing}
        focusPassword={focusPassword}
        activeTabOnOpen={activeTabOnOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) {
            setSelectedItem(null)
            setIsEditing(false)
            setFocusPassword(false)
            setActiveTabOnOpen("basic-info")
          }
        }}
        onSuccess={() => {
          setSelectedItem(null)
          setIsDialogOpen(false)
          setIsEditing(false)
          setFocusPassword(false)
          setActiveTabOnOpen("basic-info")
          // Refresh the current page data
          queryClient.invalidateQueries({
            queryKey: ["user-management-table", currentPage, rowsPerPage, searchQuery],
            exact: true,
          })
        }}
      />
    </>
  )
}