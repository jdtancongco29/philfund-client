"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft } from "lucide-react"
const API_URL = import.meta.env.VITE_API_URL;
export default function ChangePasswordForm() {
    const [formData, setFormData] = useState({
        newPassword: "",
        confirmPassword: "",
    })
    const [errors, setErrors] = useState({
        newPassword: "",
        confirmPassword: "",
    })
    const [email, setEmail] = useState("")
    const [token, setToken] = useState("")
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        setEmail(params.get("email") || "")
        setToken(params.get("token") || "")
    }, [])

    const validatePassword = (password: string) => {
        const hasCapital = /[A-Z]/.test(password)
        const hasSmall = /[a-z]/.test(password)
        const hasNumber = /\d/.test(password)
        const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(password)

        if (!password) return "Password is required"
        if (password.length < 16) return "Password must be at least 16 characters long"
        if (!hasCapital || !hasSmall || !hasNumber || !hasSpecial) {
            return "Password must contain capital letters, small letters, numbers, and at least one special character"
        }

        return ""
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        setErrors((prev) => ({ ...prev, [name]: "" }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const newPasswordError = validatePassword(formData.newPassword)
        const confirmPasswordError =
            formData.confirmPassword !== formData.newPassword ? "Passwords do not match" : ""

        setErrors({
            newPassword: newPasswordError,
            confirmPassword: confirmPasswordError,
        })

        if (!newPasswordError && !confirmPasswordError) {
            setLoading(true)
            try {
                const response = await fetch(`${API_URL}/auth/reset-password`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        token,
                        password: formData.newPassword,
                        password_confirmation: formData.confirmPassword,
                    }),
                })

                const data = await response.json()

                if (response.ok) {
                    setMessage("Password changed successfully.")
                } else {
                    setMessage(data.message || "Failed to reset password.")
                }
            } catch (error) {
                console.error(error)
                setMessage("An unexpected error occurred.")
            } finally {
                setLoading(false)
            }
        }
    }

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <img src="/logo.png" alt="Logo" className="mx-auto mb-6" />
                <h1 className="text-2xl font-bold">Change Password</h1>
                <p className="text-muted-foreground">Please update your password</p>
                {message && (
                    <div className={`rounded-md p-3 text-center text-sm bg-red-50 text-red-500`}>
                    {message}
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2 text-left">
                    <label htmlFor="newPassword" className="text-sm font-medium">
                        New Password <span className="text-red-500">*</span>
                    </label>
                    <Input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className={errors.newPassword ? "border-red-500" : ""}
                    />
                    {errors.newPassword && (
                        <p className="text-sm text-red-500">{errors.newPassword}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                        Password much contain <span className="font-medium">capital letters</span>,{" "}
                        <span className="font-medium">small letters</span>,{" "}
                        <span className="font-medium">number</span> and at least{" "}
                        <span className="font-medium">one special character</span>.
                    </p>
                </div>

                <div className="space-y-2 text-left">
                    <label htmlFor="confirmPassword" className="text-sm font-medium">
                        Confirm new Password <span className="text-red-500">*</span>
                    </label>
                    <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={errors.confirmPassword ? "border-red-500" : ""}
                    />
                    {errors.confirmPassword && (
                        <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                    )}
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Saving..." : "Save password"}
                </Button>
            </form>

            <div className="text-center">
                <a
                    href="/login"
                    className="flex gap-1 text-sm items-center text-[var(--foreground)] transition-all duration-300 hover:gap-2 hover:text-[var(--primary)] justify-center"
                >
                    <ArrowLeft className="mr-1 h-[16px] w-[16px]" />
                    Back to login
                </a>
            </div>
        </div>
    )
}