import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";

export default function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [logoutMessage, setLogoutMessage] = useState("");

  useEffect(() => {
    if (location.state && location.state.message) {
      setLogoutMessage(location.state.message);

      const timer = setTimeout(() => {
        setLogoutMessage("");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validUsername = 'admin';
    const validPassword = 'bdyMaM$g95(;';

    if (username === validUsername && password === validPassword) {
      // Store token in cookies instead of localStorage
      Cookies.set('authToken', '0m^nv?(`-Q6tM=EWzMmXKnwur4)l!s<N=y[VzrL*}-rGnsbOVC', {
        expires: 7, // expires in 1 day
        secure: true, // only send cookie over HTTPS
        sameSite: 'strict',
      });

      navigate('/dashboard');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="max-w-sm mx-auto px-4">
      <img src="/logo.png" alt="Logo" className="mx-auto mb-6" />
      <h1 className="text-2xl font-semibold text-center text-[#09090B]">Login</h1>

      {logoutMessage && (
        <div className="p-3 text-green-700 bg-green-100 border border-green-300 rounded text-sm mb-4">
          {logoutMessage}
        </div>
      )}

      <p className="text-center text-base text-[#71717A] mb-6">
        Enter your email below to login to your account
      </p>

      <form className="space-y-5" onSubmit={handleSubmit}>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

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
          <Label htmlFor="password">
            Password <span className="text-red-500">*</span>
          </Label>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button type="submit" className="w-full bg-[var(--primary)] text-white">
          Login
        </Button>
      </form>
    </div>
  );
}