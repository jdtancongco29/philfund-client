"use client";

import { useEffect, useState, useCallback } from "react";
import { apiRequest } from "@/lib/api";
import {
  DataTable,
  type ColumnDefinition,
  type FilterDefinition,
  type SearchDefinition,
} from "@/components/data-table/data-table-general-journal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { CircleCheck } from "lucide-react";
import { toast } from "sonner";
import AddEditEntryDialog from "./AddNewEntryDialog";
// Import the updated dialog component

interface AccountEntry {
  id?: string;
  name: string;
  particulars?: string;
  transaction_amount: string;
  status: boolean;
  details?: Array<{
    coa: {
      id: string;
      code: string;
      name: string;
    };
    debit: string;
    credit: string;
  }>;
}

interface DataPayload {
  count: number;
  default_accounts: AccountEntry[];
  pagination: Pagination;
}

interface ApiResponse {
  status: string;
  message: string;
  data: DataPayload;
}

interface Pagination {
  current_page: number;
  per_page: number;
  total_pages: number;
  total_items: number;
}

export default function AccountEntriesTable() {
  const [loading, setLoading] = useState(true);
  const [onResetTable, setOnResetTable] = useState(false);
  const [data, setData] = useState<AccountEntry[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<AccountEntry | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<AccountEntry | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await apiRequest<ApiResponse>(
        "get",
        "/default-entry",
        null,
        {
          useAuth: true,
          useBranchId: true,
        }
      );
      setData(response.data.data.default_accounts);
      setOnResetTable(true);
    } catch (err) {
      console.error(err);
      toast.error("Error", {
        description: "Failed to load account entries. Please try again.",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleNew = () => {
    setEditingEntry(null);
    setIsDialogOpen(true);
  };

  const handleEdit = async (entry: AccountEntry) => {
    try {
      // Fetch full entry details including account details
      const response = await apiRequest<{ data: AccountEntry }>(
        "get",
        `/default-entry/${entry.id}`,
        null,
        {
          useAuth: true,
          useBranchId: true,
        }
      );
      setEditingEntry(response.data.data);
      setIsDialogOpen(true);
    } catch (error) {
      console.error("Failed to fetch entry details:", error);
      toast.error("Error", {
        description: "Failed to load entry details. Please try again.",
        duration: 3000,
      });
      // If individual fetch fails, use the existing entry data
      setEditingEntry(entry);
      setIsDialogOpen(true);
    }
  };

  // Open delete confirmation dialog
  const requestDelete = (entry: AccountEntry) => {
    setEntryToDelete(entry);
    setDeleteDialogOpen(true);
  };

  // Confirm delete handler, calls API and refreshes data
  const confirmDelete = async () => {
    if (!entryToDelete) return;
    try {
      await apiRequest("delete", `/default-entry/${entryToDelete.id}`, null, {
        useAuth: true,
        useBranchId: true,
      });
      setDeleteDialogOpen(false);
      setEntryToDelete(null);
      fetchData();
      toast.success("Account Entry Deleted", {
        description: `Account Entry has been successfully deleted.`,
        icon: <CircleCheck className="h-5 w-5" />,
        duration: 5000,
      });
    } catch (error) {
      console.error("Failed to delete entry:", error);
      toast.error("Delete Failed", {
        description: "Failed to delete the account entry. Please try again.",
        duration: 5000,
      });
    }
  };

  // Cancel delete dialog
  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setEntryToDelete(null);
  };

  const handleSave = (savedEntry: AccountEntry) => {
    if (editingEntry && savedEntry.id) {
      // Update existing entry
      setData((prevData) =>
        prevData.map((item) => (item.id === savedEntry.id ? savedEntry : item))
      );
    } else {
      // Add new entry
      setData((prevData) => [savedEntry, ...prevData]);
    }
    fetchData(); // Refresh the table to get the latest data
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingEntry(null);
  };

  const columns: ColumnDefinition<AccountEntry>[] = [
    {
      id: "name",
      header: "Name",
      accessorKey: "name",
      enableSorting: true,
    },
    {
      id: "particulars",
      header: "Particulars",
      accessorKey: "particulars",
      enableSorting: true,
    },

    {
      id: "debit_amount",
      header: "Debit Amount",
      accessorKey: "transaction_amount",
      cell: (item) => parseFloat(item.transaction_amount || "0").toFixed(2),
      enableSorting: true,
      isNumeric: true,
    },
    {
      id: "credit_amount",
      header: "Credit Amount",
      accessorKey: "transaction_amount",
      cell: (item) => parseFloat(item.transaction_amount || "0").toFixed(2),
      enableSorting: true,
      isNumeric: true,
    },
  ];

  const filters: FilterDefinition[] = [];

  const search: SearchDefinition = {
    title: "Search",
    placeholder: "Search user...  ",
    enableSearch: true,
  };

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

  const safeCsvValue = useCallback((value: any): string => {
    if (value === null || value === undefined) return '""';
    const stringValue = String(value).replace(/"/g, '""');
    return `"${stringValue}"`;
  }, []);

  const generateCsvFromData = useCallback(() => {
    try {
      const headers = ["Particulars", "Name", "Debit", "Credit"];

      const csvRows = [headers.join(",")];

      // Process each entry with proper error handling
      data.forEach((entry) => {
        try {
          const debitAmount = Number.parseFloat(
            entry.transaction_amount || "0"
          ).toFixed(2);
          const creditAmount = Number.parseFloat(
            entry.transaction_amount || "0"
          ).toFixed(2);

          const row = [
            safeCsvValue(entry.particulars || ""),
            safeCsvValue(entry.name || ""),
            debitAmount,
            creditAmount,
          ];
          csvRows.push(row.join(","));
        } catch (entryError) {
          console.warn("Error processing entry for CSV:", entryError, entry);
          // Add a basic row even if there's an error
          csvRows.push(
            [
              safeCsvValue(entry.particulars || "Error"),
              safeCsvValue(entry.name || "Unknown"),
              "0.00",
              "0.00",
            ].join(",")
          );
        }
      });

      return csvRows.join("\n");
    } catch (error) {
      console.error("Error generating CSV data:", error);
      // Return minimal CSV with headers only
      return 'Particulars,Name,Debit,Credit\n"Error generating data","",0.00,0.00';
    }
  }, [data, safeCsvValue]);

  const handleCsvExport = useCallback(async () => {
    setIsExporting(true);
    try {
      // First try the API endpoint
      const headers = getAuthHeaders();
      const response = await fetch("/api/default-entry/export-csv", {
        method: "GET",
        headers,
      });

      if (response.ok) {
        const blob = await response.blob();
        const currentDate = new Date().toISOString().split("T")[0];
        downloadFile(blob, `Default Entries ${currentDate}.csv`);

        toast.success("CSV Export Successful", {
          description:
            "Account Entries have been exported to CSV successfully.",
          icon: <CircleCheck className="h-5 w-5" />,
          duration: 5000,
        });
        return; // Success, exit early
      } else {
        throw new Error(`API endpoint returned status: ${response.status}`);
      }
    } catch (apiError) {
      console.warn("API CSV export failed, using fallback:", apiError);

      // Fallback: Generate CSV from current data
      try {
        console.log(
          "Attempting CSV fallback with data:",
          data.length,
          "entries"
        );

        if (!data || data.length === 0) {
          toast.error("No Data to Export", {
            description:
              "There are no entries to export. Please refresh and try again.",
            duration: 5000,
          });
          return;
        }

        const csvContent = generateCsvFromData();
        console.log("Generated CSV content length:", csvContent.length);

        if (!csvContent || csvContent.length < 50) {
          // Basic sanity check
          throw new Error(
            "Generated CSV content appears to be empty or invalid"
          );
        }

        // Create blob with explicit UTF-8 BOM for Excel compatibility
        const BOM = "\uFEFF";
        const blob = new Blob([BOM + csvContent], {
          type: "text/csv;charset=utf-8;",
        });

        const currentDate = new Date().toISOString().split("T")[0];
        downloadFile(blob, `Default Entries ${currentDate}.csv`);

        toast.success("CSV Export Successful", {
          description: `Account Entries exported successfully (${data.length} entries).`,
          icon: <CircleCheck className="h-5 w-5" />,
          duration: 5000,
        });
      } catch (fallbackError) {
        console.error("Fallback CSV generation failed:", fallbackError);
        console.error("Data structure:", data);

        toast.error("CSV Export Failed", {
          description:
            "Failed to export Account Entries to CSV. Please check the data and try again.",
          duration: 5000,
        });
      }
    } finally {
      setIsExporting(false);
    }
  }, [getAuthHeaders, downloadFile, generateCsvFromData, data]);

  const exportPdf = async (): Promise<string> => {
    const endpoint = `/default-entry/export-pdf`; // adjust endpoint if needed
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
    if (!data || data.length === 0) {
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
  }, [data]);

  return (
    <>
      <DataTable
        title="Accounting Entries Default Journal Entry"
        subtitle="Record a new general journal entry with account details, debit and credit amounts"
        data={data}
        columns={columns}
        filters={filters}
        search={search}
        onEdit={handleEdit}
        onDelete={requestDelete}
        onNew={handleNew}
        idField="id"
        enableNew={true}
        enablePdfExport={true}
        enableCsvExport={true}
        enableFilter={true}
        onPdfExport={handlePdfExport}
        onCsvExport={handleCsvExport}
        onLoading={loading || isExporting}
        onResetTable={onResetTable}
        showTotals={true}
        totalRowLabel="Total"
      />

      {/* Add/Edit Entry Dialog */}
      <AddEditEntryDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSave}
        editingEntry={editingEntry}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete the entry "{entryToDelete?.name}"?
              This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={cancelDelete}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
