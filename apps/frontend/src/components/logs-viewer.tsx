"use client"

import { useState, useEffect } from "react"
import { Search, Filter, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { mockFriends } from "@/lib/mock-data"
import { type LogEntry, type LogType, generateLogEntries } from "@/lib/mock-logs"
import { format } from "date-fns"
import { ja } from "date-fns/locale"

interface LogsViewerProps {
  monitoredFriendIds?: string[]
}

export default function LogsViewer({ monitoredFriendIds }: LogsViewerProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedLogTypes, setSelectedLogTypes] = useState<LogType[]>([
    "login",
    "logout",
    "status_change",
    "game_join",
    "game_leave",
    "message",
  ])
  const [timeRange, setTimeRange] = useState<string>("all")

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

  // フィルタリングを適用
  useEffect(() => {
    let filtered = [...logs]

    // 検索クエリでフィルタリング
    if (searchQuery) {
      filtered = filtered.filter((log) => log.details.message?.toLowerCase().includes(searchQuery.toLowerCase()))
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

    setFilteredLogs(filtered)
  }, [logs, searchQuery, selectedLogTypes, timeRange])

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
      case "friend_add":
        return <Badge className="bg-yellow-500">フレンド追加</Badge>
      case "friend_remove":
        return <Badge className="bg-red-500">フレンド削除</Badge>
      case "message":
        return <Badge className="bg-cyan-500">メッセージ</Badge>
      default:
        return <Badge>その他</Badge>
    }
  }

  // フレンド名を取得
  const getFriendName = (friendId: string) => {
    const friend = mockFriends.find((f) => f.id === friendId)
    return friend ? friend.name : "不明なユーザー"
  }

  return (
    <div className="w-full max-w-4xl">
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="ログを検索..."
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
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
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
                        id="message"
                        checked={selectedLogTypes.includes("message")}
                        onCheckedChange={() => toggleLogType("message")}
                      />
                      <Label htmlFor="message">メッセージ</Label>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">期間</h4>
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
              </div>
            </PopoverContent>
          </Popover>

          <Button variant="outline" onClick={refreshLogs} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            <span className="sr-only">更新</span>
          </Button>
        </div>
      </div>

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
    </div>
  )
}
