"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Transaction } from "../Service/TransactionTypes"

interface TransactionDetailsTabProps {
  item: Transaction | null
  receivedBy: string
  setReceivedBy: (value: string) => void
}

export function TransactionDetailsTab({ item, receivedBy, setReceivedBy }: TransactionDetailsTabProps) {
  return (
    <div className="space-y-6 pt-6">
      {/* Basic Information */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <label className="flex-1/2 text-sm font-medium text-gray-700 mb-1 block">Name</label>
          <Input value={item?.borrower_name || "Sarausa, Sherwin C"} disabled className="bg-gray-100" />
        </div>
        <div className="flex items-center gap-2">
          <label className="flex-1/2 text-sm font-medium text-gray-700 mb-1 block">District</label>
          <Input value={item?.district || "PhilFund CDO"} disabled className="bg-gray-100" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <label className="flex-1/2 text-sm font-medium text-gray-700 mb-1 block">TW Amount</label>
          <Input value="" disabled className="bg-gray-100" />
        </div>
        <div className="flex items-center gap-2">
          <label className="flex-1/2 text-sm font-medium text-gray-700 mb-1 block">Month of</label>
          <Input value="July" disabled className="bg-gray-100" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <label className="flex-1/2 text-sm font-medium text-gray-700 mb-1 block">TW No.</label>
          <Input value="" disabled className="bg-gray-100" />
        </div>
        <div className="flex items-center gap-2">
          <label className="flex-1/2 text-sm font-medium text-gray-700 mb-1 block">TW Date</label>
          <Input value="" disabled className="bg-gray-100" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <label className="flex-1/2 text-sm font-medium text-gray-700 mb-1 block">Date Paid</label>
          <Input value="" disabled className="bg-gray-100" />
        </div>
      </div>

      {/* Computation Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Computation</h3>

        <div className="grid grid-cols-2 gap-8">
          {/* Left Column - Months Deductions */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 mb-3">Months Deductions</h4>

            <div className="flex items-center gap-2">
              <label className="flex-1/2 text-sm font-medium text-gray-700 mb-1 block">1st Loan</label>
              <Input value="5,310" disabled className="bg-gray-100" />
            </div>

            <div className="flex items-center gap-2">
              <label className="flex-1/2 text-sm font-medium text-gray-700 mb-1 block">2nd Loan</label>
              <Input value="" disabled className="bg-gray-100" />
            </div>

            <div className="flex items-center gap-2">
              <label className="flex-1/2 text-sm font-medium text-gray-700 mb-1 block">3rd Loan</label>
              <Input value="" disabled className="bg-gray-100" />
            </div>

            <div className="flex items-center gap-2">
              <label className="flex-1/2 text-sm font-medium text-gray-700 mb-1 block">Overdraft</label>
              <Input value="" disabled className="bg-gray-100" />
            </div>

            <div className="flex items-center gap-2">
              <label className="flex-1/2 text-sm font-medium text-gray-700 mb-1 block">Surcharge</label>
              <Input value="" disabled className="bg-gray-100" />
            </div>

            <div className="flex items-center gap-2">
              <label className="flex-1/2 text-sm font-medium text-gray-700 mb-1 block">CA 1</label>
              <Input value="" disabled className="bg-gray-100" />
            </div>

            <div className="flex items-center gap-2">
              <label className="flex-1/2 text-sm font-medium text-gray-700 mb-1 block">CA 2</label>
              <Input value="0.00" disabled className="bg-gray-100" />
            </div>

            <div className="flex items-center gap-2">
              <label className="flex-1/2 text-sm font-medium text-gray-700 mb-1 block">Others</label>
              <Input value="0.00" disabled className="bg-gray-100" />
            </div>

            <div className="flex items-center gap-2">
              <label className="flex-1/2 text-sm font-medium text-gray-700 mb-1 block">Total Payable</label>
              <Input value="0.00" disabled className="bg-gray-100" />
            </div>

            <div className="flex items-center gap-2">
              <label className="flex-1/2 text-sm font-medium text-gray-700 mb-1 block">Change</label>
              <Input value="0.00" disabled className="bg-gray-100" />
            </div>

            <div className="flex items-center gap-2">
              <label className="flex-1/2 text-sm font-medium text-gray-700 mb-1 block">Check no.</label>
              <Input value="0.00" disabled className="bg-gray-100" />
            </div>

            <div className="flex items-center gap-2">
              <label className="flex-1/2 text-sm font-medium text-gray-700 mb-1 block">New Arrears</label>
              <Input value="0.00" disabled className="bg-gray-100" />
            </div>
          </div>

          {/* Right Column - Outstanding Accounts-Loans */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 mb-3">Outstanding Accounts-Loans</h4>

            <div className="flex items-center gap-2">
              <label className="flex-1/2 self-start text-sm font-medium text-gray-700 mb-1 block">1. P</label>
              <div className="flex flex-col gap-2 w-full">
                <Input value="31,860.00" disabled className="bg-gray-100 w-full " />
                <Input value="5,310.00" disabled className="bg-gray-100 w-full" />
              </div>
            </div>

            <div className="flex items-center gap-2">
                <label className="flex-1/2 self-start text-sm font-medium text-gray-700 mb-1 block">Balance</label>
                <div className="flex gap-2">
                    <Input value="26,550.00" disabled className="bg-gray-100 w-full" />
                    <Input value="0 / 0" disabled className="bg-gray-100 w-full flex-1/2" />
                </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="flex-1/2 self-start text-sm font-medium text-gray-700 mb-1 block">2. P</label>
              <div className="flex flex-col gap-2 w-full">
                <Input value="" disabled className="bg-gray-100 w-full " />
                <Input value="" disabled className="bg-gray-100 w-full" />
              </div>
            </div>

            <div className="flex items-center gap-2">
                <label className="flex-1/2 self-start text-sm font-medium text-gray-700 mb-1 block">Balance</label>
                <div className="flex gap-2">
                    <Input value="" disabled className="bg-gray-100 w-full" />
                    <Input value="0 / 0" disabled className="bg-gray-100 w-full flex-1/2" />
                </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="flex-1/2 self-start text-sm font-medium text-gray-700 mb-1 block">3. P</label>
              <div className="flex flex-col gap-2 w-full">
                <Input value="" disabled className="bg-gray-100 w-full " />
                <Input value="" disabled className="bg-gray-100 w-full" />
              </div>
            </div>

            <div className="flex items-center gap-2">
                <label className="flex-1/2 self-start text-sm font-medium text-gray-700 mb-1 block">Balance</label>
                <div className="flex gap-2">
                    <Input value="" disabled className="bg-gray-100 w-full" />
                    <Input value="0 / 0" disabled className="bg-gray-100 w-full flex-1/2" />
                </div>
            </div>

          </div>
        </div>
      </div>

      {/* Received By */}
      <div className="grid grid-cols-2 gap-4">
        <div>
            <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
            Received By <span className="text-red-500 ml-1">*</span>
            </label>
            <Select value={receivedBy} onValueChange={setReceivedBy}>
            <SelectTrigger className="max-w-md w-full">
                <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="user1">User 1</SelectItem>
                <SelectItem value="user2">User 2</SelectItem>
                <SelectItem value="user3">User 3</SelectItem>
            </SelectContent>
            </Select>
        </div>
      </div>
    </div>
  )
}
