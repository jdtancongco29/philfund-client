"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Upload } from 'lucide-react'

import { CircleCheck } from 'lucide-react' // or wherever CircleCheck is exported from
import { toast } from "sonner"

interface BulkUploadDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    uploadType: "borrower-profiles" | "beginning-balance"
}

export function BulkUploadDialog({ open, onOpenChange, uploadType }: BulkUploadDialogProps) {
    // For demonstration, we use an array with 3 items. You can adjust it as needed.
    const [uploadStates] = useState<("idle" | "success" | "error")[]>(["idle", "idle", "idle"])

    const getTitle = () => {
        return uploadType === "borrower-profiles" ? "Upload Borrower Profiles" : "Upload Beginning Balance"
    }

    const getDescription = () => {
        return "Excel file must follow a specific format. You may download the file here"
    }

    const handleFileUpload = (index: number) => {
        // Simulate a successful upload action. If needed, update your logic accordingly.
        toast.success("File Uploaded", {
            description: `File for card ${index + 1} was successfully uploaded.`,
            icon: <CircleCheck className="h-5 w-5" />,
            duration: 5000,
        })
        console.log(`Upload file for card ${index}`)
    }

    const renderUploadCard = (_status: "idle" | "success" | "error", index: number) => {
        return (
            <Card key={index} className="w-full">
                <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-8 h-8 text-gray-600" />
                        </div>
                        
                        <div>
                            <h3 className="font-semibold text-lg">{getTitle()}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{getDescription()}</p>
                        </div>

                        <div className="w-full space-y-3">
                            <div>
                                <label className="text-sm font-medium">CSV File *</label>
                                <div className="flex items-center gap-2 mt-1">
                                    <Button variant="outline" size="sm">
                                        Choose File
                                    </Button>
                                    <span className="text-sm text-muted-foreground">No file chosen</span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Upload a CSV file containing {uploadType === "borrower-profiles" ? "borrower" : "balance"} profiles
                                </p>
                            </div>

                            <Button 
                                className="w-full" 
                                onClick={() => handleFileUpload(index)}
                            >
                                <Upload className="w-4 h-4 mr-2" />
                                Upload file now
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-6xl w-[90vw] h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Bulk Uploads</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                    {uploadStates.map((status, index) => renderUploadCard(status, index))}
                </div>
            </DialogContent>
        </Dialog>
    )
}
