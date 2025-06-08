"use client";

import { useState } from "react";
import * as z from "zod";

import {
  DataTableV2,
  FilterDefinition,
} from "@/components/data-table/data-table-v2";
import type {
  SalaryLoan,
  CoMaker,
  Borrower,
} from "../Service/SalaryLoanProcessingTypes";

// Form schema for loan computation
const InformationSchema = z.object({
  transaction_date: z.date(),
  borrower_id: z.string().min(1, "Please select a borrower"),
  date_granted: z.date(),
  principal: z.number().min(1, "Principal amount is required"),
  terms: z.number().min(1, "Terms is required"),
  interest_rate: z.number().min(0, "Interest rate is required"),
  installment_period: z.string().min(1, "Installment period is required"),
  due_date: z.string().min(1, "Due date is required"),
  cash_card_amount: z.number().min(0),
  computer_fee: z.number().min(0),
  service_charge: z.number().min(0),
  insurance: z.number().min(0),
  notarial_fees: z.number().min(0),
  gross_receipts_tax: z.number().min(0),
  processing_fee: z.number().min(0),
  prepared_by: z.string().min(1, "Prepared by is required"),
  approved_by: z.string().optional(),
  remarks: z.string().optional(),
});

export type InformationFormValues = z.infer<typeof InformationSchema>;

// Define the loan data type for the table
type ActiveLoan = {
  id: string;
  date_release: string;
  pn_number: string;
  type_loan: string;
  principal: number;
  interest: string;
  terms_months_paid: string;
  total_payment: number;
  balance: number;
  status: "Active" | "Delinquent" | "Paid" | "Garnished";
};

interface LoanComputationTabProps {
  currentLoan: SalaryLoan | null;
  borrowers: Borrower[];
  coMakers: CoMaker[];
  setCoMakers: (coMakers: CoMaker[]) => void;
  onSaveAsDraft: (values: InformationFormValues) => void;
  onProcess: () => void;
  onReset: () => void;
  isLoading: boolean;
}

