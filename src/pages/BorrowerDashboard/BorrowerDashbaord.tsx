"use client"

import type React from "react"
import { useState } from "react"
import { BorrowerSearchSidebar } from "./Components/BorrowerSearchSidebar"
import { EmptyState } from "./Components/EmptyState"
import { InformationTab } from "./Components/Tabs/InformationTab"
import { VoucherTab } from "./Components/Tabs/VoucherTab"
import { UserDetailsSidebar } from "./Components/UserDetailsSidebar"
import { borrowers, loans } from "./Data/MockData"
import { Borrower } from "./Types/Index"

const BorrowerDashboard: React.FC = () => {
  const [selectedBorrower, setSelectedBorrower] = useState<Borrower | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState<"information" | "voucher">("information")
  const [selectedDivision, setSelectedDivision] = useState("")
  const [selectedDistrict, setSelectedDistrict] = useState("")

  return (
    <div className="h-screen bg-gray-50 overflow-hidden">
      <div className="flex h-full">
        {/* Sidebar - Borrower Search */}
        <div className="w-80 h-full overflow-hidden">
          <BorrowerSearchSidebar
            borrowers={borrowers}
            selectedBorrower={selectedBorrower}
            searchTerm={searchTerm}
            selectedDivision={selectedDivision}
            selectedDistrict={selectedDistrict}
            onBorrowerSelect={setSelectedBorrower}
            onSearchChange={setSearchTerm}
            onDivisionChange={setSelectedDivision}
            onDistrictChange={setSelectedDistrict}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 h-full overflow-auto">
          {selectedBorrower ? (
            <div className="flex h-full">
              {/* Center Content */}
              <div className="flex-1 p-2 overflow-auto">
                {/* Tabs */}
                <div className="border-b border-gray-200 mb-6">
                  <nav className="flex space-x-8">
                    <button
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === "information"
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                      onClick={() => setActiveTab("information")}
                    >
                      Information
                    </button>
                    <button
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === "voucher"
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                      onClick={() => setActiveTab("voucher")}
                    >
                      Voucher
                    </button>
                  </nav>
                </div>

                {/* Tab Content */}
                {activeTab === "information" && <InformationTab borrower={selectedBorrower} loans={loans} />}
                {activeTab === "voucher" && <VoucherTab />}
              </div>

              {/* Right Sidebar */}
              <UserDetailsSidebar borrower={selectedBorrower} />
            </div>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </div>
  )
}

export default BorrowerDashboard