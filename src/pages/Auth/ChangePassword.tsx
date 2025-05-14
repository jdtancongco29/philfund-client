import ChangePasswordForm from "@/components/change-password-form";

export default function ChangePasswordPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <ChangePasswordForm />
      </div>
    </main>
  )
}
