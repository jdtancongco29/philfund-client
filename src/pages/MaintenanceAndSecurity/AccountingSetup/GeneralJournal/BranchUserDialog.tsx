import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/api";

interface BranchUser {
  id: string;
  name: string;
}

interface BranchUserDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (user: BranchUser) => void;
}

export function BranchUserDialog({
  open,
  onClose,
  onSelect,
}: BranchUserDialogProps) {
  const [users, setUsers] = useState<BranchUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (open) {
      fetchBranchUsers();
    }
  }, [open]);

  const fetchBranchUsers = async () => {
    setLoading(true);
    try {
      const response = await apiRequest<{ data: { users: BranchUser[] } }>(
        "get",
        "/branch/users",
        null,
        {
          useAuth: true,
          useBranchId: true,
        }
      );
      setUsers(response.data.data.users);
    } catch (error) {
      console.error("Error fetching branch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Select Branch User</DialogTitle>
        </DialogHeader>

        <Input
          placeholder="Search user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-3"
        />

        <div className="h-[300px] overflow-auto space-y-2">
          {loading ? (
            <p>Loading users...</p>
          ) : filteredUsers.length === 0 ? (
            <p>No users found.</p>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className="p-3 border rounded hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  onSelect(user);
                  onClose();
                }}
              >
                <div className="font-semibold">{user.name}</div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
