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

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicRoute />}>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/borrower-dashboard" element={<BorrowerDashboardPage />} />
          <Route path="/lending" element={<LendingPage />} />
          <Route path="/accounting" element={<AccountingPage />} />
          <Route path="/maintenance-and-security/general-setup/branch-setup" element={<BranchSetup />} />
          <Route path="/maintenance-and-security/security/user-management" element={<UserManagementPage />} />
          <Route path="/maintenance-and-security/accounting-setup/reference-settings" element={<ReferenceSettingsPage />} />
          <Route path="/maintenance-and-security/accounting-setup/chart-of-accounts" element={<ChartOfAccountsPage />} />
          <Route path="/maintenance-and-security/accounting-setup/accounting-entries-defaults" element={<AccountingEntriesDefaultspage />} />
          <Route path="/maintenance-and-security/accounting-setup/default-account-setup" element={<DefaultAccountSetupPage />} />
          <Route path="/maintenance-and-security/accounting-setup/bank-account-setup" element={<BankAccountSetupPage />} />
          <Route path="/maintenance-and-security/accounting-setup/cashiering" element={<CashieringPage />} />
          {/* Add more protected routes here */}
        </Route>

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App
