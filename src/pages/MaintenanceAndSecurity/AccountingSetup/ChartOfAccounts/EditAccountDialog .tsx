import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { COADialog } from "./COADialog";

interface ChartOfAccount {
  id: string
  code: string
  name: string
  description: string
  major_classification: string
  category: string
  is_header: boolean
  parent_id: string | null
    parent?: Parent
  is_contra: boolean
  normal_balance: "debit" | "credit"
  special_classification: string
  status: boolean
  branches?: Branch[]
}
interface Parent {
  id: string
  name: string
}
interface Branch {
  uid: string
  code: string
  name: string
}

interface EditAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditAccount: (accountId: string, updatedAccount: any) => Promise<void> | void;
  account: ChartOfAccount | null;
}

const classificationOptions = [
  { label: "Assets", value: "1" },
  { label: "Liabilities", value: "2" },
  { label: "Owner's Equity", value: "3" },
  { label: "Revenue", value: "4" },
  { label: "Expenses", value: "5" },
];

const categoryOptionsMap: Record<string, string[]> = {
  "1": ["Current Assets", "Non-Current Assets (PPE)", "Other Asset"],
  "2": ["Current Liabilities", "Long-Term Liabilities"],
  "3": ["Capital", "Retained Earnings", "Drawings"],
  "4": ["Direct cost for Balance Sheet", "Non-Operating Income"],
  "5": ["Administrative and Operating Expenses", "Non-Operating Expenses"],
};

