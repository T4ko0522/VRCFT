"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import NavBar from "@/components/nav-bar"
import { ThemeGrid } from "@/components/theme-preview"
import { Label } from "@/components/ui/label"
import { Palette } from "lucide-react"

export default function ThemesPage() {
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
        <div className="w-full max-w-4xl">
          <div className="flex items-center gap-2 mb-2">
            <Palette className="h-6 w-6" />
            <h1 className="text-3xl font-bold">テーマ</h1>
          </div>
          <p className="text-muted-foreground mb-6">あなたのスタイルに合ったテーマを選択してください。</p>

          <div className="space-y-6">
            <div>
              <Label className="text-lg mb-2 block">利用可能なテーマ</Label>
              <p className="text-muted-foreground mb-4">テーマをクリックしてアプリケーションに適用します。</p>
              <ThemeGrid />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
