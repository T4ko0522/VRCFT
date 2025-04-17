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

export default function SettingsForm() {
  const [notifications, setNotifications] = useState(true)
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
  const githubUrl="https://github.com/t4ko0522/vrcft"
  const twitterUrl="https://twitter.com/tako_0522"

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Appearance
          </CardTitle>
          <CardDescription>Customize how VRCFT looks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="dark-mode" className="flex items-center gap-2">
                {darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                Dark Mode
              </Label>
              <p className="text-sm text-muted-foreground">Switch between light and dark theme</p>
            </div>
            <Switch id="dark-mode" checked={darkMode} onCheckedChange={handleDarkModeChange} />
          </div>

          <Separator />

          <div className="space-y-3">
            <Label>Theme Style</Label>
            <p className="text-sm text-muted-foreground">Choose a color theme for the application</p>
            <ThemeSelector />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Manage your notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notifications">Enable Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive notifications from friends and events</p>
            </div>
            <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Manage your account settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">Manage your account settings and preferences</p>
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
              <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                GitHub
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Twitter className="h-5 w-5 text-muted-foreground" />
              <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                Twitter
              </a>
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
