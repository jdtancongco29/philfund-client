import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "../ui/button";
import { Alert, AlertDescription } from "../ui/alert";

export default function PermissionError({ permissionError }: { permissionError: string }) {
  return (
    <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
            <span>Failed to load permissions: {permissionError}</span>
            <Button variant="outline" size="sm" onClick={() => window.location.reload()} className="ml-2">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
            </Button>
        </AlertDescription>
    </Alert>
  );
}
