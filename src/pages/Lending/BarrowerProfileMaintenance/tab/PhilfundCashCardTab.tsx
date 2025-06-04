"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
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
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal mt-2",
                    !localData.cardExpiryDate && "text-muted-foreground",
                    validationErrors.cardExpiryDate && "border-red-500"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {localData.cardExpiryDate ? format(localData.cardExpiryDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar 
                  mode="single" 
                  selected={localData.cardExpiryDate} 
                  onSelect={(date) => updateField('cardExpiryDate', date)}
                  initialFocus 
                />
              </PopoverContent>
            </Popover>
            {validationErrors.cardExpiryDate && (
              <p className="text-sm text-red-500 mt-1">{validationErrors.cardExpiryDate}</p>
            )}
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
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