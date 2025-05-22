import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { apiRequest } from "@/lib/api"

interface Module {
  id: string
  name: string
}

interface ModuleSelectionDialogProps {
  open: boolean
  onClose: () => void
  onSelect: (module: Module) => void
}

export function ModuleSelectionDialog({ open, onClose, onSelect }: ModuleSelectionDialogProps) {
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")

  useEffect(() => {
    if (open) {
      fetchModules()
    }
  }, [open])

  const fetchModules = async () => {
    setLoading(true)
    try {
      const response = await apiRequest<{ data: { module: Module[] } }>("get", "/module", null, {
        useAuth: true,
        useBranchId: true,

      })
      setModules(response.data.data.module)
    } catch (error) {
      console.error("Error fetching modules:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredModules = modules.filter((mod) =>
    mod.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Select Module</DialogTitle>
        </DialogHeader>

        <Input
          placeholder="Search module..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-3"
        />

        <div className="h-[300px] overflow-auto space-y-2">
          {loading ? (
            <p>Loading modules...</p>
          ) : filteredModules.length === 0 ? (
            <p>No modules found.</p>
          ) : (
            filteredModules.map((mod) => (
              <div
                key={mod.id}
                className="p-3 border rounded hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  onSelect(mod)
                  onClose()
                }}
              >
                {mod.name}
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
