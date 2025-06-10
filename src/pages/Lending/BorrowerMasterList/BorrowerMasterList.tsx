"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Upload, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ColumnDefinition,
  FilterDefinition,
  SearchDefinition,
} from "@/components/data-table/data-table";
import { DataTableV3 } from "@/components/data-table/data-table-v3";
import { AddBorrowerDialog } from "../BarrowerProfileMaintenance/AddBorrowerDialog";
import { ModulePermissionProps } from "@/pages/MaintenanceAndSecurity/Security/UserPermissions/Service/PermissionsTypes";
import { BeginningBalanceUploadDialog } from "../BarrowerProfileMaintenance/dialog/BeginningBalanceUploadDialog";
import { BorrowerProfileUploadDialog } from "../BarrowerProfileMaintenance/dialog/BorrowerProfileUploadDialog";





interface BorrowerData {
  id: string;
  name: string;
  division: string;
  district: string;
  school: string;
  totalActiveSL: number;
  totalActiveBL: number;
  totalActiveSLCA: number;
  totalActiveBLCA: number;
  passDue: number;
  delinquent: number;
  totalNetOverdueBal: number;
  statusForInterview: "Pending" | "Done" | "Denied";
}


const staticBorrowersData: BorrowerData[] = [
  {
    id: "1",
    name: "DOE, Jane",
    division: "Division1",
    district: "District 1",
    school: "School 1",
    totalActiveSL: 3,
    totalActiveBL: 0,
    totalActiveSLCA: 0,
    totalActiveBLCA: 0,
    passDue: 0,
    delinquent: 0,
    totalNetOverdueBal: 0,
    statusForInterview: "Pending",
  },
  {
    id: "2",
    name: "DOE, Jane",
    division: "Division1",
    district: "District 1",
    school: "School 1",
    totalActiveSL: 4,
    totalActiveBL: 0,
    totalActiveSLCA: 0,
    totalActiveBLCA: 0,
    passDue: 0,
    delinquent: 0,
    totalNetOverdueBal: 0,
    statusForInterview: "Pending",
  },
  {
    id: "3",
    name: "DOE, Jane",
    division: "Division1",
    district: "District 1",
    school: "School 1",
    totalActiveSL: 3,
    totalActiveBL: 0,
    totalActiveSLCA: 0,
    totalActiveBLCA: 0,
    passDue: 0,
    delinquent: 0,
    totalNetOverdueBal: 0,
    statusForInterview: "Pending",
  },
  {
    id: "4",
    name: "DOE, Jane",
    division: "Division1",
    district: "District 1",
    school: "School 1",
    totalActiveSL: 3,
    totalActiveBL: 0,
    totalActiveSLCA: 0,
    totalActiveBLCA: 0,
    passDue: 0,
    delinquent: 0,
    totalNetOverdueBal: 0,
    statusForInterview: "Done",
  },
  {
    id: "5",
    name: "DOE, Jane",
    division: "Division1",
    district: "District 1",
    school: "School 1",
    totalActiveSL: 3,
    totalActiveBL: 0,
    totalActiveSLCA: 0,
    totalActiveBLCA: 0,
    passDue: 0,
    delinquent: 0,
    totalNetOverdueBal: 0,
    statusForInterview: "Done",
  },
  {
    id: "6",
    name: "DOE, Jane",
    division: "Division1",
    district: "District 1",
    school: "School 1",
    totalActiveSL: 3,
    totalActiveBL: 0,
    totalActiveSLCA: 0,
    totalActiveBLCA: 0,
    passDue: 0,
    delinquent: 0,
    totalNetOverdueBal: 0,
    statusForInterview: "Denied",
  },
  {
    id: "7",
    name: "DOE, Jane",
    division: "Division1",
    district: "District 1",
    school: "School 1",
    totalActiveSL: 3,
    totalActiveBL: 0,
    totalActiveSLCA: 0,
    totalActiveBLCA: 0,
    passDue: 0,
    delinquent: 0,
    totalNetOverdueBal: 0,
    statusForInterview: "Denied",
  },
  {
    id: "8",
    name: "DOE, Jane",
    division: "Division1",
    district: "District 1",
    school: "School 1",
    totalActiveSL: 3,
    totalActiveBL: 0,
    totalActiveSLCA: 0,
    totalActiveBLCA: 0,
    passDue: 0,
    delinquent: 0,
    totalNetOverdueBal: 0,
    statusForInterview: "Denied",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Pending":
      return (
        <Badge className="bg-blue-500 hover:bg-blue-600 text-white">
          Pending
        </Badge>
      );
    case "Done":
      return (
        <Badge className="bg-green-500 hover:bg-green-600 text-white">
          Done
        </Badge>
      );
    case "Denied":
      return (
        <Badge className="bg-red-500 hover:bg-red-600 text-white">Denied</Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};
export default function BorrowersMasterList({
  canAdd,
  // canEdit,
  // canDelete,
  canExport,
}: ModulePermissionProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isBorrowerProfileUploadOpen, setIsBorrowerProfileUploadOpen] =
    useState(false);
  const [isBeginningBalanceUploadOpen, setIsBeginningBalanceUploadOpen] =
    useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Define columns for the DataTableV3
  const columns: ColumnDefinition<BorrowerData>[] = [
    {
      id: "name",
      header: "Name",
      accessorKey: "name",
      enableSorting: true,
    },
    {
      id: "division",
      header: "Division",
      accessorKey: "division",
      enableSorting: true,
    },
    {
      id: "district",
      header: "District",
      accessorKey: "district",
      enableSorting: true,
    },
    {
      id: "school",
      header: "School",
      accessorKey: "school",
      enableSorting: true,
    },
    {
      id: "totalActiveSL",
      header: "Total Active SL",
      accessorKey: "totalActiveSL",
      enableSorting: true,
    },
    {
      id: "totalActiveBL",
      header: "Total Active BL",
      accessorKey: "totalActiveBL",
      enableSorting: true,
      cell: (item) => item.totalActiveBL || "-",
    },
    {
      id: "totalActiveSLCA",
      header: "Total Active SL CA",
      accessorKey: "totalActiveSLCA",
      enableSorting: true,
      cell: (item) => item.totalActiveSLCA || "-",
    },
    {
      id: "totalActiveBLCA",
      header: "Total Active BL CA",
      accessorKey: "totalActiveBLCA",
      enableSorting: true,
      cell: (item) => item.totalActiveBLCA || "-",
    },
    {
      id: "passDue",
      header: "Pass Due",
      accessorKey: "passDue",
      enableSorting: true,
      cell: (item) => item.passDue || "-",
    },
    {
      id: "delinquent",
      header: "Delinquent",
      accessorKey: "delinquent",
      enableSorting: true,
      cell: (item) => item.delinquent || "-",
    },
    {
      id: "totalNetOverdueBal",
      header: "Total net overdue bal.",
      accessorKey: "totalNetOverdueBal",
      enableSorting: true,
      cell: (item) => item.totalNetOverdueBal || "-",
    },
    {
      id: "statusForInterview",
      header: "Status for interview",
      accessorKey: "statusForInterview",
      enableSorting: true,
      cell: (item) => getStatusBadge(item.statusForInterview),
    },
  ];

  // Define filters
  const filters: FilterDefinition[] = [
    {
      id: "district",
      label: "District Name",
      type: "select",
      options: [
        { label: "District 1", value: "District 1" },
        { label: "District 2", value: "District 2" },
      ],
      placeholder: "Select...",
    },
    {
      id: "division",
      label: "Division",
      type: "select",
      options: [
        { label: "Division1", value: "Division1" },
        { label: "Division2", value: "Division2" },
      ],
      placeholder: "Select...",
    },
    {
      id: "school",
      label: "School",
      type: "select",
      options: [
        { label: "School 1", value: "School 1" },
        { label: "School 2", value: "School 2" },
      ],
      placeholder: "Select...",
    },
    {
      id: "statusForInterview",
      label: "Status",
      type: "select",
      options: [
        { label: "Pending", value: "Pending" },
        { label: "Done", value: "Done" },
        { label: "Denied", value: "Denied" },
      ],
      placeholder: "Select...",
    },
  ];

  // Define search configuration
  const search: SearchDefinition = {
    title: "Search",
    placeholder: "Search",
    enableSearch: true,
  };

  // Handler functions
  const handleEdit = (borrower: BorrowerData) => {
    console.log("Edit borrower:", borrower);
  };

  const handleDelete = (borrower: BorrowerData) => {
    console.log("Delete borrower:", borrower);
  };

  const handleNew = () => {
    setIsAddDialogOpen(true);
  };

  const handlePdfExport = () => {
    console.log("Export to PDF");
  };

  const handleCsvExport = () => {
    console.log("Export to CSV");
  };

  const handleBorrowerProfileUpload = () => {
    console.log("Opening Borrower Profile Upload Dialog");
    setIsBorrowerProfileUploadOpen(true);
    setDropdownOpen(false);
  };

  const handleBeginningBalanceUpload = () => {
    console.log("Opening Beginning Balance Upload Dialog");
    setIsBeginningBalanceUploadOpen(true);
    setDropdownOpen(false);
  };

  return (
    <div className="w-full p-6">
      <DataTableV3
        title="Borrowers Master list"
        data={staticBorrowersData}
        columns={columns}
        filters={filters}
        search={search}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onNew={handleNew}
        onPdfExport={handlePdfExport}
        onCsvExport={handleCsvExport}
        idField="id"
        enableNew={canAdd}
        enablePdfExport={canExport}
        enableCsvExport={canExport}
        enableFilter={true}
        enableSelection={false}
        onLoading={false}
        onResetTable={false}
        totalCount={staticBorrowersData.length}
        perPage={rowsPerPage}
        pageNumber={currentPage}
        onPaginationChange={setCurrentPage}
        onRowCountChange={setRowsPerPage}
        actionButtons={[]}
        customHeaderActions={
          <>
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <Upload className="h-4 w-4 mr-2" />
                Bulk Import
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white border rounded-md shadow-lg z-50 min-w-[160px]">
                  <button
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                    onClick={handleBorrowerProfileUpload}
                  >
                    Borrower's Profile
                  </button>
                  <button
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                    onClick={handleBeginningBalanceUpload}
                  >
                    Beginning Balance
                  </button>
                </div>
              )}
            </div>
          </>
        }
      />

      {/* Dialogs */}
      <AddBorrowerDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
      <BorrowerProfileUploadDialog
        open={isBorrowerProfileUploadOpen}
        onOpenChange={setIsBorrowerProfileUploadOpen}
      />
      <BeginningBalanceUploadDialog
        open={isBeginningBalanceUploadOpen}
        onOpenChange={setIsBeginningBalanceUploadOpen}
      />
    </div>
  );
}
