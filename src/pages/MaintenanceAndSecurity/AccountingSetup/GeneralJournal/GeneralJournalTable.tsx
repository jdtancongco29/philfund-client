"use client";

import { useEffect, useState, useCallback } from "react";
import { apiRequest } from "@/lib/api";

import AddEditEntryDialog from "./AddEditDialog";
import { DdeleteReferenceDialog } from "./DdeleteDialog";
import { CircleCheck, Download } from "lucide-react";
import { toast } from "sonner";
import {
  ColumnDefinition,
  DataTable,
  FilterDefinition,
  SearchDefinition,
} from "@/components/data-table/data-table-general-journal";

interface GeneralJournalEntry {
  id?: string;
  name: string;
  particulars?: string;
  ref: {
    id: string;
    code: string;
    number: number;
  };
  trans_amount: string;
  transaction_date: string;
  status: boolean;
  branch: {
    id: string;
    name: string;
  };
  prepared_by: {
    id: string;
    name: string;
  };
  checked_by: {
    id: string;
    name: string;
  };
  approved_by: {
    id: string;
    name: string;
  };
  items?: Array<{
    id: string;
    coa: {
      id: string;
      code: string;
      name: string;
    };
    debit: number;
    credit: number;
  }>;
}

interface DataPayload {
  count: number;
  general_journals: GeneralJournalEntry[];
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

export default function GeneralJournalTable() {
  const [loading, setLoading] = useState(true);
  const [onResetTable, setOnResetTable] = useState(false);
  const [data, setData] = useState<GeneralJournalEntry[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<GeneralJournalEntry | null>(
    null
  );
  const [isExporting, setIsExporting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] =
    useState<GeneralJournalEntry | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiRequest<ApiResponse>(
        "get",
        "/general-journal/",
        null,
        {
          useAuth: true,
          useBranchId: true,
        }
      );

      if (response.data?.data?.general_journals) {
        setData(response.data.data.general_journals);
        setOnResetTable(true);
      } else {
        console.warn("Unexpected API response structure:", response);
        setData([]);
      }
    } catch (err) {
      console.error("Failed to fetch general journal data:", err);
      toast.error("Failed to Load Data", {
        description:
          "Could not fetch general journal entries. Please try again.",
        duration: 5000,
      });
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleNew = useCallback(() => {
    setEditingEntry(null);
    setIsDialogOpen(true);
  }, []);

  const handleEdit = useCallback(async (entry: GeneralJournalEntry) => {
    if (!entry.id) {
      toast.error("Invalid Entry", {
        description: "Cannot edit entry without ID.",
        duration: 3000,
      });
      return;
    }

    try {
      const response = await apiRequest<{ data: GeneralJournalEntry }>(
        "get",
        `/general-journal/${entry.id}`,
        null,
        {
          useAuth: true,
          useBranchId: true,
        }
      );

      if (response.data?.data) {
        setEditingEntry(response.data.data);
        setIsDialogOpen(true);
      } else {
        throw new Error("Invalid response structure");
      }
    } catch (error) {
      console.error("Failed to fetch entry details:", error);
      toast.error("Failed to Load Entry", {
        description: "Could not load entry details for editing.",
        duration: 5000,
      });
    }
  }, []);

  const requestDelete = useCallback((entry: GeneralJournalEntry) => {
    setEntryToDelete(entry);
    setDeleteDialogOpen(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!entryToDelete?.id) return;

    try {
      await apiRequest("delete", `/general-journal/${entryToDelete.id}`, null, {
        useAuth: true,
        useBranchId: true,
      });

      setDeleteDialogOpen(false);
      setEntryToDelete(null);

      // Optimistic update - remove from local state immediately
      setData((prevData) =>
        prevData.filter((item) => item.id !== entryToDelete.id)
      );

      toast.success("General Journal Deleted", {
        description: "General Journal entry has been successfully deleted.",
        icon: <CircleCheck className="h-5 w-5" />,
        duration: 5000,
      });

      // Refresh data to ensure consistency
      fetchData();
    } catch (error) {
      console.error("Failed to delete entry:", error);
      toast.error("Delete Failed", {
        description: "Failed to delete the entry. Please try again.",
        duration: 5000,
      });
    }
  }, [entryToDelete, fetchData]);

  const cancelDelete = useCallback(() => {
    setDeleteDialogOpen(false);
    setEntryToDelete(null);
  }, []);

  const handleSave = useCallback(
    (savedEntry: GeneralJournalEntry) => {
      if (editingEntry && savedEntry.id) {
        // Update existing entry
        setData((prevData) =>
          prevData.map((item) =>
            item.id === savedEntry.id ? savedEntry : item
          )
        );
      } else {
        // Add new entry
        setData((prevData) => [savedEntry, ...prevData]);
      }

      // Refresh to ensure data consistency
      fetchData();
    },
    [editingEntry, fetchData]
  );

  const handleCloseDialog = useCallback(() => {
    setIsDialogOpen(false);
    setEditingEntry(null);
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
      const headers = [
        "Transaction Date",
        "Reference Number",
        "Name",
        "Particulars",
        "Debit Amount",
        "Credit Amount",
        "Status",
        "Branch",
        "Prepared By",
        "Checked By",
        "Approved By",
      ];

      const csvRows = [headers.join(",")];

      // Process each entry with proper error handling
      data.forEach((entry) => {
        try {
          const row = [
            safeCsvValue(new Date(entry.transaction_date).toLocaleDateString()),
            safeCsvValue(
              `${entry.ref?.code || "N/A"}-${entry.ref?.number || "0"}`
            ),
            safeCsvValue(entry.name || ""),
            safeCsvValue(entry.particulars || ""),
            parseFloat(entry.trans_amount || "0").toFixed(2),
            parseFloat(entry.trans_amount || "0").toFixed(2),
            entry.status ? "Active" : "Inactive",
            safeCsvValue(entry.branch?.name || "N/A"),
            safeCsvValue(entry.prepared_by?.name || "N/A"),
            safeCsvValue(entry.checked_by?.name || "N/A"),
            safeCsvValue(entry.approved_by?.name || "N/A"),
          ];
          csvRows.push(row.join(","));
        } catch (entryError) {
          console.warn("Error processing entry for CSV:", entryError, entry);
          // Add a basic row even if there's an error
          csvRows.push(
            [
              safeCsvValue("Error"),
              safeCsvValue("Error"),
              safeCsvValue(entry.name || "Unknown"),
              '""',
              "0.00",
              "0.00",
              "Unknown",
              '""',
              '""',
              '""',
              '""',
            ].join(",")
          );
        }
      });

      // Add totals row
      try {
        const totalDebit = data.reduce((sum, entry) => {
          const amount = parseFloat(entry.trans_amount || "0");
          return sum + (isNaN(amount) ? 0 : amount);
        }, 0);
        const totalCredit = totalDebit; // Assuming balanced entries

        csvRows.push(
          [
            '"TOTAL"',
            '""',
            '""',
            '""',
            totalDebit.toFixed(2),
            totalCredit.toFixed(2),
            '""',
            '""',
            '""',
            '""',
            '""',
          ].join(",")
        );
      } catch (totalError) {
        console.warn("Error calculating totals for CSV:", totalError);
      }

      return csvRows.join("\n");
    } catch (error) {
      console.error("Error generating CSV data:", error);
      // Return minimal CSV with headers only
      return 'Transaction Date,Reference Number,Name,Particulars,Debit Amount,Credit Amount,Status,Branch,Prepared By,Checked By,Approved By\n"Error generating data","","","",0.00,0.00,"","","","",""';
    }
  }, [data, safeCsvValue]);

  const handleCsvExport = useCallback(async () => {
    setIsExporting(true);
    try {
      // First try the API endpoint
      const headers = getAuthHeaders();
      const response = await fetch("/api/general-journal/export-csv", {
        method: "GET",
        headers,
      });

      if (response.ok) {
        const blob = await response.blob();
        const currentDate = new Date().toISOString().split("T")[0];
        downloadFile(blob, `general-journal-${currentDate}.csv`);

        toast.success("CSV Export Successful", {
          description: "General Journal has been exported to CSV successfully.",
          icon: <Download className="h-5 w-5" />,
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
        downloadFile(blob, `general-journal-${currentDate}.csv`);

        toast.success("CSV Export Successful", {
          description: `General Journal exported successfully (${data.length} entries).`,
          icon: <Download className="h-5 w-5" />,
          duration: 5000,
        });
      } catch (fallbackError) {
        console.error("Fallback CSV generation failed:", fallbackError);
        console.error("Data structure:", data);

        toast.error("CSV Export Failed", {
          description:
            "Failed to export General Journal to CSV. Please check the data and try again.",
          duration: 5000,
        });
      }
    } finally {
      setIsExporting(false);
    }
  }, [getAuthHeaders, downloadFile, generateCsvFromData, data]);

  const columns: ColumnDefinition<GeneralJournalEntry>[] = [
    {
      id: "transaction_date",
      header: "Datetime",
      accessorKey: "transaction_date",
      enableSorting: true,
      cell: (item) => new Date(item.transaction_date).toLocaleDateString(),
    },
    {
      id: "ref",
      header: "Reference",
      accessorKey: "ref",
      cell: (item) => `${item.ref.code}-${item.ref.number}`,
      enableSorting: true,
    },
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
      cell: (item) => item.particulars || "-",
    },
    {
      id: "debit_amount",
      header: "Debit Amount",
      accessorKey: "trans_amount",
      cell: (item) => parseFloat(item.trans_amount || "0").toFixed(2),
      enableSorting: true,
      isNumeric: true,
    },
    {
      id: "credit_amount",
      header: "Credit Amount",
      accessorKey: "trans_amount",
      cell: (item) => parseFloat(item.trans_amount || "0").toFixed(2),
      enableSorting: true,
      isNumeric: true,
    },
  ];

  const filters: FilterDefinition[] = [];

  const search: SearchDefinition = {
    title: "Search",
    placeholder: "Search by name, particulars, or reference number",
    enableSearch: true,
  };

  const exportPdf = async (): Promise<string> => {
    const endpoint = `/general-journal/export-pdf`; // adjust endpoint if needed
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
  }, []);

  return (
    <>
      <DataTable
        title="General Journal"
        subtitle="Manage general journal entries"
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

      <AddEditEntryDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSave}
        editingEntry={editingEntry}
      />

      <DdeleteReferenceDialog
        isOpen={deleteDialogOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Delete General Journal Entry"
        description="Are you sure you want to delete the entry '{name}'? This action cannot be undone."
        itemName={entryToDelete?.name ?? ""}
      />
    </>
  );
}
