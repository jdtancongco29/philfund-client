import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BranchSelectionDialog } from "./BranchSelectionDialog";
import { COADialog } from "./COADialog";


// Form validation schema interface
interface FormSchema {
  code: string;
  name: string;
  address: string;
  branch_id: string;
  coa_id: string;
  account_type: string;
  status: number;
}

// Validation function
const validateForm = (values: FormSchema): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!values.code) {
    errors.code = "Bank code is required.";
  } else if (values.code.length < 3) {
    errors.code = "Bank code must be at least 3 characters.";
  } else if (values.code.length > 20) {
    errors.code = "Bank code must not exceed 20 characters.";
  }

  if (!values.name) {
    errors.name = "Bank name is required.";
  } else if (values.name.length < 3) {
    errors.name = "Bank name must be at least 3 characters.";
  } else if (values.name.length > 100) {
    errors.name = "Bank name must not exceed 100 characters.";
  }

  if (!values.address) {
    errors.address = "Bank address is required.";
  } else if (values.address.length < 5) {
    errors.address = "Bank address must be at least 5 characters.";
  } else if (values.address.length > 200) {
    errors.address = "Bank address must not exceed 200 characters.";
  }

  if (!values.branch_id) {
    errors.branch_id = "Branch is required.";
  }

  if (!values.coa_id) {
    errors.coa_id = "Chart of Account is required.";
  }

  if (!values.account_type) {
    errors.account_type = "Account type is required.";
  } else if (values.account_type.length < 3) {
    errors.account_type = "Account type must be at least 3 characters.";
  }

  return errors;
};

export type FormValues = FormSchema;

interface EditReferenceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: FormValues) => Promise<void>;
  onReset: boolean;
  initialValues?: FormValues | null;
}

