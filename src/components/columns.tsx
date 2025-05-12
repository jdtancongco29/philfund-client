// components/columns.tsx
import { ColumnDef } from "@tanstack/react-table";

export type Receivable = {
  borrower: string;
  promissoryNote: string;
  loanType: string;
  overdraft: string;
  surcharge: string;
  amortization: string;
  totalPayable: string;
  dueDate: string;
};

export const columns: ColumnDef<Receivable>[] = [
  {
    accessorKey: "borrower",
    header: "Borrower's Name",
  },
  {
    accessorKey: "promissoryNote",
    header: "Promissory Note",
  },
  {
    accessorKey: "loanType",
    header: "Loan Type",
  },
  {
    accessorKey: "overdraft",
    header: "Overdraft",
    cell: ({ row }) => <div className="text-right">{row.getValue("overdraft")}</div>,
  },
  {
    accessorKey: "surcharge",
    header: "Surcharge",
    cell: ({ row }) => <div className="text-right">{row.getValue("surcharge")}</div>,
  },
  {
    accessorKey: "amortization",
    header: "Amortization",
    cell: ({ row }) => <div className="text-right">{row.getValue("amortization")}</div>,
  },
  {
    accessorKey: "totalPayable",
    header: "Total Payable",
    cell: ({ row }) => <div className="text-right">{row.getValue("totalPayable")}</div>,
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
    cell: ({ row }) => <div className="text-right">{row.getValue("dueDate")}</div>,
  },
];
