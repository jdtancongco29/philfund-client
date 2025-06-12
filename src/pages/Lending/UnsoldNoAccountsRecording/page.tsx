import type React from "react"
import MainLayout from "@/components/layout/MainLayout"
import { UnsoldNoAccountsTable } from "./UnsoldNoAccountsTable"
import type { ModulePermissionProps } from "../../MaintenanceAndSecurity/Security/UserPermissions/Service/PermissionsTypes"

export const UnsoldNoAccountsRecording: React.FC<ModulePermissionProps> = ({
  name,
  canAdd,
  canEdit,
  canDelete,
  canExport,
}) => {
  return (
    <MainLayout module={name}>
      <UnsoldNoAccountsTable canAdd={canAdd} canEdit={canEdit} canDelete={canDelete} canExport={canExport} />
    </MainLayout>
  )
}

export default UnsoldNoAccountsRecording
