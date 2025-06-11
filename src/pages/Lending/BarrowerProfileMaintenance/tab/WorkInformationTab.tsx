"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"
import type {
  ValidationErrors,
  BorrowerClassification,
  BorrowerGroup,
  BorrowerDistrict,
  BorrowerDivision,
  BorrowerSchool,
  Bank,
  WorkFormData,
} from "../Services/AddBorrowersTypes"
import {
  fetchBorrowerClassificationsApi,
  fetchBorrowerGroupsApi,
  fetchBorrowerDistrictsApi,
  fetchBorrowerDivisionsApi,
  fetchBorrowerSchoolsApi,
  fetchBanksApi,
} from "../Services/AddBorrowersService"
import { format } from "date-fns"
import ReactSelect from "react-select"

interface WorkInformationTabProps {
  formData: WorkFormData
  validationErrors: ValidationErrors
  onUpdateFormData: (updates: Partial<WorkFormData>) => void
}

// Option type for react-select
interface ClassificationOption {
  value: string
  label: string
  data: BorrowerClassification
}

interface CategoryOption {
  value: string
  label: string
  data: BorrowerGroup
}

interface DistrictOption {
  value: string
  label: string
  data: BorrowerDistrict
}

interface DivisionOption {
  value: string
  label: string
  data: BorrowerDivision
}

interface SchoolOption {
  value: string
  label: string
  data: BorrowerSchool
}

interface BankOption {
  value: string
  label: string
  data: Bank
}

