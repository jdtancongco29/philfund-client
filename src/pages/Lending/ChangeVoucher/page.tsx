import type React from "react"
import MainLayout from "@/components/layout/MainLayout"
import type { ModulePermissionProps } from "@/pages/MaintenanceAndSecurity/Security/UserPermissions/Service/PermissionsTypes"
import { ChangeVoucher } from "./ChangeVoucher"

export const ChangeVoucherPage: React.FC<ModulePermissionProps> = ({ name }) => {
  return (
    <MainLayout module={name}>
      <ChangeVoucher />
    </MainLayout>
  )
}

export default ChangeVoucherPage
