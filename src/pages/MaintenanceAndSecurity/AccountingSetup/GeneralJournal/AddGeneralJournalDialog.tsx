import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CircleCheck } from "lucide-react";
import { toast } from "sonner";
import { apiRequest } from "@/lib/api";
import { BranchSelectionDialog } from "./BranchSelectionDialog";
import { BranchUserDialog } from "./BranchUserDialog";
import { COADialog } from "./COADialog";

interface ValidationErrors {
  [key: string]: string[];
}

interface Item {
  coa_id: string;
  coa_name?: string;
  debit: string;
  credit: string;
}

interface ChartOfAccount {
  id: string;
  branch_id: string;
  code: string;
  name: string;
}

interface AddNewEntryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: any) => void;
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

interface Department {
  id: string;
  name: string;
}

interface BranchUser {
  id: string;
  name: string;
}

// Utility functions for balance calculations
const calculateTotalDebit = (items: Item[]): number => {
  return items.reduce(
    (total, item) => total + (parseFloat(item.debit) || 0),
    0
  );
};

const calculateTotalCredit = (items: Item[]): number => {
  return items.reduce(
    (total, item) => total + (parseFloat(item.credit) || 0),
    0
  );
};

const isBalanced = (items: Item[]): boolean => {
  const totalDebit = calculateTotalDebit(items);
  const totalCredit = calculateTotalCredit(items);
  return Math.abs(totalDebit - totalCredit) < 0.01; // Allow for small floating point differences
};

// Error Display Component
const ErrorMessage = ({ errors }: { errors: string[] }) => {
  if (!errors || errors.length === 0) return null;

  return (
    <div className="mt-1 space-y-1">
      {errors.map((error, index) => (
        <div
          key={index}
          className="flex items-center gap-1 text-sm text-red-600"
        >
          <AlertCircle className="h-3 w-3 flex-shrink-0" />
          <span>{error}</span>
        </div>
      ))}
    </div>
  );
};

