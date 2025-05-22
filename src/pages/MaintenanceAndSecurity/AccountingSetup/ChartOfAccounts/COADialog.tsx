import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { apiRequest } from "@/lib/api"

interface ChartOfAccount {
  id: string
  code: string
  name: string
  description: string
  major_classification: string
  category: string
  is_header: boolean
  parent_id: string | null
  is_contra: boolean
  normal_balance: string
  special_classification: string
  status: boolean
}

interface COADialogProps {
  open: boolean
  onClose: () => void
  onSelect: (coa: ChartOfAccount) => void
}

export function COADialog({ open, onClose, onSelect }: COADialogProps) {
  const [chartOfAccounts, setChartOfAccounts] = useState<ChartOfAccount[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")

  useEffect(() => {
    if (open) {
      fetchChartOfAccounts()
    }
  }, [open])

  const fetchChartOfAccounts = async () => {
    setLoading(true)
    try {
      const response = await apiRequest<{ data: { chartOfAccounts: ChartOfAccount[] } }>(
        "get",
        "/coa",
        null,
        {
          useAuth: true,
          useBranchId: true,
        }
      )
      setChartOfAccounts(response.data.data.chartOfAccounts)
    } catch (error) {
      console.error("Error fetching chart of accounts:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredAccounts = chartOfAccounts.filter((account) =>
    account.name.toLowerCase().includes(search.toLowerCase()) ||
    account.code.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Select Chart of Account</DialogTitle>
        </DialogHeader>

        <Input
          placeholder="Search by name or code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-3"
        />

        <div className="h-[300px] overflow-auto space-y-2">
          {loading ? (
            <p>Loading chart of accounts...</p>
          ) : filteredAccounts.length === 0 ? (
            <p>No matching accounts found.</p>
          ) : (
            filteredAccounts.map((coa) => (
              <div
                key={coa.id}
                className="p-3 border rounded hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  onSelect(coa)
                  onClose()
                }}
              >
                <div className="font-semibold">{coa.code} - {coa.name}</div>
                <div className="text-sm text-muted-foreground">{coa.category} | {coa.normal_balance}</div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
