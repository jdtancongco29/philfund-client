"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Upload, Camera, AlertCircle, X, Check } from "lucide-react"

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

export default function VerificationTab({ 
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
  const [showCamera, setShowCamera] = useState<string | null>(null)
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const updateData = (updates: Partial<VerificationData>) => {
    const newData = { ...localData, ...updates }
    setLocalData(newData)
    onUpdateFormData(updates)
  }

  const handleFileUpload = (field: keyof Pick<VerificationData, 'borrowerPhoto' | 'borrowerSignature' | 'homeSketch'>, file: File | null) => {
    updateData({ [field]: file })
  }

  const startCamera = async (field: string) => {
    setIsLoading(true)
    setCameraError(null)
    
    try {
      // Check if mediaDevices is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported in this browser')
      }

      // Request camera access with fallback constraints
      let stream
      try {
        // Try with basic constraints first (more reliable)
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: {
            width: { min: 320, ideal: 640, max: 1280 },
            height: { min: 240, ideal: 480, max: 720 }
          }
        })
      } catch (error) {
        // Even more basic fallback
        console.warn('Failed with basic constraints, trying minimal:', error)
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: true 
        })
      }

      console.log('Stream obtained:', stream)
      setCameraStream(stream)
      setShowCamera(field)
      
      // Use a timeout to ensure the modal is rendered before setting up video
      setTimeout(() => {
        if (videoRef.current && stream) {
          console.log('Setting up video element')
          
          const video = videoRef.current
          video.srcObject = stream
          
          // Force loading to start
          video.load()
          
          // Set up event handlers
          const handleLoadedData = () => {
            console.log('Video data loaded')
            setIsLoading(false)
          }
          
          const handleCanPlay = () => {
            console.log('Video can play')
            video.play().then(() => {
              console.log('Video playing successfully')
              setIsLoading(false)
            }).catch(e => {
              console.error('Play failed:', e)
              setCameraError('Failed to play video')
              setIsLoading(false)
            })
          }
          
          const handleError = (e: any) => {
            console.error('Video error:', e)
            setCameraError('Video error occurred')
            setIsLoading(false)
          }
          
          // Remove existing listeners first
          video.removeEventListener('loadeddata', handleLoadedData)
          video.removeEventListener('canplay', handleCanPlay)
          video.removeEventListener('error', handleError)
          
          // Add new listeners
          video.addEventListener('loadeddata', handleLoadedData)
          video.addEventListener('canplay', handleCanPlay)
          video.addEventListener('error', handleError)
          
          // Timeout fallback - if video doesn't load in 10 seconds, show error
          const timeoutId = setTimeout(() => {
            if (isLoading) {
              console.error('Video loading timeout')
              setCameraError('Camera loading timeout. Please try again.')
              setIsLoading(false)
            }
          }, 10000)
          
          // Clean up timeout when component unmounts or camera stops
          return () => clearTimeout(timeoutId)
        }
      }, 100)
      
    } catch (error) {
      console.error('Error accessing camera:', error)
      setIsLoading(false)
      
      let errorMessage = 'Unable to access camera. '
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          errorMessage += 'Please allow camera permissions and try again.'
        } else if (error.name === 'NotFoundError') {
          errorMessage += 'No camera found on this device.'
        } else if (error.name === 'NotSupportedError') {
          errorMessage += 'Camera not supported in this browser.'
        } else {
          errorMessage += error.message
        }
      }
      
      setCameraError(errorMessage)
      alert(errorMessage)
    }
  }

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop())
      setCameraStream(null)
    }
    setShowCamera(null)
    setCameraError(null)
    setIsLoading(false)
  }

  const capturePhoto = (field: keyof Pick<VerificationData, 'borrowerPhoto'>) => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      const context = canvas.getContext('2d')
      
      if (context) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0)
        
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `${field}-${Date.now()}.jpg`, { type: 'image/jpeg' })
            handleFileUpload(field, file)
            stopCamera()
          }
        }, 'image/jpeg', 0.8)
      }
    }
  }

  return (
    <div className="space-y-8 p-6">
      {/* Camera Modal */}
      {showCamera && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Take Photo</h3>
              <Button variant="ghost" size="sm" onClick={stopCamera}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="relative bg-black rounded-lg overflow-hidden">
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white z-10">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                      <p>Starting camera...</p>
                    </div>
                  </div>
                )}
                {cameraError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-red-900 text-white z-10">
                    <div className="text-center p-4">
                      <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm">{cameraError}</p>
                    </div>
                  </div>
                )}
                <video 
                  ref={videoRef} 
                  className="w-full h-64 object-cover"
                  autoPlay 
                  muted 
                  playsInline
                  style={{ transform: 'scaleX(-1)' }} // Mirror the video for better UX
                />
              </div>
              
              {/* Test button to manually try playing video */}
              {isLoading && (
                <div className="flex justify-center mt-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      if (videoRef.current) {
                        console.log('Manual play attempt')
                        videoRef.current.play().then(() => {
                          console.log('Manual play successful')
                          setIsLoading(false)
                        }).catch(e => {
                          console.error('Manual play failed:', e)
                          setCameraError('Manual play failed: ' + e.message)
                          setIsLoading(false)
                        })
                      }
                    }}
                  >
                    Try Manual Play
                  </Button>
                </div>
              )}
              
              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={stopCamera}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => capturePhoto(showCamera as 'borrowerPhoto')}
                  disabled={isLoading || !!cameraError}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Capture Photo
                </Button>
              </div>
              
              {/* Debug info - remove in production */}
              <div className="text-xs text-gray-500 text-center">
                Stream active: {cameraStream ? 'Yes' : 'No'} | 
                Video ready: {videoRef.current?.readyState === 4 ? 'Yes' : 'No'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

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
                onClick={() => startCamera('borrowerPhoto')}
              >
                <Camera className="h-4 w-4 mr-2" />
                Take a Photo
              </Button>
              {localData.borrowerPhoto && (
                <div className="flex items-center gap-2 text-green-600">
                  <Check className="h-4 w-4" />
                  <span className="text-sm">Photo uploaded successfully</span>
                </div>
              )}
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
            {localData.borrowerSignature && (
              <div className="flex items-center gap-2 text-green-600 mt-2">
                <Check className="h-4 w-4" />
                <span className="text-sm">Signature uploaded successfully</span>
              </div>
            )}
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
            {localData.homeSketch && (
              <div className="flex items-center gap-2 text-green-600 mt-2">
                <Check className="h-4 w-4" />
                <span className="text-sm">Sketch uploaded successfully</span>
              </div>
            )}
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