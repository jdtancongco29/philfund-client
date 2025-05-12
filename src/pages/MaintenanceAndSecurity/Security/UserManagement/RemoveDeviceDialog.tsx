"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface RemoveDeviceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RemoveDeviceDialog({ open, onOpenChange }: RemoveDeviceDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl">Remove Device?</AlertDialogTitle>
          <AlertDialogDescription className="text-base text-muted-foreground">
            This action will remove the selected device from the user's record. It won't affect current login sessions.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4">
          <p className="text-lg font-semibold">Are you sure you want to continue?</p>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className="bg-red-500 hover:bg-red-600">Yes, Remove Device</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}