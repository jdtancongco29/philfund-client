
import MainLayout from '@/components/layout/MainLayout'
import BorrowersMasterList from './BorrowerMasterList'
import { ModulePermissionProps } from '@/pages/MaintenanceAndSecurity/Security/UserPermissions/Service/PermissionsTypes'

export const LendingPage: React.FC<ModulePermissionProps> = ({
  name,
  canAdd,
  canEdit,
  canDelete,
  canExport,
}) => {
  return (
    <MainLayout module={name}>
        <BorrowersMasterList
          canAdd={canAdd}
          canEdit={canEdit}
          canDelete={canDelete}
          canExport={canExport}
        />
    </MainLayout>
  )
}

export default LendingPage
