import type React from "react"
import MainLayout from "@/components/layout/MainLayout"
import { CardCustodyLogTable } from "./CardCustodyLogTable"
import type { ModulePermissionProps } from "../../MaintenanceAndSecurity/Security/UserPermissions/Service/PermissionsTypes"

export const CardCustodyLog: React.FC<ModulePermissionProps> = ({ name, canAdd, canEdit, canDelete, canExport }) => {
  return (
    <MainLayout module={name}>
      <CardCustodyLogTable canAdd={canAdd} canEdit={canEdit} canDelete={canDelete} canExport={canExport} />
    </MainLayout>
  )
}

export default CardCustodyLog
