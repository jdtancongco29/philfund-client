"use client"

import { useEffect, useState } from "react"
import { DataTable, type SearchDefinition, type ColumnDefinition, type FilterDefinition } from "@/components/data-table/data-table"
import { BranchDialog, FormValues } from "./BranchDialog";
import { toast } from 'sonner';
import { CircleCheck } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog";

type DepartmentItems = {
  id: string,
  name: string
}

interface Branch {
  id: string
  code: string
  name: string
  email: string
  address: string
  contact: string
  city: string
  departments: DepartmentItems[]
  status: boolean
}

export function BranchTable() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState(true)
  const [reset, setReset] = useState(false)
  const [selectedBranch, setSelectedBranch] = useState<FormValues | null>(null)
  const [selectedBranchId, setSelectedBranchId] = useState<string>("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [branchToDeleteId, setBranchToDeleteId] = useState<string>("")
  const [branchToDelete, setBranchToDelete] = useState<string>("null")
  const [onResetTable, setOnResetTable] = useState(false)
  const [departments, setDepartments] = useState<DepartmentItems[]>([])


  const fetchBranches = async () => {
    setLoading(true);
    try {
      const response = await apiRequest<{ data: { branches: any[] } }>(
        'get',
        '/branch/',
        null,
        {
          useAuth: true,
          useBranchId: true,
        }
      );
      setBranches(response.data.data.branches);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartment = async () => {
    try {
      const response = await apiRequest<{ data: { departments: any[] } }>(
        'get',
        '/department/',
        null,
        {
          useAuth: true,
          useBranchId: true,
        }
      );

      const departmentData = response.data.data.departments.map((dept: any) => ({
        id: dept.id,
        name: dept.name,
      }));
      setDepartments(departmentData);
    } catch (err) {
      console.error(err);
    }
  };

  const resetTable = () => {
    setOnResetTable(true);
    setTimeout(() => setOnResetTable(false), 100)
  }

  useEffect(() => {
    fetchBranches();
  }, []);

  // Define columns
  const columns: ColumnDefinition<Branch>[] = [
    {
      id: "code",
      header: "Code",
      accessorKey: "code",
      enableSorting: true,
    },
    {
      id: "name",
      header: "Name",
      accessorKey: "name",
      enableSorting: true,
    },
    {
      id: "city",
      header: "City/Municipality",
      accessorKey: "city",
      enableSorting: true,
    },
    {
      id: "departments",
      header: "Departments",
      accessorKey: "departments",
      enableSorting: true,
      cell: (row) => {
        const departments: DepartmentItems[] = row.departments ?? [];

        if (departments.length === 0) return null;

        const firstDeptName = departments[0]?.name;
        const remainingCount = departments.length - 1;

        return (
          <div className="flex items-center gap-2">
            <span className="border border-[#D0D5DD] rounded-full px-4 py-1 text-sm text-black">
              {firstDeptName}
            </span>
            {remainingCount > 0 && (
              <span className="border border-[#D0D5DD] rounded-full px-3 py-1 text-sm text-black">
                {remainingCount}+
              </span>
            )}
          </div>
        );
      }
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      displayCondition: [
        {
          value: true,
          label: "Active",
          className: "py-[2px] px-[10px] bg-emerald-600 text-white rounded-full",
        },
        {
          value: false,
          label: "Inactive",
          className: "py-[2px] px-[10px] bg-[var(--destructive)] text-white rounded-full",
        },
      ],
      enableSorting: true,
    }
  ]

  // Define filters
  const filters: FilterDefinition[] = []

  const search: SearchDefinition = {
    title: "Search",
    placeholder: "Search Branch",
    enableSearch: true,
  };

  // Handle edit
  const handleEdit = (branch: Branch) => {
    setSelectedBranch(branch)
    setSelectedBranchId(branch.id)
    setDialogOpen(true)
  }

  // Handle delete
  const handleDelete = (branch: Branch) => {
    setDeleteDialogOpen(true);
    setBranchToDeleteId(branch.id)
    setBranchToDelete(branch?.name)
  }

  const handleConfirmDelete = async () => {
    try {
      await apiRequest(
        'delete',
        `/branch/${branchToDeleteId}`,
        null,
        {
          useAuth: true,
          useBranchId: true,
        }
      );

      toast.success(`Department Deleted`, {
        description: `${branchToDelete} has been successfully deleted.`,
        icon: <CircleCheck className="h-5 w-5" />,
        duration: 5000,
      });

      resetTable();
      fetchBranches();
    } catch (err) {
      console.error('Error deleting branch:', err);
      toast.error('Failed to delete branch.');
    } finally {
      setDeleteDialogOpen(false);
    }
  }

  const handleCloseDeleteDialog = async () => {
    setDeleteDialogOpen(false)
    setBranchToDeleteId("")
    setBranchToDelete("")
  }

  // Handle new
  const handleNew = () => {
    fetchDepartment();
    setReset(false)
    setSelectedBranch(null)
    setSelectedBranchId("")
    setDialogOpen(true)
  }

  function sanitizeString(str: string): string {
    if (typeof str !== 'string') return str;
    return str.normalize('NFC').replace(/[^\x00-\x7F]/g, '');
  }
  // CREATE or Update
  const handleSaveBranch = async (values: {
    code: string;
    name: string;
    email: string;
    address: string;
    contact: string;
    city: string;
    departments: { id: string; name: string }[];
    status: boolean;
  }) => {
    console.log(values);
    try {
      const method = selectedBranchId ? 'put' : 'post';
      const endpoint = selectedBranchId ? `/branch/${selectedBranchId}` : '/branch';
      const payloadData = {
        code: sanitizeString(values.code),
        name: sanitizeString(values.name),
        email: sanitizeString(values.email),
        address: sanitizeString(values.address),
        contact: sanitizeString(values.contact),
        city: sanitizeString(values.city),
        departments: values.departments?.map((dept: { id: string }) => dept.id) || [],
        status: values.status,
      };
      console.log(payloadData);
      console.log(method);
      console.log(endpoint);
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
        selectedBranchId ? 'Branch Updated' : 'Branch Added',
        {
          description: `${response.data.data.name} has been successfully ${selectedBranchId ? 'updated' : 'added'}.`,
          icon: <CircleCheck className="h-5 w-5" />,
          duration: 5000,
        }
      );
      setReset(true)
      resetTable()
      fetchBranches()
    } catch (err) {
      console.error('Error adding branch:', err);
    } finally {
      setDialogOpen(false);
    }
  };

  return (
    <>
      <DataTable
        title="Branch List"
        subtitle=""
        data={branches}
        columns={columns}
        filters={filters}
        search={search}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onNew={handleNew}
        idField="id"
        enableNew={true}
        enablePdfExport={true}
        enableCsvExport={true}
        enableFilter={false}
        onLoading={loading}
        onResetTable={onResetTable}
      />

      <BranchDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSaveBranch}
        onReset={reset}
        initialValues={selectedBranch}
        departments={departments}
      />

      <DeleteConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        title="Delete Department"
        description="Are you sure you want to delete the branch '{name}'? This action cannot be undone."
        itemName={branchToDelete}
      />
    </>
  )
}