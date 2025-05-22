import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"


const formSchema = z.object({
  code: z.string().length(2, "Reference code must be exactly 2 characters."),
  name: z.string()
    .min(3, { message: "Reference name must be at least 3 characters." })
    .max(50, { message: "Reference name must not be greater than 50 characters." }),
  module_id: z.string().uuid({ message: "Please select a module." }),
  status: z.boolean(),
})

export type FormValues = z.infer<typeof formSchema>

interface Module {
  id: string
  name: string
}

interface EditCOADialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: FormValues) => Promise<void> 
  onReset: boolean
  initialValues?: FormValues | null
  modules: Module[]
}

export function EditCOADialog({
  open,
  onOpenChange,
  onSubmit,
  onReset,
  initialValues,
  modules,
}: EditCOADialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      name: "",
      module_id: "",
      status: true,
    },
  })

  const isEditMode = Boolean(initialValues)

  const [moduleDialogOpen, setModuleDialogOpen] = useState(false)
  const [selectedModuleName, setSelectedModuleName] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  
  useEffect(() => {
    if (open) {
      form.reset(initialValues || {
        code: "",
        name: "",
        module_id: "",
        status: true,
      })

      if (initialValues?.module_id) {
        const foundModule = modules.find(mod => mod.id === initialValues.module_id)
        setSelectedModuleName(foundModule ? foundModule.name : "")
      } else {
        setSelectedModuleName("")
      }

      setTimeout(() => {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur()
        }
      }, 0)
    }
  }, [initialValues, open, form, modules])


  useEffect(() => {
    form.reset()
    setSelectedModuleName("")
  }, [onReset])

  async function handleSubmit(values: FormValues) {
    setIsSubmitting(true)
    
    try {
 
      form.clearErrors()
      
      const result = await onSubmit(values)

      form.reset()
      setSelectedModuleName("")
      onOpenChange(false)
      
    } catch (error: any) {
      console.log("Caught error:", error) // Debug log
      

      const response = error.response?.data || error
      
      if (response?.errors) {

        for (const [field, messages] of Object.entries(response.errors)) {
          form.setError(field as keyof FormValues, {
            type: "server",
            message: Array.isArray(messages) ? messages[0] : String(messages),
          })
        }
      } else if (response?.message) {

        form.setError("root", {
          type: "server",
          message: response.message,
        })
      } else if (typeof error === 'string') {
    
        form.setError("root", {
          type: "server",
          message: error,
        })
      } else {

        form.setError("root", {
          type: "server",
          message: "An unexpected error occurred. Please try again.",
        })
      }
      
      console.log("Form errors after setting:", form.formState.errors) 
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    form.reset()
    setSelectedModuleName("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {isEditMode ? "Edit Reference" : "Add New Reference"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 py-4">
            {form.formState.errors.root && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{form.formState.errors.root.message}</p>
              </div>
            )}


            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Reference Code <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter 2-character reference code"
                      autoFocus={false}
                      maxLength={2}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>A unique code to identify this reference</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />


            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Reference Name <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter reference name" {...field} />
                  </FormControl>
                  <FormDescription>The full name of the reference</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="module_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Module <span className="text-red-500">*</span>
                  </FormLabel>

                  <div className="flex items-center space-x-3">
                    <Button type="button" onClick={() => setModuleDialogOpen(true)}>
                      {selectedModuleName ? "Change Module" : "Select Module"}
                    </Button>
                    <div className="flex-1">
                      {selectedModuleName ? (
                        <div className="p-2 bg-gray-50 rounded border">
                          <span className="font-medium text-sm text-gray-700">Selected:</span>
                          <span className="ml-2 font-semibold">{selectedModuleName}</span>
                        </div>
                      ) : (
                        <span className="text-gray-500 italic">No module selected</span>
                      )}
                    </div>
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />

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
                {isSubmitting ? "Saving..." : (isEditMode ? "Save Changes" : "Add Reference")}
              </Button>
            </DialogFooter>
          </form>
        </Form>

        {/* Module Selection Dialog */}
        
      </DialogContent>
    </Dialog>
  )
}