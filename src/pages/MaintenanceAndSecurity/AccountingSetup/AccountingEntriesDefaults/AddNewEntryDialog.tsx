import  { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, CircleCheck } from 'lucide-react';
import { toast } from 'sonner';
import { apiRequest } from '@/lib/api';

interface ValidationErrors {
  [key: string]: string[];
}

interface Item {
  coa_id: string;
  coa_name?: string;
  debit: string;
  credit: string;
}

interface ChartOfAccount {
  id: string;
  code: string;
  name: string;
  description: string;
  major_classification: string;
  category: string;
  is_header: boolean;
  parent_id: string | null;
  is_contra: boolean;
  normal_balance: string;
  special_classification: string;
  status: boolean;
}

interface AccountEntry {
  id?: string;
  name: string;
  particulars?: string;
  transaction_amount: string;
  status: boolean;
  details?: Array<{
    coa: {
      id: string;
      code: string;
      name: string;
    };
    debit: string;
    credit: string;
  }>;
}

interface AddEditEntryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  editingEntry?: AccountEntry | null;
}

// Utility functions for balance calculations
const calculateTotalDebit = (items: Item[]): number => {
  return items.reduce((total, item) => total + (parseFloat(item.debit) || 0), 0);
};

const calculateTotalCredit = (items: Item[]): number => {
  return items.reduce((total, item) => total + (parseFloat(item.credit) || 0), 0);
};

const isBalanced = (items: Item[]): boolean => {
  const totalDebit = calculateTotalDebit(items);
  const totalCredit = calculateTotalCredit(items);
  return Math.abs(totalDebit - totalCredit) < 0.01; // Allow for small floating point differences
};

// Error Display Component
const ErrorMessage = ({ errors }: { errors: string[] }) => {
  if (!errors || errors.length === 0) return null;
  
  return (
    <div className="mt-1 space-y-1">
      {errors.map((error, index) => (
        <div key={index} className="flex items-center gap-1 text-sm text-red-600">
          <AlertCircle className="h-3 w-3 flex-shrink-0" />
          <span>{error}</span>
        </div>
      ))}
    </div>
  );
};

