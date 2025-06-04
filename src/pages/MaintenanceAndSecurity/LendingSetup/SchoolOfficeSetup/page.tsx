import MainLayout from "@/components/layout/MainLayout"
import { SchoolOfficeTable } from "./SchoolOfficeTable"
import { ModulePermissionProps } from '../../Security/UserPermissions/Service/PermissionsTypes'

export const SchoolOfficeSetupPage: React.FC<ModulePermissionProps> = ({
  name,
  canAdd,
  canEdit,
  canDelete,
  canExport,
}) => {
  return (
    <MainLayout module={name}>
      <SchoolOfficeTable
        canAdd={canAdd}
        canEdit={canEdit}
        canDelete={canDelete}
        canExport={canExport}
      />
    </MainLayout>
  )
}

export default SchoolOfficeSetupPage
