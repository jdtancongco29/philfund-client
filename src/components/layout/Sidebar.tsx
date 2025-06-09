"use client";

import { NavLink, useLocation } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useMemo, useState } from "react";
import clsx from "clsx";

// Enhanced menu configuration with ordering and page-based sections
const menuConfig = {
  dashboard: {
    sectionTitle: "Dashboard",
    order: 1,
    pathPattern: /^\/dashboard/,
    items: [
      {
        type: "accordion" as const,
        title: "More Actions",
        value: "more-actions",
        order: 2,
        defaultOpen: true,
        links: [
          { label: "Salary Loan Processing", path: "/lending/salary-loan-processing", order: 1 },
          { label: "Cash Advance Processing", path: "/lending/cash-advance-processing", order: 2 },
          { label: "Bonus Loan Processing", path: "/lending/bonus-loan-processing", order: 2 },
          { label: "Loan Restructuring", path: "/lending/loan-restructuring", order: 3 },
          { label: "Cash Processing", path: "/dashboard/cash-processing", order: 4 },
          { label: "Payments & Collections", path: "/dashboard/payments-and-collections", order: 5 },
          { label: "Loan Pay Off", path: "/lending/loan-pay-off", order: 6 },
          { label: "Cards Custody Log", path: "/lending/cards-custody-log", order: 7 },
          { label: "Unsold / No Accounts Recording", path: "/lending/unsold-or-no-account-recording", order: 8 },
        ],
      },
    ],
  },
  "borrower-dashboard": {
    sectionTitle: "Borrowers Dashboard",
    order: 2,
    pathPattern: /^\/borrower-dashboard/,
    items: [
      {
        type: "list" as const,
        value: "loan-processing",
        order: 1,
        defaultOpen: true,
        links: [
          {
            label: "Salary Loan Processing",
            path: "/lending/salary-loan-processing",
            order: 1,
          },
          {
            label: "Cash Advance Processing",
            path: "/lending/cash-advance-processing",
            order: 2,
          },
          {
            label: "Bonus Loan Processing",
            path: "/lending/bonus-loan-processing",
            order: 3,
          },
          {
            label: "Loan Restructure",
            path: "/lending/loan-restructure",
            order: 4,
          },
        ],
      },
      {
        type: "accordion" as const,
        title: "Releasing",
        value: "releasing",
        order: 2,
        defaultOpen: true,
        links: [
          {
            label: "Check Encashment",
            path: "/lending/releasing/check-encashment",
            order: 1,
          },
          {
            label: "Change Voucher",
            path: "/lending/releasing/change-voucher",
            order: 2,
          },
          {
            label: "Salary and Cash Advance Payment",
            path: "/lending/releasing/salary-and-cash-advance-payment",
            order: 3,
          },
          {
            label: "Bonus Loan Payment",
            path: "/lending/releasing/bonus-loan-payment",
            order: 4,
          },
          {
            label: "Loans Payoff",
            path: "/lending/releasing/loans-payoff",
            order: 5,
          },
        ],
      },
      {
        type: "accordion" as const,
        title: "Borrowers",
        value: "borrowers",
        order: 3,
        defaultOpen: false,
        links: [
          {
            label: "Borrower's Master List",
            path: "/lending/borrowers/borrower-master-list",
            order: 1,
          },
          {
            label: "Bulk Upload Borrowers Profile",
            path: "/lending/borrowers/bulk-upload-profile",
            order: 2,
          },
          {
            label: "Beginning Balance",
            path: "/lending/borrowers/beginning-balance",
            order: 3,
          },
          {
            label: "Pre-Loan Application",
            path: "/lending/borrowers/pre-loan-application",
            order: 4,
          },
        ],
      },
      {
        type: "accordion" as const,
        title: "Other Lending Transactions",
        value: "other-lending-transactions",
        order: 4,
        defaultOpen: false,
        links: [
          {
            label: "Card Custody Log",
            path: "/lending/card-custody-log",
            order: 1,
          },
          {
            label: "Unsold/No Account",
            path: "/lending/unsold-or-no-account-recording",
            order: 2,
          },
        ],
      },
    ],
  },

  lending: {
    sectionTitle: "Lending",
    order: 3,
    pathPattern: /^\/lending/,
    items: [
      {
        type: "list" as const,
        value: "loan-processing",
        order: 1,
        defaultOpen: true,
        links: [
          { label: "Salary Loan Processing", path: "/lending/salary-loan-processing", order: 1 },
          { label: "Cash Advance Processing", path: "/lending/cash-advance-processing", order: 2 },
          { label: "Bonus Loan Processing", path: "/lending/bonus-loan-processing", order: 3 },
          { label: "Loan Restructure", path: "/lending/loan-restructure", order: 4 },
          { label: "Loan Renewal", path: "/lending/loan-renewal", order: 5 },
        ],
      },
      {
        type: "accordion" as const,
        title: "Releasing",
        value: "releasing",
        order: 2,
        defaultOpen: true,
        links: [
          {
            label: "Check Encashment",
            path: "/lending/releasing/check-encashment",
            order: 1,
          },
          {
            label: "Change Voucher",
            path: "/lending/releasing/change-voucher",
            order: 2,
          },
          {
            label: "Salary and Cash Advance Payment",
            path: "/lending/releasing/salary-and-cash-advance-payment",
            order: 3,
          },
          {
            label: "Bonus Loan Payment",
            path: "/lending/releasing/bonus-loan-payment",
            order: 4,
          },
          {
            label: "Loans Payoff",
            path: "/lending/releasing/loans-payoff",
            order: 5,
          },
        ],
      },
      {
        type: "accordion" as const,
        title: "Borrowers",
        value: "borrowers",
        order: 3,
        defaultOpen: false,
        links: [
          {
            label: "Borrower's Master List",
            path: "/lending/borrowers/borrower-master-list",
            order: 1,
          },
          {
            label: "Bulk Upload Borrowers Profile",
            path: "/lending/borrowers/bulk-upload-profile",
            order: 2,
          },
          {
            label: "Beginning Balance",
            path: "/lending/borrowers/beginning-balance",
            order: 3,
          },
          {
            label: "Pre-Loan Application",
            path: "/lending/borrowers/pre-loan-application",
            order: 4,
          },
        ],
      },
      {
        type: "accordion" as const,
        title: "Other Lending Transactions",
        value: "other-lending-transactions",
        order: 4,
        defaultOpen: false,
        links: [
          {
            label: "Card Custody Log",
            path: "/lending/card-custody-log",
            order: 1,
          },
          {
            label: "Unsold/No Account",
            path: "/lending/unsold-or-no-account-recording",
            order: 2,
          },
        ],
      },
    ],
  },

  accounting: {
    sectionTitle: "Accounting",
    order: 4,
    pathPattern: /^\/accounting/,
    items: [
      {
        type: "list" as const,
        title: "Financial Overview",
        order: 1,
        links: [
          {
            label: "Accounting Dashboard",
            path: "/accounting/dashboard",
            order: 1,
          },
          {
            label: "Trial Balance",
            path: "/accounting/trial-balance",
            order: 2,
          },
          {
            label: "Financial Statements",
            path: "/accounting/financial-statements",
            order: 3,
          },
        ],
      },
      {
        type: "accordion" as const,
        title: "Journal Entries",
        value: "journal-entries",
        order: 2,
        defaultOpen: true,
        links: [
          {
            label: "General Journal",
            path: "/accounting/general-journal",
            order: 1,
          },
          {
            label: "Cash Receipts",
            path: "/accounting/cash-receipts",
            order: 2,
          },
          {
            label: "Cash Disbursements",
            path: "/accounting/cash-disbursements",
            order: 3,
          },
          {
            label: "Adjusting Entries",
            path: "/accounting/adjusting-entries",
            order: 4,
          },
        ],
      },
      {
        type: "accordion" as const,
        title: "Accounts Management",
        value: "accounts-management",
        order: 3,
        defaultOpen: false,
        links: [
          {
            label: "Chart of Accounts",
            path: "/accounting/chart-of-accounts",
            order: 1,
          },
          {
            label: "Account Reconciliation",
            path: "/accounting/reconciliation",
            order: 2,
          },
          {
            label: "Bank Accounts",
            path: "/accounting/bank-accounts",
            order: 3,
          },
        ],
      },
    ],
  },

  maintenance: {
    sectionTitle: "Maintenance & Security",
    order: 5,
    pathPattern: /^\/maintenance-and-security/,
    items: [
      {
        type: "accordion" as const,
        title: "General Setup",
        value: "general-setup",
        order: 2,
        defaultOpen: true,
        links: [
          {
            label: "Branch Setup",
            path: "/maintenance-and-security/general-setup/branch-setup",
            order: 1,
          },
          {
            label: "Department Setup",
            path: "/maintenance-and-security/general-setup/department-setup",
            order: 2,
          },
        ],
      },
      {
        type: "accordion" as const,
        title: "Security",
        value: "security",
        order: 3,
        defaultOpen: false,
        links: [
          {
            label: "User Management",
            path: "/maintenance-and-security/security/user-management",
            order: 1,
          },
          {
            label: "User Permissions",
            path: "/maintenance-and-security/security/user-permissions",
            order: 2,
          },
        ],
      },
      {
        type: "accordion" as const,
        title: "Admin",
        value: "admin",
        order: 4,
        defaultOpen: false,
        links: [
          {
            label: "For approval list",
            path: "/maintenance-and-security/admin/approval",
            order: 1,
          },
          {
            label: "Back up and Restore",
            path: "/maintenance-and-security/admin/backup-and-restore",
            order: 2,
          },
          {
            label: "Activity Logs",
            path: "/maintenance-and-security/admin/activity-logs",
            order: 3,
          },
        ],
      },
      {
        type: "accordion" as const,
        title: "Accounting Setup",
        value: "accounting-setup",
        order: 5,
        defaultOpen: false,
        links: [
          {
            label: "Reference Settings",
            path: "/maintenance-and-security/accounting-setup/reference-settings",
            order: 1,
          },
          {
            label: "Chart of Accounts (CoA)",
            path: "/maintenance-and-security/accounting-setup/chart-of-accounts",
            order: 2,
          },
          {
            label: "Accounting Entries Defaults",
            path: "/maintenance-and-security/accounting-setup/accounting-entries-defaults",
            order: 3,
          },
          {
            label: "Default Account Setup",
            path: "/maintenance-and-security/accounting-setup/default-account-setup",
            order: 4,
          },
          {
            label: "Bank Account Setup",
            path: "/maintenance-and-security/accounting-setup/bank-account-setup",
            order: 5,
          },
          {
            label: "Cashiering",
            path: "/maintenance-and-security/accounting-setup/cashiering",
            order: 6,
          },
        ],
      },
      {
        type: "accordion" as const,
        title: "Lending Setup",
        value: "lending-setup",
        order: 6,
        defaultOpen: false,
        links: [
          {
            label: "Group Setup",
            path: "/maintenance-and-security/lending-setup/group-setup",
            order: 1,
          },
          {
            label: "Classification Setup",
            path: "/maintenance-and-security/lending-setup/classification-setup",
            order: 2,
          },
          {
            label: "Division Setup",
            path: "/maintenance-and-security/lending-setup/division-setup",
            order: 3,
          },
          {
            label: "District Setup",
            path: "/maintenance-and-security/lending-setup/district-setup",
            order: 4,
          },
          {
            label: "School / Office Setup",
            path: "/maintenance-and-security/lending-setup/school-office-setup",
            order: 5,
          },
          {
            label: "Salary Loan Setup",
            path: "/maintenance-and-security/lending-setup/salary-loan-setup",
            order: 6,
          },
          {
            label: "Bonus Loan Setup",
            path: "/maintenance-and-security/lending-setup/bonus-loan-setup",
            order: 7,
          },
          {
            label: "Cash Advance Setup",
            path: "/maintenance-and-security/lending-setup/ca-setup",
            order: 8,
          },
        ],
      },
    ],
  },
};

