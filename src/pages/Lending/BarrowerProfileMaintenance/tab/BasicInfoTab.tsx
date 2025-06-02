"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from 'lucide-react'
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export function BasicInfoTab() {
  const [birthDate, setBirthDate] = useState<Date>()

  return (
     <div className="space-y-8 p-6">
      
      <div className="grid gap-6">
        <div>
          <Label htmlFor="risk-level">Risk Level</Label>
          <Select>
           <SelectTrigger className="w-1/3 mt-2 mr-auto">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="4">Super-Prime</SelectItem>
              <SelectItem value="3">Prime </SelectItem>
              <SelectItem value="2">Non-Prime</SelectItem>
                <SelectItem value="1">Declined </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-3 gap-6">

          
          <div>
            <Label htmlFor="last-name">Last Name *</Label>
            <Input id="last-name" placeholder="Enter cash advance code" className="mt-2" />
          </div>
          <div>
            <Label htmlFor="first-name">First Name *</Label>
            <Input id="first-name" placeholder="Enter cash advance name" className="mt-2" />
          </div>
          <div>
            <Label htmlFor="middle-name">Middle Name *</Label>
            <Input id="middle-name" placeholder="Enter cash advance name" className="mt-2" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div>
            <Label htmlFor="suffix">Suffix</Label>
            <Input id="suffix" placeholder="Enter cash advance code" className="mt-2" />
          </div>
          <div>
            <Label htmlFor="civil-status">Civil Status *</Label>
            <Select>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="married">Married</SelectItem>
                <SelectItem value="divorced">Divorced</SelectItem>
                <SelectItem value="widowed">Widowed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="gender">Gender *</Label>
            <Select>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div>
            <Label>Birth Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal mt-2",
                    !birthDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {birthDate ? format(birthDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={birthDate} onSelect={setBirthDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label htmlFor="age">Age</Label>
            <Input id="age" placeholder="0" className="mt-2" />
          </div>
          <div>
            <Label htmlFor="birth-place">Birth Place</Label>
            <Input id="birth-place" placeholder="Enter birth place" className="mt-2" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label htmlFor="maiden-name">Maiden Name *</Label>
            <Input id="maiden-name" placeholder="Enter maiden name" className="mt-2" />
          </div>
          <div>
            <Label htmlFor="nickname">Nickname</Label>
            <Input id="nickname" placeholder="Enter nickname" className="mt-2" />
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-semibold border-b pb-2">Health</h3>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <Label htmlFor="blood-type">Blood Type *</Label>
              <Select >
                <SelectTrigger className="mt-2 w-full">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a+">A+</SelectItem>
                  <SelectItem value="a-">A-</SelectItem>
                  <SelectItem value="b+">B+</SelectItem>
                  <SelectItem value="b-">B-</SelectItem>
                  <SelectItem value="ab+">AB+</SelectItem>
                  <SelectItem value="ab-">AB-</SelectItem>
                  <SelectItem value="o+">O+</SelectItem>
                  <SelectItem value="o-">O-</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="health-condition">Health Condition *</Label>
              <Select>
                <SelectTrigger className="mt-2 w-full">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Date of Death</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal mt-2">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    <span>Select Date</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-semibold border-b pb-2">Spouse Information</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label htmlFor="spouse-name">Name *</Label>
              <Input id="spouse-name" placeholder="Enter spouse name" className="mt-2" />
            </div>
            <div>
              <Label htmlFor="spouse-occupation">Occupation *</Label>
              <Input id="spouse-occupation" placeholder="Enter occupation" className="mt-2" />
            </div>
          </div>
          <div>
            <Label htmlFor="spouse-address">Address *</Label>
            <Textarea id="spouse-address" placeholder="Enter Address" className="mt-2" />
          </div>
          <div>
            <Label htmlFor="spouse-contact">Contact Number *</Label>
            <Input id="spouse-contact" placeholder="Enter contact number" className="mt-2" />
          </div>
        </div>
      </div>
    </div>
  )
}
