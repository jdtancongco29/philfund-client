import type React from "react"
import MainLayout from "@/components/layout/MainLayout"
import { AtmExpiryTable } from "./AtmExpiryTable"
import type { ModulePermissionProps } from "@/pages/MaintenanceAndSecurity/Security/UserPermissions/Service/PermissionsTypes"

export const AtmExpiryPage: React.FC<ModulePermissionProps> = ({ name, canAdd, canEdit, canDelete, canExport }) => {
  return (
    <MainLayout module={name || "ATM Expiry"}>
      <AtmExpiryTable canAdd={canAdd} canEdit={canEdit} canDelete={canDelete} canExport={canExport} />
    </MainLayout>
  )
}

export default AtmExpiryPage
