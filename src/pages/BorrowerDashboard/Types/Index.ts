export interface Borrower {
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

export interface Loan {
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
