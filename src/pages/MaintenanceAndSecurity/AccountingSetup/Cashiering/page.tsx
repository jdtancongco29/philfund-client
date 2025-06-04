import MainLayout from '@/components/layout/MainLayout'
import CashieringAccountsForm from './CashieringAccountsForm'
import { ModulePermissionProps } from '../../Security/UserPermissions/Service/PermissionsTypes'

export const CashieringPage: React.FC<ModulePermissionProps> = ({
  name,
}) => {
  return (
    <MainLayout module={name}>
      <CashieringAccountsForm />
    </MainLayout>
  )
}

export default CashieringPage
