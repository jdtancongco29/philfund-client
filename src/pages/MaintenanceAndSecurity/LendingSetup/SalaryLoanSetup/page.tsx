import MainLayout from "@/components/layout/MainLayout"
import { SalaryLoanTable } from "./SalaryLoanTable"
import { ModulePermissionProps } from '../../Security/UserPermissions/Service/PermissionsTypes'

export const SalaryLoanSetupPage: React.FC<ModulePermissionProps> = ({
  name,
  canAdd,
  canEdit,
  canDelete,
  canExport,
}) => {
  return (
    <MainLayout module={name}>
      <SalaryLoanTable 
        canAdd={canAdd}
        canEdit={canEdit}
        canDelete={canDelete}
        canExport={canExport}
      />
    </MainLayout>
  )
}

export default SalaryLoanSetupPage
