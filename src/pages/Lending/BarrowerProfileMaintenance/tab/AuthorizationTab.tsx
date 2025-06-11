"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Plus, Upload, Edit, Trash2, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import type { AuthorizedPerson, ValidationErrors, FormData } from "../Services/AddBorrowersTypes"

interface AuthorizationTabProps {
  formData: FormData
  validationErrors?: ValidationErrors
  onUpdateFormData: (updates: Partial<FormData>) => void
}

export function AuthorizationTab({ formData, validationErrors = {}, onUpdateFormData }: AuthorizationTabProps) {
  const [currentPerson, setCurrentPerson] = useState<AuthorizedPerson>({
    id: "",
    name: "",
    relationship: "",
    address: "",
    contactNumber: "",
    yearsKnown: "",
    validIdType: "",
    validIdNumber: "",
    placeIssued: "",
    dateIssued: undefined,
    signature: null,
    photo: null,
  })
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({})
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [apiErrorMessage, setApiErrorMessage] = useState<string | null>(null)

  // Initialize authorized persons from form data
  const authorizedPersons = formData.authorizedPersons || []

  // Extract API error message if present
  useEffect(() => {
    // Check if there's an API error message related to authorization
    const authErrorKeys = Object.keys(validationErrors).filter(
      (key) => key.startsWith("authorization_") || key === "authorization",
    )

    if (authErrorKeys.length > 0) {
      // Find a general error message if available
      const generalError = validationErrors["authorization"] || "Please correct the highlighted fields to continue."
      setApiErrorMessage(generalError)
    } else {
      setApiErrorMessage(null)
    }
  }, [validationErrors])

  // Update the validateCurrentPerson function to check for empty objects
  const validateCurrentPerson = (): boolean => {
    const errors: { [key: string]: string } = {}

    if (!currentPerson.name.trim()) {
      errors.name = "Full Name is required"
    }
    if (!currentPerson.relationship.trim()) {
      errors.relationship = "Relationship is required"
    }
    if (!currentPerson.address.trim()) {
      errors.address = "Address is required"
    }
    if (!currentPerson.contactNumber.trim()) {
      errors.contactNumber = "Contact Number is required"
    } else if (currentPerson.contactNumber.length !== 11) {
      errors.contactNumber = "Contact Number must be 11 digits"
    }
    if (!currentPerson.yearsKnown.trim()) {
      errors.yearsKnown = "Years Known is required"
    }
    if (!currentPerson.validIdType) {
      errors.validIdType = "Valid ID Type is required"
    }
    if (!currentPerson.validIdNumber.trim()) {
      errors.validIdNumber = "Valid ID Number is required"
    }
    if (!currentPerson.placeIssued.trim()) {
      errors.placeIssued = "Place Issued is required"
    }
    if (!currentPerson.dateIssued) {
      errors.dateIssued = "Date Issued is required"
    }

    // Check if signature is null, undefined, empty object, or invalid file
    if (!currentPerson.signature) {
      errors.signature = "Signature is required"
    }

    if (!currentPerson.photo) {
      errors.photo = "Photo is required"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const resetForm = () => {
    setCurrentPerson({
      id: "",
      name: "",
      relationship: "",
      address: "",
      contactNumber: "",
      yearsKnown: "",
      validIdType: "",
      validIdNumber: "",
      placeIssued: "",
      dateIssued: undefined,
      signature: null,
      photo: null,
    })
    setFormErrors({})
    setEditingId(null)
    setEditingIndex(null)
  }

  const addOrUpdateAuthorizedPerson = () => {
    if (!validateCurrentPerson()) {
      return
    }

    let updatedPersons: AuthorizedPerson[]

    if (editingId) {
      updatedPersons = authorizedPersons.map((person) =>
        person.id === editingId ? { ...currentPerson, id: editingId } : person,
      )
    } else {
      const newPerson: AuthorizedPerson = {
        ...currentPerson,
        id: Date.now().toString(),
      }
      updatedPersons = [...authorizedPersons, newPerson]
    }

    onUpdateFormData({ authorizedPersons: updatedPersons })
    resetForm()
  }

  const editAuthorizedPerson = (person: AuthorizedPerson, index: number) => {
    setCurrentPerson(person)
    setEditingId(person.id)
    setEditingIndex(index)
    setFormErrors({})
  }

  const removeAuthorizedPerson = (id: string) => {
    const updatedPersons = authorizedPersons.filter((person) => person.id !== id)
    onUpdateFormData({ authorizedPersons: updatedPersons })

    if (editingId === id) {
      resetForm()
    }
  }

  const handleFileUpload = (type: "signature" | "photo") => (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    console.log(`${type} file selected:`, file)

    // Store the file directly
    setCurrentPerson((prev) => ({ ...prev, [type]: file || null }))

    // Clear validation error if a file is selected
    if (file && formErrors[type]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[type]
        return newErrors
      })
    }

    // Reset the input value to allow selecting the same file again if needed
    event.target.value = ""
  }

  const updateCurrentPerson = (field: keyof AuthorizedPerson, value: any) => {
    setCurrentPerson((prev) => ({ ...prev, [field]: value }))
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const getFieldError = (field: string): string | undefined => {
    // First check for specific API errors if we're editing an existing person
    if (editingIndex !== null) {
      const apiErrorKey = `authorization_${editingIndex}_${field}`
      if (validationErrors[apiErrorKey]) {
        return validationErrors[apiErrorKey]
      }
    }

    // Then check for form errors
    if (formErrors[field]) {
      return formErrors[field]
    }

    // Finally check for general field errors
    return validationErrors[field]
  }

  // Replace the validIdTypes array with the provided list
  const validIdTypes = [
    { value: "philippine passport", label: "Philippine Passport" },
    { value: "drivers license", label: "Driver's License" },
    { value: "umid", label: "UMID" },
    { value: "prc id", label: "PRC ID" },
    { value: "postal id", label: "Postal ID" },
    { value: "sss id", label: "SSS ID" },
    { value: "gsis ecard", label: "GSIS eCard" },
    { value: "voters id", label: "Voter's ID" },
    { value: "philhealth id", label: "PhilHealth ID" },
    { value: "tin id", label: "TIN ID" },
    { value: "senior citizen id", label: "Senior Citizen ID" },
    { value: "pwd id", label: "PWD ID" },
    { value: "national id", label: "National ID" },
    { value: "ofw id", label: "OFW ID" },
    { value: "barangay clearance", label: "Barangay Clearance" },
    { value: "nbi clearance", label: "NBI Clearance" },
    { value: "police clearance", label: "Police Clearance" },
    { value: "firearms license", label: "Firearms License" },
    { value: "acr i-card", label: "ACR I-Card" },
    { value: "ibp id", label: "IBP ID" },
    { value: "seaman book", label: "Seaman's Book" },
    { value: "indigenous peoples id", label: "Indigenous Peoples ID" },
  ]

  return (
    <div className="space-y-8 p-6">
      {apiErrorMessage && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{apiErrorMessage}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-6 border-b pb-2">
            {editingId ? "Edit Authorized Person" : "Add Authorized Person"}
          </h3>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="auth-name">Full Name *</Label>
                <Input
                  id="auth-name"
                  placeholder="Enter name"
                  className={cn("mt-2", getFieldError("name") && "border-red-500")}
                  value={currentPerson.name}
                  onChange={(e) => updateCurrentPerson("name", e.target.value)}
                />
                {getFieldError("name") && <p className="text-sm text-red-500 mt-1">{getFieldError("name")}</p>}
              </div>
              <div>
                <Label htmlFor="auth-relationship">Relationship *</Label>
                <Input
                  id="auth-relationship"
                  placeholder="Enter relationship"
                  className={cn("mt-2", getFieldError("relationship") && "border-red-500")}
                  value={currentPerson.relationship}
                  onChange={(e) => updateCurrentPerson("relationship", e.target.value)}
                />
                {getFieldError("relationship") && (
                  <p className="text-sm text-red-500 mt-1">{getFieldError("relationship")}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="auth-address">Address *</Label>
              <Textarea
                id="auth-address"
                placeholder="Enter Address"
                className={cn("mt-2", getFieldError("address") && "border-red-500")}
                value={currentPerson.address}
                onChange={(e) => updateCurrentPerson("address", e.target.value)}
              />
              {getFieldError("address") && <p className="text-sm text-red-500 mt-1">{getFieldError("address")}</p>}
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="auth-contact">Contact Number * (11 digits)</Label>
                <Input
                  id="auth-contact"
                  placeholder="Enter contact number"
                  className={cn("mt-2", getFieldError("contactNumber") && "border-red-500")}
                  value={currentPerson.contactNumber}
                  onChange={(e) => updateCurrentPerson("contactNumber", e.target.value)}
                  maxLength={11}
                />
                {getFieldError("contactNumber") && (
                  <p className="text-sm text-red-500 mt-1">{getFieldError("contactNumber")}</p>
                )}
              </div>
              <div>
                <Label htmlFor="auth-years">Years Known *</Label>
                <Input
                  id="auth-years"
                  placeholder="Enter number of years"
                  className={cn("mt-2", getFieldError("yearsKnown") && "border-red-500")}
                  value={currentPerson.yearsKnown}
                  onChange={(e) => updateCurrentPerson("yearsKnown", e.target.value)}
                />
                {getFieldError("yearsKnown") && (
                  <p className="text-sm text-red-500 mt-1">{getFieldError("yearsKnown")}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="auth-id-type">Valid ID Type *</Label>
                <Select
                  value={currentPerson.validIdType}
                  onValueChange={(value) => updateCurrentPerson("validIdType", value)}
                >
                  <SelectTrigger className={cn("mt-2 w-full", getFieldError("validIdType") && "border-red-500")}>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    {validIdTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {getFieldError("validIdType") && (
                  <p className="text-sm text-red-500 mt-1">{getFieldError("validIdType")}</p>
                )}
              </div>
              <div>
                <Label htmlFor="auth-id-number">Valid ID Number *</Label>
                <Input
                  id="auth-id-number"
                  placeholder="Enter ID number"
                  className={cn("mt-2", getFieldError("validIdNumber") && "border-red-500")}
                  value={currentPerson.validIdNumber}
                  onChange={(e) => updateCurrentPerson("validIdNumber", e.target.value)}
                />
                {getFieldError("validIdNumber") && (
                  <p className="text-sm text-red-500 mt-1">{getFieldError("validIdNumber")}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="auth-place">Place Issued *</Label>
                <Input
                  id="auth-place"
                  placeholder="Enter place"
                  className={cn("mt-2", getFieldError("placeIssued") && "border-red-500")}
                  value={currentPerson.placeIssued}
                  onChange={(e) => updateCurrentPerson("placeIssued", e.target.value)}
                />
                {getFieldError("placeIssued") && (
                  <p className="text-sm text-red-500 mt-1">{getFieldError("placeIssued")}</p>
                )}
              </div>
              <div>
                <Label>Date Issued *</Label>
                <Input
                  type="date"
                  value={currentPerson.dateIssued ? format(new Date(currentPerson.dateIssued), "yyyy-MM-dd") : ""}
                  onChange={(e) => {
                    const dateValue = e.target.value ? new Date(e.target.value) : undefined
                    updateCurrentPerson("dateIssued", dateValue)
                  }}
                  className={cn("mt-2", getFieldError("dateIssued") && "border-red-500")}
                  style={{
                    colorScheme: "light",
                  }}
                />
                {getFieldError("dateIssued") && (
                  <p className="text-sm text-red-500 mt-1">{getFieldError("dateIssued")}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="auth-signature">Signature *</Label>
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className={cn(getFieldError("signature") && "border-red-500")}
                  >
                    <label htmlFor="signature-upload" className="cursor-pointer">
                      <Upload className="h-4 w-4 mr-2" />
                      Choose File
                    </label>
                  </Button>
                  <input
                    id="signature-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload("signature")}
                  />
                  <span className="text-sm text-muted-foreground">
                    {currentPerson.signature && currentPerson.signature.name
                      ? currentPerson.signature.name
                      : "No file chosen"}
                  </span>
                </div>
                {getFieldError("signature") && (
                  <p className="text-sm text-red-500 mt-1">{getFieldError("signature")}</p>
                )}
              </div>
              <div>
                <Label htmlFor="auth-photo">Photo *</Label>
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className={cn(getFieldError("photo") && "border-red-500")}
                  >
                    <label htmlFor="photo-upload" className="cursor-pointer">
                      <Upload className="h-4 w-4 mr-2" />
                      Choose File
                    </label>
                  </Button>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload("photo")}
                  />
                  <span className="text-sm text-muted-foreground">
                    {currentPerson.photo && currentPerson.photo.name ? currentPerson.photo.name : "No file chosen"}
                  </span>
                </div>
                {getFieldError("photo") && <p className="text-sm text-red-500 mt-1">{getFieldError("photo")}</p>}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={resetForm}>
                {editingId ? "Cancel" : "Reset"}
              </Button>
              <Button onClick={addOrUpdateAuthorizedPerson}>{editingId ? "Update Person" : "Add Person"}</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold border-b pb-2">Authorized Persons</h3>
            {validationErrors.authorization && (
              <p className="text-sm text-red-500 mt-1">{validationErrors.authorization}</p>
            )}
          </div>
          <Button onClick={() => resetForm()} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>

        {authorizedPersons.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No authorized persons added yet.</p>
            <p className="text-sm">Please add at least one authorized person to continue.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-6 font-medium text-sm">
              <Label>Name</Label>
              <Label>Relationship</Label>
              <Label>Actions</Label>
            </div>

            {authorizedPersons.map((person, index) => (
              <div key={person.id} className="grid grid-cols-3 gap-6 items-center">
                <span>{person.name}</span>
                <span>{person.relationship}</span>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => editAuthorizedPerson(person, index)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeAuthorizedPerson(person.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
