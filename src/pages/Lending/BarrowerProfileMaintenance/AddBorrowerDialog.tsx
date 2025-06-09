"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Printer, Archive, CircleCheck } from "lucide-react";

import { toast } from "sonner";
import type {
  FormData,
  ValidationErrors,
  AddBorrowerDialogProps,
} from "./Services/AddBorrowersTypes";
import { AddressDetailsTab } from "./Tab/AddressDetailsTab";
import { AuthorizationTab } from "./Tab/AuthorizationTab";
import { BasicInfoTab } from "./Tab/BasicInfoTab";
import { DependentsTab } from "./Tab/DependentsTab";
import { PhilfundCashCardTab } from "./Tab/PhilfundCashCardTab";
import VerificationTab from "./Tab/VerificationTab";
import { WorkInformationTab } from "./Tab/WorkInformationTab";


export type { ValidationErrors, FormData };

export function AddBorrowerDialog({
  open,
  onOpenChange,
}: AddBorrowerDialogProps) {
  const [activeTab, setActiveTab] = useState("basic-info");
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
  });
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );

  const validateBasicInfo = (): boolean => {
    const errors: ValidationErrors = {};

    if (!formData.riskLevel.trim()) {
      errors.riskLevel = "Risk Level is required";
    }
    if (!formData.lastName.trim()) {
      errors.lastName = "Last Name is required";
    }
    if (!formData.firstName.trim()) {
      errors.firstName = "First Name is required";
    }
    if (!formData.middleName.trim()) {
      errors.middleName = "Middle Name is required";
    }
    if (!formData.civilStatus) {
      errors.civilStatus = "Civil Status is required";
    }
    if (!formData.gender) {
      errors.gender = "Gender is required";
    }
    if (!formData.birthDate) {
      errors.birthDate = "Birth Date is required";
    }
    if (!formData.maidenName.trim()) {
      errors.maidenName = "Maiden Name is required";
    }
    if (!formData.bloodType) {
      errors.bloodType = "Blood Type is required";
    }
    if (!formData.healthCondition) {
      errors.healthCondition = "Health Condition is required";
    }

    if (formData.civilStatus === "married") {
      if (!formData.spouseName.trim()) {
        errors.spouseName = "Spouse Name is required";
      }
      if (!formData.spouseOccupation.trim()) {
        errors.spouseOccupation = "Spouse Occupation is required";
      }
      if (!formData.spouseAddress.trim()) {
        errors.spouseAddress = "Spouse Address is required";
      }
      if (!formData.spouseContact.trim()) {
        errors.spouseContact = "Spouse Contact Number is required";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePhilfundCashCard = (): boolean => {
    const errors: ValidationErrors = {};

    if (!formData.bankName.trim()) {
      errors.bankName = "Cash Card Bank name is required";
    }

    if (!formData.cardNumber.trim()) {
      errors.cardNumber = "Cash card number is required";
    } else if (formData.cardNumber.length < 10) {
      errors.cardNumber = "Card number must be at least 10 digits";
    }

    if (!formData.accountNumber.trim()) {
      errors.accountNumber = "Account number is required";
    } else if (formData.accountNumber.length < 8) {
      errors.accountNumber = "Account number must be at least 8 digits";
    }

    if (!formData.cardExpiryDate) {
      errors.cardExpiryDate = "Cash card expiry date is required";
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const expiryDate = new Date(formData.cardExpiryDate);
      expiryDate.setHours(0, 0, 0, 0);

      if (expiryDate <= today) {
        errors.cardExpiryDate = "Card expiry date must be in the future";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateDependents = (): boolean => {
    const errors: ValidationErrors = {};

    if (!formData.dependents || formData.dependents.length === 0) {
      errors.dependents = "At least one dependent is required";
    } else {
      let hasValidDependent = false;

      formData.dependents.forEach((dep) => {
        const trimmedName = dep.name.trim();

        if (!trimmedName) {
          errors[`${dep.id}_name`] = "Name is required";
        }

        if (!dep.birthdate) {
          errors[`${dep.id}_birthdate`] = "Birthdate is required";
        }

        // Track if at least one dependent has both valid name and birthdate
        if (trimmedName && dep.birthdate) {
          hasValidDependent = true;
        }
      });

      if (!hasValidDependent) {
        errors.dependents =
          "At least one dependent must have both name and birthdate";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateAddress = (): boolean => {
    const errors: ValidationErrors = {};

    if (!formData.address.trim()) {
      errors.address = "Address is required";
    }
    if (!formData.province.trim()) {
      errors.province = "Province is required";
    }
    if (!formData.municipality.trim()) {
      errors.municipality = "Municipality/City is required";
    }
    if (!formData.barangay.trim()) {
      errors.barangay = "Barangay is required";
    }
    if (!formData.street.trim()) {
      errors.street = "Street is required";
    }
    if (!formData.place_status.trim()) {
      errors.place_status = "Place Status is required";
    }
    if (formData.is_permanent) {
      if (!formData.permanent_address.trim()) {
        errors.permanent_address = "Permanent Address is required";
      }
      if (!formData.permanent_province.trim()) {
        errors.permanent_province = "Permanent Province is required";
      }
      if (!formData.permanent_municipality.trim()) {
        errors.permanent_municipality =
          "Permanent Municipality/City is required";
      }
      if (!formData.permanent_barangay.trim()) {
        errors.permanent_barangay = "Permanent Barangay is required";
      }
      if (!formData.permanent_street.trim()) {
        errors.permanent_street = "Permanent Street is required";
      }
    }
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    }
    if (!formData.contactNumber1.trim()) {
      errors.contactNumber1 = "Contact Number 1 is required";
    }
    if (!formData.network_provider1.trim()) {
      errors.network_provider1 = "Network Provider 1 is required";
    }
    if (!formData.contctNumber2.trim()) {
      errors.contctNumber2 = "Contact Number 2 is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const validateWorkInformation = (): boolean => {
    const errors: ValidationErrors = {};

    if (!formData.classification) {
      errors.classification = "Classification Status is required";
    }
    if (!formData.date_of_appointment) {
      errors.date_of_appointment = "Date of Appointment is required";
    }
    if (!formData.category) {
      errors.category = "Category is required";
    }
    if (!formData.division) {
      errors.division = "Division is required";
    }
    if (!formData.district) {
      errors.district = "District is required";
    }
    if (!formData.school.trim()) {
      errors.school = "School is required";
    }
    if (!formData.deped_employee_id.trim()) {
      errors.deped_employee_id = "DepEd Employee ID is required";
    }
    if (!formData.pricipal_name.trim()) {
      errors.pricipal_name = "Principal Name is required";
    }
    if (!formData.supervisor_name.trim()) {
      errors.supervisor_name = "Supervisor Name is required";
    }
    if (!formData.prc_id_no.trim()) {
      errors.prc_id_no = "PRC ID No. is required";
    }
    if (!formData.prc_registration_no.trim()) {
      errors.prc_registration_no = "PRC Registration No. is required";
    }
    if (!formData.prc_place_issued.trim()) {
      errors.prc_place_issued = "PRC Place of Issue is required";
    }
    //   if (!formData.gov_place_issued.trim()) {
    //   errors.gov_place_issued = "Place of Issue is required"
    // }
    if (!formData.gov_date_issued) {
      errors.gov_date_issued = "Date of Issue is required";
    }
    if (!formData.gov_expiration_date) {
      errors.gov_expiration_date = "Expiration Date is required";
    }
    if (!formData.gov_valid_id_type.trim()) {
      errors.gov_valid_id_type = "Government Valid ID Type is required";
    }
    // if (!formData.valid_id_no.trim()) {
    //   errors.valid_id_no = "Valid ID No. is required"
    // }

    if (!formData.bank.trim()) {
      errors.bank = "Bank is required";
    }
    if (!formData.atm_account_number.trim()) {
      errors.atm_account_number = "ATM Account Number is required";
    }
    if (!formData.atm_card_number.trim()) {
      errors.atm_card_number = "ATM Card Number is required";
    }
    if (!formData.atm_expiration_date) {
      errors.atm_expiration_date = "ATM Expiration Date is required";
    }
    if (!formData.umid_type.trim()) {
      errors.umid_type = "UMID Type is required";
    }
    if (!formData.umid_card_no.trim()) {
      errors.umid_card_no = "UMID Card No. is required";
    }
    if (!formData.atm_bank_branch.trim()) {
      errors.atm_bank_branch = "ATM Bank Branch is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateVerification = (): boolean => {
    const errors: ValidationErrors = {};

    if (!formData.borrowerPhoto) {
      errors.borrowerPhoto = "Borrower photo is required";
    }

    if (!formData.borrowerSignature) {
      errors.borrowerSignature = "Borrower signature is required";
    }

    if (!formData.homeSketch) {
      errors.homeSketch = "Home sketch is required";
    }

    if (!formData.googleMapUrl?.trim()) {
      errors.googleMapUrl = "Google Maps URL is required";
    } else {
      const url = formData.googleMapUrl.trim();

      try {
        new URL(url);
      } catch (_) {
        errors.googleMapUrl = "Please enter a valid URL";
      }

      if (
        !url.includes("maps.google") &&
        !url.includes("goo.gl/maps") &&
        !url.includes("maps.app.goo.gl")
      ) {
        errors.googleMapUrl = "Please enter a valid Google Maps URL";
      }
    }

    if (formData.isInterviewed) {
      if (!formData.interviewedBy?.trim()) {
        errors.interviewedBy =
          "Interviewer name is required when marked as interviewed";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateCurrentTab = (): boolean => {
    switch (activeTab) {
      case "basic-info":
        return validateBasicInfo();
      case "dependents":
        return validateDependents();
      case "address-details":
        return validateAddress();
      case "work-information":
        return validateWorkInformation();
      case "authorization":
        return validateAuthorization();
      case "philfund-cash-card":
        return validatePhilfundCashCard();
      case "verification":
        return validateVerification();
      default:
        return true;
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleNext = () => {
    if (!validateCurrentTab()) {
      toast.warning("Validation Error", {
        description: `Please fill in all required fields before proceeding.`,
        icon: <CircleCheck className="h-5 w-5" />,
        duration: 5000,
      });
      return;
    }

    const tabs = [
      "basic-info",
      "dependents",
      "address-details",
      "work-information",
      "authorization",
      "philfund-cash-card",
      "verification",
    ];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };

  const handleSaveForInterview = () => {
    if (!validateCurrentTab()) {
      toast.warning("Validation Error", {
        description: `Please fill in all required fields before saving.`,
        icon: <CircleCheck className="h-5 w-5" />,
        duration: 5000,
      });
      return;
    }

    console.log("Save for Interview", formData);
    onOpenChange(false);
  };

  const handleArchive = () => {
    console.log("Archive");
    onOpenChange(false);
  };

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
    const updatedFields = Object.keys(updates);
    setValidationErrors((prev) => {
      const newErrors = { ...prev };
      updatedFields.forEach((field) => {
        delete newErrors[field];
      });
      return newErrors;
    });
  };

  const validateAuthorization = (): boolean => {
    const errors: ValidationErrors = {};

    if (
      !formData.authorizedPersons ||
      formData.authorizedPersons.length === 0
    ) {
      errors.authorization = "At least one authorized person is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-none w-[90vw] max-w-screen-2xl h-[75vh] flex flex-col overflow-y-auto">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-xl font-bold">
            Add Borrowers Profile Maintenance
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Create a new cash advance configuration for bonus loans
          </p>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 flex flex-col"
        >
          {/* <TabsList className="grid w-full grid-cols-7 flex-shrink-0">
            <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
            <TabsTrigger value="dependents">Dependents</TabsTrigger>
            <TabsTrigger value="address-details">Address Details</TabsTrigger>
            <TabsTrigger value="work-information">Work Information</TabsTrigger>
            <TabsTrigger value="authorization">Authorization</TabsTrigger>
            <TabsTrigger value="philfund-cash-card">Philfund cash card</TabsTrigger>
            <TabsTrigger value="verification">Verification</TabsTrigger>
          </TabsList> */}

          <nav className="flex space-x-8 border-b mb-4">
            <button
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "basic-info"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("basic-info")}
            >
              Basic Info
            </button>
            <button
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "dependents"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("dependents")}
            >
              Dependents
            </button>
            <button
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "address-details"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("address-details")}
            >
              Address Details
            </button>
            <button
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "work-information"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("work-information")}
            >
              Work Information
            </button>
            <button
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "authorization"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("authorization")}
            >
              Authorization
            </button>
            <button
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "philfund-cash-card"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("philfund-cash-card")}
            >
              Philfund Cash Card
            </button>
            <button
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "verification"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("verification")}
            >
              Verification
            </button>
          </nav>

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
                onUpdateDependents={(dependents) =>
                  updateFormData({ dependents })
                }
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
                validationErrors={validationErrors}
                onValidationChange={() => {}}
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
                <Button onClick={handleSaveForInterview}>
                  Save for Interview
                </Button>
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
  );
}
