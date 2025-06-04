import MainLayout from "@/components/layout/MainLayout"
import { DivisionTable } from "./DivisionTable"
import { ModulePermissionProps } from '../../Security/UserPermissions/Service/PermissionsTypes'

export const DivisionSetupPage: React.FC<ModulePermissionProps> = ({
  name,
  canAdd,
  canEdit,
  canDelete,
  canExport,
}) => {
  return (
    <MainLayout module={name}>
      <DivisionTable
        canAdd={canAdd}
        canEdit={canEdit}
        canDelete={canDelete}
        canExport={canExport}
      />
    </MainLayout>
  )
}

export default DivisionSetupPage
