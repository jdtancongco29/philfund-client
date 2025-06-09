"use client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

import { Borrower } from "../Service/SalaryLoanProcessingTypes";

interface UserDetailsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedBorrower: Borrower | null;
  onPrintLoanDisclosure: () => void;
  onPrintPromissoryNote: () => void;
  onPrintComakerStatement: () => void;
  onProcessCheckVoucher: () => void;
}

export function UserDetailsDrawer({
  open,
  onOpenChange,
  onPrintPromissoryNote,
  onPrintComakerStatement,
}: UserDetailsDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-80 sm:max-w-[320px] p-4 overflow-y-auto"
      >
        <SheetHeader className="p-0">
          <SheetTitle className="text-2xl font-semibold">
            User Details
          </SheetTitle>
        </SheetHeader>
        <div className="space-y-4">
          <div className="p-6">
            <div className="flex flex-col items-center mb-6">
              <img
                src="https://cdn.nba.com/headshots/nba/latest/1040x760/2544.png"
                alt="Profile"
                className="w-32 h-32 object-cover rounded-full mb-4"
              />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500">
                  Risk Level
                </label>
                <p className="text-gray-900 text-sm">Non - Prime</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500">
                  Name
                </label>
                <p className="text-gray-900 text-sm">Dela Cruz, Juan</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500">
                  Age
                </label>
                <p className="text-gray-900 text-sm">30</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500">
                    Address
                  </label>
                  <p className="text-gray-900 text-sm">
                    123 Main St, Anytown, Philippines
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500">
                    Phone number
                  </label>
                  <p className="text-gray-900 text-sm">09123456789</p>
                </div>
              </div>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full justify-center text-center items-center"
                  onClick={onPrintPromissoryNote}
                >
                  Open/Update Profile
                </Button>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-gray-500 mb-2">Loan Applications</p>

              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-center items-center"
                  
                >
                  Apply for New Salary Loan
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-center items-center"
                  
                >
                  Apply for Cash Advance
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-center items-center"
                  
                >
                  Apply for New Bonus Loan
                </Button>
              </div>

              <p className="text-sm text-gray-500 mt-4 mb-2">Loan Actions</p>

              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-center items-center"
                  
                >
                  Process Payment
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-center items-center"
                 
                >
                  Reloan/Restructure Loan
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-center items-center"
                 
                >
                  Pay off with Insurance
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-center items-center p-5"
                  
                >
                  Deem all loans selected as <br />
                  Bad Debt
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-center items-center"
                  
                >
                  Deem all loans as Garnished
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-center items-center p-5"
                  
                >
                  Open Statement of Account <br /> & Ledger Report
                </Button>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
