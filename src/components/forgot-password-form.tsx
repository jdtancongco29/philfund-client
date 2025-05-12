// src/components/ForgotPasswordForm.tsx
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"

export default function ForgotPasswordForm() {
  return (
    <div className="max-w-sm w-full px-4">
      <img src="/logo.png" alt="Logo" className="mx-auto mb-6"/>
      <h1 className="text-2xl font-semibold text-center text-[#09090B]">Forgot Password</h1>
      <p className="text-center text-sm text-[#71717A] mb-6">
        Enter your username and email. A change password link will be sent to your registered email.
      </p>

      <form className="space-y-5">
        <div className="space-y-1">
          <Label htmlFor="username" className="font-medium text-[var(--foreground)">
            Username <span className="text-red-500">*</span>
          </Label>
          <Input id="username" type="username" placeholder="Enter username" required />
        </div>
        <div className="space-y-1">
          <Label htmlFor="email" className="font-medium text-[var(--foreground)">
            Email <span className="text-red-500">*</span>
          </Label>
          <Input id="email" type="email" placeholder="example@gmail.com" required />
        </div>

        <Button type="submit" className="w-full bg-[var(--primary)] hover:bg-blue-600 text-white">
          Send Request
        </Button>

        <a href="/login" className="flex gap-1 text-[var(--foreground)] transition-all duration-300 hover:gap-2 hover:text-[var(--primary)] justify-center">
          <ArrowLeft/>
          Back to login
        </a>
      </form>
    </div>
  )
}
