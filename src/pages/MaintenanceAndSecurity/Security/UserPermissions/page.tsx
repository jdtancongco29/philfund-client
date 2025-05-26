// import ComingSoon from '@/components/coming-soon'
import MainLayout from '@/components/layout/MainLayout'
// import { PermissionsTable } from './PermissionsTable'
// import { PermissionsTableV2 } from './Table'
import { PermissionsTable } from './PermissionsTable'

function UserPermissionsPage() {
  return (
    <MainLayout>
        <PermissionsTable />
        {/* <PermissionsTableV2 /> */}
    </MainLayout>
  )
}

export default UserPermissionsPage
