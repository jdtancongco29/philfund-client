import type React from "react"
import MainLayout from "@/components/layout/MainLayout"
import { SalaryAndCashAdvancePaymentTable } from "./SalaryAndCashAdvancePaymentTable"
import type { ModulePermissionProps } from "../../MaintenanceAndSecurity/Security/UserPermissions/Service/PermissionsTypes"

export const SalaryAndCashAdvancePayment: React.FC<ModulePermissionProps> = ({
    name,
    canAdd,
    canEdit,
    canDelete,
    canExport,
}) => {
    return (
        <MainLayout module={name}>
            <SalaryAndCashAdvancePaymentTable canAdd={canAdd} canEdit={canEdit} canDelete={canDelete} canExport={canExport} />
        </MainLayout>
    )
}

export default SalaryAndCashAdvancePayment
