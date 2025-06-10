import type React from "react"
import MainLayout from "@/components/layout/MainLayout"
import { BonusLoanPaymentTable } from "./BonusLoanPaymentTable"
import type { ModulePermissionProps } from "../../MaintenanceAndSecurity/Security/UserPermissions/Service/PermissionsTypes"

export const BonusLoanPaymentPage: React.FC<ModulePermissionProps> = ({
    name,
    canAdd,
    canEdit,
    canDelete,
    canExport,
}) => {
    return (
        <MainLayout module={name}>
            <BonusLoanPaymentTable canAdd={canAdd} canEdit={canEdit} canDelete={canDelete} canExport={canExport} />
        </MainLayout>
    )
}

export default BonusLoanPaymentPage