export function EditAccountDialog({ open, onOpenChange, onEditAccount, account }: EditAccountDialogProps) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [majorClassification, setMajorClassification] = useState("");
  const [category, setCategory] = useState("");
  const [specialClassification, setSpecialClassification] = useState("");
  const [accountType, setAccountType] = useState<"header" | "subsidiary">("header");
  const [headerAccountLabel, setHeaderAccountLabel] = useState("");
  const [selectedHeader, setSelectedHeader] = useState<{ id: string; code: string; name: string } | null>(null);
  const [isContraAccount, setIsContraAccount] = useState(false);
  const [normalBalance, setNormalBalance] = useState<"debit" | "credit">("debit");
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showCOADialog, setShowCOADialog] = useState(false);

  useEffect(() => {
    if (account && open) {
      setCode(account.code);
      setName(account.name);
      setDescription(account.description || "");
      setMajorClassification(account.major_classification);
      setCategory(account.category);
      setSpecialClassification(account.special_classification || "");
      setAccountType(account.is_header ? "header" : "subsidiary");
      setIsContraAccount(account.is_contra);
      setNormalBalance(account.normal_balance);
      

      if (account.branches && account.branches.length > 0) {
        setSelectedBranches(account.branches.map(branch => branch.uid));
      } else {
        setSelectedBranches([""]);
      }


      if (!account.is_header && account.parent?.id) {

        setHeaderAccountLabel(account.parent.name);
        setSelectedHeader({ 
          id: account.parent.id, 
          code: "", 
          name: "" 
        });
      } else {
        setHeaderAccountLabel("");
        setSelectedHeader(null);
      }


      setErrors({});
    }
  }, [account, open]);


  useEffect(() => {
    if (!open) {
      setCode("");
      setName("");
      setDescription("");
      setMajorClassification("");
      setCategory("");
      setSpecialClassification("");
      setAccountType("header");
      setHeaderAccountLabel("");
      setSelectedHeader(null);
      setIsContraAccount(false);
      setNormalBalance("debit");
      setSelectedBranches([]);
      setErrors({});
    }
  }, [open]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!code.trim()) newErrors.code = "Account code is required.";
    if (!name.trim()) newErrors.name = "Account name is required.";
    if (accountType === "subsidiary" && !selectedHeader) newErrors.headerAccount = "Header account selection is required.";
    return newErrors;
  };

  const handleSubmit = async () => {
    if (!account) return;

    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const payload = {
      code: code.trim(),
      name: name.trim(),
      description: description.trim(),
      major_classification: majorClassification.trim(),
      category: category.trim(),
      is_header: accountType === "header",
      parent_id: accountType === "subsidiary" ? selectedHeader?.id : null,
      is_contra: isContraAccount,
      normal_balance: normalBalance,
      special_classification: specialClassification.trim(),
      branches: selectedBranches,
    };

    setIsLoading(true);
    try {
      await onEditAccount(account.id, payload);
      onOpenChange(false);
    } catch (error: any) {
      console.error("Failed to update account:", error);
      if (error?.response?.data?.errors) {
        const apiErrors: Record<string, string> = {};
        for (const key in error.response.data.errors) {
          if (error.response.data.errors[key]?.length > 0) {
            apiErrors[key] = error.response.data.errors[key][0];
          }
        }
        setErrors(apiErrors);
      } else {
        setErrors({ general: "An unexpected error occurred." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Account</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
  
          <div>
            <Label className={errors.code ? "text-red-500" : undefined}>
              Account Code <span className="text-red-500">*</span>
            </Label>
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className={errors.code ? "border-red-500" : undefined}
            />
            {errors.code && <p className="text-sm text-red-600">{errors.code}</p>}
          </div>

          <div>
            <Label className={errors.name ? "text-red-500" : undefined}>
              Account Name <span className="text-red-500">*</span>
            </Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={errors.name ? "border-red-500" : undefined}
            />
            {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
          </div>

       
          <div className="col-span-2">
            <Label>Description</Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

       
          <div>
            <Label className={errors.major_classification ? "text-red-500" : undefined}>
              Major Classification
            </Label>
            <select
              value={majorClassification}
              onChange={(e) => {
                setMajorClassification(e.target.value);
                setCategory("");
              }}
              className={`input w-full ${errors.major_classification ? "border-red-500" : ""}`}
            >
              <option value="">Select...</option>
              {classificationOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.major_classification && <p className="text-sm text-red-600">{errors.major_classification}</p>}
          </div>

     
          <div>
            <Label className={errors.category ? "text-red-500" : undefined}>Category</Label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`input w-full ${errors.category ? "border-red-500" : ""}`}
              disabled={!majorClassification}
            >
              <option value="">Select...</option>
              {(categoryOptionsMap[majorClassification] || []).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && <p className="text-sm text-red-600">{errors.category}</p>}
          </div>

        
          <div>
            <Label>Special Classification</Label>
            <select
              value={specialClassification}
              onChange={(e) => setSpecialClassification(e.target.value)}
              className="input w-full"
            >
              <option value="">Select...</option>
              <option value="regular account">Regular account</option>
              <option value="cash account">Cash account</option>
              <option value="cash in bank account">Cash in bank account</option>
              <option value="receivable account">Receivable account</option>
              <option value="payable account">Payable account</option>
              <option value="allowance for bad debts">Allowance for bad debts</option>
              <option value="properties and equipment">Properties and equipment</option>
              <option value="accumulated depreciation">Accumulated depreciation</option>
              <option value="accumulated amortization">Accumulated amortization</option>
              <option value="cost of sales">Cost of sales</option>
              <option value="sales debits">Sales debits</option>
              <option value="sales">Sales</option>
              <option value="sales discount">Sales discount</option>
              <option value="other income">Other income</option>
              <option value="retained income">Retained income</option>
            </select>
          </div>

 
          <div>
            <Label>Account Type</Label>
            <div className="flex gap-4 mt-2">
              <Button
                type="button"
                variant={accountType === "header" ? "default" : "outline"}
                onClick={() => setAccountType("header")}
              >
                Header
              </Button>
              <Button
                type="button"
                variant={accountType === "subsidiary" ? "default" : "outline"}
                onClick={() => setAccountType("subsidiary")}
              >
                Subsidiary
              </Button>
            </div>
          </div>

         
          {accountType === "subsidiary" && (
            <div className="col-span-2">
              <Label className={errors.headerAccount ? "text-red-500" : undefined}>
                Header Account <span className="text-red-500">*</span>
              </Label>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={headerAccountLabel}
                  className={errors.headerAccount ? "border-red-500" : undefined}
                />
                <Button type="button" onClick={() => setShowCOADialog(true)}>
                  Select
                </Button>
              </div>
              {errors.headerAccount && <p className="text-sm text-red-600">{errors.headerAccount}</p>}
            </div>
          )}

          <div>
            <Label>Contra Account</Label>
            <div className="flex items-center space-x-2 mt-2">
              <Switch checked={isContraAccount} onCheckedChange={setIsContraAccount} />
              <span className="text-sm text-gray-600">
                {isContraAccount ? "Yes" : "No"}
              </span>
            </div>
          </div>


          <div>
            <Label>Normal Balance</Label>
            <div className="flex gap-4 mt-2">
              <Button
                type="button"
                variant={normalBalance === "debit" ? "default" : "outline"}
                onClick={() => setNormalBalance("debit")}
              >
                Debit
              </Button>
              <Button
                type="button"
                variant={normalBalance === "credit" ? "default" : "outline"}
                onClick={() => setNormalBalance("credit")}
              >
                Credit
              </Button>
            </div>
          </div>

          
          {errors.general && (
            <div className="col-span-2">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}

         
          <div className="col-span-2 flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={handleSubmit} 
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update Account"}
            </Button>
          </div>
        </div>

  
        <COADialog
          open={showCOADialog}
          onClose={() => setShowCOADialog(false)}
          onSelect={(coa) => {
            setHeaderAccountLabel(`${coa.code} - ${coa.name}`);
            setSelectedHeader({ id: coa.id, code: coa.code, name: coa.name });
            setShowCOADialog(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}