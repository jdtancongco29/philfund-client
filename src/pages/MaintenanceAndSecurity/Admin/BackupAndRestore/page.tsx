import MainLayout from '@/components/layout/MainLayout'
import { SystemBackupTable } from './SystemBackupTable'
import { ModulePermissionProps } from '../../Security/UserPermissions/Service/PermissionsTypes'

export const BackupAndRestorePage: React.FC<ModulePermissionProps> = ({
  name,
}) => {
  return (
    <MainLayout module={name}>
        <SystemBackupTable />
    </MainLayout>
  )
}

export default BackupAndRestorePage
