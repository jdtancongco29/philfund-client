import MainLayout from '@/components/layout/MainLayout'
import { ActivityLogTable } from './ActivityLogTable'
import { ModulePermissionProps } from '../../Security/UserPermissions/Service/PermissionsTypes'

export const ActivityLogsPage: React.FC<ModulePermissionProps> = ({
  name,
}) => {
  return (
    <MainLayout module={name}>
        <ActivityLogTable />
    </MainLayout>
  )
}

export default ActivityLogsPage
