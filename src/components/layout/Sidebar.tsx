import { ChevronRight } from "lucide-react";
import { useLocation } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useMemo } from "react";
import clsx from "clsx";

// Unified menu configuration
const menuConfig = [
  {
    sectionTitle: "More Actions",
    value: "more-actions",
    items: [
      {
        title: "More Actions",
        value: "more-actions-group",
        links: [
          { label: "Loan Processing", path: "/loan-processing" },
          { label: "Cash Advance Processing", path: "/cash-advance-processing" },
          { label: "Loan Restructuring", path: "/loan-restructuring" },
          { label: "Cash Processing", path: "/cash-processing" },
          { label: "Payments & Collections", path: "/payments-and-collections" },
          { label: "Loan Pay Off", path: "/loan-pay-off" },
          { label: "Cards Custody Log", path: "/cards-custody-log" },
          { label: "Unsold / No Accounts Recording", path: "/unsold-or-no-account-recording" },
        ],
      },
    ],
  },
  {
    sectionTitle: "Maintenance & Security",
    value: "maintenance-security",
    items: [
      {
        title: "General Setup",
        value: "general-setup",
        links: [
          { label: "Branch Setup", path: "/maintenance-and-security/general-setup/branch-setup" },
          { label: "Department Setup", path: "/maintenance-and-security/general-setup/department-setup" },
        ],
      },
      {
        title: "Security",
        value: "security",
        links: [
          { label: "User Managements", path: "/maintenance-and-security/security/user-management" },
          { label: "User Permissions", path: "/maintenance-and-security/security/user-permissions" },
        ],
      },
      {
        title: "Admin",
        value: "admin",
        links: [
          { label: "For approval list", path: "/maintenance-and-security/admin/approval-list" },
          { label: "Back up and Restore", path: "/maintenance-and-security/admin/backup-and-restore" },
          { label: "Activity Logs", path: "/maintenance-and-security/admin/activity-logs" },
        ],
      },
      {
        title: "Accounting Setup",
        value: "accounting-setup",
        links: [
          { label: "Reference Settings", path: "/maintenance-and-security/accounting-setup/reference-settings" },
          { label: "Chart of Accounts (CoA)", path: "/maintenance-and-security/accounting-setup/chart-of-accounts" },
          { label: "Accounting Entries Defaults", path: "/maintenance-and-security/accounting-setup/accounting-entries-defaults" },
          { label: "Default Account Setup", path: "/maintenance-and-security/accounting-setup/default-account-setup" },
          { label: "Bank Account Setup", path: "/maintenance-and-security/accounting-setup/bank-account-setup" },
          { label: "Cashiering", path: "/maintenance-and-security/accounting-setup/cashiering" },
        ],
      },
      {
        title: "Lending Setup",
        value: "lending-setup",
        links: [
          { label: "Group Setup", path: "/maintenance-and-security/lending-setup/group-setup" },
          { label: "Classification Setup", path: "/maintenance-and-security/lending-setup/clasification-setup" },
          { label: "Division Setup", path: "/maintenance-and-security/lending-setup/division-setup" },
          { label: "District Setup", path: "/maintenance-and-security/lending-setup/district-setup" },
          { label: "School / Office Setup", path: "/maintenance-and-security/lending-setup/school-office-setup" },
          { label: "Salary Loan Setup", path: "/maintenance-and-security/lending-setup/salary-loan-setup" },
          { label: "Salary Loan CA Setup", path: "/maintenance-and-security/lending-setup/salary-loan-ca-setup" },
          { label: "Bonus Loan Setup", path: "/maintenance-and-security/lending-setup/bonus-loan-setup" },
          { label: "Bonus Loan CA Setup", path: "/maintenance-and-security/lending-setup/bonus-loan-ca-setup" },
        ],
      },
    ],
  },
];

export default function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const { sectionToRender, activeAccordion } = useMemo(() => {
    for (const section of menuConfig) {
      for (const item of section.items) {
        if (item.links.some((link) => currentPath.startsWith(link.path))) {
          return {
            sectionToRender: section,
            activeAccordion: item.value,
          };
        }
      }
    }
    // Fallback
    return {
      sectionToRender: currentPath.startsWith("/dashboard") ? menuConfig[0] : menuConfig[1],
      activeAccordion: currentPath.startsWith("/dashboard") ? "more-actions-group" : "",
    };
  }, [currentPath]);

  return (
    <aside className="w-64 h-full p-2">
      <nav className="flex flex-col gap-1">
        <Accordion
          type="single"
          collapsible
          className="w-full"
          defaultValue={activeAccordion}
        >
          {sectionToRender.items.map((item) => (
            <AccordionItem key={item.value} value={item.value} className="border-none">
              <AccordionTrigger className="p-1.5">{item.title}</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-1 pb-0">
                {item.links.map((link) => (
                  <a
                    key={link.path}
                    href={link.path}
                    className={clsx(
                      "text-sm rounded-sm hover:bg-[var(--foreground)] hover:text-white px-2 py-1.5 font-medium",
                      currentPath === link.path
                        ? "bg-[var(--foreground)] text-white"
                        : "text-[var(--sidebar-accent-foreground)]"
                    )}
                  >
                    {link.label}
                  </a>
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </nav>
    </aside>
  );
}