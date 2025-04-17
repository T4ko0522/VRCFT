"use client"

import { useState } from "react"
import Image from "next/image"
import { format } from "date-fns"
import { ja } from "date-fns/locale"
import {
  Star,
  MoreVertical,
  MessageCircle,
  Anchor,
  Clock,
  Calendar,
  User,
  Users,
  Shirt,
  FileText,
  Copy,
  Check,
  Twitter,
  X,
} from "lucide-react"
import type { Friend, UserRank } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface UserProfileDetailProps {
  user: Friend
  onClose?: () => void
}

export default function UserProfileDetail({ user, onClose }: UserProfileDetailProps) {
  const [activeTab, setActiveTab] = useState("info")
  const [copiedUserId, setCopiedUserId] = useState(false)

  // ユーザーランクに応じた色を取得
  const getUserRankColor = (rank?: UserRank): string => {
    switch (rank) {
      case "Visitor":
        return "bg-gray-500"
      case "New User":
        return "bg-blue-500"
      case "User":
        return "bg-green-500"
      case "Known User":
        return "bg-orange-500"
      case "Trusted User":
        return "bg-purple-500"
      case "VRC Team":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  // ステータスに応じた色を取得
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

  // ユーザーIDをコピー
  const copyUserId = () => {
    if (user.userId) {
      navigator.clipboard.writeText(user.userId)
      setCopiedUserId(true)
      setTimeout(() => setCopiedUserId(false), 2000)
    }
  }

  // 日付をフォーマット
  const formatDate = (dateString?: string) => {
    if (!dateString) return "-"
    try {
      // 日付形式を判定
      if (dateString.includes("-")) {
        // YYYY-MM-DD形式
        return format(new Date(dateString), "yyyy/MM/dd", { locale: ja })
      } else if (dateString.includes(":")) {
        // YYYY-MM-DD HH:MM:SS形式
        return dateString
      }
      return dateString
    } catch (error) {
      return dateString
    }
  }

  return (
    <div className="bg-card rounded-lg overflow-hidden border shadow-lg">
      {/* ヘッダー部分 */}
      <div className="relative">
        {/* 閉じるボタンを追加 */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 z-10 bg-background/80 backdrop-blur-sm hover:bg-background/90"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
          <span className="sr-only">閉じる</span>
        </Button>
        {/* ヘッダー背景 */}
        <div className="h-24 bg-gradient-to-r from-primary/20 to-primary/40"></div>

        {/* ユーザー情報 */}
        <div className="px-6 pb-4 flex flex-col md:flex-row gap-4">
          {/* アバター画像 */}
          <div className="relative -mt-12 md:-mt-16">
            <div className="rounded-full border-4 border-card overflow-hidden h-24 w-24 md:h-32 md:w-32">
              <Image
                src={user.avatarUrl || "/placeholder.svg"}
                alt={user.name}
                width={128}
                height={128}
                className="object-cover"
              />
            </div>
            <span
              className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-card ${getStatusColor(user.status)}`}
            ></span>
          </div>

          {/* ユーザー基本情報 */}
          <div className="flex-grow pt-2 md:pt-4">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <span className={`inline-block w-3 h-3 rounded-full ${getStatusColor(user.status)}`}></span>
                {user.platform === "PC" && (
                  <Badge variant="outline" className="text-xs">
                    🇯🇵
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {user.userRank && <Badge className={getUserRankColor(user.userRank)}>{user.userRank}</Badge>}
                {user.friendNumber !== undefined && <Badge variant="outline">フレンド No. {user.friendNumber}</Badge>}
                {user.platform && <Badge variant="outline">{user.platform}</Badge>}
              </div>
            </div>

            {/* アイコン */}
            <div className="flex gap-2 mt-2">
              {user.instanceCreator && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="bg-yellow-500 text-black rounded-full p-1.5">
                        <MessageCircle size={16} />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>インスタンス作成者</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="bg-yellow-500 text-black rounded-full p-1.5">
                      <Anchor size={16} />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>インスタンスマスター</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* アクションボタン */}
          <div className="flex items-start gap-2 mt-2 md:mt-4">
            <Button variant="outline" size="icon" className="bg-yellow-500 hover:bg-yellow-600 text-black">
              <Star className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>ブロック</DropdownMenuItem>
                <DropdownMenuItem>通報</DropdownMenuItem>
                <DropdownMenuItem>フレンド解除</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* タブメニュー */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-6 bg-muted/50 sticky top-0 z-10">
          <TabsTrigger value="info" className="text-xs sm:text-sm">
            情報
          </TabsTrigger>
          <TabsTrigger value="groups" className="text-xs sm:text-sm">
            グループ
          </TabsTrigger>
          <TabsTrigger value="worlds" className="text-xs sm:text-sm">
            ワールド
          </TabsTrigger>
          <TabsTrigger value="favorites" className="text-xs sm:text-sm">
            お気に入り
          </TabsTrigger>
          <TabsTrigger value="avatars" className="text-xs sm:text-sm">
            アバター
          </TabsTrigger>
          <TabsTrigger value="json" className="text-xs sm:text-sm">
            JSON
          </TabsTrigger>
        </TabsList>

        {/* 情報タブ */}
        <TabsContent value="info" className="p-4 overflow-y-auto">
          <div className="space-y-6">
            {/* ステータス情報 */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Clock className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2">
                <span className={`inline-block w-2 h-2 rounded-full ${getStatusColor(user.status)}`}></span>
                <span>
                  {user.status === "online" && "オンライン"}
                  {user.status === "away" && "離席中"}
                  {user.status === "busy" && "取り込み中"}
                  {user.status === "in-game" && `プレイ中: ${user.game}`}
                  {user.status === "offline" && `オフライン (最終: ${user.lastSeen})`}
                </span>
              </div>
            </div>

            {/* ノート */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-medium">ノート (VRChat)</h3>
                </div>
                <p className="text-sm text-muted-foreground">{user.notes || "クリックしてノートを追加"}</p>
                <div className="text-right text-xs text-muted-foreground mt-2">0/256</div>
              </CardContent>
            </Card>

            {/* メモ */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-medium">メモ (VRCX)</h3>
                </div>
                <p className="text-sm text-muted-foreground">{user.memos || "クリックしてメモを追加"}</p>
              </CardContent>
            </Card>

            {/* アバター情報 */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shirt className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-medium">アバター情報</h3>
                </div>
                {user.currentAvatar ? (
                  <div className="text-sm">
                    <p>{user.currentAvatar.name}</p>
                    <p className="text-muted-foreground">
                      作者: {user.currentAvatar.creator}
                      {user.currentAvatar.isOwn && " (own)"}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">情報なし</p>
                )}
              </CardContent>
            </Card>

            {/* グループ情報 */}
            {user.groups && user.groups.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-medium">ネームプレートに表示中のグループ</h3>
                  </div>
                  {user.groups.map((group) => (
                    <div key={group.id} className="flex items-center gap-2 mt-2">
                      <div className="h-8 w-8 rounded overflow-hidden">
                        <Image
                          src={group.imageUrl || "/placeholder.svg?height=32&width=32&query=group"}
                          alt={group.name}
                          width={32}
                          height={32}
                          className="object-cover"
                        />
                      </div>
                      <div className="text-sm">
                        <p>{group.name}</p>
                        <p className="text-xs text-muted-foreground">({group.memberCount})</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* 自己紹介 */}
            {user.bio && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-medium">自己紹介</h3>
                  </div>
                  <p className="text-sm whitespace-pre-line">{user.bio}</p>

                  {/* ソーシャルリンク */}
                  <div className="mt-4">
                    <a
                      href={`https://twitter.com/${user.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                    >
                      <Twitter className="h-4 w-4" />
                      <span>@{user.name}</span>
                    </a>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 時間情報 */}
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium flex items-center gap-1">
                      <Clock className="h-3 w-3" /> 最後に見た日時
                    </h4>
                    <p className="text-sm text-muted-foreground">{formatDate(user.lastLoginDate)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium flex items-center gap-1">
                      <Clock className="h-3 w-3" /> 一緒に見た時間
                    </h4>
                    <p className="text-sm text-muted-foreground">{user.onlineTime || "-"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> アカウント作成日
                    </h4>
                    <p className="text-sm text-muted-foreground">{formatDate(user.accountCreationDate)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium flex items-center gap-1">
                      <Users className="h-3 w-3" /> フレンドになった日
                    </h4>
                    <p className="text-sm text-muted-foreground">{formatDate(user.friendshipDate) || "-"}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium flex items-center gap-1">
                    <Shirt className="h-3 w-3" /> アバタークローン
                  </h4>
                  <p className="text-sm text-muted-foreground">{user.allowAvatarCloning ? "許可" : "不許可"}</p>
                </div>
              </CardContent>
            </Card>

            {/* ユーザーID */}
            {user.userId && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">ユーザーID</h4>
                    <Button variant="ghost" size="sm" className="h-8 px-2" onClick={copyUserId}>
                      {copiedUserId ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground font-mono mt-1 break-all">{user.userId}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* 他のタブ */}
        <TabsContent value="groups" className="p-4 overflow-y-auto">
          <div className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">グループ情報はまだ実装されていません</p>
          </div>
        </TabsContent>

        <TabsContent value="worlds" className="p-4 overflow-y-auto">
          <div className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">ワールド情報はまだ実装されていません</p>
          </div>
        </TabsContent>

        <TabsContent value="favorites" className="p-4 overflow-y-auto">
          <div className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">お気に入り情報はまだ実装されていません</p>
          </div>
        </TabsContent>

        <TabsContent value="avatars" className="p-4 overflow-y-auto">
          <div className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">アバター情報はまだ実装されていません</p>
          </div>
        </TabsContent>

        <TabsContent value="json" className="p-4 overflow-y-auto">
          <div className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">JSON情報はまだ実装されていません</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
