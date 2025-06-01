"use client"
import { Database } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { useMutation } from "@tanstack/react-query"
import SystemBackupService from "./Service/SystemBackupService"
import { toast } from "sonner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"

interface CreateBackupDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function CreateBackupDrawer({ open, onOpenChange, onSuccess }: CreateBackupDrawerProps) {
  // Create backup mutation
  const createBackupMutation = useMutation({
    mutationFn: SystemBackupService.createBackup,
    onSuccess: () => {
      toast.success("Backup created successfully")
      onSuccess?.()
      onOpenChange(false)
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create backup")
    },
  })

  const handleCreateBackup = () => {
    createBackupMutation.mutate({})
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[612px] sm:max-w-[512px] p-4 overflow-y-auto">
        <SheetHeader className="p-0">
          <SheetTitle className="text-2xl font-bold">Create Database Backup</SheetTitle>
        </SheetHeader>

        <div className="space-y-6">
          <p className="text-gray-600">
            Create a complete backup of your database. This process may take a few minutes depending on the size of your
            database.
          </p>

          <Alert className="bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <div className="font-semibold mb-2">Important Information</div>
              <div className="space-y-2 text-sm">
                <p>
                  Backups include all database tables and data. They are stored securely and can be used to restore your
                  system in case of data loss or corruption.
                </p>
                <p>It is recommended to create regular backups, especially before major system updates or changes.</p>
              </div>
            </AlertDescription>
          </Alert>

          <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center space-y-4">
            <div className="flex justify-center">
              <Database className="h-16 w-16 text-gray-400" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Ready to Create Backup</h3>
              <p className="text-gray-600">
                Click the button below to create a complete backup of your database. The backup file will be named with
                the current date and time.
              </p>
            </div>

            <Button
              onClick={handleCreateBackup}
              disabled={createBackupMutation.isPending}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-2"
              size="lg"
            >
              {createBackupMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Backup...
                </>
              ) : (
                <>
                  <Database className="h-4 w-4 mr-2" />
                  Create Backup Now
                </>
              )}
            </Button>
          </div>

          <div className="text-sm text-gray-500">
            <strong>Note:</strong> The backup process will not affect your current database or system operation.
          </div>

          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={createBackupMutation.isPending}>
              Close
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
