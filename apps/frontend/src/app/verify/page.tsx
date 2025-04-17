"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import VerificationForm from "@/components/verification-form"

export default function VerifyPage() {
  const { isAuthenticated, isPendingVerification } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/")
    } else if (!isPendingVerification) {
      router.push("/login")
    }
  }, [isAuthenticated, isPendingVerification, router])

  if (!isPendingVerification) {
    return null
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2">Two-Factor Authentication</h1>
        <p className="text-center text-muted-foreground mb-6">Please enter the verification code sent to your device</p>
        <VerificationForm />
      </div>
    </main>
  )
}