export function WorkInformationTab({ formData, validationErrors, onUpdateFormData }: WorkInformationTabProps) {
  const [classifications, setClassifications] = useState<BorrowerClassification[]>([])
  const [categories, setCategories] = useState<BorrowerGroup[]>([])
  const [isLoadingClassifications, setIsLoadingClassifications] = useState(false)
  const [isLoadingCategories, setIsLoadingCategories] = useState(false)
  const [classificationError, setClassificationError] = useState<string | null>(null)
  const [categoryError, setCategoryError] = useState<string | null>(null)
  const [districts, setDistricts] = useState<BorrowerDistrict[]>([])
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false)
  const [districtError, setDistrictError] = useState<string | null>(null)
  const [divisions, setDivisions] = useState<BorrowerDivision[]>([])
  const [isLoadingDivisions, setIsLoadingDivisions] = useState(false)
  const [divisionError, setDivisionError] = useState<string | null>(null)
  const [schools, setSchools] = useState<BorrowerSchool[]>([])
  const [isLoadingSchools, setIsLoadingSchools] = useState(false)
  const [schoolError, setSchoolError] = useState<string | null>(null)
  const [banks, setBanks] = useState<Bank[]>([])
  const [isLoadingBanks, setIsLoadingBanks] = useState(false)
  const [bankError, setBankError] = useState<string | null>(null)

  // Fetch classifications on component mount
  useEffect(() => {
    const loadClassifications = async () => {
      setIsLoadingClassifications(true)
      setClassificationError(null)

      try {
        const response = await fetchBorrowerClassificationsApi()
        if (response.status === "FETCHED" && response.data.classifications) {
          setClassifications(response.data.classifications.filter((c) => c.status)) // Only active classifications
        }
      } catch (error) {
        console.error("Error fetching classifications:", error)
        setClassificationError("Failed to load classifications")
      } finally {
        setIsLoadingClassifications(false)
      }
    }

    loadClassifications()
  }, [])

  // Fetch categories/groups on component mount
  useEffect(() => {
    const loadCategories = async () => {
      setIsLoadingCategories(true)
      setCategoryError(null)

      try {
        const response = await fetchBorrowerGroupsApi()
        if (response.status === "FETCHED" && response.data.groups) {
          setCategories(response.data.groups.filter((g) => g.status)) // Only active groups
        }
      } catch (error) {
        console.error("Error fetching categories:", error)
        setCategoryError("Failed to load categories")
      } finally {
        setIsLoadingCategories(false)
      }
    }

    loadCategories()
  }, [])

  // Fetch districts on component mount
  useEffect(() => {
    const loadDistricts = async () => {
      setIsLoadingDistricts(true)
      setDistrictError(null)

      try {
        const response = await fetchBorrowerDistrictsApi()
        if (response.status === "FETCHED" && response.data.districts) {
          setDistricts(response.data.districts.filter((d) => d.status)) // Only active districts
        }
      } catch (error) {
        console.error("Error fetching districts:", error)
        setDistrictError("Failed to load districts")
      } finally {
        setIsLoadingDistricts(false)
      }
    }

    loadDistricts()
  }, [])

  // Fetch divisions on component mount
  useEffect(() => {
    const loadDivisions = async () => {
      setIsLoadingDivisions(true)
      setDivisionError(null)

      try {
        const response = await fetchBorrowerDivisionsApi()
        if (response.status === "FETCHED" && response.data.division) {
          setDivisions(response.data.division.filter((d) => d.status)) // Only active divisions
        }
      } catch (error) {
        console.error("Error fetching divisions:", error)
        setDivisionError("Failed to load divisions")
      } finally {
        setIsLoadingDivisions(false)
      }
    }

    loadDivisions()
  }, [])

  // Fetch schools on component mount
  useEffect(() => {
    const loadSchools = async () => {
      setIsLoadingSchools(true)
      setSchoolError(null)

      try {
        const response = await fetchBorrowerSchoolsApi()
        if (response.status === "FETCHED" && response.data.schools) {
          setSchools(response.data.schools.filter((s) => s.status)) // Only active schools
        }
      } catch (error) {
        console.error("Error fetching schools:", error)
        setSchoolError("Failed to load schools")
      } finally {
        setIsLoadingSchools(false)
      }
    }

    loadSchools()
  }, [])

  // Fetch banks on component mount
  useEffect(() => {
    const loadBanks = async () => {
      setIsLoadingBanks(true)
      setBankError(null)

      try {
        const response = await fetchBanksApi()
        if (response.status === "FETCHED" && response.data.banks) {
          setBanks(response.data.banks.filter((b) => b.status === 1)) // Only active banks (status: 1)
        }
      } catch (error) {
        console.error("Error fetching banks:", error)
        setBankError("Failed to load banks")
      } finally {
        setIsLoadingBanks(false)
      }
    }

    loadBanks()
  }, [])

  // Filter classifications based on selected category
  const filteredClassifications = classifications.filter((classification) => {
    if (!formData.category) return true // Show all if no category selected
    return classification.group.id === formData.category
  })

  // Filter districts based on selected division
  const filteredDistricts = districts.filter((district) => {
    if (!formData.division) return true // Show all if no division selected
    return district.division.id === formData.division
  })

  // Filter schools based on selected district
  const filteredSchools = schools.filter((school) => {
    if (!formData.district) return true // Show all if no district selected
    return school.district.id === formData.district
  })

  // Transform filtered classifications to react-select options
  const classificationOptions: ClassificationOption[] = filteredClassifications.map((classification) => ({
    value: classification.id,
    label: `${classification.code} - ${classification.name} (${classification.group.name})`,
    data: classification,
  }))

  // Transform categories to react-select options
  const categoryOptions: CategoryOption[] = categories.map((category) => ({
    value: category.id,
    label: `${category.code} - ${category.name}`,
    data: category,
  }))

  // Transform filtered districts to react-select options
  const districtOptions: DistrictOption[] = filteredDistricts.map((district) => ({
    value: district.id,
    label: `${district.code} - ${district.name} (${district.division.name})`,
    data: district,
  }))

  // Transform divisions to react-select options
  const divisionOptions: DivisionOption[] = divisions.map((division) => ({
    value: division.id,
    label: `${division.code} - ${division.name} (${division.group.name})`,
    data: division,
  }))

  // Transform filtered schools to react-select options
  const schoolOptions: SchoolOption[] = filteredSchools.map((school) => ({
    value: school.id,
    label: `${school.code} - ${school.name} (${school.district.name})`,
    data: school,
  }))

  // Transform banks to react-select options
  const bankOptions: BankOption[] = banks.map((bank) => ({
    value: bank.id,
    label: `${bank.code} - ${bank.name} (${bank.address})`,
    data: bank,
  }))

  // Find selected options
  const selectedClassification = classificationOptions.find((option) => option.value === formData.classification)
  const selectedCategory = categoryOptions.find((option) => option.value === formData.category)
  const selectedDistrict = districtOptions.find((option) => option.value === formData.district)
  const selectedDivision = divisionOptions.find((option) => option.value === formData.division)
  const selectedSchool = schoolOptions.find((option) => option.value === formData.school)
  const selectedBank = bankOptions.find((option) => option.value === formData.bank)

  const handleInputChange = (field: keyof WorkFormData, value: string | Date | boolean | File | null | undefined) => {
    // Handle different field types appropriately
    let processedValue: any = value

    // Convert null to appropriate default for string fields
    if (value === null) {
      if (typeof formData[field] === "string") {
        processedValue = ""
      } else {
        processedValue = undefined
      }
    }

    // Handle cascading resets
    if (field === "category") {
      // Reset classification when category changes
      onUpdateFormData({
        category: processedValue as string,
        classification: "",
      })
    } else if (field === "division") {
      // Reset district and school when division changes
      onUpdateFormData({
        division: processedValue as string,
        district: "",
        school: "",
      })
    } else if (field === "district") {
      // Reset school when district changes
      onUpdateFormData({
        district: processedValue as string,
        school: "",
      })
    } else {
      // For other fields, create the update object with proper typing
      const updates: Partial<WorkFormData> = {}
      updates[field] = processedValue
      onUpdateFormData(updates)
    }
  }

  const getFieldError = (field: string) => {
    if (field === "classification") {
      return validationErrors[field] || classificationError
    }
    if (field === "category") {
      return validationErrors[field] || categoryError
    }
    if (field === "district") {
      return validationErrors[field] || districtError
    }
    if (field === "division") {
      return validationErrors[field] || divisionError
    }
    if (field === "school") {
      return validationErrors[field] || schoolError
    }
    if (field === "bank") {
      return validationErrors[field] || bankError
    }
    return validationErrors[field]
  }

  // Custom styles for react-select to match your design
  const getSelectStyles = (fieldName: string) => ({
    control: (base: any, state: any) => ({
      ...base,
      minHeight: "40px",
      borderColor: getFieldError(fieldName) ? "#ef4444" : base.borderColor,
      "&:hover": {
        borderColor: getFieldError(fieldName) ? "#ef4444" : base.borderColor,
      },
      boxShadow: state.isFocused ? "0 0 0 1px #3b82f6" : base.boxShadow,
    }),
    placeholder: (base: any) => ({
      ...base,
      color: "#9ca3af",
    }),
    singleValue: (base: any) => ({
      ...base,
      color: "#111827",
    }),
  })

  return (
    <div className="space-y-8 p-6">
      <div className="space-y-6">
        <h3 className="text-lg font-semibold border-b pb-2">Employment Information</h3>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <Label htmlFor="category">Category / Group*</Label>
            <div className="mt-2">
              <ReactSelect
                value={selectedCategory || null}
                onChange={(option) => {
                  handleInputChange("category", option?.value || "")
                }}
                options={categoryOptions}
                placeholder={isLoadingCategories ? "Loading categories..." : "Select category"}
                isLoading={isLoadingCategories}
                isSearchable
                isClearable
                styles={getSelectStyles("category")}
                className="react-select-container"
                classNamePrefix="react-select"
                noOptionsMessage={() =>
                  categories.length === 0 ? "No categories available" : "No options match your search"
                }
              />
            </div>
            {getFieldError("category") && <p className="text-sm text-red-500 mt-1">{getFieldError("category")}</p>}
          </div>
          <div>
            <Label htmlFor="classification">Classification*</Label>
            <div className="mt-2">
              <ReactSelect
                value={selectedClassification || null}
                onChange={(option) => {
                  handleInputChange("classification", option?.value || "")
                }}
                options={classificationOptions}
                placeholder={
                  isLoadingClassifications
                    ? "Loading classifications..."
                    : !formData.category
                      ? "Select category first"
                      : classificationOptions.length === 0
                        ? "No classifications for selected category"
                        : "Select classification"
                }
                isLoading={isLoadingClassifications}
                isSearchable
                isClearable
                isDisabled={!formData.category || classificationOptions.length === 0}
                styles={getSelectStyles("classification")}
                className="react-select-container"
                classNamePrefix="react-select"
                noOptionsMessage={() =>
                  !formData.category
                    ? "Please select a category first"
                    : classificationOptions.length === 0
                      ? "No classifications available for selected category"
                      : "No options match your search"
                }
              />
            </div>
            {getFieldError("classification") && (
              <p className="text-sm text-red-500 mt-1">{getFieldError("classification")}</p>
            )}
          </div>

          <div>
            <Label htmlFor="date_of_appointment">Date of Appointment*</Label>
            <Input
              type="date"
              value={formData.date_of_appointment ? format(new Date(formData.date_of_appointment), "yyyy-MM-dd") : ""}
              onChange={(e) => {
                const value = e.target.value
                const dateValue = value ? new Date(value + "T00:00:00") : undefined
                handleInputChange("date_of_appointment", dateValue)
              }}
              className={`mt-2 pr-10 relative
                [&::-webkit-calendar-picker-indicator]:absolute
                [&::-webkit-calendar-picker-indicator]:right-3
                [&::-webkit-calendar-picker-indicator]:top-1/2
                [&::-webkit-calendar-picker-indicator]:-translate-y-1/2
                [&::-webkit-calendar-picker-indicator]:cursor-pointer
                [&::-webkit-calendar-picker-indicator]:text-black
                ${getFieldError("date_of_appointment") ? "border-red-500" : ""}
              `}
              style={{ colorScheme: "light" }}
            />
            {getFieldError("date_of_appointment") && (
              <p className="text-sm text-red-500 mt-1">{getFieldError("date_of_appointment")}</p>
            )}
          </div>
        </div>
      </div>

      {/* Office Assignment */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold border-b pb-2">Office Assignment</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label htmlFor="division">Division *</Label>
            <div className="mt-2">
              <ReactSelect
                value={selectedDivision || null}
                onChange={(option) => {
                  handleInputChange("division", option?.value || "")
                }}
                options={divisionOptions}
                placeholder={isLoadingDivisions ? "Loading divisions..." : "Select division"}
                isLoading={isLoadingDivisions}
                isSearchable
                isClearable
                styles={getSelectStyles("division")}
                className="react-select-container"
                classNamePrefix="react-select"
                noOptionsMessage={() =>
                  divisions.length === 0 ? "No divisions available" : "No options match your search"
                }
              />
            </div>
            {getFieldError("division") && <p className="text-sm text-red-500 mt-1">{getFieldError("division")}</p>}
          </div>

          <div>
            <Label htmlFor="district">District *</Label>
            <div className="mt-2">
              <ReactSelect
                value={selectedDistrict || null}
                onChange={(option) => {
                  handleInputChange("district", option?.value || "")
                }}
                options={districtOptions}
                placeholder={
                  isLoadingDistricts
                    ? "Loading districts..."
                    : !formData.division
                      ? "Select division first"
                      : districtOptions.length === 0
                        ? "No districts for selected division"
                        : "Select district"
                }
                isLoading={isLoadingDistricts}
                isSearchable
                isClearable
                isDisabled={!formData.division || districtOptions.length === 0}
                styles={getSelectStyles("district")}
                className="react-select-container"
                classNamePrefix="react-select"
                noOptionsMessage={() =>
                  !formData.division
                    ? "Please select a division first"
                    : districtOptions.length === 0
                      ? "No districts available for selected division"
                      : "No options match your search"
                }
              />
            </div>
            {getFieldError("district") && <p className="text-sm text-red-500 mt-1">{getFieldError("district")}</p>}
          </div>

          <div>
            <Label htmlFor="school">School *</Label>
            <div className="mt-2">
              <ReactSelect
                value={selectedSchool || null}
                onChange={(option) => {
                  handleInputChange("school", option?.value || "")
                }}
                options={schoolOptions}
                placeholder={
                  isLoadingSchools
                    ? "Loading schools..."
                    : !formData.district
                      ? "Select district first"
                      : schoolOptions.length === 0
                        ? "No schools for selected district"
                        : "Select school"
                }
                isLoading={isLoadingSchools}
                isSearchable
                isClearable
                isDisabled={!formData.district || schoolOptions.length === 0}
                styles={getSelectStyles("school")}
                className="react-select-container"
                classNamePrefix="react-select"
                noOptionsMessage={() =>
                  !formData.district
                    ? "Please select a district first"
                    : schoolOptions.length === 0
                      ? "No schools available for selected district"
                      : "No options match your search"
                }
              />
            </div>
            {getFieldError("school") && <p className="text-sm text-red-500 mt-1">{getFieldError("school")}</p>}
          </div>

          <div>
            <Label htmlFor="deped_employee_id">DepEd Employee ID No *</Label>
            <Input
              id="deped_employee_id"
              placeholder="DepEd Employee ID"
              className={cn("mt-2", getFieldError("deped_employee_id") && "border-red-500")}
              value={formData.deped_employee_id}
              onChange={(e) => handleInputChange("deped_employee_id", e.target.value)}
            />
            {getFieldError("deped_employee_id") && (
              <p className="text-sm text-red-500 mt-1">{getFieldError("deped_employee_id")}</p>
            )}
          </div>
        </div>
      </div>

      {/* Supervisor and Authority */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold border-b pb-2">Supervisor and Authority</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label htmlFor="pricipal_name">Name of Principal *</Label>
            <Input
              id="pricipal_name"
              placeholder="Principal Name"
              className={cn("mt-2", getFieldError("pricipal_name") && "border-red-500")}
              value={formData.pricipal_name}
              onChange={(e) => handleInputChange("pricipal_name", e.target.value)}
            />
            {getFieldError("pricipal_name") && (
              <p className="text-sm text-red-500 mt-1">{getFieldError("pricipal_name")}</p>
            )}
          </div>

          <div>
            <Label htmlFor="supervisor_name">Name of Supervisor *</Label>
            <Input
              id="supervisor_name"
              placeholder="Supervisor Name"
              className={cn("mt-2", getFieldError("supervisor_name") && "border-red-500")}
              value={formData.supervisor_name}
              onChange={(e) => handleInputChange("supervisor_name", e.target.value)}
            />
            {getFieldError("supervisor_name") && (
              <p className="text-sm text-red-500 mt-1">{getFieldError("supervisor_name")}</p>
            )}
          </div>
        </div>
      </div>

      {/* Professional License Information */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold border-b pb-2">Professional License Information</h3>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <Label htmlFor="prc_id_no">PRC ID No *</Label>
            <Input
              id="prc_id_no"
              placeholder="PRC ID Number"
              className={cn("mt-2", getFieldError("prc_id_no") && "border-red-500")}
              value={formData.prc_id_no}
              onChange={(e) => handleInputChange("prc_id_no", e.target.value)}
            />
            {getFieldError("prc_id_no") && <p className="text-sm text-red-500 mt-1">{getFieldError("prc_id_no")}</p>}
          </div>

          <div>
            <Label htmlFor="prc_registration_no">PRC Registration No *</Label>
            <Input
              id="prc_registration_no"
              placeholder="PRC Registration Number"
              className={cn("mt-2", getFieldError("prc_registration_no") && "border-red-500")}
              value={formData.prc_registration_no}
              onChange={(e) => handleInputChange("prc_registration_no", e.target.value)}
            />
            {getFieldError("prc_registration_no") && (
              <p className="text-sm text-red-500 mt-1">{getFieldError("prc_registration_no")}</p>
            )}
          </div>

          <div>
            <Label htmlFor="prc_place_issued">PRC Place Issued *</Label>
            <Input
              id="prc_place_issued"
              placeholder="Place where PRC was issued"
              className={cn("mt-2", getFieldError("prc_place_issued") && "border-red-500")}
              value={formData.prc_place_issued}
              onChange={(e) => handleInputChange("prc_place_issued", e.target.value)}
            />
            {getFieldError("prc_place_issued") && (
              <p className="text-sm text-red-500 mt-1">{getFieldError("prc_place_issued")}</p>
            )}
          </div>
        </div>
      </div>

      {/* Government Valid ID */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold border-b pb-2">Government Valid ID</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label htmlFor="gov_valid_id_type">Government Valid ID Type *</Label>
            <Select
              value={formData.gov_valid_id_type || ""}
              onValueChange={(value) => handleInputChange("gov_valid_id_type", value)}
            >
              <SelectTrigger className={cn("w-full mt-2", getFieldError("gov_valid_id_type") && "border-red-500")}>
                <SelectValue placeholder="Select ID type..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="philippine passport">Philippine Passport</SelectItem>
                <SelectItem value="drivers license">Driver's License</SelectItem>
                <SelectItem value="umid">UMID</SelectItem>
                <SelectItem value="prc id">PRC ID</SelectItem>
                <SelectItem value="postal id">Postal ID</SelectItem>
                <SelectItem value="sss id">SSS ID</SelectItem>
                <SelectItem value="gsis ecard">GSIS eCard</SelectItem>
                <SelectItem value="voters id">Voter's ID</SelectItem>
                <SelectItem value="philhealth id">PhilHealth ID</SelectItem>
                <SelectItem value="tin id">TIN ID</SelectItem>
                <SelectItem value="senior citizen id">Senior Citizen ID</SelectItem>
                <SelectItem value="pwd id">PWD ID</SelectItem>
                <SelectItem value="national id">National ID</SelectItem>
                <SelectItem value="ofw id">OFW ID</SelectItem>
                <SelectItem value="barangay clearance">Barangay Clearance</SelectItem>
                <SelectItem value="nbi clearance">NBI Clearance</SelectItem>
                <SelectItem value="police clearance">Police Clearance</SelectItem>
                <SelectItem value="firearms license">Firearms License</SelectItem>
                <SelectItem value="acr i-card">ACR I-Card</SelectItem>
                <SelectItem value="ibp id">IBP ID</SelectItem>
                <SelectItem value="seaman book">Seaman's Book</SelectItem>
                <SelectItem value="indigenous peoples id">Indigenous Peoples ID</SelectItem>
              </SelectContent>
            </Select>

            {getFieldError("gov_valid_id_type") && (
              <p className="text-sm text-red-500 mt-1">{getFieldError("gov_valid_id_type")}</p>
            )}
          </div>

          <div>
            <Label htmlFor="valid_id_no">Valid ID No *</Label>
            <Input
              id="valid_id_no"
              placeholder="Valid ID Number"
              className={cn("mt-2", getFieldError("valid_id_no") && "border-red-500")}
              value={formData.valid_id_no}
              onChange={(e) => handleInputChange("valid_id_no", e.target.value)}
            />
            {getFieldError("valid_id_no") && (
              <p className="text-sm text-red-500 mt-1">{getFieldError("valid_id_no")}</p>
            )}
          </div>

          <div>
            <Label htmlFor="gov_place_issued">Place Issued *</Label>
            <Input
              id="gov_place_issued"
              placeholder="Place where ID was issued"
              className={cn("mt-2", getFieldError("gov_place_issued") && "border-red-500")}
              value={formData.gov_place_issued}
              onChange={(e) => handleInputChange("gov_place_issued", e.target.value)}
            />
            {getFieldError("gov_place_issued") && (
              <p className="text-sm text-red-500 mt-1">{getFieldError("gov_place_issued")}</p>
            )}
          </div>

          <div>
            <Label htmlFor="gov_date_issued">Date Issued *</Label>
            <Input
              type="date"
              value={formData.gov_date_issued ? format(new Date(formData.gov_date_issued), "yyyy-MM-dd") : ""}
              onChange={(e) => {
                const value = e.target.value
                const dateValue = value ? new Date(value + "T00:00:00") : undefined
                handleInputChange("gov_date_issued", dateValue)
              }}
              className={`mt-2 pr-10 relative
                [&::-webkit-calendar-picker-indicator]:absolute
                [&::-webkit-calendar-picker-indicator]:right-3
                [&::-webkit-calendar-picker-indicator]:top-1/2
                [&::-webkit-calendar-picker-indicator]:-translate-y-1/2
                [&::-webkit-calendar-picker-indicator]:cursor-pointer
                [&::-webkit-calendar-picker-indicator]:text-black
                ${getFieldError("gov_date_issued") ? "border-red-500" : ""}
              `}
              style={{ colorScheme: "light" }}
            />
            {getFieldError("gov_date_issued") && (
              <p className="text-sm text-red-500 mt-1">{getFieldError("gov_date_issued")}</p>
            )}
          </div>

          <div>
            <Label htmlFor="gov_expiration_date">Expiration Date</Label>
            <Input
              type="date"
              value={formData.gov_expiration_date ? format(new Date(formData.gov_expiration_date), "yyyy-MM-dd") : ""}
              onChange={(e) => {
                const value = e.target.value
                const dateValue = value ? new Date(value + "T00:00:00") : undefined
                handleInputChange("gov_expiration_date", dateValue)
              }}
              className={`mt-2 pr-10 relative
                [&::-webkit-calendar-picker-indicator]:absolute
                [&::-webkit-calendar-picker-indicator]:right-3
                [&::-webkit-calendar-picker-indicator]:top-1/2
                [&::-webkit-calendar-picker-indicator]:-translate-y-1/2
                [&::-webkit-calendar-picker-indicator]:cursor-pointer
                [&::-webkit-calendar-picker-indicator]:text-black
                ${getFieldError("gov_expiration_date") ? "border-red-500" : ""}
              `}
              style={{ colorScheme: "light" }}
            />
            {getFieldError("gov_expiration_date") && (
              <p className="text-sm text-red-500 mt-1">{getFieldError("gov_expiration_date")}</p>
            )}
          </div>
        </div>
      </div>

      {/* ATM Information */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold border-b pb-2">ATM Information</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label htmlFor="bank">Bank *</Label>
            <div className="mt-2">
              <ReactSelect
                value={selectedBank || null}
                onChange={(option) => {
                  handleInputChange("bank", option?.value || "")
                }}
                options={bankOptions}
                placeholder={isLoadingBanks ? "Loading banks..." : "Select bank"}
                isLoading={isLoadingBanks}
                isSearchable
                isClearable
                styles={getSelectStyles("bank")}
                className="react-select-container"
                classNamePrefix="react-select"
                noOptionsMessage={() => (banks.length === 0 ? "No banks available" : "No options match your search")}
              />
            </div>
            {getFieldError("bank") && <p className="text-sm text-red-500 mt-1">{getFieldError("bank")}</p>}
          </div>

          <div>
            <Label htmlFor="atm_account_number">ATM Account Number *</Label>
            <Input
              id="atm_account_number"
              placeholder="Account Number"
              className={cn("mt-2", getFieldError("atm_account_number") && "border-red-500")}
              value={formData.atm_account_number}
              onChange={(e) => handleInputChange("atm_account_number", e.target.value)}
            />
            {getFieldError("atm_account_number") && (
              <p className="text-sm text-red-500 mt-1">{getFieldError("atm_account_number")}</p>
            )}
          </div>

          <div>
            <Label htmlFor="atm_card_number">ATM Card Number *</Label>
            <Input
              id="atm_card_number"
              placeholder="Card Number"
              className={cn("mt-2", getFieldError("atm_card_number") && "border-red-500")}
              value={formData.atm_card_number}
              onChange={(e) => handleInputChange("atm_card_number", e.target.value)}
            />
            {getFieldError("atm_card_number") && (
              <p className="text-sm text-red-500 mt-1">{getFieldError("atm_card_number")}</p>
            )}
          </div>

          <div>
            <Label htmlFor="atm_expiration_date">ATM Expiration Date *</Label>
            <Input
              type="date"
              value={formData.atm_expiration_date ? format(new Date(formData.atm_expiration_date), "yyyy-MM-dd") : ""}
              onChange={(e) => {
                const value = e.target.value
                const dateValue = value ? new Date(value + "T00:00:00") : undefined
                handleInputChange("atm_expiration_date", dateValue)
              }}
              className={`mt-2 pr-10 relative
                [&::-webkit-calendar-picker-indicator]:absolute
                [&::-webkit-calendar-picker-indicator]:right-3
                [&::-webkit-calendar-picker-indicator]:top-1/2
                [&::-webkit-calendar-picker-indicator]:-translate-y-1/2
                [&::-webkit-calendar-picker-indicator]:cursor-pointer
                [&::-webkit-calendar-picker-indicator]:text-black
                ${getFieldError("atm_expiration_date") ? "border-red-500" : ""}
              `}
              style={{ colorScheme: "light" }}
            />
            {getFieldError("atm_expiration_date") && (
              <p className="text-sm text-red-500 mt-1">{getFieldError("atm_expiration_date")}</p>
            )}
          </div>

          <div>
            <Label htmlFor="atm_bank_branch">ATM Bank Branch *</Label>
            <Input
              id="atm_bank_branch"
              placeholder="Bank Branch"
              className={cn("mt-2", getFieldError("atm_bank_branch") && "border-red-500")}
              value={formData.atm_bank_branch}
              onChange={(e) => handleInputChange("atm_bank_branch", e.target.value)}
            />
            {getFieldError("atm_bank_branch") && (
              <p className="text-sm text-red-500 mt-1">{getFieldError("atm_bank_branch")}</p>
            )}
          </div>
        </div>
      </div>

      {/* UMID Information */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold border-b pb-2">UMID Information</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label htmlFor="umid_type">UMID Type</Label>
            <Select value={formData.umid_type || ""} onValueChange={(value) => handleInputChange("umid_type", value)}>
              <SelectTrigger className={cn("w-full mt-2", getFieldError("umid_type") && "border-red-500")}>
                <SelectValue placeholder="Select UMID type..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="landbank">Landbank</SelectItem>
                <SelectItem value="union_bank">Union Bank</SelectItem>
              </SelectContent>
            </Select>
            {getFieldError("umid_type") && <p className="text-sm text-red-500 mt-1">{getFieldError("umid_type")}</p>}
          </div>

          <div>
            <Label htmlFor="umid_card_no">UMID Card No</Label>
            <Input
              id="umid_card_no"
              placeholder="UMID Card Number"
              className={cn("mt-2", getFieldError("umid_card_no") && "border-red-500")}
              value={formData.umid_card_no}
              onChange={(e) => handleInputChange("umid_card_no", e.target.value)}
            />
            {getFieldError("umid_card_no") && (
              <p className="text-sm text-red-500 mt-1">{getFieldError("umid_card_no")}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