export function EditBankDialog({
  open,
  onOpenChange,
  onSubmit,
  onReset,
  initialValues,
}: EditReferenceDialogProps) {
  const [formValues, setFormValues] = useState<FormValues>({
    code: "",
    name: "",
    address: "",
    branch_id: "",
    coa_id: "",
    account_type: "",
    status: 1, // Changed default to 1 (active)
  });

  

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [moduleDialogOpen, setModuleDialogOpen] = useState(false);
  const [selectedModuleName, setSelectedModuleName] = useState<string>("");
  const [showBranchDialog, setShowBranchDialog] = useState(false);
  const isEditMode = Boolean(initialValues);

useEffect(() => {
  if (open) {
    const resetValues = initialValues || {
      code: "",
      name: "",
      address: "",
      branch_id: "",
      coa_id: "",
      account_type: "",
      status: 1,
    };

    setFormValues(resetValues);
    setErrors({});

    if (initialValues?.coa_id) {
      // You may later fetch COA details to show full name
      setSelectedModuleName(formValues.coa_id); // Placeholder text
    } else {
      setSelectedModuleName("");
    }

    setTimeout(() => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    }, 0);
  }
}, [initialValues, open]);

  // Handle reset trigger
  useEffect(() => {
    if (onReset) {
      setFormValues({
        code: "",
        name: "",
        address: "",
        branch_id: "",
        coa_id: "",
        account_type: "",
        status: 1,
      });
      setSelectedModuleName("");
      setErrors({});
    }
  }, [onReset]);

  const handleInputChange = (
    field: keyof FormValues,
    value: string | number
  ) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const validationErrors = validateForm(formValues);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      setErrors({}); // Clear any previous errors

      await onSubmit(formValues);

      // Reset form on success
      setFormValues({
        code: "",
        name: "",
        address: "",
        branch_id: "",
        coa_id: "",
        account_type: "",
        status: 1,
      });
      setSelectedModuleName("");
      onOpenChange(false);
    } catch (error: any) {
      console.log("Caught error:", error);

      const response = error.response?.data || error;

      if (response?.errors) {
        // Handle server validation errors
        const serverErrors: Record<string, string> = {};
        for (const [field, messages] of Object.entries(response.errors)) {
          serverErrors[field] = Array.isArray(messages)
            ? messages[0]
            : String(messages);
        }
        setErrors(serverErrors);
      } else if (response?.message) {
        setErrors({ root: response.message });
      } else if (typeof error === "string") {
        setErrors({ root: error });
      } else {
        setErrors({ root: "An unexpected error occurred. Please try again." });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormValues({
      code: "",
      name: "",
      address: "",
      branch_id: "",
      coa_id: "",
      account_type: "",
      status: 1,
    });
    setSelectedModuleName("");
    setErrors({});
    onOpenChange(false);
  };


  type Branch = {
    id: string;
    name: string;
  };

  const [branches, setBranches] = useState<Branch[]>([]);
  useEffect(() => {
    async function fetchBranches() {
      try {
        const res = await fetch("/api/branches");
        const data = await res.json();
        setBranches(data); // Ensure data is of shape Branch[]
      } catch (err) {
        console.error("Failed to fetch branches", err);
      }
    }

    if (open) {
      fetchBranches();
    }
  }, [open]);
    
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {isEditMode ? "Edit Bank Account" : "Add New Bank Account"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {errors.root && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{errors.root}</p>
            </div>
          )}

          {/* Bank Code Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">
              Bank Code <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Enter bank code (e.g., BANK-002)"
              value={formValues.code}
              onChange={(e) => handleInputChange("code", e.target.value)}
              className={errors.code ? "border-red-500" : ""}
            />
            <p className="text-sm text-gray-600">
              A unique code to identify this bank account
            </p>
            {errors.code && (
              <p className="text-sm text-red-600">{errors.code}</p>
            )}
          </div>

          {/* Bank Name Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">
              Bank Name <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Enter bank account name"
              value={formValues.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={errors.name ? "border-red-500" : ""}
            />
            <p className="text-sm text-gray-600">
              The descriptive name for this bank account
            </p>
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Bank Address Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">
              Bank Address <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Enter bank address"
              value={formValues.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              className={errors.address ? "border-red-500" : ""}
            />
            <p className="text-sm text-gray-600">
              The physical address of the bank branch
            </p>
            {errors.address && (
              <p className="text-sm text-red-600">{errors.address}</p>
            )}
          </div>

          {/* Branch ID Field */}
          <div className="mb-4">
            <label className="text-sm font-medium leading-none">
              Branch <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2 items-center">
              <Input
                placeholder={formValues.branch_id}
                value={
                  selectedBranch?.name ||
                  branches.find((b) => b.id === formValues.branch_id)?.name ||
                  ""
                }
                disabled
                className={errors.branch_id ? "border-red-500" : ""}
              />
              <Button type="button" onClick={() => setShowBranchDialog(true)}>
                Select Branch
              </Button>
            </div>
          </div>

          <BranchSelectionDialog
            open={showBranchDialog}
            onClose={() => setShowBranchDialog(false)}
            onSelect={(branch) => {
              setSelectedBranch(branch); // for display
              handleInputChange("branch_id", branch.id); // for submission
              setShowBranchDialog(false);
            }}
          />

          {/* COA ID Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">
              Chart of Account
            </label>
            <div className="flex items-center gap-2">
              <Input
                readOnly
                placeholder="Select Chart of Account"
                value={selectedModuleName}
                className="cursor-pointer"
                onClick={() => setModuleDialogOpen(true)}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => setModuleDialogOpen(true)}
              >
                Select
              </Button>
            </div>
            {errors.coa_id && (
              <p className="text-sm text-red-600">{errors.coa_id}</p>
            )}
          </div>

          <COADialog
            open={moduleDialogOpen}
            onClose={() => setModuleDialogOpen(false)}
            onSelect={(coa) => {
              setFormValues((prev) => ({ ...prev, coa_id: coa.id }));
              setSelectedModuleName(`${coa.code} - ${coa.name}`);
              setModuleDialogOpen(false);
            }}
          />

          {/* Account Type Field */}
            <div className="space-y-2">
            <label className="text-sm font-medium leading-none">
              Account Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formValues.account_type}
              onChange={(e) => handleInputChange("account_type", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md text-sm ${
              errors.account_type ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select account type</option>
              <option value="salary funds account">Salary Funds Account</option>
            </select>
            <p className="text-sm text-gray-600">
              The type or purpose of this bank account
            </p>
            {errors.account_type && (
              <p className="text-sm text-red-600">{errors.account_type}</p>
            )}
            </div>

          {/* Status Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              value={formValues.status}
              onChange={(e) =>
                handleInputChange("status", parseInt(e.target.value))
              }
              className={`w-full px-3 py-2 border rounded-md text-sm ${
                errors.status ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value={1}>Active</option>
              <option value={0}>Inactive</option>
            </select>
            <p className="text-sm text-gray-600">
              Whether this bank account is currently active
            </p>
            {errors.status && (
              <p className="text-sm text-red-600">{errors.status}</p>
            )}
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Saving..."
                : isEditMode
                ? "Save Changes"
                : "Add Bank Account"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}