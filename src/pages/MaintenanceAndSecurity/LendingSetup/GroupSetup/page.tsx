import MainLayout from '@/components/layout/MainLayout'
import { BorrowerGroupTable } from './BorrowerGroupTable'
import { ModulePermissionProps } from '../../Security/UserPermissions/Service/PermissionsTypes'

export const GroupSetupPage: React.FC<ModulePermissionProps> = ({
  name,
  canAdd,
  canEdit,
  canDelete,
  canExport,
}) => {
  return (
    <MainLayout module={name}>
      <BorrowerGroupTable
        canAdd={canAdd}
        canEdit={canEdit}
        canDelete={canDelete}
        canExport={canExport}
      />
    </MainLayout>
  )
}

export default GroupSetupPage
