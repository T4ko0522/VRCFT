"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, Users, Settings, Moon, Sun, Palette, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/hooks/use-theme"

export default function NavBar() {
  const pathname = usePathname()
  const { isDark, setTheme, mounted } = useTheme()

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark")
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-10 bg-background border-b">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        <Link href="/front" className="text-xl font-bold">
          VRCFT
        </Link>
        <div className="flex items-center space-x-1">
          <Link href="/">
            <Button variant={pathname === "/" ? "default" : "ghost"} size="sm" className="flex items-center gap-1">
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">ホーム</span>
            </Button>
          </Link>
          <Link href="/search">
            <Button
              variant={pathname === "/search" ? "default" : "ghost"}
              size="sm"
              className="flex items-center gap-1"
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">ログ</span>
            </Button>
          </Link>
          <Link href="/friends">
            <Button
              variant={pathname === "/friends" ? "default" : "ghost"}
              size="sm"
              className="flex items-center gap-1"
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">フレンド</span>
            </Button>
          </Link>
          <Link href="/themes">
            <Button
              variant={pathname === "/themes" ? "default" : "ghost"}
              size="sm"
              className="flex items-center gap-1"
            >
              <Palette className="w-4 h-4" />
              <span className="hidden sm:inline">テーマ</span>
            </Button>
          </Link>
          <Link href="/settings">
            <Button
              variant={pathname === "/settings" ? "default" : "ghost"}
              size="sm"
              className="flex items-center gap-1"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">設定</span>
            </Button>
          </Link>
          {mounted && (
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="ml-2">
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              <span className="sr-only">テーマ切替</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
