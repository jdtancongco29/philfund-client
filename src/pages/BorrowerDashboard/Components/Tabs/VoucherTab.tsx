import { FileText } from "lucide-react"

export function VoucherTab() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <div className="text-center">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Voucher Information</h3>
        <p className="text-gray-500">Voucher details and history will be displayed here.</p>
      </div>
    </div>
  )
}
