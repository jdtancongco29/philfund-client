import MainLayout from '@/components/layout/MainLayout'
import AccountsSetupForm from './AccountsSetupForm'
import { ModulePermissionProps } from '../../Security/UserPermissions/Service/PermissionsTypes'

export const DefaultAccountSetupPage: React.FC<ModulePermissionProps> = ({
  name,
  canAdd,
}) => {
  return (
    <MainLayout module={name}>
        <AccountsSetupForm
          canAdd={canAdd}
        />
    </MainLayout>
  )
}

export default DefaultAccountSetupPage