// Balance Validation Component
const BalanceValidationMessage = ({ items }: { items: Item[] }) => {
  const totalDebit = calculateTotalDebit(items);
  const totalCredit = calculateTotalCredit(items);
  const balanced = isBalanced(items);

  if (items.length === 0) return null;

  return (
    <div
      className={`mt-2 p-3 rounded-md border ${
        balanced ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
      }`}
    >
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          {balanced ? (
            <CircleCheck className="h-4 w-4 text-green-600" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600" />
          )}
          <span className={balanced ? "text-green-700" : "text-red-700"}>
            {balanced ? "Balanced" : "Out of Balance"}
          </span>
        </div>
        <div className="flex gap-4 text-xs">
          <span className="text-gray-600">
            Total Debit:{" "}
            <span className="font-medium">{totalDebit.toFixed(2)}</span>
          </span>
          <span className="text-gray-600">
            Total Credit:{" "}
            <span className="font-medium">{totalCredit.toFixed(2)}</span>
          </span>
          {!balanced && (
            <span className="text-red-600">
              Difference:{" "}
              <span className="font-medium">
                {Math.abs(totalDebit - totalCredit).toFixed(2)}
              </span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

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
  const [, setTransAmount] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Error state
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );

  const [isCOADialogOpen, setIsCOADialogOpen] = useState(false);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(
    null
  );

  // User selection states
  const [userDialogOpen, setUserDialogOpen] = useState<
    "prepared" | "checked" | "approved" | null
  >(null);
  const [preparedBy, setPreparedBy] = useState<BranchUser | null>(null);
  const [checkedBy, setCheckedBy] = useState<BranchUser | null>(null);
  const [approvedBy, setApprovedBy] = useState<BranchUser | null>(null);

  // Branch selection states
  const [isBranchDialogOpen, setIsBranchDialogOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  // Helper function to get field errors
  const getFieldErrors = (fieldName: string): string[] => {
    return validationErrors[fieldName] || [];
  };

  // Helper function to check if field has errors
  const hasFieldError = (fieldName: string): boolean => {
    return getFieldErrors(fieldName).length > 0;
  };

  // Clear errors when field values change
  const clearFieldError = (fieldName: string) => {
    if (hasFieldError(fieldName)) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const fetchReferenceNumber = async () => {
    try {
      const response = await apiRequest(
        "get",
        "/reference/number/?module_code=general_journal",
        null,
        { useAuth: true, useBranchId: true }
      );
      const { ref_id, ref_num } = response.data.data;
      setRefId(ref_id);
      setRefNum(ref_num.toString());
    } catch (error) {
      console.error("Failed to fetch reference number:", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchReferenceNumber();
      // Clear errors when dialog opens
      setValidationErrors({});
    }
  }, [isOpen]);

  const addItem = () => {
    setItems([...items, { coa_id: "", debit: "", credit: "" }]);
    // Clear balance errors when adding new items
    clearFieldError("items");
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
    // Clear errors for removed item
    const itemErrors = Object.keys(validationErrors).filter((key) =>
      key.startsWith(`items.${index}`)
    );
    if (itemErrors.length > 0) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        itemErrors.forEach((key) => delete newErrors[key]);
        return newErrors;
      });
    }

    // Clear balance errors when removing items
    clearFieldError("items");
  };

  const updateItem = (index: number, field: keyof Item, value: string) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      [field]: value,
    };
    setItems(newItems);

    // Clear item-specific errors when updating
    const fieldKey =
      field === "coa_id" ? `items.${index}.coa_id` : `items.${index}`;
    clearFieldError(fieldKey);

    // Clear balance-related errors when amounts change
    if (field === "debit" || field === "credit") {
      clearFieldError("items");
    }
  };

  const handleSelectCOA = (coa: ChartOfAccount) => {
    if (selectedItemIndex !== null) {
      const newItems = [...items];
      newItems[selectedItemIndex] = {
        ...newItems[selectedItemIndex],
        coa_id: coa.id,
        coa_name: coa.name,
      };
      setItems(newItems);
      setIsCOADialogOpen(false);

      // Clear COA-related errors for this item
      clearFieldError(`items.${selectedItemIndex}.coa_id`);
      clearFieldError(`items.${selectedItemIndex}`);
    }
  };

  const handleSelectBranch = (branch: Branch) => {
    setSelectedBranch(branch);
    setBranchId(branch.id);
    clearFieldError("branch_id");
  };

  const handleUserSelect = (user: BranchUser) => {
    if (userDialogOpen === "prepared") {
      setPreparedBy(user);
      clearFieldError("prepared_by");
    } else if (userDialogOpen === "checked") {
      setCheckedBy(user);
      clearFieldError("checked_by");
    } else if (userDialogOpen === "approved") {
      setApprovedBy(user);
      clearFieldError("approved_by");
    }
    setUserDialogOpen(null);
  };

  const resetForm = () => {
    setName("");
    setParticulars("");
    setRefNum("");
    setRefId("");
    setBranchId("");
    setTransactionDate("");
    setTransAmount("");
    setItems([]);
    setPreparedBy(null);
    setCheckedBy(null);
    setApprovedBy(null);
    setSelectedBranch(null);
    setValidationErrors({});
  };

  const createGeneralJournalEntry = async (payload: any) => {
    try {
      setIsSubmitting(true);
      const response = await apiRequest("post", "/general-journal", payload, {
        useAuth: true,
        customHeaders: {
          "X-Branch-Id": branchId,
        },
      });
      return response.data;
    } catch (error: any) {
      // Handle API validation errors
      if (error.response?.data?.errors) {
        setValidationErrors(error.response.data.errors);

        // Show specific error message for balance issues
        const errorMessage = error.response.data.message;
        if (errorMessage?.includes("debit and credit amounts must be equal")) {
          toast.error("Balance Error", {
            description:
              "The total debit and credit amounts must be equal. Please adjust your entries.",
            duration: 6000,
          });
        } else {
          toast.error("Validation Error", {
            description:
              errorMessage || "Please fix the errors below and try again.",
            duration: 5000,
          });
        }
      } else {
        // Handle other types of errors
        toast.error("Error creating General Journal", {
          description: "An unexpected error occurred. Please try again.",
          duration: 5000,
        });
      }

      console.error("Failed to create general journal entry:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };
  const totalCredit = calculateTotalCredit(items);
  // In your AddNewEntryDialog component, modify the handleSubmit function:

  const handleSubmit = async () => {
    // Clear previous validation errors
    setValidationErrors({});

    // Client-side validation for balance
    if (items.length > 0 && !isBalanced(items)) {
      setValidationErrors({
        items: ["The total debit and credit amounts must be equal."],
      });
      toast.error("Balance Error", {
        description:
          "The total debit and credit amounts must be equal. Please adjust your entries.",
        duration: 6000,
      });
      return;
    }

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
      items.length
    ) {
      try {
        const payload = {
          name,
          particulars,
          ref_num: Number(refNum),
          ref_id: refId,
          branch_id: branchId,
          transaction_date: transactionDate,
          checked_by: checkedBy.id,
          approved_by: approvedBy.id,
          prepared_by: preparedBy.id,
          trans_amount: totalCredit,
          items: items.map((item) => ({
            coa_id: item.coa_id,
            debit: parseFloat(item.debit) || 0,
            credit: parseFloat(item.credit) || 0,
          })),
        };

        const result = await createGeneralJournalEntry(payload);

        // Pass the result to parent component (which will handle the toast)
        onAdd({
          ...result,
          name,
          particulars,
          ref_num: Number(refNum),
          trans_amount: totalCredit,
          transaction_date: transactionDate,
          branch_name: selectedBranch?.name,
        });

        resetForm();
        onClose();

        // REMOVE the toast from here since parent will handle it
        toast.success("General Journal Created", {
          description: `General Journal has been successfully created.`,
          icon: <CircleCheck className="h-5 w-5" />,
          duration: 5000,
        });

        console.log("General journal entry created successfully:", result);
      } catch (error) {
        // Error handling is done in createGeneralJournalEntry
        console.error("Error creating general journal entry:", error);
      }
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[700px] overflow-y-auto max-h-[80vh]">
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
                  onChange={(e) => {
                    setName(e.target.value);
                    clearFieldError("name");
                  }}
                  placeholder="Entry name"
                  disabled={isSubmitting}
                  className={hasFieldError("name") ? "border-red-500" : ""}
                />
                <ErrorMessage errors={getFieldErrors("name")} />
              </div>
              <div className="space-y-2">
                <Label>
                  Particulars <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={particulars}
                  onChange={(e) => {
                    setParticulars(e.target.value);
                    clearFieldError("particulars");
                  }}
                  placeholder="Particulars"
                  disabled={isSubmitting}
                  className={
                    hasFieldError("particulars") ? "border-red-500" : ""
                  }
                />
                <ErrorMessage errors={getFieldErrors("particulars")} />
              </div>
              <div className="space-y-2">
                <Label>
                  Reference Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  value={refNum}
                  readOnly
                  placeholder="Reference Number"
                  disabled={isSubmitting}
                  className={hasFieldError("ref_num") ? "border-red-500" : ""}
                />
                <ErrorMessage errors={getFieldErrors("ref_num")} />
              </div>
              <div className="space-y-2">
                <Label>
                  Reference ID <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={refId}
                  onChange={(e) => {
                    setRefId(e.target.value);
                    clearFieldError("ref_id");
                  }}
                  placeholder="Reference ID"
                  disabled={isSubmitting}
                  className={hasFieldError("ref_id") ? "border-red-500" : ""}
                />
                <ErrorMessage errors={getFieldErrors("ref_id")} />
              </div>
              <div className="space-y-2">
                <Label>
                  Branch <span className="text-red-500">*</span>
                </Label>
                <div
                  className={`w-full border rounded px-3 py-2 bg-white cursor-pointer ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  } ${hasFieldError("branch_id") ? "border-red-500" : ""}`}
                  onClick={() => !isSubmitting && setIsBranchDialogOpen(true)}
                >
                  {selectedBranch ? (
                    selectedBranch.name
                  ) : (
                    <span className="text-gray-400">Select Branch</span>
                  )}
                </div>
                <ErrorMessage errors={getFieldErrors("branch_id")} />
              </div>
              <div className="space-y-2">
                <Label>
                  Transaction Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="date"
                  value={transactionDate}
                  onChange={(e) => {
                    setTransactionDate(e.target.value);
                    clearFieldError("transaction_date");
                  }}
                  disabled={isSubmitting}
                  className={
                    hasFieldError("transaction_date") ? "border-red-500" : ""
                  }
                />
                <ErrorMessage errors={getFieldErrors("transaction_date")} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label>
                  Items <span className="text-red-500">*</span>
                </Label>
                <Button
                  variant="outline"
                  onClick={addItem}
                  disabled={isSubmitting}
                >
                  Add Item
                </Button>
              </div>

              {/* Display balance validation message */}
              <BalanceValidationMessage items={items} />

              {/* Display general items errors (like balance errors) */}
              <ErrorMessage errors={getFieldErrors("items")} />

              {items.map((item, index) => (
                <div
                  key={index}
                  className="border p-4 my-2 rounded-md space-y-2"
                >
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>COA</Label>
                      <div
                        className={`border rounded px-3 py-2 cursor-pointer bg-white ${
                          isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                        } ${
                          hasFieldError(`items.${index}.coa_id`)
                            ? "border-red-500"
                            : ""
                        }`}
                        onClick={() => {
                          if (!isSubmitting) {
                            setSelectedItemIndex(index);
                            setIsCOADialogOpen(true);
                          }
                        }}
                      >
                        {item.coa_name || (
                          <span className="text-gray-400">Select COA</span>
                        )}
                      </div>
                      <ErrorMessage
                        errors={getFieldErrors(`items.${index}.coa_id`)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Debit</Label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={item.debit}
                        onChange={(e) =>
                          updateItem(index, "debit", e.target.value)
                        }
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Credit</Label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={item.credit}
                        onChange={(e) =>
                          updateItem(index, "credit", e.target.value)
                        }
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  {/* Display item-level errors (like uniqueness errors) */}
                  <ErrorMessage errors={getFieldErrors(`items.${index}`)} />
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeItem(index)}
                      disabled={isSubmitting}
                    >
                      Remove Item
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Prepared By</Label>
                <Input
                  value={preparedBy?.name ?? ""}
                  readOnly
                  placeholder="Select user"
                  onClick={() => !isSubmitting && setUserDialogOpen("prepared")}
                  className={`cursor-pointer ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  } ${hasFieldError("prepared_by") ? "border-red-500" : ""}`}
                />
                <ErrorMessage errors={getFieldErrors("prepared_by")} />
              </div>

              <div className="space-y-2">
                <Label>Checked By</Label>
                <Input
                  value={checkedBy?.name ?? ""}
                  readOnly
                  placeholder="Select user"
                  onClick={() => !isSubmitting && setUserDialogOpen("checked")}
                  className={`cursor-pointer ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  } ${hasFieldError("checked_by") ? "border-red-500" : ""}`}
                />
                <ErrorMessage errors={getFieldErrors("checked_by")} />
              </div>

              <div className="space-y-2">
                <Label>Approved By</Label>
                <Input
                  value={approvedBy?.name ?? ""}
                  readOnly
                  placeholder="Select user"
                  onClick={() => !isSubmitting && setUserDialogOpen("approved")}
                  className={`cursor-pointer ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  } ${hasFieldError("approved_by") ? "border-red-500" : ""}`}
                />
                <ErrorMessage errors={getFieldErrors("approved_by")} />
              </div>

              <div className="space-y-2">
                <Label>Transaction Amount</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={totalCredit.toFixed(2)}
                  onChange={(e) => {
                    setTransAmount(e.target.value);
                    clearFieldError("trans_amount");
                  }}
                  placeholder="0.00"
                  className={
                    hasFieldError("trans_amount") ? "border-red-500" : ""
                  }
                />
                <ErrorMessage errors={getFieldErrors("trans_amount")} />
              </div>
            </div>
          </div>

          <DialogFooter className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                isSubmitting ||
                !name ||
                !particulars ||
                !refNum ||
                !refId ||
                !branchId ||
                !transactionDate ||
                !checkedBy ||
                !approvedBy ||
                !preparedBy ||
                items.length === 0 ||
                !isBalanced(items) // Add balance check to disable button
              }
            >
              {isSubmitting ? "Creating..." : "Add Entry"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* COA Dialog - Replace with your actual COA dialog component */}
      <COADialog
        open={isCOADialogOpen}
        onClose={() => setIsCOADialogOpen(false)}
        onSelect={handleSelectCOA}
        branchId={branchId} // Pass the branchId prop
      />
      {/* Branch Selection Dialog - Replace with your actual branch dialog component */}
      <BranchSelectionDialog
        open={isBranchDialogOpen}
        onClose={() => setIsBranchDialogOpen(false)}
        onSelect={handleSelectBranch}
      />

      {/* Branch User Dialog - Replace with your actual user dialog component */}
      <BranchUserDialog
        open={!!userDialogOpen}
        onClose={() => setUserDialogOpen(null)}
        onSelect={handleUserSelect}
      />

      {/* Branch info display */}
      {selectedBranch && (
        <div className="text-sm text-muted-foreground mt-2">
          {selectedBranch.code} • {selectedBranch.city}
        </div>
      )}
    </>
  );
}
