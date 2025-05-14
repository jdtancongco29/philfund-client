import TwoFactorAuthForm from "@/components/two-factor-auth-form";

export default function TwoFactorAuthPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <TwoFactorAuthForm />
      </div>
    </main>
  )
}
