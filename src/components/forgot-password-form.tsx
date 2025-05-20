// src/components/ForgotPasswordForm.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import Cookies from "js-cookie";

const API_URL = import.meta.env.VITE_API_URL;
export default function ForgotPasswordForm() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [message, setMessage] = useState("")
  const isPassExpired = Cookies.get("password_expire");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, username }),
      })

      const data = await res.json()

      if (res.ok) {
        setError(false);
        setMessage(data?.message)
      } else {
        setError(true);
        setMessage(data?.message || "An error occurred. Please try again.")
      }
    } catch (error) {
      console.error(error)
      setMessage("An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-sm w-[427px] p-6">
      <img src="/logo.png" alt="Logo" className="mx-auto mb-6" />
      <h1 className="text-2xl font-semibold text-center text-[#09090B]">
        {
          isPassExpired ? (
            <>Update your password</>
          ): (
            <>Forgot Password</>
          )
        }
      </h1>
      <p className="text-center text-base text-[#71717A] mb-6">
        {
          isPassExpired ? (
            <>
               It has been 3 months since your last password change.<br />
               Please enter your username and email. A change password link will be sent to your registered email.
            </>
          ): (
            <>Enter your username and email. A change password link will be sent to your registered email.</>
          )
        }
      </p>
      {message && (
        <div className={`rounded-md p-3 text-center text-sm ${error ? "bg-red-50 text-red-500" : "bg-green-50 text-green-800"}`}>
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1">
          <Label htmlFor="username" className="font-medium text-[var(--foreground)]">
            Username <span className="text-red-500">*</span>
          </Label>
          <Input
            id="username"
            type="text"
            placeholder="Enter username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="email" className="font-medium text-[var(--foreground)]">
            Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="example@gmail.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-[var(--primary)] hover:bg-blue-600 text-white"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Request"}
        </Button>

        <div className="text-center">
          <a
            href="/login"
            className="flex gap-1 text-sm items-center text-[var(--foreground)] transition-all duration-300 hover:gap-2 hover:text-[var(--primary)] justify-center"
          >
            <ArrowLeft className="mr-1 h-[16px] w-[16px]" />
            Back to login
          </a>
        </div>
      </form>
    </div>
  )
}