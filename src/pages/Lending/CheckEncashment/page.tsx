import type React from "react"
import MainLayout from "@/components/layout/MainLayout"
import { CheckEncashmentTable } from "./CheckEncashmentTable"
import type { ModulePermissionProps } from "../../MaintenanceAndSecurity/Security/UserPermissions/Service/PermissionsTypes"

export const CheckEncashment: React.FC<ModulePermissionProps> = ({ name, canAdd, canEdit, canDelete, canExport }) => {
  return (
    <MainLayout module={name}>
      <CheckEncashmentTable canAdd={canAdd} canEdit={canEdit} canDelete={canDelete} canExport={canExport} />
    </MainLayout>
  )
}

export default CheckEncashment
