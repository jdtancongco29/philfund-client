export const getStatusColor = (status: string) => {
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

export const getRiskLevelColor = (riskLevel: string) => {
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
