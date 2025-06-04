import MainLayout from '@/components/layout/MainLayout'
import ReferenceManagement from './ReferenceManagement'
import { ModulePermissionProps } from '../../Security/UserPermissions/Service/PermissionsTypes'

export const ReferenceSettingsPage: React.FC<ModulePermissionProps> = ({
  name,
  canAdd,
  canEdit,
  canDelete,
}) => {
  return (
    <MainLayout module={name}>
        <ReferenceManagement
          canAdd={canAdd}
          canEdit={canEdit}
          canDelete={canDelete}
        />
    </MainLayout>
  )
}

export default ReferenceSettingsPage
