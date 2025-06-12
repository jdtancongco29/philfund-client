import type React from "react"
import MainLayout from "@/components/layout/MainLayout"
import { UmidExpiryTable } from "./UmidExpiryTable"
import type { ModulePermissionProps } from "@/pages/MaintenanceAndSecurity/Security/UserPermissions/Service/PermissionsTypes"

export const UmidExpiryPage: React.FC<ModulePermissionProps> = ({ name, canAdd, canEdit, canDelete, canExport }) => {
  return (
    <MainLayout module={name || "UMID Expiry"}>
      <UmidExpiryTable canAdd={canAdd} canEdit={canEdit} canDelete={canDelete} canExport={canExport} />
    </MainLayout>
  )
}

export default UmidExpiryPage
