"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Upload, Camera } from "lucide-react"

export function WorkInformationTab() {
  const [isInterviewed, setIsInterviewed] = useState(false)
  const [fileNames, setFileNames] = useState({
    borrowerPhoto: "",
    borrowerSignature: "",
    homeSketch: "",
  })

  const borrowerPhotoRef = useRef<HTMLInputElement>(null)
  const borrowerSignatureRef = useRef<HTMLInputElement>(null)
  const homeSketchRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof typeof fileNames
  ) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileNames((prev) => ({ ...prev, [field]: file.name }))
    }
  }

  return (
    <div className="space-y-8 p-6">
      <div className="space-y-6">
        <h3 className="text-lg font-semibold border-b pb-2">Document Uploads</h3>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label htmlFor="borrower-photo">Borrower Photo *</Label>
            <div className="space-y-2 mt-2">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => borrowerPhotoRef.current?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                </Button>
                <span className="text-sm text-muted-foreground">
                  {fileNames.borrowerPhoto || "No file chosen"}
                </span>
                <input
                  type="file"
                  ref={borrowerPhotoRef}
                  className="hidden"
                  onChange={(e) => handleFileSelect(e, "borrowerPhoto")}
                />
              </div>
              <Button variant="outline" size="sm">
                <Camera className="h-4 w-4 mr-2" />
                Take a Photo
              </Button>
            </div>
          </div>
          <div>
            <Label htmlFor="borrower-signature">Borrower Signature *</Label>
            <div className="flex items-center gap-2 mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => borrowerSignatureRef.current?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose File
              </Button>
              <span className="text-sm text-muted-foreground">
                {fileNames.borrowerSignature || "No file chosen"}
              </span>
              <input
                type="file"
                ref={borrowerSignatureRef}
                className="hidden"
                onChange={(e) => handleFileSelect(e, "borrowerSignature")}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label htmlFor="home-sketch">Home Sketch *</Label>
            <div className="flex items-center gap-2 mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => homeSketchRef.current?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose File
              </Button>
              <span className="text-sm text-muted-foreground">
                {fileNames.homeSketch || "No file chosen"}
              </span>
              <input
                type="file"
                ref={homeSketchRef}
                className="hidden"
                onChange={(e) => handleFileSelect(e, "homeSketch")}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="google-map">Google map url *</Label>
            <Input id="google-map" placeholder="Google map url" className="mt-2" />
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
            <Label className="font-medium">Current user</Label>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="font-medium">Authenticated By:</Label>
            <span className="text-sm text-muted-foreground">Current user</span>
          </div>
          <div className="space-y-2">
            <Label className="font-medium">Date:</Label>
            <span className="text-sm text-muted-foreground">
              April 18, 2025 01:00 PM
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="font-medium">Signature Taken By</Label>
            <span className="text-sm text-muted-foreground">Current user</span>
          </div>
          <div className="space-y-2">
            <Label className="font-medium">Signature Authenticated By</Label>
            <span className="text-sm text-muted-foreground">Current user</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="font-medium">Signature Taken Date</Label>
            <span className="text-sm text-muted-foreground">Current user</span>
          </div>
          <div className="space-y-2">
            <Label className="font-medium">Client Profile Taken By</Label>
            <span className="text-sm text-muted-foreground">Current user</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="font-medium">Authenticated & Approved By</Label>
          <span className="text-sm text-muted-foreground">Manager</span>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-semibold border-b pb-2">Interview Status</h3>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="interviewed"
            checked={isInterviewed}
            onCheckedChange={(checked) => setIsInterviewed(checked === true)}
          />
          <Label htmlFor="interviewed">Interviewed</Label>
        </div>

        <div className="flex items-center gap-2">
          <Label className="font-medium">Interviewed by:</Label>
          <Badge className="bg-blue-500 text-white">Pending</Badge>
        </div>
      </div>
    </div>
  )
}
