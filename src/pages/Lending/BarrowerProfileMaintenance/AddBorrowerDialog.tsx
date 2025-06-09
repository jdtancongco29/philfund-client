"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Printer, Archive, CircleCheck } from "lucide-react"

import { toast } from "sonner"
import type { FormData, ValidationErrors, AddBorrowerDialogProps } from "./Services/AddBorrowersTypes"
import { AddressDetailsTab } from "./tab/AddressDetailsTab"
import { AuthorizationTab } from "./tab/AuthorizationTab"
import { BasicInfoTab } from "./tab/BasicInfoTab"
import { DependentsTab } from "./tab/DependentsTab"
import { PhilfundCashCardTab } from "./tab/PhilfundCashCardTab"
import VerificationTab from "./tab/VerificationTab"
import { WorkInformationTab } from "./tab/WorkInformationTab"

import {
  createBorrowerBasicInfo,
  createBorrowerDependents,
  validateStepOneFields,
  validateStepTwoFields,
  fetchCachedBorrowerProfile,
  getCachedFormData,
} from "./Services/AddBorrowersService"
import { getBranchId, getCode } from "@/lib/api"
import { formatCachedDependents, validateCachedDependents } from "./utils/CacheDisplayUtils"

export type { ValidationErrors, FormData }

interface TabConfig {
  key: string
  label: string
  enabled: boolean
}

