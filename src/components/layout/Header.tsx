"use client"

import React, { useState } from "react"
import { FileText, LogOut } from "lucide-react"
import { NavLink, useLocation, useNavigate } from "react-router-dom"
import { Button } from "../ui/button"
import BranchProfileDropdown from "../branch-select"
import { LogoutConfirmationDialog } from "../layout/LogoutConfirmationDialog"
import { useMutation } from "@tanstack/react-query"
import AuthService from "../../pages/Auth/Service/AuthServices"
import Cookies from "js-cookie"
import { toast } from "sonner"

// Navigation items list
const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/borrower-dashboard", label: "Borrower Dashboard" },
  {
    to: "/lending/salary-loan-processing",
    label: "Lending",
    matchPath: "/lending",
  },
  { to: "/accounting", label: "Accounting" },
  {
    to: "/maintenance-and-security/general-setup/branch-setup",
    label: "Maintenance & Security",
    matchPath: "/maintenance-and-security",
  },
]

// Memoized logo to prevent flickering
const Logo = React.memo(() => <img src="/logo.png" alt="Logo" />)

// Memoized nav menu
const MemoizedNav = React.memo(function NavMenu() {
  const location = useLocation()

  return (
    <nav className="flex gap-1">
      {navItems.map(({ to, label, matchPath }) => {
        const isActive = matchPath ? location.pathname.startsWith(matchPath) : location.pathname === to

        return (
          <NavLink
            key={to}
            to={to}
            className={`text-[var(--foreground)] hover:bg-[var(--secondary)] rounded-lg px-4 py-2.5 ${
              isActive ? "bg-[var(--secondary)] font-semibold" : ""
            }`}
          >
            {label}
          </NavLink>
        )
      })}
    </nav>
  )
})

export default function Header() {
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false)
  const navigate = useNavigate()

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: AuthService.logout,
    onSuccess: () => {
      // Clear all auth-related data
      localStorage.removeItem("authToken")
      localStorage.removeItem("user")
      Cookies.remove("authToken")
      Cookies.remove("current_branch")

      toast.success("You have been logged out successfully")

      // Redirect to login page
      navigate("/login", {
        state: { message: "You have been logged out successfully." },
      })
    },
    onError: (error: any) => {
      // Even if API fails, still clear local data and redirect
      console.error("Logout API failed:", error)

      // Clear all auth-related data anyway
      localStorage.removeItem("authToken")
      localStorage.removeItem("user")
      Cookies.remove("authToken")
      Cookies.remove("current_branch")

      toast.error("Logout completed (with API error)")

      // Redirect to login page
      navigate("/login", {
        state: { message: "You have been logged out." },
      })
    },
  })

  const handleLogoutClick = () => {
    setShowLogoutConfirmation(true)
  }

  const handleConfirmLogout = () => {
    logoutMutation.mutate()
    setShowLogoutConfirmation(false)
  }

  const handleCancelLogout = () => {
    setShowLogoutConfirmation(false)
  }

  return (
    <>
      <header className="bg-white shadow py-4 px-6 flex items-center justify-between border-b border-b-[var(--border)]">
        <div className="flex gap-8 items-center">
          <Logo />
          <MemoizedNav />
        </div>
        <div className="flex gap-6 items-center">
          <Button variant="outline" size="lg" className="py-2 px-4" asChild>
            <a href="/maintenance-and-security/admin/approval" className="flex items-center gap-2">
              <FileText /> Approval
            </a>
          </Button>
          <BranchProfileDropdown />
          <button
            onClick={handleLogoutClick}
            disabled={logoutMutation.isPending}
            className="p-1 text-left text-sm text-red-600 hover:bg-gray-100 flex align-middle gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogOut width={20} height={20} />
          </button>
        </div>
      </header>

      <LogoutConfirmationDialog
        isOpen={showLogoutConfirmation}
        onClose={handleCancelLogout}
        onConfirm={handleConfirmLogout}
        isLoading={logoutMutation.isPending}
      />
    </>
  )
}
