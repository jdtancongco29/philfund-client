"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import type { FormData, ValidationErrors } from "../Services/AddBorrowersTypes"
import { cn } from "@/lib/utils"

interface AddressTabProps {
  formData: FormData
  validationErrors: ValidationErrors
  onUpdateFormData: (updates: Partial<FormData>) => void
}

interface Region {
  code: string
  name: string
  regionName: string
  islandGroupCode: string
  psgc10DigitCode: string
}

interface CityMunicipality {
  code: string
  name: string
  oldName: string
  isCapital: boolean
  isCity: boolean
  isMunicipality: boolean
  provinceCode: string
  districtCode: boolean
  regionCode: string
  islandGroupCode: string
  psgc10DigitCode: string
}

interface Barangay {
  code: string
  name: string
  oldName: string
  subMunicipalityCode: boolean
  cityCode: string
  municipalityCode: boolean
  districtCode: boolean
  provinceCode: string
  regionCode: string
  islandGroupCode: string
  psgc10DigitCode: string
}

export function AddressDetailsTab({ formData, validationErrors, onUpdateFormData }: AddressTabProps) {
  const [sameAddress, setSameAddress] = useState(!formData.is_permanent)

  // API data states
  const [regions, setRegions] = useState<Region[]>([])
  const [currentCities, setCurrentCities] = useState<CityMunicipality[]>([])
  const [currentBarangays, setCurrentBarangays] = useState<Barangay[]>([])
  const [permanentCities, setPermanentCities] = useState<CityMunicipality[]>([])
  const [permanentBarangays, setPermanentBarangays] = useState<Barangay[]>([])

  // Loading states
  const [loadingRegions, setLoadingRegions] = useState(false)
  const [loadingCurrentCities, setLoadingCurrentCities] = useState(false)
  const [loadingCurrentBarangays, setLoadingCurrentBarangays] = useState(false)
  const [loadingPermanentCities, setLoadingPermanentCities] = useState(false)
  const [loadingPermanentBarangays, setLoadingPermanentBarangays] = useState(false)

  // Selected region codes for API calls
  const [currentRegionCode, setCurrentRegionCode] = useState("")
  const [currentCityCode, setCurrentCityCode] = useState("")
  const [permanentRegionCode, setPermanentRegionCode] = useState("")
  const [permanentCityCode, setPermanentCityCode] = useState("")

  // Fetch regions on component mount
  useEffect(() => {
    const fetchRegions = async () => {
      setLoadingRegions(true)
      try {
        const response = await fetch("https://psgc.gitlab.io/api/regions/")
        const data: Region[] = await response.json()
        setRegions(data)
      } catch (error) {
        console.error("Error fetching regions:", error)
      } finally {
        setLoadingRegions(false)
      }
    }

    fetchRegions()
  }, [])

  // Fetch cities/municipalities when region is selected (current address)
  useEffect(() => {
    if (currentRegionCode) {
      const fetchCities = async () => {
        setLoadingCurrentCities(true)
        try {
          const response = await fetch(`https://psgc.gitlab.io/api/regions/${currentRegionCode}/cities-municipalities/`)
          const data: CityMunicipality[] = await response.json()
          setCurrentCities(data)
        } catch (error) {
          console.error("Error fetching cities:", error)
        } finally {
          setLoadingCurrentCities(false)
        }
      }

      fetchCities()
    } else {
      setCurrentCities([])
    }
  }, [currentRegionCode])

  // Fetch barangays when city/municipality is selected (current address)
  useEffect(() => {
    if (currentCityCode) {
      const fetchBarangays = async () => {
        setLoadingCurrentBarangays(true)
        try {
          const response = await fetch(`https://psgc.gitlab.io/api/cities-municipalities/${currentCityCode}/barangays/`)
          const data: Barangay[] = await response.json()
          setCurrentBarangays(data)
        } catch (error) {
          console.error("Error fetching barangays:", error)
        } finally {
          setLoadingCurrentBarangays(false)
        }
      }

      fetchBarangays()
    } else {
      setCurrentBarangays([])
    }
  }, [currentCityCode])

  // Fetch cities/municipalities when region is selected (permanent address)
  useEffect(() => {
    if (permanentRegionCode && !sameAddress) {
      const fetchCities = async () => {
        setLoadingPermanentCities(true)
        try {
          const response = await fetch(
            `https://psgc.gitlab.io/api/regions/${permanentRegionCode}/cities-municipalities/`,
          )
          const data: CityMunicipality[] = await response.json()
          setPermanentCities(data)
        } catch (error) {
          console.error("Error fetching cities:", error)
        } finally {
          setLoadingPermanentCities(false)
        }
      }

      fetchCities()
    } else {
      setPermanentCities([])
    }
  }, [permanentRegionCode, sameAddress])

  // Fetch barangays when city/municipality is selected (permanent address)
  useEffect(() => {
    if (permanentCityCode && !sameAddress) {
      const fetchBarangays = async () => {
        setLoadingPermanentBarangays(true)
        try {
          const response = await fetch(
            `https://psgc.gitlab.io/api/cities-municipalities/${permanentCityCode}/barangays/`,
          )
          const data: Barangay[] = await response.json()
          setPermanentBarangays(data)
        } catch (error) {
          console.error("Error fetching barangays:", error)
        } finally {
          setLoadingPermanentBarangays(false)
        }
      }

      fetchBarangays()
    } else {
      setPermanentBarangays([])
    }
  }, [permanentCityCode, sameAddress])

  useEffect(() => {
    onUpdateFormData({ is_permanent: !sameAddress })

    if (sameAddress) {
      onUpdateFormData({
        permanent_address: "",
        permanent_province: "",
        permanent_municipality: "",
        permanent_barangay: "",
        permanent_street: "",
      })
      setPermanentRegionCode("")
      setPermanentCityCode("")
    }
  }, [sameAddress, onUpdateFormData])

  const handleInputChange = (field: keyof FormData, value: string | Date | undefined) => {
    onUpdateFormData({ [field]: value })
  }

  const handleProvinceChange = (value: string, isPermanent = false) => {
    const selectedRegion = regions.find((region) => region.name === value)
    if (selectedRegion) {
      if (isPermanent) {
        setPermanentRegionCode(selectedRegion.code)
        handleInputChange("permanent_province", value)
        handleInputChange("permanent_municipality", "")
        handleInputChange("permanent_barangay", "")
        setPermanentCityCode("")
      } else {
        setCurrentRegionCode(selectedRegion.code)
        handleInputChange("province", value)
        handleInputChange("municipality", "")
        handleInputChange("barangay", "")
        setCurrentCityCode("")
      }
    }
  }

  const handleMunicipalityChange = (value: string, isPermanent = false) => {
    const cities = isPermanent ? permanentCities : currentCities
    const selectedCity = cities.find((city) => city.name === value)
    if (selectedCity) {
      if (isPermanent) {
        setPermanentCityCode(selectedCity.code)
        handleInputChange("permanent_municipality", value)
        handleInputChange("permanent_barangay", "")
      } else {
        setCurrentCityCode(selectedCity.code)
        handleInputChange("municipality", value)
        handleInputChange("barangay", "")
      }
    }
  }

  const getFieldError = (field: string) => {
    return validationErrors[field]
  }

  return (
    <div className="space-y-8 p-6">
      <div className="space-y-6">
        <h3 className="text-lg font-semibold border-b pb-2">Current Address</h3>

        <div className="grid grid-cols-2 gap-6">
          <div className="hidden">
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
          
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div>
            <Label htmlFor="province">Province *</Label>
            <Select
              value={formData.province}
              onValueChange={(value) => handleProvinceChange(value)}
              disabled={loadingRegions}
            >
              <SelectTrigger className={cn("w-full mt-2", getFieldError("province") && "border-red-500")}>
                <SelectValue placeholder={loadingRegions ? "Loading regions..." : "Select..."} />
              </SelectTrigger>
              <SelectContent>
                {regions.map((region) => (
                  <SelectItem key={region.code} value={region.name}>
                    {region.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {getFieldError("province") && <p className="text-sm text-red-500 mt-1">{getFieldError("province")}</p>}
          </div>
          <div>
            <Label htmlFor="municipality">Municipality / City * {formData.municipality}</Label>
            <Select
              value={formData.municipality}
              onValueChange={(value) => handleMunicipalityChange(value)}
            >
              <SelectTrigger className={cn("w-full mt-2", getFieldError("municipality") && "border-red-500")}>
                <SelectValue
                  placeholder={
                    loadingCurrentCities
                      ? "Loading cities..."
                      : !currentRegionCode
                        ? "Select province first"
                        : "Select..."
                  }
                />
              </SelectTrigger>
         <SelectContent>
            {formData.municipality &&
              !currentCities.some((city) => city.name === formData.municipality) && (
                <SelectItem value={formData.municipality} className="text-black">
                  {formData.municipality} (Unlisted)
                </SelectItem>
              )}

            {currentCities.map((city) => (
              <SelectItem key={city.code} value={city.name}>
                {city.name}
              </SelectItem>
            ))}
          </SelectContent>

            </Select>
            {getFieldError("municipality") && (
              <p className="text-sm text-red-500 mt-1">{getFieldError("municipality")}</p>
            )}
          </div>
          <div>
            <Label htmlFor="barangay">Barangay *</Label>
           <Select
            value={formData.barangay}
            onValueChange={(value) => handleInputChange("barangay", value)}

          >
            <SelectTrigger
              className={cn("w-full mt-2", getFieldError("barangay") && "border-red-500")}
            >
              <SelectValue
                placeholder={
                  loadingCurrentBarangays
                    ? "Loading barangays..."
                    : !currentCityCode
                      ? "Select city/municipality first"
                      : "Select..."
                }
              />
            </SelectTrigger>
            <SelectContent>
              {formData.barangay &&
                !currentBarangays.some((b) => b.name === formData.barangay) && (
                  <SelectItem value={formData.barangay} className="text-black">
                    {formData.barangay} (Unlisted)
                  </SelectItem>
                )}

              {currentBarangays.map((barangay) => (
                <SelectItem key={barangay.code} value={barangay.name}>
                  {barangay.name}
                </SelectItem>
              ))}
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
              <SelectItem value="rented">Rented</SelectItem>
              <SelectItem value="owned">Owned</SelectItem>
              <SelectItem value="living-with-parents">Living with Parents</SelectItem>
              <SelectItem value="stays-in-school">Stays in School</SelectItem>
            </SelectContent>
          </Select>
          {getFieldError("place_status") && (
            <p className="text-sm text-red-500 mt-1">{getFieldError("place_status")}</p>
          )}
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
            <div className= ""hidden>
              <Label htmlFor="perm-address">Permanent Address *</Label>
              <Textarea
                id="perm-address"
                placeholder="Enter Address"
                value={formData.permanent_address}
                onChange={(e) => handleInputChange("permanent_address", e.target.value)}
                className={cn("mt-2", getFieldError("permanent_address") && "border-red-500")}
              />
              {getFieldError("permanent_address") && (
                <p className="text-sm text-red-500 mt-1">{getFieldError("permanent_address")}</p>
              )}
            </div>
           
          </div>

          <div className="grid grid-cols-3 gap-6">
             <div>
              <Label htmlFor="perm-province">Province *</Label>
              <Select
                value={formData.permanent_province}
                onValueChange={(value) => handleProvinceChange(value, true)}
                disabled={loadingRegions}
              >
                <SelectTrigger className={cn("mt-2 w-full", getFieldError("permanent_province") && "border-red-500")}>
                  <SelectValue placeholder={loadingRegions ? "Loading regions..." : "Select..."} />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((region) => (
                    <SelectItem key={region.code} value={region.name}>
                      {region.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {getFieldError("permanent_province") && (
                <p className="text-sm text-red-500 mt-1">{getFieldError("permanent_province")}</p>
              )}
            </div>
           <div>
  <Label htmlFor="perm-municipality">Municipality / City *</Label>
  <Select
    value={formData.permanent_municipality}
    onValueChange={(value) => handleMunicipalityChange(value, true)}
   
  >
    <SelectTrigger
      className={cn("mt-2 w-full", getFieldError("permanent_municipality") && "border-red-500")}
    >
      <SelectValue
        placeholder={
          loadingPermanentCities
            ? "Loading cities..."
            : !permanentRegionCode
              ? "Select province first"
              : "Select..."
        }
      />
    </SelectTrigger>
    <SelectContent>
      {/* Show selected value if not in the list */}
      {formData.permanent_municipality &&
        !permanentCities.some((c) => c.name === formData.permanent_municipality) && (
          <SelectItem value={formData.permanent_municipality} className="text-black">
            {formData.permanent_municipality} (Unlisted)
          </SelectItem>
        )}
      {permanentCities.map((city) => (
        <SelectItem key={city.code} value={city.name}>
          {city.name}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
  {getFieldError("permanent_municipality") && (
    <p className="text-sm text-red-500 mt-1">{getFieldError("permanent_municipality")}</p>
  )}
</div>

<div>
  <Label htmlFor="perm-barangay">Barangay *</Label>
  <Select
    value={formData.permanent_barangay}
    onValueChange={(value) => handleInputChange("permanent_barangay", value)}
  >
    <SelectTrigger
      className={cn("mt-2 w-full", getFieldError("permanent_barangay") && "border-red-500")}
    >
      <SelectValue
        placeholder={
          loadingPermanentBarangays
            ? "Loading barangays..."
            : !permanentCityCode
              ? "Select city/municipality first"
              : "Select..."
        }
      />
    </SelectTrigger>
    <SelectContent>
      {formData.permanent_barangay &&
        !permanentBarangays.some((b) => b.name === formData.permanent_barangay) && (
          <SelectItem value={formData.permanent_barangay} className="text-black">
            {formData.permanent_barangay} (Unlisted)
          </SelectItem>
        )}
      {permanentBarangays.map((barangay) => (
        <SelectItem key={barangay.code} value={barangay.name}>
          {barangay.name}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
  {getFieldError("permanent_barangay") && (
    <p className="text-sm text-red-500 mt-1">{getFieldError("permanent_barangay")}</p>
  )}
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
            {getFieldError("permanent_street") && (
              <p className="text-sm text-red-500 mt-1">{getFieldError("permanent_street")}</p>
            )}
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
            {getFieldError("contactNumber1") && (
              <p className="text-sm text-red-500 mt-1">{getFieldError("contactNumber1")}</p>
            )}
          </div>
          <div>
            <Label htmlFor="network-1">Network Provider 1 *</Label>
            <Select
              value={formData.network_provider1}
              onValueChange={(value) => handleInputChange("network_provider1", value)}
            >
              <SelectTrigger className={cn("mt-2 w-full", getFieldError("network_provider1") && "border-red-500")}>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="globe telecom">Globe Telecom</SelectItem>
                <SelectItem value="smart">Smart</SelectItem>
                <SelectItem value="sun">Sun</SelectItem>
                <SelectItem value="tm">TM</SelectItem>
                <SelectItem value="tnt">TNT</SelectItem>
                <SelectItem value="dito">Dito</SelectItem>
              </SelectContent>
            </Select>
            {getFieldError("network_provider1") && (
              <p className="text-sm text-red-500 mt-1">{getFieldError("network_provider1")}</p>
            )}
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
            {getFieldError("contctNumber2") && (
              <p className="text-sm text-red-500 mt-1">{getFieldError("contctNumber2")}</p>
            )}
          </div>
          <div>
            <Label htmlFor="network-2">Network Provider 2 *</Label>
            <Select
              value={formData.network_provider2}
              onValueChange={(value) => handleInputChange("network_provider2", value)}
            >
              <SelectTrigger className={cn("mt-2 w-full", getFieldError("network_provider2") && "border-red-500")}>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="globe telecom">Globe Telecom</SelectItem>
                <SelectItem value="smart">Smart</SelectItem>
                <SelectItem value="sun">Sun</SelectItem>
                <SelectItem value="tm">TM</SelectItem>
                <SelectItem value="tnt">TNT</SelectItem>
                <SelectItem value="dito">Dito</SelectItem>
              </SelectContent>
            </Select>
            {getFieldError("network_provider2") && (
              <p className="text-sm text-red-500 mt-1">{getFieldError("network_provider2")}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
