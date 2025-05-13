import { FileText } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import BranchSelect from "../branch-select";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/borrower-dashboard", label: "Borrower Dashboard" },
  { to: "/lending", label: "Lending" },
  { to: "/accounting", label: "Accounting" },
  { to: "/maintenance-and-security/general-setup/branch-setup", label: "Maintenance & Security" },
];

export default function Header() {
  const location = useLocation();
  const currentBasePath = `/${location.pathname.split("/")[1]}`;

  return (
    <header className="bg-white shadow py-4 px-6 flex items-center justify-between border-b border-b-[var(--border)]">
      <div className="flex gap-8">
        <img src="/logo.png" alt="Logo" />
        <nav className="flex gap-1">
          {navItems.map(({ to, label }) => {
            const isActive = currentBasePath === to;

            return (
              <NavLink
                key={to}
                to={to}
                className={`text-[var(--foreground)] hover:bg-[var(--secondary)] rounded-lg px-4 py-2.5 ${isActive ? "bg-[var(--secondary)] font-semibold" : ""}`}
              >
                {label}
              </NavLink>
            );
          })}
        </nav>
      </div>
      <div className="flex gap-6 items-center">
        <Button variant="outline" size="lg" className="py-2 px-4" asChild>
          <a href="#">
            <FileText /> Approval
          </a>
        </Button>
        <BranchSelect />
      </div>
    </header>
  );
}