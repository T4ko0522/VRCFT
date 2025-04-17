"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

type Theme = "light" | "dark" | "system"
type ThemeStyle = "default" | "midnight" | "forest" | "sunset" | "lavender" | "cyberpunk" | "pastel"

interface ThemeContextType {
  theme: Theme
  themeStyle: ThemeStyle
  setTheme: (theme: Theme) => void
  setThemeStyle: (style: ThemeStyle) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [themeStyle, setThemeStyle] = useState<ThemeStyle>("default")

  useEffect(() => {
    // Load theme style from localStorage
    const savedThemeStyle = localStorage.getItem("themeStyle") as ThemeStyle | null
    if (savedThemeStyle) {
      setThemeStyle(savedThemeStyle)
      document.documentElement.classList.remove(
        "theme-midnight",
        "theme-forest",
        "theme-sunset",
        "theme-lavender",
        "theme-cyberpunk",
        "theme-pastel",
      )
      if (savedThemeStyle !== "default") {
        document.documentElement.classList.add(`theme-${savedThemeStyle}`)
      }
    }
  }, [])

  const handleThemeStyleChange = (style: ThemeStyle) => {
    setThemeStyle(style)
    localStorage.setItem("themeStyle", style)

    // Remove all theme classes
    document.documentElement.classList.remove(
      "theme-midnight",
      "theme-forest",
      "theme-sunset",
      "theme-lavender",
      "theme-cyberpunk",
      "theme-pastel",
    )

    // Add the selected theme class if not default
    if (style !== "default") {
      document.documentElement.classList.add(`theme-${style}`)
    }
  }

  return (
    <NextThemesProvider {...props}>
      <ThemeContext.Provider
        value={{
          theme: "light", // This will be overridden by useTheme
          themeStyle,
          setTheme: () => {}, // This will be overridden by useTheme
          setThemeStyle: handleThemeStyleChange,
        }}
      >
        {children}
      </ThemeContext.Provider>
    </NextThemesProvider>
  )
}

export function useThemeContext() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useThemeContext must be used within a ThemeProvider")
  }
  return context
}
