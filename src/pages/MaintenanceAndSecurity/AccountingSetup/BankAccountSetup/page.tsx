import MainLayout from '@/components/layout/MainLayout'
import BankAccountsTable from './BankAccountList'
import { ModulePermissionProps } from '../../Security/UserPermissions/Service/PermissionsTypes'

export const BankAccountSetupPage: React.FC<ModulePermissionProps> = ({
  name,
  canAdd,
  canEdit,
  canDelete,
  canExport,
}) => {
  return (
    <MainLayout module={name}>
      <BankAccountsTable
        canAdd={canAdd}
        canEdit={canEdit}
        canDelete={canDelete}
        canExport={canExport}
      />
    </MainLayout>
  )
}

export default BankAccountSetupPage
