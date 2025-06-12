import type React from "react"
import MainLayout from "@/components/layout/MainLayout"
import { SalaryLoanReleaseTable } from "./SalaryLoanReleaseTable"
import type { ModulePermissionProps } from "@/pages/MaintenanceAndSecurity/Security/UserPermissions/Service/PermissionsTypes"

export const SalaryLoanReleasePage: React.FC<ModulePermissionProps> = ({
  name,
  canAdd,
  canEdit,
  canDelete,
  canExport,
}) => {
  return (
    <MainLayout module={name}>
      <SalaryLoanReleaseTable canAdd={canAdd} canEdit={canEdit} canDelete={canDelete} canExport={canExport} />
    </MainLayout>
  )
}

export default SalaryLoanReleasePage
