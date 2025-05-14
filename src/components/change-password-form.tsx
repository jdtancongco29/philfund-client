"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft } from "lucide-react"

export default function ChangePasswordForm() {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState({
    newPassword: "",
    confirmPassword: "",
  })

  const validatePassword = (password: string) => {
    const hasCapital = /[A-Z]/.test(password)
    const hasSmall = /[a-z]/.test(password)
    const hasNumber = /\d/.test(password)
    const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(password)

    if (!password) {
      return "Password is required"
    }

    if (password.length < 8) {
      return "Password must be at least 8 characters long"
    }

    if (!hasCapital || !hasSmall || !hasNumber || !hasSpecial) {
      return "Password must contain capital letters, small letters, numbers, and at least one special character"
    }

    return ""
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear errors when typing
    setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate password
    const newPasswordError = validatePassword(formData.newPassword)
    const confirmPasswordError = formData.confirmPassword !== formData.newPassword ? "Passwords do not match" : ""

    setErrors({
      newPassword: newPasswordError,
      confirmPassword: confirmPasswordError,
    })

    // If no errors, submit form
    if (!newPasswordError && !confirmPasswordError) {
      console.log("Password changed successfully:", formData.newPassword)
      // Here you would typically call your API to change the password
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <img src="/logo.png" alt="Logo" className="mx-auto mb-6" />
        <h1 className="text-2xl font-bold">Change Password</h1>
        <p className="text-muted-foreground">Please update your password</p>
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
          {errors.newPassword && <p className="text-sm text-red-500">{errors.newPassword}</p>}
          <p className="text-xs text-muted-foreground">
            Password much contain <span className="font-medium">capital letters</span>,{" "}
            <span className="font-medium">small letters</span>, <span className="font-medium">number</span> and at least{" "}
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
          {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
        </div>

        <Button type="submit" className="w-full">
          Save password
        </Button>
      </form>

      <div className="text-center">
        <a href="/" className="inline-flex items-center text-sm text-blue-600 hover:underline">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to login
        </a>
      </div>
    </div>
  )
}