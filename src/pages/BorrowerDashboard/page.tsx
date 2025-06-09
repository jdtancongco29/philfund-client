
import MainLayout from '@/components/layout/MainLayout'
import BorrowerDashboard from './BorrowerDashbaord'
import { ModulePermissionProps } from '../MaintenanceAndSecurity/Security/UserPermissions/Service/PermissionsTypes'

  export const GeneralJoBorrowerDashboardPageurnalpage: React.FC<ModulePermissionProps> = ({
    name,
    canAdd,
    canExport,
  }) => {
  return (

     <MainLayout module={name}>
          <BorrowerDashboard
            canAdd={canAdd}
            canExport={canExport}
          />
        </MainLayout>
  )
}

export default GeneralJoBorrowerDashboardPageurnalpage
