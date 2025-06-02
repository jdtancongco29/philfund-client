"use client"

import type React from "react"
import { useState } from "react"
import { Search, User, FileText } from "lucide-react"


interface Borrower {
  id: string
  name: string
  contactId: string
  birthday: string
  atmCard: string
  coMakerLoans: number
  guaranteedLoans: number
  badDebtLoans: number
  totalLoans: number
  phoneNumber: string
  address: string
  riskLevel: "Non-Prime" | "Prime" | "Super-Prime"
  age: number
}

interface Loan {
  id: string
  pnNumber: string
  type: string
  principal: number
  interest: number
  termsPaid: string
  totalPayment: number
  status: "Active" | "Delinquent" | "Paid" | "Default"
  dateReleased: string
}

const BorrowerDashboard: React.FC = () => {
  const [selectedBorrower, setSelectedBorrower] = useState<Borrower | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState<"information" | "voucher">("information")
  const [selectedDivision, setSelectedDivision] = useState("")
  const [selectedDistrict, setSelectedDistrict] = useState("")

  const borrowers: Borrower[] = [
    {
      id: "1",
      name: "Dela Cruz, Alvin",
      contactId: "12345",
      birthday: "05/15/1970",
      atmCard: "Active",
      coMakerLoans: 3,
      guaranteedLoans: 1,
      badDebtLoans: 0,
      totalLoans: 7,
      phoneNumber: "09123456789",
      address: "123 Main St, Anytown, Philippines",
      riskLevel: "Non-Prime",
      age: 30,
    },
    {
      id: "2",
      name: "Santos, Marianne",
      contactId: "23456",
      birthday: "08/22/1985",
      atmCard: "Active",
      coMakerLoans: 2,
      guaranteedLoans: 0,
      badDebtLoans: 1,
      totalLoans: 5,
      phoneNumber: "09234567890",
      address: "456 Oak Ave, Somewhere, Philippines",
      riskLevel: "Prime",
      age: 38,
    },
    {
      id: "3",
      name: "Mendoza, Jericho",
      contactId: "34567",
      birthday: "12/03/1992",
      atmCard: "Inactive",
      coMakerLoans: 1,
      guaranteedLoans: 2,
      badDebtLoans: 0,
      totalLoans: 4,
      phoneNumber: "09345678901",
      address: "789 Pine St, Elsewhere, Philippines",
      riskLevel: "Super-Prime",
      age: 31,
    },
    {
      id: "4",
      name: "Tan, Clarisse",
      contactId: "45678",
      birthday: "03/18/1988",
      atmCard: "Active",
      coMakerLoans: 0,
      guaranteedLoans: 1,
      badDebtLoans: 2,
      totalLoans: 6,
      phoneNumber: "09456789012",
      address: "321 Elm Dr, Nowhere, Philippines",
      riskLevel: "Non-Prime",
      age: 35,
    },
    {
      id: "5",
      name: "Bautista, Rafael",
      contactId: "56789",
      birthday: "07/09/1975",
      atmCard: "Active",
      coMakerLoans: 4,
      guaranteedLoans: 0,
      badDebtLoans: 0,
      totalLoans: 8,
      phoneNumber: "09567890123",
      address: "654 Maple Ln, Anywhere, Philippines",
      riskLevel: "Prime",
      age: 48,
    },
    {
      id: "6",
      name: "Villanueva, Kristine",
      contactId: "67890",
      birthday: "11/14/1990",
      atmCard: "Active",
      coMakerLoans: 2,
      guaranteedLoans: 1,
      badDebtLoans: 0,
      totalLoans: 5,
      phoneNumber: "09678901234",
      address: "987 Cedar St, Somewhere, Philippines",
      riskLevel: "Prime",
      age: 33,
    },
    {
      id: "7",
      name: "Reyes, Jonathan",
      contactId: "78901",
      birthday: "04/25/1983",
      atmCard: "Inactive",
      coMakerLoans: 1,
      guaranteedLoans: 0,
      badDebtLoans: 1,
      totalLoans: 3,
      phoneNumber: "09789012345",
      address: "246 Birch Ave, Elsewhere, Philippines",
      riskLevel: "Non-Prime",
      age: 40,
    },
    {
      id: "8",
      name: "Navarro, Bianca",
      contactId: "89012",
      birthday: "09/08/1995",
      atmCard: "Active",
      coMakerLoans: 0,
      guaranteedLoans: 2,
      badDebtLoans: 0,
      totalLoans: 4,
      phoneNumber: "09890123456",
      address: "135 Spruce Dr, Nowhere, Philippines",
      riskLevel: "Super-Prime",
      age: 28,
    },
    {
      id: "9",
      name: "Ortega, Daniel",
      contactId: "90123",
      birthday: "06/17/1987",
      atmCard: "Active",
      coMakerLoans: 3,
      guaranteedLoans: 1,
      badDebtLoans: 1,
      totalLoans: 6,
      phoneNumber: "09901234567",
      address: "579 Willow Ln, Anywhere, Philippines",
      riskLevel: "Prime",
      age: 36,
    },
    {
      id: "10",
      name: "Gomez, Alyssa",
      contactId: "01234",
      birthday: "12/30/1991",
      atmCard: "Active",
      coMakerLoans: 1,
      guaranteedLoans: 0,
      badDebtLoans: 0,
      totalLoans: 2,
      phoneNumber: "09012345678",
      address: "864 Poplar St, Somewhere, Philippines",
      riskLevel: "Super-Prime",
      age: 32,
    },
    {
      id: "11",
      name: "Zaporte, Juan",
      contactId: "11111",
      birthday: "02/14/1980",
      atmCard: "Inactive",
      coMakerLoans: 2,
      guaranteedLoans: 1,
      badDebtLoans: 2,
      totalLoans: 7,
      phoneNumber: "09111111111",
      address: "753 Ash Ave, Elsewhere, Philippines",
      riskLevel: "Non-Prime",
      age: 43,
    },
  ]

  const loans: Loan[] = [
    {
      id: "1",
      pnNumber: "PN-2023-001",
      type: "Salary Loan",
      principal: 50000,
      interest: 1.75,
      termsPaid: "7/97",
      totalPayment: 95000,
      status: "Active",
      dateReleased: "11-12-2025",
    },
    {
      id: "2",
      pnNumber: "PN-2023-001",
      type: "Salary Loan",
      principal: 50000,
      interest: 1.75,
      termsPaid: "7/97",
      totalPayment: 95000,
      status: "Delinquent",
      dateReleased: "11-12-2025",
    },
    {
      id: "3",
      pnNumber: "PN-2023-001",
      type: "Salary Loan",
      principal: 50000,
      interest: 1.75,
      termsPaid: "7/97",
      totalPayment: 95000,
      status: "Active",
      dateReleased: "11-12-2025",
    },
  ]

  const filteredBorrowers = borrowers.filter((borrower) =>
    borrower.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "text-green-600 bg-green-50"
      case "Delinquent":
        return "text-red-600 bg-red-50"
      case "Paid":
        return "text-blue-600 bg-blue-50"
      case "Default":
        return "text-gray-600 bg-gray-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "Non-Prime":
        return "text-red-600 bg-red-50"
      case "Prime":
        return "text-yellow-600 bg-yellow-50"
      case "Super-Prime":
        return "text-green-600 bg-green-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar - Borrower Search */}
        <div className="w-80 bg-white shadow-lg border-r border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Borrower Search</h2>

            {/* Division Dropdown */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Division <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-500"
                value={selectedDivision}
                onChange={(e) => setSelectedDivision(e.target.value)}
              >
                <option value="">Select...</option>
                <option value="metro-manila">Metro Manila</option>
                <option value="cebu">Cebu</option>
                <option value="davao">Davao</option>
              </select>
            </div>

            {/* District Dropdown */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                District search <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-500"
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
              >
                <option value="">Select...</option>
                <option value="district-1">District 1</option>
                <option value="district-2">District 2</option>
                <option value="district-3">District 3</option>
              </select>
            </div>

            {/* Search Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Borrower search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Select borrowers..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mb-4">
              <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                Reset
              </button>
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                Search
              </button>
            </div>
          </div>

          {/* Borrower List */}
          <div className="max-h-96 overflow-y-auto">
            {filteredBorrowers.map((borrower) => (
              <div
                key={borrower.id}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedBorrower?.id === borrower.id ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
                }`}
                onClick={() => setSelectedBorrower(borrower)}
              >
                <div className="font-medium text-gray-900">{borrower.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {selectedBorrower ? (
            <div className="flex">
              {/* Center Content */}
              <div className="flex-1 p-6">
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

                {activeTab === "information" && (
                  <div className="space-y-6">
                    {/* Borrower Primary Details */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Borrower Primary Details</h3>
                      </div>
                      <div className="p-6">
                        <div className="grid grid-cols-3 gap-8">
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-500">Contact ID</label>
                              <p className="text-gray-900 font-medium">{selectedBorrower.contactId}</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-500">ATM Card Status</label>
                              <p className="text-gray-900 font-medium">{selectedBorrower.atmCard}</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-500">Card User ID</label>
                              <p className="text-gray-900">321422435</p>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-500">Birthday</label>
                              <p className="text-gray-900">{selectedBorrower.birthday}</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-500">UMD Issued Date</label>
                              <p className="text-gray-900">Jan 01, 2026</p>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-500">Account Age</label>
                              <p className="text-gray-900">365 days</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-500">ATM Card Status</label>
                              <p className="text-gray-900">{selectedBorrower.atmCard}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Co-Maker Information */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Co-Maker Information</h3>
                      </div>
                      <div className="p-6">
                        <div className="grid grid-cols-4 gap-8">
                          <div>
                            <div className="text-sm text-gray-500 mb-1">Loans as Co-Maker</div>
                            <div className="text-2xl font-bold text-gray-900">
                              {selectedBorrower.coMakerLoans} Loans
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500 mb-1">Guaranteed Loans</div>
                            <div className="text-2xl font-bold text-gray-900">
                              {selectedBorrower.guaranteedLoans} Loan
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500 mb-1">Bad Debt Loans</div>
                            <div className="text-2xl font-bold text-gray-900">
                              {selectedBorrower.badDebtLoans} Loans
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500 mb-1">As co-borrowers</div>
                            <div className="text-2xl font-bold text-gray-900">4 Borrowers</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Loan Count */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Loan Count</h3>
                      </div>
                      <div className="p-6">
                        <div className="grid grid-cols-4 gap-8">
                          <div>
                            <div className="text-sm text-gray-500 mb-1">Total SL Availed</div>
                            <div className="text-2xl font-bold text-gray-900">23</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500 mb-1">Total SL Availed</div>
                            <div className="text-2xl font-bold text-gray-900">34</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500 mb-1">Loan Overdraft</div>
                            <div className="text-2xl font-bold text-gray-900">10</div>
                          </div>
                          <div></div>
                        </div>
                        <div className="grid grid-cols-4 gap-8 mt-6">
                          <div>
                            <div className="text-sm text-gray-500 mb-1">Total BL CA Availed</div>
                            <div className="text-2xl font-bold text-gray-900">2</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500 mb-1">Total BL CA Availed</div>
                            <div className="text-2xl font-bold text-gray-900">2</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500 mb-1">Total Loans Availed</div>
                            <div className="text-2xl font-bold text-gray-900">63</div>
                          </div>
                          <div></div>
                        </div>
                      </div>
                    </div>

                    {/* Active Loans and Advances */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Active Loans and Advances</h3>
                        <div className="flex items-center gap-2">
                          <label className="text-sm text-gray-600">Search</label>
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                              type="text"
                              placeholder="Search..."
                              className="pl-10 pr-4 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <input type="checkbox" className="rounded border-gray-300" />
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date release
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                PN Number
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Type loan
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Principal
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Interest
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Terms and Months Paid
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Terms and Months Paid
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Total payment
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {loans.map((loan) => (
                              <tr key={loan.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <input type="checkbox" className="rounded border-gray-300" />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {loan.dateReleased}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{loan.pnNumber}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{loan.type}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  ₱{loan.principal.toLocaleString()}.00
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{loan.interest}%</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{loan.termsPaid}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{loan.termsPaid}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  ₱{loan.totalPayment.toLocaleString()}.00
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span
                                    className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(loan.status)}`}
                                  >
                                    {loan.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                            <tr className="bg-gray-50 font-medium">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" colSpan={4}>
                                Grand Total
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₱500,000.00</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">-</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">-</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">-</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₱500,000.00</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">-</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "voucher" && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                    <div className="text-center">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Voucher Information</h3>
                      <p className="text-gray-500">Voucher details and history will be displayed here.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Sidebar */}
              <div className="w-80 bg-white border-l border-gray-200 p-6 space-y-6">
                {/* User Details with Photo */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">User Details</h3>
                  </div>
                  <div className="p-6">
                    <div className="flex flex-col items-center mb-6">
                      {/* <Image
                        src="/borrower-photo.png"
                        alt="Borrower Photo"
                        width={120}
                        height={120}
                        className="rounded-lg object-cover mb-4"
                      /> */}
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        Open/Update Profile
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Risk Level</label>
                        <span
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(selectedBorrower.riskLevel)}`}
                        >
                          {selectedBorrower.riskLevel}
                        </span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Name</label>
                        <p className="text-gray-900 font-medium">Dela Cruz, Juan</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Age</label>
                        <p className="text-gray-900">{selectedBorrower.age}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Address</label>
                        <p className="text-gray-900 text-sm">
                          123 Main St.
                          <br />
                          Anytown,
                          <br />
                          Philippines
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Phone number</label>
                        <p className="text-gray-900">{selectedBorrower.phoneNumber}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Loan Applications */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Loan Applications</h3>
                  </div>
                  <div className="p-6 space-y-3">
                    <button className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-50 transition-colors text-blue-600">
                      Apply for New Salary Loan
                    </button>
                    <button className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-50 transition-colors text-blue-600">
                      Apply for Cash Advance
                    </button>
                    <button className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-50 transition-colors text-blue-600">
                      Apply for New Bonus Loan
                    </button>
                  </div>
                </div>

                {/* Loan Actions */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Loan Actions</h3>
                  </div>
                  <div className="p-6 space-y-3">
                    <button className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-50 transition-colors text-blue-600">
                      Process Payment
                    </button>
                    <button className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-50 transition-colors text-blue-600">
                      Reloan/Restructure Loan
                    </button>
                    <button className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-50 transition-colors text-blue-600">
                      Pay off with Insurance
                    </button>
                    <button className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-50 transition-colors text-blue-600">
                      Deem all loans selected as Bad Debt
                    </button>
                    <button className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-50 transition-colors text-blue-600">
                      Deem all loans as Garnished
                    </button>
                    <button className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-50 transition-colors text-blue-600">
                      Open Statement of Account & Ledger Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Borrower</h3>
                <p className="text-gray-500">
                  Choose a borrower from the list to view their details and loan information.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BorrowerDashboard