type MenuSection = keyof typeof menuConfig;

export default function ImprovedSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  // State to manage accordion open/close
  const [accordionValue, setAccordionValue] = useState<string>("");

  const {
    // currentSection,
    sortedItems,
    defaultAccordionValue,
  } = useMemo(() => {
    // Determine which section to show based on current path
    let activeSection: MenuSection = "dashboard"; // default fallback

    for (const [sectionKey, section] of Object.entries(menuConfig)) {
      if (section.pathPattern.test(currentPath)) {
        activeSection = sectionKey as MenuSection;
        break;
      }
    }

    const section = menuConfig[activeSection];

    // Sort items by order
    const sortedItems = [...section.items].sort((a, b) => a.order - b.order);

    // Sort links within each item
    sortedItems.forEach((item) => {
      if (item.links) {
        item.links.sort((a, b) => a.order - b.order);
      }
    });

    // Find default accordion value based on current path or defaultOpen
    let defaultAccordionValue = "";

    // First, check if current path matches any accordion item
    for (const item of sortedItems) {
      if (item.type === "accordion" && item.links) {
        const hasActiveLink = item.links.some(
          (link) =>
            currentPath === link.path || currentPath.startsWith(link.path + "/")
        );
        if (hasActiveLink) {
          defaultAccordionValue = item.value;
          break;
        }
      }
    }

    // If no active link found, use the first defaultOpen accordion
    if (!defaultAccordionValue) {
      const defaultOpenItem = sortedItems.find(
        (item) => item.type === "accordion" && item.defaultOpen
      );
      defaultAccordionValue = defaultOpenItem?.value || "";
    }

    return {
      currentSection: section,
      sortedItems,
      defaultAccordionValue,
    };
  }, [currentPath]);

  // Update accordion value when default changes
  useMemo(() => {
    setAccordionValue(defaultAccordionValue);
  }, [defaultAccordionValue]);

  return (
    <aside className="w-64 h-full p-2 bg-sidebar border-r border-sidebar-border">
      <nav className="flex flex-col gap-2">
        {/* Render List (non-accordion) items */}
        {sortedItems
          .filter((item) => item.type === "list")
          .map((item) => (
            <div key={item.title} className="space-y-1">
              <div className="px-2 py-1">
                <h3 className="text-xs font-medium text-sidebar-foreground/70 uppercase tracking-wider">
                  {item.title}
                </h3>
              </div>
              <div className="flex flex-col gap-1">
                {item.links.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) =>
                      clsx(
                        "text-sm rounded-md hover:bg-foreground hover:text-white px-3 py-2 font-medium transition-colors",
                        isActive
                          ? "bg-foreground text-white"
                          : "text-sidebar-foreground"
                      )
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}

        {/* Render Accordion items */}
        <Accordion
          type="single"
          collapsible
          className="w-full space-y-1"
          value={accordionValue}
          onValueChange={setAccordionValue}
        >
          {sortedItems
            .filter((item) => item.type === "accordion")
            .map((item) => (
              <AccordionItem
                key={item.value}
                value={item.value}
                className="border-none"
              >
                <AccordionTrigger className="px-3 py-2 rounded-md text-sm font-medium hover:underline">
                  {item.title}
                </AccordionTrigger>
                <AccordionContent className="pb-1">
                  <div className="flex flex-col gap-1 ml-3">
                    {item.links.map((link) => (
                      <NavLink
                        key={link.path}
                        to={link.path}
                        className={({ isActive }) =>
                          clsx(
                            "text-sm rounded-md hover:bg-foreground hover:text-white px-3 py-2 font-medium transition-colors",
                            isActive
                              ? "bg-foreground text-white"
                              : "text-sidebar-foreground"
                          )
                        }
                      >
                        {link.label}
                      </NavLink>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
        </Accordion>
      </nav>
    </aside>
  );
}
