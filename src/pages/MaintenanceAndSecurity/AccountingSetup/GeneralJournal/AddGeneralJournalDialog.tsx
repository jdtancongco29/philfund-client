import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { COADialog } from "./COADialog";

// Dummy data for selects (replace with API data as needed)
const branches = [
  { id: "9e8c8772-ea5b-48bd-bc2c-ff96d61b2771", name: "Main Branch" },
];
const users = [
  { id: "4518523a-6f41-4731-87d5-fd08ae6541e3", name: "John Doe" },
];

interface Item {
  coa_id: string;
  debit: string;
  credit: string;
}
interface ChartOfAccount {
  id: string;
  code: string;
  name: string;
}

interface AddNewEntryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: any) => void;
}

export default function AddNewEntryDialog({
  isOpen,
  onClose,
  onAdd,
}: AddNewEntryDialogProps) {
  const [name, setName] = useState("");
  const [particulars, setParticulars] = useState("");
  const [refNum, setRefNum] = useState("");
  const [refId, setRefId] = useState("");
  const [branchId, setBranchId] = useState("");
  const [transactionDate, setTransactionDate] = useState("");
  const [checkedBy, setCheckedBy] = useState("");
  const [approvedBy, setApprovedBy] = useState("");
  const [preparedBy, setPreparedBy] = useState("");
  const [transAmount, setTransAmount] = useState("");
  const [items, setItems] = useState<Item[]>([]);

  const [isCOADialogOpen, setIsCOADialogOpen] = useState(false);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(
    null
  );

  const addItem = () => {
    setItems([...items, { coa_id: "", debit: "", credit: "" }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof Item, value: string) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      [field]: value,
    };
    setItems(newItems);
  };

  const handleSelectCOA = (coa: ChartOfAccount) => {
    if (selectedItemIndex !== null) {
      const newItems = [...items];
      newItems[selectedItemIndex] = {
        ...newItems[selectedItemIndex],
        coa_id: coa.id,
      };
      setItems(newItems);
      setIsCOADialogOpen(false);
    }
  };

  const resetForm = () => {
    setName("");
    setParticulars("");
    setRefNum("");
    setRefId("");
    setBranchId("");
    setTransactionDate("");
    setCheckedBy("");
    setApprovedBy("");
    setPreparedBy("");
    setTransAmount("");
    setItems([]);
  };

  const handleSubmit = () => {
    if (
      name &&
      particulars &&
      refNum &&
      refId &&
      branchId &&
      transactionDate &&
      checkedBy &&
      approvedBy &&
      preparedBy &&
      transAmount &&
      items.length
    ) {
      onAdd({
        name,
        particulars,
        ref_num: Number(refNum),
        ref_id: refId,
        branch_id: branchId,
        transaction_date: transactionDate,
        checked_by: checkedBy,
        approved_by: approvedBy,
        prepared_by: preparedBy,
        trans_amount: parseFloat(transAmount),
        items: items.map((item) => ({
          coa_id: item.coa_id,
          debit: parseFloat(item.debit) || 0,
          credit: parseFloat(item.credit) || 0,
        })),
      });
      resetForm();
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Add General Journal
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Entry name"
                />
              </div>
              <div className="space-y-2">
                <Label>
                  Particulars <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={particulars}
                  onChange={(e) => setParticulars(e.target.value)}
                  placeholder="Particulars"
                />
              </div>
              <div className="space-y-2">
                <Label>
                  Reference Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  value={refNum}
                  onChange={(e) => setRefNum(e.target.value)}
                  placeholder="Reference Number"
                />
              </div>
              <div className="space-y-2">
                <Label>
                  Reference ID <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={refId}
                  onChange={(e) => setRefId(e.target.value)}
                  placeholder="Reference ID"
                />
              </div>
              <div className="space-y-2">
                <Label>
                  Branch <span className="text-red-500">*</span>
                </Label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={branchId}
                  onChange={(e) => setBranchId(e.target.value)}
                >
                  <option value="">Select Branch</option>
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>
                  Transaction Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="date"
                  value={transactionDate}
                  onChange={(e) => setTransactionDate(e.target.value)}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label>
                  Items <span className="text-red-500">*</span>
                </Label>
                <Button variant="outline" onClick={addItem}>
                  Add Item
                </Button>
              </div>
              {items.map((item, index) => (
                <div
                  key={index}
                  className="border p-4 my-2 rounded-md space-y-2"
                >
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>COA</Label>
                      <div
                        className="border rounded px-3 py-2 cursor-pointer bg-white"
                        onClick={() => {
                          setSelectedItemIndex(index);
                          setIsCOADialogOpen(true);
                        }}
                      >
                        {item.coa_id || (
                          <span className="text-gray-400">Select COA</span>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Debit</Label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={item.debit}
                        onChange={(e) =>
                          updateItem(index, "debit", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Credit</Label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={item.credit}
                        onChange={(e) =>
                          updateItem(index, "credit", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeItem(index)}
                    >
                      Remove Item
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            {/* Dynamic Items for checked_by, approved_by, prepared_by, trans_amount */}
            <div className="mt-4 grid grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>
                  Checked By <span className="text-red-500">*</span>
                </Label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={checkedBy}
                  onChange={(e) => setCheckedBy(e.target.value)}
                >
                  <option value="">Select User</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>
                  Approved By <span className="text-red-500">*</span>
                </Label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={approvedBy}
                  onChange={(e) => setApprovedBy(e.target.value)}
                >
                  <option value="">Select User</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>
                  Prepared By <span className="text-red-500">*</span>
                </Label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={preparedBy}
                  onChange={(e) => setPreparedBy(e.target.value)}
                >
                  <option value="">Select User</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>
                  Transaction Amount <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  value={transAmount}
                  onChange={(e) => setTransAmount(e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>
          <DialogFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                !name ||
                !particulars ||
                !refNum ||
                !refId ||
                !branchId ||
                !transactionDate ||
                !checkedBy ||
                !approvedBy ||
                !preparedBy ||
                !transAmount ||
                items.length === 0
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
  );
}
