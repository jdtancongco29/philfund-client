// "use client"

// import { useState } from "react"
// import {
//   ArrowUpDown,
//   ChevronFirst,
//   ChevronLast,
//   ChevronLeft,
//   ChevronRight,
//   FileText,
//   Pencil,
//   Plus,
//   Search,
//   Table2,
//   Trash2,
// } from "lucide-react"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// // import { AddBranch } from "./AddBranch"

// interface Branch {
//   code: string
//   name: string
//   city: string
//   departments: string
//   departmentCount: string
//   status: "Active" | "Inactive"
// }

// export default function BranchTable() {
//   const [searchQuery, setSearchQuery] = useState("")
//   const [rowsPerPage, setRowsPerPage] = useState("10")
//   const [addDialogOpen, setAddDialogOpen] = useState(false)
//   // Sample data
//   const branches: Branch[] = [
//     {
//       code: "MAIN",
//       name: "Main Branch",
//       city: "Makati City",
//       departments: "Department 1",
//       departmentCount: "2+",
//       status: "Active",
//     },
//     {
//       code: "NORTH",
//       name: "Main Branch",
//       city: "Makati City",
//       departments: "Department 1",
//       departmentCount: "2+",
//       status: "Active",
//     },
//     {
//       code: "SOUTH",
//       name: "Main Branch",
//       city: "Makati City",
//       departments: "Department 1",
//       departmentCount: "2+",
//       status: "Active",
//     },
//     {
//       code: "EAST",
//       name: "Main Branch",
//       city: "Makati City",
//       departments: "Department 1",
//       departmentCount: "2+",
//       status: "Active",
//     },
//     {
//       code: "WEST",
//       name: "Main Branch",
//       city: "Makati City",
//       departments: "Department 1",
//       departmentCount: "2+",
//       status: "Inactive",
//     },
//     {
//       code: "MAIN",
//       name: "Main Branch",
//       city: "Makati City",
//       departments: "Department 1",
//       departmentCount: "2+",
//       status: "Inactive",
//     },
//   ]

//   return (
//     <div className="space-y-4">
//       <div className="flex items-center justify-between">
//         <h1 className="text-2xl font-bold">Branch List</h1>
//         <div className="flex items-center gap-2">
//           <Button variant="outline" size="sm">
//             <FileText className="mr-2 h-4 w-4" />
//             PDF
//           </Button>
//           <Button variant="outline" size="sm">
//             <Table2 className="mr-2 h-4 w-4" />
//             CSV
//           </Button>
//           <Button size="sm" onClick={() => setAddDialogOpen(true)} className="cursor-pointer">
//             <Plus className="h-4 w-4" />
//             New
//           </Button>
//         </div>
//       </div>

//       <div>
//         <h3 className="mb-2 font-medium">Search</h3>
//         <div className="relative">
//           <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//           <Input
//             placeholder="Search user..."
//             className="pl-8 w-[300px]"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>
//       </div>

//       <div className="rounded-md border">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead className="w-[100px]">
//                 <div className="flex items-center">
//                   Code
//                   <ArrowUpDown className="ml-2 h-4 w-4" />
//                 </div>
//               </TableHead>
//               <TableHead>
//                 <div className="flex items-center">
//                   Name
//                   <ArrowUpDown className="ml-2 h-4 w-4" />
//                 </div>
//               </TableHead>
//               <TableHead>
//                 <div className="flex items-center">
//                   City/Municipality
//                   <ArrowUpDown className="ml-2 h-4 w-4" />
//                 </div>
//               </TableHead>
//               <TableHead>
//                 <div className="flex items-center">
//                   Departments
//                   <ArrowUpDown className="ml-2 h-4 w-4" />
//                 </div>
//               </TableHead>
//               <TableHead>
//                 <div className="flex items-center">
//                   Status
//                   <ArrowUpDown className="ml-2 h-4 w-4" />
//                 </div>
//               </TableHead>
//               <TableHead className="w-[100px]"></TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {branches.map((branch, index) => (
//               <TableRow key={index}>
//                 <TableCell>{branch.code}</TableCell>
//                 <TableCell>{branch.name}</TableCell>
//                 <TableCell>{branch.city}</TableCell>
//                 <TableCell>
//                   <div className="flex items-center gap-2">
//                     <span>{branch.departments}</span>
//                     <Badge variant="outline">{branch.departmentCount}</Badge>
//                   </div>
//                 </TableCell>
//                 <TableCell>
//                   <Badge
//                     variant={branch.status === "Active" ? "default" : "destructive"}
//                     className={`rounded-full ${branch.status === "Active" ? "bg-emerald-500 hover:bg-emerald-600" : ""}`}
//                   >
//                     {branch.status}
//                   </Badge>
//                 </TableCell>
//                 <TableCell>
//                   <div className="flex justify-end gap-2">
//                     <Button variant="ghost" size="icon">
//                       <Pencil className="h-4 w-4" />
//                     </Button>
//                     <Button variant="ghost" size="icon">
//                       <Trash2 className="h-4 w-4 text-destructive" />
//                     </Button>
//                   </div>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>

