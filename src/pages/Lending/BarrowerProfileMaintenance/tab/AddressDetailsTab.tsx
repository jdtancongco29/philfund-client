"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

export function AddressDetailsTab() {
  const [sameAddress, setSameAddress] = useState(false)

  return (
    <div className="space-y-8 p-6">
      <div className="space-y-6">
        <h3 className="text-lg font-semibold border-b pb-2">Current Address</h3>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label htmlFor="address">Address *</Label>
            <Textarea id="address" placeholder="Enter Address" className="mt-2" />
          </div>
          <div>
            <Label htmlFor="province">Province *</Label>
            <Select>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="province1">Province 1</SelectItem>
                <SelectItem value="province2">Province 2</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label htmlFor="municipality">Municipality / City *</Label>
            <Select>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="city1">City 1</SelectItem>
                <SelectItem value="city2">City 2</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="barangay">Barangay *</Label>
            <Select>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="barangay1">Barangay 1</SelectItem>
                <SelectItem value="barangay2">Barangay 2</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="street">Street/Zone/Phase/Block</Label>
          <Input id="street" placeholder="Enter Street/Zone/Phase/Block" className="mt-2" />
        </div>

        <div>
          <Label htmlFor="place-status">Place Status *</Label>
          <Select>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="owned">Owned</SelectItem>
              <SelectItem value="rented">Rented</SelectItem>
              <SelectItem value="family-owned">Family Owned</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox id="same-address" checked={sameAddress} onCheckedChange={(checked) => setSameAddress(checked === true)} />
          <Label htmlFor="same-address">Check this if the same permanent address</Label>
        </div>
      </div>

      {!sameAddress && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold border-b pb-2">Permanent Address</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label htmlFor="perm-address">Permanent Address *</Label>
              <Textarea id="perm-address" placeholder="Enter Address" className="mt-2" />
            </div>
            <div>
              <Label htmlFor="perm-province">Province *</Label>
              <Select>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="province1">Province 1</SelectItem>
                  <SelectItem value="province2">Province 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label htmlFor="perm-municipality">Municipality / City *</Label>
              <Select>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="city1">City 1</SelectItem>
                  <SelectItem value="city2">City 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="perm-barangay">Barangay *</Label>
              <Select>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="barangay1">Barangay 1</SelectItem>
                  <SelectItem value="barangay2">Barangay 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="perm-street">Street/Zone/Phase/Block</Label>
            <Input id="perm-street" placeholder="Enter Street/Zone/Phase/Block" className="mt-2" />
          </div>
        </div>
      )}

      <div className="space-y-6">
        <h3 className="text-lg font-semibold border-b pb-2">Contact Information</h3>
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input id="email" placeholder="Enter cash advance code" className="mt-2" />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label htmlFor="contact-1">Contact No. 1 *</Label>
            <Select>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select civil status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mobile">Mobile</SelectItem>
                <SelectItem value="landline">Landline</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="network-1">Network Provider 1 *</Label>
            <Select>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="globe">Globe</SelectItem>
                <SelectItem value="smart">Smart</SelectItem>
                <SelectItem value="sun">Sun</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label htmlFor="contact-2">Contact No. 2</Label>
            <Select>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select civil status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mobile">Mobile</SelectItem>
                <SelectItem value="landline">Landline</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="network-2">Network Provider 2</Label>
            <Select>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="globe">Globe</SelectItem>
                <SelectItem value="smart">Smart</SelectItem>
                <SelectItem value="sun">Sun</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  )
}
