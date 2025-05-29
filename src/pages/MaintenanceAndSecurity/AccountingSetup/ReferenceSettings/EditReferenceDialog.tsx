import React, { useEffect, useState } from "react";
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
import { ModuleSelectionDialog } from "./ModuleSelectionDialog";

// Form validation schema interface
interface FormSchema {
  code: string;
  name: string;
  module_id: string;
  status: boolean;
}

// Validation function
const validateForm = (values: FormSchema): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!values.code) {
    errors.code = "Reference code is required.";
  } else if (values.code.length !== 2) {
    errors.code = "Reference code must be exactly 2 characters.";
  }

  if (!values.name) {
    errors.name = "Reference name is required.";
  } else if (values.name.length < 3) {
    errors.name = "Reference name must be at least 3 characters.";
  } else if (values.name.length > 50) {
    errors.name = "Reference name must not be greater than 50 characters.";
  }

  if (!values.module_id) {
    errors.module_id = "Please select a module.";
  }

  return errors;
};

export type FormValues = FormSchema;

interface Module {
  id: string;
  name: string;
}

interface EditReferenceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: FormValues) => Promise<void>;
  
  onReset: boolean;
  initialValues?: FormValues | null;
  modules: Module[];
}

export function EditReferenceDialog({
  open,
  onOpenChange,
  onSubmit,
  onReset,
  initialValues,
  modules,
}: EditReferenceDialogProps) {
  const [formValues, setFormValues] = useState<FormValues>({
    code: "",
    name: "",
    module_id: "",
    status: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = Boolean(initialValues);

  // Reset form when dialog opens or initialValues change
  useEffect(() => {
    if (open) {
      const resetValues = initialValues || {
        code: "",
        name: "",
        module_id: "",
        status: true,
      };

      setFormValues(resetValues);
      setErrors({});
    }
  }, [initialValues, open]);

  // Handle reset trigger
  useEffect(() => {
    if (onReset) {
      setFormValues({
        code: "",
        name: "",
        module_id: "",
        status: true,
      });
      setErrors({});
    }
  }, [onReset]);

  const handleInputChange = (
    field: keyof FormValues,
    value: string | boolean
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

    const validationErrors = validateForm(formValues);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      setErrors({});
      await onSubmit(formValues);
      setFormValues({
        code: "",
        name: "",
        module_id: "",
        status: true,
      });
      onOpenChange(false);
    } catch (error: any) {
      const response = error.response?.data || error;
      if (response?.errors) {
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
      module_id: "",
      status: true,
    });
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {isEditMode ? "Edit Reference" : "Add New Reference"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {errors.root && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{errors.root}</p>
            </div>
          )}

          {/* Reference Code Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">
              Reference Code <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Enter 2-character reference code"
              maxLength={2}
              value={formValues.code}
              onChange={(e) => handleInputChange("code", e.target.value)}
              className={errors.code ? "border-red-500" : ""}
            />
            <p className="text-sm text-gray-600">
              A unique code to identify this reference
            </p>
            {errors.code && (
              <p className="text-sm text-red-600">{errors.code}</p>
            )}
          </div>

          {/* Reference Name Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">
              Reference Name <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Enter reference name"
              value={formValues.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={errors.name ? "border-red-500" : ""}
            />
            <p className="text-sm text-gray-600">
              The full name of the reference
            </p>
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Module Dropdown */}
            <div className="space-y-2">
            <label className="text-sm font-medium leading-none">
              Module <span className="text-red-500">*</span>
            </label>
            <Select<{ value: string; label: string }>
              value={
                modules
                  .map((mod) => ({ value: mod.id, label: mod.name }))
                  .find((option) => option.value === formValues.module_id) || null
              }
              onChange={(selectedOption) =>
                handleInputChange(
                  "module_id",
                  selectedOption ? selectedOption.value : ""
                )
              }
              options={modules.map((mod) => ({
                value: mod.id,
                label: mod.name,
              }))}
              placeholder="Select a module..."
              classNamePrefix={errors.module_id ? "react-select-error" : "react-select"}
            />
            {errors.module_id && (
              <p className="text-sm text-red-600">{errors.module_id}</p>
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
                : "Add Reference"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
