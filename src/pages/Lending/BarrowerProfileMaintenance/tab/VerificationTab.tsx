"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Upload, Camera, AlertCircle } from "lucide-react"

interface VerificationData {
  borrowerPhoto: File | null
  borrowerSignature: File | null
  homeSketch: File | null
  googleMapUrl: string
  isInterviewed: boolean
  interviewedBy: string
}

interface ValidationErrors {
  [key: string]: string
}

interface VerificationTabProps {
  formData?: VerificationData
  validationErrors?: ValidationErrors
  onUpdateFormData?: (data: Partial<VerificationData>) => void
}

export function VerificationTab({ 
  formData = {
    borrowerPhoto: null,
    borrowerSignature: null,
    homeSketch: null,
    googleMapUrl: "",
    isInterviewed: false,
    interviewedBy: ""
  },
  validationErrors = {},
  onUpdateFormData = () => {}
}: VerificationTabProps) {
  const [localData, setLocalData] = useState<VerificationData>(formData)

  const updateData = (updates: Partial<VerificationData>) => {
    const newData = { ...localData, ...updates }
    setLocalData(newData)
    onUpdateFormData(updates)
  }

  const handleFileUpload = (field: keyof Pick<VerificationData, 'borrowerPhoto' | 'borrowerSignature' | 'homeSketch'>, file: File | null) => {
    updateData({ [field]: file })
  }

  const handleTakePhoto = (field: keyof Pick<VerificationData, 'borrowerPhoto'>) => {
    // Simulate taking a photo - in real implementation, this would open camera
    console.log(`Taking photo for ${field}`)
    // For demo purposes, create a mock file
    const mockFile = new File([''], 'photo.jpg', { type: 'image/jpeg' })
    updateData({ [field]: mockFile })
  }

  return (
    <div className="space-y-8 p-6">
      <div className="space-y-6">
        <h3 className="text-lg font-semibold border-b pb-2">Document Uploads</h3>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label htmlFor="borrower-photo" className="flex items-center gap-2">
              Borrower Photo *
              {validationErrors.borrowerPhoto && (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
            </Label>
            <div className="space-y-2 mt-2">
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    const input = document.createElement('input')
                    input.type = 'file'
                    input.accept = 'image/*'
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0] || null
                      handleFileUpload('borrowerPhoto', file)
                    }
                    input.click()
                  }}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                </Button>
                <span className="text-sm text-muted-foreground">
                  {localData.borrowerPhoto ? localData.borrowerPhoto.name : "No file chosen"}
                </span>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleTakePhoto('borrowerPhoto')}
              >
                <Camera className="h-4 w-4 mr-2" />
                Take a Photo
              </Button>
            </div>
            {validationErrors.borrowerPhoto && (
              <p className="text-sm text-red-500 mt-1">{validationErrors.borrowerPhoto}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="borrower-signature" className="flex items-center gap-2">
              Borrower Signature *
              {validationErrors.borrowerSignature && (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
            </Label>
            <div className="flex items-center gap-2 mt-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  const input = document.createElement('input')
                  input.type = 'file'
                  input.accept = 'image/*'
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0] || null
                    handleFileUpload('borrowerSignature', file)
                  }
                  input.click()
                }}
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose File
              </Button>
              <span className="text-sm text-muted-foreground">
                {localData.borrowerSignature ? localData.borrowerSignature.name : "No file chosen"}
              </span>
            </div>
            {validationErrors.borrowerSignature && (
              <p className="text-sm text-red-500 mt-1">{validationErrors.borrowerSignature}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label htmlFor="home-sketch" className="flex items-center gap-2">
              Home Sketch *
              {validationErrors.homeSketch && (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
            </Label>
            <div className="flex items-center gap-2 mt-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  const input = document.createElement('input')
                  input.type = 'file'
                  input.accept = 'image/*,.pdf'
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0] || null
                    handleFileUpload('homeSketch', file)
                  }
                  input.click()
                }}
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose File
              </Button>
              <span className="text-sm text-muted-foreground">
                {localData.homeSketch ? localData.homeSketch.name : "No file chosen"}
              </span>
            </div>
            {validationErrors.homeSketch && (
              <p className="text-sm text-red-500 mt-1">{validationErrors.homeSketch}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="google-map" className="flex items-center gap-2">
              Google map url *
              {validationErrors.googleMapUrl && (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
            </Label>
            <Input 
              id="google-map" 
              placeholder="https://maps.google.com/..." 
              className="mt-2"
              value={localData.googleMapUrl}
              onChange={(e) => updateData({ googleMapUrl: e.target.value })}
            />
            {validationErrors.googleMapUrl && (
              <p className="text-sm text-red-500 mt-1">{validationErrors.googleMapUrl}</p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-semibold border-b pb-2">Tracking Information</h3>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="font-medium">Taken By:</Label>
            <span className="text-sm text-muted-foreground">Current user</span>
          </div>
          <div className="space-y-2">
            <Label className="font-medium">Date:</Label>
            <span className="text-sm text-muted-foreground">{new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            })}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="font-medium">Authenticated By:</Label>
            <span className="text-sm text-muted-foreground">Current user</span>
          </div>
          <div className="space-y-2">
            <Label className="font-medium">Authentication Date:</Label>
            <span className="text-sm text-muted-foreground">{new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            })}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="font-medium">Signature Taken By:</Label>
            <span className="text-sm text-muted-foreground">Current user</span>
          </div>
          <div className="space-y-2">
            <Label className="font-medium">Signature Authenticated By:</Label>
            <span className="text-sm text-muted-foreground">Current user</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="font-medium">Signature Taken Date:</Label>
            <span className="text-sm text-muted-foreground">{new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            })}</span>
          </div>
          <div className="space-y-2">
            <Label className="font-medium">Client Profile Taken By:</Label>
            <span className="text-sm text-muted-foreground">Current user</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="font-medium">Authenticated & Approved By:</Label>
          <span className="text-sm text-muted-foreground">Manager</span>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-semibold border-b pb-2">Interview Status</h3>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="interviewed" 
              checked={localData.isInterviewed} 
              onCheckedChange={(checked) => {
                if (typeof checked === "boolean") {
                  updateData({ isInterviewed: checked })
                }
              }} 
            />
            <Label htmlFor="interviewed">Interviewed</Label>
          </div>

          <div className="flex items-center gap-2">
            <Label className="font-medium">Interviewed by:</Label>
            {localData.isInterviewed ? (
              <Input
                placeholder="Enter interviewer name"
                value={localData.interviewedBy}
                onChange={(e) => updateData({ interviewedBy: e.target.value })}
                className="max-w-xs"
              />
            ) : (
              <Badge className="bg-yellow-500 text-white">Pending</Badge>
            )}
          </div>
          
          {validationErrors.interviewedBy && (
            <p className="text-sm text-red-500">{validationErrors.interviewedBy}</p>
          )}
        </div>
      </div>
    </div>
  )
}