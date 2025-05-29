"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Printer, Archive } from "lucide-react"
import { AddressDetailsTab } from "./tab/AddressDetailsTab"
import { AuthorizationTab } from "./tab/AuthorizationTab"
import { BasicInfoTab } from "./tab/BasicInfoTab"
import { DependentsTab } from "./tab/DependentsTab"
import { PhilfundCashCardTab } from "./tab/PhilfundCashCardTab"
import { VerificationTab } from "./tab/VerificationTab"
import { WorkInformationTab } from "./tab/WorkInformationTab"

interface AddBorrowerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddBorrowerDialog({ open, onOpenChange }: AddBorrowerDialogProps) {
  const [activeTab, setActiveTab] = useState("basic-info")

  const handleCancel = () => {
    onOpenChange(false)
  }

  const handleNext = () => {
    const tabs = [
      "basic-info",
      "dependents",
      "address-details",
      "work-information",
      "authorization",
      "philfund-cash-card",
      "verification",
    ]
    const currentIndex = tabs.indexOf(activeTab)
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1])
    }
  }

  const handleSaveForInterview = () => {
    console.log("Save for Interview")
    onOpenChange(false)
  }

  const handleArchive = () => {
    console.log("Archive")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
<DialogContent className="!max-w-none w-[90vw] max-w-screen-2xl h-[75vh] flex flex-col overflow-y-auto">

  <DialogHeader className="flex-shrink-0">
    <DialogTitle className="text-xl font-bold">Add Borrowers Profile Maintenance</DialogTitle>
    <p className="text-sm text-muted-foreground">Create a new cash advance configuration for bonus loans</p>
  </DialogHeader>

  <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
    <TabsList className="grid w-full grid-cols-7 flex-shrink-0">
      <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
      <TabsTrigger value="dependents">Dependents</TabsTrigger>
      <TabsTrigger value="address-details">Address Details</TabsTrigger>
      <TabsTrigger value="work-information">Work Information</TabsTrigger>
      <TabsTrigger value="authorization">Authorization</TabsTrigger>
      <TabsTrigger value="philfund-cash-card">Philfund cash card</TabsTrigger>
      <TabsTrigger value="verification">Verification</TabsTrigger>
    </TabsList>

    <div className="flex-1 overflow-y-auto px-1">
      <TabsContent value="basic-info" className="mt-0 h-full">
        <BasicInfoTab />
      </TabsContent>

      <TabsContent value="dependents" className="mt-0 h-full">
        <DependentsTab />
      </TabsContent>

      <TabsContent value="address-details" className="mt-0 h-full">
        <AddressDetailsTab />
      </TabsContent>

      <TabsContent value="work-information" className="mt-0 h-full">
        <WorkInformationTab />
      </TabsContent>

      <TabsContent value="authorization" className="mt-0 h-full">
        <AuthorizationTab />
      </TabsContent>

      <TabsContent value="philfund-cash-card" className="mt-0 h-full">
        <PhilfundCashCardTab />
      </TabsContent>

      <TabsContent value="verification" className="mt-0 h-full">
        <VerificationTab />
      </TabsContent>
    </div>

    <div className="flex justify-end gap-2 pt-4 border-t flex-shrink-0">
      <Button variant="outline" onClick={handleCancel}>
        Cancel
      </Button>
      {activeTab === "verification" ? (
        <>
          <Button variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Print Specimen card
          </Button>
          <Button onClick={handleSaveForInterview}>Save for Interview</Button>
          <Button variant="destructive" onClick={handleArchive}>
            <Archive className="h-4 w-4 mr-2" />
            Archive
          </Button>
        </>
      ) : (
        <Button onClick={handleNext}>Next</Button>
      )}
    </div>
  </Tabs>
</DialogContent>
    </Dialog>
  )
}
