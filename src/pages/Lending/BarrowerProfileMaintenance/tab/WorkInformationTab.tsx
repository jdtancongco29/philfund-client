"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { cn } from "@/lib/utils"
import { ValidationErrors } from "../Services/AddBorrowersTypes"
import { format } from "date-fns";
// Work form data interface - not extending browser FormData
export interface WorkFormData {
  // Employment Information
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

interface WorkInformationTabProps {
  formData: WorkFormData
  validationErrors: ValidationErrors
  onUpdateFormData: (updates: Partial<WorkFormData>) => void
}

export function WorkInformationTab({ formData, validationErrors, onUpdateFormData }: WorkInformationTabProps) {

  const handleInputChange = (field: keyof WorkFormData, value: string | Date | boolean | File | null | undefined) => {
    onUpdateFormData({ [field]: value })
  }

  const getFieldError = (field: string) => {
    return validationErrors[field]
  }

  return (
    <div className="space-y-8 p-6">
      <div className="space-y-6">
        <h3 className="text-lg font-semibold border-b pb-2">Employment Information</h3>
      <div className="grid grid-cols-3 gap-6">
          <div>
            <Label htmlFor="employment-status">Classification*</Label>
            <Select 
              value={formData.classification || ''} 
              onValueChange={(value) => handleInputChange("classification", value)}
            >
              <SelectTrigger className={cn("w-full mt-2", getFieldError("classification") && "border-red-500")}>
                <SelectValue placeholder="Select classification" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="c1">Classification 1</SelectItem>
                <SelectItem value="c2">Classification 2</SelectItem>
              </SelectContent>
            </Select>
            {getFieldError("classification") && <p className="text-sm text-red-500 mt-1">{getFieldError("classification")}</p>}
          </div>
          <div>
            <Label htmlFor="date_of_appointment">Date of Appointment*</Label>
            
<Input
  type="date"
  value={
    formData.date_of_appointment
      ? format(new Date(formData.date_of_appointment), "yyyy-MM-dd")
      : ""
  }
  onChange={(e) => {
    const value = e.target.value;
    const dateValue = value ? new Date(value + "T00:00:00") : undefined;
    handleInputChange("date_of_appointment", dateValue);
  }}
  className={`mt-2 pr-10 relative
    [&::-webkit-calendar-picker-indicator]:absolute
    [&::-webkit-calendar-picker-indicator]:right-3
    [&::-webkit-calendar-picker-indicator]:top-1/2
    [&::-webkit-calendar-picker-indicator]:-translate-y-1/2
    [&::-webkit-calendar-picker-indicator]:cursor-pointer
    [&::-webkit-calendar-picker-indicator]:text-black
    ${getFieldError("date_of_appointment") ? "border-red-500" : ""}
  `}
  style={{ colorScheme: "light" }}
/>
                  {getFieldError("date_of_appointment") && <p className="text-sm text-red-500 mt-1">{getFieldError("date_of_appointment")}</p>}
          </div>
          <div>
            <Label htmlFor="category">Category / Group*</Label>
            <Select 
              value={formData.category || ''} 
              onValueChange={(value) => handleInputChange("category", value)}
            >
              <SelectTrigger className={cn("w-full mt-2", getFieldError("category") && "border-red-500")}>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="c1">Category 1</SelectItem>
                <SelectItem value="c2">Category 2</SelectItem>
              </SelectContent>
            </Select>
            {getFieldError("category") && <p className="text-sm text-red-500 mt-1">{getFieldError("category")}</p>}
          </div>
        </div>
        </div>
              {/* Office Assignment */}
    <div className="space-y-6">
        <h3 className="text-lg font-semibold border-b pb-2">Office Assignment</h3>
      <div className="grid grid-cols-2 gap-6">
          <div>
            <Label htmlFor="employment-status">Division *</Label>
            <Select 
              value={formData.division || ''} 
              onValueChange={(value) => handleInputChange("division", value)}
            >
              <SelectTrigger className={cn("w-full mt-2", getFieldError("division") && "border-red-500")}>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="c1">Division 1</SelectItem>
                <SelectItem value="c2">Division 2</SelectItem>
              </SelectContent>
            </Select>
            {getFieldError("division") && <p className="text-sm text-red-500 mt-1">{getFieldError("division")}</p>}
          </div>
           <div>
            <Label htmlFor="district">District *</Label>
            <Select 
              value={formData.district || ''} 
              onValueChange={(value) => handleInputChange("district", value)}
            >
              <SelectTrigger className={cn("w-full mt-2", getFieldError("district") && "border-red-500")}>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="c1">District 1</SelectItem>
                <SelectItem value="c2">District 2</SelectItem>
              </SelectContent>
            </Select>
            {getFieldError("district") && <p className="text-sm text-red-500 mt-1">{getFieldError("district")}</p>}
          </div>
         
          <div>
            <Label htmlFor="school">School *</Label>
            <Select 
              value={formData.school || ''} 
              onValueChange={(value) => handleInputChange("school", value)}
            >
              <SelectTrigger className={cn("w-full mt-2", getFieldError("school") && "border-red-500")}>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="c1">School 1</SelectItem>
                <SelectItem value="c2">School 2</SelectItem>
              </SelectContent>
            </Select>
            {getFieldError("school") && <p className="text-sm text-red-500 mt-1">{getFieldError("school")}</p>}
          </div>
            <div>
            <Label htmlFor="deped_employee_id">DepEd Employee ID No *</Label>
            <Input
              id="deped_employee_id"
              placeholder="DepEd Employee ID "
              className={cn("mt-2", getFieldError("deped_employee_id") && "border-red-500")}
              value={formData.deped_employee_id}
              onChange={(e) => handleInputChange("deped_employee_id", e.target.value)}
            />
            {getFieldError("deped_employee_id") && <p className="text-sm text-red-500 mt-1">{getFieldError("deped_employee_id")}</p>}
          </div>
        </div>
        </div>

        


               {/* Supervisor  */}

            <div className="space-y-6">
        <h3 className="text-lg font-semibold border-b pb-2">Supervisor and Authority</h3>
      <div className="grid grid-cols-2 gap-6">
        <div>
            <Label htmlFor="pricipal_name">Name of Principal *</Label>
           <Input
              id="pricipal_name"
              placeholder="PRC ID No. "
              className={cn("mt-2", getFieldError("pricipal_name") && "border-red-500")}
              value={formData.pricipal_name}
              onChange={(e) => handleInputChange("pricipal_name", e.target.value)}
            />
            {getFieldError("pricipal_name") && <p className="text-sm text-red-500 mt-1">{getFieldError("pricipal_name")}</p>}
          </div>
          
         <div>
            <Label htmlFor="supervisor_name">Name of Supervisor *</Label>
           <Input
              id="supervisor_name"
              placeholder="PRC ID No. "
              className={cn("mt-2", getFieldError("supervisor_name") && "border-red-500")}
              value={formData.supervisor_name}
              onChange={(e) => handleInputChange("supervisor_name", e.target.value)}
            />
            {getFieldError("supervisor_name") && <p className="text-sm text-red-500 mt-1">{getFieldError("supervisor_name")}</p>}
          </div>
        </div>
        </div>

               {/* Professional Details */}
            <div className="space-y-6">
        <h3 className="text-lg font-semibold border-b pb-2"> Professional Details (Teachers Only)</h3>
      <div className="grid grid-cols-2 gap-6">
          <div>
            <Label htmlFor="prc_id_no">PRC ID No. *</Label>
           <Input
              id="prc_id_no"
              placeholder="PRC ID No. "
              className={cn("mt-2", getFieldError("prc_id_no") && "border-red-500")}
              value={formData.prc_id_no}
              onChange={(e) => handleInputChange("prc_id_no", e.target.value)}
            />
            {getFieldError("prc_id_no") && <p className="text-sm text-red-500 mt-1">{getFieldError("prc_id_no")}</p>}
          </div>
              <div>
             <Label htmlFor="prc_registration_no">PRC Registration No. *</Label>
           <Input
              id="prc_registration_no"
              placeholder="PRC Registration No. "
              className={cn("mt-2", getFieldError("prc_registration_no") && "border-red-500")}
              value={formData.prc_registration_no}
              onChange={(e) => handleInputChange("prc_registration_no", e.target.value)}
            />
            {getFieldError("prc_registration_no") && <p className="text-sm text-red-500 mt-1">{getFieldError("prc_registration_no")}</p>}
          </div>
            </div>
            <div className="grid grid-cols-3 gap-6">
                       <div>
             <Label htmlFor="prc_place_issued">PRC Place Issued *</Label>
           <Input
              id="prc_place_issued"
              placeholder="PRC Place Issued "
              className={cn("mt-2", getFieldError("prc_place_issued") && "border-red-500")}
              value={formData.prc_place_issued}
              onChange={(e) => handleInputChange("prc_place_issued", e.target.value)}
            />
            {getFieldError("prc_place_issued") && <p className="text-sm text-red-500 mt-1">{getFieldError("prc_place_issued")}</p>}
          </div>
               <div>
            <Label htmlFor="gov_date_issued">Date Issued *</Label>
            <Input
  type="date"
  value={
    formData.gov_date_issued
      ? format(new Date(formData.gov_date_issued), "yyyy-MM-dd")
      : ""
  }
  onChange={(e) => {
    const value = e.target.value;
    const dateValue = value ? new Date(value + "T00:00:00") : undefined;
    handleInputChange("gov_date_issued", dateValue);
  }}
  className={`mt-2 pr-10 relative
    [&::-webkit-calendar-picker-indicator]:absolute
    [&::-webkit-calendar-picker-indicator]:right-3
    [&::-webkit-calendar-picker-indicator]:top-1/2
    [&::-webkit-calendar-picker-indicator]:-translate-y-1/2
    [&::-webkit-calendar-picker-indicator]:cursor-pointer
    [&::-webkit-calendar-picker-indicator]:text-black
    ${getFieldError("gov_date_issued") ? "border-red-500" : ""}
  `}
  style={{ colorScheme: "light" }}
/>
                  {getFieldError("gov_date_issued") && <p className="text-sm text-red-500 mt-1">{getFieldError("gov_date_issued")}</p>}
          </div>

                      <div>
            <Label htmlFor="gov_expiration_date">Expiration Date *</Label>
                      <Input
  type="date"
  value={
    formData.gov_expiration_date
      ? format(new Date(formData.gov_expiration_date), "yyyy-MM-dd")
      : ""
  }
  onChange={(e) => {
    const value = e.target.value;
    const dateValue = value ? new Date(value + "T00:00:00") : undefined;
    handleInputChange("gov_expiration_date", dateValue);
  }}
  className={`mt-2 pr-10 relative
    [&::-webkit-calendar-picker-indicator]:absolute
    [&::-webkit-calendar-picker-indicator]:right-3
    [&::-webkit-calendar-picker-indicator]:top-1/2
    [&::-webkit-calendar-picker-indicator]:-translate-y-1/2
    [&::-webkit-calendar-picker-indicator]:cursor-pointer
    [&::-webkit-calendar-picker-indicator]:text-black
    ${getFieldError("gov_expiration_date") ? "border-red-500" : ""}
  `}
  style={{ colorScheme: "light" }}
/>
                  {getFieldError("gov_expiration_date") && <p className="text-sm text-red-500 mt-1">{getFieldError("gov_expiration_date")}</p>}
          </div>
        </div>
        </div>

             <div className="space-y-6">
        <h3 className="text-lg font-semibold border-b pb-2">Bank Details</h3>
      <div className="grid grid-cols-2 gap-6">
          <div>
            <Label htmlFor="bank">ATM Bank *</Label>
            <Select 
              value={formData.bank || ''} 
              onValueChange={(value) => handleInputChange("bank", value)}
            >
              <SelectTrigger className={cn("w-full mt-2", getFieldError("bank") && "border-red-500")}>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="c1">Bank 1</SelectItem>
                <SelectItem value="c2">Bank 2</SelectItem>
              </SelectContent>
            </Select>
            {getFieldError("bank") && <p className="text-sm text-red-500 mt-1">{getFieldError("bank")}</p>}
          </div>

           <div>
            <Label htmlFor="atm_bank_branch">ATM Bank Branch *</Label>
            <Select 
              value={formData.atm_bank_branch || ''} 
              onValueChange={(value) => handleInputChange("atm_bank_branch", value)}
            >
              <SelectTrigger className={cn("w-full mt-2", getFieldError("atm_bank_branch") && "border-red-500")}>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="c1">Bank Branch 1</SelectItem>
                <SelectItem value="c2">Bank Branch 2</SelectItem>
              </SelectContent>
            </Select>
            {getFieldError("atm_bank_branch") && <p className="text-sm text-red-500 mt-1">{getFieldError("atm_bank_branch")}</p>}
          </div>
        </div>
             <div className="grid grid-cols-3 gap-6">
                       <div>
             <Label htmlFor="atm_account_number">ATM Account Number  *</Label>
           <Input
              id="atm_account_number"
              placeholder="ATM Account Number  "
              className={cn("mt-2", getFieldError("atm_account_number") && "border-red-500")}
              value={formData.atm_account_number}
              onChange={(e) => handleInputChange("atm_account_number", e.target.value)}
            />
            {getFieldError("atm_account_number") && <p className="text-sm text-red-500 mt-1">{getFieldError("atm_account_number")}</p>}
          </div>

           <div>
             <Label htmlFor="atm_card_number">ATM Card Number  *</Label>
           <Input
              id="atm_card_number"
              placeholder="ATM Card Number  "
              className={cn("mt-2", getFieldError("atm_card_number") && "border-red-500")}
              value={formData.atm_card_number}
              onChange={(e) => handleInputChange("atm_card_number", e.target.value)}
            />
            {getFieldError("atm_card_number") && <p className="text-sm text-red-500 mt-1">{getFieldError("atm_card_number")}</p>}
          </div>
               <div>
            <Label htmlFor="atm_expiration_date">ATM Expiration Date *</Label>
           <Input
  type="date"
  value={
    formData.atm_expiration_date
      ? format(new Date(formData.atm_expiration_date), "yyyy-MM-dd")
      : ""
  }
  onChange={(e) => {
    const value = e.target.value;
    const dateValue = value ? new Date(value + "T00:00:00") : undefined;
    handleInputChange("atm_expiration_date", dateValue);
  }}
  className={`mt-2 pr-10 relative
    [&::-webkit-calendar-picker-indicator]:absolute
    [&::-webkit-calendar-picker-indicator]:right-3
    [&::-webkit-calendar-picker-indicator]:top-1/2
    [&::-webkit-calendar-picker-indicator]:-translate-y-1/2
    [&::-webkit-calendar-picker-indicator]:cursor-pointer
    [&::-webkit-calendar-picker-indicator]:text-black
    ${getFieldError("atm_expiration_date") ? "border-red-500" : ""}
  `}
  style={{ colorScheme: "light" }}
/>
                  {getFieldError("atm_expiration_date") && <p className="text-sm text-red-500 mt-1">{getFieldError("atm_expiration_date")}</p>}
          </div>
        </div>
        </div>

          {/* UMID Information */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold border-b pb-2">UMID (Required if DepEd)</h3>
      <div className="grid grid-cols-3 gap-6">
          <div>
            <Label htmlFor="umid_type">Type of UMID Card*</Label>
            <Select 
              value={formData.umid_type || ''} 
              onValueChange={(value) => handleInputChange("umid_type", value)}
            >
              <SelectTrigger className={cn("w-full mt-2", getFieldError("umid_type") && "border-red-500")}>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="c1">UMID 1</SelectItem>
                <SelectItem value="c2">UMID 2</SelectItem>
              </SelectContent>
            </Select>
            {getFieldError("umid_type") && <p className="text-sm text-red-500 mt-1">{getFieldError("umid_type")}</p>}
          </div>
                       <div>
             <Label htmlFor="umid_card_no">UMID Card No.  *</Label>
           <Input
              id="umid_card_no"
              placeholder="UMID Card No. "
              className={cn("mt-2", getFieldError("umid_card_no") && "border-red-500")}
              value={formData.umid_card_no}
              onChange={(e) => handleInputChange("umid_card_no", e.target.value)}
            />
            {getFieldError("umid_card_no") && <p className="text-sm text-red-500 mt-1">{getFieldError("umid_card_no")}</p>}
          </div>

          <div>
            <Label htmlFor="atm_bank_branch">ATM Bank Branch *</Label>
            <Select 
              value={formData.atm_bank_branch || ''} 
              onValueChange={(value) => handleInputChange("atm_bank_branch", value)}
            >
              <SelectTrigger className={cn("w-full mt-2", getFieldError("atm_bank_branch") && "border-red-500")}>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="c1">Branch 1</SelectItem>
                <SelectItem value="c2">Branch 2</SelectItem>
              </SelectContent>
            </Select>
            {getFieldError("atm_bank_branch") && <p className="text-sm text-red-500 mt-1">{getFieldError("atm_bank_branch")}</p>}
          </div>
        </div>
        </div>
    </div>
  )
}