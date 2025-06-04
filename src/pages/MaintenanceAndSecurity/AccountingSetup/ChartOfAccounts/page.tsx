import MainLayout from '@/components/layout/MainLayout'
import ChartOfAccounts from './ChartOfAccounts'
import { ModulePermissionProps } from '../../Security/UserPermissions/Service/PermissionsTypes'

export const ChartOfAccountsPage: React.FC<ModulePermissionProps> = ({
  name,
  canAdd,
  canEdit,
  canDelete,
  canExport,
}) => {
  return (
    <MainLayout module={name}>
        <ChartOfAccounts
          canAdd={canAdd}
          canEdit={canEdit}
          canDelete={canDelete}
          canExport={canExport}
        />
    </MainLayout>
  )
}

export default ChartOfAccountsPage
