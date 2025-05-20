import { useEffect, useState, useCallback } from "react";
import { 
  useNavigate
} from "react-router-dom";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetchWithHeaders } from "@/lib/api";

export default function LoginForm() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [validation, setValidation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const cookieOptions = {
    expires: 7,
    secure: true,
    sameSite: "strict" as const,
  };
  // Clear all cookies on mount
  useEffect(() => {
    Object.keys(Cookies.get()).forEach((cookie) => Cookies.remove(cookie));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);

      try {
        const response = await fetchWithHeaders('/auth/login', {
          method: 'POST',
          auth: false,
          branch: false,
          body: JSON.stringify({ username, password }),
        });
        const errorStatuses = ["ACCOUNT_BLOCKED", "BRANCH_OPENER_REQUIRED", "ACCESS_DENIED", "INVALID_CREDENTIALS"];
        const passwordExpired = ["PASSWORD_EXPIRED"];
        const twoFactor = ["2FA_REQUIRED"];
        if(errorStatuses.includes(response.status)){
          setError(true);
          setValidation(response.message);
        }else if(passwordExpired.includes(response.status)){
          Cookies.set("password_expire", "true", cookieOptions);
          navigate('/forgot-password');
        }else if(twoFactor.includes(response.status)){
          Cookies.set("temp_token", response.data.temp_token, cookieOptions);
          Cookies.set("message", response.message, cookieOptions);
          navigate('/2fa-verification');
        }else{
          Cookies.set("authToken", response.data.access_token, cookieOptions);
          Cookies.set("user", JSON.stringify(response.data.user), cookieOptions);
          navigate('/dashboard');
        }
      } catch (err) {
        console.error(err);
        setValidation('An unexpected error occurred. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    },
    [username, password, navigate]
  );

  return (
    <div className="max-w-sm mx-auto px-4">
      <img src="/logo.png" alt="Logo" className="mx-auto mb-6" />
      <h1 className="text-2xl font-semibold text-center text-[#09090B]">Login</h1>
      <p className="text-center text-base text-[#71717A] mb-6">
        Enter your email below to login to your account
      </p>

      <form className="space-y-5" onSubmit={handleSubmit}>
        {validation && (
          <div className={`rounded-md p-3 text-center text-sm ${error ? "bg-red-50 text-red-500" : "bg-green-50 text-green-800"}`}>
            {validation}
          </div>
        )}
        <div className="space-y-1">
          <Label htmlFor="username">
            Username <span className="text-red-500">*</span>
          </Label>
          <Input
            id="username"
            required
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between">
            <Label htmlFor="password">
              Password <span className="text-red-500">*</span>
            </Label>
            <a href="/forgot-password" className="text-sm text-[var(--foreground)] hover:underline">
              Forgot your password?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-[var(--primary)] text-white"
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>
      </form>
    </div>
  );
}