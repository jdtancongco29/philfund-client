"use client"

import type * as React from "react"
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
import { Loader2 } from "lucide-react"

interface DeleteConfirmationProps {
  /**
   * The message to display in the confirmation dialog
   */
  message: string
  /**
   * Optional title for the confirmation dialog
   * @default "Are you sure?"
   */
  title?: string
  /**
   * Callback function to execute when delete is confirmed
   */
  onConfirm: () => void
  /**
   * Optional callback function to execute when delete is cancelled
   */
  onCancel?: () => void
  /**
   * Optional text for the confirm button
   * @default "Delete"
   */
  confirmText?: string
  /**
   * Optional text for the cancel button
   * @default "Cancel"
   */
  cancelText?: string
  /**
   * Optional props to pass to the trigger button
   */
  triggerButtonProps?: unknown
  /**
   * Optional children to use as trigger instead of default button
   */
  children?: React.ReactNode
}

export function DeleteConfirmation({
  isLoading,
  message,
  title = "Are you sure?",
  onConfirm,
  onCancel,
  confirmText = "Delete",
  cancelText = "Cancel",
  triggerButtonProps,
  children,
}: DeleteConfirmationProps) {
  const handleConfirm = () => {
    onConfirm()
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    }
  }

  return (
    <AlertDialog>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isLoading}
            onClick={handleCancel}>{cancelText}</AlertDialogCancel>
          <AlertDialogAction
            disabled={isLoading}
            onClick={handleConfirm}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {confirmText} {isLoading && <span><Loader2 className="animate-spin" /></span>}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
