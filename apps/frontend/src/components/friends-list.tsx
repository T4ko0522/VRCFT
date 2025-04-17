"use client"

import { useState } from "react"
import Image from "next/image"
import { Star, StarOff, Search, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { type Friend, type FriendStatus, mockFriends } from "@/lib/mock-data"
import { useRouter } from "next/navigation"

// FriendsListProps インターフェースを追加
interface FriendsListProps {
  onSelectUser?: (userId: string) => void
}

// FriendsList コンポーネントの引数に props を追加
export default function FriendsList({ onSelectUser }: FriendsListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [friends, setFriends] = useState(mockFriends)
  const [monitoredFriends, setMonitoredFriends] = useState<string[]>([])
  const router = useRouter()

  const toggleFavorite = (id: string) => {
    setFriends(friends.map((friend) => (friend.id === id ? { ...friend, isFavorite: !friend.isFavorite } : friend)))
  }

  const toggleMonitored = (id: string) => {
    if (monitoredFriends.includes(id)) {
      setMonitoredFriends(monitoredFriends.filter((friendId) => friendId !== id))
    } else {
      setMonitoredFriends([...monitoredFriends, id])
    }
  }

  // viewProfile 関数を更新
  const viewProfile = (id: string) => {
    if (onSelectUser) {
      onSelectUser(id)
    } else {
      router.push(`/profile/${id}`)
    }
  }

  const filteredFriends = friends.filter((friend) => friend.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const onlineFriends = filteredFriends.filter((friend) => friend.status !== "offline")
  const favoriteFriends = filteredFriends.filter((friend) => friend.isFavorite)
  const monitoredFriendsList = filteredFriends.filter((friend) => monitoredFriends.includes(friend.id))
  const allFriends = filteredFriends

  const getStatusColor = (status: FriendStatus): string => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "away":
        return "bg-yellow-500"
      case "busy":
        return "bg-red-500"
      case "in-game":
        return "bg-purple-500"
      case "offline":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (friend: Friend): string => {
    switch (friend.status) {
      case "online":
        return "オンライン"
      case "away":
        return "離席中"
      case "busy":
        return "取り込み中"
      case "in-game":
        return `プレイ中: ${friend.game}`
      case "offline":
        return `最終オンライン: ${friend.lastSeen}`
      default:
        return friend.status
    }
  }

  const renderFriendsList = (friendsList: Friend[]) => {
    if (friendsList.length === 0) {
      return <div className="text-center py-8 text-muted-foreground">フレンドが見つかりません</div>
    }

    return (
      <div className="space-y-2">
        {friendsList.map((friend) => (
          <div
            key={friend.id}
            className="flex items-center p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
            onClick={() => viewProfile(friend.id)}
          >
            <div className="relative">
              <Image
                src={friend.avatarUrl || "/placeholder.svg"}
                alt={friend.name}
                width={48}
                height={48}
                className="rounded-full"
              />
              <span
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(
                  friend.status,
                )}`}
              />
            </div>
            <div className="ml-3 flex-grow">
              <div className="font-medium">{friend.name}</div>
              <div className="text-sm text-muted-foreground">{getStatusText(friend)}</div>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  toggleMonitored(friend.id)
                }}
                className="text-muted-foreground hover:text-primary"
                title={monitoredFriends.includes(friend.id) ? "監視を解除" : "監視する"}
              >
                {monitoredFriends.includes(friend.id) ? (
                  <Eye className="h-5 w-5 text-primary" />
                ) : (
                  <EyeOff className="h-5 w-5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  toggleFavorite(friend.id)
                }}
                className="text-muted-foreground hover:text-primary"
                title={friend.isFavorite ? "お気に入りから削除" : "お気に入りに追加"}
              >
                {friend.isFavorite ? (
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ) : (
                  <StarOff className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="w-full max-w-3xl">
      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder="フレンドを検索..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <Tabs defaultValue="online" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="online">
            オンライン{" "}
            <Badge variant="secondary" className="ml-1">
              {onlineFriends.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="favorites">
            お気に入り{" "}
            <Badge variant="secondary" className="ml-1">
              {favoriteFriends.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="monitored">
            監視中{" "}
            <Badge variant="secondary" className="ml-1">
              {monitoredFriendsList.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="all">
            すべて{" "}
            <Badge variant="secondary" className="ml-1">
              {allFriends.length}
            </Badge>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="online" className="mt-4">
          {renderFriendsList(onlineFriends)}
        </TabsContent>
        <TabsContent value="favorites" className="mt-4">
          {renderFriendsList(favoriteFriends)}
        </TabsContent>
        <TabsContent value="monitored" className="mt-4">
          {renderFriendsList(monitoredFriendsList)}
        </TabsContent>
        <TabsContent value="all" className="mt-4">
          {renderFriendsList(allFriends)}
        </TabsContent>
      </Tabs>
    </div>
  )
}
