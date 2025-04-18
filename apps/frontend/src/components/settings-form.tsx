"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "./auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { LogOut, Moon, Sun, Palette, Github, Twitter } from "lucide-react"
import { useTheme } from "@/hooks/use-theme"
import { ThemeSelector } from "./theme-selector"
import SocialLinks from "./social-links"
import ExternalLink from "@/components/ui/external-link"
import { Checkbox } from "@/components/ui/checkbox"

export default function SettingsForm() {
  const [notifications, setNotifications] = useState(true)
  const [windowsNotifications, setWindowsNotifications] = useState(true)
  const [steamVrNotifications, setSteamVrNotifications] = useState(false)
  const [notificationFilters, setNotificationFilters] = useState({
    friendLogin: true,
    friendLogout: true,
    statusChange: true,
    worldChange: true,
    avatarChange: false,
    friendRequest: true,
    message: true,
  })
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const { logout } = useAuth()
  const router = useRouter()
  const { isDark, setTheme, mounted } = useTheme()
  const [darkMode, setDarkMode] = useState(false)

  // Sync the dark mode state with the theme
  useEffect(() => {
    if (mounted) {
      setDarkMode(isDark || false)
    }
  }, [isDark, mounted])

  const handleDarkModeChange = (checked: boolean) => {
    setDarkMode(checked)
    setTheme(checked ? "dark" : "light")
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      logout()
      router.push("/login")
    } catch (error) {
      console.error("Logout failed", error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  // GitHubとTwitterのURL
  const githubUrl = "https://github.com/T4ko0522"
  const twitterUrl = "https://twitter.com/Tako_0522"

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            外観
          </CardTitle>
          {/* <CardDescription>VRCFTの外観をカスタマイズする</CardDescription> */}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="dark-mode" className="flex items-center gap-2">
                {darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                ダークモード
              </Label>
              {/* <p className="text-sm text-muted-foreground">Switch between light and dark theme</p> */}
            </div>
            <Switch id="dark-mode" checked={darkMode} onCheckedChange={handleDarkModeChange} />
          </div>

          <Separator />

          <div className="space-y-3">
            <Label>テーマスタイル</Label>
            {/* <p className="text-sm text-muted-foreground">Choose a color theme for the application</p> */}
            <ThemeSelector />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>通知</CardTitle>
          {/* <CardDescription>通知設定を管理する</CardDescription> */}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notifications">通知を有効にする</Label>
              <p className="text-sm text-muted-foreground">友達やイベントからの通知を受け取る</p>
            </div>
            <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
          </div>
          {notifications && (
            <>
              {/* <Separator /> */}

              <div className="space-y-4">
                {/* <h3 className="text-sm font-medium">通知の送信先</h3> */}

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="windows-notifications">Windowsへの通知を送信する</Label>
                  </div>
                  <Switch
                    id="windows-notifications"
                    checked={windowsNotifications}
                    onCheckedChange={setWindowsNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="steamvr-notifications">SteamVRへ通知を送信する</Label>
                  </div>
                  <Switch
                    id="steamvr-notifications"
                    checked={steamVrNotifications}
                    onCheckedChange={setSteamVrNotifications}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-sm font-medium">通知フィルター</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="filter-login"
                      checked={notificationFilters.friendLogin}
                      onCheckedChange={(checked) =>
                        setNotificationFilters({ ...notificationFilters, friendLogin: !!checked })
                      }
                    />
                    <Label htmlFor="filter-login">お気に入りのフレンドのログイン</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="filter-logout"
                      checked={notificationFilters.friendLogout}
                      onCheckedChange={(checked) =>
                        setNotificationFilters({ ...notificationFilters, friendLogout: !!checked })
                      }
                    />
                    <Label htmlFor="filter-logout">お気に入りのフレンドのログアウト</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="filter-status"
                      checked={notificationFilters.statusChange}
                      onCheckedChange={(checked) =>
                        setNotificationFilters({ ...notificationFilters, statusChange: !!checked })
                      }
                    />
                    <Label htmlFor="filter-status">お気に入りのフレンドのステータス変更</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="filter-world"
                      checked={notificationFilters.worldChange}
                      onCheckedChange={(checked) =>
                        setNotificationFilters({ ...notificationFilters, worldChange: !!checked })
                      }
                    />
                    <Label htmlFor="filter-world">お気に入りのフレンドのワールド移動</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="filter-avatar"
                      checked={notificationFilters.avatarChange}
                      onCheckedChange={(checked) =>
                        setNotificationFilters({ ...notificationFilters, avatarChange: !!checked })
                      }
                    />
                    <Label htmlFor="filter-avatar">お気に入りのフレンドのアバター変更</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="filter-request"
                      checked={notificationFilters.friendRequest}
                      onCheckedChange={(checked) =>
                        setNotificationFilters({ ...notificationFilters, friendRequest: !!checked })
                      }
                    />
                    <Label htmlFor="filter-request">フレンドリクエストを受信</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>アカウント</CardTitle>
          <CardDescription>アカウント設定を管理する</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Separator />
          <div className="pt-2">
            <Button
              variant="destructive"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              {isLoggingOut ? "Logging out..." : "Logout"}
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>製作者情報</CardTitle>
          <CardDescription>VRCFT開発者の情報</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">VRCFTは、VRChatユーザーのためのフレンド管理・追跡ツールです。</p>
          <div className="flex flex-col space-y-4">
            <div className="flex items-center gap-2">
              <Github className="h-5 w-5 text-muted-foreground" />
              <ExternalLink href={githubUrl} className="text-primary hover:underline">
                GitHub
              </ExternalLink>
            </div>
            <div className="flex items-center gap-2">
              <Twitter className="h-5 w-5 text-muted-foreground" />
              <ExternalLink href={twitterUrl} className="text-primary hover:underline">
                Twitter
              </ExternalLink>
            </div>
          </div>
          <div className="pt-4 flex justify-center">
            <SocialLinks githubUrl={githubUrl} twitterUrl={twitterUrl} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
