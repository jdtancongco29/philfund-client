// src/pages/Lending/LoanProcessing/Dialog/CoMakerDialog.tsx
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useState } from "react"
import { X } from "lucide-react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import type { CoMaker, Borrower } from "../Service/SalaryLoanProcessingTypes"

const coMakerSchema = z.object({
  borrower_id: z.string().min(1, "Please select a borrower"),
  address: z.string().min(1, "Address is required"),
  contact: z.string().min(1, "Contact is required"),
})

type CoMakerFormValues = z.infer<typeof coMakerSchema>

interface CoMakerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (coMaker: Omit<CoMaker, "id">) => void
  borrowers: Borrower[]
}

export function CoMakerDialog({ open, onOpenChange, onSave, borrowers }: CoMakerDialogProps) {
  const [selectedBorrowers, setSelectedBorrowers] = useState<string[]>([])

  const form = useForm<CoMakerFormValues>({
    resolver: zodResolver(coMakerSchema),
    defaultValues: {
      borrower_id: "",
      address: "",
      contact: "",
    },
  })

  const handleSubmit = (values: CoMakerFormValues) => {
    const selectedBorrower = borrowers.find((b) => b.id === values.borrower_id)
    if (selectedBorrower) {
      onSave({
        name: selectedBorrower.name,
        address: values.address,
        contact: values.contact,
      })
      form.reset()
      setSelectedBorrowers([])
      onOpenChange(false)
    }
  }

  const handleClose = () => {
    form.reset()
    setSelectedBorrowers([])
    onOpenChange(false)
  }

  const handleBorrowerSelect = (borrowerId: string) => {
    if (!selectedBorrowers.includes(borrowerId)) {
      setSelectedBorrowers([borrowerId])
      form.setValue("borrower_id", borrowerId)

      // Auto-fill address and contact from borrower data
      const borrower = borrowers.find((b) => b.id === borrowerId)
      if (borrower) {
        form.setValue("address", borrower.address)
        form.setValue("contact", borrower.phone)
      }
    }
  }

  const handleRemoveBorrower = (borrowerId: string) => {
    setSelectedBorrowers((prev) => prev.filter((id) => id !== borrowerId))
    if (form.getValues("borrower_id") === borrowerId) {
      form.setValue("borrower_id", "")
      form.setValue("address", "")
      form.setValue("contact", "")
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">New Co-maker</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="borrower_id"
              render={() => (
                <FormItem>
                  <FormLabel className="text-sm">
                    Select Borrower <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      {/* Selected borrowers display */}
                      <div className="min-h-[50px] border rounded-md p-2 bg-gray-50 flex flex-wrap gap-2 items-center">
                        {selectedBorrowers.map((borrowerId) => {
                          const borrower = borrowers.find((b) => b.id === borrowerId)
                          return borrower ? (
                            <div
                              key={borrowerId}
                              className="inline-flex items-center gap-2 bg-white border rounded-full px-3 py-1 text-sm"
                            >
                              <span>{borrower.name}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveBorrower(borrowerId)}
                                className="text-gray-500 hover:text-gray-700"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ) : null
                        })}
                        {selectedBorrowers.length === 0 && (
                          <span className="text-gray-500 text-sm">Select borrower</span>
                        )}
                      </div>

                      {/* Borrower selection dropdown */}
                      <div className="max-h-32 overflow-y-auto border rounded-md">
                        {borrowers.map((borrower) => (
                          <button
                            key={borrower.id}
                            type="button"
                            onClick={() => handleBorrowerSelect(borrower.id)}
                            className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 border-b last:border-b-0 ${
                              selectedBorrowers.includes(borrower.id) ? "bg-blue-50 text-blue-700" : ""
                            }`}
                          >
                            {borrower.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Address</FormLabel>
                  <FormControl>
                    <Input placeholder="456 Oak Ave" {...field} className="focus-visible:outline-none bg-gray-50" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Contact</FormLabel>
                  <FormControl>
                    <Input placeholder="555-987-6543" {...field} className="focus-visible:outline-none bg-gray-50" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={handleClose} type="button">
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}