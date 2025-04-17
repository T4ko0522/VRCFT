"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import NavBar from "@/components/nav-bar"
import SettingsForm from "@/components/settings-form"

export default function SettingsPage() {
  const { isAuthenticated, isPendingVerification } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    } else if (isPendingVerification) {
      router.push("/verify")
    }
  }, [isAuthenticated, isPendingVerification, router])

  if (!isAuthenticated) {
    return null
  }

  return (
    <>
      <NavBar />
      <main className="flex min-h-screen flex-col items-center pt-24 p-4">
        <div className="w-full max-w-2xl">
          <h1 className="text-3xl font-bold mb-6">Settings</h1>
          <SettingsForm />
        </div>
      </main>
    </>
  )
}