//       <div className="flex items-center justify-end gap-8">
//         <div className="flex items-center gap-2">
//           <span className="text-sm text-muted-foreground">Rows per page</span>
//           <Select value={rowsPerPage} onValueChange={setRowsPerPage}>
//             <SelectTrigger className="h-8 w-[70px]">
//               <SelectValue placeholder="10" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="10">10</SelectItem>
//               <SelectItem value="20">20</SelectItem>
//               <SelectItem value="50">50</SelectItem>
//               <SelectItem value="100">100</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         <div className="flex items-center gap-1">
//           <span className="text-sm text-muted-foreground">Page 1 of 10</span>
//           <div className="flex items-center">
//             <Button variant="outline" size="icon" className="h-8 w-8">
//               <ChevronFirst className="h-4 w-4" />
//             </Button>
//             <Button variant="outline" size="icon" className="h-8 w-8">
//               <ChevronLeft className="h-4 w-4" />
//             </Button>
//             <Button variant="outline" size="icon" className="h-8 w-8">
//               <ChevronRight className="h-4 w-4" />
//             </Button>
//             <Button variant="outline" size="icon" className="h-8 w-8">
//               <ChevronLast className="h-4 w-4" />
//             </Button>
//           </div>
//         </div>
//       </div>
//       {/* <AddBranch open={addDialogOpen} onOpenChange={setAddDialogOpen} /> */}
//     </div>
//   )
// }

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
    const [branchToDelete, setBranchToDelete] = useState< string >("null")
    const [onResetTable, setOnResetTable] = useState(false)

    const fetchBranches = async () => {
      setLoading(true);
      try {
        // const response = await apiRequest<{ data: { branches: any[] } }>(
        //   'get',
        //   '/branch/',
        //   null,
        //   {
        //     useAuth: true,
        //     useBranchId: true,
        //   }
        // );
        // setBranches(response.data.data.branches);
        setBranches([
          {
            id: "ffa12bf7-0766-4b32-8a39-e8c4d3e9e884",
            code: "002",
            name: "Branch 2",
            email: "branch2@gmail.com",
            address: "Zone 1 carmen cdo",
            contact: "09381726121",
            city: "Cagayan de Oro City",
            status: true,
            departments: [
              {
                  id: "a5513ab9-8491-41ba-95ff-8f1b4d62070f",
                  name: "Accounting"
              },
              {
                  id: "fd522940-8a26-45d7-b8d6-c1dd555dbe2f",
                  name: "AGH"
              }
            ]
          },
          {
            id: "ffa12bf7-0766-4b32-8a39-e8c4d3e9e885",
            code: "003",
            name: "Branch 3",
            email: "branch3@gmail.com",
            address: "Zone 1 carmen cdo",
            contact: "09381726121",
            city: "Cagayan de Oro City",
            status: false,
            departments: [
              {
                  id: "a5513ab9-8491-41ba-95ff-8f1b4d62071f",
                  name: "Department 1"
              },
              {
                  id: "fd522940-8a26-45d7-b8d6-c1dd555dbe3f",
                  name: "Department 2"
              },
              {
                  id: "fd522940-8a26-45d7-b8d6-c1dd555dbe4f",
                  name: "Department 3"
              }
            ]
          }
        ])
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
      // setSelectedDepartment(department)
      // setSelectedDepartmentId(department.id)
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
        // setReset(false)
        // setSelectedDepartment(null)
        // setSelectedDepartmentId("")
        setDialogOpen(true)
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
      // try {
      //   const apiUrl = selectedDepartment
      //   ? `${API_URL}/department/${selectedDepartmentId}`
      //   : `${API_URL}/department/`;
      //   const response = await fetch(apiUrl, {
      //     method: selectedDepartmentId ? 'PUT' : 'POST',
      //     headers: {
      //       'Content-Type': 'application/json',
      //       Accept: 'application/json',
      //       Authorization: `Bearer ${token}`,
      //     },
      //     body: JSON.stringify({
      //       code: values.code,
      //       name: values.name,
      //       status: values.status,
      //     }),
      //   });

      //   if (!response.ok) {
      //     throw new Error('Failed to add department');
      //   }

      //   const data = await response.json();

      //   selectedDepartmentId ? (
      //     toast.success(`Department Updated`, {
      //       description: `${data.data.name} has been successfully updated.`,
      //       icon: <CircleCheck className="h-5 w-5" />,
      //       duration: 5000,
      //     })
      //   ) : (
      //     toast.success(`Department Added`, {
      //       description: `${data.data.name} has been successfully added.`,
      //       icon: <CircleCheck className="h-5 w-5" />,
      //       duration: 5000,
      //     })
      //   )
      //   setReset(true);
      //   fetchDepartments();
      // } catch (err) {
      //   console.error('Error adding department:', err);
      // } finally {
      //   setDialogOpen(false);
      // }
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