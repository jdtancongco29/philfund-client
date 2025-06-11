"use client";

import type React from "react";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Select from "react-select";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/api";
import { Switch } from "@/components/ui/switch";

// Form validation schema interface
interface FormSchema {
  code: string;
  name: string;
  address: string;
  branch_id: string;
  branch_name: string;
  coa_name: string;
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

interface ChartOfAccount {
  id: string;
  code: string;
  name: string;
  description: string;
  major_classification: string;
  category: string;
  is_header: boolean;
  parent_id: string | null;
  is_contra: boolean;
  normal_balance: string;
  special_classification: string;
  status: boolean;
}

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
    branch_name: "",
    coa_name: "",
    coa_id: "",
    account_type: "",
    status: 1,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [chartOfAccounts, setChartOfAccounts] = useState<ChartOfAccount[]>([]);
  const [loadingBranches, setLoadingBranches] = useState(false);
  const [loadingCOA, setLoadingCOA] = useState(false);
  const isEditMode = Boolean(initialValues);

  // Fetch branches
  const fetchBranches = async () => {
    setLoadingBranches(true);
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
      setBranches(response.data.data.branches);
    } catch (error) {
      console.error("Error fetching branches:", error);
    } finally {
      setLoadingBranches(false);
    }
  };

  // Fetch chart of accounts
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

  // Reset form when dialog opens or initialValues change
  useEffect(() => {
    if (open) {
      const resetValues = initialValues || {
        code: "",
        name: "",
        address: "",
        branch_id: "",
        branch_name: "",
        coa_name: "",
        coa_id: "",
        account_type: "",
        status: 1,
      };

      setFormValues(resetValues);
      setErrors({});

      // Fetch data when dialog opens
      fetchBranches();
      fetchChartOfAccounts();

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
        branch_name: "",
        coa_name: "",
        coa_id: "",
        account_type: "",
        status: 1,
      });
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
        branch_name: "",
        coa_name: "",
        coa_id: "",
        account_type: "",
        status: 1,
      });
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
      branch_name: "",
      coa_name: "",
      coa_id: "",
      account_type: "",
      status: 1,
    });
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[700px] max-h-[90vh] overflow-hidden p-7"
        aria-describedby={undefined}
      >
        <div className="max-h-[85vh] overflow-y-auto pr-2 ">
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

            {/* Bank Code */}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                Bank Code <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Enter bank code (e.g., BANK-002)"
                value={formValues.code}
                onChange={(e) => handleInputChange("code", e.target.value)}
                className={`mt-1 ${errors.code ? "border-red-500" : ""}`}
              />
              <p className="text-sm text-gray-600">
                A unique code to identify this bank account
              </p>
              {errors.code && (
                <p className="text-sm text-red-600">{errors.code}</p>
              )}
            </div>

            {/* Bank Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                Bank Name <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Enter bank account name"
                value={formValues.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={`mt-1 ${errors.name ? "border-red-500" : ""}`}
              />
              <p className="text-sm text-gray-600">
                The descriptive name for this bank account
              </p>
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Bank Address */}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                Address <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Bank Address"
                value={formValues.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className={`mt-1 ${errors.address ? "border-red-500" : ""}`}
              />
              <p className="text-sm text-gray-600">
                The physical address of the bank branch
              </p>
              {errors.address && (
                <p className="text-sm text-red-600">{errors.address}</p>
              )}
            </div>

            {/* Branch Dropdown */}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none mb-2">
                Branch <span className="text-red-500">*</span>
              </label>

              <Select<{ value: string; label: string }>
                className="mt-1"
                value={
                  formValues.branch_id
                    ? branches.length > 0
                      ? branches
                          .map((branch) => ({
                            value: branch.id,
                            label: `${branch.name} - ${branch.city}`,
                          }))
                          .find(
                            (option) => option.value === formValues.branch_id
                          ) || null
                      : formValues.branch_name
                      ? {
                          value: formValues.branch_id,
                          label: formValues.branch_name,
                        }
                      : null
                    : null
                }
                onChange={(selectedOption) => {
                  const selectedBranch = branches.find(
                    (b) => b.id === selectedOption?.value
                  );
                  handleInputChange(
                    "branch_id",
                    selectedOption ? selectedOption.value : ""
                  );
                  if (selectedBranch) {
                    handleInputChange("branch_name", selectedBranch.name);
                  }
                }}
                options={branches.map((branch) => ({
                  value: branch.id,
                  label: `${branch.name} - ${branch.city}`,
                }))}
                placeholder={
                  loadingBranches ? "Loading branches..." : "Select..."
                }
                isLoading={loadingBranches}
                classNamePrefix={
                  errors.branch_id ? "react-select-error" : "react-select"
                }
              />
              {errors.branch_id && (
                <p className="text-sm text-red-600">{errors.branch_id}</p>
              )}
            </div>

            {/* COA Dropdown */}
            <div className="space-y-1">
              <label className="text-sm font-medium leading-none">
                Chart of Account <span className="text-red-500">*</span>
              </label>

              <div className="flex gap-2">
                <div className="w-1/3">
                  <Select<{ value: string; label: string }>
                    styles={{
                      control: (base) => ({
                        ...base,
                        fontSize: "12px", // 👈 Smaller text
                        minWidth: "10 0px", // 👈 Set width
                      }),
                      menu: (base) => ({
                        ...base,
                        fontSize: "12px", // 👈 Smaller text in dropdown
                      }),
                    }}
                    value={
                      formValues.coa_id
                        ? chartOfAccounts.length > 0
                          ? chartOfAccounts
                              .map((coa) => ({
                                value: coa.id,
                                label: coa.code,
                              }))
                              .find(
                                (option) => option.value === formValues.coa_id
                              ) || null
                          : null
                        : null
                    }
                    onChange={(selectedOption) => {
                      const selectedCOA = chartOfAccounts.find(
                        (c) => c.id === selectedOption?.value
                      );
                      handleInputChange(
                        "coa_id",
                        selectedOption ? selectedOption.value : ""
                      );
                      if (selectedCOA) {
                        handleInputChange("coa_name", selectedCOA.name);
                      }
                    }}
                    options={chartOfAccounts.map((coa) => ({
                      value: coa.id,
                      label: coa.code,
                    }))}
                    placeholder={loadingCOA ? "Loading..." : "Account Code"}
                    isLoading={loadingCOA}
                    classNamePrefix={
                      errors.coa_id ? "react-select-error" : "react-select"
                    }
                  />
                </div>

                <div className="w-2/3">
                  <Select<{ value: string; label: string }>
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
                    value={
                      formValues.coa_id
                        ? chartOfAccounts.length > 0
                          ? chartOfAccounts
                              .map((coa) => ({
                                value: coa.id,
                                label: `${coa.name}`,
                              }))
                              .find(
                                (option) => option.value === formValues.coa_id
                              ) || null
                          : formValues.coa_name
                          ? {
                              value: formValues.coa_id,
                              label: formValues.coa_name,
                            }
                          : null
                        : null
                    }
                    onChange={(selectedOption) => {
                      const selectedCOA = chartOfAccounts.find(
                        (c) => c.id === selectedOption?.value
                      );
                      handleInputChange(
                        "coa_id",
                        selectedOption ? selectedOption.value : ""
                      );
                      if (selectedCOA) {
                        handleInputChange("coa_name", selectedCOA.name);
                      }
                    }}
                    options={chartOfAccounts.map((coa) => ({
                      value: coa.id,
                      label: `${coa.name}`,
                    }))}
                    placeholder={
                      loadingCOA ? "Loading chart of accounts..." : "Select..,."
                    }
                    isLoading={loadingCOA}
                    classNamePrefix={
                      errors.coa_id ? "react-select-error" : "react-select"
                    }
                  />
                </div>
              </div>

              {errors.coa_id && (
                <p className="text-sm text-red-600">{errors.coa_id}</p>
              )}
            </div>

            {/* Account Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                Type of Bank Account<span className="text-red-500">*</span>
              </label>
              <select
                value={formValues.account_type}
                onChange={(e) =>
                  handleInputChange("account_type", e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-md text-sm mt-1 ${
                  errors.account_type ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select...</option>
                <option value="check account">
                  Check Account
                </option>
                <option value="savings account">Savings Account</option>
              </select>
              <p className="text-sm text-gray-600">
                The type or purpose of this bank account
              </p>
              {errors.account_type && (
                <p className="text-sm text-red-600">{errors.account_type}</p>
              )}
            </div>

            {/* Status */}
            <div className="p-3 border rounded-md">
              <label className="text-sm font-medium leading-none flex items-center gap-1 mb-2">
                Status (Active)
                <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">
                    This department is currently{" "}
                    {formValues.status ? "active" : "inactive"}.
                  </p>
                </div>
                <Switch
                  checked={Boolean(formValues.status)}
                  onCheckedChange={(checked) =>
                    handleInputChange("status", checked ? 1 : 0)
                  }
                  className="data-[state=checked]:bg-blue-500"
                />
              </div>
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
                  ? "Save Bank Account"
                  : "Add Bank Account"}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
