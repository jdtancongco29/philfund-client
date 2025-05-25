"use client"

import { useState, useEffect } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { SearchIcon } from "lucide-react"
import { DataTableV2 } from "@/components/data-table/data-table-v2"
import type { ColumnDefinition } from "@/components/data-table/data-table"
import type { ModulePermission, UserForSelection } from "./Service/PermissionsTypes"
import PermissionsService from "./Service/PermissionsService"
import { toast } from "sonner"

export function PermissionsTable() {
  const [selectedUser, setSelectedUser] = useState<UserForSelection | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [permissions, setPermissions] = useState<ModulePermission[]>([])
  const [originalPermissions, setOriginalPermissions] = useState<ModulePermission[]>([])
  const [hasChanges, setHasChanges] = useState(false)

//   const queryClient = useQueryClient()

  // Fetch all modules
  const { data: modulesData, isLoading: isLoadingModules } = useQuery({
    queryKey: ["modules"],
    queryFn: () => PermissionsService.getModules(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })

  // Fetch users for selection
  const { data: usersData, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["users-for-selection", searchQuery],
    queryFn: () => PermissionsService.getUsersForSelection(1, 50, searchQuery),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Fetch user permissions when user is selected
  const {
    data: userPermissions,
    isLoading: isLoadingPermissions,
    refetch: refetchPermissions,
  } = useQuery({
    queryKey: ["user-permissions", selectedUser?.id],
    queryFn: () => PermissionsService.getUserPermissions(selectedUser!.id),
    enabled: !!selectedUser,
    staleTime: 0,
  })

  // Update permissions mutation
  const updatePermissionsMutation = useMutation({
    mutationFn: PermissionsService.updateUserPermissions,
    onSuccess: () => {
      toast.success("Permissions updated successfully")
      setOriginalPermissions([...permissions])
      setHasChanges(false)
      refetchPermissions()
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update permissions")
    },
  })

  // Fetch branches mutation
const { mutate: fetchModules } = useMutation({
    mutationFn: PermissionsService.getModules,
    onSuccess: (data) => {
        console.log(data);
    // const newBranchCollection =
    //     data.data.branches?.map((branch: { id: string; name: string }) => ({
    //     id: branch.id,
    //     name: branch.name,
    //     })) || []
    // setBranchesData(newBranchCollection)
    },
    onError: (error) => {
    toast.error("Failed to fetch modules")
    console.error(error)
    },
})

  useEffect(() => {
    if(selectedUser){
        fetchModules()
    }
  }, [selectedUser])
  

  // Create permissions matrix when modules and user permissions are loaded
  useEffect(() => {
    if (modulesData?.data.modules && selectedUser) {
      const modules = modulesData.data.modules
      const userPerms = userPermissions?.data.permissions || []

      // Create permission objects for each module
      const permissionsMatrix: ModulePermission[] = modules.map((module) => {
        const existingPermission = userPerms.find((perm) => perm.module_id === module.id)

        return {
          id: existingPermission?.id || `${selectedUser.id}-${module.id}`,
          user_id: selectedUser.id,
          module_id: module.id,
          module_name: module.name,
        //   module_description: module.description,
          can_access: existingPermission?.can_access || false,
          can_add: existingPermission?.can_add || false,
          can_edit: existingPermission?.can_edit || false,
          can_delete: existingPermission?.can_delete || false,
          can_export: existingPermission?.can_export || false,
          can_print: existingPermission?.can_print || false,
        }
      })

      setPermissions(permissionsMatrix)
      setOriginalPermissions(JSON.parse(JSON.stringify(permissionsMatrix)))
      setHasChanges(false)
    } else if (!selectedUser) {
      // Show modules without permissions when no user is selected
      if (modulesData?.data.modules) {
        const emptyPermissions: ModulePermission[] = modulesData.data.modules.map((module) => ({
          id: `empty-${module.id}`,
          user_id: "",
          module_id: module.id,
          module_name: module.name,
        //   module_description: module.description,
          can_access: false,
          can_add: false,
          can_edit: false,
          can_delete: false,
          can_export: false,
          can_print: false,
        }))
        setPermissions(emptyPermissions)
        setOriginalPermissions([])
        setHasChanges(false)
      }
    }
  }, [modulesData, userPermissions, selectedUser])

  // Check for changes
  useEffect(() => {
    if (selectedUser && originalPermissions.length > 0) {
      const hasChanges = JSON.stringify(permissions) !== JSON.stringify(originalPermissions)
      setHasChanges(hasChanges)
    }
  }, [permissions, originalPermissions, selectedUser])

  // Handle user selection
  const handleUserSelect = (userId: string) => {
    const user = usersData?.data.users.find((u) => u.id === userId)
    if (user) {
      setSelectedUser(user)
      setPermissions([])
      setOriginalPermissions([])
      setHasChanges(false)
    }
  }

  // Handle permission change
  const handlePermissionChange = (moduleId: string, permissionType: string, checked: boolean) => {
    if (!selectedUser) return

    setPermissions((prev) =>
      prev.map((perm) =>
        perm.module_id === moduleId
          ? {
              ...perm,
              [permissionType]: checked,
              // If unchecking access, uncheck all other permissions
              ...(permissionType === "can_access" && !checked
                ? {
                    can_add: false,
                    can_edit: false,
                    can_delete: false,
                    can_export: false,
                    can_print: false,
                  }
                : {}),
              // If checking any permission, ensure access is checked
              ...(permissionType !== "can_access" && checked ? { can_access: true } : {}),
            }
          : perm,
      ),
    )
  }

  // Handle "All" checkbox for a module
  const handleAllPermissions = (moduleId: string, checked: boolean) => {
    if (!selectedUser) return

    setPermissions((prev) =>
      prev.map((perm) =>
        perm.module_id === moduleId
          ? {
              ...perm,
              can_access: checked,
              can_add: checked,
              can_edit: checked,
              can_delete: checked,
              can_export: checked,
              can_print: checked,
            }
          : perm,
      ),
    )
  }

  // Check if all permissions are enabled for a module
  const isAllPermissionsEnabled = (permission: ModulePermission) => {
    return (
      permission.can_access &&
      permission.can_add &&
      permission.can_edit &&
      permission.can_delete &&
      permission.can_export &&
      permission.can_print
    )
  }

  // Handle save changes
  const handleSaveChanges = () => {
    if (!selectedUser) return

    const payload = {
      permissions: permissions.map((perm) => ({
        user_id: selectedUser.id,
        module_id: perm.module_id,
        can_access: perm.can_access ? 1 : 0,
        can_add: perm.can_add ? 1 : 0,
        can_edit: perm.can_edit ? 1 : 0,
        can_delete: perm.can_delete ? 1 : 0,
        can_export: perm.can_export ? 1 : 0,
        can_print: perm.can_print ? 1 : 0,
      })),
    }

    updatePermissionsMutation.mutate(payload)
  }

  // Handle reset
  const handleReset = () => {
    if (originalPermissions.length > 0) {
      setPermissions(JSON.parse(JSON.stringify(originalPermissions)))
      setHasChanges(false)
    }
  }

  // Define columns for permissions table
  const columns: ColumnDefinition<ModulePermission>[] = [
    {
      id: "module",
      header: "Module",
      accessorKey: "module_name",
      enableSorting: false,
      cell: (row) => (
        <div>
          <div className="font-medium">{row.module_name}</div>
          <div className="text-sm text-muted-foreground">
            {row.module_description || "Select a user to manage their permissions"}
          </div>
        </div>
      ),
    },
    {
      id: "all",
      header: "All",
      accessorKey: "can_access",
      enableSorting: false,
      cell: (row) => (
        <Checkbox
          checked={isAllPermissionsEnabled(row)}
          onCheckedChange={(checked) => handleAllPermissions(row.module_id, checked as boolean)}
          disabled={!selectedUser}
        />
      ),
    },
    {
      id: "add",
      header: "Add",
      accessorKey: "can_add",
      enableSorting: false,
      cell: (row) => (
        <Checkbox
          checked={row.can_add}
          onCheckedChange={(checked) => handlePermissionChange(row.module_id, "can_add", checked as boolean)}
          disabled={!selectedUser}
        />
      ),
    },
    {
      id: "edit",
      header: "Edit",
      accessorKey: "can_edit",
      enableSorting: false,
      cell: (row) => (
        <Checkbox
          checked={row.can_edit}
          onCheckedChange={(checked) => handlePermissionChange(row.module_id, "can_edit", checked as boolean)}
          disabled={!selectedUser}
        />
      ),
    },
    {
      id: "delete",
      header: "Delete",
      accessorKey: "can_delete",
      enableSorting: false,
      cell: (row) => (
        <Checkbox
          checked={row.can_delete}
          onCheckedChange={(checked) => handlePermissionChange(row.module_id, "can_delete", checked as boolean)}
          disabled={!selectedUser}
        />
      ),
    },
    {
      id: "read",
      header: "Read",
      accessorKey: "can_access",
      enableSorting: false,
      cell: (row) => (
        <Checkbox
          checked={row.can_access}
          onCheckedChange={(checked) => handlePermissionChange(row.module_id, "can_access", checked as boolean)}
          disabled={!selectedUser}
        />
      ),
    },
    {
      id: "export",
      header: "Generate PDF/CSV",
      accessorKey: "can_export",
      enableSorting: false,
      cell: (row) => (
        <Checkbox
          checked={row.can_export}
          onCheckedChange={(checked) => handlePermissionChange(row.module_id, "can_export", checked as boolean)}
          disabled={!selectedUser}
        />
      ),
    },
    {
      id: "print",
      header: "Cancel/Void",
      accessorKey: "can_print",
      enableSorting: false,
      cell: (row) => (
        <Checkbox
          checked={row.can_print}
          onCheckedChange={(checked) => handlePermissionChange(row.module_id, "can_print", checked as boolean)}
          disabled={!selectedUser}
        />
      ),
    },
  ]

  const isLoading = isLoadingModules || isLoadingPermissions

  useEffect(() => {
    console.log('permissions', permissions);
  }, [permissions])
  
  return (
    <div className="flex gap-6 h-[calc(100vh-2rem)]">
      {/* Left Sidebar - User Selection */}
      <div className="w-80 flex-shrink-0">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Search User</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* User Search */}
            <div className="space-y-2">
              <Label htmlFor="user-search">
                Search User <span className="text-red-500">*</span>
              </Label>
              {/* <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="user-search"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div> */}
              <Select onValueChange={handleUserSelect} disabled={isLoadingUsers}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  {usersData?.data.users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.full_name} ({user.username})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* User Details */}
            {selectedUser && (
              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-semibold">User Details</h3>

                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">User role</Label>
                  <p className="font-medium">{selectedUser.position}</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Name</Label>
                  <p className="font-medium">{selectedUser.full_name}</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Email</Label>
                  <p className="font-medium">{selectedUser.email}</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Phone number</Label>
                  <p className="font-medium">{selectedUser.mobile}</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Branch</Label>
                  <p className="font-medium">{selectedUser.branches.map(branch => branch.name).join(", ")}</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Position</Label>
                  <p className="font-medium">{selectedUser.position}</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={handleReset}
                disabled={!hasChanges || updatePermissionsMutation.isPending}
              >
                Reset
              </Button>
              <Button onClick={() => setSearchQuery("")} variant="outline" className="flex-1">
                Search
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Content - Permissions Table */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1">
          <DataTableV2
            totalCount={permissions.length}
            perPage={permissions.length}
            pageNumber={1}
            onPaginationChange={() => {}}
            onRowCountChange={() => {}}
            title="Module Permissions"
            subtitle={
              selectedUser
                ? `Managing permissions for ${selectedUser.full_name}`
                : "Select a user to manage permissions"
            }
            data={permissions}
            columns={columns}
            filters={[]}
            search={{ title: "Search", placeholder: "Search module...", enableSearch: true }}
            actionButtons={[]}
            onLoading={isLoading}
            idField="module_id"
            enableNew={false}
            enablePdfExport={false}
            enableCsvExport={false}
            enableFilter={false}
            onResetTable={false}
            onSearchChange={() => {}}
          />
        </div>

        {/* Bottom Action Buttons */}
        <div className="flex justify-end gap-2 p-4 border-t bg-background">
          <Button variant="outline" onClick={handleReset} disabled={!hasChanges || updatePermissionsMutation.isPending}>
            Reset
          </Button>
          <Button
            onClick={handleSaveChanges}
            disabled={!hasChanges || !selectedUser || updatePermissionsMutation.isPending}
          >
            {updatePermissionsMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  )
}