"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import type { FormData, ValidationErrors } from "../AddBorrowerDialog"
import { cn } from "@/lib/utils"

interface AddressTabProps {
  formData: FormData
  validationErrors: ValidationErrors
  onUpdateFormData: (updates: Partial<FormData>) => void
}

export function AddressDetailsTab({ formData, validationErrors, onUpdateFormData }: AddressTabProps) {
  const [sameAddress, setSameAddress] = useState(!formData.is_permanent)

  // Update form data when sameAddress changes
  useEffect(() => {
    onUpdateFormData({ is_permanent: !sameAddress })
    
    // If same address is checked, clear permanent address fields
    if (sameAddress) {
      onUpdateFormData({
        permanent_address: "",
        permanent_province: "",
        permanent_municipality: "",
        permanent_barangay: "",
        permanent_street: ""
      })
    }
  }, [sameAddress, onUpdateFormData])

  const handleInputChange = (field: keyof FormData, value: string | Date | undefined) => {
    onUpdateFormData({ [field]: value })
  }

  const getFieldError = (field: string) => {
    return validationErrors[field]
  }

  return (
    <div className="space-y-8 p-6">
      <div className="space-y-6">
        <h3 className="text-lg font-semibold border-b pb-2">Current Address</h3>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label htmlFor="address">Address *</Label>
            <Textarea 
              id="address" 
              placeholder="Enter Address" 
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              className={cn("mt-2", getFieldError("address") && "border-red-500")}
            />
            {getFieldError("address") && <p className="text-sm text-red-500 mt-1">{getFieldError("address")}</p>}
          </div>
          <div>
            <Label htmlFor="province">Province *</Label>
            <Select value={formData.province} onValueChange={(value) => handleInputChange("province", value)}>
              <SelectTrigger className={cn("w-full mt-2", getFieldError("province") && "border-red-500")}>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="province1">Province 1</SelectItem>
                <SelectItem value="province2">Province 2</SelectItem>
                <SelectItem value="misamis-oriental">Misamis Oriental</SelectItem>
                <SelectItem value="misamis-occidental">Misamis Occidental</SelectItem>
                <SelectItem value="bukidnon">Bukidnon</SelectItem>
                <SelectItem value="lanao-del-norte">Lanao del Norte</SelectItem>
                <SelectItem value="camiguin">Camiguin</SelectItem>
              </SelectContent>
            </Select>
            {getFieldError("province") && <p className="text-sm text-red-500 mt-1">{getFieldError("province")}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label htmlFor="municipality">Municipality / City *</Label>
            <Select value={formData.municipality} onValueChange={(value) => handleInputChange("municipality", value)}>
              <SelectTrigger className={cn("w-full mt-2", getFieldError("municipality") && "border-red-500")}>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cagayan-de-oro">Cagayan de Oro City</SelectItem>
                <SelectItem value="gingoog">Gingoog City</SelectItem>
                <SelectItem value="el-salvador">El Salvador City</SelectItem>
                <SelectItem value="alubijid">Alubijid</SelectItem>
                <SelectItem value="balingoan">Balingoan</SelectItem>
                <SelectItem value="balingasag">Balingasag</SelectItem>
                <SelectItem value="claveria">Claveria</SelectItem>
                <SelectItem value="jasaan">Jasaan</SelectItem>
              </SelectContent>
            </Select>
            {getFieldError("municipality") && <p className="text-sm text-red-500 mt-1">{getFieldError("municipality")}</p>}
          </div>
          <div>
            <Label htmlFor="barangay">Barangay *</Label>
            <Select value={formData.barangay} onValueChange={(value) => handleInputChange("barangay", value)}>
              <SelectTrigger className={cn("w-full mt-2", getFieldError("barangay") && "border-red-500")}>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="barangay1">Barangay 1</SelectItem>
                <SelectItem value="barangay2">Barangay 2</SelectItem>
                <SelectItem value="carmen">Carmen</SelectItem>
                <SelectItem value="lapasan">Lapasan</SelectItem>
                <SelectItem value="nazareth">Nazareth</SelectItem>
                <SelectItem value="pueblo-de-oro">Pueblo de Oro</SelectItem>
              </SelectContent>
            </Select>
            {getFieldError("barangay") && <p className="text-sm text-red-500 mt-1">{getFieldError("barangay")}</p>}
          </div>
        </div>

        <div>
          <Label htmlFor="street">Street/Zone/Phase/Block *</Label>
          <Input 
            id="street" 
            placeholder="Enter Street/Zone/Phase/Block" 
            value={formData.street}
            className={cn("mt-2", getFieldError("street") && "border-red-500")} 
            onChange={(e) => handleInputChange("street", e.target.value)}
          />
          {getFieldError("street") && <p className="text-sm text-red-500 mt-1">{getFieldError("street")}</p>}
        </div>

        <div>
          <Label htmlFor="place-status">Place Status *</Label>
          <Select value={formData.place_status} onValueChange={(value) => handleInputChange("place_status", value)}>
            <SelectTrigger className={cn("w-full mt-2", getFieldError("place_status") && "border-red-500")}>
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="owned">Owned</SelectItem>
              <SelectItem value="rented">Rented</SelectItem>
              <SelectItem value="family-owned">Family Owned</SelectItem>
              <SelectItem value="company-provided">Company Provided</SelectItem>
              <SelectItem value="boarding">Boarding</SelectItem>
            </SelectContent>
          </Select>
          {getFieldError("place_status") && <p className="text-sm text-red-500 mt-1">{getFieldError("place_status")}</p>}
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox 
            id="same-address" 
            checked={sameAddress} 
            onCheckedChange={(checked) => setSameAddress(checked === true)} 
          />
          <Label htmlFor="same-address">Check this if the same permanent address</Label>
        </div>
      </div>

      {!sameAddress && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold border-b pb-2">Permanent Address</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label htmlFor="perm-address">Permanent Address *</Label>
              <Textarea 
                id="perm-address" 
                placeholder="Enter Address" 
                value={formData.permanent_address}
                onChange={(e) => handleInputChange("permanent_address", e.target.value)}
                className={cn("mt-2", getFieldError("permanent_address") && "border-red-500")}
              />
              {getFieldError("permanent_address") && <p className="text-sm text-red-500 mt-1">{getFieldError("permanent_address")}</p>}
            </div>
            <div>
              <Label htmlFor="perm-province">Province *</Label>
              <Select value={formData.permanent_province} onValueChange={(value) => handleInputChange("permanent_province", value)}>
                <SelectTrigger className={cn("mt-2 w-full", getFieldError("permanent_province") && "border-red-500")}>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="province1">Province 1</SelectItem>
                  <SelectItem value="province2">Province 2</SelectItem>
                  <SelectItem value="misamis-oriental">Misamis Oriental</SelectItem>
                  <SelectItem value="misamis-occidental">Misamis Occidental</SelectItem>
                  <SelectItem value="bukidnon">Bukidnon</SelectItem>
                  <SelectItem value="lanao-del-norte">Lanao del Norte</SelectItem>
                  <SelectItem value="camiguin">Camiguin</SelectItem>
                </SelectContent>
              </Select>
              {getFieldError("permanent_province") && <p className="text-sm text-red-500 mt-1">{getFieldError("permanent_province")}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label htmlFor="perm-municipality">Municipality / City *</Label>
              <Select value={formData.permanent_municipality} onValueChange={(value) => handleInputChange("permanent_municipality", value)}>
                <SelectTrigger className={cn("mt-2 w-full", getFieldError("permanent_municipality") && "border-red-500")}>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cagayan-de-oro">Cagayan de Oro City</SelectItem>
                  <SelectItem value="gingoog">Gingoog City</SelectItem>
                  <SelectItem value="el-salvador">El Salvador City</SelectItem>
                  <SelectItem value="alubijid">Alubijid</SelectItem>
                  <SelectItem value="balingoan">Balingoan</SelectItem>
                  <SelectItem value="balingasag">Balingasag</SelectItem>
                  <SelectItem value="claveria">Claveria</SelectItem>
                  <SelectItem value="jasaan">Jasaan</SelectItem>
                </SelectContent>
              </Select>
              {getFieldError("permanent_municipality") && <p className="text-sm text-red-500 mt-1">{getFieldError("permanent_municipality")}</p>}
            </div>
            <div>
              <Label htmlFor="perm-barangay">Barangay *</Label>
              <Select value={formData.permanent_barangay} onValueChange={(value) => handleInputChange("permanent_barangay", value)}>
                <SelectTrigger className={cn("mt-2 w-full", getFieldError("permanent_barangay") && "border-red-500")}>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="barangay1">Barangay 1</SelectItem>
                  <SelectItem value="barangay2">Barangay 2</SelectItem>
                  <SelectItem value="carmen">Carmen</SelectItem>
                  <SelectItem value="lapasan">Lapasan</SelectItem>
                  <SelectItem value="nazareth">Nazareth</SelectItem>
                  <SelectItem value="pueblo-de-oro">Pueblo de Oro</SelectItem>
                </SelectContent>
              </Select>
              {getFieldError("permanent_barangay") && <p className="text-sm text-red-500 mt-1">{getFieldError("permanent_barangay")}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="perm-street">Street/Zone/Phase/Block *</Label>
            <Input 
              id="perm-street" 
              placeholder="Enter Street/Zone/Phase/Block" 
              value={formData.permanent_street}
              onChange={(e) => handleInputChange("permanent_street", e.target.value)}
              className={cn("mt-2", getFieldError("permanent_street") && "border-red-500")}
            />
            {getFieldError("permanent_street") && <p className="text-sm text-red-500 mt-1">{getFieldError("permanent_street")}</p>}
          </div>
        </div>
      )}

      <div className="space-y-6">
        <h3 className="text-lg font-semibold border-b pb-2">Contact Information</h3>
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input 
            id="email" 
            type="email"
            placeholder="Enter email address" 
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className={cn("mt-2", getFieldError("email") && "border-red-500")}
          />
          {getFieldError("email") && <p className="text-sm text-red-500 mt-1">{getFieldError("email")}</p>}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label htmlFor="contact-1">Contact No. 1 *</Label>
            <Input 
              id="contact-1" 
              placeholder="Enter contact number" 
              value={formData.contactNumber1}
              onChange={(e) => handleInputChange("contactNumber1", e.target.value)}
              className={cn("mt-2", getFieldError("contactNumber1") && "border-red-500")}
            />
            {getFieldError("contactNumber1") && <p className="text-sm text-red-500 mt-1">{getFieldError("contactNumber1")}</p>}
          </div>
          <div>
            <Label htmlFor="network-1">Network Provider 1 *</Label>
            <Select value={formData.network_provider1} onValueChange={(value) => handleInputChange("network_provider1", value)}>
              <SelectTrigger className={cn("mt-2 w-full", getFieldError("network_provider1") && "border-red-500")}>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="globe">Globe</SelectItem>
                <SelectItem value="smart">Smart</SelectItem>
                <SelectItem value="sun">Sun</SelectItem>
                <SelectItem value="tm">TM</SelectItem>
                <SelectItem value="tnt">TNT</SelectItem>
                <SelectItem value="dito">Dito</SelectItem>
              </SelectContent>
            </Select>
            {getFieldError("network_provider1") && <p className="text-sm text-red-500 mt-1">{getFieldError("network_provider1")}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label htmlFor="contact-2">Contact No. 2 *</Label>
            <Input 
              id="contact-2" 
              placeholder="Enter contact number" 
              value={formData.contctNumber2}
              onChange={(e) => handleInputChange("contctNumber2", e.target.value)}
              className={cn("mt-2", getFieldError("contctNumber2") && "border-red-500")}
            />
            {getFieldError("contctNumber2") && <p className="text-sm text-red-500 mt-1">{getFieldError("contctNumber2")}</p>}
          </div>
          <div>
            <Label htmlFor="network-2">Network Provider 2</Label>
            <Select value={formData.network_provider2} onValueChange={(value) => handleInputChange("network_provider2", value)}>
              <SelectTrigger className="mt-2 w-full">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="globe">Globe</SelectItem>
                <SelectItem value="smart">Smart</SelectItem>
                <SelectItem value="sun">Sun</SelectItem>
                <SelectItem value="tm">TM</SelectItem>
                <SelectItem value="tnt">TNT</SelectItem>
                <SelectItem value="dito">Dito</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  )
}