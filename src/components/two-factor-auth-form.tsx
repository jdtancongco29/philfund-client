"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function TwoFactorAuthForm() {
  const [otpValues, setOtpValues] = useState<string[]>(Array(6).fill(""))
  const inputRefs = useRef<HTMLInputElement[]>([])

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return

    const newOtpValues = [...otpValues]
    newOtpValues[index] = value.slice(0, 1) // Only take the first character

    setOtpValues(newOtpValues)

    // Auto-focus next input if value is entered
    if (value && index < 5) {
      if (inputRefs.current[index + 1]) {
        inputRefs.current[index + 1].focus()
      }
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === "Backspace") {
      if (!otpValues[index] && index > 0) {
        // If current input is empty and backspace is pressed, focus previous input
        if (inputRefs.current[index - 1]) {
          inputRefs.current[index - 1].focus()
        }
      }
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text/plain").trim()

    // Check if pasted content is a number and has a reasonable length
    if (!/^\d+$/.test(pastedData)) return

    const digits = pastedData.split("").slice(0, 6)
    const newOtpValues = [...otpValues]

    digits.forEach((digit, index) => {
      if (index < 6) {
        newOtpValues[index] = digit
      }
    })

    setOtpValues(newOtpValues)

    // Focus the next empty input or the last input if all are filled
    const nextEmptyIndex = newOtpValues.findIndex((val) => !val)
    if (nextEmptyIndex !== -1) {
      if (inputRefs.current[nextEmptyIndex]) {
        inputRefs.current[nextEmptyIndex].focus()
      }
    } else {
      if (inputRefs.current[5]) {
        inputRefs.current[5].focus()
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const otp = otpValues.join("")
    console.log("Submitting OTP:", otp)
    // Here you would typically validate the OTP with your backend
  }

  const handleResendCode = () => {
    console.log("Resending OTP code")
    // Here you would typically call your API to resend the code
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <img src="/logo.png" alt="Logo" className="mx-auto mb-6" />
        <h1 className="text-2xl font-bold">2 Factor Authentication</h1>
        <p className="text-muted-foreground">Enter your email below to login to your account</p>
      </div>

      <div className="rounded-md bg-green-50 p-3 text-sm text-green-800">
        We sent a 2FA code to <span className="font-medium">user@chilfund.com</span>.
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-center gap-2">
            {otpValues.map((value, index) => (
              <Input
                key={index}
                ref={(el) => {
                  if (el) {
                    // Create the array if it doesn't exist
                    if (!inputRefs.current) {
                      inputRefs.current = []
                    }
                    // Store the input reference at the correct index
                    inputRefs.current[index] = el
                  }
                }}
                type="text"
                inputMode="numeric"
                value={value}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className="h-12 w-12 text-center text-lg"
                maxLength={1}
                autoFocus={index === 0}
              />
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground">Enter your one-time password.</p>
        </div>

        <div className="text-center">
          <button type="button" onClick={handleResendCode} className="text-sm text-blue-600 hover:underline">
            I didn&apos;t receive the OTP code.
          </button>
        </div>

        <Button type="submit" className="w-full">
          Login
        </Button>
      </form>
    </div>
  )
}