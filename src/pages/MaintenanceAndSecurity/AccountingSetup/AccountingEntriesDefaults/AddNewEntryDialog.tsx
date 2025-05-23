import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { COADialog } from "./COADialog" // adjust import as needed

import { apiRequest } from "@/lib/api" // adjust if needed

interface Item {
  coa_id: string
  dept_id: string
  debit: string
  credit: string
}
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

interface AddNewEntryDialogProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (data: {
    name: string
    particulars: string
    transaction_amount: number
    ref_id: string
    items: Item[]
  }) => void
}

export default function AddNewEntryDialog({
  isOpen,
  onClose,
  onAdd,
}: AddNewEntryDialogProps) {
  const [name, setName] = useState("")
  const [particulars, setParticulars] = useState("")
  const [transactionAmount, setTransactionAmount] = useState("")
  const [refId, setRefId] = useState("")
  const [items, setItems] = useState<Item[]>([])

  const [isCOADialogOpen, setIsCOADialogOpen] = useState(false)
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null)

  const addItem = () => {
    setItems([...items, { coa_id: "", dept_id: "", debit: "", credit: "" }])
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, field: keyof Item, value: string) => {
    const newItems = [...items]
    newItems[index] = {
      ...newItems[index],
      [field]: value,
    }
    setItems(newItems)
  }

  const handleSelectCOA = (coa: ChartOfAccount) => {
    if (selectedItemIndex !== null) {
      const newItems = [...items]
      newItems[selectedItemIndex] = {
        ...newItems[selectedItemIndex],
        coa_id: coa.code,
      }
      setItems(newItems)
    }
  }

  const resetForm = () => {
    setName("")
    setParticulars("")
    setTransactionAmount("")
    setRefId("")
    setItems([])
  }

  const handleSubmit = () => {
    if (name && particulars && transactionAmount && refId && items.length) {
      onAdd({
        name,
        particulars,
        transaction_amount: parseFloat(transactionAmount),
        ref_id: refId,
        items: items.map((item) => ({
          ...item,
          debit: item.debit,
          credit: item.credit,
        })),
      })
      resetForm()
    }
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Add New Entry</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Enter entry name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="particulars">
                Particulars <span className="text-red-500">*</span>
              </Label>
              <Input
                id="particulars"
                placeholder="Enter particulars"
                value={particulars}
                onChange={(e) => setParticulars(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="transaction-amount">
                  Transaction Amount <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="transaction-amount"
                  type="number"
                  placeholder="Enter amount"
                  value={transactionAmount}
                  onChange={(e) => setTransactionAmount(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ref-id">
                  Reference Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="ref-id"
                  placeholder="Enter reference Name"
                  value={refId}
                  onChange={(e) => setRefId(e.target.value)}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label className="block">
                  Items <span className="text-red-500">*</span>
                </Label>
                <Button variant="outline" onClick={addItem}>
                  Add Item
                </Button>
              </div>
              {items.map((item, index) => (
                <div key={index} className="border p-4 my-2 rounded-md space-y-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>COA ID</Label>
                      <div
                        className="border rounded px-3 py-2 cursor-pointer bg-white"
                        onClick={() => {
                          setSelectedItemIndex(index)
                          setIsCOADialogOpen(true)
                        }}
                      >
                        {item.coa_id || <span className="text-gray-400">Select COA ID</span>}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`dept-${index}`}>Department ID</Label>
                      <Input
                        id={`dept-${index}`}
                        placeholder="Enter Department ID"
                        value={item.dept_id}
                        onChange={(e) => updateItem(index, "dept_id", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`debit-${index}`}>Debit</Label>
                      <Input
                        id={`debit-${index}`}
                        type="number"
                        placeholder="0.00"
                        value={item.debit}
                        onChange={(e) => updateItem(index, "debit", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`credit-${index}`}>Credit</Label>
                      <Input
                        id={`credit-${index}`}
                        type="number"
                        placeholder="0.00"
                        value={item.credit}
                        onChange={(e) => updateItem(index, "credit", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm" onClick={() => removeItem(index)}>
                      Remove Item
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                !name || !particulars || !transactionAmount || !refId || items.length === 0
              }
            >
              Add Entry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <COADialog
        open={isCOADialogOpen}
        onClose={() => setIsCOADialogOpen(false)}
        onSelect={handleSelectCOA}
      />
    </>
  )
}
