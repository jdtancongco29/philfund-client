import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { apiRequest } from "@/lib/api"
import { ModuleSelectionDialog } from "./ModuleSelectionDialog"

interface AddReferenceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddReference: (reference: { code: string; name: string; modules: string[] }) => void
}

export function AddReferenceDialog({ open, onOpenChange, onAddReference }: AddReferenceDialogProps) {
  const [code, setCode] = useState("")
  const [name, setName] = useState("")
  const [selectedModule, setSelectedModule] = useState<{ id: string; name: string } | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [moduleDialogOpen, setModuleDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {}

    if (!code.trim()) newErrors.code = "Reference code is required."
    if (!name.trim()) newErrors.name = "Reference name is required."
    if (!selectedModule) newErrors.module = "Module selection is required."

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true)
      try {
        await apiRequest("post", "/reference", {
          code: code.trim(),
          name: name.trim(),
          module_id: selectedModule!.id,
        }, {
          useAuth: true,
          useBranchId: true,
        })

        onAddReference({
          code: code.trim(),
          name: name.trim(),
          modules: [selectedModule!.name],
        })

     
        setCode("")
        setName("")
        setSelectedModule(null)
        setErrors({})
        onOpenChange(false)
      } catch (error: any) {
        console.error("Error adding reference:", error)

        if (error.response?.data?.errors) {
          const responseErrors = error.response.data.errors
          const updatedErrors: Record<string, string> = {}
          if (responseErrors.code?.[0]) {
            updatedErrors.code = responseErrors.code[0]
          }
          if (responseErrors.name?.[0]) {
            updatedErrors.name = responseErrors.name[0]
          }
          if (responseErrors.module?.[0]) {
            updatedErrors.module = responseErrors.module[0]
          }
          setErrors(updatedErrors)
        }
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Add New Reference</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="reference-code" className={cn(errors.code && "text-red-500")}>
                Reference Code <span className="text-red-500">*</span>
              </Label>
              <Input
                id="reference-code"
                placeholder="Enter reference code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className={cn(errors.code && "border-red-500")}
                maxLength={2}
              />
              {errors.code && (
                <p className="text-sm text-red-600">{errors.code}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="reference-name" className={cn(errors.name && "text-red-500")}>
                Reference Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="reference-name"
                placeholder="Enter reference name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={cn(errors.name && "border-red-500")}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className={cn(errors.module && "text-red-500")}>
                Module Used <span className="text-red-500">*</span>
              </Label>
              <Button
                variant="outline"
                className={`w-full text-left ${cn(errors.module && "border-red-500")}`}
                onClick={() => setModuleDialogOpen(true)}
              >
                {selectedModule?.name || "Select a module"}
              </Button>
              {errors.module && (
                <p className="text-sm text-red-600">{errors.module}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-blue-500 hover:bg-blue-600"
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "Add Reference"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ModuleSelectionDialog
        open={moduleDialogOpen}
        onClose={() => setModuleDialogOpen(false)}
        onSelect={(mod) => setSelectedModule(mod)}
      />
    </>
  )
}
