import MainLayout from '@/components/layout/MainLayout'
import AccountingEntriesTable from './AccountingEntriesTable'
import { ModulePermissionProps } from '../../Security/UserPermissions/Service/PermissionsTypes'

export const AccountingEntriesDefaultspage: React.FC<ModulePermissionProps> = ({
  name,
  canAdd,
  canExport,
}) => {
  return (
    <MainLayout module={name}>
        <AccountingEntriesTable
          canAdd={canAdd}
          canExport={canExport}
        />
    </MainLayout>
  )
}

export default AccountingEntriesDefaultspage
