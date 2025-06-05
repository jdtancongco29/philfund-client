import { RefreshCw } from "lucide-react";
import { Button } from "../ui/button";

export default function PermissionDenied() {
  return (
    <div className="flex items-center justify-center w-full h-full p-6">
        <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">You don't have permission to access this module.</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh
            </Button>
        </div>
    </div>
  );
}
