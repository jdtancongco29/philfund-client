"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface RestoreConfirmationDialogProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: (password: string) => void
    isLoading: boolean
    backupName: string
}

export function RestoreConfirmationDialog({
    isOpen,
    onClose,
    onConfirm,
    isLoading,
    backupName,
}: RestoreConfirmationDialogProps) {
    const [password, setPassword] = useState("")
    console.log(backupName);
    const handleConfirm = () => {
        if (password.trim()) {
            onConfirm(password)
            setPassword("")
        }
    }

    const handleClose = () => {
        setPassword("")
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Confirm Action</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <p className="text-gray-600">You are about to restore a backup to confirm please input your password.</p>

                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-medium">
                            Confirm Password <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full"
                            disabled={isLoading}
                        />
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={handleClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={!password.trim() || isLoading}
                        className="bg-red-500 hover:bg-red-600 text-white"
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Restoring...
                            </>
                        ) : (
                            "Confirm"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
