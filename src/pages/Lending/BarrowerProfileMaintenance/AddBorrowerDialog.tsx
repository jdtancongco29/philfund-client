"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Printer, Archive, CircleCheck } from 'lucide-react'
import { AddressDetailsTab } from "./tab/AddressDetailsTab"
import { AuthorizationTab } from "./tab/AuthorizationTab"
import { BasicInfoTab } from "./tab/BasicInfoTab"
import { DependentsTab } from "./tab/DependentsTab"
import { PhilfundCashCardTab } from "./tab/PhilfundCashCardTab"
import { VerificationTab } from "./tab/VerificationTab"
import { WorkInformationTab } from "./tab/WorkInformationTab"
import { toast } from "sonner"


interface AddBorrowerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export interface FormData {
  // Basic Info
  riskLevel: string
  lastName: string
  firstName: string
  middleName: string
  suffix: string
  civilStatus: string
  gender: string
  birthDate: Date | undefined
  age: string
  birthPlace: string
  maidenName: string
  nickname: string
  bloodType: string
  healthCondition: string
  dateOfDeath: Date | undefined
  spouseName: string
  spouseOccupation: string
  spouseAddress: string
  spouseContact: string
}

export interface ValidationErrors {
  [key: string]: string
}

export function AddBorrowerDialog({ open, onOpenChange }: AddBorrowerDialogProps) {
  const [activeTab, setActiveTab] = useState("basic-info")
  const [formData, setFormData] = useState<FormData>({
    riskLevel: "",
    lastName: "",
    firstName: "",
    middleName: "",
    suffix: "",
    civilStatus: "",
    gender: "",
    birthDate: undefined,
    age: "",
    birthPlace: "",
    maidenName: "",
    nickname: "",
    bloodType: "",
    healthCondition: "",
    dateOfDeath: undefined,
    spouseName: "",
    spouseOccupation: "",
    spouseAddress: "",
    spouseContact: "",
  })
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})

  const validateBasicInfo = (): boolean => {
    const errors: ValidationErrors = {}

    // Required field validations
    if (!formData.lastName.trim()) {
      errors.lastName = "Last Name is required"
    }
    if (!formData.firstName.trim()) {
      errors.firstName = "First Name is required"
    }
    if (!formData.middleName.trim()) {
      errors.middleName = "Middle Name is required"
    }
    if (!formData.civilStatus) {
      errors.civilStatus = "Civil Status is required"
    }
    if (!formData.gender) {
      errors.gender = "Gender is required"
    }
    if (!formData.birthDate) {
      errors.birthDate = "Birth Date is required"
    }
    if (!formData.maidenName.trim()) {
      errors.maidenName = "Maiden Name is required"
    }
    if (!formData.bloodType) {
      errors.bloodType = "Blood Type is required"
    }
    if (!formData.healthCondition) {
      errors.healthCondition = "Health Condition is required"
    }

    // Spouse information validation (if married)
    if (formData.civilStatus === "married") {
      if (!formData.spouseName.trim()) {
        errors.spouseName = "Spouse Name is required"
      }
      if (!formData.spouseOccupation.trim()) {
        errors.spouseOccupation = "Spouse Occupation is required"
      }
      if (!formData.spouseAddress.trim()) {
        errors.spouseAddress = "Spouse Address is required"
      }
      if (!formData.spouseContact.trim()) {
        errors.spouseContact = "Spouse Contact Number is required"
      }
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const validateCurrentTab = (): boolean => {
    switch (activeTab) {
      case "basic-info":
        return validateBasicInfo()
      case "dependents":
        // Add dependents validation logic here
        return true
      case "address-details":
        // Add address validation logic here
        return true
      case "work-information":
        // Add work information validation logic here
        return true
      case "authorization":
        // Add authorization validation logic here
        return true
      case "philfund-cash-card":
        // Add philfund validation logic here
        return true
      default:
        return true
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  const handleNext = () => {
    if (!validateCurrentTab()) {
          toast.warning("Validation Erro", {
        description: `Please fill in all required fields before saving.`,
        icon: <CircleCheck className="h-5 w-5" />,
        duration: 5000,
      });
      return
    }

    const tabs = [
      "basic-info",
      "dependents",
      "address-details",
      "work-information",
      "authorization",
      "philfund-cash-card",
      "verification",
    ]
    const currentIndex = tabs.indexOf(activeTab)
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1])
    }
  }

  const handleSaveForInterview = () => {
    if (!validateCurrentTab()) {
         toast.warning("Validation Erro", {
        description: `Please fill in all required fields before saving.`,
        icon: <CircleCheck className="h-5 w-5" />,
        duration: 5000,
      });
      return
    }
    
    console.log("Save for Interview", formData)
    onOpenChange(false)
  }

  const handleArchive = () => {
    console.log("Archive")
    onOpenChange(false)
  }

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }))
    // Clear validation errors for updated fields
    const updatedFields = Object.keys(updates)
    setValidationErrors(prev => {
      const newErrors = { ...prev }
      updatedFields.forEach(field => {
        delete newErrors[field]
      })
      return newErrors
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-none w-[90vw] max-w-screen-2xl h-[75vh] flex flex-col overflow-y-auto">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-xl font-bold">Add Borrowers Profile Maintenance</DialogTitle>
          <p className="text-sm text-muted-foreground">Create a new cash advance configuration for bonus loans</p>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-7 flex-shrink-0">
            <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
            <TabsTrigger value="dependents">Dependents</TabsTrigger>
            <TabsTrigger value="address-details">Address Details</TabsTrigger>
            <TabsTrigger value="work-information">Work Information</TabsTrigger>
            <TabsTrigger value="authorization">Authorization</TabsTrigger>
            <TabsTrigger value="philfund-cash-card">Philfund cash card</TabsTrigger>
            <TabsTrigger value="verification">Verification</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto px-1">
            <TabsContent value="basic-info" className="mt-0 h-full">
              <BasicInfoTab 
                formData={formData} 
                validationErrors={validationErrors}
                onUpdateFormData={updateFormData}
              />
            </TabsContent>

            <TabsContent value="dependents" className="mt-0 h-full">
              <DependentsTab />
            </TabsContent>

            <TabsContent value="address-details" className="mt-0 h-full">
              <AddressDetailsTab />
            </TabsContent>

            <TabsContent value="work-information" className="mt-0 h-full">
              <WorkInformationTab />
            </TabsContent>

            <TabsContent value="authorization" className="mt-0 h-full">
              <AuthorizationTab />
            </TabsContent>

            <TabsContent value="philfund-cash-card" className="mt-0 h-full">
              <PhilfundCashCardTab />
            </TabsContent>

            <TabsContent value="verification" className="mt-0 h-full">
              <VerificationTab />
            </TabsContent>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t flex-shrink-0">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            {activeTab === "verification" ? (
              <>
                <Button variant="outline">
                  <Printer className="h-4 w-4 mr-2" />
                  Print Specimen card
                </Button>
                <Button onClick={handleSaveForInterview}>Save for Interview</Button>
                <Button variant="destructive" onClick={handleArchive}>
                  <Archive className="h-4 w-4 mr-2" />
                  Archive
                </Button>
              </>
            ) : (
              <Button onClick={handleNext}>Next</Button>
            )}
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
