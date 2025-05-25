"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useEffect, useMemo, useState } from "react"
import { Clock, Info, TrashIcon, X } from "lucide-react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import Multiselect from "multiselect-react-dropdown"
import type { UserManagement, UserDevice } from "./Service/UserManagementTypes"
import UserManagementService from "./Service/UserManagementService"
import { toast } from "sonner"
import { DataTableV2 } from "@/components/data-table/data-table-v2"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"
import type { ColumnDefinition } from "@/components/data-table/data-table"

// Define the form schema with Zod
const formSchema = (isEditing: boolean) =>
  z
    .object({
      code: z.string().min(1, "User ID is required"),
      username: z.string().min(3, "Username must be at least 3 characters."),
      full_name: z.string().min(3, "Name must be at least 3 characters."),
      position: z.string().min(1, "Position is required"),
      branches: z.array(z.object({ id: z.string(), name: z.string() })).min(1, "At least one branch is required"),
      email: z.string().email("Invalid email address"),
      mobile: z.string().min(11, "Mobile number is required"),
      password: isEditing ? z.string().optional() : z.string().min(8, "Password must be at least 8 characters"),
      password_confirmation: z.string().optional(),
      status: z.boolean(),
      inactive_period: z.string().optional(),
      special_approver: z.boolean(),
      loan_approver: z.boolean(),
      disbursement_approver: z.boolean(),
      branch_opener: z.boolean(),
      new_client_approver: z.boolean(),
      access_schedules: z.array(
        z.object({
          day_of_week: z.number(),
          start_time: z.string().optional(),
          end_time: z.string().optional(),
        }),
      ),
    })
    .refine(
      (data) => {
        // For new users, password is required
        if (!isEditing) {
          if (!data.password || data.password.length < 8) {
            return false
          }
          if (!data.password_confirmation) {
            return false
          }
        }

        // If password is provided (for both new and edit), confirmation must match
        if (data.password && data.password_confirmation) {
          return data.password === data.password_confirmation
        }

        // If editing and no password provided, that's fine
        if (isEditing && !data.password && !data.password_confirmation) {
          return true
        }

        return true
      },
      {
        message: !isEditing ? "Password is required and must be at least 8 characters" : "Passwords don't match",
        path: ["password"],
      },
    )
    .refine(
      (data) => {
        // For new users, password confirmation is required
        if (!isEditing && !data.password_confirmation) {
          return false
        }

        return true
      },
      {
        message: "Password confirmation is required",
        path: ["password_confirmation"],
      },
    )

export type FormValues = z.infer<ReturnType<typeof formSchema>>

