import { Borrower } from "../Types/Index"
import { getRiskLevelColor } from "../Utils/Helpers"

interface UserDetailsSidebarProps {
  borrower: Borrower
}

export function UserDetailsSidebar({ borrower }: UserDetailsSidebarProps) {
  return (
    <div className="w-80 bg-white border-l border-gray-200 p-6 space-y-6">
      {/* User Details with Photo */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">User Details</h3>
        </div>
        <div className="p-6">
          <div className="flex flex-col items-center mb-6">
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">Open/Update Profile</button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">Risk Level</label>
              <span
                className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(borrower.riskLevel)}`}
              >
                {borrower.riskLevel}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Name</label>
              <p className="text-gray-900 font-medium">{borrower.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Age</label>
              <p className="text-gray-900">{borrower.age}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Address</label>
              <p className="text-gray-900 text-sm">{borrower.address}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Phone number</label>
              <p className="text-gray-900">{borrower.phoneNumber}</p>
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
  )
}
