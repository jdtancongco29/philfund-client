"use client"

import { Search } from "lucide-react"
import { Borrower } from "../Types/Index"


interface BorrowerSearchSidebarProps {
  borrowers: Borrower[]
  selectedBorrower: Borrower | null
  searchTerm: string
  selectedDivision: string
  selectedDistrict: string
  onBorrowerSelect: (borrower: Borrower) => void
  onSearchChange: (term: string) => void
  onDivisionChange: (division: string) => void
  onDistrictChange: (district: string) => void
}

export function BorrowerSearchSidebar({
  borrowers,
  selectedBorrower,
  searchTerm,
  selectedDivision,
  selectedDistrict,
  onBorrowerSelect,
  onSearchChange,
  onDivisionChange,
  onDistrictChange,
}: BorrowerSearchSidebarProps) {
  const filteredBorrowers = borrowers.filter((borrower) =>
    borrower.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="w-60 bg-white shadow-lg border-r border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xs font-bold text-gray-900 mb-4">Borrower Search</h2>

        {/* Division Dropdown */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Division <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-500 text-xs"
            value={selectedDivision}
            onChange={(e) => onDivisionChange(e.target.value)}
          >
            <option value="">Select...</option>
            <option value="metro-manila">Metro Manila</option>
            <option value="cebu">Cebu</option>
            <option value="davao">Davao</option>
          </select>
        </div>

        {/* District Dropdown */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            District search <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-500 text-xs"
            value={selectedDistrict}
            onChange={(e) => onDistrictChange(e.target.value)}
          >
            <option value="">Select...</option>
            <option value="district-1">District 1</option>
            <option value="district-2">District 2</option>
            <option value="district-3">District 3</option>
          </select>
        </div>

        {/* Search Input */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-700 mb-1">Borrower search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 text-xs" />
            <input
              type="text"
              placeholder="Select borrowers..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mb-4">
          <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-xs">
            Reset
          </button>
          <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-xs">
            Search
          </button>
        </div>
      </div>

      {/* Borrower List */}
      <div className="max-h-96 overflow-y-auto">
        {filteredBorrowers.map((borrower) => (
          <div
            key={borrower.id}
            className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors text-xs ${
              selectedBorrower?.id === borrower.id ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
            }`}
            onClick={() => onBorrowerSelect(borrower)}
          >
            <div className="font-medium text-gray-900">{borrower.name}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
