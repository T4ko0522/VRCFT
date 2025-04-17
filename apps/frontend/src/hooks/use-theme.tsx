"use client"

import { useTheme as useNextTheme } from "next-themes"
import { useEffect, useState } from "react"
import { useThemeContext } from "@/components/theme-provider"

export function useTheme() {
  const { theme, setTheme, resolvedTheme } = useNextTheme()
  const { themeStyle, setThemeStyle } = useThemeContext()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch by only accessing theme after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  return {
    theme: mounted ? theme : undefined,
    setTheme,
    resolvedTheme: mounted ? resolvedTheme : undefined,
    isDark: mounted ? resolvedTheme === "dark" : undefined,
    isLight: mounted ? resolvedTheme === "light" : undefined,
    themeStyle,
    setThemeStyle,
    mounted,
  }
}
