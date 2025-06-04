import { Borrower } from "../Types/Index"
import { getRiskLevelColor } from "../Utils/Helpers"

interface UserDetailsSidebarProps {
  borrower: Borrower
}

export function UserDetailsSidebar({ borrower }: UserDetailsSidebarProps) {
  return (
    <div className="w-60 bg-white border-l border-gray-200 p-6 space-y-6">
      {/* User Details with Photo */}
      <div className="bg-white rounded-lg shadow-xs border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">User Details</h3>
        </div>
        <div className="p-6">
       <div className="flex flex-col items-center mb-6">
  <img
    src="https://cdn.nba.com/headshots/nba/latest/1040x760/2544.png"
    alt="Profile"
    className="w-32 h-32 object-cover rounded-full mb-4"
  />
  <button className="text-blue-600 hover:text-blue-700 text-xs font-medium">
    Open/Update Profile
  </button>
</div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-500">Risk Level</label>
              <span
                className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(borrower.riskLevel)}`}
              >
                {borrower.riskLevel}
              </span>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500">Name</label>
              <p className="text-gray-900 text-sm">{borrower.name}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500">Age</label>
              <p className="text-gray-900 text-sm">{borrower.age}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500">Address</label>
              <p className="text-gray-900 text-xs text-sm">{borrower.address}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500">Phone number</label>
              <p className="text-gray-900 text-sm">{borrower.phoneNumber}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Loan Applications */}
      <div className="bg-white rounded-lg shadow-xs border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-sl font-semibold text-gray-900">Loan Applications</h3>
        </div>
        <div className="p-6 space-y-3">
          <button className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-50 transition-colors text-blue-600  text-sm">
            Apply for New Salary Loan
          </button>
          <button className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-50 transition-colors text-blue-600 text-sm">
            Apply for Cash Advance
          </button>
          <button className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-50 transition-colors text-blue-600 text-sm">
            Apply for New Bonus Loan
          </button>
        </div>
      </div>

      {/* Loan Actions */}
      <div className="bg-white rounded-lg shadow-xs border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-sl font-semibold text-gray-900">Loan Actions</h3>
        </div>
        <div className="p-6 space-y-3">
          <button className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-50 transition-colors text-blue-600 text-sm">
            Process Payment
          </button>
          <button className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-50 transition-colors text-blue-600 text-sm">
            Reloan/Restructure Loan
          </button>
          <button className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-50 transition-colors text-blue-600 text-sm">
            Pay off with Insurance
          </button>
          <button className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-50 transition-colors text-blue-600 text-sm">
            Deem all loans selected as Bad Debt
          </button>
          <button className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-50 transition-colors text-blue-600 text-sm">
            Deem all loans as Garnished
          </button>
          <button className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-50 transition-colors text-blue-600 text-sm">
            Open Statement of Account & Ledger Report
          </button>
        </div>
      </div>
    </div>
  )
}
