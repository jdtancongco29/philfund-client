// src/components/LoginForm.tsx
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Static credentials for demonstration
    const validUsername = 'admin';
    const validPassword = 'password123';

    if (username === validUsername && password === validPassword) {
      // Simulate authentication token
      localStorage.setItem('authToken', 'defaultTokent123');
      navigate('/dashboard');
    } else {
      setError('Invalid username or password');
    }
  };
  return (
    <div className="max-w-sm mx-auto px-4">
      <img src="/logo.png" alt="Logo" className="mx-auto mb-6"/>
      <h1 className="text-2xl font-semibold text-center text-[#09090B]">Login</h1>
      <p className="text-center text-base text-[#71717A] mb-6">
        Enter your email below to login to your account
      </p>

      <form className="space-y-5" onSubmit={handleSubmit}>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <div className="space-y-1">
          <Label htmlFor="username" className="font-medium text-[var(--foreground)]">
            Username <span className="text-red-500">*</span>
          </Label>
          <Input
            id="username"
            placeholder="Enter username"
            required
            className="border-[var(--border)]"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <Label htmlFor="password" className="font-medium text-[var(--foreground)">
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

        <Button type="submit" className="w-full bg-[var(--primary)] hover:bg-blue-600 text-white">
            Login
        </Button>
      </form>
    </div>
  )
}
