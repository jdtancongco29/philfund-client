import MainLayout from '@/components/layout/MainLayout'
import { BranchSetupTable } from './BranchSetupTable'
import { ModulePermissionProps } from '../../Security/UserPermissions/Service/PermissionsTypes'

export const BranchSetup: React.FC<ModulePermissionProps> = ({
  name,
  canAdd,
  canEdit,
  canDelete,
  canExport,
}) => {
  return (
    <MainLayout module={name}>
      <BranchSetupTable
        canAdd={canAdd}
        canEdit={canEdit}
        canDelete={canDelete}
        canExport={canExport}
      />
    </MainLayout>
  )
}

export default BranchSetup

