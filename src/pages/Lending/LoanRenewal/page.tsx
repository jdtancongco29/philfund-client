import type React from "react"
import MainLayout from "@/components/layout/MainLayout"
import type { ModulePermissionProps } from "@/pages/MaintenanceAndSecurity/Security/UserPermissions/Service/PermissionsTypes"
import { LoanRenewal } from "./LoanRenewal"

export const LoanRenewalPage: React.FC<ModulePermissionProps> = ({ name }) => {
  return (
    <MainLayout module={name}>
      <LoanRenewal />
    </MainLayout>
  )
}

export default LoanRenewalPage
