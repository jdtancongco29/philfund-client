import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { apiRequest } from "@/lib/api";
import { ModuleSelectionDialog } from "./ModuleSelectionDialog";
const formSchema = z.object({
  code: z.string().min(1, "Code is required").max(2, "Code must be at most 2 characters"),
  name: z.string().min(1, "Name is required"),
  module: z.object({
    id: z.string().min(1, "Module is required"),
    name: z.string(),
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface EditReferenceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reference: { id: string; code: string; name: string; modules: string[]; module_id?: string } | null;
  onEditReference: (reference: { id: string; code: string; name: string; modules: string[] }) => void;
}

export function EditReferenceDialog({
  open,
  onOpenChange,
  reference,
  onEditReference,
}: EditReferenceDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      name: "",
      module: { id: "", name: "" },
    },
  });

  const [moduleDialogOpen, setModuleDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");

  const isEditMode = Boolean(reference);

  useEffect(() => {
    if (open && reference) {
      form.reset({
        code: reference.code,
        name: reference.name,
        module: {
          id: reference.module_id || "",
          name: reference.modules[0] || "",
        },
      });
      setGeneralError("");
      setTimeout(() => {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      }, 0);
    }
  }, [reference, open, form]);

  async function handleSubmit(values: FormValues) {
    if (!reference) return;

    setIsLoading(true);
    setGeneralError("");

    try {
      const response = await apiRequest(
        "put",
        `/reference/${reference.id}`,
        {
          code: values.code,
          name: values.name,
          module_id: values.module.id,
        },
        { useAuth: true, useBranchId: true }
      );

      const updated = response.data.data;
      onEditReference({
        id: updated.id,
        code: updated.code,
        name: updated.name,
        modules: [updated.module.name],
      });
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error updating reference:", error);

      if (error.response?.data) {
        if (error.response.data.message) {
          setGeneralError(error.response.data.message);
        }

        if (error.response.data.errors) {
          const backendErrors = error.response.data.errors;
          Object.entries(backendErrors).forEach(([key, messages]) => {
            if (form.getFieldState(key as keyof FormValues)) {
              form.setError(key as keyof FormValues, {
                message: Array.isArray(messages) ? messages[0] : String(messages),
              });
            }
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Edit Reference</DialogTitle>
          </DialogHeader>

          {generalError && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-3 mb-4">
              {generalError}
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 py-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reference Code <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input maxLength={2} {...field} onChange={(e) => field.onChange(e.target.value.slice(0, 2))} />
                    </FormControl>
                    <FormDescription>Maximum 2 characters</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reference Name <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="module"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Module Used <span className="text-red-500">*</span></FormLabel>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full text-left"
                      onClick={() => setModuleDialogOpen(true)}
                    >
                      {field.value.name || "Select a module"}
                    </Button>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-500 hover:bg-blue-600" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <ModuleSelectionDialog
        open={moduleDialogOpen}
        onClose={() => setModuleDialogOpen(false)}
        onSelect={(mod) => {
          form.setValue("module", mod, { shouldValidate: true });
          setModuleDialogOpen(false);
        }}
      />
    </>
  );
}