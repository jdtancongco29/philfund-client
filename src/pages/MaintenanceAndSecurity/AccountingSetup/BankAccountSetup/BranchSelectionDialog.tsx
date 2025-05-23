import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/api";

interface Department {
  id: string;
  name: string;
}

interface Branch {
  id: string;
  code: string;
  name: string;
  email: string;
  address: string;
  contact: string;
  city: string;
  status: boolean;
  departments: Department[];
}

interface BranchSelectionDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (branch: Branch) => void;
}

export function BranchSelectionDialog({
  open,
  onClose,
  onSelect,
}: BranchSelectionDialogProps) {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (open) {
      fetchBranches();
    }
  }, [open]);

  const fetchBranches = async () => {
    setLoading(true);
    try {
      const response = await apiRequest<{ data: { branches: Branch[] } }>("get", "/branch", null, {
        useAuth: true,
        useBranchId: true, 
    
      });
      setBranches(response.data.data.branches);
    } catch (error) {
      console.error("Error fetching branches:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBranches = branches.filter((branch) =>
    branch.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Select Branch</DialogTitle>
        </DialogHeader>

        <Input
          placeholder="Search branch..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-3"
        />

        <div className="h-[300px] overflow-auto space-y-2">
          {loading ? (
            <p>Loading branches...</p>
          ) : filteredBranches.length === 0 ? (
            <p>No branches found.</p>
          ) : (
            filteredBranches.map((branch) => (
              <div
                key={branch.id}
                className="p-3 border rounded hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  onSelect(branch);
                  onClose();
                }}
              >
                <div className="font-semibold">{branch.name}</div>
                <div className="text-sm text-muted-foreground">
                  {branch.city} • {branch.contact}
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
      
    </Dialog>
    
  );
}
