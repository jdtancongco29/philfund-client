import MainLayout from "@/components/layout/MainLayout"
import { DistrictTable } from "./DistrictTable"
import { ModulePermissionProps } from '../../Security/UserPermissions/Service/PermissionsTypes'

export const DistrictSetupPage: React.FC<ModulePermissionProps> = ({
  name,
  canAdd,
  canEdit,
  canDelete,
  canExport,
}) => {
  return (
    <MainLayout module={name}>
      <DistrictTable
        canAdd={canAdd}
        canEdit={canEdit}
        canDelete={canDelete}
        canExport={canExport}
      />
    </MainLayout>
  )
}

export default DistrictSetupPage
