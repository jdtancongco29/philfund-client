import { Search } from "lucide-react"
import { Borrower, Loan } from "../../Types/Index"
import { getStatusColor } from "../../Utils/Helpers"


interface InformationTabProps {
  borrower: Borrower
  loans: Loan[]
}

export function InformationTab({ borrower, loans }: InformationTabProps) {
  return (
    <div className="space-y-6 w-100">
      {/* Borrower Primary Details */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Borrower Primary Details</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Contact ID</label>
                <p className="text-gray-900 font-medium">{borrower.contactId}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">ATM Card Status</label>
                <p className="text-gray-900 font-medium">{borrower.atmCard}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Card User ID</label>
                <p className="text-gray-900">321422435</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Birthday</label>
                <p className="text-gray-900">{borrower.birthday}</p>
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
                <p className="text-gray-900">{borrower.atmCard}</p>
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <div className="text-sm text-gray-500 mb-1">Loans as Co-Maker</div>
              <div className="text-xl lg:text-2xl font-bold text-gray-900">{borrower.coMakerLoans} Loans</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Guaranteed Loans</div>
              <div className="text-xl lg:text-2xl font-bold text-gray-900">{borrower.guaranteedLoans} Loan</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Bad Debt Loans</div>
              <div className="text-xl lg:text-2xl font-bold text-gray-900">{borrower.badDebtLoans} Loans</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">As co-borrowers</div>
              <div className="text-xl lg:text-2xl font-bold text-gray-900">4 Borrowers</div>
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <div className="text-sm text-gray-500 mb-1">Total SL Availed</div>
              <div className="text-xl lg:text-2xl font-bold text-gray-900">23</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Total SL Availed</div>
              <div className="text-xl lg:text-2xl font-bold text-gray-900">34</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Loan Overdraft</div>
              <div className="text-xl lg:text-2xl font-bold text-gray-900">10</div>
            </div>
            <div></div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            <div>
              <div className="text-sm text-gray-500 mb-1">Total BL CA Availed</div>
              <div className="text-xl lg:text-2xl font-bold text-gray-900">2</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Total BL CA Availed</div>
              <div className="text-xl lg:text-2xl font-bold text-gray-900">2</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Total Loans Availed</div>
              <div className="text-xl lg:text-2xl font-bold text-gray-900">63</div>
            </div>
            <div></div>
          </div>
        </div>
      </div>

      {/* Active Loans and Advances */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h3 className="text-lg font-semibold text-gray-900">Active Loans and Advances</h3>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-40"
              />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-full">
            <table className="w-full min-w-[1200px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                    Date release
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                    PN Number
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                    Type loan
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                    Principal
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                    Interest
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[140px]">
                    Terms and Months Paid
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[140px]">
                    Terms and Months Paid
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                    Total payment
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <input type="checkbox" className="rounded border-gray-300" />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{loan.dateReleased}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{loan.pnNumber}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{loan.type}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₱{loan.principal.toLocaleString()}.00
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{loan.interest}%</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{loan.termsPaid}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{loan.termsPaid}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₱{loan.totalPayment.toLocaleString()}.00
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(loan.status)}`}
                      >
                        {loan.status}
                      </span>
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-50 font-medium">
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900" colSpan={4}>
                    Grand Total
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">₱500,000.00</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">-</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">-</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">-</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">₱500,000.00</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}