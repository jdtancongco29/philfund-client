import MainLayout from '@/components/layout/MainLayout'
import { ApprovalTable } from './ApprovalTable'
import { ModulePermissionProps } from '../../Security/UserPermissions/Service/PermissionsTypes'

export const ApprovalPage: React.FC<ModulePermissionProps> = ({
  name,
}) => {
  return (
    <MainLayout module={name}>
        <ApprovalTable />
    </MainLayout>
  )
}

export default ApprovalPage
