"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import type { FormData, ValidationErrors } from "../AddBorrowerDialog"

interface BasicInfoTabProps {
  formData: FormData
  validationErrors: ValidationErrors
  onUpdateFormData: (updates: Partial<FormData>) => void
}

export function BasicInfoTab({ formData, validationErrors, onUpdateFormData }: BasicInfoTabProps) {
  const [dateOfDeath, setDateOfDeath] = useState<Date>()

  // Calculate age when birth date changes
  useEffect(() => {
    if (formData.birthDate) {
      const today = new Date()
      const birthDate = new Date(formData.birthDate)
      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }

      onUpdateFormData({ age: age.toString() })
    }
  }, [formData.birthDate, onUpdateFormData])

  const handleInputChange = (field: keyof FormData, value: string | Date | undefined) => {
    onUpdateFormData({ [field]: value })
  }

  const getFieldError = (field: string) => {
    return validationErrors[field]
  }

  const isMarried = formData.civilStatus === "married"

  return (
    <div className="space-y-8 p-6">
      <div className="grid gap-5">
        <div>
          <Label htmlFor="risk-level">Risk Level</Label>
          <Select value={formData.riskLevel} onValueChange={(value) => handleInputChange("riskLevel", value)}>
            <SelectTrigger className={cn("w-88 mt-2", getFieldError("riskLevel") && "border-red-500")}>
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="4">Super-Prime</SelectItem>
              <SelectItem value="3">Prime</SelectItem>
              <SelectItem value="2">Non-Prime</SelectItem>
              <SelectItem value="1">Declined</SelectItem>
            </SelectContent>
          </Select>
          {getFieldError("riskLevel") && <p className="text-sm text-red-500 mt-1">{getFieldError("riskLevel")}</p>}
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div>
            <Label htmlFor="last-name">Last Name *</Label>
            <Input
              id="last-name"
              placeholder="Enter last name"
              className={cn("mt-2", getFieldError("lastName") && "border-red-500")}
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
            />
            {getFieldError("lastName") && <p className="text-sm text-red-500 mt-1">{getFieldError("lastName")}</p>}
          </div>
          <div>
            <Label htmlFor="first-name">First Name *</Label>
            <Input
              id="first-name"
              placeholder="Enter first name"
              className={cn("mt-2", getFieldError("firstName") && "border-red-500")}
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
            />
            {getFieldError("firstName") && <p className="text-sm text-red-500 mt-1">{getFieldError("firstName")}</p>}
          </div>
          <div>
            <Label htmlFor="middle-name">Middle Name *</Label>
            <Input
              id="middle-name"
              placeholder="Enter middle name"
              className={cn("mt-2", getFieldError("middleName") && "border-red-500")}
              value={formData.middleName}
              onChange={(e) => handleInputChange("middleName", e.target.value)}
            />
            {getFieldError("middleName") && <p className="text-sm text-red-500 mt-1">{getFieldError("middleName")}</p>}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div>
            <Label htmlFor="suffix">Suffix</Label>
            <Input
              id="suffix"
              placeholder="Enter suffix"
              className={cn("mt-2", getFieldError("suffix") && "border-red-500")}
              value={formData.suffix}
              onChange={(e) => handleInputChange("suffix", e.target.value)}
            />
            {getFieldError("suffix") && <p className="text-sm text-red-500 mt-1">{getFieldError("suffix")}</p>}
          </div>
          <div>
            <Label htmlFor="civil-status">Civil Status *</Label>
            <Select value={formData.civilStatus} onValueChange={(value) => handleInputChange("civilStatus", value)}>
              <SelectTrigger className={cn("mt-2 w-full", getFieldError("civilStatus") && "border-red-500")}>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="married">Married</SelectItem>
                <SelectItem value="divorced">Divorced</SelectItem>
                <SelectItem value="widowed">Widowed</SelectItem>
              </SelectContent>
            </Select>
            {getFieldError("civilStatus") && (
              <p className="text-sm text-red-500 mt-1">{getFieldError("civilStatus")}</p>
            )}
          </div>
          <div>
            <Label htmlFor="gender">Gender *</Label>
            <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
              <SelectTrigger className={cn("mt-2 w-full", getFieldError("gender") && "border-red-500")}>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
            {getFieldError("gender") && <p className="text-sm text-red-500 mt-1">{getFieldError("gender")}</p>}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div>
            <Label>Birth Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal mt-2",
                    !formData.birthDate && "text-muted-foreground",
                    getFieldError("birthDate") && "border-red-500",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.birthDate ? format(formData.birthDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.birthDate}
                  onSelect={(date) => handleInputChange("birthDate", date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {getFieldError("birthDate") && <p className="text-sm text-red-500 mt-1">{getFieldError("birthDate")}</p>}
          </div>
          <div>
            <Label htmlFor="age">Age</Label>
            <Input id="age" placeholder="0" className="mt-2" value={formData.age} readOnly />
          </div>
          <div>
            <Label htmlFor="birth-place">Birth Place</Label>
            <Input
              id="birth-place"
              placeholder="Enter birth place"
              className={cn("mt-2", getFieldError("birthPlace") && "border-red-500")}
              value={formData.birthPlace}
              onChange={(e) => handleInputChange("birthPlace", e.target.value)}
            />
            {getFieldError("birthPlace") && <p className="text-sm text-red-500 mt-1">{getFieldError("birthPlace")}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label htmlFor="maiden-name">Maiden Name *</Label>
            <Input
              id="maiden-name"
              placeholder="Enter maiden name"
              className={cn("mt-2", getFieldError("maidenName") && "border-red-500")}
              value={formData.maidenName}
              onChange={(e) => handleInputChange("maidenName", e.target.value)}
            />
            {getFieldError("maidenName") && <p className="text-sm text-red-500 mt-1">{getFieldError("maidenName")}</p>}
          </div>
          <div>
            <Label htmlFor="nickname">Nickname</Label>
            <Input
              id="nickname"
              placeholder="Enter nickname"
              className={cn("mt-2", getFieldError("nickname") && "border-red-500")}
              value={formData.nickname}
              onChange={(e) => handleInputChange("nickname", e.target.value)}
            />
            {getFieldError("nickname") && <p className="text-sm text-red-500 mt-1">{getFieldError("nickname")}</p>}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-semibold border-b pb-2">Health</h3>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <Label htmlFor="blood-type">Blood Type *</Label>
              <Select value={formData.bloodType} onValueChange={(value) => handleInputChange("bloodType", value)}>
                <SelectTrigger className={cn("mt-2 w-full", getFieldError("bloodType") && "border-red-500")}>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a+">A+</SelectItem>
                  <SelectItem value="a-">A-</SelectItem>
                  <SelectItem value="b+">B+</SelectItem>
                  <SelectItem value="b-">B-</SelectItem>
                  <SelectItem value="ab+">AB+</SelectItem>
                  <SelectItem value="ab-">AB-</SelectItem>
                  <SelectItem value="o+">O+</SelectItem>
                  <SelectItem value="o-">O-</SelectItem>
                </SelectContent>
              </Select>
              {getFieldError("bloodType") && <p className="text-sm text-red-500 mt-1">{getFieldError("bloodType")}</p>}
            </div>
            <div>
              <Label htmlFor="health-condition">Health Condition *</Label>
              <Select
                value={formData.healthCondition}
                onValueChange={(value) => handleInputChange("healthCondition", value)}
              >
                <SelectTrigger className={cn("mt-2 w-full", getFieldError("healthCondition") && "border-red-500")}>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                </SelectContent>
              </Select>
              {getFieldError("healthCondition") && (
                <p className="text-sm text-red-500 mt-1">{getFieldError("healthCondition")}</p>
              )}
            </div>
            <div>
              <Label>Date of Death</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal mt-2",
                      !dateOfDeath && "text-muted-foreground",
                      getFieldError("dateOfDeath") && "border-red-500",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateOfDeath ? format(dateOfDeath, "PPP") : <span>Select Date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={dateOfDeath} onSelect={setDateOfDeath} initialFocus />
                </PopoverContent>
              </Popover>
              {getFieldError("dateOfDeath") && (
                <p className="text-sm text-red-500 mt-1">{getFieldError("dateOfDeath")}</p>
              )}
            </div>
          </div>
        </div>

        {isMarried && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold border-b pb-2">Spouse Information</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="spouse-name">Name *</Label>
                <Input
                  id="spouse-name"
                  placeholder="Enter spouse name"
                  className={cn("mt-2", getFieldError("spouseName") && "border-red-500")}
                  value={formData.spouseName}
                  onChange={(e) => handleInputChange("spouseName", e.target.value)}
                />
                {getFieldError("spouseName") && (
                  <p className="text-sm text-red-500 mt-1">{getFieldError("spouseName")}</p>
                )}
              </div>
              <div>
                <Label htmlFor="spouse-occupation">Occupation *</Label>
                <Input
                  id="spouse-occupation"
                  placeholder="Enter occupation"
                  className={cn("mt-2", getFieldError("spouseOccupation") && "border-red-500")}
                  value={formData.spouseOccupation}
                  onChange={(e) => handleInputChange("spouseOccupation", e.target.value)}
                />
                {getFieldError("spouseOccupation") && (
                  <p className="text-sm text-red-500 mt-1">{getFieldError("spouseOccupation")}</p>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="spouse-address">Address *</Label>
              <Textarea
                id="spouse-address"
                placeholder="Enter Address"
                className={cn("mt-2", getFieldError("spouseAddress") && "border-red-500")}
                value={formData.spouseAddress}
                onChange={(e) => handleInputChange("spouseAddress", e.target.value)}
              />
              {getFieldError("spouseAddress") && (
                <p className="text-sm text-red-500 mt-1">{getFieldError("spouseAddress")}</p>
              )}
            </div>
            <div>
              <Label htmlFor="spouse-contact">Contact Number *</Label>
              <Input
                id="spouse-contact"
                placeholder="Enter contact number"
                className={cn("mt-2", getFieldError("spouseContact") && "border-red-500")}
                value={formData.spouseContact}
                onChange={(e) => handleInputChange("spouseContact", e.target.value)}
              />
              {getFieldError("spouseContact") && (
                <p className="text-sm text-red-500 mt-1">{getFieldError("spouseContact")}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
