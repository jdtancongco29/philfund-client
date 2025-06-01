"use client";

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
import Select from "react-select";
import { Textarea } from "@/components/ui/textarea";

interface ValidationErrors {
  [key: string]: string[];
}

interface Item {
  id?: string;
  coa_id: string;
  coa?: {
    id: string;
    code: string;
    name: string;
  };
  debit: string;
  credit: string;
}

interface ChartOfAccount {
  id: string;
  branch_id: string;
  code: string;
  name: string;
  description?: string;
  major_classification?: string;
  category?: string;
  is_header?: boolean;
  parent_id?: string | null;
  is_contra?: boolean;
  normal_balance?: string;
  special_classification?: string;
  status?: boolean;
}

interface AccountEntry {
  id?: string;
  name: string;
  particulars?: string;
  transaction_amount: string;
  status: boolean;
  details?: Array<{
    coa: {
      id: string;
      code: string;
      name: string;
    };
    debit: string;
    credit: string;
  }>;
}

interface AddEditEntryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  editingEntry?: AccountEntry | null;
}

// Utility functions for balance calculations
const calculateTotalDebit = (items: Item[]): number => {
  return items.reduce(
    (total, item) => total + (Number.parseFloat(item.debit) || 0),
    0
  );
};

const calculateTotalCredit = (items: Item[]): number => {
  return items.reduce(
    (total, item) => total + (Number.parseFloat(item.credit) || 0),
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
  if (items.length === 0) return null;
};

export default function AddEditEntryDialog({
  isOpen,
  onClose,
  onSave,
  editingEntry = null,
}: AddEditEntryDialogProps) {
  const [name, setName] = useState("");
  const [particulars, setParticulars] = useState("");
  const [transactionAmount, setTransactionAmount] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [chartOfAccounts, setChartOfAccounts] = useState<ChartOfAccount[]>([]);
  const [loadingCOA, setLoadingCOA] = useState(false);

  // Error state
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );

  const isEditMode = Boolean(editingEntry?.id);

  // Helper function to get selected account IDs from current items
  const getSelectedAccountIds = (): string[] => {
    return items
      .map((item) => item.coa_id || item.coa?.id)
      .filter(Boolean) as string[];
  };

  // Helper function to get available accounts for a specific item index
  const getAvailableAccountsForItem = (
    currentIndex: number
  ): ChartOfAccount[] => {
    const selectedIds = getSelectedAccountIds();
    const currentItemAccountId =
      items[currentIndex]?.coa_id || items[currentIndex]?.coa?.id;

    return chartOfAccounts.filter(
      (account) =>
        !selectedIds.includes(account.id) || account.id === currentItemAccountId
    );
  };

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

  const fetchChartOfAccounts = async () => {
    setLoadingCOA(true);
    try {
      const response = await apiRequest<{
        data: { chartOfAccounts: ChartOfAccount[] };
      }>("get", "/coa", null, {
        useAuth: true,
        useBranchId: true,
      });
      setChartOfAccounts(response.data.data.chartOfAccounts);
    } catch (error) {
      console.error("Error fetching chart of accounts:", error);
      toast.error("Error", {
        description: "Failed to load Chart of Accounts. Please try again.",
        duration: 3000,
      });
    } finally {
      setLoadingCOA(false);
    }
  };

  // Populate form with editing entry data
  useEffect(() => {
    if (isOpen) {
      // Clear errors when dialog opens
      setValidationErrors({});
      fetchChartOfAccounts();

      if (editingEntry) {
        setName(editingEntry.name || "");
        setParticulars(editingEntry.particulars || "");
        setTransactionAmount(editingEntry.transaction_amount || "");

        // Convert details to items format
        if (editingEntry.details && editingEntry.details.length > 0) {
          const convertedItems: Item[] = editingEntry.details.map((detail) => ({
            coa_id: detail.coa.id,
            coa: {
              id: detail.coa.id,
              code: detail.coa.code,
              name: detail.coa.name,
            },
            debit: detail.debit,
            credit: detail.credit,
          }));
          setItems(convertedItems);
        } else {
          setItems([]);
        }
      } else {
        // Reset form for new entry
        resetForm();
      }
    }
  }, [isOpen, editingEntry]);

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

    // Update transaction amount when items change
    setTimeout(() => updateTransactionAmount(), 0);
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
      // Update transaction amount when amounts change
      setTimeout(() => updateTransactionAmount(), 0);
    }
  };

  const handleAccountSelection = (
    index: number,
    selectedOption: { value: string; label: string } | null
  ) => {
    if (selectedOption) {
      const account = chartOfAccounts.find(
        (coa) => coa.id === selectedOption.value
      );
      if (account) {
        updateItem(index, "coa_id", account.id);
        const newItems = [...items];
        newItems[index] = {
          ...newItems[index],
          coa: {
            id: account.id,
            code: account.code,
            name: account.name,
          },
        };
        setItems(newItems);
      }
    } else {
      updateItem(index, "coa_id", "");
      const newItems = [...items];
      newItems[index] = {
        ...newItems[index],
        coa: undefined,
      };
      setItems(newItems);
    }
  };

  // Update transaction amount based on total credit
  const updateTransactionAmount = () => {
    const totalCredit = calculateTotalCredit(items);
    setTransactionAmount(totalCredit.toFixed(2));
  };

  const resetForm = () => {
    setName("");
    setParticulars("");
    setTransactionAmount("");
    setItems([]);
    setValidationErrors({});
  };

  const createOrUpdateEntry = async (payload: any) => {
    try {
      setIsSubmitting(true);
      const method = isEditMode ? "put" : "post";
      const url = isEditMode
        ? `/default-entry/${editingEntry?.id}`
        : "/default-entry";

      const response = await apiRequest(method, url, payload, {
        useAuth: true,
        useBranchId: true,
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
        const action = isEditMode ? "updating" : "creating";
        toast.error(`Error ${action} Default Entry`, {
          description: "An unexpected error occurred. Please try again.",
          duration: 5000,
        });
      }

      console.error(
        `Failed to ${isEditMode ? "update" : "create"} default entry:`,
        error
      );
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

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

    if (name && particulars && transactionAmount && items.length) {
      try {
        const payload = {
          name,
          particulars,
          transaction_amount: calculateTotalDebit(items).toFixed(2) || 0,
          items: items.map((item) => ({
            ...(item.id && { id: item.id }), // Include existing item ID when editing
            coa_id: item.coa?.id || item.coa_id,
            debit: Number.parseFloat(item.debit) || 0,
            credit: Number.parseFloat(item.credit) || 0,
          })),
        };

        const result = await createOrUpdateEntry(payload);

        // Pass the result to parent component
        onSave({
          ...result,
          id: isEditMode ? editingEntry?.id : result.id,
          name,
          particulars,
          transaction_amount: Number.parseFloat(transactionAmount) || 0,
        });

        resetForm();
        onClose();

        const action = isEditMode ? "Updated" : "Created";
        toast.success(`Default Entry ${action}`, {
          description: `Default entry has been successfully ${action.toLowerCase()}.`,
          icon: <CircleCheck className="h-5 w-5" />,
          duration: 5000,
        });

        console.log(
          `Default entry ${action.toLowerCase()} successfully:`,
          result
        );
      } catch (error) {
        // Error handling is done in createOrUpdateEntry
        console.error(
          `Error ${isEditMode ? "updating" : "creating"} default entry:`,
          error
        );
      }
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[900px] overflow-y-auto max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {isEditMode
              ? "View Default Journal Entry"
              : "View New Default Journal Entry"}
          </DialogTitle>
          <p className="text-sm text-gray-600 mt-1">
            {isEditMode
              ? "Edit default journal entry settings that will be available on this current branch."
              : "Create a new default journal entry settings that will be available on this current branch."}
          </p>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-1 gap-4">
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
                disabled={isEditMode || isSubmitting}
                className={hasFieldError("name") ? "border-red-500" : ""}
              />
              <p className="text-xs text-gray-600 mt-1">
                A descriptive name for this journal entry.
              </p>
              <ErrorMessage errors={getFieldErrors("name")} />
            </div>
            <div className="space-y-2">
              <Label>
                Particulars <span className="text-red-500">*</span>
              </Label>
              <Textarea
                value={particulars}
                onChange={(e) => {
                  setParticulars(e.target.value);
                  clearFieldError("particulars");
                }}
                placeholder="Enter the reason or purpose of this general journal entry."
                disabled={isEditMode || isSubmitting}
                className={hasFieldError("particulars") ? "border-red-500" : ""}
              />

              <ErrorMessage errors={getFieldErrors("particulars")} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <Label className="text-lg font-semibold">
                Journal Entry Items <span className="text-red-500">*</span>
              </Label>
              <Button
                variant="outline"
                onClick={addItem}
                disabled={isEditMode || isSubmitting}
                className="text-black-600 border-black-600"
              >
                + Add Entry
              </Button>
            </div>

            {/* Display balance validation message */}
            <BalanceValidationMessage items={items} />

            {/* Display general items errors (like balance errors) */}
            <ErrorMessage errors={getFieldErrors("items")} />

            {/* Table Header */}
            <div className="grid grid-cols-5 gap-3 mb-2 text-xs font-medium text-gray-600 border-b pb-2">
              <div className="col-span-1">Account Code</div>
              <div className="col-span-2 text-left ml-11">Account Name</div>
              <div className="col-span-1 text-center mr-4">Debit</div>
              <div className="col-span-1 text-center  mr-5">Credit</div>
              <div className="col-span-1"></div>
            </div>

            {/* Table Rows */}
            {items.map((item, index) => {
              const availableAccounts = getAvailableAccountsForItem(index);

              return (
                <div
                  key={index}
                  className="grid grid-cols-5 gap-3 py-2 border-b border-gray-100"
                >
                  {/* Account Code Dropdown */}
                  <div className="space-y-1 ">
                    <Select<{ value: string; label: string }>
                      value={
                        item.coa
                          ? {
                              value: item.coa.id,
                              label: item.coa.code,
                            }
                          : null
                      }
                      styles={{
                        control: (base) => ({
                          ...base,
                          fontSize: "12px", // 👈 Smaller text
                          minWidth: "200px", // 👈 Set width
                        }),
                        menu: (base) => ({
                          ...base,
                          fontSize: "12px", // 👈 Smaller text in dropdown
                        }),
                      }}
                      onChange={(selectedOption) => {
                        handleAccountSelection(index, selectedOption);
                      }}
                      options={availableAccounts.map((coa) => ({
                        value: coa.id,
                        label: coa.code,
                      }))}
                      placeholder="Select Account..."
                      isLoading={loadingCOA}
                      isClearable
                      classNamePrefix={
                        hasFieldError(`items.${index}.coa_id`)
                          ? "react-select-error"
                          : "react-select"
                      }
                      isDisabled={isSubmitting || isEditMode}
                    />
                    <ErrorMessage
                      errors={getFieldErrors(`items.${index}.coa_id`)}
                    />
                  </div>

                  {/* Account Name Dropdown */}
                  <div className="space-y-1 ml-10">
                    <Select<{ value: string; label: string }>
                      value={
                        item.coa
                          ? {
                              value: item.coa.id,
                              label: item.coa.name,
                            }
                          : null
                      }
                      styles={{
                        control: (base) => ({
                          ...base,
                          fontSize: "12px", // 👈 Smaller text
                          minWidth: "200px", // 👈 Set width
                        }),
                        menu: (base) => ({
                          ...base,
                          fontSize: "12px", // 👈 Smaller text in dropdown
                        }),
                      }}
                      onChange={(selectedOption) => {
                        handleAccountSelection(index, selectedOption);
                      }}
                      options={availableAccounts.map((coa) => ({
                        value: coa.id,
                        label: coa.name,
                      }))}
                      placeholder="Select Account..."
                      isLoading={loadingCOA}
                      isClearable
                      classNamePrefix={
                        hasFieldError(`items.${index}.coa_id`)
                          ? "react-select-error"
                          : "react-select"
                      }
                      isDisabled={isSubmitting || isEditMode}
                    />
                  </div>

                  {/* Debit Input */}
                  <div>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={item.debit}
                      onChange={(e) =>
                        updateItem(index, "debit", e.target.value)
                      }
                      disabled={isEditMode || isSubmitting}
                      className="text-center ml-25"
                    />
                  </div>

                  {/* Credit Input */}
                  <div>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={item.credit}
                      onChange={(e) =>
                        updateItem(index, "credit", e.target.value)
                      }
                      disabled={isEditMode || isSubmitting}
                      className="text-center ml-25"
                    />
                  </div>

                  {/* Remove Button */}
                  <div className="flex justify-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(index)}
                      disabled={isEditMode || isSubmitting}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 ml-25"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </Button>
                  </div>

                  {/* Display item-level errors spanning full width */}
                  {getFieldErrors(`items.${index}`).length > 0 && (
                    <div className="col-span-5">
                      <ErrorMessage errors={getFieldErrors(`items.${index}`)} />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Totals Row */}
            <div className="grid grid-cols-5 gap-4 py-3 border-t-2 border-gray-300 font-semibold">
              <div className="col-span-2">Totals</div>
              <div className="text-center ml-100">
                {calculateTotalDebit(items).toFixed(2)}
              </div>
              <div className="text-center">
                {calculateTotalCredit(items).toFixed(2)}
              </div>
              <div></div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            {isEditMode ? "Close" : "Cancel"}
          </Button>

          {!isEditMode && (
            <Button
              onClick={handleSubmit}
              disabled={
                isSubmitting ||
                !name ||
                !particulars ||
                items.length === 0 ||
                !isBalanced(items)
              }
            >
              {isSubmitting ? "Creating..." : "Add Entry"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
