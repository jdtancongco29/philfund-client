"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarIcon, Plus, Upload, Edit, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface AuthorizedPerson {
  id: string
  name: string
  relationship: string
  address: string
  contactNumber: string
  yearsKnown: string
  validIdType: string
  validIdNumber: string
  placeIssued: string
  dateIssued: Date | undefined
  signature: File | null
  photo: File | null
}

interface AuthorizationTabProps {
  validationErrors?: { [key: string]: string }
  onValidationChange?: (isValid: boolean) => void
}

export function AuthorizationTab({ validationErrors = {}, onValidationChange }: AuthorizationTabProps) {
  const [authorizedPersons, setAuthorizedPersons] = useState<AuthorizedPerson[]>([])
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
    if (!currentPerson.signature) {
      errors.signature = "Signature is required"
    }
    if (!currentPerson.photo) {
      errors.photo = "Photo is required"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const validateAuthorizedPersons = (): boolean => {
    const isValid = authorizedPersons.length > 0
    if (onValidationChange) {
      onValidationChange(isValid)
    }
    return isValid
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
  }

  const addOrUpdateAuthorizedPerson = () => {
    if (!validateCurrentPerson()) {
      return
    }

    if (editingId) {
      setAuthorizedPersons(prev => 
        prev.map(person => 
          person.id === editingId 
            ? { ...currentPerson, id: editingId }
            : person
        )
      )
    } else {
      const newPerson: AuthorizedPerson = {
        ...currentPerson,
        id: Date.now().toString(),
      }
      setAuthorizedPersons(prev => [...prev, newPerson])
    }

    resetForm()
    validateAuthorizedPersons()
  }

  const editAuthorizedPerson = (person: AuthorizedPerson) => {
    setCurrentPerson(person)
    setEditingId(person.id)
    setFormErrors({})
  }

  const removeAuthorizedPerson = (id: string) => {
    setAuthorizedPersons(prev => prev.filter(person => person.id !== id))
    if (editingId === id) {
      resetForm()
    }
    validateAuthorizedPersons()
  }

  const handleFileUpload = (type: 'signature' | 'photo') => (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    setCurrentPerson(prev => ({ ...prev, [type]: file }))
    if (file && formErrors[type]) {
      setFormErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[type]
        return newErrors
      })
    }
  }

  const updateCurrentPerson = (field: keyof AuthorizedPerson, value: any) => {
    setCurrentPerson(prev => ({ ...prev, [field]: value }))
    if (formErrors[field]) {
      setFormErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }
  const getFieldError = (field: string) => {
    return validationErrors[field]
  }

  
  return (
    <div className="space-y-8 p-6">
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
                  className={cn("mt-2", formErrors.name && "border-red-500")}
                  value={currentPerson.name}
                  onChange={(e) => updateCurrentPerson('name', e.target.value)}
                />
                {formErrors.name && (
                  <p className="text-sm text-red-500 mt-1">{formErrors.name}</p>
                )}
              </div>
              <div>
                <Label htmlFor="auth-relationship">Relationship *</Label>
                <Input 
                  id="auth-relationship" 
                  placeholder="Enter relationship" 
                  className={cn("mt-2", formErrors.relationship && "border-red-500")}
                  value={currentPerson.relationship}
                  onChange={(e) => updateCurrentPerson('relationship', e.target.value)}
                />
                {formErrors.relationship && (
                  <p className="text-sm text-red-500 mt-1">{formErrors.relationship}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="auth-address">Address *</Label>
              <Textarea 
                id="auth-address" 
                placeholder="Enter Address" 
                className={cn("mt-2", formErrors.address && "border-red-500")}
                value={currentPerson.address}
                onChange={(e) => updateCurrentPerson('address', e.target.value)}
              />
              {formErrors.address && (
                <p className="text-sm text-red-500 mt-1">{formErrors.address}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="auth-contact">Contact Number *</Label>
                <Input 
                  id="auth-contact" 
                  placeholder="Enter contact number" 
                  className={cn("mt-2", formErrors.contactNumber && "border-red-500")}
                  value={currentPerson.contactNumber}
                  onChange={(e) => updateCurrentPerson('contactNumber', e.target.value)}
                />
                {formErrors.contactNumber && (
                  <p className="text-sm text-red-500 mt-1">{formErrors.contactNumber}</p>
                )}
              </div>
              <div>
                <Label htmlFor="auth-years">Years Known *</Label>
                <Input 
                  id="auth-years" 
                  placeholder="Enter number of years" 
                  className={cn("mt-2", formErrors.yearsKnown && "border-red-500")}
                  value={currentPerson.yearsKnown}
                  onChange={(e) => updateCurrentPerson('yearsKnown', e.target.value)}
                />
                {formErrors.yearsKnown && (
                  <p className="text-sm text-red-500 mt-1">{formErrors.yearsKnown}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="auth-id-type">Valid ID Type *</Label>
                <Select 
                  value={currentPerson.validIdType} 
                  onValueChange={(value) => updateCurrentPerson('validIdType', value)}
                >
                  <SelectTrigger className={cn("mt-2 w-full", formErrors.validIdType && "border-red-500")}>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="drivers-license">Driver's License</SelectItem>
                    <SelectItem value="passport">Passport</SelectItem>
                    <SelectItem value="sss">SSS ID</SelectItem>
                    <SelectItem value="philhealth">PhilHealth ID</SelectItem>
                    <SelectItem value="umid">UMID</SelectItem>
                    <SelectItem value="tin">TIN ID</SelectItem>
                  </SelectContent>
                </Select>
                {formErrors.validIdType && (
                  <p className="text-sm text-red-500 mt-1">{formErrors.validIdType}</p>
                )}
              </div>
              <div>
                <Label htmlFor="auth-id-number">Valid ID Number *</Label>
                <Input 
                  id="auth-id-number" 
                  placeholder="Enter ID number" 
                  className={cn("mt-2", formErrors.validIdNumber && "border-red-500")}
                  value={currentPerson.validIdNumber}
                  onChange={(e) => updateCurrentPerson('validIdNumber', e.target.value)}
                />
                {formErrors.validIdNumber && (
                  <p className="text-sm text-red-500 mt-1">{formErrors.validIdNumber}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="auth-place">Place Issued *</Label>
                <Input 
                  id="auth-place" 
                  placeholder="Enter place" 
                  className={cn("mt-2", formErrors.placeIssued && "border-red-500")}
                  value={currentPerson.placeIssued}
                  onChange={(e) => updateCurrentPerson('placeIssued', e.target.value)}
                />
                {formErrors.placeIssued && (
                  <p className="text-sm text-red-500 mt-1">{formErrors.placeIssued}</p>
                )}
              </div>
              <div>
                <Label>Date Issued *</Label>
               <Input
    type="date"
    value={currentPerson.dateIssued ? format(new Date(currentPerson.dateIssued), "yyyy-MM-dd") : ""}
    onChange={(e) => {
      const dateValue = e.target.value ? new Date(e.target.value) : undefined;
      updateCurrentPerson("dateIssued", dateValue);
    }}
    className={`mt-2
      pr-10
      relative
      [&::-webkit-calendar-picker-indicator]:absolute
      [&::-webkit-calendar-picker-indicator]:right-3
      [&::-webkit-calendar-picker-indicator]:top-1/2
      [&::-webkit-calendar-picker-indicator]:-translate-y-1/2
      [&::-webkit-calendar-picker-indicator]:cursor-pointer
      [&::-webkit-calendar-picker-indicator]:text-black
      ${getFieldError("dateIssued") ? "border-red-500" : ""}
    `}
    style={{
      colorScheme: "light",
    }}
  />
                {formErrors.dateIssued && (
                  <p className="text-sm text-red-500 mt-1">{formErrors.dateIssued}</p>
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
                    className={cn(formErrors.signature && "border-red-500")}
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
                    onChange={handleFileUpload('signature')}
                  />
                  <span className="text-sm text-muted-foreground">
                    {currentPerson.signature ? currentPerson.signature.name : "No file chosen"}
                  </span>
                </div>
                {formErrors.signature && (
                  <p className="text-sm text-red-500 mt-1">{formErrors.signature}</p>
                )}
              </div>
              <div>
                <Label htmlFor="auth-photo">Photo *</Label>
                <div className="flex items-center gap-2 mt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    asChild
                    className={cn(formErrors.photo && "border-red-500")}
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
                    onChange={handleFileUpload('photo')}
                  />
                  <span className="text-sm text-muted-foreground">
                    {currentPerson.photo ? currentPerson.photo.name : "No file chosen"}
                  </span>
                </div>
                {formErrors.photo && (
                  <p className="text-sm text-red-500 mt-1">{formErrors.photo}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={resetForm}>
                {editingId ? "Cancel" : "Reset"}
              </Button>
              <Button onClick={addOrUpdateAuthorizedPerson}>
                {editingId ? "Update Person" : "Add Person"}
              </Button>
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

            {authorizedPersons.map((person) => (
              <div key={person.id} className="grid grid-cols-3 gap-6 items-center">
                <span>{person.name}</span>
                <span>{person.relationship}</span>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => editAuthorizedPerson(person)}
                  >
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