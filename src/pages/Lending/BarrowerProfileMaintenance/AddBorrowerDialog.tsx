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

interface Dependent {
  id: string
  name: string
  birthdate: Date | undefined
}

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
  // Dependents
  dependents: Dependent[]
  // Address Details
  address: string
  province: string
  municipality: string
  barangay: string
  street: string
  place_status: string
  is_permanent: boolean
  permanent_address: string
  permanent_province: string
  permanent_municipality: string
  permanent_barangay: string
  permanent_street: string
  email: string
  contactNumber1: string
  network_provider1: string
  contctNumber2: string
  network_provider2: string
  //work information
  classification: string 
  date_of_appointment: Date | undefined
  category: string
  division: string
  district: string
  school: string
  deped_employee_id: string
  pricipal_name: string
  supervisor_name: string
  prc_id_no: string
  prc_registration_no: string
    prc_place_issued: string
  gov_valid_id_type: string
  valid_id_no: string
  gov_place_issued: string
  gov_date_issued: Date | undefined
  gov_expiration_date: Date | undefined
  bank: string
  atm_account_number: string
  atm_card_number: string
  atm_expiration_date: Date | undefined
  umid_type: string
  umid_card_no: string
  atm_bank_branch: string
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
    dependents: [
      { id: "1", name: "", birthdate: undefined },
      { id: "2", name: "", birthdate: undefined },
      { id: "3", name: "", birthdate: undefined },
    ],
    address: "",
    province: "",
    municipality: "",
    barangay: "",
    street: "", 
    place_status: "",
    is_permanent: false,
    permanent_address: "",
    permanent_province: "",
    permanent_municipality: "",
    permanent_barangay: "",
    permanent_street: "",
    email: "",
    contactNumber1: "",
    network_provider1: "",
    contctNumber2: "",
    network_provider2: "",
    classification: "",
    date_of_appointment: undefined,
    category: "",
    division: "",
    district: "",
    school: "",
    deped_employee_id: "",
    pricipal_name: "",
    supervisor_name: "",
    prc_id_no: "",
    prc_registration_no: "",
    prc_place_issued: "",
    gov_valid_id_type: "",
    valid_id_no: "",
    gov_place_issued: "",
    gov_date_issued: undefined,
    gov_expiration_date: undefined,
    bank: "",
    atm_account_number: "",
    atm_card_number: "",
    atm_expiration_date: undefined,
    umid_type: "",
    umid_card_no: "",
    atm_bank_branch: "",

  })
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})

  const validateBasicInfo = (): boolean => {
    const errors: ValidationErrors = {}

    // Required field validations
    if (!formData.riskLevel.trim()) {
      errors.riskLevel = "Risk Level is required"
    }
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

  const validateDependents = (): boolean => {
    const errors: ValidationErrors = {}

    // Check if there's at least one dependent
    if (!formData.dependents || formData.dependents.length === 0) {
      errors.dependents = "At least one dependent is required"
    } else {
      // Check if at least one dependent has a name filled
      const hasValidDependent = formData.dependents.some(dep => dep.name.trim() !== "")
      if (!hasValidDependent) {
        errors.dependents = "At least one dependent must have a name"
      }
      
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }


    const validateAddress = (): boolean => {
    const errors: ValidationErrors = {}

    
    if (!formData.address.trim()) {
      errors.address = "Address is required"
    }
     if (!formData.province.trim()) {
      errors.province = "Province is required"
    }
    if (!formData.municipality.trim()) {
      errors.municipality = "Municipality/City is required"
    }
    if (!formData.barangay.trim()) {
      errors.barangay = "Barangay is required"
    }
    if (!formData.street.trim()) {
      errors.street = "Street is required"
    }
    if (!formData.place_status.trim()) {
      errors.place_status = "Place Status is required"
    }
    if (formData.is_permanent) {
      if (!formData.permanent_address.trim()) {
        errors.permanent_address = "Permanent Address is required"
      }
      if (!formData.permanent_province.trim()) {
        errors.permanent_province = "Permanent Province is required"
      }
      if (!formData.permanent_municipality.trim()) {
        errors.permanent_municipality = "Permanent Municipality/City is required"
      }
      if (!formData.permanent_barangay.trim()) {
        errors.permanent_barangay = "Permanent Barangay is required"
      }
      if (!formData.permanent_street.trim()) {
        errors.permanent_street = "Permanent Street is required"
      }
    }
    if (!formData.email.trim()) {
      errors.email = "Email is required"
    }
    if (!formData.contactNumber1.trim()) {
      errors.contactNumber1 = "Contact Number 1 is required"
    }
    if (!formData.network_provider1.trim()) {
      errors.network_provider1 = "Network Provider 1 is required"
    }
    if (!formData.contctNumber2.trim()) {
      errors.contctNumber2 = "Contact Number 2 is required"
    }
    

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }
const validateWorkInformation = (): boolean => {
  const errors: ValidationErrors = {}

  // Employment Information
  if (!formData.classification) {
    errors.classification = "Classification Status is required"
  }
  if (!formData.date_of_appointment) {
    errors.date_of_appointment = "Date of Appointment is required"
  }
  if (!formData.category) {
    errors.category = "Category is required"
  }
  if (!formData.division) {
    errors.division = "Division is required"
  }
  if (!formData.district) {
    errors.district = "District is required"
  }
  if (!formData.school.trim()) {
    errors.school = "School is required"
  }
  if (!formData.deped_employee_id.trim()) {
    errors.deped_employee_id = "DepEd Employee ID is required"
  }
  if (!formData.pricipal_name.trim()) {
    errors.pricipal_name = "Principal Name is required"
  }
  if (!formData.supervisor_name.trim()) {
    errors.supervisor_name = "Supervisor Name is required"
  }
  if (!formData.prc_id_no.trim()) {
    errors.prc_id_no = "PRC ID No. is required"
  }
  if (!formData.prc_registration_no.trim()) {
    errors.prc_registration_no = "PRC Registration No. is required"
  }
  if (!formData.gov_valid_id_type.trim()) {
    errors.gov_valid_id_type = "Government Valid ID Type is required"
  }
  if (!formData.valid_id_no.trim()) {
    errors.valid_id_no = "Valid ID No. is required"
  }
  if (!formData.gov_place_issued.trim()) {
    errors.gov_place_issued = "Place of Issue is required"
  }
  if (!formData.gov_date_issued) {
    errors.gov_date_issued = "Date of Issue is required"
  }
  if (!formData.gov_expiration_date) {
    errors.gov_expiration_date = "Expiration Date is required"
  }
  if (!formData.atm_account_number.trim()) {
    errors.atm_account_number = "ATM Account Number is required"
  }
  if (!formData.atm_card_number.trim()) {
    errors.atm_card_number = "ATM Card Number is required"
  }
  if (!formData.atm_expiration_date) {
    errors.atm_expiration_date = "ATM Expiration Date is required"
  }
  if (!formData.umid_type.trim()) {
    errors.umid_type = "UMID Type is required"
  }
  if (!formData.umid_card_no.trim()) {
    errors.umid_card_no = "UMID Card No. is required"
  }
  if (!formData.atm_bank_branch.trim()) {
    errors.atm_bank_branch = "ATM Bank Branch is required"
  }
  if (!formData.prc_place_issued.trim()) {
    errors.prc_place_issued = "PRC Place of Issue is required" 
  }
  if (!formData.bank.trim()) {
    errors.bank = "Bank is required"
  }
  


  
  setValidationErrors(errors)
  return Object.keys(errors).length === 0
}





  const validateCurrentTab = (): boolean => {
    switch (activeTab) {
      case "basic-info":
        return validateBasicInfo()
      case "dependents":
        return validateDependents()
      case "address-details":
        return validateAddress()
      case "work-information":
        return validateWorkInformation()
      case "authorization":
        return true
      case "philfund-cash-card":
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
      toast.warning("Validation Error", {
        description: `Please fill in all required fields before proceeding.`,
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
      toast.warning("Validation Error", {
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
              <DependentsTab 
                dependents={formData.dependents}
                validationErrors={validationErrors}
                onUpdateDependents={(dependents) => updateFormData({ dependents })}
              />
            </TabsContent>

            <TabsContent value="address-details" className="mt-0 h-full">
              <AddressDetailsTab
                formData={formData} 
                validationErrors={validationErrors}
                onUpdateFormData={updateFormData}
              />
            </TabsContent>

            <TabsContent value="work-information" className="mt-0 h-full">
                    <WorkInformationTab
                formData={formData} 
                validationErrors={validationErrors}
                onUpdateFormData={updateFormData}
              />
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