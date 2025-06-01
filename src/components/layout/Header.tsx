"use client"

import React from "react"
import { FileText, LogOut } from "lucide-react"
import { NavLink, useLocation, useNavigate } from "react-router-dom"
import { Button } from "../ui/button"
import BranchProfileDropdown from "../branch-select"
import Cookies from "js-cookie"

// Navigation items list
const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/borrower-dashboard", label: "Borrower Dashboard" },
  { to: "/lending", label: "Lending" },
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
  const navigate = useNavigate()
  const handleLogout = () => {
    // Clear auth token and other session data
    localStorage.removeItem("authToken")
    localStorage.removeItem("user") // or any other related items

    // Optionally redirect to login page
    Cookies.remove("authToken")
    navigate("/login", {
      state: { message: "You have been logged out successfully." },
    })
  }
  return (
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
          onClick={() => {
            alert("logout")
            handleLogout()
          }}
          className="p-1 text-left text-sm text-red-600 hover:bg-gray-100 flex align-middle gap-2 cursor-pointer"
        >
          <LogOut width={20} height={20} />
        </button>
      </div>
    </header>
  )
}