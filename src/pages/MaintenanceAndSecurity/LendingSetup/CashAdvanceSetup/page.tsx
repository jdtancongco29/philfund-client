import MainLayout from "@/components/layout/MainLayout"
import { CashAdvanceTable } from "./CashAdvanceTable"
import { ModulePermissionProps } from '../../Security/UserPermissions/Service/PermissionsTypes'

export const BonusLoanCASetup: React.FC<ModulePermissionProps> = ({
  name,
  canAdd,
  canEdit,
  canDelete,
  canExport,
}) => {
  return (
    <MainLayout module={name}>
      <CashAdvanceTable 
        canAdd={canAdd}
        canEdit={canEdit}
        canDelete={canDelete}
        canExport={canExport}
      />
    </MainLayout>
  )
}

export default BonusLoanCASetup