// Balance Validation Component
const BalanceValidationMessage = ({ items }: { items: Item[] }) => {
  const totalDebit = calculateTotalDebit(items);
  const totalCredit = calculateTotalCredit(items);
  const balanced = isBalanced(items);
  
  if (items.length === 0) return null;
  
  return (
    <div className={`mt-2 p-3 rounded-md border ${balanced ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          {balanced ? (
            <CircleCheck className="h-4 w-4 text-green-600" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600" />
          )}
          <span className={balanced ? 'text-green-700' : 'text-red-700'}>
            {balanced ? 'Balanced' : 'Out of Balance'}
          </span>
        </div>
        <div className="flex gap-4 text-xs">
          <span className="text-gray-600">
            Total Debit: <span className="font-medium">{totalDebit.toFixed(2)}</span>
          </span>
          <span className="text-gray-600">
            Total Credit: <span className="font-medium">{totalCredit.toFixed(2)}</span>
          </span>
          {!balanced && (
            <span className="text-red-600">
              Difference: <span className="font-medium">{Math.abs(totalDebit - totalCredit).toFixed(2)}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default function AddEditEntryDialog({
  isOpen,
  onClose,
  onSave,
  editingEntry = null,
}: AddEditEntryDialogProps) {
  const [name, setName] = useState("");
  const [particulars, setParticulars] = useState("");
  const [transactionAmount, setTransactionAmount] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Error state
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  // COA Dialog states
  const [isCOADialogOpen, setIsCOADialogOpen] = useState(false);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
  const [chartOfAccounts, setChartOfAccounts] = useState<ChartOfAccount[]>([]);
  const [coaLoading, setCoaLoading] = useState(false);
  const [coaSearch, setCoaSearch] = useState("");

  const isEditMode = Boolean(editingEntry?.id);

  // Helper function to get field errors
  const getFieldErrors = (fieldName: string): string[] => {
    return validationErrors[fieldName] || [];
  };

  // Helper function to check if field has errors
  const hasFieldError = (fieldName: string): boolean => {
    return getFieldErrors(fieldName).length > 0;
  };

  // Clear errors when field values change
  const clearFieldError = (fieldName: string) => {
    if (hasFieldError(fieldName)) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  // Populate form with editing entry data
  useEffect(() => {
    if (isOpen) {
      // Clear errors when dialog opens
      setValidationErrors({});
      
      if (editingEntry) {
        setName(editingEntry.name || "");
        setParticulars(editingEntry.particulars || "");
        setTransactionAmount(editingEntry.transaction_amount || "");
        
        // Convert details to items format
        if (editingEntry.details && editingEntry.details.length > 0) {
          const convertedItems: Item[] = editingEntry.details.map(detail => ({
            coa_id: detail.coa.id,
            coa_name: `${detail.coa.code} - ${detail.coa.name}`,
            debit: detail.debit,
            credit: detail.credit,
          }));
          setItems(convertedItems);
        } else {
          setItems([]);
        }
      } else {
        // Reset form for new entry
        resetForm();
      }
    }
  }, [isOpen, editingEntry]);

  useEffect(() => {
    if (isCOADialogOpen) {
      fetchChartOfAccounts();
    }
  }, [isCOADialogOpen]);

  const fetchChartOfAccounts = async () => {
    setCoaLoading(true);
    try {
      const response = await apiRequest<{ data: { chartOfAccounts: ChartOfAccount[] } }>(
        "get",
        "/coa",
        null,
        {
          useAuth: true,
          useBranchId: true,
        }
      );
      setChartOfAccounts(response.data.data.chartOfAccounts);
    } catch (error) {
      console.error("Error fetching chart of accounts:", error);
      toast.error("Error", {
        description: "Failed to load Chart of Accounts. Please try again.",
        duration: 3000,
      });
    } finally {
      setCoaLoading(false);
    }
  };

  const handleCOASelect = (coa: ChartOfAccount) => {
    if (selectedItemIndex !== null) {
      const newItems = [...items];
      newItems[selectedItemIndex] = {
        ...newItems[selectedItemIndex],
        coa_id: coa.id,
        coa_name: `${coa.code} - ${coa.name}`,
      };
      setItems(newItems);
      
      // Clear COA-related errors for this item
      clearFieldError(`items.${selectedItemIndex}.coa_id`);
      
      console.log('COA selected:', coa, 'for item index:', selectedItemIndex);
    }
    setIsCOADialogOpen(false);
    setSelectedItemIndex(null);
    setCoaSearch("");
  };

  const filteredAccounts = chartOfAccounts.filter((account) =>
    account.name.toLowerCase().includes(coaSearch.toLowerCase()) ||
    account.code.toLowerCase().includes(coaSearch.toLowerCase())
  );

  const addItem = () => {
    setItems([...items, { coa_id: "", debit: "", credit: "" }]);
    // Clear balance errors when adding new items
    clearFieldError('items');
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
    // Clear errors for removed item
    const itemErrors = Object.keys(validationErrors).filter(key => 
      key.startsWith(`items.${index}`)
    );
    if (itemErrors.length > 0) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        itemErrors.forEach(key => delete newErrors[key]);
        return newErrors;
      });
    }
    
    // Clear balance errors when removing items
    clearFieldError('items');
    
    // Update transaction amount when items change
    updateTransactionAmount();
  };

  const updateItem = (index: number, field: keyof Item, value: string) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      [field]: value,
    };
    setItems(newItems);
    
    // Clear item-specific errors when updating
    const fieldKey = field === 'coa_id' ? `items.${index}.coa_id` : `items.${index}`;
    clearFieldError(fieldKey);
    
    // Clear balance-related errors when amounts change
    if (field === 'debit' || field === 'credit') {
      clearFieldError('items');
      // Update transaction amount when amounts change
      setTimeout(() => updateTransactionAmount(), 0);
    }
  };

  // Update transaction amount based on total credit
 const updateTransactionAmount = () => {
  const totalDebit = calculateTotalDebit(items);
  setTransactionAmount(totalDebit.toFixed(2));
};

  const resetForm = () => {
    setName("");
    setParticulars("");
    setTransactionAmount("");
    setItems([]);
    setValidationErrors({});
    setCoaSearch("");
  };

  const createOrUpdateEntry = async (payload: any) => {
    try {
      setIsSubmitting(true);
      const method = isEditMode ? "put" : "post";
      const url = isEditMode ? `/default-entry/${editingEntry?.id}` : "/default-entry";
      
      const response = await apiRequest(
        method,
        url,
        payload,
        {
          useAuth: true,
          useBranchId: true,
        }
      );
      return response.data;
    } catch (error: any) {
      // Handle API validation errors
      if (error.response?.data?.errors) {
        setValidationErrors(error.response.data.errors);
        
        // Show specific error message for balance issues
        const errorMessage = error.response.data.message;
        if (errorMessage?.includes('debit and credit amounts must be equal')) {
          toast.error("Balance Error", {
            description: "The total debit and credit amounts must be equal. Please adjust your entries.",
            duration: 6000,
          });
        } else {
          toast.error("Validation Error", {
            description: errorMessage || "Please fix the errors below and try again.",
            duration: 5000,
          });
        }
      } else {
        // Handle other types of errors
        const action = isEditMode ? "updating" : "creating";
        toast.error(`Error ${action} Default Entry`, {
          description: "An unexpected error occurred. Please try again.",
          duration: 5000,
        });
      }
      
      console.error(`Failed to ${isEditMode ? 'update' : 'create'} default entry:`, error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    // Clear previous validation errors
    setValidationErrors({});
    
    // Client-side validation for balance
    if (items.length > 0 && !isBalanced(items)) {
      setValidationErrors({
        items: ["The total debit and credit amounts must be equal."]
      });
      toast.error("Balance Error", {
        description: "The total debit and credit amounts must be equal. Please adjust your entries.",
        duration: 6000,
      });
      return;
    }
    
    if (name && particulars && transactionAmount && items.length) {
      try {
        const payload = {
          name,
          particulars,
          transaction_amount: parseFloat(transactionAmount) || 0,
          items: items.map((item) => ({
            coa_id: item.coa_id,
            debit: parseFloat(item.debit) || 0,
            credit: parseFloat(item.credit) || 0,
          })),
        };

        const result = await createOrUpdateEntry(payload);
        
        // Pass the result to parent component
        onSave({
          ...result,
          id: isEditMode ? editingEntry?.id : result.id,
          name,
          particulars,
          transaction_amount: parseFloat(transactionAmount) || 0,
        });
        
        resetForm();
        onClose();
        
        const action = isEditMode ? "Updated" : "Created";
        toast.success(`Default Entry ${action}`, {
          description: `Default entry has been successfully ${action.toLowerCase()}.`,
          icon: <CircleCheck className="h-5 w-5" />,
          duration: 5000,
        });
        
        console.log(`Default entry ${action.toLowerCase()} successfully:`, result);
        
      } catch (error) {
        // Error handling is done in createOrUpdateEntry
        console.error(`Error ${isEditMode ? 'updating' : 'creating'} default entry:`, error);
      }
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[700px] overflow-y-auto max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {isEditMode ? "Edit Default Entry" : "Add Default Entry"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    clearFieldError('name');
                  }}
                  placeholder="Entry name"
                  disabled={isSubmitting}
                  className={hasFieldError('name') ? 'border-red-500' : ''}
                />
                <ErrorMessage errors={getFieldErrors('name')} />
              </div>
              <div className="space-y-2">
                <Label>
                  Particulars <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={particulars}
                  onChange={(e) => {
                    setParticulars(e.target.value);
                    clearFieldError('particulars');
                  }}
                  placeholder="Particulars"
                  disabled={isSubmitting}
                  className={hasFieldError('particulars') ? 'border-red-500' : ''}
                />
                <ErrorMessage errors={getFieldErrors('particulars')} />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>
                  Transaction Amount <span className="text-red-500">*</span>
                </Label>
              <Input
                    type="number"
                    step="0.01"
                    value={transactionAmount}
                    readOnly
                    placeholder="0.00"
                    className="bg-gray-100 cursor-not-allowed !text-black"
                  />

                <ErrorMessage errors={getFieldErrors('transaction_amount')} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label>
                  Items <span className="text-red-500">*</span>
                </Label>
                <Button 
                  variant="outline" 
                  onClick={addItem}
                  disabled={isSubmitting}
                >
                  Add Item
                </Button>
              </div>
              
              {/* Display balance validation message */}
              <BalanceValidationMessage items={items} />
              
              {/* Display general items errors (like balance errors) */}
              <ErrorMessage errors={getFieldErrors('items')} />
              
              {items.map((item, index) => (
                <div
                  key={index}
                  className="border p-4 my-2 rounded-md space-y-2"
                >
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>COA</Label>
                      <div
                        className={`border rounded px-3 py-2 cursor-pointer bg-white ${
                          isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                        } ${hasFieldError(`items.${index}.coa_id`) ? 'border-red-500' : ''}`}
                        onClick={() => {
                          if (!isSubmitting) {
                            console.log('COA field clicked for item index:', index);
                            setSelectedItemIndex(index);
                            setIsCOADialogOpen(true);
                          }
                        }}
                      >
                        {item.coa_name || (
                          <span className="text-gray-400">Select COA</span>
                        )}
                      </div>
                      <ErrorMessage errors={getFieldErrors(`items.${index}.coa_id`)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Debit</Label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={item.debit}
                        onChange={(e) => updateItem(index, "debit", e.target.value)}
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Credit</Label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={item.credit}
                        onChange={(e) => updateItem(index, "credit", e.target.value)}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  {/* Display item-level errors (like uniqueness errors) */}
                  <ErrorMessage errors={getFieldErrors(`items.${index}`)} />
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeItem(index)}
                      disabled={isSubmitting}
                    >
                      Remove Item
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <DialogFooter className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                isSubmitting ||
                !name ||
                !particulars ||
                !transactionAmount ||
                items.length === 0 ||
                !isBalanced(items) // Add balance check to disable button
              }
            >
              {isSubmitting ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update Entry" : "Add Entry")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* COA Selection Dialog */}
      <Dialog open={isCOADialogOpen} onOpenChange={(isOpen) => {
        if (!isOpen) {
          setIsCOADialogOpen(false);
          setSelectedItemIndex(null);
          setCoaSearch("");
        }
      }}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Select Chart of Account</DialogTitle>
          </DialogHeader>

          <Input
            placeholder="Search by name or code..."
            value={coaSearch}
            onChange={(e) => setCoaSearch(e.target.value)}
            className="mb-3"
          />

          <div className="h-[300px] overflow-auto space-y-2">
            {coaLoading ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Loading chart of accounts...</p>
              </div>
            ) : filteredAccounts.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">No matching accounts found.</p>
              </div>
            ) : (
              filteredAccounts.map((coa) => (
                <div
                  key={coa.id}
                  className="p-3 border rounded hover:bg-gray-100 cursor-pointer transition-colors"
                  onClick={() => {
                    console.log('COA item clicked:', coa);
                    handleCOASelect(coa);
                  }}
                >
                  <div className="font-semibold">{coa.code} - {coa.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {coa.category} | {coa.normal_balance}
                  </div>
                  {coa.description && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {coa.description}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}