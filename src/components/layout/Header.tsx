import { FileText } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import BranchProfileDropdown from "../branch-select";
import React from "react";

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
];

// Memoized logo to prevent flicker
const Logo = React.memo(() => <img src="/logo.png" alt="Logo" />);

export default function Header() {
  const location = useLocation();

  return (
    <header className="bg-white shadow py-4 px-6 flex items-center justify-between border-b border-b-[var(--border)]">
      <div className="flex gap-8 items-center">
        <Logo />
        <nav className="flex gap-1">
          {navItems.map(({ to, label, matchPath }) => {
            const isActive = matchPath
              ? location.pathname.startsWith(matchPath)
              : location.pathname === to;

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
            );
          })}
        </nav>
      </div>
      <div className="flex gap-6 items-center">
        <Button variant="outline" size="lg" className="py-2 px-4" asChild>
          <a href="/maintenance-and-security/admin/approval" className="flex items-center gap-2">
            <FileText /> Approval
          </a>
        </Button>
        <BranchProfileDropdown />
      </div>
    </header>
  );
}