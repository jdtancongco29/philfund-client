import  { useEffect, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";

import { CircleCheck } from "lucide-react";
import { apiRequest } from "@/lib/api";
import {
  DataTable,
  type ColumnDefinition,
  type FilterDefinition,
} from "@/components/data-table/data-table";
import { toast } from "sonner";
import { EditBankDialog, FormValues } from "./EditBankDialog";
import { DeleteDataDialog } from "./DeleteDataDialog";

interface Bank {
  id: string;
  branch_id: string;
  branch_name: string;
  coa_id: string;
  coa_code: string;
  coa_name: string;
  code: string;
  name: string;
  address: string;
  account_type: string;
  status: number;
}

interface Pagination {
  current_page: number;
  per_page: number;
  total_pages: number;
  total_items: number;
}

interface BankDataPayload {
  count: number;
  banks: Bank[];
  pagination: Pagination;
}

interface ApiResponse {
  status: string;
  message: string;
  data: BankDataPayload;
}

export default function BankAccountsTable() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [item, setItem] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(true);
  const [reset, setReset] = useState(false);
  const [selectedItem, setSelectedItem] = useState<FormValues | null>(null);
  const [selectedItemId, setSelectedItemId] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDeleteId, setItemToDeleteId] = useState("");
  const [itemToDelete, setItemToDelete] = useState("");
  const [onResetTable, setOnResetTable] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await apiRequest<ApiResponse>("get", "/bank/", null, {
        useAuth: true,
        useBranchId: true,
      });
      setItem(response.data.data.banks);
      setOnResetTable(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnDefinition<Bank>[] = [
    {
      id: "code",
      header: "Code",
      accessorKey: "code",
      enableSorting: true,
    },
    {
      id: "name",
      header: "Bank Name",
      accessorKey: "name",
      enableSorting: true,
    },
    {
      id: "branch_name",
      header: "Branch",
      accessorKey: "branch_name",
      enableSorting: true,
    },
    {
      id: "account_type",
      header: "Account Type",
      accessorKey: "account_type",
      enableSorting: true,
    },
    {
      id: "address",
      header: "Address",
      accessorKey: "address",
      enableSorting: false,
    },
  ];

  const filters: FilterDefinition[] = [];

  const resetTable = () => {
    setOnResetTable(true);
    setTimeout(() => setOnResetTable(false), 100);
  };

  const search = {
    title: "Search",
    placeholder: "Search Bank Account",
    enableSearch: true,
  };

  const handleEdit = (bank: Bank) => {
    setSelectedItem({
      code: bank.code,
      name: bank.name,
      address: bank.address,
      branch_id: bank.branch_id,
           branch_name: bank.branch_name,
      coa_name: bank.coa_name,
      coa_id: bank.coa_id,
      account_type: bank.account_type,
      status: bank.status,
    });
    setSelectedItemId(bank.id);
    setDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await apiRequest("delete", `/bank/${itemToDeleteId}`, null, {
        useAuth: true,
        useBranchId: true,
      });

      toast.success("Bank Deleted", {
        description: `${itemToDeleteId} has been successfully deleted.`,
        icon: <CircleCheck className="h-5 w-5" />,
        duration: 5000,
      });

      resetTable();
      fetchData();
    } catch (err) {
      console.error("Error deleting Reference:", err);
      toast.error("Failed to delete Reference.");
    } finally {
      setDeleteDialogOpen(false);
    }
  };
  const handleDelete = (bank: Bank) => {
    setDeleteDialogOpen(true);
    setItemToDeleteId(bank.id);
    setItemToDelete(bank.name);
  };

  const handleSaveItem = async (values: FormValues) => {
    try {
      const method = selectedItemId ? "put" : "post";
      const endpoint = selectedItemId ? `/bank/${selectedItemId}` : "/bank/";
      const payloadData = {
        code: values.code,
        name: values.name,
        address: values.address,
        branch_id: values.branch_id,
        coa_id: values.coa_id,
        account_type: values.account_type,
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

      toast.success(selectedItemId ? "Reference Updated" : "Reference Added", {
        description: `${response.data.data.name} has been successfully ${
          selectedItemId ? "updated" : "added"
        }.`,
        icon: <CircleCheck className="h-5 w-5" />,
        duration: 5000,
      });

      setReset(true);
      resetTable();
      fetchData();
    } catch (err) {
      console.error("Error saving Reference:", err);
      throw err;
    }
  };

  const handleNew = () => {
    setReset(false);
    setSelectedItem(null);
    setSelectedItemId("");
    setDialogOpen(true);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <DataTable
          title="Bank Accounts"
          subtitle="Manage existing bank accounts"
          data={item}
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
          enableFilter={false}
          onLoading={loading}
          onResetTable={onResetTable}
        />
      </CardContent>
      <EditBankDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSaveItem}
        onReset={reset}
        initialValues={selectedItem}
      />
        <DeleteDataDialog
              isOpen={deleteDialogOpen}
              onClose={() => setDeleteDialogOpen(false)}
              onConfirm={handleConfirmDelete}
              title="Delete Bank Account"
              description={`Are you sure you want to delete the bank account: ${itemToDelete}?`}
              itemName={itemToDelete}
            />
    </Card>
  );
}
