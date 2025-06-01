"use client"

import Cookies from "js-cookie"
import { Building2, ChevronDown, Building } from "lucide-react"
import { useState, useEffect } from "react"
import { useQuery, useMutation } from "@tanstack/react-query"
import BranchSetupService from "../pages/MaintenanceAndSecurity/GeneralSetup/BranchSetup/Service/BranchSetupService"
import { BranchConfirmationDialog } from "../components/layout/BranchConfirmationDialog"
import type { Branch } from "../pages/MaintenanceAndSecurity/GeneralSetup/BranchSetup/Service/BranchSetupTypes"

export default function BranchProfileDropdown() {
  const [open, setOpen] = useState(false)
  const [selectedBranchForSwitch, setSelectedBranchForSwitch] = useState<Branch | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)

  // Get current branch from cookies
  const currentBranchIdRaw = Cookies.get("current_branch")

  const currentBranchId = currentBranchIdRaw ? currentBranchIdRaw.replace(/^"|"$/g, '') : undefined;
  // Fetch branches from API
  const {
    data: branchesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user-branches"],
    queryFn: BranchSetupService.getUserBranches,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })

  // Switch branch mutation
  const switchBranchMutation = useMutation({
    mutationFn: (branchId: string) => {
      // Set the new branch in cookies
      Cookies.set("current_branch", branchId, { expires: 30 }) // 30 days
      return Promise.resolve()
    },
    onSuccess: () => {
      // Refresh the page to apply the new branch context
      window.location.reload()
    },
  })

  const branches = branchesData?.data?.branches || []
  const currentBranch = branches.find((branch) => branch.id === currentBranchId)

  // Filter out the current branch from the available options
  const availableBranches = branches.filter((branch) => branch.id !== currentBranchId)

  const handleBranchSelect = (branch: Branch) => {
    setSelectedBranchForSwitch(branch)
    setShowConfirmation(true)
    setOpen(false)
  }

  const handleConfirmBranchSwitch = () => {
    if (selectedBranchForSwitch) {
      switchBranchMutation.mutate(selectedBranchForSwitch.id)
    }
    setShowConfirmation(false)
    setSelectedBranchForSwitch(null)
  }

  const handleCancelBranchSwitch = () => {
    setShowConfirmation(false)
    setSelectedBranchForSwitch(null)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest(".branch-dropdown")) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener("click", handleClickOutside)
      return () => document.removeEventListener("click", handleClickOutside)
    }
  }, [open])

  if (error) {
    console.error("Failed to fetch branches:", error)
  }

  // Get display text for the current branch
  const getDisplayText = () => {
    if (isLoading) return "Loading..."
    if (!currentBranchId || !currentBranch) return "No Branch Selected"
    return currentBranch.name
  }

  return (
    <>
      <div className="relative w-[200px] branch-dropdown">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center justify-between w-full px-3 py-2 border rounded-md shadow-sm bg-white hover:bg-gray-50 cursor-pointer"
          disabled={isLoading}
        >
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium truncate">{getDisplayText()}</span>
          </div>
          <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>

        {open && (
          <div className="absolute z-50 right-0 mt-1 w-full bg-white border rounded-md shadow-lg overflow-hidden max-h-80 overflow-y-auto">
            {/* Current Branch Display */}
            {currentBranch && (
              <div className="border-b border-gray-100">
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Current Branch
                </div>
                <div className="px-4 py-2 text-sm bg-blue-50 text-blue-700 font-medium flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  <span className="truncate">{currentBranch.name}</span>
                  <span className="ml-auto text-xs text-blue-600">Active</span>
                </div>
              </div>
            )}

            {/* Available Branches Section */}
            {availableBranches.length > 0 && (
              <div className="py-1">
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Switch To</div>
                {availableBranches.map((branch) => (
                  <button
                    key={branch.id}
                    onClick={() => handleBranchSelect(branch)}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                  >
                    <Building2 className="w-4 h-4" />
                    <span className="truncate">{branch.name}</span>
                  </button>
                ))}
              </div>
            )}

            {/* No other branches available */}
            {availableBranches.length === 0 && currentBranch && (
              <div className="py-1">
                <div className="px-4 py-2 text-sm text-gray-500">No other branches available</div>
              </div>
            )}

            {/* Loading state */}
            {isLoading && (
              <div className="py-1">
                <div className="px-4 py-2 text-sm text-gray-500">Loading branches...</div>
              </div>
            )}

            {/* No branches at all */}
            {!isLoading && branches.length === 0 && (
              <div className="py-1">
                <div className="px-4 py-2 text-sm text-gray-500">No branches available</div>
              </div>
            )}
          </div>
        )}
      </div>

      <BranchConfirmationDialog
        isOpen={showConfirmation}
        onClose={handleCancelBranchSwitch}
        onConfirm={handleConfirmBranchSwitch}
        branchName={selectedBranchForSwitch?.name || ""}
        isLoading={switchBranchMutation.isPending}
      />
    </>
  )
}