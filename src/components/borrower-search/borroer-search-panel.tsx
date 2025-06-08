"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export interface Division {
  id: string
  name: string
}

export interface District {
  id: string
  name: string
  division_id: string
}

export interface Borrower {
  id: string
  name: string
  division: string
  district: string
  address: string
  phone: string
  email: string
  age?: number
}

interface BorrowerSearchPanelProps {
  divisions: Division[]
  districts: District[]
  borrowers: Borrower[]
  selectedDivision: string
  selectedDistrict: string
  borrowerSearch: string
  selectedBorrower: Borrower | null
  isLoadingBorrowers: boolean
  onDivisionChange: (division: string) => void
  onDistrictChange: (district: string) => void
  onBorrowerSearchChange: (search: string) => void
  onBorrowerSelect: (borrower: Borrower) => void
  onReset: () => void
  onSearch: () => void
}

export function BorrowerSearchPanel({
  divisions,
  districts,
  borrowers,
  selectedDivision,
  selectedDistrict,
  borrowerSearch,
  selectedBorrower,
  isLoadingBorrowers,
  onDivisionChange,
  onDistrictChange,
  onBorrowerSearchChange,
  onBorrowerSelect,
  onReset,
  onSearch,
}: BorrowerSearchPanelProps) {
  return (
    <div className="flex flex-col justify-between w-80 bg-white h-full border rounded-[8px] border-gray-200 p-6 overflow-y-auto">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Borrower Search</h2>
        <div>
          <label className="text-sm font-medium mb-2 block">
            Division <span className="text-red-500">*</span>
          </label>
          <Select value={selectedDivision} onValueChange={onDivisionChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              {divisions.map((division) => (
                <SelectItem key={division.id} value={division.id}>
                  {division.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">
            District search <span className="text-red-500">*</span>
          </label>
          <Select value={selectedDistrict} onValueChange={onDistrictChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              {districts.map((district) => (
                <SelectItem key={district.id} value={district.id}>
                  {district.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Borrower search</label>
          <Input
            placeholder="Select borrowers..."
            value={borrowerSearch}
            onChange={(e) => onBorrowerSearchChange(e.target.value)}
          />
        </div>

        {/* Borrower List */}
        <div className="space-y-2">
          {isLoadingBorrowers ? (
            <div className="text-sm text-gray-500">Loading borrowers...</div>
          ) : borrowers.length === 0 ? (
            <div className="text-sm text-gray-500">No borrowers found.</div>
          ) : (
            <div className="border rounded-md overflow-y-auto max-h-[360px]">
              {borrowers.map((borrower) => (
                <button
                  key={borrower.id}
                  onClick={() => onBorrowerSelect(borrower)}
                  className={`w-full text-left p-2 text-sm hover:bg-gray-100 border-b last:border-b-0 ${
                    selectedBorrower?.id === borrower.id ? "bg-blue-50 text-blue-700" : ""
                  }`}
                >
                  {borrower.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex gap-2 pt-4">
        <Button variant="outline" onClick={onReset} className="flex-1">
          Reset
        </Button>
        <Button onClick={onSearch} className="flex-1">
          Search
        </Button>
      </div>
    </div>
  )
}