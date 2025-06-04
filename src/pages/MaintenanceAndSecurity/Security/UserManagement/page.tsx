import MainLayout from '@/components/layout/MainLayout'
import { UserManagementTable } from './UserManagementTable'
import { ModulePermissionProps } from '../../Security/UserPermissions/Service/PermissionsTypes'

export const UserManagementPage: React.FC<ModulePermissionProps> = ({
  name,
  canAdd,
  canEdit,
  canDelete,
  canExport,
}) => {
  return (
    <MainLayout module={name}>
      <UserManagementTable
        canAdd={canAdd}
        canEdit={canEdit}
        canDelete={canDelete}
        canExport={canExport} 
      />
    </MainLayout>
  )
}

export default UserManagementPage
