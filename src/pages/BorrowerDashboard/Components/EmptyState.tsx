import { User } from "lucide-react"

export function EmptyState() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Borrower</h3>
        <p className="text-gray-500">Choose a borrower from the list to view their details and loan information.</p>
      </div>
    </div>
  )
}
