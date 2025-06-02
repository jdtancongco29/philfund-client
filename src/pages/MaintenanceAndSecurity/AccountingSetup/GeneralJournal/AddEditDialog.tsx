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
import { apiRequest, getBranchId } from "@/lib/api";
import { BranchSelectionDialog } from "./BranchSelectionDialog";
import Select from "react-select";

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

interface GeneralJournalEntry {
  id?: string;
  name: string;
  particulars?: string;
  ref: {
    id: string;
    code: string;
    number: number;
  };
  trans_amount: string;
  transaction_date: string;
  status: boolean;
  branch: {
    id: string;
    name: string;
  };
  prepared_by: {
    id: string;
    name: string;
  };
  checked_by: {
    id: string;
    name: string;
  };
  approved_by: {
    id: string;
    name: string;
  };

  items?: Array<{
    id: string;
    coa: {
      id: string;
      code: string;
      name: string;
    };
    debit: number;
    credit: number;
  }>;
}

// API Response interfaces based on your sample
interface ApiGeneralJournalEntry {
  id: string;
  ref: {
    id: string;
    code: string;
    number: number;
  };
  branch: {
    id: string;
    name: string;
  };
  bank: any;
  particulars: string;
  name: string;
  transaction_date: string;
  trans_amount: string;
  prepared_by: {
    id: string;
    name: string;
  };
  checked_by: {
    id: string;
    name: string;
  };
  approved_by: {
    id: string;
    name: string;
  };
  status: boolean;
  items: Array<{
    id: string;
    ref: {
      id: string;
      code: string;
      number: number;
    };
    branch: {
      id: string;
      name: string;
    };
    coa: {
      id: string;
      code: string;
      name: string;
    };
    bank: any;
    transaction_date: string;
    credit: string;
    debit: string;
    status: boolean;
  }>;
}

