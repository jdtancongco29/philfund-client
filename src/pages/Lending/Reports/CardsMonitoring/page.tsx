import type React from "react"
import MainLayout from "@/components/layout/MainLayout"
import { CardsMonitoringTable } from "./CardsMonitoringTable"
import type { ModulePermissionProps } from "@/pages/MaintenanceAndSecurity/Security/UserPermissions/Service/PermissionsTypes"

export const CardsMonitoringPage: React.FC<ModulePermissionProps> = ({ name, canAdd, canEdit, canDelete, canExport }) => {
  return (
    <MainLayout module={name || "Cards Monitoring"}>
      <CardsMonitoringTable canAdd={canAdd} canEdit={canEdit} canDelete={canDelete} canExport={canExport} />
    </MainLayout>
  )
}

export default CardsMonitoringPage
