"use client";

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
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import Select from "react-select";
import { COADialog } from "./COADialog";
import { apiRequest } from "@/lib/api";
import { MultiValue, ActionMeta } from "react-select";
interface ChartOfAccount {
  id: string;
  code: string;
  name: string;
  description: string;
  major_classification: {
    code: string;
    name: string;
  };
  category: string;
  is_header: boolean;
  parent_id: string | null;
  parent?: {
    id: string;
    name: string;
  };
  is_contra: boolean;
  normal_balance: "debit" | "credit";
  special_classification: string;
  status: boolean;
  branches?: Array<{
    uid: string;
    code: string;
    name: string;
  }>;
}

interface Department {
  id: string;
  name: string;
}

interface Branch {
  id: string;
  code: string;
  name: string;
  email: string;
  address: string;
  contact: string;
  city: string;
  status: boolean;
  departments: Department[];
}

interface BranchOption {
  value: string;
  label: string;
  branch: Branch;
}

interface AddEditAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddAccount?: (newAccount: any) => Promise<void> | void;
  onEditAccount?: (
    accountId: string,
    updatedAccount: any
  ) => Promise<void> | void;
  editingAccount?: ChartOfAccount | null;
  mode?: "add" | "edit";
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

export function AddEditAccountDialog({
  open,
  onOpenChange,
  onAddAccount,
  onEditAccount,
  editingAccount,
  mode = "add",
}: AddEditAccountDialogProps) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [majorClassification, setMajorClassification] = useState("");
  const [category, setCategory] = useState("");
  const [specialClassification, setSpecialClassification] = useState("");
  const [accountType, setAccountType] = useState<"header" | "subsidiary">(
    "header"
  );
  const [, setHeaderAccountLabel] = useState("");
  const [selectedHeader, setSelectedHeader] = useState<{
    id: string;
    code: string;
    name: string;
  } | null>(null);
  const [isContraAccount, setIsContraAccount] = useState(false);
  const [normalBalance, setNormalBalance] = useState<"debit" | "credit">(
    "debit"
  );
  const [selectedBranches, setSelectedBranches] = useState<Branch[]>([]);
  const [selectedBranchIds, setSelectedBranchIds] = useState<string[]>([]);

  // New states for branch management
  const [, setBranches] = useState<Branch[]>([]);
  const [branchOptions, setBranchOptions] = useState<BranchOption[]>([]);
  const [isBranchLoading, setIsBranchLoading] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showCOADialog, setShowCOADialog] = useState(false);

  const isEditMode = mode === "edit" && editingAccount;

  // Fetch branches when dialog opens
  useEffect(() => {
    if (open) {
      fetchBranches();
    }
  }, [open]);

  const fetchBranches = async () => {
    setIsBranchLoading(true);
    try {
      const response = await apiRequest<{ data: { branches: Branch[] } }>(
        "get",
        "/branch",
        null,
        {
          useAuth: true,
          useBranchId: true,
        }
      );
      const branchData = response.data.data.branches;
      setBranches(branchData);

      // Convert branches to react-select options
      const options: BranchOption[] = branchData.map((branch) => ({
        value: branch.id,
        label: `${branch.name} (${branch.code}) - ${branch.city}`,
        branch: branch,
      }));
      setBranchOptions(options);
    } catch (error) {
      console.error("Error fetching branches:", error);
    } finally {
      setIsBranchLoading(false);
    }
  };

  // Reset form when dialog opens/closes or mode changes
  useEffect(() => {
    if (!open) {
      resetForm();
      return;
    }

    if (open) {
      if (isEditMode) {
        // Populate form with editing account data
        setCode(editingAccount.code);
        setName(editingAccount.name);
        setDescription(editingAccount.description);
        setMajorClassification(editingAccount.major_classification.code);
        setCategory(editingAccount.category);
        setSpecialClassification(editingAccount.special_classification);
        setAccountType(editingAccount.is_header ? "header" : "subsidiary");
        setIsContraAccount(editingAccount.is_contra);
        setNormalBalance(editingAccount.normal_balance);

        // Handle parent account for subsidiary accounts
        if (!editingAccount.is_header && editingAccount.parent) {
          setSelectedHeader({
            id: editingAccount.parent.id,
            code: editingAccount.code,
            name: editingAccount.parent.name,
          });
          setHeaderAccountLabel(`${editingAccount.parent.name}`);
        } else {
          setSelectedHeader(null);
          setHeaderAccountLabel("");
        }

        // Handle branches - use actual branch IDs from the editing account
        if (editingAccount.branches && editingAccount.branches.length > 0) {
          const branchIds = editingAccount.branches.map((branch) => branch.uid);
          setSelectedBranchIds(branchIds);
          // Convert to Branch format for display
          const branches = editingAccount.branches.map((branch) => ({
            id: branch.uid,
            code: branch.code,
            name: branch.name,
            email: "",
            address: "",
            contact: "",
            city: "",
            status: true,
            departments: [],
          }));
          setSelectedBranches(branches);
        } else {
          setSelectedBranchIds([]);
          setSelectedBranches([]);
        }
      } else {
        // Reset form for add mode
        resetForm();
      }
    }
  }, [open, isEditMode, editingAccount]);

  const resetForm = () => {
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
    setSelectedBranchIds([]);
    setErrors({});
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!code.trim()) newErrors.code = "Account code is required.";
    if (!name.trim()) newErrors.name = "Account name is required.";
    if (!description.trim()) newErrors.description = "Description is required.";
    if (!majorClassification.trim())
      newErrors.major_classification = "Major classification is required.";
    if (!category.trim()) newErrors.category = "Category is required.";
    if (!specialClassification.trim())
      newErrors.special_classification = "Special classification is required.";
    if (accountType === "subsidiary" && !selectedHeader) {
      newErrors.headerAccount = "Header account selection is required.";
    }
    if (selectedBranchIds.length === 0) {
      newErrors.branches = "At least one branch must be selected.";
    }
    return newErrors;
  };

  const handleBranchSelection = (
    selectedOptions: MultiValue<BranchOption>,
    _actionMeta: ActionMeta<BranchOption>
  ) => {
    if (selectedOptions && selectedOptions.length > 0) {
      const branches = selectedOptions.map((option) => option.branch);
      const branchIds = selectedOptions.map((option) => option.value);

      setSelectedBranches(branches);
      setSelectedBranchIds(branchIds);
    } else {
      setSelectedBranches([]);
      setSelectedBranchIds([]);
    }
  };

  const removeBranch = (branchId: string) => {
    const updatedBranches = selectedBranches.filter(
      (branch) => branch.id !== branchId
    );
    setSelectedBranches(updatedBranches);
    setSelectedBranchIds(updatedBranches.map((branch) => branch.id));
  };

  const handleSubmit = async () => {
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
      branches: selectedBranchIds,
    };

    setIsLoading(true);
    try {
      if (isEditMode && onEditAccount && editingAccount) {
        await onEditAccount(editingAccount.id, payload);
      } else if (onAddAccount) {
        await onAddAccount(payload);
      }

      // Only reset form and close dialog on successful operation
      resetForm();
      onOpenChange(false);
    } catch (error: any) {
      console.error(
        `Failed to ${isEditMode ? "update" : "add"} account:`,
        error
      );

      // Handle API validation errors
      if (error?.response?.data?.errors) {
        const apiErrors: Record<string, string> = {};
        for (const key in error.response.data.errors) {
          if (error.response.data.errors[key]?.length > 0) {
            apiErrors[key] = error.response.data.errors[key][0];
          }
        }
        setErrors(apiErrors);
      }
      // Handle API error messages
      else if (error?.response?.data?.message) {
        setErrors({ general: error.response.data.message });
      }
      // Handle network or other errors
      else if (error?.message) {
        setErrors({ general: error.message });
      }
      // Fallback error message
      else {
        setErrors({
          general: "An unexpected error occurred. Please try again.",
        });
      }

      // DO NOT close dialog on error - let user see the errors and try again
      // Only the successful path above should call onOpenChange(false)
    } finally {
      setIsLoading(false);
    }
  };

  const dialogTitle = isEditMode ? "Edit Account" : "Add New Account";
  const submitButtonText = isEditMode
    ? isLoading
      ? "Updating..."
      : "Update"
    : isLoading
    ? "Adding..."
    : "Add Account";

  // Get selected branch options for react-select
  const selectedBranchOptions = branchOptions.filter((option) =>
    selectedBranchIds.includes(option.value)
  );

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[700px] max-h-[90vh] overflow-hidden p-7">
          <div className="max-h-[85vh] overflow-y-auto pr-2 ">
            <DialogHeader>
              <DialogTitle>{dialogTitle}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <div>
                <Label
                  className={
                    errors.major_classification ? "text-red-500" : undefined
                  }
                >
                  Major Classification <span className="text-red-500">*</span>
                </Label>
                <select
                  value={majorClassification}
                  onChange={(e) => {
                    setMajorClassification(e.target.value);
                    setCategory("");
                  }}
                  className={`mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                    errors.major_classification ? "border-red-500" : ""
                  }`}
                >
                  <option value="">Select...</option>
                  {classificationOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {errors.major_classification && (
                  <p className="text-sm text-red-600">
                    {errors.major_classification}
                  </p>
                )}
              </div>

              <div>
                <Label className={errors.category ? "text-red-500" : undefined}>
                  Category <span className="text-red-500">*</span>
                </Label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                    errors.category ? "border-red-500" : ""
                  }`}
                  disabled={!majorClassification}
                >
                  <option value="">Select...</option>
                  {(categoryOptionsMap[majorClassification] || []).map(
                    (cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    )
                  )}
                </select>
                {errors.category && (
                  <p className="text-sm text-red-600">{errors.category}</p>
                )}
              </div>

              <div>
                <Label>
                  Header <span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-6 mt-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="header-account"
                      name="accountType"
                      value="header"
                      checked={accountType === "header"}
                      onChange={() => setAccountType("header")}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="header-account" className="font-normal">
                      Header Account
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="subsidiary-account"
                      name="accountType"
                      value="subsidiary"
                      checked={accountType === "subsidiary"}
                      onChange={() => setAccountType("subsidiary")}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="subsidiary-account" className="font-normal">
                      Subsidiary Account
                    </Label>
                  </div>
                </div>
              </div>

              {accountType === "subsidiary" && (
                <div>
                  <Label
                    className={
                      errors.headerAccount ? "text-red-500" : undefined
                    }
                  >
                    Header account <span className="text-red-500 mb-3">*</span>
                  </Label>
                  <div className="flex gap-2">
                    <select
                      value={selectedHeader?.id || ""}
                      onChange={(e) => {
                        const selectedId = e.target.value;
                        if (selectedId) {
                          // This would need to be populated with actual header accounts
                          // For now, using placeholder logic
                          setHeaderAccountLabel("Selected Header Account");
                          setSelectedHeader({
                            id: selectedId,
                            code: "",
                            name: "Selected Header Account",
                          });
                        } else {
                          setHeaderAccountLabel("");
                          setSelectedHeader(null);
                        }
                      }}
                      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                        errors.headerAccount ? "border-red-500" : ""
                      }`}
                    >
                      <option value="">Select...</option>
                      {/* Header accounts would be populated here */}
                    </select>
                  </div>
                  {errors.headerAccount && (
                    <p className="text-sm text-red-600">
                      {errors.headerAccount}
                    </p>
                  )}
                </div>
              )}

              <div>
                <Label>
                  Normal Balance <span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-6 mt-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="debit-balance"
                      name="normalBalance"
                      value="debit"
                      checked={normalBalance === "debit"}
                      onChange={() => setNormalBalance("debit")}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="debit-balance" className="font-normal">
                      Debit
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="credit-balance"
                      name="normalBalance"
                      value="credit"
                      checked={normalBalance === "credit"}
                      onChange={() => setNormalBalance("credit")}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="credit-balance" className="font-normal">
                      Credit
                    </Label>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  The normal balance side for this account
                </p>
              </div>

              <div>
                <Label className={`${errors.code ? "text-red-500" : ""} mb-2`}>
                  Account Code <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className={errors.code ? "border-red-500" : undefined}
                  placeholder="Enter account code"
                />
                {errors.code && (
                  <p className="text-sm text-red-600">{errors.code}</p>
                )}
              </div>

              <div>
                <Label className={`${errors.name ? "text-red-500" : ""} mb-2`}>
                  Account Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={errors.name ? "border-red-500" : undefined}
                  placeholder="Enter account name"
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <Label
                  className={`${errors.description ? "text-red-500" : ""} mb-2`}
                >
                  Description <span className="text-red-500">*</span>
                </Label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none ${
                    errors.description ? "border-red-500" : ""
                  }`}
                  placeholder="Enter a description of the account and when to use it"
                />
                {errors.description && (
                  <p className="text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  id="contra-account"
                  checked={isContraAccount}
                  onChange={(e) => setIsContraAccount(e.target.checked)}
                  className="h-4 w-4 mt-1"
                />
                <div>
                  <Label htmlFor="contra-account">Contra Account</Label>
                  <p className="text-sm text-muted-foreground">
                    Check this if the account is a contra account (reduces the
                    balance of another account)
                  </p>
                </div>
              </div>

              <div>
                <Label
                  className={`${
                    errors.special_classification ? "text-red-500" : ""
                  } mb-2`}
                >
                  Special Classification <span className="text-red-500">*</span>
                </Label>
                <select
                  value={specialClassification}
                  onChange={(e) => setSpecialClassification(e.target.value)}
                  className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                    errors.special_classification ? "border-red-500" : ""
                  }`}
                >
                  <option value="">Select...</option>
                  <option value="regular account">Regular account</option>
                  <option value="cash account">Cash account</option>
                  <option value="cash in bank account">
                    Cash in bank account
                  </option>
                  <option value="receivable account">Receivable account</option>
                  <option value="payable account">Payable account</option>
                  <option value="allowance for bad debts">
                    Allowance for bad debts
                  </option>
                  <option value="properties and equipment">
                    Properties and equipment
                  </option>
                  <option value="accumulated depreciation">
                    Accumulated depreciation
                  </option>
                  <option value="accumulated amortization">
                    Accumulated amortization
                  </option>
                  <option value="cost of sales">Cost of sales</option>
                  <option value="sales debits">Sales debits</option>
                  <option value="sales">Sales</option>
                  <option value="sales discount">Sales discount</option>
                  <option value="other income">Other income</option>
                  <option value="retained income">Retained income</option>
                </select>
                <p className="text-sm text-muted-foreground mt-1">
                  The special classification of this account
                </p>
                {errors.special_classification && (
                  <p className="text-sm text-red-600">
                    {errors.special_classification}
                  </p>
                )}
              </div>

              <div>
                <Label
                  className={`${errors.branches ? "text-red-500" : ""} mb-2`}
                >
                  Branch <span className="text-red-500">*</span>
                </Label>
                <div className="space-y-2">
                  {selectedBranches.length > 0 && (
                    <div className="flex flex-wrap gap-2 p-2 border rounded">
                      {selectedBranches.map((branch) => (
                        <Badge
                          key={branch.id}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {branch.name}
                          <X
                            className="h-3 w-3 cursor-pointer hover:text-red-500"
                            onClick={() => removeBranch(branch.id)}
                          />
                        </Badge>
                      ))}
                         {errors.special_classification && (
                  <p className="text-sm text-red-600">
                    {errors.branches}
                  </p>
                )}
                    </div>
                  )}

                  <Select
                    isMulti
                    options={branchOptions}
                    value={selectedBranchOptions}
                    onChange={handleBranchSelection}
                    placeholder="Select branches..."
                    isLoading={isBranchLoading}
                    isSearchable
                    className={`${errors.branches ? "border-red-500" : ""}`}
                    classNamePrefix="react-select"
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        borderColor: errors.branches
                          ? "#ef4444"
                          : provided.borderColor,
                        "&:hover": {
                          borderColor: errors.branches
                            ? "#ef4444"
                            : provided.borderColor,
                        },
                      }),
                    }}
                  />

                  {errors.branches && (
                    <p className="text-sm text-red-600">{errors.branches}</p>
                  )}
                </div>
              </div>

              {errors.general && (
                <div>
                  <p className="text-sm text-red-600">{errors.general}</p>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4">
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
                  {submitButtonText}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <COADialog
        open={showCOADialog}
        onClose={() => setShowCOADialog(false)}
        onSelect={(coa) => {
          setHeaderAccountLabel(`${coa.code} - ${coa.name}`);
          setSelectedHeader({ id: coa.id, code: coa.code, name: coa.name });
          setShowCOADialog(false);
        }}
      />
    </>
  );
}

export { AddEditAccountDialog as AddAccountDialog };
