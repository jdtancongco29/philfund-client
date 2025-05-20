"use client";

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const API_URL = import.meta.env.VITE_API_URL || "";

export default function TwoFactorAuthForm() {
  const navigate = useNavigate();
  const [otpValues, setOtpValues] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState(Cookies.get("message") || "");
  const [isLoading, setIsLoading] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const tempToken = Cookies.get("temp_token");

  const cookieOptions = {
    expires: 7,
    secure: true,
    sameSite: "strict" as const,
  };

  const handleChange = (index: number, value: string) => {
    const char = value.toUpperCase();
    if (!/^[A-Z0-9]?$/.test(char)) return;

    const updated = [...otpValues];
    updated[index] = char;
    setOtpValues(updated);

    if (char && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text/plain").trim().toUpperCase();
    if (!/^[A-Z0-9]{1,6}$/.test(pasted)) return;

    const chars = pasted.slice(0, 6).split("");
    const newValues = [...otpValues];
    chars.forEach((char, i) => { if (i < 6) newValues[i] = char; });

    setOtpValues(newValues);
    const nextIndex = newValues.findIndex(v => !v);
    inputRefs.current[nextIndex !== -1 ? nextIndex : 5]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const otp = otpValues.join("");

    try {
      const res = await fetch(`${API_URL}/auth/verify-2fa`, {
        method: "POST",
        headers: {
          'Content-Type': "application/json",
          'Accept': "application/json",
        },
        body: JSON.stringify({ temp_token: tempToken, code: otp }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(true);
        setMessage(data.message || "Invalid OTP. Please try again.");
        return;
      }
      Cookies.remove('temp_token');
      Cookies.remove('message');
      Cookies.set("authToken", data.data.access_token, cookieOptions);
      Cookies.set("user", JSON.stringify(data.data.user), cookieOptions);
      navigate("/dashboard");
    } catch (err) {
      setError(true);
      setMessage("An unexpected error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/resend-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ temp_token: tempToken }),
      });

      const data = await res.json();

      const successStatuses = ["SUCCESS", "RESEND_OTP"];

      if (successStatuses.includes(data.status)) {
        setError(false);
        setMessage(data.message);
      } else {
        setError(true);
        setMessage(data.message || "Failed to resend OTP.");
      }

      const availableAfter = new Date(data.data.available_after).getTime();
      const diff = Math.max(Math.floor((availableAfter - Date.now()) / 1000), 0);
      setSecondsLeft(diff);
    } catch (err) {
      setError(true);
      setMessage("An unexpected error occurred while resending OTP.");
    }
  };

  useEffect(() => {
    if (secondsLeft === null) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (!prev || prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <img src="/logo.png" alt="Logo" className="mx-auto mb-6" />
        <h1 className="text-2xl font-bold">2 Factor Authentication</h1>
        <p className="text-muted-foreground">Enter the code sent to your email</p>
      </div>

      {message && (
        <div className={`rounded-md p-3 text-center text-sm ${error ? "bg-red-50 text-red-500" : "bg-green-50 text-green-800"}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-center gap-2">
            {otpValues.map((value, index) => (
              <Input
                key={index}
                ref={(el) => {
                    if (el) inputRefs.current[index] = el
                }}
                type="text"
                inputMode="text"
                value={value}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className="h-12 w-12 text-center text-lg uppercase"
                maxLength={1}
                autoFocus={index === 0}
              />
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Enter your one-time password.
          </p>
        </div>

        <div className="text-center space-y-2">
          <button
            type="button"
            onClick={handleResendCode}
            className="text-sm text-blue-600 hover:underline cursor-pointer"
            disabled={secondsLeft !== null && secondsLeft > 0}
          >
            I didn&apos;t receive the OTP code.
          </button>
          {secondsLeft !== null && secondsLeft > 0 && (
            <p className="text-sm text-gray-500">
              You can resend the code in {secondsLeft} second{secondsLeft !== 1 ? "s" : ""}.
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-[var(--primary)] text-white"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </div>
  );
}