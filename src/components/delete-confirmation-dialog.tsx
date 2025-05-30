"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"

interface DeleteConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  itemName: string
  cancel?: string
  confirm?: string
}

export function DeleteConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  itemName,
  cancel = "Cancel",
  confirm = "Delete"
}: DeleteConfirmationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">{title}</DialogTitle>
          <DialogDescription className="text-[16px] font-normal">
            {description.replace("{name}", itemName)}
          </DialogDescription>
        </DialogHeader>
        <div className="text-[16px] font-medium">
          Are you sure you want to continue?
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <button className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground">
              {cancel}
            </button>
          </DialogClose>
          <button
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className="inline-flex items-center justify-center rounded-md bg-[var(--destructive)] hover:bg-red-500 text-white px-4 py-2 text-sm font-medium"
          >
            {confirm}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
