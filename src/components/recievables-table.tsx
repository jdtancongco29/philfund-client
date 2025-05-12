// components/receivables-table.tsx
import { DataTable } from "./data-table";
import { columns, Receivable } from "./columns";

const receivablesData: Receivable[] = [
  {
    borrower: "John Doe",
    promissoryNote: "PN12345",
    loanType: "Salary Loan",
    overdraft: "$1,000",
    surcharge: "$50",
    amortization: "$200",
    totalPayable: "$1,250",
    dueDate: "2025-05-15",
  },
  // Add more data as needed
];

export default function ReceivablesTable() {
  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">
        Schedule of Receivables with OD
      </h3>
      <DataTable columns={columns} data={receivablesData} />
    </div>
  );
}
