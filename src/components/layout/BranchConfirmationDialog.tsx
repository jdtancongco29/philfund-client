"use client"

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Building2 } from "lucide-react"

interface BranchConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  branchName: string
  isLoading: boolean
}

export function BranchConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  branchName,
  isLoading,
}: BranchConfirmationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Switch Branch
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="text-gray-600">
            Are you sure you want to switch to <span className="font-semibold">"{branchName}"</span>?
          </p>
          <p className="text-sm text-gray-500 mt-2">
            This will refresh the page and update your current branch context. Any unsaved changes will be lost.
          </p>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={isLoading} className="bg-blue-500 hover:bg-blue-600">
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Switching...
              </>
            ) : (
              "Switch Branch"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
