import type React from "react"
import MainLayout from "@/components/layout/MainLayout"
import type { ModulePermissionProps } from "@/pages/MaintenanceAndSecurity/Security/UserPermissions/Service/PermissionsTypes"
import { BonusLoanProcessing } from "./BonusLoanProcessing"

export const BonusLoanPage: React.FC<ModulePermissionProps> = ({ name }) => {
  return (
    <MainLayout module={name}>
      <BonusLoanProcessing />
    </MainLayout>
  )
}

export default BonusLoanPage