interface AddEditEntryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: GeneralJournalEntry) => void;
  editingEntry?: GeneralJournalEntry | null;
  apiEntry?: ApiGeneralJournalEntry | null; // Add this for the API response
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
  editingEntry,
  apiEntry,
}: AddEditEntryDialogProps) {
  const [name, setName] = useState("");
  const [particulars, setParticulars] = useState("");
  const [refNum, setRefNum] = useState("");
  const [refId, setRefId] = useState("");
  const [refCode, setRefCode] = useState("");
  const [branchId, setBranchId] = useState("");
  const [transactionDate, setTransactionDate] = useState("");
  const [, setTransAmount] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [branchUsers, setBranchUsers] = useState<BranchUser[]>([]);
  const [chartOfAccounts, setChartOfAccounts] = useState<ChartOfAccount[]>([]);
  const [loadingCOA, setLoadingCOA] = useState(false);

  // Error state
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );

  // User selection states
  const [preparedBy, setPreparedBy] = useState<BranchUser | null>(null);
  const [checkedBy, setCheckedBy] = useState<BranchUser | null>(null);
  const [approvedBy, setApprovedBy] = useState<BranchUser | null>(null);

  // Branch selection states
  const [isBranchDialogOpen, setIsBranchDialogOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  const isEditMode = !!(editingEntry || apiEntry);

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

  // Helper function to clear all branch-specific dynamic data
  const clearBranchSpecificData = () => {
    // Clear all items (COA selections are branch-specific)
    setItems([]);

    // Clear all user selections (users are branch-specific)
    setPreparedBy(null);
    setCheckedBy(null);
    setApprovedBy(null);

    // Clear validation errors related to cleared data
    setValidationErrors((prev) => {
      const newErrors = { ...prev };
      // Remove item-related errors
      Object.keys(newErrors).forEach((key) => {
        if (
          key.startsWith("items") ||
          key === "prepared_by" ||
          key === "checked_by" ||
          key === "approved_by"
        ) {
          delete newErrors[key];
        }
      });
      return newErrors;
    });
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
    } finally {
      setLoadingCOA(false);
    }
  };

  const fetchReferenceNumber = async () => {
    try {
      const response = await apiRequest(
        "get",
        "/reference/number/?module_code=general_journal",
        null,
        {
          useAuth: true,
          useBranchId: true,
        }
      );
      const { ref_num, ref_code, ref_id } = response.data.data;
      setRefId(ref_id);
      setRefCode(ref_code);
      setRefNum(ref_num.toString());
    } catch (error) {
      console.error("Failed to fetch reference number:", error);
    }
  };

  const fetchBranchUsers = async () => {
    try {
      const response = await apiRequest<{ data: { users: BranchUser[] } }>(
        "get",
        "/branch/users",
        null,
        {
          useAuth: true,
          useBranchId: true,
        }
      );
      setBranchUsers(response.data.data.users);
    } catch (error) {
      console.error("Error fetching branch users:", error);
    }
  };

  // Populate form when editing or reset for new entry
  useEffect(() => {
    if (isOpen) {
      setValidationErrors({});
      fetchBranchUsers();
      fetchChartOfAccounts(); // Add this line

      // Use apiEntry if available, otherwise use editingEntry
      const entryData = apiEntry || editingEntry;

      if (entryData) {
        // Handle API response format
        if (apiEntry) {
          setName(apiEntry.name || "");
          setParticulars(apiEntry.particulars || "");
          setRefNum(apiEntry.ref.number.toString());
          setRefId(apiEntry.ref.id);
          setRefCode(apiEntry.ref.code || ""); // Add this line to set the reference code
          setBranchId(apiEntry.branch.id);

          // Format date from API response
          const dateStr = apiEntry.transaction_date;
          if (dateStr) {
            // Convert from "2025-05-21T16:00:00.000000Z" to "2025-05-21"
            const date = new Date(dateStr);
            const formattedDate = date.toISOString().split("T")[0];
            setTransactionDate(formattedDate);
          }

          setTransAmount(apiEntry.trans_amount || "");

          // Convert API items to form format
          const formattedItems =
            apiEntry.items?.map((item) => ({
              id: item.id,
              coa_id: item.coa.id,
              coa_name: item.coa.name,
              debit: item.debit,
              credit: item.credit,
            })) || [];
          setItems(formattedItems);

          // Set users from API response
          setPreparedBy({
            id: apiEntry.prepared_by.id,
            name: apiEntry.prepared_by.name,
          });
          setCheckedBy({
            id: apiEntry.checked_by.id,
            name: apiEntry.checked_by.name,
          });
          setApprovedBy({
            id: apiEntry.approved_by.id,
            name: apiEntry.approved_by.name,
          });

          // Set branch from API response
          setSelectedBranch({
            id: apiEntry.branch.id,
            name: apiEntry.branch.name,
            code: "",
            email: "",
            address: "",
            contact: "",
            city: "",
            status: true,
            departments: [],
          });
        } else if (editingEntry) {
          // Handle editingEntry format (if different)
          setName(editingEntry.name || "");
          setParticulars(editingEntry.particulars || "");
          setRefNum(editingEntry.ref.number.toString());
          setRefId(editingEntry.ref.id);
          setRefCode(editingEntry.ref.code || ""); // Add this line to set the reference code
          setBranchId(editingEntry.branch.id || "");
          setTransactionDate(editingEntry.transaction_date || "");
          setTransAmount(editingEntry.trans_amount || "");

          // Convert items to the format expected by the form
          const formattedItems =
            editingEntry.items?.map((item) => ({
              id: item.id,
              coa_id: item.coa.id,
              coa: {
                id: item.coa.id,
                code: item.coa.code,
                name: item.coa.name,
              },
              debit: item.debit.toString(),
              credit: item.credit.toString(),
            })) || [];
          setItems(formattedItems);

          // Set users (you might need to fetch user details by ID)
          if (editingEntry.prepared_by) {
            setPreparedBy(
              typeof editingEntry.prepared_by === "string"
                ? { id: editingEntry.prepared_by, name: "Loading..." }
                : editingEntry.prepared_by
            );
          }
          if (editingEntry.checked_by) {
            setCheckedBy(
              typeof editingEntry.checked_by === "string"
                ? { id: editingEntry.checked_by, name: "Loading..." }
                : editingEntry.checked_by
            );
          }
          if (editingEntry.approved_by) {
            setApprovedBy(
              typeof editingEntry.approved_by === "string"
                ? { id: editingEntry.approved_by, name: "Loading..." }
                : editingEntry.approved_by
            );
          }

          // Set branch
          if (editingEntry.branch.id) {
            setSelectedBranch({
              id: editingEntry.branch.id,
              name: editingEntry.branch.name,
              code: "",
              email: "",
              address: "",
              contact: "",
              city: "",
              status: true,
              departments: [],
            });
          }
        }
      } else {
        // Reset form for new entry
        resetForm();
        fetchReferenceNumber();
      }
    }
  }, [isOpen, editingEntry, apiEntry]);

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

  const handleSelectBranch = (branch: Branch) => {
    const isChangingBranch = selectedBranch && selectedBranch.id !== branch.id;

    // If changing branch (not initial selection), clear branch-specific data
    if (isChangingBranch) {
      clearBranchSpecificData();
    }

    setSelectedBranch(branch);
    setBranchId(branch.id);
    clearFieldError("branch_id");
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

  const saveGeneralJournalEntry = async (payload: any) => {
    try {
      setIsSubmitting(true);

      const method = isEditMode ? "put" : "post";
      const entryId = apiEntry?.id || editingEntry?.id;
      const url = isEditMode
        ? `/general-journal/${entryId}`
        : "/general-journal";

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
        toast.error(
          `Error ${isEditMode ? "updating" : "creating"} General Journal`,
          {
            description: "An unexpected error occurred. Please try again.",
            duration: 5000,
          }
        );
      }

      console.error(
        `Failed to ${isEditMode ? "update" : "create"} general journal entry:`,
        error
      );
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalCredit = calculateTotalCredit(items);
  const cookieBranchId = getBranchId();
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
    const formattedTransactionDate =
      transactionDate?.split("T")[0] || transactionDate;
    if (
      name &&
      particulars &&
      refNum &&
      refId &&
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
          branch_id: cookieBranchId || branchId,
          transaction_date:
            formattedTransactionDate || new Date().toISOString().slice(0, 10),
          checked_by: checkedBy.id,
          approved_by: approvedBy.id,
          prepared_by: preparedBy.id,
          trans_amount: totalCredit,
          items: items.map((item) => ({
            ...(item.id && { id: item.id }), // Include existing item ID when editing
            coa_id: item.coa?.id || item.coa_id,
            debit: Number.parseFloat(item.debit) || 0,
            credit: Number.parseFloat(item.credit) || 0,
          })),
        };

        const result = await saveGeneralJournalEntry(payload);

        // Pass the result to parent component
        onSave({
          ...result,
          id: apiEntry?.id || editingEntry?.id || result.id,
          name,
          particulars,
          ref: {
            id: refId,
            code: refNum,
            number: Number(refNum),
          },
          trans_amount: totalCredit.toString(),
          transaction_date: transactionDate,
          status: true,
          branch_id: branchId,
        });

        resetForm();
        onClose();

        toast.success(`General Journal ${isEditMode ? "Updated" : "Created"}`, {
          description: `General Journal has been successfully ${
            isEditMode ? "updated" : "created"
          }.`,
          icon: <CircleCheck className="h-5 w-5" />,
          duration: 5000,
        });

        console.log(
          `General journal entry ${
            isEditMode ? "updated" : "created"
          } successfully:`,
          result
        );
      } catch (error) {
        // Error handling is done in saveGeneralJournalEntry
        console.error(
          `Error ${
            isEditMode ? "updating" : "creating"
          } general journal entry:`,
          error
        );
      }
    }
  };
  const formattedDate = transactionDate
    ? new Date(transactionDate).toISOString().slice(0, 10)
    : "";
  const handleClose = () => {
    resetForm();
    onClose();
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
  const getSelectedAccountIds = (): string[] => {
    return items
      .map((item) => item.coa_id || item.coa?.id)
      .filter(Boolean) as string[];
  };

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
  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[900px]  ">
          <div className="max-h-[85vh] overflow-y-auto pr-2 mt-4">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                {isEditMode
                  ? "View General Journal"
                  : "Add New General Journal"}
              </DialogTitle>
            </DialogHeader>

                      <p className="text-xs text-gray-600 mt-1">
              Create a new general journal entry setting that will be available on this current branch
            </p>
            <h3 className="tex font-semibold mt-6">General Info</h3>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                  <Label>
                    Reference Code <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={refCode}
                    readOnly
                    placeholder="Reference ID"
                    disabled={isEditMode || isSubmitting}
                    className={hasFieldError("ref_id") ? "border-red-500" : ""}
                  />
                            <p className="text-xs text-gray-600 mt-1">
              Auto-generated reference Code
            </p>
                  <ErrorMessage errors={getFieldErrors("ref_id")} />
                </div>
                <div className="space-y-2">
                  <Label>
                    Reference Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="number"
                    value={refNum}
                    readOnly={!isEditMode}
                    onChange={
                      isEditMode
                        ? (e) => {
                            setRefNum(e.target.value);
                            clearFieldError("ref_num");
                          }
                        : undefined
                    }
                    placeholder="Reference Number"
                    disabled={isEditMode || isSubmitting}
                    className={hasFieldError("ref_num") ? "border-red-500" : ""}
                  />
                                 <p className="text-xs text-gray-600 mt-1">
              Auto-generated reference number
            </p>
                  <ErrorMessage errors={getFieldErrors("ref_num")} />
                </div>
               

                <div className="space-y-2">
                  <Label>
                    Transaction Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="date"
                    value={
                      formattedDate || new Date().toISOString().slice(0, 10)
                    }
                    onChange={(e) => {
                      setTransactionDate(e.target.value);
                      clearFieldError("transaction_date");
                    }}
                    disabled={isEditMode || isSubmitting}
                    className={
                      hasFieldError("transaction_date") ? "border-red-500" : ""
                    }
                  />
                  <p className="text-xs text-gray-600 mt-1">
              The date of the transaction
            </p>
                  <ErrorMessage errors={getFieldErrors("transaction_date")} />
                </div>

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
              A descriptive name for this journal entry
            </p>
                  <ErrorMessage errors={getFieldErrors("name")} />
                </div>

                <div className="hidden">
                  <input
                    type="hidden"
                    name="branch_id"
                    value={
                      selectedBranch
                        ? selectedBranch.id
                        : branchId || cookieBranchId
                    }
                  />
                  <ErrorMessage errors={getFieldErrors("branch_id")} />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label>
                    Particulars <span className="text-red-500">*</span>
                  </Label>
                  <textarea
                    value={particulars}
                    onChange={(e) => {
                      setParticulars(e.target.value);
                      clearFieldError("particulars");
                    }}
                    placeholder="Enter the reason or purpose of this general journal entry."
                    disabled={isEditMode || isSubmitting}
                    className={`block w-full rounded border px-3 py-2 ${
                      hasFieldError("particulars") ? "border-red-500" : ""
                    }`}
                    rows={4}
                  />
                  <ErrorMessage errors={getFieldErrors("particulars")} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4 mt-20">
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
                <div className="border border-gray-300 rounded-md">
                  {/* Header Row */}
                  <div className="grid grid-cols-5 gap-3 px-2 py-2 text-xs font-medium text-gray-600 border-b">
                    <div className="col-span-1">Account Code</div>
                    <div className="col-span-2 text-left ml-15">
                      Account Name
                    </div>
                    <div className="col-span-1 text-left ml-5">Debit</div>
                    <div className="col-span-1 text-left ml-5">Credit</div>
                    <div className="col-span-1"></div>
                  </div>

                  {/* Table Rows */}
                  {items.map((item, index) => {
                    const availableAccounts =
                      getAvailableAccountsForItem(index);

                    return (
                      <div
                        key={index}
                        className="grid grid-cols-5 gap-2 px-2 py-2 border-b last:border-b-0"
                      >
                        {/* Account Code Dropdown */}
                        <div className="space-y-1">
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
                                fontSize: "12px",
                                minWidth: "120%",
                              }),
                              menu: (base) => ({
                                ...base,
                                fontSize: "12px",
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
                        <div className="space-y-1 ml-15">
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
                                fontSize: "12px",
                                minWidth: "190%",
                              }),
                              menu: (base) => ({
                                ...base,
                                fontSize: "12px",
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
                            className="text-center text-xs   w-4/5 ml-25"
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
                            className="text-center text-xs w-4/5 ml-25"
                          />
                        </div>

                        {/* Remove Button */}
                        <div className="flex justify-center ml-10">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(index)}
                            disabled={isEditMode || isSubmitting}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1"
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

                        {/* Item-level Errors */}
                        {getFieldErrors(`items.${index}`).length > 0 && (
                          <div className="col-span-5 mt-1">
                            <ErrorMessage
                              errors={getFieldErrors(`items.${index}`)}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Totals Row */}
                <div className="grid grid-cols-5 gap-4 py-3 border-t-2 border-gray-300 font-semibold">
                  <div className="col-span-2">Totals</div>
                  <div className="text-center ml-45">
                    {calculateTotalDebit(items).toFixed(2)}
                  </div>
                  <div className="text-center ml-45">
                    {calculateTotalCredit(items).toFixed(2)}
                  </div>
                  <div></div>
                </div>
              </div>

              {/* Approval Section */}
              <div className="mt-8 space-y-6">
                <h3 className="text-lg font-semibold">Approval</h3>

                <div className="space-y-6">
                  {/* Prepared By */}
                  <div className="space-y-2">
                    <Label className="font-medium">
                      Prepared By <span className="text-red-500">*</span>
                    </Label>
                    <Select<{ value: string; label: string }>
                      value={
                        preparedBy
                          ? { value: preparedBy.id, label: preparedBy.name }
                          : null
                      }
                      onChange={(selectedOption) => {
                        if (selectedOption) {
                          setPreparedBy({
                            id: selectedOption.value,
                            name: selectedOption.label,
                          });
                          clearFieldError("prepared_by");
                        } else {
                          setPreparedBy(null);
                        }
                      }}
                      options={branchUsers.map((user) => ({
                        value: user.id,
                        label: user.name,
                      }))}
                      placeholder="Select..."
                      classNamePrefix={
                        hasFieldError("prepared_by")
                          ? "react-select-error"
                          : "react-select"
                      }
                      isDisabled={isEditMode || isSubmitting}
                    />
                    <p className="text-sm text-gray-500">
                      The user who prepared this journal entry
                    </p>
                    <ErrorMessage errors={getFieldErrors("prepared_by")} />
                  </div>

                  {/* Checked By */}
                  <div className="space-y-2">
                    <Label className="font-medium">Checked By</Label>
                    <Select<{ value: string; label: string }>
                      value={
                        checkedBy
                          ? { value: checkedBy.id, label: checkedBy.name }
                          : null
                      }
                      onChange={(selectedOption) => {
                        if (selectedOption) {
                          setCheckedBy({
                            id: selectedOption.value,
                            name: selectedOption.label,
                          });
                          clearFieldError("checked_by");
                        } else {
                          setCheckedBy(null);
                        }
                      }}
                      options={branchUsers.map((user) => ({
                        value: user.id,
                        label: user.name,
                      }))}
                      placeholder="Select..."
                      classNamePrefix={
                        hasFieldError("checked_by")
                          ? "react-select-error"
                          : "react-select"
                      }
                      isDisabled={isEditMode || isSubmitting}
                    />
                    <p className="text-sm text-gray-500">
                      The user who checked this journal entry (optional)
                    </p>
                    <ErrorMessage errors={getFieldErrors("checked_by")} />
                  </div>

                  {/* Approved By */}
                  <div className="space-y-2">
                    <Label className="font-medium">Approved By</Label>
                    <Select<{ value: string; label: string }>
                      value={
                        approvedBy
                          ? { value: approvedBy.id, label: approvedBy.name }
                          : null
                      }
                      onChange={(selectedOption) => {
                        if (selectedOption) {
                          setApprovedBy({
                            id: selectedOption.value,
                            name: selectedOption.label,
                          });
                          clearFieldError("approved_by");
                        } else {
                          setApprovedBy(null);
                        }
                      }}
                      options={branchUsers.map((user) => ({
                        value: user.id,
                        label: user.name,
                      }))}
                      placeholder="Select..."
                      classNamePrefix={
                        hasFieldError("approved_by")
                          ? "react-select-error"
                          : "react-select"
                      }
                      isDisabled={isEditMode || isSubmitting}
                    />
                    <p className="text-sm text-gray-500">
                      The user who approved this journal entry (optional)
                    </p>
                    <ErrorMessage errors={getFieldErrors("approved_by")} />
                  </div>
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
                    !refNum ||
                    !refId ||
                    !checkedBy ||
                    !approvedBy ||
                    !preparedBy ||
                    items.length === 0 ||
                    !isBalanced(items)
                  }
                >
                  {isSubmitting ? "Save" : "Save"}
                </Button>
              )}
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Branch Selection Dialog */}
      <BranchSelectionDialog
        open={isBranchDialogOpen}
        onClose={() => setIsBranchDialogOpen(false)}
        onSelect={handleSelectBranch}
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
