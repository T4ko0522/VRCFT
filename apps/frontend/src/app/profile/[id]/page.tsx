"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import NavBar from "@/components/nav-bar"
import UserProfileDetail from "@/components/user-profile-detail"
import { mockFriends, type Friend } from "@/lib/mock-data"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

export default function UserProfilePage() {
  const { isAuthenticated, isPendingVerification } = useAuth()
  const router = useRouter()
  const params = useParams()
  const [user, setUser] = useState<Friend | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    } else if (isPendingVerification) {
      router.push("/verify")
    } else {
      // ユーザーIDからユーザー情報を取得
      const userId = params.id as string
      const foundUser = mockFriends.find((friend) => friend.id === userId)
      setUser(foundUser || null)
      setLoading(false)
    }
  }, [isAuthenticated, isPendingVerification, router, params.id])

  if (!isAuthenticated) {
    return null
  }

  if (loading) {
    return (
      <>
        <NavBar />
        <main className="flex min-h-screen flex-col items-center pt-24 p-4">
          <div className="w-full max-w-4xl">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          </div>
        </main>
      </>
    )
  }

  if (!user) {
    return (
      <>
        <NavBar />
        <main className="flex min-h-screen flex-col items-center pt-24 p-4">
          <div className="w-full max-w-4xl">
            <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <AlertCircle className="h-6 w-6 text-destructive" />
                <div>
                  <h2 className="text-lg font-semibold">ユーザーが見つかりません</h2>
                  <p className="text-muted-foreground">指定されたIDのユーザーは存在しないか、アクセスできません。</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <NavBar />
      <main className="flex min-h-screen flex-col items-center pt-24 p-4 overflow-x-hidden">
        <div className="w-full max-w-4xl overflow-y-auto">
          <UserProfileDetail user={user} onClose={() => router.back()} />
        </div>
      </main>
    </>
  )
}