export function InformationTab({}: LoanComputationTabProps) {
  const [isTableLoading] = useState(false);

  // Sample data for active loans - replace with actual data
  const activeLoansData: ActiveLoan[] = [
    {
      id: "1",
      date_release: "11-12-2025",
      pn_number: "PN-2023-001",
      type_loan: "Salary Loan",
      principal: 50000.0,
      interest: "1.75%",
      terms_months_paid: "7/97",
      total_payment: 50000.0,
      balance: 50000.0,
      status: "Active",
    },
    {
      id: "2",
      date_release: "11-12-2025",
      pn_number: "PN-2023-001",
      type_loan: "Salary Loan",
      principal: 50000.0,
      interest: "1.75%",
      terms_months_paid: "7/97",
      total_payment: 50000.0,
      balance: 50000.0,
      status: "Delinquent",
    },
    {
      id: "3",
      date_release: "11-12-2025",
      pn_number: "PN-2023-001",
      type_loan: "Salary Loan",
      principal: 50000.0,
      interest: "1.75%",
      terms_months_paid: "7/97",
      total_payment: 50000.0,
      balance: 50000.0,
      status: "Active",
    },
  ];

  // Define columns for the data table
  const columns = [
    {
      id: "date_release",
      header: "Date Release",
      accessorKey: "date_release" as keyof ActiveLoan,
      enableSorting: true,
    },
    {
      id: "pn_number",
      header: "PN Number",
      accessorKey: "pn_number" as keyof ActiveLoan,
      enableSorting: true,
    },
    {
      id: "type_loan",
      header: "Type Loan",
      accessorKey: "type_loan" as keyof ActiveLoan,
      enableSorting: true,
    },
    {
      id: "principal",
      header: "Principal",
      accessorKey: "principal" as keyof ActiveLoan,
      enableSorting: true,
      cell: (item: ActiveLoan) =>
        `₱${item.principal.toLocaleString("en-US", {
          minimumFractionDigits: 2,
        })}`,
    },
    {
      id: "interest",
      header: "Interest",
      accessorKey: "interest" as keyof ActiveLoan,
      enableSorting: true,
    },
    {
      id: "terms_months_paid",
      header: "Terms and Months Paid",
      accessorKey: "terms_months_paid" as keyof ActiveLoan,
      enableSorting: true,
    },
    {
      id: "total_payment",
      header: "Total Payment",
      accessorKey: "total_payment" as keyof ActiveLoan,
      enableSorting: true,
      cell: (item: ActiveLoan) =>
        `₱${item.total_payment.toLocaleString("en-US", {
          minimumFractionDigits: 2,
        })}`,
    },
    {
      id: "balance",
      header: "Balance",
      accessorKey: "balance" as keyof ActiveLoan,
      enableSorting: true,
      cell: (item: ActiveLoan) =>
        `₱${item.balance.toLocaleString("en-US", {
          minimumFractionDigits: 2,
        })}`,
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status" as keyof ActiveLoan,
      enableSorting: true,
      displayCondition: [
        {
          value: "Active",
          label: "Active",
          className:
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800",
        },
        {
          value: "Delinquent",
          label: "Delinquent",
          className:
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800",
        },
        {
          value: "Paid",
          label: "Paid",
          className:
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800",
        },
        {
          value: "Garnished",
          label: "Garnished",
          className:
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800",
        },
      ],
    },
  ];

  // Define filters for the table
  const filters: FilterDefinition[] | undefined = [];

  // Search configuration
  const searchConfig = {
    title: "Search Loans",
    placeholder: "Search by PN Number, Type, etc...",
    enableSearch: true,
  };

  // Table event handlers

  // Action buttons configuration

  return (
    <div className="space-y-4">
      {/* Borrower Primary Details */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">
            Borrower Primary Details
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Employee ID
                </label>
                <p className="text-gray-900">12345</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  ATM expiry Countdown
                </label>
                <p className="text-gray-900">2 Months 16 days</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Cash card ID
                </label>
                <p className="text-gray-900">321422435</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Birthday
                </label>
                <p className="text-gray-900">05/15/1970</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  UMD Issued Date
                </label>
                <p className="text-gray-900">Jan 01, 2026</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Countdown till Age 52
                </label>
                <p className="text-gray-900">365 days</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  ATM Card Status
                </label>
                <p className="text-gray-900">Active</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Co-Maker Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">
            Co-Maker Information
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <div className="text-sm text-gray-500 mb-1">
                Loans as Co-Maker
              </div>
              <div className="text-lg font-bold text-gray-900">3 Loans</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Garnished Loans</div>
              <div className="text-lg font-bold text-gray-900">1 Loan</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Bad Debt Loans</div>
              <div className="text-lg font-bold text-gray-900">0 Loans</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">
                Delinquent account
              </div>
              <div className="text-lg font-bold text-gray-900">7 Loans</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">No. of Borrowers</div>
              <div className="text-lg font-bold text-gray-900">4 Borrowers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Loan Count */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">Loan Count</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <div className="text-sm text-gray-500 mb-1">Total SL Availed</div>
              <div className="text-lg font-bold text-gray-900">23</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Total BL Availed</div>
              <div className="text-lg font-bold text-gray-900">34</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Total Overdraft</div>
              <div className="text-lg font-bold text-gray-900">10</div>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <div>
              <div className="text-sm text-gray-500 mb-1">
                Total SL CA Availed
              </div>
              <div className="text-lg font-bold text-gray-900">4</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">
                Total BL CA Availed
              </div>
              <div className="text-lg font-bold text-gray-900">2</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">
                Total Loans Availed
              </div>
              <div className="text-lg font-bold text-gray-900">63</div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Loans and Advances - Using DataTableV2 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6">
          <DataTableV2
            title="Active Loans and Advances"
            subtitle="Manage and view all active loan records"
            data={activeLoansData}
            columns={columns}
            filters={filters}
            search={searchConfig}
            totalCount={activeLoansData.length}
            pageNumber={1}
            perPage={10}
            onLoading={isTableLoading}
            enableNew={false}
            enablePdfExport={false}
            enableCsvExport={false}
            enableFilter={true}
            enableSelection={true}
          />
        </div>
      </div>
    </div>
  );
}
