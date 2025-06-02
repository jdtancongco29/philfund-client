"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Upload } from 'lucide-react'
import { CircleCheck } from 'lucide-react'
import { toast } from "sonner"

interface BeginningBalanceUploadDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function BeginningBalanceUploadDialog({ open, onOpenChange }: BeginningBalanceUploadDialogProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [isUploading, setIsUploading] = useState(false)

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            setSelectedFile(file)
        }
    }

    const handleFileUpload = async () => {
        if (!selectedFile) {
            toast.error("No file selected", {
                description: "Please select a file to upload.",
                duration: 3000,
            })
            return
        }

        setIsUploading(true)
        
        // Simulate upload process
        setTimeout(() => {
            toast.success("File Uploaded Successfully", {
                description: `${selectedFile.name} has been uploaded and processed.`,
                icon: <CircleCheck className="h-5 w-5" />,
                duration: 5000,
            })
            setIsUploading(false)
            setSelectedFile(null)
            onOpenChange(false)
        }, 2000)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Upload Beginning Balance</DialogTitle>
                </DialogHeader>

                <div className="w-full ">
                    <CardContent className="p-8">
                        <div className="flex flex-col items-center text-center space-y-6">
                            <div className="w-16 h-16  flex items-center justify-center">
                                <FileText className="w-8 h-8 text-gray-600" />
                            </div>
                            
                            <div>
                                <h3 className="font-semibold text-lg">Upload Beginning Balance</h3>
                                <p className="text-sm text-gray-500 mt-2">
                                    Excel file must follow a specific format. You may download<br />
                                    the file here
                                </p>
                            </div>

                            <div className="w-full space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-left block mb-2">CSV File *</label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="file"
                                            accept=".xlsx,.xls,.csv"
                                            onChange={handleFileSelect}
                                            className="hidden"
                                            id="balance-file-input"
                                        />
                                        <label
                                            htmlFor="balance-file-input"
                                            className="cursor-pointer"
                                        >
                                            <Button variant="outline" size="sm" type="button" className="bg-gray-50">
                                                Choose File
                                            </Button>
                                        </label>
                                        <span className="text-sm text-gray-500">
                                            {selectedFile ? selectedFile.name : "No file chosen"}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2 text-left">
                                        Upload a CSV file containing borrower profiles
                                    </p>
                                </div>

                                <Button 
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
                                    onClick={handleFileUpload}
                                    disabled={!selectedFile || isUploading}
                                >
                                    <Upload className="w-4 h-4 mr-2" />
                                    {isUploading ? "Uploading..." : "Upload file now"}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </div>
            </DialogContent>
        </Dialog>
    )
}