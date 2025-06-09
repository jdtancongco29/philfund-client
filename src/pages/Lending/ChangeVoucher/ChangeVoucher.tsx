"use client"

import { useState, useMemo } from "react"
import { useQuery, useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { BorrowerSearchPanel, type Borrower } from "@/components/borrower-search/borroer-search-panel"
import { DataTableV2, type ColumnDefinition } from "@/components/data-table/data-table-v2"
import { PencilIcon, TrashIcon } from "lucide-react"
import ChangeVoucherService from "./Service/ChangeVoucherService"
import type { ChangeVoucherFilters, ChangeVoucherEntry } from "./Service/ChangeVoucherTypes"
import { ChangeVoucherDialog } from "./Dialog/ChangeVoucherDialog"

export function ChangeVoucher() {
  // State management
  const [selectedDivision, setSelectedDivision] = useState<string>("")
  const [selectedDistrict, setSelectedDistrict] = useState<string>("")
  const [borrowerSearch, setBorrowerSearch] = useState<string>("")
  const [selectedBorrower, setSelectedBorrower] = useState<Borrower | null>(null)
  const [selectedEntry, setSelectedEntry] = useState<ChangeVoucherEntry | null>(null)
  const [openChangeVoucherDialog, setOpenChangeVoucherDialog] = useState(false)
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({})

  // Build filters
  const filters: ChangeVoucherFilters = useMemo(
    () => ({
      division: selectedDivision || undefined,
      district: selectedDistrict || undefined,
      borrower_search: borrowerSearch || undefined,
      date_from: dateRange.from?.toISOString(),
      date_to: dateRange.to?.toISOString(),
    }),
    [selectedDivision, selectedDistrict, borrowerSearch, dateRange],
  )

  // Fetch data queries
  const { data: divisionsData } = useQuery({
    queryKey: ["divisions"],
    queryFn: () => ChangeVoucherService.getDivisions(),
    staleTime: 10 * 60 * 1000,
  })

  const { data: districtsData } = useQuery({
    queryKey: ["districts", selectedDivision],
    queryFn: () => ChangeVoucherService.getDistricts(selectedDivision),
    enabled: !!selectedDivision,
    staleTime: 10 * 60 * 1000,
  })

  const { data: borrowersData, isLoading: isLoadingBorrowers } = useQuery({
    queryKey: ["borrowers", filters],
    queryFn: () => ChangeVoucherService.getBorrowers(filters),
    staleTime: 5 * 60 * 1000,
  })

  // Fetch change voucher entries
  const { data: changeVoucherData, isLoading: isLoadingEntries } = useQuery({
    queryKey: ["change-voucher-entries", filters],
    queryFn: () => ChangeVoucherService.getChangeVoucherEntries(filters),
    staleTime: 0,
  })

  // Mutations
  const updateEntryMutation = useMutation({
    mutationFn: ChangeVoucherService.updateChangeVoucherEntry,
    onSuccess: () => {
      toast.success("Change voucher entry updated successfully")
      setOpenChangeVoucherDialog(false)
      setSelectedEntry(null)
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update change voucher entry")
    },
  })

  const deleteEntryMutation = useMutation({
    mutationFn: ChangeVoucherService.deleteChangeVoucherEntry,
    onSuccess: () => {
      toast.success("Change voucher entry deleted successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete change voucher entry")
    },
  })

  // Event handlers
  const handleBorrowerSelect = (borrower: Borrower) => {
    setSelectedBorrower(borrower)
  }

  const handleReset = () => {
    setSelectedBorrower(null)
    setSelectedDivision("")
    setSelectedDistrict("")
    setBorrowerSearch("")
    setDateRange({})
  }

  const handleEditEntry = (entry: ChangeVoucherEntry) => {
    setSelectedEntry(entry)
    setOpenChangeVoucherDialog(true)
  }

  const handleDeleteEntry = (entry: ChangeVoucherEntry) => {
    if (confirm("Are you sure you want to delete this entry?")) {
      deleteEntryMutation.mutate(entry.id)
    }
  }

  const handleNewEntry = () => {
    setSelectedEntry(null)
    setOpenChangeVoucherDialog(true)
  }

  // Table columns
  const columns: ColumnDefinition<ChangeVoucherEntry>[] = [
    {
      id: "date",
      header: "Date",
      accessorKey: "date",
      enableSorting: true,
    },
    {
      id: "change_voucher",
      header: "Change Voucher",
      accessorKey: "change_voucher",
      enableSorting: true,
    },
    {
      id: "payee",
      header: "Payee",
      accessorKey: "payee",
      enableSorting: true,
    },
    {
      id: "amount_paid",
      header: "Amount paid",
      accessorKey: "amount_paid",
      align: "right",
      cell: (item) => `₱${item.amount_paid.toLocaleString()}`,
    },
    {
      id: "change",
      header: "Change",
      accessorKey: "change",
      align: "right",
      cell: (item) => `₱${item.change.toLocaleString()}`,
    },
  ]

  return (
    <div className="flex gap-6 h-full overflow-hidden">
      {/* Left Sidebar - Borrower Search */}
      <BorrowerSearchPanel
        divisions={divisionsData?.data.divisions || []}
        districts={districtsData?.data.districts || []}
        borrowers={borrowersData?.data.borrowers || []}
        selectedDivision={selectedDivision}
        selectedDistrict={selectedDistrict}
        borrowerSearch={borrowerSearch}
        selectedBorrower={selectedBorrower}
        isLoadingBorrowers={isLoadingBorrowers}
        onDivisionChange={setSelectedDivision}
        onDistrictChange={setSelectedDistrict}
        onBorrowerSearchChange={setBorrowerSearch}
        onBorrowerSelect={handleBorrowerSelect}
        onReset={handleReset}
        onSearch={() => {}}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col border rounded-[8px] h-full overflow-hidden">
        <div className="flex-1 overflow-hidden p-6">
          <DataTableV2
            title="Change Voucher"
            data={changeVoucherData?.data.entries || []}
            columns={columns}
            onLoading={isLoadingEntries}
            totalCount={changeVoucherData?.data.count || 0}
            pageNumber={1}
            perPage={10}
            enableCsvExport={false}
            enablePdfExport={false}
            onNew={handleNewEntry}
            search={{
              title: "Search",
              placeholder: "Select...",
              enableSearch: true,
            }}
            filters={[
              {
                id: "date_range",
                label: "Date range picker",
                type: "dateRange",
                placeholder: "mm / dd / yyyy - mm / dd / yyyy",
              },
            ]}
            actionButtons={[
              {
                label: "Edit",
                icon: <PencilIcon className="h-4 w-4" />,
                onClick: handleEditEntry,
                variant: "ghost",
              },
              {
                label: "Delete",
                icon: <TrashIcon className="h-4 w-4" />,
                onClick: handleDeleteEntry,
                variant: "ghost",
              },
            ]}
          />
        </div>
      </div>

      {/* Change Voucher Dialog */}
      <ChangeVoucherDialog
        open={openChangeVoucherDialog}
        onOpenChange={setOpenChangeVoucherDialog}
        entry={selectedEntry}
        onSave={(entryData) => {
          if (selectedEntry) {
            updateEntryMutation.mutate({ ...entryData, id: selectedEntry.id })
          } else {
            // Create new entry
            toast.info("Creating new change voucher entry...")
          }
        }}
        isLoading={updateEntryMutation.isPending}
      />
    </div>
  )
}
