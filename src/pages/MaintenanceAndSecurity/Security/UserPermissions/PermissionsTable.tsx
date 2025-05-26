"use client"

import { useState, useEffect } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronDownIcon, ChevronsUpDownIcon, ChevronUpIcon, SearchIcon } from "lucide-react"
import type { ModulePermission, UserForSelection, UserPermissionResponse, Module } from "./Service/PermissionsTypes"
import PermissionsService from "./Service/PermissionsService"
import { toast } from "sonner"
import Select from "react-select";

export function PermissionsTable() {
  const [selectedUser, setSelectedUser] = useState<UserForSelection | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [moduleSearchQuery, setModuleSearchQuery] = useState("")
  const [permissions, setPermissions] = useState<ModulePermission[]>([])
  const [originalPermissions, setOriginalPermissions] = useState<ModulePermission[]>([])
  const [hasChanges, setHasChanges] = useState(false)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null)

  // Fetch all modules
  const { data: modulesData, isLoading: isLoadingModules } = useQuery({
    queryKey: ["modules"],
    queryFn: () => PermissionsService.getModules(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })

  // Fetch users for selection
  const { data: usersData, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["users-for-selection", searchQuery],
    queryFn: () => PermissionsService.getUsersForSelection(1, 100, searchQuery), // Increased limit to get more users
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

  // Handle user selection
  const handleUserSelect = (userId: string) => {
    const user = usersData?.data.users.find((u) => u.id === userId)

    if (user) {
      setSelectedUser(user)
      setPermissions([])
      setOriginalPermissions([])
      setHasChanges(false)
      // console.log("User set successfully:", user)
    } else {
      console.error("User not found for ID:", userId)
    }
  }

  // Create permissions matrix when modules and user permissions are loaded
  useEffect(() => {

    if (modulesData?.data.module && selectedUser) {
      const modules: Module[] = modulesData.data.module
      const userPerms: UserPermissionResponse[] = userPermissions?.data || []

      // Create permission objects for each module using the new structure
      const permissionsMatrix: ModulePermission[] = modules.map((module) => {
        // Find existing permission by matching module.id with module_id
        const existingPermission = userPerms.find((perm) => perm.module.id === module.id)

        const newPermission = {
          user_id: selectedUser.id,
          module: {
            id: module.id,
            name: module.name,
          },
          can_access: existingPermission?.can_access || false,
          can_add: existingPermission?.can_add || false,
          can_edit: existingPermission?.can_edit || false,
          can_delete: existingPermission?.can_delete || false,
          can_export: existingPermission?.can_export || false,
          can_print: existingPermission?.can_print || false,
          can_void: existingPermission?.can_void || false,
        }

        return newPermission
      })

      setPermissions(permissionsMatrix)
      setOriginalPermissions(JSON.parse(JSON.stringify(permissionsMatrix)))
      setHasChanges(false)
    } else if (!selectedUser) {
      // Show modules without permissions when no user is selected
      if (modulesData?.data.module) {
        const emptyPermissions: ModulePermission[] = modulesData.data.module.map((module) => ({
          user_id: "",
          module: {
            id: module.id,
            name: module.name,
          },
          can_access: false,
          can_add: false,
          can_edit: false,
          can_delete: false,
          can_export: false,
          can_print: false,
          can_void: false,
        }))
        setPermissions(emptyPermissions)
        setOriginalPermissions([])
        setHasChanges(false)
      }
    } else {
    }
  }, [modulesData, userPermissions, selectedUser])

  // Check for changes
  useEffect(() => {
    if (selectedUser && originalPermissions.length > 0) {
      const hasChanges = JSON.stringify(permissions) !== JSON.stringify(originalPermissions)
      setHasChanges(hasChanges)
    }
  }, [permissions, originalPermissions, selectedUser])

  // Handle permission change
  const handlePermissionChange = (moduleId: string, permissionType: string, checked: boolean) => {
    if (!selectedUser) return

    setPermissions((prev) =>
      prev.map((perm) =>
        perm.module.id === moduleId
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
                can_void: false,
              }
              : {}),
            // If checking can_export, also check can_print
            ...(permissionType === "can_export" && checked ? { can_print: true } : {}),
            // If unchecking can_print, also uncheck can_export
            ...(permissionType === "can_print" && !checked ? { can_export: false } : {}),
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
        perm.module.id === moduleId
          ? {
            ...perm,
            can_access: checked,
            can_add: checked,
            can_edit: checked,
            can_delete: checked,
            can_export: checked,
            can_print: checked,
            can_void: checked,
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
      permission.can_print &&
      permission.can_void
    )
  }

  // Handle save changes
  const handleSaveChanges = () => {
    if (!selectedUser) return

    const payload = {
      permissions: permissions.map((perm) => ({
        user_id: selectedUser.id,
        module_id: perm.module.id,
        can_access: perm.can_access,
        can_add: perm.can_add,
        can_edit: perm.can_edit,
        can_delete: perm.can_delete,
        can_export: perm.can_export,
        can_print: perm.can_print,
        can_void: perm.can_void,
      })),
    }

    updatePermissionsMutation.mutate(payload)
  }

  // Handle reset
  const handleReset = () => {
    if (originalPermissions.length > 0) {
      setPermissions(JSON.parse(JSON.stringify(originalPermissions)))
      setHasChanges(false)
      setSearchQuery("")
    }
  }

  const sortedPermissions = [...permissions].filter((permission) =>
    permission.module.name.toLowerCase().includes(moduleSearchQuery.toLowerCase()),
  )

  if (sortOrder) {
    sortedPermissions.sort((a, b) => {
      const nameA = a.module.name.toLowerCase()
      const nameB = b.module.name.toLowerCase()
      return sortOrder === "asc" ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA)
    })
  }

  const handleSortToggle = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : prev === "desc" ? null : "asc"))
  }
  return (
    <div className="space-y-4">
      <div className="flex gap-6 h-[calc(100vh-8rem)]">
        {/* Left Sidebar - User Selection */}
        <div className="w-80 flex-shrink-0">
          <Card className="h-full">
            <CardContent className="space-y-4">
              {/* User Search */}
              <div className="space-y-2">
                <Label htmlFor="user-select">
                  Search User <span className="text-red-500">*</span>
                </Label>
                <Select
                  options={
                    usersData?.data.users.map((user) => ({
                      value: user.id,
                      label: `${user.full_name} (${user.username})`,
                    })) || []
                  }
                  value={
                    selectedUser
                      ? {
                        value: selectedUser.id,
                        label: `${selectedUser.full_name} (${selectedUser.username})`,
                      }
                      : null
                  }
                  onChange={(option) => {
                    if (option) {
                      handleUserSelect(option.value)
                    } else {
                      setSelectedUser(null)
                      setPermissions([])
                      setOriginalPermissions([])
                      setHasChanges(false)
                    }
                  }}
                  placeholder="Search and select user..."
                  isSearchable={true}
                  isClearable={true}
                  isLoading={isLoadingUsers}
                  isDisabled={isLoadingUsers}
                  styles={{
                    control: (provided, state) => ({
                      ...provided,
                      border: "1px solid #cbd5e0",
                      borderRadius: "8px",
                      padding: "2px",
                      fontSize: "14px",
                      minHeight: "40px",
                      boxShadow: state.isFocused ? "0 0 0 1px #3b82f6" : "none",
                      "&:hover": {
                        borderColor: "#9ca3af",
                      },
                    }),
                    placeholder: (provided) => ({
                      ...provided,
                      color: "#6b7280",
                      fontSize: "14px",
                    }),
                    singleValue: (provided) => ({
                      ...provided,
                      fontSize: "14px",
                    }),
                    input: (provided) => ({
                      ...provided,
                      fontSize: "14px",
                    }),
                    option: (provided, state) => ({
                      ...provided,
                      fontSize: "14px",
                      padding: "8px 12px",
                      backgroundColor: state.isSelected ? "#3b82f6" : state.isFocused ? "#f3f4f6" : "white",
                      color: state.isSelected ? "white" : "#374151",
                      "&:hover": {
                        backgroundColor: state.isSelected ? "#3b82f6" : "#f3f4f6",
                      },
                    }),
                    menu: (provided) => ({
                      ...provided,
                      border: "1px solid #cbd5e0",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      zIndex: 9999,
                    }),
                    menuList: (provided) => ({
                      ...provided,
                      maxHeight: "200px",
                    }),
                  }}
                  noOptionsMessage={() => "No users found"}
                />
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
                    <Label className="text-sm text-muted-foreground">Address</Label>
                    <p className="font-medium">123 Main St, Anytown, USA</p>
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
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Content - Permissions Table */}
        <div className="flex-1 flex flex-col">
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Module Permissions</CardTitle>
              <div className="space-y-2 mt-4">
                <Label className="text-sm">Search</Label>
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search module..."
                    value={moduleSearchQuery}
                    onChange={(e) => setModuleSearchQuery(e.target.value)}
                    className="pl-10 w-[300px]"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="overflow-auto">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px] cursor-pointer select-none" onClick={handleSortToggle}>
                        <div className="flex items-center gap-2">
                          Module
                          {sortOrder === "asc" ? (
                            <ChevronUpIcon className="w-4 h-4" />
                          ) : sortOrder === "desc" ? (
                            <ChevronDownIcon className="w-4 h-4" />
                          ) : (
                            <ChevronsUpDownIcon className="w-4 h-4" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="w-[80px] text-center">All</TableHead>
                      <TableHead className="w-[80px] text-center">Add</TableHead>
                      <TableHead className="w-[80px] text-center">Edit</TableHead>
                      <TableHead className="w-[80px] text-center">Delete</TableHead>
                      <TableHead className="w-[80px] text-center">Read</TableHead>
                      <TableHead className="w-[120px] text-center">Generate PDF/CSV</TableHead>
                      <TableHead className="w-[100px] text-center">Cancel/Void</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingModules || isLoadingPermissions ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-4">
                          Loading Data...
                        </TableCell>
                      </TableRow>
                    ) : !selectedUser ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-4">
                          Select a user to manage their permissions
                        </TableCell>
                      </TableRow>
                    ) : sortedPermissions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-4">
                          No modules found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      sortedPermissions.map((permission) => (
                        <TableRow key={permission.module.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{permission.module.name}</div>
                              <div className="text-sm text-muted-foreground">
                                Module permissions for {selectedUser.full_name}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Checkbox
                              checked={isAllPermissionsEnabled(permission)}
                              onCheckedChange={(checked) =>
                                handleAllPermissions(permission.module.id, checked as boolean)
                              }
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            <Checkbox
                              checked={permission.can_add}
                              onCheckedChange={(checked) =>
                                handlePermissionChange(permission.module.id, "can_add", checked as boolean)
                              }
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            <Checkbox
                              checked={permission.can_edit}
                              onCheckedChange={(checked) =>
                                handlePermissionChange(permission.module.id, "can_edit", checked as boolean)
                              }
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            <Checkbox
                              checked={permission.can_delete}
                              onCheckedChange={(checked) =>
                                handlePermissionChange(permission.module.id, "can_delete", checked as boolean)
                              }
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            <Checkbox
                              checked={permission.can_access}
                              onCheckedChange={(checked) =>
                                handlePermissionChange(permission.module.id, "can_access", checked as boolean)
                              }
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            <Checkbox
                              checked={permission.can_export}
                              onCheckedChange={(checked) =>
                                handlePermissionChange(permission.module.id, "can_export", checked as boolean)
                              }
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            <Checkbox
                              checked={permission.can_void}
                              onCheckedChange={(checked) =>
                                handlePermissionChange(permission.module.id, "can_void", checked as boolean)
                              }
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>

                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Bottom Action Buttons */}
          <div className="flex justify-end gap-2 p-4 border-t bg-background">
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={!hasChanges || updatePermissionsMutation.isPending}
            >
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
    </div>
  )
}