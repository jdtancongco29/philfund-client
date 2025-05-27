"use client"

import { useState } from "react"
import type { SearchDefinition, ColumnDefinition, FilterDefinition } from "@/components/data-table/data-table"
import type { DepartmentSetup } from "./Service/DepartmentSetupTypes"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import DepartmentSetupService from "./Service/DepartmentSetupService"
import { DataTableV2 } from "@/components/data-table/data-table-v2"
import { DepartmentDialog } from "./DepartmentDialog"
import { PencilIcon, TrashIcon } from "lucide-react"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"
import { toast } from "sonner"

export function DepartmentSetupTable() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<DepartmentSetup | null>(null)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState<string | null>(null)
  const [resetTable, setResetTable] = useState(false)

  const queryClient = useQueryClient()

  const {
    isPending,
    error,
    data: departments,
  } = useQuery({
    queryKey: ["department-setup-table", currentPage, rowsPerPage, searchQuery],
    queryFn: () => DepartmentSetupService.getAllDepartments(currentPage, rowsPerPage, searchQuery),
    staleTime: Number.POSITIVE_INFINITY,
  })

  const deletionHandler = useMutation({
    mutationFn: (uuid: string) => {
      return DepartmentSetupService.deleteDepartment(uuid)
    },
    onSuccess: () => {
      toast.success("Department deleted successfully")
      queryClient.invalidateQueries({ queryKey: ["department-setup-table"] })
      setOpenDeleteModal(false)
      setSelectedItem(null)
      if (departments?.data.departments.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1)
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete department")
    },
  })

  // Export mutations
  const exportPdfMutation = useMutation({
    mutationFn: DepartmentSetupService.exportPdf,
    onSuccess: (response) => {
      try {
        // Ensure we have a proper Blob
        let blob: Blob

        if (response instanceof Blob) {
          blob = response
        } else {
          // If response is not a Blob, create one
          blob = new Blob([response], { type: "application/pdf" })
        }

        const url = window.URL.createObjectURL(blob)

        // Open PDF in new tab for preview
        const newTab = window.open(url, "_blank")
        if (newTab) {
          newTab.focus()
          // Clean up the URL after a delay to allow the tab to load
          setTimeout(() => {
            window.URL.revokeObjectURL(url)
          }, 1000)
        } else {
          // Fallback if popup is blocked
          const link = document.createElement("a")
          link.href = url
          link.download = `departments-${new Date().toISOString().split("T")[0]}.pdf`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          window.URL.revokeObjectURL(url)
        }
        toast.success("PDF opened in new tab")
      } catch (error) {
        console.error("Error creating PDF URL:", error)
        toast.error("Failed to open PDF. Please try again.")
      }
    },
    onError: (error: any) => {
      console.error("PDF export error:", error)
      toast.error(error.message || "Failed to export PDF")
    },
  })

  const exportCsvMutation = useMutation({
    mutationFn: DepartmentSetupService.exportCsv,
    onSuccess: (csvData) => {
      // Handle the CSV data directly from API
      let csvContent: string

      if (typeof csvData === "string") {
        // If API returns CSV string directly
        csvContent = csvData
      } else if (csvData instanceof Blob) {
        // If API returns a Blob, we need to read it
        const reader = new FileReader()
        reader.onload = (e) => {
          const csvContent = e.target?.result as string
          downloadCsv(csvContent)
        }
        reader.readAsText(csvData)
        return
      } else {
        // Fallback: format the data manually
        csvContent = formatDepartmentsToCsv(csvData)
      }

      downloadCsv(csvContent)
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to export CSV")
    },
  })

  // Helper function to download CSV
  const downloadCsv = (csvContent: string) => {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `departments-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    toast.success("CSV generated successfully")
  }

  // Helper function to format departments data to CSV (fallback)
  const formatDepartmentsToCsv = (data: any) => {
    const headers = ["Code", "Name"]
    const csvRows = [headers.join(",")]

    // Get departments from current table data if API data is not available
    const departmentsData = data?.departments || data?.data?.departments || departments?.data?.departments || []

    departmentsData.forEach((department: DepartmentSetup) => {
      const row = [
        department.code || "",
        department.name?.includes(",") ? `"${department.name}"` : department.name || "",
      ]
      csvRows.push(row.join(","))
    })

    return csvRows.join("\n")
  }

  if (error) return "An error has occurred: " + error.message

  // Define columns
  const columns: ColumnDefinition<DepartmentSetup>[] = [
    {
      id: "code",
      header: "Department Code",
      accessorKey: "code",
      enableSorting: true,
    },
    {
      id: "name",
      header: "Department Name",
      accessorKey: "name",
      enableSorting: true,
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

  // Define filters - no filters as requested
  const filters: FilterDefinition[] = []

  const search: SearchDefinition = {
    title: "Search",
    placeholder: "Search departments",
    enableSearch: true,
  }

  // Handle edit
  const handleEdit = (item: DepartmentSetup) => {
    setSelectedItem(item)
    setIsEditing(true)
    setIsDialogOpen(true)
  }

  // Handle delete
  const handleDelete = async () => {
    if (selectedItem) {
      deletionHandler.mutate(selectedItem.id)
      setResetTable(true)
    }
  }

  // Handle new
  const handleNew = () => {
    setSelectedItem(null)
    setIsEditing(false)
    setIsDialogOpen(true)
  }

  // Handle exports
  const handlePdfExport = () => {
    exportPdfMutation.mutate()
  }

  const handleCsvExport = () => {
    exportCsvMutation.mutate()
  }

  const onPaginationChange = (page: number) => {
    setCurrentPage(page)
  }

  const onRowCountChange = (row: number) => {
    setRowsPerPage(row)
    setCurrentPage(1) // Reset to first page when changing row count
  }

  const onSearchChange = (search: string) => {
    setSearchQuery(search || null)
    setCurrentPage(1) // Reset to first page when searching
  }

  // Define action buttons
  const actionButtons = [
    {
      label: "Edit",
      icon: <PencilIcon className="h-4 w-4" />,
      onClick: handleEdit,
    },
    {
      label: "Delete",
      icon: <TrashIcon className="h-4 w-4 text-destructive" />,
      onClick: (department: DepartmentSetup) => {
        setSelectedItem(department)
        setOpenDeleteModal(true)
      },
    },
  ]

  return (
    <>
      <DataTableV2
        totalCount={departments?.data.pagination.total_items ?? 0}
        perPage={departments?.data.pagination.per_page ?? 10}
        pageNumber={departments?.data.pagination.current_page ?? 1}
        onPaginationChange={onPaginationChange}
        onRowCountChange={onRowCountChange}
        title="Department Setup"
        subtitle="Manage system departments"
        data={departments?.data.departments ?? []}
        columns={columns}
        filters={filters}
        search={search}
        actionButtons={actionButtons}
        onLoading={isPending || deletionHandler.isPending}
        onNew={handleNew}
        idField="id"
        enableNew={true}
        enablePdfExport={true}
        enableCsvExport={true}
        enableFilter={false}
        onResetTable={resetTable}
        onSearchChange={onSearchChange}
        onPdfExport={handlePdfExport}
        onCsvExport={handleCsvExport}
      />

      <DeleteConfirmationDialog
        isOpen={openDeleteModal}
        onClose={() => {
          setSelectedItem(null)
          setOpenDeleteModal(false)
        }}
        onConfirm={handleDelete}
        title="Delete Department"
        description={`Are you sure you want to delete the department '${selectedItem?.name}'? This action cannot be undone.`}
        itemName={selectedItem?.name ?? "No Department Selected"}
      />

      <DepartmentDialog
        item={selectedItem}
        open={isDialogOpen}
        isEditing={isEditing}
        onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) {
            setSelectedItem(null)
            setIsEditing(false)
          }
        }}
        onSuccess={() => {
          setSelectedItem(null)
          setIsDialogOpen(false)
          setIsEditing(false)
        }}
      />
    </>
  )
}