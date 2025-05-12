"use client"

import { useState } from "react"
import { Calendar, Clock, Info, X, ArrowUpDown, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface AddUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface Device {
  device: string
  lastLogin: string
  ipAddress: string
  browser: string
}

export function AddUserDialog({ open, onOpenChange }: AddUserDialogProps) {
  const [activeTab, setActiveTab] = useState("basic-info")
  const [isActive, setIsActive] = useState(true)
  const [transactionApprover, setTransactionApprover] = useState(true)
  const [loanApprover, setLoanApprover] = useState(false)
  const [disbursementsApprover, setDisbursementsApprover] = useState(true)
  const [branchOpener, setBranchOpener] = useState(true)
  const [selectedBranch, setSelectedBranch] = useState("Branch 1")

  // Access schedule
  const [daysEnabled, setDaysEnabled] = useState({
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: true,
    sunday: false,
  })

  // Sample devices data
  const devices: Device[] = [
    {
      device: "Windows PC",
      lastLogin: "2023-05-01 14:30",
      ipAddress: "192.168.1.1",
      browser: "Chrome 112",
    },
    {
      device: "Windows PC",
      lastLogin: "2023-05-01 14:30",
      ipAddress: "192.168.1.1",
      browser: "Chrome 112",
    },
    {
      device: "Windows PC",
      lastLogin: "2023-05-01 14:30",
      ipAddress: "192.168.1.1",
      browser: "Chrome 112",
    },
    {
      device: "Windows PC",
      lastLogin: "2023-05-01 14:30",
      ipAddress: "192.168.1.1",
      browser: "Chrome 112",
    },
  ]

  const toggleDay = (day: keyof typeof daysEnabled) => {
    setDaysEnabled((prev) => ({
      ...prev,
      [day]: !prev[day],
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add New User</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic-info">Basic Information</TabsTrigger>
            <TabsTrigger value="devices">Devices</TabsTrigger>
          </TabsList>

          <TabsContent value="basic-info" className="space-y-6 pt-4">
            <h3 className="text-lg font-semibold">User Basic Information</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="userId" className="flex items-center gap-1">
                  User ID <span className="text-red-500">*</span>
                </Label>
                <Input id="userId" defaultValue="9850475-" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="username" className="flex items-center gap-1">
                  User Name <span className="text-red-500">*</span>
                </Label>
                <Input id="username" placeholder="Enter Username" />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="name" className="flex items-center gap-1">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input id="name" placeholder="Enter name" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="position" className="flex items-center gap-1">
                  Position <span className="text-red-500">*</span>
                </Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="loan-officer">Loan Officer</SelectItem>
                    <SelectItem value="branch-manager">Branch Manager</SelectItem>
                    <SelectItem value="teller">Teller</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="branch" className="flex items-center gap-1">
                  Branch <span className="text-red-500">*</span>
                </Label>
                <div className="flex items-center gap-2 rounded-md border p-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {selectedBranch}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedBranch("")} />
                  </Badge>
                  <Input placeholder="Select branch" className="flex-1 border-0 p-0 shadow-none focus-visible:ring-0" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email" className="flex items-center gap-1">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input id="email" placeholder="Add email adress" type="email" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="mobile" className="flex items-center gap-1">
                  Mobile Number <span className="text-red-500">*</span>
                </Label>
                <Input id="mobile" placeholder="Add mobile number" />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Change Password</h3>

              <div className="rounded-md bg-blue-50 p-3 text-sm">
                <div className="flex items-start gap-2">
                  <Info className="mt-0.5 h-4 w-4 text-blue-500" />
                  <div>
                    <p className="font-medium text-blue-600">Last Password Reset</p>
                    <p>
                      This user last changed their password on{" "}
                      <span className="text-blue-600">April 5, 2025 at 2:34 PM</span>.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" value="••••••••••••••" />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input id="confirmPassword" type="password" value="••••••••••••••" />
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status" className="flex items-center gap-1">
                Status (Active) <span className="text-red-500">*</span>
              </Label>
              <div className="flex items-center justify-between rounded-md border p-3">
                <p className="text-sm">This user is currently active.</p>
                <Switch id="status" checked={isActive} onCheckedChange={setIsActive} />
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Inactive Period (Optional)</Label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Input placeholder="mm / dd / yyyy" />
                  <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
                <span>-</span>
                <div className="relative flex-1">
                  <Input placeholder="mm / dd / yyyy" />
                  <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Set a date range to automatically mark the user as inactive. Useful for temporary suspensions or leaves
                of absence.
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="transactionApprover" className="flex items-center gap-1">
                  Transaction Approver <span className="text-red-500">*</span>
                </Label>
                <div className="flex items-center justify-between rounded-md border p-3">
                  <p className="text-sm">This user is capable of approving special transactions.</p>
                  <Switch
                    id="transactionApprover"
                    checked={transactionApprover}
                    onCheckedChange={setTransactionApprover}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="loanApprover" className="flex items-center gap-1">
                  Loan Approver <span className="text-red-500">*</span>
                </Label>
                <div className="flex items-center justify-between rounded-md border p-3">
                  <p className="text-sm">This user is capable of approving special transactions.</p>
                  <Switch id="loanApprover" checked={loanApprover} onCheckedChange={setLoanApprover} />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="disbursementsApprover" className="flex items-center gap-1">
                  Disbursements Approver <span className="text-red-500">*</span>
                </Label>
                <div className="flex items-center justify-between rounded-md border p-3">
                  <p className="text-sm">This user is capable of approving special transactions.</p>
                  <Switch
                    id="disbursementsApprover"
                    checked={disbursementsApprover}
                    onCheckedChange={setDisbursementsApprover}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="branchOpener" className="flex items-center gap-1">
                  Branch Opener <span className="text-red-500">*</span>
                </Label>
                <div className="flex items-center justify-between rounded-md border p-3">
                  <p className="text-sm">This user is capable of approving special transactions.</p>
                  <Switch id="branchOpener" checked={branchOpener} onCheckedChange={setBranchOpener} />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Access Schedule</h3>

              <div className="space-y-2">
                {Object.entries(daysEnabled).map(([day, enabled]) => (
                  <div key={day} className="flex items-center gap-4 rounded-md border p-3">
                    <div className="flex w-32 items-center gap-2">
                      <Switch checked={enabled} onCheckedChange={() => toggleDay(day as keyof typeof daysEnabled)} />
                      <span className="capitalize">{day}</span>
                    </div>

                    {enabled ? (
                      <div className="flex flex-1 items-center gap-2">
                        <div className="relative flex-1">
                          <Select defaultValue="09:00">
                            <SelectTrigger className="pl-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="08:00">08:00</SelectItem>
                              <SelectItem value="09:00">09:00</SelectItem>
                              <SelectItem value="10:00">10:00</SelectItem>
                            </SelectContent>
                          </Select>
                          <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        </div>

                        <span>to</span>

                        <div className="relative flex-1">
                          <Select defaultValue="17:00">
                            <SelectTrigger className="pl-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="17:00">17:00</SelectItem>
                              <SelectItem value="18:00">18:00</SelectItem>
                              <SelectItem value="19:00">19:00</SelectItem>
                            </SelectContent>
                          </Select>
                          <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    ) : day === "saturday" ? (
                      <p className="text-sm text-red-500">No time start and end added</p>
                    ) : day === "sunday" ? (
                      <p className="text-sm text-muted-foreground">No access on this day</p>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="devices" className="space-y-6 pt-4">
            <h3 className="text-lg font-semibold">Devices</h3>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <div className="flex items-center">
                        Device
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center">
                        Last Login
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center">
                        IP Address
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center">
                        Browser
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {devices.map((device, index) => (
                    <TableRow key={index}>
                      <TableCell>{device.device}</TableCell>
                      <TableCell>{device.lastLogin}</TableCell>
                      <TableCell>{device.ipAddress}</TableCell>
                      <TableCell>{device.browser}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button className="bg-blue-500 hover:bg-blue-600">
            {activeTab === "basic-info" ? "Save User" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}