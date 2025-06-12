import type React from "react"
import MainLayout from "@/components/layout/MainLayout"
import type { ModulePermissionProps } from "@/pages/MaintenanceAndSecurity/Security/UserPermissions/Service/PermissionsTypes"
import { LoanPayOffProcessing } from "./LoanPayOff"

export const LoanPayOffPage: React.FC<ModulePermissionProps> = ({ name }) => {
  return (
    <MainLayout module={name}>
      <LoanPayOffProcessing />
    </MainLayout>
  )
}

export default LoanPayOffPage
