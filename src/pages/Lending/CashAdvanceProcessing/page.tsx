import MainLayout from '@/components/layout/MainLayout'
import ComingSoon from '@/components/coming-soon'
import { ModulePermissionProps } from '@/pages/MaintenanceAndSecurity/Security/UserPermissions/Service/PermissionsTypes'

export const CashAdvanceProcessing: React.FC<ModulePermissionProps> = ({
  name,
}) => {
  return (
    <MainLayout module={name}>
      <ComingSoon />
    </MainLayout>
  )
}

export default CashAdvanceProcessing
