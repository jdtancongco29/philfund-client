import MainLayout from '@/components/layout/MainLayout'
import GeneralJournalTable from './GeneralJournalTable'
import { ModulePermissionProps } from '../../Security/UserPermissions/Service/PermissionsTypes'

export const GeneralJournalpage: React.FC<ModulePermissionProps> = ({
  name,
  canAdd,
  canExport,
}) => {
  return (
    <MainLayout module={name}>
      <GeneralJournalTable
        canAdd={canAdd}
        canExport={canExport}
      />
    </MainLayout>
  )
}

export default GeneralJournalpage;