interface UserDialogProps {
  item: UserManagement | null
  open: boolean
  isEditing: boolean
  focusPassword?: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function UserDialog({ item, open, isEditing, focusPassword = false, onOpenChange, onSuccess }: UserDialogProps) {
  const [activeTab, setActiveTab] = useState("basic-info")
  const [branchesData, setBranchesData] = useState<{ id: string; name: string }[]>([])
  const [devicesData, setDevicesData] = useState<UserDevice[]>([])
  const [selectedDevice, setSelectedDevice] = useState<UserDevice | null>(null)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const queryClient = useQueryClient()

  // Fetch user code mutation
  const { mutate: fetchUserCode, data: generatedCode } = useMutation({
    mutationFn: UserManagementService.generateUserCode,
    onError: (error) => {
      toast.error("Failed to generate user code")
      console.error(error)
    },
  })

  // Fetch branches mutation
  const { mutate: fetchBranches } = useMutation({
    mutationFn: UserManagementService.getBranches,
    onSuccess: (data) => {
      const newBranchCollection =
        data.data.branches?.map((branch: { id: string; name: string }) => ({
          id: branch.id,
          name: branch.name,
        })) || []
      setBranchesData(newBranchCollection)
    },
    onError: (error) => {
      toast.error("Failed to fetch branches")
      console.error(error)
    },
  })

  // Fetch user devices mutation
  const { mutate: fetchUserDevices, isPending: isLoadingDevices } = useMutation({
    mutationFn: (userId: string) => UserManagementService.getUserDevices(userId),
    onSuccess: (data) => {
      setDevicesData(data.data.devices || [])
    },
    onError: (error) => {
      toast.error("Failed to fetch user devices")
      console.error(error)
    },
  })

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: UserManagementService.createUser,
    onSuccess: () => {
      toast.success("User created successfully")
      queryClient.invalidateQueries({ queryKey: ["user-management-table"] })
      onSuccess?.()
      onOpenChange(false)
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create user")
    },
  })

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => UserManagementService.updateUser(id, payload),
    onSuccess: () => {
      toast.success("User updated successfully")
      queryClient.invalidateQueries({ queryKey: ["user-management-table"] })
      onSuccess?.()
      onOpenChange(false)
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update user")
    },
  })

  // Delete device mutation
  const deleteDeviceMutation = useMutation({
    mutationFn: UserManagementService.deleteUserDevice,
    onSuccess: () => {
      toast.success("Device removed successfully")
      setOpenDeleteModal(false)
      setSelectedDevice(null)
      if (item?.id) {
        fetchUserDevices(item.id)
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to remove device")
    },
  })

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema(isEditing)),
    defaultValues: {
      code: "",
      username: "",
      full_name: "",
      position: "",
      branches: [],
      email: "",
      mobile: "",
      password: "",
      password_confirmation: "",
      status: true,
      inactive_period: "",
      special_approver: false,
      loan_approver: false,
      disbursement_approver: false,
      branch_opener: false,
      new_client_approver: false,
      access_schedules: [],
    },
  })

  // Effect to handle dialog opening and data fetching
  useEffect(() => {
    if (open) {
      fetchBranches()

      if (isEditing && item) {
        // Populate form with existing data
        const branchObjects =
          item.branches?.map((branch) => ({
            id: typeof branch === "object" ? branch.id : branch,
            name: typeof branch === "object" ? branch.name : branch,
          })) || []

        form.reset({
          code: item.code || "",
          username: item.username || "",
          full_name: item.full_name || "",
          position: item.position || "",
          branches: branchObjects,
          email: item.email || "",
          mobile: item.mobile || "",
          password: "",
          password_confirmation: "",
          status: item.status ?? true,
          inactive_period: item.inactive_period || "",
          special_approver: item.special_approver ?? false,
          loan_approver: item.loan_approver ?? false,
          disbursement_approver: item.disbursement_approver ?? false,
          branch_opener: item.branch_opener ?? false,
          new_client_approver: item.new_client_approver ?? false,
          access_schedules: item.access_schedules || [
            { day_of_week: 1, start_time: "08:00:00", end_time: "17:00:00" },
            { day_of_week: 2, start_time: "08:00:00", end_time: "17:00:00" },
            { day_of_week: 3, start_time: "08:00:00", end_time: "17:00:00" },
            { day_of_week: 4, start_time: "08:00:00", end_time: "17:00:00" },
            { day_of_week: 5, start_time: "08:00:00", end_time: "17:00:00" },
            { day_of_week: 6, start_time: undefined, end_time: undefined },
            { day_of_week: 0, start_time: undefined, end_time: undefined },
          ],
        })

        // Fetch user devices for editing mode
        fetchUserDevices(item.id)
      } else {
        // Generate new user code for new users
        fetchUserCode()
        form.reset({
          code: "",
          username: "",
          full_name: "",
          position: "",
          branches: [],
          email: "",
          mobile: "",
          password: "",
          password_confirmation: "",
          status: true,
          inactive_period: "",
          special_approver: false,
          loan_approver: false,
          disbursement_approver: false,
          branch_opener: false,
          new_client_approver: false,
          access_schedules: [
            { day_of_week: 1, start_time: "08:00:00", end_time: "17:00:00" },
            { day_of_week: 2, start_time: "08:00:00", end_time: "17:00:00" },
            { day_of_week: 3, start_time: "08:00:00", end_time: "17:00:00" },
            { day_of_week: 4, start_time: "08:00:00", end_time: "17:00:00" },
            { day_of_week: 5, start_time: "08:00:00", end_time: "17:00:00" },
            { day_of_week: 6, start_time: undefined, end_time: undefined },
            { day_of_week: 0, start_time: undefined, end_time: undefined },
          ],
        })
      }
    }
  }, [open, isEditing, item])

  // Effect to update code field when generated code is available
  useEffect(() => {
    if (generatedCode && !isEditing) {
      form.setValue("code", generatedCode)
    }
  }, [generatedCode, isEditing, form])

  // Effect to focus on password field when in password change mode
  useEffect(() => {
    if (open && focusPassword) {
      setTimeout(() => {
        const passwordField = document.querySelector('input[name="password"]') as HTMLInputElement
        if (passwordField) {
          passwordField.focus()
          passwordField.scrollIntoView({ behavior: "smooth", block: "center" })
        }
      }, 300)
    }
  }, [open, focusPassword])

  const branches = useMemo(() => {
    return branchesData ?? []
  }, [branchesData])

  // Handle form submission
  const handleSubmit = (values: FormValues) => {
    const payload = {
      code: values.code,
      username: values.username,
      full_name: values.full_name,
      email: values.email,
      mobile: values.mobile,
      position: values.position,
      status: values.status ? true : false,
      special_approver: values.special_approver ? true : false,
      loan_approver: values.loan_approver ? true : false,
      disbursement_approver: values.disbursement_approver ? true : false,
      branch_opener: values.branch_opener ? true : false,
      new_client_approver: values.new_client_approver ? true : false,
      password: values.password ?? "",
      password_confirmation: values.password_confirmation ?? "",
      branches: values.branches.map((branch) => branch.id),
      access_schedules: values.access_schedules
        .filter((schedule) => schedule.start_time && schedule.end_time)
        .map((schedule) => ({
          day_of_week: schedule.day_of_week,
          start_time: schedule.start_time!,
          end_time: schedule.end_time!,
        })),
    }

    if (isEditing && item) {
      updateUserMutation.mutate({ id: item.id, payload })
    } else {
      createUserMutation.mutate(payload)
    }
  }

  // Generate time options in 30-minute intervals
  const generateTimeOptions = () => {
    const times = []
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}:00`
        const displayTime = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
        times.push({ value: timeString, label: displayTime })
      }
    }
    return times
  }

  const timeOptions = generateTimeOptions()

  const daysOfWeek = [
    { key: "monday", label: "Monday", dayOfWeek: 1 },
    { key: "tuesday", label: "Tuesday", dayOfWeek: 2 },
    { key: "wednesday", label: "Wednesday", dayOfWeek: 3 },
    { key: "thursday", label: "Thursday", dayOfWeek: 4 },
    { key: "friday", label: "Friday", dayOfWeek: 5 },
    { key: "saturday", label: "Saturday", dayOfWeek: 6 },
    { key: "sunday", label: "Sunday", dayOfWeek: 0 },
  ] as const

  const toggleSchedule = (dayOfWeek: number, enabled: boolean) => {
    const schedules = form.getValues("access_schedules")
    const scheduleIndex = schedules.findIndex((s) => s.day_of_week === dayOfWeek)

    if (scheduleIndex !== -1) {
      if (enabled) {
        if (!schedules[scheduleIndex].start_time && !schedules[scheduleIndex].end_time) {
          form.setValue(`access_schedules.${scheduleIndex}.start_time`, "08:00:00")
          form.setValue(`access_schedules.${scheduleIndex}.end_time`, "17:00:00")
        }
      } else {
        form.setValue(`access_schedules.${scheduleIndex}.start_time`, undefined)
        form.setValue(`access_schedules.${scheduleIndex}.end_time`, undefined)
      }
    }
  }

  const renderDayRow = (day: (typeof daysOfWeek)[number]) => {
    const schedules = form.watch("access_schedules")
    const schedule = schedules.find((s) => s.day_of_week === day.dayOfWeek)
    const scheduleIndex = schedules.findIndex((s) => s.day_of_week === day.dayOfWeek)
    const isEnabled = schedule ? schedule.start_time !== undefined || schedule.end_time !== undefined : false
    const hasTimeSet = isEnabled && schedule?.start_time && schedule?.end_time

    return (
      <div key={day.key} className="flex items-center gap-4 p-4 border-b border-gray-100 last:border-b-0">
        <div className="flex items-center gap-3 min-w-[140px]">
          <Switch
            checked={isEnabled}
            onCheckedChange={(checked) => toggleSchedule(day.dayOfWeek, checked)}
            className="custom-switch"
          />
          <span className="font-medium text-gray-900">{day.label}</span>
        </div>

        <div className="flex items-center gap-4 flex-1">
          {isEnabled && scheduleIndex !== -1 ? (
            <>
              <FormField
                control={form.control}
                name={`access_schedules.${scheduleIndex}.start_time`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Select value={field.value || ""} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <SelectValue placeholder="Select..." />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          {timeOptions.map((time) => (
                            <SelectItem key={time.value} value={time.value}>
                              {time.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />

              <span className="text-gray-500 font-medium">to</span>

              <FormField
                control={form.control}
                name={`access_schedules.${scheduleIndex}.end_time`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Select value={field.value || ""} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <SelectValue placeholder="Select..." />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          {timeOptions.map((time) => (
                            <SelectItem key={time.value} value={time.value}>
                              {time.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
            </>
          ) : (
            <span className="text-gray-500 text-sm">No access on this day</span>
          )}
        </div>

        {isEnabled && !hasTimeSet && <span className="text-red-500 text-sm">No time start and end added</span>}
      </div>
    )
  }

  // Handle device delete
  const handleDeviceDelete = async () => {
    if (selectedDevice) {
      deleteDeviceMutation.mutate(selectedDevice.id)
    }
  }

  // Define device columns for DataTableV2
  const deviceColumns: ColumnDefinition<UserDevice>[] = [
    {
      id: "name",
      header: "Device",
      accessorKey: "name",
      enableSorting: true,
      cell: (row) => row.name || "Unknown Device",
    },
    {
      id: "last_login",
      header: "Last Login",
      accessorKey: "last_login",
      enableSorting: true,
      cell: (row) => row.last_login || "Never",
    },
    {
      id: "ip_address",
      header: "IP Address",
      accessorKey: "ip_address",
      enableSorting: true,
      cell: (row) => row.ip_address || "Unknown",
    },
    {
      id: "browser",
      header: "Browser",
      accessorKey: "browser",
      enableSorting: true,
      cell: (row) => row.browser || "Unknown",
    },
  ]

  // Define device action buttons
  const deviceActionButtons = [
    {
      label: "Delete",
      icon: <TrashIcon className="h-4 w-4 text-destructive" />,
      onClick: (device: UserDevice) => {
        setSelectedDevice(device)
        setOpenDeleteModal(true)
      },
    },
  ]

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[768px] h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{isEditing ? "Edit User" : "Add New User"}</DialogTitle>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full overflow-y-auto">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic-info">Basic Information</TabsTrigger>
              <TabsTrigger value="devices" disabled={!isEditing}>
                Devices
              </TabsTrigger>
            </TabsList>

            <div className="overflow-y-auto">
              <TabsContent value="basic-info" className="space-y-6 pt-4">
                <h3 className="text-lg font-semibold">User Basic Information</h3>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-2 overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm">
                              User ID <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input {...field} disabled className="focus-visible:outline-none bg-gray-50" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm">
                              User Name<span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="Enter Username" {...field} className="focus-visible:outline-none" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="full_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm">
                            Name <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Enter name" {...field} className="focus-visible:outline-none" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="position"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm">
                              Position <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select..." />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Internal Cashier">Internal Cashier</SelectItem>
                                  <SelectItem value="Disbursing Officer">Disbursing Officer</SelectItem>
                                  <SelectItem value="Head Cashier">Head Cashier</SelectItem>
                                  <SelectItem value="Accounting Clerk">Accounting Clerk</SelectItem>
                                  <SelectItem value="Loan Officer">Loan Officer</SelectItem>
                                  <SelectItem value="Assistant Branch Manager">Assistant Branch Manager</SelectItem>
                                  <SelectItem value="Branch Manager Executive">Branch Manager Executive</SelectItem>
                                  <SelectItem value="Loans Executive">Loans Executive</SelectItem>
                                  <SelectItem value="Auditor">Auditor</SelectItem>
                                  <SelectItem value="Audit Manager">Audit Manager</SelectItem>
                                  <SelectItem value="Super Admin">Super Admin</SelectItem>
                                  <SelectItem value="HR Manager">HR Manager</SelectItem>
                                  <SelectItem value="Finance">Finance</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="branches"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm">
                              Branch <span className="text-red-500">*</span>
                            </FormLabel>
                            <Multiselect
                              options={branches}
                              selectedValues={field.value}
                              onSelect={field.onChange}
                              onRemove={field.onChange}
                              displayValue="name"
                              showCheckbox
                              placeholder="Select Branch"
                              customCloseIcon={<X className="ml-1 w-4 h-4 cursor-pointer" />}
                              style={{
                                chips: {
                                  background: "var(--secondary)",
                                  color: "var(--foreground)",
                                  fontSize: "14px",
                                  margin: "0px",
                                  borderRadius: "5px",
                                },
                                searchBox: {
                                  display: "flex",
                                  gap: "5px",
                                  border: "1px solid #cbd5e0",
                                  borderRadius: "8px",
                                  padding: "6px 12px",
                                  fontSize: "14px",
                                  flexWrap: "wrap",
                                },
                                inputField: {
                                  margin: "0px",
                                },
                              }}
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm">
                              Email <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Add email address"
                                {...field}
                                className="focus-visible:outline-none"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="mobile"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm">
                              Mobile Number <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Add mobile number"
                                {...field}
                                className="focus-visible:outline-none"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-4 pt-2">
                      <h3 className="text-lg font-semibold">
                        {isEditing ? "Change Password (Optional)" : "Create Password"}
                      </h3>

                      {isEditing && (
                        <div className="rounded-md bg-blue-50 p-3 text-sm">
                          <div className="flex items-start gap-2">
                            <Info className="mt-0.5 h-4 w-4 text-blue-500" />
                            <div>
                              <p className="font-medium text-blue-600">Password Update</p>
                              <p>Leave password fields empty to keep the current password unchanged.</p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm">
                                Password {!isEditing && <span className="text-red-500">*</span>}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter Password"
                                  type="password"
                                  {...field}
                                  className="focus-visible:outline-none"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="password_confirmation"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm">
                                Confirm Password {!isEditing && <span className="text-red-500">*</span>}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Confirm Password"
                                  type="password"
                                  {...field}
                                  className="focus-visible:outline-none"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="grid gap-2 pt-2">
                      <div className="rounded-md border p-3 space-y-4">
                        <FormField
                          control={form.control}
                          name="status"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between w-full">
                              <div className="space-y-0.5">
                                <FormLabel className="text-sm">
                                  Status (Active) <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormDescription>
                                  This user is currently {field.value ? "active" : "inactive"}.
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  className="custom-switch"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="inactive_period"
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormLabel className="text-sm">Inactive Period (Optional)</FormLabel>
                              <FormControl className="w-full">
                                <Input
                                  placeholder="mm / dd / yyyy - mm / dd / yyyy"
                                  {...field}
                                  className="focus-visible:outline-none"
                                />
                              </FormControl>
                              <FormDescription>
                                Set a date range to automatically mark the user as inactive. Useful for temporary
                                suspensions or leaves of absence.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Approver Permissions */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Permissions</h3>

                      <div className="space-y-4">
                        <div className="rounded-md border p-3">
                          <FormField
                            control={form.control}
                            name="special_approver"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between w-full">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-sm">
                                    Transaction Approver <span className="text-red-500">*</span>
                                  </FormLabel>
                                  <FormDescription>
                                    This user is capable of approving special transactions.
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    className="custom-switch"
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="rounded-md border p-3">
                          <FormField
                            control={form.control}
                            name="loan_approver"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between w-full">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-sm">
                                    Loan Approver <span className="text-red-500">*</span>
                                  </FormLabel>
                                  <FormDescription>This user is capable of approving special loans.</FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    className="custom-switch"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="rounded-md border p-3">
                          <FormField
                            control={form.control}
                            name="disbursement_approver"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between w-full">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-sm">
                                    Disbursements Approver <span className="text-red-500">*</span>
                                  </FormLabel>
                                  <FormDescription>
                                    This user is capable of approving special disbursements.
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    className="custom-switch"
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="rounded-md border p-3">
                          <FormField
                            control={form.control}
                            name="branch_opener"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between w-full">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-sm">
                                    Branch Opener <span className="text-red-500">*</span>
                                  </FormLabel>
                                  <FormDescription>This user is capable of approving branch opener.</FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    className="custom-switch"
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="rounded-md border p-3">
                          <FormField
                            control={form.control}
                            name="new_client_approver"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between w-full">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-sm">
                                    New Client Approver <span className="text-red-500">*</span>
                                  </FormLabel>
                                  <FormDescription>This user is capable of approving the new clients.</FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    className="custom-switch"
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 mt-4">
                      <h3 className="text-lg font-semibold">Access Schedule</h3>
                      <div className="space-y-0 border mt-4 rounded-md">{daysOfWeek.map(renderDayRow)}</div>
                    </div>

                    <DialogFooter className="pt-4">
                      <Button variant="outline" onClick={() => onOpenChange(false)} type="button">
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600"
                        disabled={createUserMutation.isPending || updateUserMutation.isPending}
                      >
                        {createUserMutation.isPending || updateUserMutation.isPending
                          ? "Saving..."
                          : isEditing
                            ? "Update User"
                            : "Create User"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="devices" className="space-y-6 pt-4">
                <DataTableV2
                  totalCount={devicesData.length}
                  perPage={devicesData.length}
                  pageNumber={1}
                  onPaginationChange={() => {}}
                  onRowCountChange={() => {}}
                  title="Devices"
                  subtitle=""
                  data={devicesData}
                  columns={deviceColumns}
                  filters={[]}
                  search={{ title: "Search", placeholder: "Search devices", enableSearch: false }}
                  actionButtons={deviceActionButtons}
                  onLoading={isLoadingDevices || deleteDeviceMutation.isPending}
                  idField="id"
                  enableNew={false}
                  enablePdfExport={false}
                  enableCsvExport={false}
                  enableFilter={false}
                  onResetTable={false}
                  onSearchChange={() => {}}
                />
              </TabsContent>
            </div>
          </Tabs>
        </DialogContent>
      </Dialog>

      <DeleteConfirmationDialog
        isOpen={openDeleteModal}
        onClose={() => {
          setSelectedDevice(null)
          setOpenDeleteModal(false)
        }}
        onConfirm={handleDeviceDelete}
        title="Delete Device"
        description={`Are you sure you want to remove the device '${selectedDevice?.name}'? This action cannot be undone.`}
        itemName={selectedDevice?.name ?? "No Device Selected"}
        // isLoading={deleteDeviceMutation.isPending}
      />
    </>
  )
}