export function AddBorrowerDialog({ open, onOpenChange }: AddBorrowerDialogProps) {
  const [activeTab, setActiveTab] = useState("basic-info")
  const [formData, setFormData] = useState<FormData>({
    bi_risk_level: "",
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
    authorizedPersons: [],
    bankName: "",
    cardNumber: "",
    accountNumber: "",
    cardExpiryDate: undefined,
    borrowerPhoto: null,
    borrowerSignature: null,
    homeSketch: null,
    googleMapUrl: "",
    isInterviewed: false,
    interviewedBy: "",
  })

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
  const [, setIsLoading] = useState(false)
  const [borrowerId, setBorrowerId] = useState<string>("")
  const [isLoadingCache, setIsLoadingCache] = useState(false)

  // Tab configuration with enabled/disabled state
  const [tabsConfig, setTabsConfig] = useState<TabConfig[]>([
    { key: "basic-info", label: "Basic Info", enabled: true },
    { key: "dependents", label: "Dependents", enabled: false },
    { key: "address-details", label: "Address Details", enabled: false },
    { key: "work-information", label: "Work Information", enabled: false },
    { key: "authorization", label: "Authorization", enabled: false },
    { key: "philfund-cash-card", label: "Philfund Cash Card", enabled: false },
    { key: "verification", label: "Verification", enabled: false },
  ])

  // Load cached data when dialog opens
  useEffect(() => {
    if (open) {
      loadCachedData()
    }
  }, [open])

  const loadCachedData = async () => {
    try {
      setIsLoadingCache(true)

      // Fetch cached borrower profile
      const cachedResponse = await fetchCachedBorrowerProfile()

      // Check if we have cached data and determine which tabs to enable
      const enabledTabs = ["basic-info"] // Basic info is always enabled

      if (cachedResponse.status === "FETCHED" && cachedResponse.data) {
        // If we have step_1 data, enable dependents tab
        if (cachedResponse.data.step_1) {
          enabledTabs.push("dependents")
        }

        // If we have step_2 data, enable address-details tab
        if (cachedResponse.data.step_2) {
          enabledTabs.push("address-details")
        }

        // Load cached form data (includes both step_1 and step_2 if available)
        const cachedFormData = await getCachedFormData()
        if (cachedFormData) {
          setFormData((prev) => ({ ...prev, ...cachedFormData }))

          // Log the loaded dependents data for debugging
          if (cachedFormData.dependents) {
            console.log("Loaded cached dependents:", cachedFormData.dependents)
          }
        }


        // Add logic here for other steps when they become available
        // if (cachedResponse.data.step_3) {
        //   enabledTabs.push("work-information");
        // }
        // ... and so on for other steps
      }

      // Update tabs configuration
      setTabsConfig((prev) =>
        prev.map((tab) => ({
          ...tab,
          enabled: enabledTabs.includes(tab.key),
        })),
      )
    } catch (error) {
      console.error("Error loading cached data:", error)
      // If there's an error, keep only basic-info tab enabled
      setTabsConfig((prev) =>
        prev.map((tab) => ({
          ...tab,
          enabled: tab.key === "basic-info",
        })),
      )

      toast.error("Cache Load Error", {
        description: "Failed to load cached data. Starting fresh.",
        duration: 3000,
      })
    } finally {
      setIsLoadingCache(false)
    }
  }

  const validateBasicInfo = (): boolean => {
    const serviceErrors = validateStepOneFields(formData)
    const customErrors: ValidationErrors = {}

    if (!formData.bi_risk_level.trim()) {
      customErrors.riskLevel = "Risk Level is required"
    }
    if (!formData.lastName.trim()) {
      customErrors.lastName = "Last Name is required"
    }
    if (!formData.firstName.trim()) {
      customErrors.firstName = "First Name is required"
    }
    if (!formData.middleName.trim()) {
      customErrors.middleName = "Middle Name is required"
    }
    if (!formData.civilStatus) {
      customErrors.civilStatus = "Civil Status is required"
    }
    if (!formData.gender) {
      customErrors.gender = "Gender is required"
    }
    if (!formData.birthDate) {
      customErrors.birthDate = "Birth Date is required"
    }
    if (!formData.maidenName.trim()) {
      customErrors.maidenName = "Maiden Name is required"
    }
    if (!formData.bloodType) {
      customErrors.bloodType = "Blood Type is required"
    }
    if (!formData.healthCondition) {
      customErrors.healthCondition = "Health Condition is required"
    }

    if (formData.civilStatus === "married") {
      if (!formData.spouseName.trim()) {
        customErrors.spouseName = "Spouse Name is required"
      }
      if (!formData.spouseOccupation.trim()) {
        customErrors.spouseOccupation = "Spouse Occupation is required"
      }
      if (!formData.spouseAddress.trim()) {
        customErrors.spouseAddress = "Spouse Address is required"
      }
      if (!formData.spouseContact.trim()) {
        customErrors.spouseContact = "Spouse Contact Number is required"
      }
    }

    const allErrors = { ...serviceErrors, ...customErrors }
    setValidationErrors(allErrors)
    return Object.keys(allErrors).length === 0
  }

  const handleStepOneSubmission = async (): Promise<boolean> => {
    try {
      setIsLoading(true)

      const cookieBranchId = getBranchId() ?? ""
      const cookieCode = getCode() ?? ""
      const result = await createBorrowerBasicInfo(formData, cookieBranchId, cookieCode)

      if (result.status === "DRAFT") {
        setBorrowerId(result.id)

        // Enable the next tab (dependents) after successful submission
        setTabsConfig((prev) =>
          prev.map((tab) => ({
            ...tab,
            enabled: tab.enabled || tab.key === "dependents",
          })),
        )

        toast.success(result.status, {
          description: result.message || "Basic information saved successfully",
          duration: 5000,
        })
        return true
      } else {
        toast.error("Error", {
          description: result.message || "Failed to save basic information",
          duration: 5000,
        })
        return false
      }
    } catch (error: any) {
      console.error("Error saving basic info:", error)

      if (error.validationErrors && Object.keys(error.validationErrors).length > 0) {
        setValidationErrors((prev) => ({
          ...prev,
          ...error.validationErrors,
        }))

        toast.error("Validation Error", {
          description: "Please correct the highlighted fields and try again",
          duration: 5000,
        })
      } else if (error.type === "network") {
        toast.error("Network Error", {
          description: "Unable to connect to server. Please check your internet connection.",
          duration: 5000,
        })
      } else {
        const errorMessage = error.message || "Failed to save basic information"
        toast.error("Error", {
          description: errorMessage,
          duration: 5000,
        })
      }

      return false
    } finally {
      setIsLoading(false)
    }
  }

  const handleStepTwoSubmission = async (): Promise<boolean> => {
    try {
      setIsLoading(true)

      const result = await createBorrowerDependents(formData)

      if (result.status === "DRAFT" || result.status === "SUCCESS") {
        // Enable the next tab (address-details) after successful submission
        setTabsConfig((prev) =>
          prev.map((tab) => ({
            ...tab,
            enabled: tab.enabled || tab.key === "address-details",
          })),
        )

        toast.success(result.status, {
          description: result.message || "Dependents information saved successfully",
          duration: 5000,
        })
        return true
      } else {
        toast.error("Error", {
          description: result.message || "Failed to save dependents information",
          duration: 5000,
        })
        return false
      }
    } catch (error: any) {
      console.error("Error saving dependents:", error)

      if (error.validationErrors && Object.keys(error.validationErrors).length > 0) {
        setValidationErrors((prev) => ({
          ...prev,
          ...error.validationErrors,
        }))

        toast.error("Validation Error", {
          description: "Please correct the highlighted fields and try again",
          duration: 5000,
        })
      } else if (error.type === "network") {
        toast.error("Network Error", {
          description: "Unable to connect to server. Please check your internet connection.",
          duration: 5000,
        })
      } else {
        const errorMessage = error.message || "Failed to save dependents information"
        toast.error("Error", {
          description: errorMessage,
          duration: 5000,
        })
      }

      return false
    } finally {
      setIsLoading(false)
    }
  }

  const validatePhilfundCashCard = (): boolean => {
    const errors: ValidationErrors = {}

    if (!formData.bankName.trim()) {
      errors.bankName = "Cash Card Bank name is required"
    }

    if (!formData.cardNumber.trim()) {
      errors.cardNumber = "Cash card number is required"
    } else if (formData.cardNumber.length < 10) {
      errors.cardNumber = "Card number must be at least 10 digits"
    }

    if (!formData.accountNumber.trim()) {
      errors.accountNumber = "Account number is required"
    } else if (formData.accountNumber.length < 8) {
      errors.accountNumber = "Account number must be at least 8 digits"
    }

    if (!formData.cardExpiryDate) {
      errors.cardExpiryDate = "Cash card expiry date is required"
    } else {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const expiryDate = new Date(formData.cardExpiryDate)
      expiryDate.setHours(0, 0, 0, 0)

      if (expiryDate <= today) {
        errors.cardExpiryDate = "Card expiry date must be in the future"
      }
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const validateDependents = (): boolean => {
    const serviceErrors = validateStepTwoFields(formData)
    setValidationErrors(serviceErrors)
    return Object.keys(serviceErrors).length === 0
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
    if (!formData.prc_place_issued.trim()) {
      errors.prc_place_issued = "PRC Place of Issue is required"
    }
    if (!formData.gov_date_issued) {
      errors.gov_date_issued = "Date of Issue is required"
    }
    if (!formData.gov_expiration_date) {
      errors.gov_expiration_date = "Expiration Date is required"
    }
    if (!formData.gov_valid_id_type.trim()) {
      errors.gov_valid_id_type = "Government Valid ID Type is required"
    }
    if (!formData.bank.trim()) {
      errors.bank = "Bank is required"
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

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const validateVerification = (): boolean => {
    const errors: ValidationErrors = {}

    if (!formData.borrowerPhoto) {
      errors.borrowerPhoto = "Borrower photo is required"
    }

    if (!formData.borrowerSignature) {
      errors.borrowerSignature = "Borrower signature is required"
    }

    if (!formData.homeSketch) {
      errors.homeSketch = "Home sketch is required"
    }

    if (!formData.googleMapUrl?.trim()) {
      errors.googleMapUrl = "Google Maps URL is required"
    } else {
      const url = formData.googleMapUrl.trim()

      try {
        new URL(url)
      } catch (_) {
        errors.googleMapUrl = "Please enter a valid URL"
      }

      if (!url.includes("maps.google") && !url.includes("goo.gl/maps") && !url.includes("maps.app.goo.gl")) {
        errors.googleMapUrl = "Please enter a valid Google Maps URL"
      }
    }

    if (formData.isInterviewed) {
      if (!formData.interviewedBy?.trim()) {
        errors.interviewedBy = "Interviewer name is required when marked as interviewed"
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
        return validateDependents()
      case "address-details":
        return validateAddress()
      case "work-information":
        return validateWorkInformation()
      case "authorization":
        return validateAuthorization()
      case "philfund-cash-card":
        return validatePhilfundCashCard()
      case "verification":
        return validateVerification()
      default:
        return true
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  const handleNext = async () => {
    if (!validateCurrentTab()) {
      toast.warning("Validation Error", {
        description: `Please fill in all required fields before proceeding.`,
        icon: <CircleCheck className="h-5 w-5" />,
        duration: 5000,
      })
      return
    }

    // Handle step-one submission (Basic Info)
    if (activeTab === "basic-info" && !borrowerId) {
      const success = await handleStepOneSubmission()
      if (!success) {
        return
      }
    }

    // Handle step-two submission (Dependents)
    if (activeTab === "dependents") {
      const success = await handleStepTwoSubmission()
      if (!success) {
        return
      }
    }

    const enabledTabs = tabsConfig.filter((tab) => tab.enabled).map((tab) => tab.key)
    const currentIndex = enabledTabs.indexOf(activeTab)
    if (currentIndex < enabledTabs.length - 1) {
      setActiveTab(enabledTabs[currentIndex + 1])
    }
  }

  const handleSaveForInterview = () => {
    if (!validateCurrentTab()) {
      toast.warning("Validation Error", {
        description: `Please fill in all required fields before saving.`,
        icon: <CircleCheck className="h-5 w-5" />,
        duration: 5000,
      })
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
    setFormData((prev) => ({ ...prev, ...updates }))
    const updatedFields = Object.keys(updates)
    setValidationErrors((prev) => {
      const newErrors = { ...prev }
      updatedFields.forEach((field) => {
        delete newErrors[field]
      })
      return newErrors
    })
  }

  const validateAuthorization = (): boolean => {
    const errors: ValidationErrors = {}

    if (!formData.authorizedPersons || formData.authorizedPersons.length === 0) {
      errors.authorization = "At least one authorized person is required"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleTabClick = (tabKey: string) => {
    const tab = tabsConfig.find((t) => t.key === tabKey)
    if (tab && tab.enabled) {
      setActiveTab(tabKey)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-none w-[90vw] h-[75vh] flex flex-col overflow-y-auto">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-xl font-bold">Add Borrowers Profile Maintenance</DialogTitle>
          <p className="text-sm text-muted-foreground">Create a new cash advance configuration for bonus loans</p>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <nav className="flex space-x-8 border-b mb-4">
            {tabsConfig.map((tab) => (
              <button
                key={tab.key}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.key
                    ? "border-blue-500 text-blue-600"
                    : tab.enabled
                      ? "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      : "border-transparent text-gray-300 cursor-not-allowed"
                }`}
                onClick={() => handleTabClick(tab.key)}
                disabled={!tab.enabled || isLoadingCache}
              >
                {tab.label}
                {!tab.enabled && <span className="ml-1 text-xs">(Disabled)</span>}
              </button>
            ))}
          </nav>

          {isLoadingCache ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-sm text-gray-500">Loading cached data...</p>
              </div>
            </div>
          ) : (
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
                <AuthorizationTab validationErrors={validationErrors} onValidationChange={() => {}} />
              </TabsContent>

              <TabsContent value="philfund-cash-card" className="mt-0 h-full">
                <PhilfundCashCardTab
                  formData={{
                    bankName: formData.bankName,
                    cardNumber: formData.cardNumber,
                    accountNumber: formData.accountNumber,
                    cardExpiryDate: formData.cardExpiryDate,
                  }}
                  validationErrors={validationErrors}
                  onUpdateFormData={(data) => updateFormData(data)}
                />
              </TabsContent>

              <TabsContent value="verification" className="mt-0 h-full">
                <VerificationTab
                  formData={formData}
                  validationErrors={validationErrors}
                  onUpdateFormData={updateFormData}
                />
              </TabsContent>
            </div>
          )}

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
              <Button onClick={handleNext} disabled={isLoadingCache}>
                Next
              </Button>
            )}
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
