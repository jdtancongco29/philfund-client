"use client";

import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { CircleCheck } from "lucide-react";
import Select from "react-select";

import { apiRequest } from "@/lib/api";

interface ChartOfAccount {
  id: string;
  code: string;
  name: string;
  description?: string;
  major_classification?: string;
  category?: string;
  is_header?: boolean;
  parent_id?: string | null;
  is_contra?: boolean;
  normal_balance?: string;
  special_classification?: string;
  status?: boolean;
}

interface AccountFieldProps {
  label: string;
  description: string;
  required?: boolean;
  selectedAccount: ChartOfAccount | null;
  onAccountSelect: (account: ChartOfAccount | null) => void;
  error?: string | null;
  chartOfAccounts: ChartOfAccount[];
  loadingCOA: boolean;
  selectedAccountIds: string[];
}

interface ApiResponse {
  status: string;
  message: string;
  data: any;
}

const AccountField = ({
  label,
  description,
  required = false,
  selectedAccount,
  onAccountSelect,
  error,
  chartOfAccounts,
  loadingCOA,
  selectedAccountIds,
}: AccountFieldProps) => {
  // Filter out already selected accounts, but keep the current selection
  const availableAccounts = chartOfAccounts.filter(
    (account) =>
      !selectedAccountIds.includes(account.id) ||
      account.id === selectedAccount?.id
  );

  const handleCodeSelect = (
    selectedOption: { value: string; label: string } | null
  ) => {
    if (selectedOption) {
      const account = chartOfAccounts.find(
        (coa) => coa.id === selectedOption.value
      );
      onAccountSelect(account || null);
    } else {
      onAccountSelect(null);
    }
  };

  const handleNameSelect = (
    selectedOption: { value: string; label: string } | null
  ) => {
    if (selectedOption) {
      const account = chartOfAccounts.find(
        (coa) => coa.id === selectedOption.value
      );
      onAccountSelect(account || null);
    } else {
      onAccountSelect(null);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center">
        <Label className="font-medium">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      </div>
      <div className="space-y-2">
        <div className="flex gap-2">
          <div className="w-1/3">
            <Select<{ value: string; label: string }>
              value={
                selectedAccount
                  ? {
                      value: selectedAccount.id,
                      label: selectedAccount.code,
                    }
                  : null
              }
              onChange={handleCodeSelect}
              options={availableAccounts.map((coa) => ({
                value: coa.id,
                label: coa.code,
              }))}
              placeholder={loadingCOA ? "Loading..." : "Account Code"}
              isLoading={loadingCOA}
              isClearable
              classNamePrefix={error ? "react-select-error" : "react-select"}
            />
          </div>
          <div className="w-2/3">
            <Select<{ value: string; label: string }>
              value={
                selectedAccount
                  ? {
                      value: selectedAccount.id,
                      label: selectedAccount.name,
                    }
                  : null
              }
              onChange={handleNameSelect}
              options={availableAccounts.map((coa) => ({
                value: coa.id,
                label: coa.name,
              }))}
              placeholder={
                loadingCOA ? "Loading chart of accounts..." : "Select.."
              }
              isLoading={loadingCOA}
              isClearable
              classNamePrefix={error ? "react-select-error" : "react-select"}
            />
          </div>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};

export default function AccountsSetupForm() {
  const [retainedEarnings, setRetainedEarnings] =
    useState<ChartOfAccount | null>(null);
  const [incomeSummary, setIncomeSummary] = useState<ChartOfAccount | null>(
    null
  );
  const [nonLoansAR, setNonLoansAR] = useState<ChartOfAccount | null>(null);
  const [ap, setAP] = useState<ChartOfAccount | null>(null);
  const [arDebit, setARDebit] = useState<ChartOfAccount | null>(null);
  const [collections, setCollections] = useState<ChartOfAccount | null>(null);
  const [apCredit, setAPCredit] = useState<ChartOfAccount | null>(null);
  const [accountingPayable, setAccountingPayable] =
    useState<ChartOfAccount | null>(null);
  const [incomeTax, setIncomeTax] = useState<ChartOfAccount | null>(null);
  const [inputTax, setInputTax] = useState<ChartOfAccount | null>(null);
  const [outputTax, setOutputTax] = useState<ChartOfAccount | null>(null);
  const [vatRate, setVatRate] = useState("12%");

  const [chartOfAccounts, setChartOfAccounts] = useState<ChartOfAccount[]>([]);
  const [loadingCOA, setLoadingCOA] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [, setError] = useState<string | null>(null);
  const [configId, setConfigId] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isDiscardDialogOpen, setIsDiscardDialogOpen] = useState(false);

  // Store original values to check for changes
  const [originalValues, setOriginalValues] = useState<{
    retainedEarnings: ChartOfAccount | null;
    incomeSummary: ChartOfAccount | null;
    nonLoansAR: ChartOfAccount | null;
    ap: ChartOfAccount | null;
    arDebit: ChartOfAccount | null;
    collections: ChartOfAccount | null;
    apCredit: ChartOfAccount | null;
    accountingPayable: ChartOfAccount | null;
    incomeTax: ChartOfAccount | null;
    inputTax: ChartOfAccount | null;
    outputTax: ChartOfAccount | null;
    vatRate: string;
  }>({
    retainedEarnings: null,
    incomeSummary: null,
    nonLoansAR: null,
    ap: null,
    arDebit: null,
    collections: null,
    apCredit: null,
    accountingPayable: null,
    incomeTax: null,
    inputTax: null,
    outputTax: null,
    vatRate: "12%",
  });

  // Get all currently selected account IDs
  const getSelectedAccountIds = () => {
    const accounts = [
      retainedEarnings,
      incomeSummary,
      nonLoansAR,
      ap,
      arDebit,
      collections,
      apCredit,
      accountingPayable,
      incomeTax,
      inputTax,
      outputTax,
    ];
    return accounts
      .filter((account) => account?.id)
      .map((account) => account!.id);
  };

  useEffect(() => {
    const fetchAccountingDefaults = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch chart of accounts first
        await fetchChartOfAccounts();

        const result = await apiRequest<ApiResponse>(
          "get",
          "/accounting-general-defaults",
          null,
          {
            useAuth: true,
            useBranchId: true,
          }
        );

        if (result.status === 200 && result.data) {
          const { data } = result;

          setConfigId(data.data.id);
          setRetainedEarnings(data.data.coa_retained_earnings_account);
          setIncomeSummary(data.data.coa_income_expense_summary_account);
          setNonLoansAR(data.data.coa_non_loans_ar_account);
          setAP(data.data.coa_accounts_payable_account);
          setARDebit(data.data.coa_ar_collected_debit_account);
          setAPCredit(data.data.coa_ap_paid_credit_account);
          setIncomeTax(data.data.coa_income_tax_account);
          setInputTax(data.data.coa_input_tax_account);
          setOutputTax(data.data.coa_output_tax_account);

          const vatRateValue = Number.parseFloat(data.data.vat_rate);
          const formattedVatRate = `${vatRateValue}%`;
          setVatRate(formattedVatRate);

          // Store original values
          setOriginalValues({
            retainedEarnings: data.data.coa_retained_earnings_account,
            incomeSummary: data.data.coa_income_expense_summary_account,
            nonLoansAR: data.data.coa_non_loans_ar_account,
            ap: data.data.coa_accounts_payable_account,
            arDebit: data.data.coa_ar_collected_debit_account,
            collections: null,
            apCredit: data.data.coa_ap_paid_credit_account,
            accountingPayable: null,
            incomeTax: data.data.coa_income_tax_account,
            inputTax: data.data.coa_input_tax_account,
            outputTax: data.data.coa_output_tax_account,
            vatRate: formattedVatRate,
          });
        }
      } catch (err) {
        console.error("Error fetching accounting defaults:", err);
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred while fetching data"
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchAccountingDefaults();
  }, []);

  const fetchChartOfAccounts = async () => {
    setLoadingCOA(true);
    try {
      const response = await apiRequest<{
        data: { chartOfAccounts: ChartOfAccount[] };
      }>("get", "/coa", null, {
        useAuth: true,
        useBranchId: true,
      });
      setChartOfAccounts(response.data.data.chartOfAccounts);
    } catch (error) {
      console.error("Error fetching chart of accounts:", error);
    } finally {
      setLoadingCOA(false);
    }
  };

  const validateDuplicateAccounts = () => {
    const accounts = [
      {
        field: "coa_retained_earnings_account",
        account: retainedEarnings,
        label: "Retained Earnings",
      },
      {
        field: "coa_income_expense_summary_account",
        account: incomeSummary,
        label: "Income & Expense Summary",
      },
      {
        field: "coa_non_loans_ar_account",
        account: nonLoansAR,
        label: "Non-loans A/R",
      },
      { field: "coa_accounts_payable_account", account: ap, label: "A/P" },
      {
        field: "coa_ar_collected_debit_account",
        account: arDebit,
        label: "A/R Debit",
      },
      { field: "collections", account: collections, label: "Collections" },
      {
        field: "coa_ap_paid_credit_account",
        account: apCredit,
        label: "A/P Credit",
      },
      {
        field: "accounting_payable",
        account: accountingPayable,
        label: "Accounting Payable PGA",
      },
      {
        field: "coa_income_tax_account",
        account: incomeTax,
        label: "Income Tax",
      },
      { field: "coa_input_tax_account", account: inputTax, label: "Input Tax" },
      {
        field: "coa_output_tax_account",
        account: outputTax,
        label: "Output Tax",
      },
    ];

    const newFieldErrors: Record<string, string> = {};
    const accountMap = new Map<string, string[]>();

    // Group fields by account ID
    accounts.forEach(({ account, label }) => {
      if (account?.id) {
        if (!accountMap.has(account.id)) {
          accountMap.set(account.id, []);
        }
        accountMap.get(account.id)?.push(label);
      }
    });

    // Find duplicates and set errors
    accountMap.forEach((labels, accountId) => {
      if (labels.length > 1) {
        const duplicateMessage = `This account is also used in: ${labels
          .slice(1)
          .join(", ")}`;

        accounts.forEach(({ field, account }) => {
          if (account?.id === accountId) {
            newFieldErrors[field] = duplicateMessage;
          }
        });
      }
    });

    setFieldErrors(newFieldErrors);
    return Object.keys(newFieldErrors).length === 0;
  };

  useEffect(() => {
    validateDuplicateAccounts();
  }, [
    retainedEarnings,
    incomeSummary,
    nonLoansAR,
    ap,
    arDebit,
    collections,
    apCredit,
    accountingPayable,
    incomeTax,
    inputTax,
    outputTax,
  ]);

  const hasChanges = () => {
    return (
      retainedEarnings?.id !== originalValues.retainedEarnings?.id ||
      incomeSummary?.id !== originalValues.incomeSummary?.id ||
      nonLoansAR?.id !== originalValues.nonLoansAR?.id ||
      ap?.id !== originalValues.ap?.id ||
      arDebit?.id !== originalValues.arDebit?.id ||
      collections?.id !== originalValues.collections?.id ||
      apCredit?.id !== originalValues.apCredit?.id ||
      accountingPayable?.id !== originalValues.accountingPayable?.id ||
      incomeTax?.id !== originalValues.incomeTax?.id ||
      inputTax?.id !== originalValues.inputTax?.id ||
      outputTax?.id !== originalValues.outputTax?.id ||
      vatRate !== originalValues.vatRate
    );
  };

  const handleCancel = () => {
    if (hasChanges()) {
      setIsDiscardDialogOpen(true);
    } else {
      // No changes, can safely navigate away or close
      console.log("No changes to discard");
      // Add your navigation logic here
    }
  };

  const handleDiscardChanges = () => {
    // Reset all values to original
    setRetainedEarnings(originalValues.retainedEarnings);
    setIncomeSummary(originalValues.incomeSummary);
    setNonLoansAR(originalValues.nonLoansAR);
    setAP(originalValues.ap);
    setARDebit(originalValues.arDebit);
    setCollections(originalValues.collections);
    setAPCredit(originalValues.apCredit);
    setAccountingPayable(originalValues.accountingPayable);
    setIncomeTax(originalValues.incomeTax);
    setInputTax(originalValues.inputTax);
    setOutputTax(originalValues.outputTax);
    setVatRate(originalValues.vatRate);

    // Clear any field errors
    setFieldErrors({});

    setIsDiscardDialogOpen(false);

    toast.success("Changes Discarded", {
      description: "All changes have been reverted to the last saved state.",
      duration: 3000,
    });

    // Add your navigation logic here if needed
    // For example: router.push('/dashboard') or onClose()
  };

  const handleKeepEditing = () => {
    setIsDiscardDialogOpen(false);
  };

  const handleSave = async () => {
    try {
      // Validate duplicates before saving
      const isValid = validateDuplicateAccounts();
      if (!isValid) {
        toast.error("Save Failed", {
          description:
            "Please resolve duplicate account selections before saving.",
          duration: 6000,
        });
        return;
      }

      const formData = {
        coa_retained_earnings_account: retainedEarnings?.id || null,
        coa_income_expense_summary_account: incomeSummary?.id || null,
        coa_non_loans_ar_account: nonLoansAR?.id || null,
        coa_accounts_payable_account: ap?.id || null,
        coa_ar_collected_debit_account: arDebit?.id || null,
        coa_ap_paid_credit_account: apCredit?.id || null,
        coa_income_tax_account: incomeTax?.id || null,
        coa_input_tax_account: inputTax?.id || null,
        coa_output_tax_account: outputTax?.id || null,
        vat_rate: Number.parseFloat(vatRate.replace("%", "")),
      };

      const endpoint = configId
        ? `/accounting-general-defaults/${configId}`
        : "/accounting-general-defaults";
      const method = configId ? "put" : "post";

      const saveResult = await apiRequest<ApiResponse>(
        method,
        endpoint,
        formData,
        {
          useAuth: true,
          useBranchId: true,
        }
      );

      if (saveResult.status === 200) {
        toast.success("Account Setup Saved", {
          description: `Configuration saved successfully.`,
          icon: <CircleCheck className="h-5 w-5" />,
          duration: 5000,
        });

        if (!configId && saveResult.data?.data?.id) {
          setConfigId(saveResult.data.data.id);
        }

        // Update original values after successful save
        setOriginalValues({
          retainedEarnings,
          incomeSummary,
          nonLoansAR,
          ap,
          arDebit,
          collections,
          apCredit,
          accountingPayable,
          incomeTax,
          inputTax,
          outputTax,
          vatRate,
        });
      }
    } catch (err: any) {
      console.error("Error saving data:", err);
      const apiError = err?.response?.data || err;

      if (apiError?.errors) {
        const newFieldErrors: Record<string, string> = {};
        Object.keys(apiError.errors).forEach((field) => {
          if (apiError.errors[field] && apiError.errors[field].length > 0) {
            newFieldErrors[field] = apiError.errors[field][0];
          }
        });

        setFieldErrors(newFieldErrors);

        toast.error("Save Failed", {
          description: "There are errors in the form. Please check the fields.",
          duration: 6000,
        });
      } else if (apiError?.message) {
        toast.error("Save Failed", {
          description: apiError.message,
          duration: 6000,
        });
        setError(apiError.message);
      } else {
        toast.error("Save Failed", {
          description: "An unknown error occurred while saving.",
          duration: 6000,
        });
        setError("An error occurred while saving configuration.");
      }
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">
              Loading configuration...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const selectedAccountIds = getSelectedAccountIds();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">
          Default Accounts Configuration
        </CardTitle>
        <CardDescription>
          Specify accounts for various financial aspects that will be used for
          auto-journal entries
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">General Accounts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AccountField
              label="Retained Earnings"
              description="Account for retained earnings"
              required
              selectedAccount={retainedEarnings}
              onAccountSelect={setRetainedEarnings}
              error={fieldErrors.coa_retained_earnings_account}
              chartOfAccounts={chartOfAccounts}
              loadingCOA={loadingCOA}
              selectedAccountIds={selectedAccountIds}
            />
            <AccountField
              label="Income & Expense Summary"
              description="Account for income and expense summary"
              required
              selectedAccount={incomeSummary}
              onAccountSelect={setIncomeSummary}
              error={fieldErrors.coa_income_expense_summary_account}
              chartOfAccounts={chartOfAccounts}
              loadingCOA={loadingCOA}
              selectedAccountIds={selectedAccountIds}
            />
          </div>
        </div>
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Receivable & Payables</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AccountField
              label="Non-loans A/R"
              description="Account for non-loan accounts receivable"
              required
              selectedAccount={nonLoansAR}
              onAccountSelect={setNonLoansAR}
              error={fieldErrors.coa_non_loans_ar_account}
              chartOfAccounts={chartOfAccounts}
              loadingCOA={loadingCOA}
              selectedAccountIds={selectedAccountIds}
            />
            <AccountField
              label="A/P"
              description="Account for accounts payable"
              required
              selectedAccount={ap}
              onAccountSelect={setAP}
              error={fieldErrors.coa_accounts_payable_account}
              chartOfAccounts={chartOfAccounts}
              loadingCOA={loadingCOA}
              selectedAccountIds={selectedAccountIds}
            />
            <AccountField
              label="A/R Debit"
              description="Account for accounts receivable debit"
              required
              selectedAccount={arDebit}
              onAccountSelect={setARDebit}
              error={fieldErrors.coa_ar_collected_debit_account}
              chartOfAccounts={chartOfAccounts}
              loadingCOA={loadingCOA}
              selectedAccountIds={selectedAccountIds}
            />
            <AccountField
              label="Collections"
              description="Account for collections"
              required
              selectedAccount={collections}
              onAccountSelect={setCollections}
              error={fieldErrors.collections}
              chartOfAccounts={chartOfAccounts}
              loadingCOA={loadingCOA}
              selectedAccountIds={selectedAccountIds}
            />
            <AccountField
              label="A/P Credit"
              description="Account for accounts payable credit"
              required
              selectedAccount={apCredit}
              onAccountSelect={setAPCredit}
              error={fieldErrors.coa_ap_paid_credit_account}
              chartOfAccounts={chartOfAccounts}
              loadingCOA={loadingCOA}
              selectedAccountIds={selectedAccountIds}
            />
            <AccountField
              label="Accounting Payable PGA"
              description="Account for accounting payable PGA"
              required
              selectedAccount={accountingPayable}
              onAccountSelect={setAccountingPayable}
              error={fieldErrors.accounting_payable}
              chartOfAccounts={chartOfAccounts}
              loadingCOA={loadingCOA}
              selectedAccountIds={selectedAccountIds}
            />
          </div>
        </div>
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Tax Accounts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AccountField
              label="Income Tax"
              description="Account for income tax"
              required
              selectedAccount={incomeTax}
              onAccountSelect={setIncomeTax}
              error={fieldErrors.coa_income_tax_account}
              chartOfAccounts={chartOfAccounts}
              loadingCOA={loadingCOA}
              selectedAccountIds={selectedAccountIds}
            />
            <AccountField
              label="Input Tax"
              description="Account for input tax"
              required
              selectedAccount={inputTax}
              onAccountSelect={setInputTax}
              error={fieldErrors.coa_input_tax_account}
              chartOfAccounts={chartOfAccounts}
              loadingCOA={loadingCOA}
              selectedAccountIds={selectedAccountIds}
            />
            <AccountField
              label="Output Tax"
              description="Account for output tax"
              required
              selectedAccount={outputTax}
              onAccountSelect={setOutputTax}
              error={fieldErrors.coa_output_tax_account}
              chartOfAccounts={chartOfAccounts}
              loadingCOA={loadingCOA}
              selectedAccountIds={selectedAccountIds}
            />
            <div className="space-y-2">
              <div className="flex items-center">
                <Label htmlFor="vat-rate" className="font-medium">
                  VAT Rate
                </Label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input
                    id="vat-rate"
                    value={vatRate}
                    onChange={(e) => setVatRate(e.target.value)}
                    placeholder="e.g., 12%"
                  />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Current VAT rate to be applied
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-4">
        <Dialog
          open={isDiscardDialogOpen}
          onOpenChange={setIsDiscardDialogOpen}
        >
          <DialogTrigger asChild>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader className="text-center sm:text-left">
              <div className="flex items-center gap-3 mb-2">
                <DialogTitle className="text-lg font-semibold">
                  Discard changes?
                </DialogTitle>
              </div>
              <DialogDescription className="text-sm text-muted-foreground">
                Are you sure you want to discard all changes? Any unsaved
                progress will be lost.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 mt-6">
              <Button
                variant="outline"
                onClick={handleKeepEditing}
                className="w-full sm:w-auto"
              >
                Keep editing
              </Button>
              <Button
                variant="destructive"
                onClick={handleDiscardChanges}
                className="w-full sm:w-auto"
              >
                Discard changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Button onClick={handleSave}>Save Changes</Button>
      </CardFooter>
    </Card>
  );
}
