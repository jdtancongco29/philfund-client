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
  validateStepOneFields,
  validateStepTwoFields,
  validateStepThreeFields,
  validateStepFourFields,
  validateStepFiveFields,
  validateStepSixFields,
  validateStepSevenFields,
} from "./Services/AddBorrowersService"
import { getBranchId, getCode } from "@/lib/api"
import { useBorrowerForm } from "./hooks/UseBorrowerMutations"

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
      {
        id: crypto.randomUUID(),
        name: "",
        birthdate: undefined,
      },
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
  const [borrowerId, setBorrowerId] = useState<string>("")

  // Use the custom hook for borrower form management
  const {
    createBasicInfo,
    createDependents,
    createAddressDetails,
    createWorkInfo,
    createAuthorization,
    createCashCard,
    createVerification,
    cachedProfile,
    cachedFormData,
    isLoading,
    isCacheLoading,
    extractValidationErrors,
    getEnabledTabs,
  } = useBorrowerForm()

  // Tab configuration with enabled/disabled state
  const [tabsConfig, setTabsConfig] = useState<TabConfig[]>([
    { key: "basic-info", label: "Basic Info", enabled: true },
    { key: "dependents", label: "Dependents", enabled: false },
    { key: "address-details", label: "Address Details", enabled: false },
    { key: "work-information", label: "Work Information", enabled: false },
    { key: "authorization", label: "Authorization", enabled: true },
    { key: "philfund-cash-card", label: "Philfund Cash Card", enabled: false },
    { key: "verification", label: "Verification", enabled: false },
  ])

  // Load cached data when dialog opens
  useEffect(() => {
    if (open && cachedProfile) {
      const enabledTabs = getEnabledTabs(cachedProfile)

      // Update tabs configuration
      setTabsConfig((prev) =>
        prev.map((tab) => ({
          ...tab,
          enabled: enabledTabs.includes(tab.key),
        })),
      )
    }
  }, [open, cachedProfile, getEnabledTabs])

  // Load cached form data
  useEffect(() => {
    if (open && cachedFormData) {
      setFormData((prev) => ({ ...prev, ...cachedFormData }))

      if (cachedFormData.dependents) {
        console.log("Loaded cached dependents:", cachedFormData.dependents)
      }
    }
  }, [open, cachedFormData])

  // Handle mutation errors and update validation errors
  useEffect(() => {
    if (createBasicInfo.error) {
      const errors = extractValidationErrors(createBasicInfo.error)
      setValidationErrors((prev) => ({ ...prev, ...errors }))
    }
  }, [createBasicInfo.error, extractValidationErrors])

  useEffect(() => {
    if (createDependents.error) {
      const errors = extractValidationErrors(createDependents.error)
      setValidationErrors((prev) => ({ ...prev, ...errors }))
    }
  }, [createDependents.error, extractValidationErrors])

  useEffect(() => {
    if (createAddressDetails.error) {
      const errors = extractValidationErrors(createAddressDetails.error)
      setValidationErrors((prev) => ({ ...prev, ...errors }))
    }
  }, [createAddressDetails.error, extractValidationErrors])

  useEffect(() => {
    if (createWorkInfo.error) {
      const errors = extractValidationErrors(createWorkInfo.error)
      setValidationErrors((prev) => ({ ...prev, ...errors }))
    }
  }, [createWorkInfo.error, extractValidationErrors])

  useEffect(() => {
    if (createAuthorization.error) {
      const errors = extractValidationErrors(createAuthorization.error)
      setValidationErrors((prev) => ({ ...prev, ...errors }))
    }
  }, [createAuthorization.error, extractValidationErrors])

  useEffect(() => {
    if (createCashCard.error) {
      const errors = extractValidationErrors(createCashCard.error)
      setValidationErrors((prev) => ({ ...prev, ...errors }))
    }
  }, [createCashCard.error, extractValidationErrors])

  useEffect(() => {
    if (createVerification.error) {
      const errors = extractValidationErrors(createVerification.error)
      setValidationErrors((prev) => ({ ...prev, ...errors }))
    }
  }, [createVerification.error, extractValidationErrors])

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
      const cookieBranchId = getBranchId() ?? ""
      const cookieCode = getCode() ?? ""

      const result = await createBasicInfo.mutateAsync({
        formData,
        branchId: cookieBranchId,
        borrowerCode: cookieCode,
      })

      if (result.status === "DRAFT") {
        setBorrowerId(result.id)

        // Enable the next tab (dependents) after successful submission
        setTabsConfig((prev) =>
          prev.map((tab) => ({
            ...tab,
            enabled: tab.enabled || tab.key === "dependents",
          })),
        )

        return true
      } else {
        toast.error("Error", {
          description: result.message || "Failed to save basic information",
          duration: 5000,
        })
        return false
      }
    } catch (error) {
      return false
    }
  }

  const handleStepTwoSubmission = async (): Promise<boolean> => {
    try {
      const result = await createDependents.mutateAsync(formData)

      if (result.status === "DRAFT" || result.status === "SUCCESS") {
        // Enable the next tab (address-details) after successful submission
        setTabsConfig((prev) =>
          prev.map((tab) => ({
            ...tab,
            enabled: tab.enabled || tab.key === "address-details",
          })),
        )

        return true
      } else {
        toast.error("Error", {
          description: result.message || "Failed to save dependents information",
          duration: 5000,
        })
        return false
      }
    } catch (error) {
      return false
    }
  }

  const handleStepThreeSubmission = async (): Promise<boolean> => {
    try {
      const result = await createAddressDetails.mutateAsync(formData)

      if (result.status === "DRAFT" || result.status === "SUCCESS") {
        // Enable the next tab (work-information) after successful submission
        setTabsConfig((prev) =>
          prev.map((tab) => ({
            ...tab,
            enabled: tab.enabled || tab.key === "work-information",
          })),
        )

        return true
      } else {
        toast.error("Error", {
          description: result.message || "Failed to save address details",
          duration: 5000,
        })
        return false
      }
    } catch (error) {
      return false
    }
  }

  const validatePhilfundCashCard = (): boolean => {
    const serviceErrors = validateStepSixFields(formData)
    setValidationErrors(serviceErrors)
    return Object.keys(serviceErrors).length === 0
  }

  const validateDependents = (): boolean => {
    const serviceErrors = validateStepTwoFields(formData)
    setValidationErrors(serviceErrors)
    return Object.keys(serviceErrors).length === 0
  }

  const validateAddress = (): boolean => {
    const serviceErrors = validateStepThreeFields(formData)
    setValidationErrors(serviceErrors)
    return Object.keys(serviceErrors).length === 0
  }

  const validateWorkInformation = (): boolean => {
    const serviceErrors = validateStepFourFields(formData)
    setValidationErrors(serviceErrors)
    return Object.keys(serviceErrors).length === 0
  }

  const validateVerification = (): boolean => {
    const serviceErrors = validateStepSevenFields(formData)
    setValidationErrors(serviceErrors)
    return Object.keys(serviceErrors).length === 0
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

    // Handle step-three submission (Address Details)
    if (activeTab === "address-details") {
      const success = await handleStepThreeSubmission()
      if (!success) {
        return
      }
    }

    // Handle step-four submission (Work Information)
    if (activeTab === "work-information") {
      const success = await handleStepFourSubmission()
      if (!success) {
        return
      }
    }

    // Handle step-five submission (Authorization)
    if (activeTab === "authorization") {
      const success = await handleStepFiveSubmission()
      if (!success) {
        return
      }
    }

    // Handle step-six submission (Philfund Cash Card)
    if (activeTab === "philfund-cash-card") {
      const success = await handleStepSixSubmission()
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

  const handleStepFourSubmission = async (): Promise<boolean> => {
    try {
      const result = await createWorkInfo.mutateAsync(formData)

      if (result.status === "DRAFT" || result.status === "SUCCESS") {
        // Enable the next tab (authorization) after successful submission
        setTabsConfig((prev) =>
          prev.map((tab) => ({
            ...tab,
            enabled: tab.enabled || tab.key === "authorization",
          })),
        )

        return true
      } else {
        toast.error("Error", {
          description: result.message || "Failed to save work information",
          duration: 5000,
        })
        return false
      }
    } catch (error) {
      return false
    }
  }

  const handleStepFiveSubmission = async (): Promise<boolean> => {
    try {
      const result = await createAuthorization.mutateAsync(formData)

      if (result.status === "DRAFT" || result.status === "SUCCESS") {
        // Enable the next tab (philfund-cash-card) after successful submission
        setTabsConfig((prev) =>
          prev.map((tab) => ({
            ...tab,
            enabled: tab.enabled || tab.key === "philfund-cash-card",
          })),
        )

        return true
      } else {
        toast.error("Error", {
          description: result.message || "Failed to save authorization information",
          duration: 5000,
        })
        return false
      }
    } catch (error) {
      return false
    }
  }

  const handleStepSixSubmission = async (): Promise<boolean> => {
    try {
      const result = await createCashCard.mutateAsync(formData)

      if (result.status === "DRAFT" || result.status === "SUCCESS") {
        // Enable the next tab (verification) after successful submission
        setTabsConfig((prev) =>
          prev.map((tab) => ({
            ...tab,
            enabled: tab.enabled || tab.key === "verification",
          })),
        )

        return true
      } else {
        toast.error("Error", {
          description: result.message || "Failed to save cash card information",
          duration: 5000,
        })
        return false
      }
    } catch (error) {
      return false
    }
  }

  const handleStepSevenSubmission = async (): Promise<boolean> => {
    try {
      const result = await createVerification.mutateAsync({
        formData,
        currentUserId: "0b839a1d-c44d-4cfb-9302-f769cb24c521", // Replace with actual current user ID
      })

      if (result.status === "DRAFT" || result.status === "SUCCESS") {
        toast.success("Success", {
          description: "Verification information saved successfully. Profile completed!",
          duration: 5000,
        })
        return true
      } else {
        toast.error("Error", {
          description: result.message || "Failed to save verification information",
          duration: 5000,
        })
        return false
      }
    } catch (error) {
      return false
    }
  }

  const handleSaveForInterview = async () => {
    if (!validateCurrentTab()) {
      toast.warning("Validation Error", {
        description: `Please fill in all required fields before saving.`,
        icon: <CircleCheck className="h-5 w-5" />,
        duration: 5000,
      })
      return
    }

    // Submit verification data
    const success = await handleStepSevenSubmission()
    if (success) {
      console.log("Save for Interview completed", formData)
      onOpenChange(false)
    }
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
    const serviceErrors = validateStepFiveFields(formData)
    setValidationErrors(serviceErrors)
    return Object.keys(serviceErrors).length === 0
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
                disabled={!tab.enabled || isCacheLoading}
              >
                {tab.label}
                {!tab.enabled && <span className="ml-1 text-xs">(Disabled)</span>}
              </button>
            ))}
          </nav>

          {isCacheLoading ? (
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
                <AuthorizationTab
                  formData={formData}
                  validationErrors={validationErrors}
                  onUpdateFormData={updateFormData}
                />
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
                  onUpdateFormData={(cashCardData) => {
                    // Properly map the cash card data to the main form data
                    updateFormData({
                      bankName: cashCardData.bankName,
                      cardNumber: cashCardData.cardNumber,
                      accountNumber: cashCardData.accountNumber,
                      cardExpiryDate: cashCardData.cardExpiryDate,
                    })
                  }}
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
              <Button onClick={handleNext} disabled={isCacheLoading || isLoading}>
                {isLoading ? "Saving..." : "Next"}
              </Button>
            )}
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
