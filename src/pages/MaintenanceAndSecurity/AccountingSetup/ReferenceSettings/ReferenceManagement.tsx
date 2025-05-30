"use client";

import { useEffect, useState } from "react";
import { CircleCheck, Info } from "lucide-react";
import { toast } from "sonner";
import {
  DataTable,
  type ColumnDefinition,
  type FilterDefinition,
  type SearchDefinition,
} from "@/components/data-table/data-table";
import { apiRequest } from "@/lib/api";
import { EditReferenceDialog, FormValues } from "./EditReferenceDialog";
import { DdeleteReferenceDialog } from "./DeleteReferenceDialog";

interface Module {
  id: string;
  name: string;
}

interface Reference {
  id: string;
  code: string;
  name: string;
  module: Module;
  status: boolean;
}

interface Pagination {
  current_page: number;
  per_page: number;
  total_pages: number;
  total_items: number;
}

interface DataPayload {
  count: number;
  references: Reference[];
  pagination: Pagination;
}

interface ApiResponse {
  status: string;
  message: string;
  data: DataPayload;
}

export default function ReferenceManagement() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reference, setReference] = useState<Reference[]>([]);
  const [loading, setLoading] = useState(true);
  const [reset, setReset] = useState(false);
  const [selectedReference, setSelectedReference] = useState<FormValues | null>(
    null
  );
  const [selectedReferenceId, setSelectedReferenceId] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [referenceToDeleteId, setReferenceToDeleteId] = useState("");
  const [referenceToDelete, setReferenceToDelete] = useState("");
  const [onResetTable, setOnResetTable] = useState(false);
  const [availableModules, setAvailableModules] = useState<Module[]>([]);

  const fetchReference = async () => {
    setLoading(true);
    try {
      const response = await apiRequest<ApiResponse>(
        "get",
        "/reference/",
        null,
        {
          useAuth: true,
          useBranchId: true,
        }
      );
      setReference(response.data.data.references);
      setOnResetTable(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchModules = async () => {
    try {
      const response = await apiRequest<{ data: { module: Module[] } }>(
        "get",
        "/module",
        null,
        {
          useAuth: true,
          useBranchId: true,
        }
      );
      setAvailableModules(response.data.data.module);
    } catch (error) {
      console.error("Error fetching modules:", error);
    }
  };

  const resetTable = () => {
    setOnResetTable(true);
    setTimeout(() => setOnResetTable(false), 100);
  };

  const columns: ColumnDefinition<Reference>[] = [
    {
      id: "code",
      header: "Reference Code",
      accessorKey: "code",
      enableSorting: true,
    },
    {
      id: "name",
      header: "Reference Name",
      accessorKey: "name",
      enableSorting: true,
    },
    {
      id: "module",
      header: "Associated Modules",
      accessorKey: "module",
      cell: (item) => item.module.name,
      enableSorting: true,
    },
  ];

  const filters: FilterDefinition[] = [
  {
    id: "code",
    label: "Code",
    type: "select",
    options: Array.from(new Set(reference.map((r) => r.code))).map((code) => ({
      label: code,
      value: code,
    })),
    placeholder: "Select Code",
  },
  {
    id: "name",
    label: "Name",
    type: "input",
    placeholder: "Enter Name",
  },
];


  const search: SearchDefinition = {
    title: "Search",
    placeholder: "Search Reference",
    enableSearch: true,
  };

  const handleEdit = (ref: Reference) => {
    setSelectedReference({
      code: ref.code,
      name: ref.name,
      module_id: ref.module.id,
      status: ref.status,
    });
    setSelectedReferenceId(ref.id);
    setDialogOpen(true);
  };

  const handleDelete = (ref: Reference) => {
    setDeleteDialogOpen(true);
    setReferenceToDeleteId(ref.id);
    setReferenceToDelete(ref.name);
  };

  const handleConfirmDelete = async () => {
    try {
      await apiRequest("delete", `/reference/${referenceToDeleteId}`, null, {
        useAuth: true,
        useBranchId: true,
      });

      toast.success("Reference Deleted", {
        description: `${referenceToDelete} has been successfully deleted.`,
        icon: <CircleCheck className="h-5 w-5" />,
        duration: 5000,
      });

      resetTable();
      fetchReference();
    } catch (err) {
      console.error("Error deleting Reference:", err);
      toast.error("Failed to delete Reference.");
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const handleNew = () => {
    setReset(false);
    setSelectedReference(null);
    setSelectedReferenceId("");
    setDialogOpen(true);
  };

  const handleSaveReference = async (values: FormValues) => {
    try {
      const method = selectedReferenceId ? "put" : "post";
      const endpoint = selectedReferenceId
        ? `/reference/${selectedReferenceId}`
        : "/reference/";
      const payloadData = {
        code: values.code,
        name: values.name,
        module_id: values.module_id,
        status: values.status,
      };

      const response = await apiRequest<{ data: { name: string } }>(
        method,
        endpoint,
        payloadData,
        {
          useAuth: true,
          useBranchId: true,
        }
      );

      toast.success(
        selectedReferenceId ? "Reference Updated" : "Reference Added",
        {
          description: `${response.data.data.name} has been successfully ${
            selectedReferenceId ? "updated" : "added"
          }.`,
          icon: <CircleCheck className="h-5 w-5" />,
          duration: 5000,
        }
      );

      setReset(true);
      resetTable();
      fetchReference();
    } catch (err) {
      console.error("Error saving Reference:", err);
      throw err;
    }
  };

  
  useEffect(() => {
    fetchReference();
    fetchModules();
  }, []);

  return (
    <>
         
        <div className="bg-white rounded-lg border p-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
            <Info className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-medium">Global Reference Data</h2>
            <p className="text-sm text-muted-foreground">
              Reference settings defined here are globally accessible and applicable across all branches of the
              application. Changes made here will affect all modules that use these references.
            </p>
          </div>
        </div>
      </div>


       
      <DataTable
        title="Reference Management"
        subtitle="Create, edit, and delete reference entries used throughout the system"
        data={reference}
        columns={columns}
        filters={filters}
        search={search}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onNew={handleNew}
        idField="id"
        enableNew
        enablePdfExport={false}
        enableCsvExport={false}
        enableFilter={true}
        onLoading={loading}
        onResetTable={onResetTable}
      />

      <EditReferenceDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSaveReference}
        onReset={reset}
        initialValues={selectedReference}
        modules={availableModules}
      />

      <DdeleteReferenceDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Reference"
        description={`Are you sure you want to delete the reference: ${referenceToDelete}?`}
        itemName={referenceToDelete}
      />
    </>
  );
}
