"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CircleCheck, Download, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { apiRequest } from "@/lib/api";
import {
  DataTable,
  type ColumnDefinition,
  type FilterDefinition,
} from "@/components/data-table/data-table-coa";
import { DdeleteDialog } from "./DeleteCOADialog";
import { AddEditAccountDialog } from "./AddAccountDialog";

interface Branch {
  uid: string;
  code: string;
  name: string;
}

interface Parent {
  id: string;
  name: string;
}

interface ChartOfAccount {
  id: string;
  code: string;
  name: string;
  description: string;
  major_classification: {
    code: string;
    name: string;
  };
  category: string;
  is_header: boolean;
  parent_id: string | null;
  parent?: Parent;
  is_contra: boolean;
  normal_balance: "debit" | "credit";
  special_classification: string;
  status: boolean;
  branches?: Branch[];
}

interface Pagination {
  current_page: number;
  per_page: number;
  total_pages: number;
  total_items: number;
}

interface DataPayload {
  count: number;
  chartOfAccounts: ChartOfAccount[];
  pagination: Pagination;
}

interface ApiResponse {
  status: string;
  message: string;
  data: DataPayload;
}
type ApiErrorResponse = {
  status: string;
  message: string;
  data: any | null;
};

export default function ChartOfAccounts() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState<ChartOfAccount[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [onResetTable, setOnResetTable] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [accountToEdit, setAccountToEdit] = useState<ChartOfAccount | null>(
    null
  );

  // Export functionality
  const getAuthHeaders = useCallback(() => {
    const authToken = localStorage.getItem("authToken");
    const branchId = localStorage.getItem("branchId");

    if (!authToken) {
      throw new Error("Authentication token not found");
    }

    return {
      Authorization: `Bearer ${authToken}`,
      "X-Branch-ID": branchId || "",
      "Content-Type": "application/json",
    };
  }, []);

  const downloadFile = useCallback((blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }, []);

  const safeCsvValue = useCallback((value: any): string => {
    if (value === null || value === undefined) return '""';
    const stringValue = String(value).replace(/"/g, '""');
    return `"${stringValue}"`;
  }, []);

  const generateCsvFromData = useCallback(() => {
    try {
      const headers = [
        "Code",
        "Name",
        "Classification",
        "Sub-Grouping",
        "Normal Balance",
        "Contra",
      ];

      const csvRows = [headers.join(",")];

      // Process each account entry
      accounts.forEach((account) => {
        try {
          const row = [
            safeCsvValue(account.code || ""),
            safeCsvValue(account.name || ""),
            safeCsvValue(account.major_classification.name || ""),
            safeCsvValue(account.category || ""),
            safeCsvValue(account.normal_balance || ""),
            account.is_contra ? "Yes" : "No",
          ];
          csvRows.push(row.join(","));
        } catch (entryError) {
          console.warn(
            "Error processing account entry for CSV:",
            entryError,
            account
          );
          csvRows.push(
            [
              safeCsvValue(account.code || "Error"),
              safeCsvValue(account.name || "Unknown"),
              '""',
              '""',
              '""',
              "Unknown",
            ].join(",")
          );
        }
      });

      // Add summary row
      csvRows.push(
        [
          '"TOTAL ACCOUNTS"',
          `"${accounts.length}"`,
          '""',
          '""',
          '""',
          '""',
        ].join(",")
      );

      return csvRows.join("\n");
    } catch (error) {
      console.error("Error generating CSV data:", error);
      return 'Code,Name,Classification,Sub-Grouping,"Normal Balance",Contra\n"Error generating data","","","","",""';
    }
  }, [accounts, safeCsvValue]);

  const handleCsvExport = useCallback(async () => {
    setIsExporting(true);
    try {
      const headers = getAuthHeaders();
      const response = await fetch("/coa/export-csv", {
        method: "GET",
        headers,
      });

      if (response.ok) {
        const blob = await response.blob();
        const currentDate = new Date().toISOString().split("T")[0];
        downloadFile(blob, `chart-of-accounts-${currentDate}.csv`);

        toast.success("CSV Export Successful", {
          description:
            "Chart of Accounts have been exported to CSV successfully.",
          icon: <Download className="h-5 w-5" />,
          duration: 5000,
        });
        return;
      } else {
        throw new Error(`API endpoint returned status: ${response.status}`);
      }
    } catch (apiError) {
      console.warn("API CSV export failed, using fallback:", apiError);

      try {
        if (!accounts || accounts.length === 0) {
          toast.error("No Data to Export", {
            description: "No entries available for CSV export.",
            duration: 5000,
          });
          return;
        }

        const csvContent = generateCsvFromData();

        if (!csvContent || csvContent.length < 50) {
          throw new Error(
            "Generated CSV content appears to be empty or invalid"
          );
        }

        const BOM = "\uFEFF";
        const blob = new Blob([BOM + csvContent], {
          type: "text/csv;charset=utf-8;",
        });

        const currentDate = new Date().toISOString().split("T")[0];
        downloadFile(blob, `chart-of-accounts-${currentDate}.csv`);

        toast.success("CSV Export Successful", {
          description: `Chart of Accounts exported successfully (${accounts.length} entries).`,
          icon: <Download className="h-5 w-5" />,
          duration: 5000,
        });
      } catch (fallbackError) {
        console.error("Fallback CSV generation failed:", fallbackError);
        toast.error("CSV Export Failed", {
          description:
            "Failed to export Chart of Accounts to CSV. Please check the data and try again.",
          duration: 5000,
        });
      }
    } finally {
      setIsExporting(false);
    }
  }, [getAuthHeaders, downloadFile, generateCsvFromData, accounts]);

  const exportPdf = async (): Promise<string> => {
    const endpoint = `/coa/export-pdf`; // adjust endpoint if needed
    try {
      const response = await apiRequest<{ url: string }>(
        "get",
        endpoint,
        null,
        {
          useAuth: true,
          useBranchId: true,
        }
      );
      return response.data.url;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to export PDF";
      throw new Error(errorMessage);
    }
  };

  const handlePdfExport = useCallback(async () => {
    // Check if there's actual data to export
    if (!accounts || accounts.length === 0) {
      toast.error("No Data to Export", {
        description: "No entries available for PDF export.",
        duration: 5000,
      });
      return;
    }

    setIsExporting(true);
    try {
      const url = await exportPdf();

      const newTab = window.open(url, "_blank");
      if (newTab) {
        newTab.focus();
      } else {
        // fallback for popup blockers
        const link = document.createElement("a");
        link.href = url;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      toast.success("PDF opened in new tab");
    } catch (error: any) {
      toast.error("PDF Export Failed", {
        description: error.message || "Could not export General Journal PDF.",
      });
    } finally {
      setIsExporting(false);
    }
  }, [accounts]);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const response = await apiRequest<ApiResponse>("get", "/coa/", null, {
        useAuth: true,
        useBranchId: true,
      });

      if (response.data.status === "FETCHED") {
        setAccounts(response.data.data.chartOfAccounts);
        setOnResetTable(true);
      } else {
        throw new Error(response.data.message || "Failed to fetch accounts");
      }
    } catch (err) {
      console.error("Error fetching accounts:", err);
      toast.error("Failed to Load Data", {
        description: "Could not fetch chart of accounts. Please try again.",
        duration: 5000,
      });
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  };

  const resetTable = () => {
    setOnResetTable(true);
    setTimeout(() => setOnResetTable(false), 100);
  };

  const getClassificationBadgeColor = (classification: string) => {
    switch (classification) {
      case "1":
        return "bg-blue-50 text-blue-700";
      case "2":
        return "bg-red-50 text-red-700";
      case "3":
        return "bg-green-50 text-green-700";
      case "4":
        return "bg-yellow-50 text-yellow-700";
      case "5":
        return "bg-purple-50 text-purple-700";
      default:
        return "bg-gray-50";
    }
  };

  const columns: ColumnDefinition<ChartOfAccount>[] = [
    {
      id: "code",
      header: "Account Code",
      accessorKey: "code",
      enableSorting: true,
    },
    {
      id: "name",
      header: "Account Name",
      accessorKey: "name",
      enableSorting: true,
    },
    {
      id: "major_classification_code",
      header: "Classification",
      accessorKey: "major_classification",
      enableSorting: true,
      cell: (account) => (
        <Badge
          variant="outline"
          className={getClassificationBadgeColor(
            account.major_classification.code
          )}
        >
          {account.major_classification.name}
        </Badge>
      ),
    },
    {
      id: "category",
      header: "Sub-Grouping",
      accessorKey: "category",
      enableSorting: true,
      cell: (account) => (
        <Badge variant="outline" className="bg-gray-50">
          {account.category}
        </Badge>
      ),
    },
    {
      id: "normal_balance",
      header: "Normal Balance",
      accessorKey: "normal_balance",
      enableSorting: true,
      cell: (account) => (
        <div className="font-medium">
          {account.normal_balance.charAt(0).toUpperCase() +
            account.normal_balance.slice(1)}
        </div>
      ),
    },
    {
      id: "is_contra",
      header: "Contra",
      accessorKey: "is_contra",
      enableSorting: true,

      cell: (account) => (
        <div className="font-medium">{account.is_contra ? "Yes" : "No"}</div>
      ),
    },
    {
      id: "branches",
      header: "Branch",
      accessorKey: "branches",
      enableSorting: false,
      cell: (item) => (
        <div>
          {item.branches && item.branches.length > 0 ? (
            <div>{item.branches[0].name}</div>
          ) : (
            <div className="text-gray-400">No branch</div>
          )}
        </div>
      ),
    },
  ];

  const filters: FilterDefinition[] = [
    {
      id: "major_classification_code",
      label: "Filter by Classification",
      placeholder: "Select...",
      type: "select",
      options: [
        { label: "Assets", value: "1" },
        { label: "Liabilities", value: "2" },
        { label: "Owner's Equity", value: "3" },
        { label: "Revenue", value: "4" },
        { label: "Expenses", value: "5" },
      ],
    },
  ];

  const search = {
    title: "Search",
    placeholder: "Search accounts, code...",
    enableSearch: true,
  };

  const handleAddAccount = async (newAccount: any) => {
    try {
      const response = await apiRequest<{
        status: string;
        message: string;
        data: any;
      }>("post", "/coa", newAccount, {
        useAuth: true,
        useBranchId: true,
      });

      if (
        response.data.status === "CREATED" ||
        response.data.status === "SUCCESS"
      ) {
        toast.success("Account Added", {
          description:
            response.data.message || "New account has been successfully added.",
          icon: <CircleCheck className="h-5 w-5" />,
          duration: 5000,
        });

        resetTable();
        fetchAccounts();
        setIsAddDialogOpen(false);
      } else {
        throw new Error(response.data.message || "Failed to add account");
      }
    } catch (err: any) {
      console.error("Error adding account:", err);

      // Re-throw the error so the dialog component can handle it
      // Don't show toast here as the dialog will display the errors
      throw err;
    }
  };

  const handleEdit = (account: ChartOfAccount) => {
    setAccountToEdit(account);
    setIsEditDialogOpen(true);
  };

  const handleEditAccount = async (accountId: string, updatedAccount: any) => {
    try {
      const response = await apiRequest<{
        status: string;
        message: string;
        data: any;
      }>("put", `/coa/${accountId}`, updatedAccount, {
        useAuth: true,
        useBranchId: true,
      });

      if (
        response.data.status === "UPDATED" ||
        response.data.status === "SUCCESS"
      ) {
        toast.success("Account Updated", {
          description:
            response.data.message || "Account has been successfully updated.",
          icon: <CircleCheck className="h-5 w-5" />,
          duration: 5000,
        });

        resetTable();
        fetchAccounts();
        setIsEditDialogOpen(false);
        setAccountToEdit(null);
      } else {
        throw new Error(response.data.message || "Failed to update account");
      }
    } catch (err: any) {
      console.error("Error updating account:", err);

      // Let the dialog component handle the error display
      // Don't close the dialog here - let it stay open to show errors
      throw err; // Re-throw the error so the dialog can handle it
    }
  };

  const handleDelete = (account: ChartOfAccount) => {
    setAccountToDelete({ id: account.id, name: account.name });
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!accountToDelete) return;

    try {
      const response = await apiRequest<{ status: string; message: string }>(
        "delete",
        `/coa/${accountToDelete.id}`,
        null,
        {
          useAuth: true,
          useBranchId: true,
        }
      );

      if (
        response.data.status === "DELETED" ||
        response.data.status === "SUCCESS"
      ) {
        toast.success("Account Deleted", {
          description:
            response.data.message ||
            `${accountToDelete.name} has been successfully deleted.`,
          icon: <CircleCheck className="h-5 w-5" />,
          duration: 5000,
        });

        resetTable();
        fetchAccounts();
      } else {
        throw new Error(response.data.message || "Failed to delete account");
      }
    } catch (err: any) {
      console.error("Error deleting account:", err);
      const apiError = err as { response?: { data?: ApiErrorResponse } };

      const errorMessage =
        apiError.response?.data?.message ||
        err.message ||
        "An error occurred while deleting the account";

      toast.error("Unable to delete", {
        description: errorMessage,
      });
    } finally {
      setDeleteDialogOpen(false);
      setAccountToDelete(null);
    }
  };

  const handleNew = () => {
    setIsAddDialogOpen(true);
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="bg-white rounded-lg border p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
              <Info className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-medium">
                Chart of Accounts Management
              </h2>
              <p className="text-sm text-muted-foreground">
                Add, edit, and delete accounts in your chart of accounts.
                Properly classify accounts by major classification,
                sub-grouping, and special classification. Ensure proper
                accounting practices by specifying normal balances and contra
                accounts.
              </p>
            </div>
          </div>
        </div>
        <DataTable
          title="Chart of Accounts"
          subtitle="Manage the accounts used for recording financial transactions"
          data={accounts}
          columns={columns}
          filters={filters}
          search={search}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onNew={handleNew}
          idField="id"
          enableNew
          enablePdfExport
          enableCsvExport
          enableFilter
          onPdfExport={handlePdfExport}
          onCsvExport={handleCsvExport}
          onLoading={loading || isExporting}
          onResetTable={onResetTable}
        />
      </CardContent>

      <AddEditAccountDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAddAccount={handleAddAccount}
        mode="add"
      />

      <DdeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Account"
        description="Are you sure you want to delete the account: {name}?"
        itemName={accountToDelete?.name || ""}
      />

      <AddEditAccountDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onEditAccount={handleEditAccount}
        editingAccount={accountToEdit}
        mode="edit"
      />
    </Card>
  );
}
