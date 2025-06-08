"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { Borrower } from "./Service/SalaryLoanProcessingTypes";

interface UserDetailsPanelProps {
  selectedBorrower: Borrower | null;
  onPrintLoanDisclosure: () => void;
  onPrintPromissoryNote: () => void;
  onPrintComakerStatement: () => void;
  onProcessCheckVoucher: () => void;
}

export function UserDetailsPanel({
  onPrintPromissoryNote,
  onPrintComakerStatement,
}: UserDetailsPanelProps) {
  const [isLoanApplicationsOpen, setIsLoanApplicationsOpen] = useState(false);
  const [isLoanActionsOpen, setIsLoanActionsOpen] = useState(false);

  return (
    <div className="w-80 h-screen bg-white border-l border-gray-200 hidden 2xl:flex flex-col">
      <div className="p-2 shrink-0">
        <h2 className="text-lg font-semibold mb-4">User Details</h2>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto px-2 pb-1">
        <div className="flex flex-col items-center mb-2">
          <img
            src="https://cdn.nba.com/headshots/nba/latest/1040x760/2544.png"
            alt="Profile"
            className="w-32 h-32 object-cover rounded-full mb-2"
          />
        </div>

        <div className="space-y-2">
          {/* Profile fields */}
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
          <div className="grid grid-cols-2 gap-2">
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
              className="w-full"
              onClick={onPrintPromissoryNote}
            >
              Open/Update Profile
            </Button>
          </div>
        </div>

        <div className="pt-4 border-t mt-6">
          {/* Loan Applications Dropdown */}
          <div className="mb-4">
            <button
              onClick={() => setIsLoanApplicationsOpen(!isLoanApplicationsOpen)}
              className="flex items-center justify-between w-full text-sm text-gray-500 mb-2 hover:text-gray-700 transition-colors"
            >
              <span>Loan Applications</span>
              {isLoanApplicationsOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>

            {isLoanApplicationsOpen && (
              <div className="space-y-2 pl-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={onPrintPromissoryNote}
                >
                  Apply for New Salary Loan
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={onPrintComakerStatement}
                >
                  Apply for Cash Advance
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={onPrintComakerStatement}
                >
                  Apply for New Bonus Loan
                </Button>
              </div>
            )}
          </div>

          {/* Loan Actions Dropdown */}
          <div>
            <button
              onClick={() => setIsLoanActionsOpen(!isLoanActionsOpen)}
              className="flex items-center justify-between w-full text-sm text-gray-500 mb-2 hover:text-gray-700 transition-colors"
            >
              <span>Loan Actions</span>
              {isLoanActionsOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>

            {isLoanActionsOpen && (
              <div className="space-y-2 pl-2 h-100">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={onPrintPromissoryNote}
                >
                  Process Payment
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={onPrintComakerStatement}
                >
                  Reloan/Restructure Loan
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={onPrintComakerStatement}
                >
                  Pay off with Insurance
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full p-2"
                  onClick={onPrintComakerStatement}
                >
                  Deem all loans selected as Bad Debt
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full p-2"
                  onClick={onPrintComakerStatement}
                >
                  Deem all loans as Garnished
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full p-5"
                  onClick={onPrintComakerStatement}
                >
                  Open Statement of Account & <br />
                  Ledger Report
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
