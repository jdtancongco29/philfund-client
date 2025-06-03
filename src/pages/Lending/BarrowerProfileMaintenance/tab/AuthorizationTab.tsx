"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarIcon, Plus, Upload, Edit, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface AuthorizedPerson {
  id: string
  name: string
  relationship: string
}

export function AuthorizationTab() {
  const [authDateIssued, setAuthDateIssued] = useState<Date>()
  const [authorizedPersons, setAuthorizedPersons] = useState<AuthorizedPerson[]>([
    { id: "1", name: "Authorized Person Name", relationship: "Mother" },
    { id: "2", name: "Authorized Person Name", relationship: "Cousin" },
    { id: "3", name: "Authorized Person Name", relationship: "Spouse" },
  ])

  const addAuthorizedPerson = () => {
    const newPerson: AuthorizedPerson = {
      id: Date.now().toString(),
      name: "Authorized Person Name",
      relationship: "Relationship",
    }
    setAuthorizedPersons([...authorizedPersons, newPerson])
  }

  const removeAuthorizedPerson = (id: string) => {
    setAuthorizedPersons(authorizedPersons.filter((person) => person.id !== id))
  }

  return (
    <div className="space-y-8 p-6">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-6 border-b pb-2">Add Authorize Person</h3>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="auth-name">Full Name *</Label>
                <Input id="auth-name" placeholder="Enter name" className="mt-2" />
              </div>
              <div>
                <Label htmlFor="auth-relationship">Relationship *</Label>
                <Input id="auth-relationship" placeholder="Enter relationship" className="mt-2" />
              </div>
            </div>

            <div>
              <Label htmlFor="auth-address">Address *</Label>
              <Textarea id="auth-address" placeholder="Enter Address" className="mt-2" />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="auth-contact">Contact Number *</Label>
                <Input id="auth-contact" placeholder="Enter contact number" className="mt-2" />
              </div>
              <div>
                <Label htmlFor="auth-years">Years Known *</Label>
                <Input id="auth-years" placeholder="Enter number of years" className="mt-2" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="auth-id-type">Valid ID Type *</Label>
                <Select>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="drivers-license">Driver's License</SelectItem>
                    <SelectItem value="passport">Passport</SelectItem>
                    <SelectItem value="sss">SSS ID</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="auth-id-number">Valid ID Number *</Label>
                <Input id="auth-id-number" placeholder="Enter ID number" className="mt-2" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="auth-place">Place Issued *</Label>
                <Input id="auth-place" placeholder="Enter place" className="mt-2" />
              </div>
              <div>
                <Label>Date Issued *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal mt-2",
                        !authDateIssued && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {authDateIssued ? format(authDateIssued, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={authDateIssued} onSelect={setAuthDateIssued} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="auth-signature">Signature *</Label>
                <div className="flex items-center gap-2 mt-2">
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                  </Button>
                  <span className="text-sm text-muted-foreground">No file chosen</span>
                </div>
              </div>
              <div>
                <Label htmlFor="auth-photo">Photo *</Label>
                <div className="flex items-center gap-2 mt-2">
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                  </Button>
                  <span className="text-sm text-muted-foreground">No file chosen</span>
                </div>
              </div>
            </div>

         <div className="flex justify-end gap-2">
  <Button variant="outline">Reset</Button>
  <Button onClick={addAuthorizedPerson}>Add Person</Button>
</div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold border-b pb-2">Authorize Persons</h3>
          <Button onClick={addAuthorizedPerson} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-6 font-medium text-sm">
            <Label>Name</Label>
            <Label>Relation Ship</Label>
            <Label>Actions</Label>
          </div>

          {authorizedPersons.map((person) => (
            <div key={person.id} className="grid grid-cols-3 gap-6 items-center">
              <span>{person.name}</span>
              <span>{person.relationship}</span>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeAuthorizedPerson(person.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
