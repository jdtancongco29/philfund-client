import MainLayout from '@/components/layout/MainLayout'
import { PermissionsTable } from './PermissionsTable'
import { ModulePermissionProps } from './Service/PermissionsTypes'

export const UserPermissionsPage: React.FC<ModulePermissionProps> = ({
  name
}) => {
  return (
    <MainLayout module={name}>
        <PermissionsTable />
    </MainLayout>
  )
}

export default UserPermissionsPage
