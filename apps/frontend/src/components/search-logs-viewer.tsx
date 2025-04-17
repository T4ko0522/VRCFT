"use client"

import { useState, useEffect, useMemo } from "react"
import { Search, Filter, RefreshCw, User, MapPin, Clock, Activity, Shirt } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockFriends } from "@/lib/mock-data"
import { type LogEntry, type LogType, generateLogEntries } from "@/lib/mock-logs"
import { format } from "date-fns"
import { ja } from "date-fns/locale"
import Image from "next/image"

interface SearchLogsViewerProps {
  monitoredFriendIds?: string[]
}

export default function SearchLogsViewer({ monitoredFriendIds }: SearchLogsViewerProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<string>("search")

  // フィルター状態
  const [selectedLogTypes, setSelectedLogTypes] = useState<LogType[]>([
    "login",
    "logout",
    "status_change",
    "game_join",
    "game_leave",
    "location_change",
    "avatar_change",
    "message",
  ])
  const [timeRange, setTimeRange] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [locationFilter, setLocationFilter] = useState<string>("")
  const [avatarFilter, setAvatarFilter] = useState<string>("")
  const [onlineFilter, setOnlineFilter] = useState<boolean | null>(null)

  // モックデータを生成
  useEffect(() => {
    setIsLoading(true)
    // 監視対象のフレンドのみのログを生成
    const friends = monitoredFriendIds?.length
      ? mockFriends.filter((friend) => monitoredFriendIds.includes(friend.id))
      : mockFriends
    const generatedLogs = generateLogEntries(friends, 100)
    setLogs(generatedLogs)
    setIsLoading(false)
  }, [monitoredFriendIds])

  // 検索結果のフレンド
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return []

    return mockFriends.filter((friend) => {
      // 基本的な名前検索
      const matchesName = friend.name.toLowerCase().includes(searchQuery.toLowerCase())

      // ステータスフィルター
      const matchesStatus = statusFilter.length === 0 || statusFilter.includes(friend.status)

      // オンライン/オフラインフィルター
      const matchesOnline =
        onlineFilter === null ||
        (onlineFilter === true && friend.status !== "offline") ||
        (onlineFilter === false && friend.status === "offline")

      // 現在地フィルター
      const matchesLocation =
        !locationFilter || (friend.location && friend.location.toLowerCase().includes(locationFilter.toLowerCase()))

      // アバターフィルター
      const matchesAvatar =
        !avatarFilter || (friend.avatarName && friend.avatarName.toLowerCase().includes(avatarFilter.toLowerCase()))

      return matchesName && matchesStatus && matchesOnline && matchesLocation && matchesAvatar
    })
  }, [searchQuery, statusFilter, onlineFilter, locationFilter, avatarFilter])

  // ログフィルタリングを適用
  useEffect(() => {
    if (activeTab !== "logs") return

    let filtered = [...logs]

    // 検索クエリでフィルタリング
    if (searchQuery) {
      filtered = filtered.filter((log) => {
        const message = log.details.message || ""
        const location = log.details.location || log.details.newLocation || log.details.oldLocation || ""
        const avatar = log.details.avatar || log.details.newAvatar || log.details.oldAvatar || ""

        return (
          message.toLowerCase().includes(searchQuery.toLowerCase()) ||
          location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          avatar.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })
    }

    // ログタイプでフィルタリング
    if (selectedLogTypes.length > 0) {
      filtered = filtered.filter((log) => selectedLogTypes.includes(log.type))
    }

    // 時間範囲でフィルタリング
    if (timeRange !== "all") {
      const now = new Date()
      let timeLimit: Date

      switch (timeRange) {
        case "1h":
          timeLimit = new Date(now.getTime() - 60 * 60 * 1000)
          break
        case "24h":
          timeLimit = new Date(now.getTime() - 24 * 60 * 60 * 1000)
          break
        case "7d":
          timeLimit = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        default:
          timeLimit = new Date(0)
      }

      filtered = filtered.filter((log) => log.timestamp > timeLimit)
    }

    // ステータスフィルター
    if (statusFilter.length > 0) {
      filtered = filtered.filter((log) => {
        // ステータス変更ログの場合
        if (log.type === "status_change") {
          return statusFilter.includes(log.details.newStatus || "")
        }

        // その他のログの場合、フレンドの現在のステータスでフィルタリング
        const friend = mockFriends.find((f) => f.id === log.friendId)
        return friend && statusFilter.includes(friend.status)
      })
    }

    // オンライン/オフラインフィルター
    if (onlineFilter !== null) {
      filtered = filtered.filter((log) => {
        const friend = mockFriends.find((f) => f.id === log.friendId)
        if (!friend) return false

        if (onlineFilter) {
          return friend.status !== "offline"
        } else {
          return friend.status === "offline"
        }
      })
    }

    // 現在地フィルター
    if (locationFilter) {
      filtered = filtered.filter((log) => {
        // 現在地変更ログの場合
        if (log.type === "location_change") {
          const newLocation = log.details.newLocation || ""
          return newLocation.toLowerCase().includes(locationFilter.toLowerCase())
        }

        // その他のログの場合、フレンドの現在の現在地でフィルタリング
        const friend = mockFriends.find((f) => f.id === log.friendId)
        return friend && friend.location && friend.location.toLowerCase().includes(locationFilter.toLowerCase())
      })
    }

    // アバターフィルター
    if (avatarFilter) {
      filtered = filtered.filter((log) => {
        // アバター変更ログの場合
        if (log.type === "avatar_change") {
          const newAvatar = log.details.newAvatar || ""
          return newAvatar.toLowerCase().includes(avatarFilter.toLowerCase())
        }

        // その他のログの場合、フレンドの現在のアバターでフィルタリング
        const friend = mockFriends.find((f) => f.id === log.friendId)
        return friend && friend.avatarName && friend.avatarName.toLowerCase().includes(avatarFilter.toLowerCase())
      })
    }

    setFilteredLogs(filtered)
  }, [
    logs,
    searchQuery,
    selectedLogTypes,
    timeRange,
    statusFilter,
    onlineFilter,
    locationFilter,
    avatarFilter,
    activeTab,
  ])

  // ログをリフレッシュ
  const refreshLogs = () => {
    setIsLoading(true)
    const friends = monitoredFriendIds?.length
      ? mockFriends.filter((friend) => monitoredFriendIds.includes(friend.id))
      : mockFriends
    const generatedLogs = generateLogEntries(friends, 100)
    setLogs(generatedLogs)
    setIsLoading(false)
  }

  // ログタイプの切り替え
  const toggleLogType = (type: LogType) => {
    if (selectedLogTypes.includes(type)) {
      setSelectedLogTypes(selectedLogTypes.filter((t) => t !== type))
    } else {
      setSelectedLogTypes([...selectedLogTypes, type])
    }
  }

  // ステータスフィルターの切り替え
  const toggleStatusFilter = (status: string) => {
    if (statusFilter.includes(status)) {
      setStatusFilter(statusFilter.filter((s) => s !== status))
    } else {
      setStatusFilter([...statusFilter, status])
    }
  }

  // オンライン/オフラインフィルターの切り替え
  const toggleOnlineFilter = (value: boolean | null) => {
    setOnlineFilter(value)
  }

  // フィルターをリセット
  const resetFilters = () => {
    setSelectedLogTypes([
      "login",
      "logout",
      "status_change",
      "game_join",
      "game_leave",
      "location_change",
      "avatar_change",
      "message",
    ])
    setTimeRange("all")
    setStatusFilter([])
    setLocationFilter("")
    setAvatarFilter("")
    setOnlineFilter(null)
  }

  // ログタイプに応じたバッジの色を取得
  const getLogTypeBadge = (type: LogType) => {
    switch (type) {
      case "login":
        return <Badge className="bg-green-500">ログイン</Badge>
      case "logout":
        return <Badge className="bg-gray-500">ログアウト</Badge>
      case "status_change":
        return <Badge className="bg-blue-500">ステータス変更</Badge>
      case "game_join":
        return <Badge className="bg-purple-500">ゲーム開始</Badge>
      case "game_leave":
        return <Badge className="bg-indigo-500">ゲーム終了</Badge>
      case "location_change":
        return <Badge className="bg-yellow-500">現在地変更</Badge>
      case "avatar_change":
        return <Badge className="bg-pink-500">アバター変更</Badge>
      case "message":
        return <Badge className="bg-cyan-500">メッセージ</Badge>
      default:
        return <Badge>その他</Badge>
    }
  }

  // フレンドのステータスに応じた色を取得
  const getStatusColor = (status: string): string => {
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

  // フレンドのステータステキストを取得
  const getStatusText = (status: string, game?: string, lastSeen?: string): string => {
    switch (status) {
      case "online":
        return "オンライン"
      case "away":
        return "離席中"
      case "busy":
        return "取り込み中"
      case "in-game":
        return `プレイ中: ${game || "不明なゲーム"}`
      case "offline":
        return `最終オンライン: ${lastSeen || "不明"}`
      default:
        return status
    }
  }

  // アクティブフィルターの数を取得
  const getActiveFilterCount = () => {
    let count = 0
    if (statusFilter.length > 0) count++
    if (onlineFilter !== null) count++
    if (locationFilter) count++
    if (avatarFilter) count++
    if (timeRange !== "all") count++
    if (selectedLogTypes.length < 8) count++ // 全てのログタイプが選択されていない場合
    return count
  }

  return (
    <div className="w-full max-w-4xl">
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder={activeTab === "search" ? "フレンドを検索..." : "ログを検索..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                フィルター
                {getActiveFilterCount() > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
                    {getActiveFilterCount()}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">フィルター</h4>
                  <Button variant="ghost" size="sm" onClick={resetFilters} className="h-8 px-2 text-xs">
                    リセット
                  </Button>
                </div>

                <Separator />

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4" />
                    <h4 className="font-medium">ステータス</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="status-online"
                        checked={statusFilter.includes("online")}
                        onCheckedChange={() => toggleStatusFilter("online")}
                      />
                      <Label htmlFor="status-online" className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-green-500"></span>
                        オンライン
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="status-away"
                        checked={statusFilter.includes("away")}
                        onCheckedChange={() => toggleStatusFilter("away")}
                      />
                      <Label htmlFor="status-away" className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                        離席中
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="status-busy"
                        checked={statusFilter.includes("busy")}
                        onCheckedChange={() => toggleStatusFilter("busy")}
                      />
                      <Label htmlFor="status-busy" className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-red-500"></span>
                        取り込み中
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="status-in-game"
                        checked={statusFilter.includes("in-game")}
                        onCheckedChange={() => toggleStatusFilter("in-game")}
                      />
                      <Label htmlFor="status-in-game" className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                        ゲーム中
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="status-offline"
                        checked={statusFilter.includes("offline")}
                        onCheckedChange={() => toggleStatusFilter("offline")}
                      />
                      <Label htmlFor="status-offline" className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-gray-500"></span>
                        オフライン
                      </Label>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="h-4 w-4" />
                    <h4 className="font-medium">オンライン状態</h4>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={onlineFilter === true ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleOnlineFilter(onlineFilter === true ? null : true)}
                      className="flex-1"
                    >
                      オンライン
                    </Button>
                    <Button
                      variant={onlineFilter === false ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleOnlineFilter(onlineFilter === false ? null : false)}
                      className="flex-1"
                    >
                      オフライン
                    </Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4" />
                    <h4 className="font-medium">現在地</h4>
                  </div>
                  <Input
                    placeholder="現在地で検索..."
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                  />
                </div>

                <Separator />

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Shirt className="h-4 w-4" />
                    <h4 className="font-medium">アバター</h4>
                  </div>
                  <Input
                    placeholder="アバター名で検索..."
                    value={avatarFilter}
                    onChange={(e) => setAvatarFilter(e.target.value)}
                  />
                </div>

                {activeTab === "logs" && (
                  <>
                    <Separator />

                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4" />
                        <h4 className="font-medium">期間</h4>
                      </div>
                      <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger>
                          <SelectValue placeholder="期間を選択" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">すべて</SelectItem>
                          <SelectItem value="1h">1時間以内</SelectItem>
                          <SelectItem value="24h">24時間以内</SelectItem>
                          <SelectItem value="7d">7日以内</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-medium mb-2">ログタイプ</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="login"
                            checked={selectedLogTypes.includes("login")}
                            onCheckedChange={() => toggleLogType("login")}
                          />
                          <Label htmlFor="login">ログイン</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="logout"
                            checked={selectedLogTypes.includes("logout")}
                            onCheckedChange={() => toggleLogType("logout")}
                          />
                          <Label htmlFor="logout">ログアウト</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="status_change"
                            checked={selectedLogTypes.includes("status_change")}
                            onCheckedChange={() => toggleLogType("status_change")}
                          />
                          <Label htmlFor="status_change">ステータス変更</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="game_join"
                            checked={selectedLogTypes.includes("game_join")}
                            onCheckedChange={() => toggleLogType("game_join")}
                          />
                          <Label htmlFor="game_join">ゲーム開始</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="game_leave"
                            checked={selectedLogTypes.includes("game_leave")}
                            onCheckedChange={() => toggleLogType("game_leave")}
                          />
                          <Label htmlFor="game_leave">ゲーム終了</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="location_change"
                            checked={selectedLogTypes.includes("location_change")}
                            onCheckedChange={() => toggleLogType("location_change")}
                          />
                          <Label htmlFor="location_change">現在地変更</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="avatar_change"
                            checked={selectedLogTypes.includes("avatar_change")}
                            onCheckedChange={() => toggleLogType("avatar_change")}
                          />
                          <Label htmlFor="avatar_change">アバター変更</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="message"
                            checked={selectedLogTypes.includes("message")}
                            onCheckedChange={() => toggleLogType("message")}
                          />
                          <Label htmlFor="message">メッセージ</Label>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </PopoverContent>
          </Popover>

          {activeTab === "logs" && (
            <Button variant="outline" onClick={refreshLogs} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              <span className="sr-only">更新</span>
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="search">検索</TabsTrigger>
          <TabsTrigger value="logs">ログ</TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="mt-4">
          <div className="space-y-2">
            {searchQuery.trim() === "" ? (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  検索キーワードを入力してください
                </CardContent>
              </Card>
            ) : searchResults.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">検索結果が見つかりません</CardContent>
              </Card>
            ) : (
              searchResults.map((friend) => (
                <Card key={friend.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
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
                      <div className="flex-grow">
                        <div className="font-medium">{friend.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {getStatusText(friend.status, friend.game, friend.lastSeen)}
                        </div>
                        {friend.location && (
                          <div className="text-sm flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span>{friend.location}</span>
                          </div>
                        )}
                        {friend.avatarName && (
                          <div className="text-sm flex items-center gap-1 mt-1">
                            <Shirt className="h-3 w-3 text-muted-foreground" />
                            <span>{friend.avatarName}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="logs" className="mt-4">
          <div className="space-y-2">
            {isLoading ? (
              <Card>
                <CardContent className="p-8 flex justify-center">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    <span>ログを読み込み中...</span>
                  </div>
                </CardContent>
              </Card>
            ) : filteredLogs.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">ログが見つかりません</CardContent>
              </Card>
            ) : (
              filteredLogs.map((log) => (
                <Card key={log.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground whitespace-nowrap">
                          {format(log.timestamp, "yyyy/MM/dd HH:mm", { locale: ja })}
                        </span>
                        {getLogTypeBadge(log.type)}
                      </div>
                      <div className="flex-grow">
                        <p>{log.details.message}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
