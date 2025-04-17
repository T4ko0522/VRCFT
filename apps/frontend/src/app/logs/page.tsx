"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import NavBar from "@/components/nav-bar"
import LogsViewer from "@/components/logs-viewer"
import { mockFriends } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Eye, EyeOff, AlertCircle } from "lucide-react"
import Image from "next/image"

export default function LogsPage() {
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

  // 監視対象のフレンドIDをローカルストレージに保存
  useEffect(() => {
    if (monitoredFriendIds.length > 0) {
      localStorage.setItem("monitoredFriendIds", JSON.stringify(monitoredFriendIds))
    }
  }, [monitoredFriendIds])

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

  // 監視対象のフレンドを切り替える
  const toggleMonitoredFriend = (id: string) => {
    if (monitoredFriendIds.includes(id)) {
      setMonitoredFriendIds(monitoredFriendIds.filter((friendId) => friendId !== id))
    } else {
      setMonitoredFriendIds([...monitoredFriendIds, id])
    }
  }

  // 監視対象のフレンドを取得
  const monitoredFriends = mockFriends.filter((friend) => monitoredFriendIds.includes(friend.id))
  const otherFriends = mockFriends.filter((friend) => !monitoredFriendIds.includes(friend.id))

  return (
    <>
      <NavBar />
      <main className="flex min-h-screen flex-col items-center pt-24 p-4">
        <div className="w-full max-w-4xl">
          <h1 className="text-3xl font-bold mb-2">フレンドログ</h1>
          <p className="text-muted-foreground mb-6">選択したフレンドのアクティビティログを監視します</p>

          {monitoredFriendIds.length === 0 ? (
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <AlertCircle className="h-6 w-6 text-yellow-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-medium text-lg mb-2">監視対象のフレンドがいません</h3>
                    <p className="text-muted-foreground mb-4">
                      ログを表示するには、下のリストからフレンドを選択して監視対象に追加してください。
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex flex-wrap gap-2 mb-6">
                {monitoredFriends.map((friend) => (
                  <Button
                    key={friend.id}
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => toggleMonitoredFriend(friend.id)}
                  >
                    <div className="relative w-6 h-6">
                      <Image
                        src={friend.avatarUrl || "/placeholder.svg"}
                        alt={friend.name}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                    </div>
                    {friend.name}
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  </Button>
                ))}
              </div>

              <LogsViewer monitoredFriendIds={monitoredFriendIds} />

              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">他のフレンドを監視</h2>
                <div className="flex flex-wrap gap-2">
                  {otherFriends.map((friend) => (
                    <Button
                      key={friend.id}
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={() => toggleMonitoredFriend(friend.id)}
                    >
                      <div className="relative w-6 h-6">
                        <Image
                          src={friend.avatarUrl || "/placeholder.svg"}
                          alt={friend.name}
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                      </div>
                      {friend.name}
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  )
}
