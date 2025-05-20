"use client"

import { useEffect, useState } from "react"
import { DataTable, type SearchDefinition, type ColumnDefinition, type FilterDefinition } from "@/components/data-table/data-table"
import { DepartmentDialog, FormValues } from "./DepartmentDialog";
import { toast } from 'sonner';
import { CircleCheck } from "lucide-react";
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog";
import { apiRequest } from "@/lib/api";
interface Department {
  id: string
  code: string
  name: string
  status: boolean
}

export function DepartmentsTable() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [reset, setReset] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState<FormValues | null>(null)
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [departmentToDeleteId, setDepartmentToDeleteId] = useState<string>("")
  const [departmentToDelete, setDepartmentToDelete] = useState<string>("null")
  const [onResetTable, setOnResetTable] = useState(false);

  const fetchDepartments = async () => {
    setLoading(true);
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

      setDepartments(response.data.data.departments);
      setOnResetTable(true)
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const resetTable = () => {
    setOnResetTable(true);
    setTimeout(() => setOnResetTable(false), 100)
  }

  useEffect(() => {
    fetchDepartments();
  }, []);

  // Define columns
  const columns: ColumnDefinition<Department>[] = [
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
    placeholder: "Search Department",
    enableSearch: true,
  };

  // Handle edit
  const handleEdit = (department: Department) => {
    setSelectedDepartment(department)
    setSelectedDepartmentId(department.id)
    setDialogOpen(true)
  }

  // Handle delete
  const handleDelete = (department: Department) => {
    setDeleteDialogOpen(true);
    setDepartmentToDeleteId(department.id)
    setDepartmentToDelete(department?.name)
  }

  const handleConfirmDelete = async () => {
    try {
      await apiRequest(
        'delete',
        `/department/${departmentToDeleteId}`,
        null,
        {
          useAuth: true,
          useBranchId: true,
        }
      );

      toast.success(`Department Deleted`, {
        description: `${departmentToDelete} has been successfully deleted.`,
        icon: <CircleCheck className="h-5 w-5" />,
        duration: 5000,
      });

      resetTable();
      fetchDepartments();
    } catch (err) {
      console.error('Error deleting department:', err);
      toast.error('Failed to delete department.');
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const handleCloseDeleteDialog = async () => {
    setDeleteDialogOpen(false)
    setDepartmentToDeleteId("")
    setDepartmentToDelete("")
  }

  // Handle new
  const handleNew = () => {
    setReset(false)
    setSelectedDepartment(null)
    setSelectedDepartmentId("")
    setDialogOpen(true)
  }
  // CREATE or Update
  const handleSaveDepartment = async (values: { code: string, name: string, status: boolean }) => {
    try {
      const method = selectedDepartmentId ? 'put' : 'post';
      const endpoint = selectedDepartmentId ? `/department/${selectedDepartmentId}` : '/department/';
      const payloadData = {
        code: values.code,
        name: values.name,
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

      console.log(response);

      toast.success(
        selectedDepartmentId ? 'Department Updated' : 'Department Added',
        {
          description: `${response.data.data.name} has been successfully ${selectedDepartmentId ? 'updated' : 'added'}.`,
          icon: <CircleCheck className="h-5 w-5" />,
          duration: 5000,
        }
      );
      setReset(true)
      resetTable()
      fetchDepartments()
    } catch (err) {
      console.error('Error adding department:', err);
    } finally {
      setDialogOpen(false);
    }
  };

  return (
    <>
      <DataTable
        title="Department"
        subtitle="Manage existing departments"
        data={departments}
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

      <DepartmentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSaveDepartment}
        onReset={reset}
        initialValues={selectedDepartment}
      />

      <DeleteConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        title="Delete Department"
        description="Are you sure you want to delete the department '{name}'? This action cannot be undone."
        itemName={departmentToDelete}
      />
    </>
  )
}