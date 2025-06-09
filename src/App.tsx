// src/App.tsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/Auth/Login";
import Dashboard from "./pages/Home/page";
import ForgotPasswordPage from "./pages/Auth/ForgotPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import BranchSetup from "./pages/MaintenanceAndSecurity/GeneralSetup/BranchSetup/page";
import UserManagementPage from "./pages/MaintenanceAndSecurity/Security/UserManagement/page";
import BorrowerDashboardPage from "./pages/BorrowerDashboard/page";
import AccountingPage from "./pages/Accounting/page";
import ReferenceSettingsPage from "./pages/MaintenanceAndSecurity/AccountingSetup/ReferenceSettings/page";
import CashieringPage from "./pages/MaintenanceAndSecurity/AccountingSetup/Cashiering/page";
import BankAccountSetupPage from "./pages/MaintenanceAndSecurity/AccountingSetup/BankAccountSetup/page";
import DefaultAccountSetupPage from "./pages/MaintenanceAndSecurity/AccountingSetup/DefaultAccountSetup/page";
import AccountingEntriesDefaultspage from "./pages/MaintenanceAndSecurity/AccountingSetup/AccountingEntriesDefaults/page";
import ChartOfAccountsPage from "./pages/MaintenanceAndSecurity/AccountingSetup/ChartOfAccounts/page";
import DepartmentSetupPage from "./pages/MaintenanceAndSecurity/GeneralSetup/DepartmentSetup/page";
import UserPermissionsPage from "./pages/MaintenanceAndSecurity/Security/UserPermissions/page";
import ApprovalPage from "./pages/MaintenanceAndSecurity/Admin/Approval/page";
import BackupAndRestorePage from "./pages/MaintenanceAndSecurity/Admin/BackupAndRestore/page";
import ActivityLogsPage from "./pages/MaintenanceAndSecurity/Admin/ActivityLogs/page";
import CashAdvanceSetupPage from "./pages/MaintenanceAndSecurity/LendingSetup/CashAdvanceSetup/page";
import BonusLoanSetupPage from "./pages/MaintenanceAndSecurity/LendingSetup/BonusLoanSetup/page";
import SalaryLoanSetupPage from "./pages/MaintenanceAndSecurity/LendingSetup/SalaryLoanSetup/page";
import SchoolOfficeSetupPage from "./pages/MaintenanceAndSecurity/LendingSetup/SchoolOfficeSetup/page";
import DistrictSetupPage from "./pages/MaintenanceAndSecurity/LendingSetup/DistrictSetup/page";
import DivisionSetupPage from "./pages/MaintenanceAndSecurity/LendingSetup/DivisionSetup/page";
import ClasificationSetupPage from "./pages/MaintenanceAndSecurity/LendingSetup/ClassificationSetup/page";
import GroupSetupPage from "./pages/MaintenanceAndSecurity/LendingSetup/GroupSetup/page";
import TwoFactorAuthPage from "./pages/Auth/TwoFactorAuth";
import ChangePasswordPage from "./pages/Auth/ChangePassword";
import TwoFactorRoute from "./components/TwoFactorRoute";
import ChangePasswordRoute from "./components/ChangePasswordRoute";
import { Toaster } from "sonner";
import GeneralJournalpage from "./pages/MaintenanceAndSecurity/AccountingSetup/GeneralJournal/page";
import { PermissionProvider } from "./context/PermissionContext";
import LoanProcessing from "./pages/Lending/LoanProcessing/page";
import BorrowerMasterListPage from "./pages/Lending/BorrowerMasterList/page";

