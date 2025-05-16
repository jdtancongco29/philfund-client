// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import LoginPage from "./pages/Auth/Login"
import Dashboard from "./pages/Home/page"
import ForgotPasswordPage from "./pages/Auth/ForgotPassword"
import ProtectedRoute from "./components/ProtectedRoute"
import PublicRoute from "./components/PublicRoute"
import BranchSetup from "./pages/MaintenanceAndSecurity/GeneralSetup/BranchSetup/page"
import UserManagementPage from "./pages/MaintenanceAndSecurity/Security/UserManagement/page"
import BorrowerDashboardPage from "./pages/BorrowerDashboard/page"
import LendingPage from "./pages/Lending/page"
import AccountingPage from "./pages/Accounting/page"
import ReferenceSettingsPage from "./pages/MaintenanceAndSecurity/AccountingSetup/ReferenceSettings/page"
import CashieringPage from "./pages/MaintenanceAndSecurity/AccountingSetup/Cashiering/page"
import BankAccountSetupPage from "./pages/MaintenanceAndSecurity/AccountingSetup/BankAccountSetup/page"
import DefaultAccountSetupPage from "./pages/MaintenanceAndSecurity/AccountingSetup/DefaultAccountSetup/page"
import AccountingEntriesDefaultspage from "./pages/MaintenanceAndSecurity/AccountingSetup/AccountingEntriesDefaults/page"
import ChartOfAccountsPage from "./pages/MaintenanceAndSecurity/AccountingSetup/ChartOfAccounts/page"
import DepartmentSetupPage from "./pages/MaintenanceAndSecurity/GeneralSetup/DepartmentSetup/page"
import UserPermissionsPage from "./pages/MaintenanceAndSecurity/Security/UserPermissions/page"
import ApprovalPage from "./pages/MaintenanceAndSecurity/Admin/Approval/page"
import BackupAndRestorePage from "./pages/MaintenanceAndSecurity/Admin/BackupAndRestore/page"
import ActivityLogsPage from "./pages/MaintenanceAndSecurity/Admin/ActivityLogs/page"
import BonusLoanCASetupPage from "./pages/MaintenanceAndSecurity/LendingSetup/BonusLoanCASetup/page"
import BonusLoanSetupPage from "./pages/MaintenanceAndSecurity/LendingSetup/BonusLoanSetup/page"
import SalaryLoanCASetupPage from "./pages/MaintenanceAndSecurity/LendingSetup/SalaryLoanCASetup/page"
import SalaryLoanSetupPage from "./pages/MaintenanceAndSecurity/LendingSetup/SalaryLoanSetup/page"
import SchoolOfficeSetupPage from "./pages/MaintenanceAndSecurity/LendingSetup/SchoolOfficeSetup/page"
import DistrictSetupPage from "./pages/MaintenanceAndSecurity/LendingSetup/DistrictSetup/page"
import DivisionSetupPage from "./pages/MaintenanceAndSecurity/LendingSetup/DivisionSetup/page"
import ClasificationSetupPage from "./pages/MaintenanceAndSecurity/LendingSetup/ClassificationSetup/page"
import GroupSetupPage from "./pages/MaintenanceAndSecurity/LendingSetup/GroupSetup/page"
import TwoFactorAuthPage from "./pages/Auth/TwoFactorAuth"
import ChangePasswordPage from "./pages/Auth/ChangePassword"
import TwoFactorRoute from "./components/TwoFactorRoute"
import ChangePasswordRoute from "./components/ChangePasswordRoute"

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicRoute />}>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>
        <Route element={<TwoFactorRoute />}>
          <Route path="/2fa-verification" element={<TwoFactorAuthPage />} />
        </Route>
        <Route element={<ChangePasswordRoute />}>
          <Route path="/change-password" element={<ChangePasswordPage />} />
        </Route>
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/borrower-dashboard" element={<BorrowerDashboardPage />} />
          <Route path="/lending" element={<LendingPage />} />
          <Route path="/accounting" element={<AccountingPage />} />
          <Route path="/maintenance-and-security/general-setup/branch-setup" element={<BranchSetup />} />
          <Route path="/maintenance-and-security/general-setup/department-setup" element={<DepartmentSetupPage />} />
          <Route path="/maintenance-and-security/security/user-management" element={<UserManagementPage />} />
          <Route path="/maintenance-and-security/security/user-permissions" element={<UserPermissionsPage />} />
          <Route path="/maintenance-and-security/admin/approval" element={<ApprovalPage />} />
          <Route path="/maintenance-and-security/admin/backup-and-restore" element={<BackupAndRestorePage />} />
          <Route path="/maintenance-and-security/admin/activity-logs" element={<ActivityLogsPage />} />
          <Route path="/maintenance-and-security/admin/approval" element={<ApprovalPage />} />
          <Route path="/maintenance-and-security/accounting-setup/reference-settings" element={<ReferenceSettingsPage />} />
          <Route path="/maintenance-and-security/accounting-setup/chart-of-accounts" element={<ChartOfAccountsPage />} />
          <Route path="/maintenance-and-security/accounting-setup/accounting-entries-defaults" element={<AccountingEntriesDefaultspage />} />
          <Route path="/maintenance-and-security/accounting-setup/default-account-setup" element={<DefaultAccountSetupPage />} />
          <Route path="/maintenance-and-security/accounting-setup/bank-account-setup" element={<BankAccountSetupPage />} />
          <Route path="/maintenance-and-security/accounting-setup/cashiering" element={<CashieringPage />} />
          <Route path="/maintenance-and-security/lending-setup/group-setup" element={<GroupSetupPage />} />
          <Route path="/maintenance-and-security/lending-setup/classification-setup" element={<ClasificationSetupPage />} />
          <Route path="/maintenance-and-security/lending-setup/division-setup" element={<DivisionSetupPage />} />
          <Route path="/maintenance-and-security/lending-setup/district-setup" element={<DistrictSetupPage />} />
          <Route path="/maintenance-and-security/lending-setup/school-office-setup" element={<SchoolOfficeSetupPage />} />
          <Route path="/maintenance-and-security/lending-setup/salary-loan-setup" element={<SalaryLoanSetupPage />} />
          <Route path="/maintenance-and-security/lending-setup/salary-loan-ca-setup" element={<SalaryLoanCASetupPage />} />
          <Route path="/maintenance-and-security/lending-setup/bonus-loan-setup" element={<BonusLoanSetupPage />} />
          <Route path="/maintenance-and-security/lending-setup/bonus-loan-ca-setup" element={<BonusLoanCASetupPage />} />
          {/* Add more protected routes here */}
        </Route>

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App
