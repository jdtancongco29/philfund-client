// src/pages/dashboard.tsx
import MainLayout from "@/components/layout/MainLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select } from "@radix-ui/react-select"
import { ChevronDown, ChevronFirst, ChevronLast, ChevronLeft, ChevronRight, CreditCard, Download, FileText } from "lucide-react"
import { ChartComponent } from "@/components/chart"
import { DatePickerWithRange } from "@/components/date-range-picker"

export default function DashboardPage() {
  return (
    <MainLayout>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-2">
            <DatePickerWithRange className="w-[300px]" />
          </div>
        </div>
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard title="Total Active Borrowers" value="12,234" change="+19% from last month" />
          <MetricCard title="UMID Cards Expiring Soon" value="32" change="+19% from last month" />
          <MetricCard title="ATM Cards Expiring Soon" value="400" change="+19% from last month" />
          <MetricCard title="Borrowers Turning 53" value="54" change="+19% from last month" />
        </div>
      </div>
      {/* Chart Section */}
      <div className="mb-6">
        <ChartComponent />
      </div>
      {/* Receivables Table */}
      <div className="bg-white rounded-md border p-4 border-[var(--border)]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Schedule of Receivables with OD</h3>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <FileText className="w-4 h-4 mr-2" />
              PDF
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              CVS
            </Button>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <div>
            <p className="text-sm mb-1">Search</p>
            <div className="relative">
              <Input placeholder="Search user..." className="pl-8 w-[250px]" />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
          <div className="w-[250px]">
            <p className="text-sm mb-1">Loan Types</p>
            <Select>
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Loans</SelectItem>
                <SelectItem value="salary">Salary Loans</SelectItem>
                <SelectItem value="ca">CA Loans</SelectItem>
                <SelectItem value="bonus">Bonus Loans</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <p className="text-sm mb-1">Date Range</p>
            <DatePickerWithRange className="w-[300px]" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">
                  Borrower's name
                  <ChevronDown className="inline-block ml-1 w-4 h-4" />
                </TableHead>
                <TableHead className="whitespace-nowrap">
                  Promissory note
                  <ChevronDown className="inline-block ml-1 w-4 h-4" />
                </TableHead>
                <TableHead className="whitespace-nowrap">
                  Loan Type
                  <ChevronDown className="inline-block ml-1 w-4 h-4" />
                </TableHead>
                <TableHead className="whitespace-nowrap text-right">
                  Overdraft
                  <ChevronDown className="inline-block ml-1 w-4 h-4" />
                </TableHead>
                <TableHead className="whitespace-nowrap text-right">
                  Surcharge
                  <ChevronDown className="inline-block ml-1 w-4 h-4" />
                </TableHead>
                <TableHead className="whitespace-nowrap text-right">
                  Amortization
                  <ChevronDown className="inline-block ml-1 w-4 h-4" />
                </TableHead>
                <TableHead className="whitespace-nowrap text-right">
                  Total Payable
                  <ChevronDown className="inline-block ml-1 w-4 h-4" />
                </TableHead>
                <TableHead className="whitespace-nowrap text-right">
                  Due date
                  <ChevronDown className="inline-block ml-1 w-4 h-4" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {receivablesData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell className="whitespace-nowrap">{row.borrower}</TableCell>
                  <TableCell className="whitespace-nowrap">{row.promissoryNote}</TableCell>
                  <TableCell className="whitespace-nowrap">{row.loanType}</TableCell>
                  <TableCell className="whitespace-nowrap text-right">{row.overdraft}</TableCell>
                  <TableCell className="whitespace-nowrap text-right">{row.surcharge}</TableCell>
                  <TableCell className="whitespace-nowrap text-right">{row.amortization}</TableCell>
                  <TableCell className="whitespace-nowrap text-right">{row.totalPayable}</TableCell>
                  <TableCell className="whitespace-nowrap text-right">{row.dueDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Rows per page</span>
            <Select defaultValue="10">
              <SelectTrigger className="w-16">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sm text-gray-500">Page 1 of 10</span>
            <div className="flex items-center gap-1 ml-4">
              <Button variant="outline" size="icon" className="w-8 h-8">
                <ChevronFirst className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="w-8 h-8">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="w-8 h-8">
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="w-8 h-8">
                <ChevronLast className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* <ReceivablesTable /> */}
    </MainLayout>
  )
}

type MetricCardProps = {
  title: string
  value: string | number
  change?: string
}

function MetricCard({ title, value, change }: MetricCardProps) {
  return (
    <Card className="p-6 border-[var(--border)]">
      <CardContent className="p-0">
        <div className="flex flex-col">
            <div className="flex justify-between mb-2">
              <p className="text-sm text-gray-500">{title}</p>
              <CreditCard />
            </div>
            <div className="text-left">
              <p className="text-3xl font-bold">{value}</p>
              <p className="text-xs text-gray-500">{change}</p>
            </div>
        </div>
      </CardContent>
    </Card>
  )
}

const receivablesData = [
  {
    borrower: "Jane Doe",
    promissoryNote: "PN-342-4324",
    loanType: "Salary Loan",
    overdraft: "120,000.00",
    surcharge: "50,000.00",
    amortization: "25,000.00",
    totalPayable: "25,000.00",
    dueDate: "2025-24-04",
  },
  {
    borrower: "Jane Doe",
    promissoryNote: "PN-342-4324",
    loanType: "CA Salary Loan",
    overdraft: "120,000.00",
    surcharge: "50,000.00",
    amortization: "25,000.00",
    totalPayable: "25,000.00",
    dueDate: "2025-24-04",
  },
  {
    borrower: "Jane Doe",
    promissoryNote: "PN-342-4324",
    loanType: "Bonus Loan",
    overdraft: "120,000.00",
    surcharge: "50,000.00",
    amortization: "25,000.00",
    totalPayable: "25,000.00",
    dueDate: "2025-24-04",
  },
  {
    borrower: "Jane Doe",
    promissoryNote: "PN-342-4324",
    loanType: "CA Bonus Loan",
    overdraft: "120,000.00",
    surcharge: "50,000.00",
    amortization: "25,000.00",
    totalPayable: "25,000.00",
    dueDate: "2025-24-04",
  },
  {
    borrower: "Jane Doe",
    promissoryNote: "PN-342-4324",
    loanType: "Salary Loan",
    overdraft: "120,000.00",
    surcharge: "50,000.00",
    amortization: "25,000.00",
    totalPayable: "25,000.00",
    dueDate: "2025-24-04",
  },
  {
    borrower: "Jane Doe",
    promissoryNote: "PN-342-4324",
    loanType: "Bonus Loan",
    overdraft: "120,000.00",
    surcharge: "50,000.00",
    amortization: "25,000.00",
    totalPayable: "25,000.00",
    dueDate: "2025-24-04",
  },
  {
    borrower: "Jane Doe",
    promissoryNote: "PN-342-4324",
    loanType: "Bonus Loan",
    overdraft: "120,000.00",
    surcharge: "50,000.00",
    amortization: "25,000.00",
    totalPayable: "25,000.00",
    dueDate: "2025-24-04",
  },
  {
    borrower: "Jane Doe",
    promissoryNote: "PN-342-4324",
    loanType: "CA Bonus Loan",
    overdraft: "120,000.00",
    surcharge: "50,000.00",
    amortization: "25,000.00",
    totalPayable: "25,000.00",
    dueDate: "2025-24-04",
  },
]