function App() {
  return (
    <>
      <PermissionProvider>
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
              {/* Dashboard Routes */}
              <Route path="/dashboard" element={<Dashboard />} />

              {/* Borrower Dashboard Routes */}
              <Route
                path="/borrower-dashboard"
                element={<BorrowerDashboardPage />}
              />

              {/* Lending Routes */}
              <Route
                path="/lending/salary-loan-processing"
                element={<LoanProcessing name="Salary Loan Processing" />}
              />

              <Route
                path="/lending/borrowers/borrower-master-list"
                element={<BorrowerMasterListPage name="Borrowers Masterlist" />}
              />

              {/* Accounting Routes */}
              <Route path="/accounting" element={<AccountingPage />} />

              {/* Maintenance and Security Routes */}
              <Route
                path="/maintenance-and-security/general-setup/branch-setup"
                element={<BranchSetup name="Branch Setup" />}
              />
              <Route
                path="/maintenance-and-security/general-setup/department-setup"
                element={<DepartmentSetupPage name="Department Setup" />}
              />
              <Route
                path="/maintenance-and-security/security/user-management"
                element={<UserManagementPage name="User Management" />}
              />
              <Route
                path="/maintenance-and-security/security/user-permissions"
                element={<UserPermissionsPage name="User Level Permission" />}
              />
              <Route
                path="/maintenance-and-security/admin/approval"
                element={<ApprovalPage name="For Approval List" />}
              />
              <Route
                path="/maintenance-and-security/admin/backup-and-restore"
                element={<BackupAndRestorePage name="Backup and Restore" />}
              />
              <Route
                path="/maintenance-and-security/admin/activity-logs"
                element={<ActivityLogsPage name="Activity Logs" />}
              />
              <Route
                path="/maintenance-and-security/accounting-setup/reference-settings"
                element={<ReferenceSettingsPage name="Reference Settings" />}
              />
              <Route
                path="/maintenance-and-security/accounting-setup/chart-of-accounts"
                element={<ChartOfAccountsPage name="Chart of Accounts" />}
              />
              <Route
                path="/maintenance-and-security/accounting-setup/accounting-entries-defaults"
                element={
                  <AccountingEntriesDefaultspage name="Accounting Entries Default" />
                }
              />
              <Route
                path="/maintenance-and-security/accounting-setup/default-account-setup"
                element={
                  <DefaultAccountSetupPage name="Accounting General Defaults Accounts Setup" />
                }
              />
              <Route
                path="/maintenance-and-security/accounting-setup/bank-account-setup"
                element={<BankAccountSetupPage name="Bank Account Setup" />}
              />
              <Route
                path="/maintenance-and-security/accounting-setup/cashiering"
                element={<CashieringPage name="Cashiering" />}
              />
              <Route
                path="/maintenance-and-security/lending-setup/group-setup"
                element={<GroupSetupPage name="Borrower Group Setup" />}
              />
              <Route
                path="/maintenance-and-security/lending-setup/classification-setup"
                element={<ClasificationSetupPage name="Classification Setup" />}
              />
              <Route
                path="/maintenance-and-security/lending-setup/division-setup"
                element={<DivisionSetupPage name="Borrower Division Setup" />}
              />
              <Route
                path="/maintenance-and-security/lending-setup/district-setup"
                element={<DistrictSetupPage name="Borrower District Setup" />}
              />
              <Route
                path="/maintenance-and-security/lending-setup/school-office-setup"
                element={<SchoolOfficeSetupPage name="Borrower School Setup" />}
              />
              <Route
                path="/maintenance-and-security/lending-setup/salary-loan-setup"
                element={<SalaryLoanSetupPage name="Salary Loan Setup" />}
              />
              <Route
                path="/maintenance-and-security/lending-setup/bonus-loan-setup"
                element={<BonusLoanSetupPage name="Bonus Loan Setup" />}
              />
              <Route
                path="/maintenance-and-security/lending-setup/ca-setup"
                element={<CashAdvanceSetupPage name="Cash Advance Setup" />}
              />
              <Route
                path="/maintenance-and-security/accounting-setup/general-journal"
                element={<GeneralJournalpage name="General Journal" />}
              />
              {/* Add more protected routes here */}
            </Route>

            {/* Redirect unknown routes */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </PermissionProvider>
      <Toaster richColors position="top-right" />
    </>
  );
}

export default App;
