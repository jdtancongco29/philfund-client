"use client"

import { useState, useEffect } from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface PhilfundCashCardData {
  bankName: string
  cardNumber: string
  accountNumber: string
  cardExpiryDate: Date | undefined
}

interface PhilfundCashCardTabProps {
  formData?: PhilfundCashCardData
  validationErrors?: { [key: string]: string }
  onUpdateFormData?: (data: PhilfundCashCardData) => void
}

export function PhilfundCashCardTab({ 
  formData = {
    bankName: "",
    cardNumber: "",
    accountNumber: "",
    cardExpiryDate: undefined
  },
  validationErrors = {},
  onUpdateFormData 
}: PhilfundCashCardTabProps) {
  const [localData, setLocalData] = useState<PhilfundCashCardData>(formData)

  useEffect(() => {
    setLocalData(formData)
  }, [formData])

  const updateField = (field: keyof PhilfundCashCardData, value: any) => {
    const updatedData = { ...localData, [field]: value }
    setLocalData(updatedData)
    
    if (onUpdateFormData) {
      onUpdateFormData(updatedData)
    }
  }

  const getFieldError = (field: string) => {
    return validationErrors[field]
  }

  return (
    <div className="space-y-8 p-6">
      <div className="space-y-6">
        <h3 className="text-lg font-semibold border-b pb-2">Cash Card Information</h3>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label htmlFor="bank-name">Cash Card Bank name *</Label>
            <Input 
              id="bank-name" 
              placeholder="Enter bank name" 
              className={cn("mt-2", validationErrors.bankName && "border-red-500")}
              value={localData.bankName}
              onChange={(e) => updateField('bankName', e.target.value)}
            />
            {validationErrors.bankName && (
              <p className="text-sm text-red-500 mt-1">{validationErrors.bankName}</p>
            )}
          </div>
          <div>
            <Label htmlFor="card-number">Cash card number *</Label>
            <Input 
              id="card-number" 
              placeholder="Enter card number" 
              className={cn("mt-2", validationErrors.cardNumber && "border-red-500")}
              value={localData.cardNumber}
              onChange={(e) => updateField('cardNumber', e.target.value)}
            />
            {validationErrors.cardNumber && (
              <p className="text-sm text-red-500 mt-1">{validationErrors.cardNumber}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label htmlFor="account-number">Account number *</Label>
            <Input 
              id="account-number" 
              placeholder="Enter account number" 
              className={cn("mt-2", validationErrors.accountNumber && "border-red-500")}
              value={localData.accountNumber}
              onChange={(e) => updateField('accountNumber', e.target.value)}
            />
            {validationErrors.accountNumber && (
              <p className="text-sm text-red-500 mt-1">{validationErrors.accountNumber}</p>
            )}
          </div>
          <div>
            <Label>Cash card expiry *</Label>
            <Input
              type="date"
              value={localData.cardExpiryDate ? format(new Date(localData.cardExpiryDate), "yyyy-MM-dd") : ""}
              onChange={(e) => {
                const dateValue = e.target.value ? new Date(e.target.value) : undefined;
                updateField("cardExpiryDate", dateValue);
              }}
              className={cn("mt-2 pr-10 relative", {
                "border-red-500": getFieldError("cardExpiryDate")
              })}
              style={{
                colorScheme: "light",
              }}
            />
            {validationErrors.cardExpiryDate && (
              <p className="text-sm text-red-500 mt-1">{validationErrors.cardExpiryDate}</p>
            )}
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg hidden">
          <h4 className="font-medium text-blue-900 mb-2">Important Notes:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Ensure the cash card information matches your official records</li>
            <li>• Double-check the card number and account number for accuracy</li>
            <li>• The expiry date should be current and valid</li>
            <li>• Contact your bank if you need to verify any information</li>
          </ul>
        </div>
      </div>
    </div>
  )
}