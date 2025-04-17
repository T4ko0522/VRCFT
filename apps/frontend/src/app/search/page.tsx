"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import NavBar from "@/components/nav-bar"
import SearchLogsViewer from "@/components/search-logs-viewer"

export default function SearchPage() {
  const { isAuthenticated, isPendingVerification } = useAuth()
  const router = useRouter()
  const [monitoredFriendIds, setMonitoredFriendIds] = useState<string[]>([])

  // ローカルストレージから監視対象のフレンドIDを取得
  useEffect(() => {
    const storedIds = localStorage.getItem("monitoredFriendIds")
    if (storedIds) {
      setMonitoredFriendIds(JSON.parse(storedIds))
    }
  }, [])

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
          <h1 className="text-3xl font-bold mb-2">検索とログ</h1>
          <p className="text-muted-foreground mb-6">フレンドを検索したり、アクティビティログを確認したりできます</p>
          <SearchLogsViewer monitoredFriendIds={monitoredFriendIds} />
        </div>
      </main>
    </>
  )
}
