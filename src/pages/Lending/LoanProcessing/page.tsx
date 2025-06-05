import MainLayout from '@/components/layout/MainLayout'
import { ModulePermissionProps } from '@/pages/MaintenanceAndSecurity/Security/UserPermissions/Service/PermissionsTypes'
import { SalaryLoanProcessing } from './SalaryLoanProcessing'

export const LoanProcessing: React.FC<ModulePermissionProps> = ({
  name,
}) => {
  return (
    <MainLayout module={name}>
      <SalaryLoanProcessing />
    </MainLayout>
  )
}

export default LoanProcessing
