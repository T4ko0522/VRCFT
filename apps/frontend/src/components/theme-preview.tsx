"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useTheme } from "@/hooks/use-theme"

type ThemeStyle = "default" | "midnight" | "forest" | "sunset" | "lavender" | "cyberpunk" | "pastel"

interface ThemePreviewProps {
  themeStyle: ThemeStyle
  label: string
  onClick: () => void
  isActive: boolean
}

export function ThemePreview({ themeStyle, label, onClick, isActive }: ThemePreviewProps) {
  const { isDark } = useTheme()

  // Apply theme class to preview without affecting global theme
  const getPreviewClass = () => {
    const baseClass = "w-full h-full rounded-md overflow-hidden border-2 transition-all"
    const activeClass = isActive ? "border-primary" : "border-transparent hover:border-muted-foreground/50"

    return `${baseClass} ${activeClass}`
  }

  // Generate theme-specific styles for the preview
  const getThemeStyles = () => {
    // Base styles that will be applied to all previews
    const baseStyles = {
      "--preview-background": "hsl(0 0% 100%)",
      "--preview-foreground": "hsl(222.2 84% 4.9%)",
      "--preview-card": "hsl(0 0% 100%)",
      "--preview-card-foreground": "hsl(222.2 84% 4.9%)",
      "--preview-primary": "hsl(221.2 83.2% 53.3%)",
      "--preview-secondary": "hsl(210 40% 96.1%)",
      "--preview-muted": "hsl(210 40% 96.1%)",
      "--preview-accent": "hsl(210 40% 96.1%)",
    }

    // Dark mode base styles
    const darkBaseStyles = {
      "--preview-background": "hsl(222.2 84% 4.9%)",
      "--preview-foreground": "hsl(210 40% 98%)",
      "--preview-card": "hsl(222.2 84% 4.9%)",
      "--preview-card-foreground": "hsl(210 40% 98%)",
      "--preview-primary": "hsl(217.2 91.2% 59.8%)",
      "--preview-secondary": "hsl(217.2 32.6% 17.5%)",
      "--preview-muted": "hsl(217.2 32.6% 17.5%)",
      "--preview-accent": "hsl(217.2 32.6% 17.5%)",
    }

    // Theme-specific styles
    const themeStyles: Record<ThemeStyle, any> = {
      default: isDark ? darkBaseStyles : baseStyles,
      midnight: isDark
        ? {
            "--preview-background": "hsl(222 47% 11%)",
            "--preview-foreground": "hsl(210 40% 98%)",
            "--preview-card": "hsl(222 47% 11%)",
            "--preview-card-foreground": "hsl(210 40% 98%)",
            "--preview-primary": "hsl(217 91% 60%)",
            "--preview-secondary": "hsl(217 32% 17%)",
            "--preview-muted": "hsl(217 32% 17%)",
            "--preview-accent": "hsl(217 32% 17%)",
          }
        : {
            "--preview-background": "hsl(222 47% 95%)",
            "--preview-foreground": "hsl(222 47% 11%)",
            "--preview-card": "hsl(222 47% 95%)",
            "--preview-card-foreground": "hsl(222 47% 11%)",
            "--preview-primary": "hsl(217 91% 50%)",
            "--preview-secondary": "hsl(217 32% 90%)",
            "--preview-muted": "hsl(217 32% 90%)",
            "--preview-accent": "hsl(217 32% 90%)",
          },
      forest: isDark
        ? {
            "--preview-background": "hsl(150 30% 6%)",
            "--preview-foreground": "hsl(150 40% 98%)",
            "--preview-card": "hsl(150 30% 6%)",
            "--preview-card-foreground": "hsl(150 40% 98%)",
            "--preview-primary": "hsl(142 70% 45%)",
            "--preview-secondary": "hsl(150 30% 15%)",
            "--preview-muted": "hsl(150 30% 15%)",
            "--preview-accent": "hsl(150 30% 15%)",
          }
        : {
            "--preview-background": "hsl(150 30% 96%)",
            "--preview-foreground": "hsl(150 40% 4%)",
            "--preview-card": "hsl(150 30% 96%)",
            "--preview-card-foreground": "hsl(150 40% 4%)",
            "--preview-primary": "hsl(142 76% 36%)",
            "--preview-secondary": "hsl(150 16% 90%)",
            "--preview-muted": "hsl(150 16% 90%)",
            "--preview-accent": "hsl(150 16% 90%)",
          },
      sunset: isDark
        ? {
            "--preview-background": "hsl(30 30% 6%)",
            "--preview-foreground": "hsl(30 40% 98%)",
            "--preview-card": "hsl(30 30% 6%)",
            "--preview-card-foreground": "hsl(30 40% 98%)",
            "--preview-primary": "hsl(20 100% 50%)",
            "--preview-secondary": "hsl(30 30% 15%)",
            "--preview-muted": "hsl(30 30% 15%)",
            "--preview-accent": "hsl(30 30% 15%)",
          }
        : {
            "--preview-background": "hsl(30 30% 96%)",
            "--preview-foreground": "hsl(30 40% 4%)",
            "--preview-card": "hsl(30 30% 96%)",
            "--preview-card-foreground": "hsl(30 40% 4%)",
            "--preview-primary": "hsl(20 100% 60%)",
            "--preview-secondary": "hsl(30 16% 90%)",
            "--preview-muted": "hsl(30 16% 90%)",
            "--preview-accent": "hsl(30 16% 90%)",
          },
      lavender: isDark
        ? {
            "--preview-background": "hsl(270 30% 6%)",
            "--preview-foreground": "hsl(270 40% 98%)",
            "--preview-card": "hsl(270 30% 6%)",
            "--preview-card-foreground": "hsl(270 40% 98%)",
            "--preview-primary": "hsl(270 70% 65%)",
            "--preview-secondary": "hsl(270 30% 15%)",
            "--preview-muted": "hsl(270 30% 15%)",
            "--preview-accent": "hsl(270 30% 15%)",
          }
        : {
            "--preview-background": "hsl(270 30% 96%)",
            "--preview-foreground": "hsl(270 40% 4%)",
            "--preview-card": "hsl(270 30% 96%)",
            "--preview-card-foreground": "hsl(270 40% 4%)",
            "--preview-primary": "hsl(270 76% 60%)",
            "--preview-secondary": "hsl(270 16% 90%)",
            "--preview-muted": "hsl(270 16% 90%)",
            "--preview-accent": "hsl(270 16% 90%)",
          },
      cyberpunk: isDark
        ? {
            "--preview-background": "hsl(240 20% 10%)",
            "--preview-foreground": "hsl(180 100% 60%)",
            "--preview-card": "hsl(240 20% 12%)",
            "--preview-card-foreground": "hsl(180 100% 60%)",
            "--preview-primary": "hsl(320 100% 60%)",
            "--preview-secondary": "hsl(240 20% 16%)",
            "--preview-muted": "hsl(240 20% 16%)",
            "--preview-accent": "hsl(320 100% 60%)",
          }
        : {
            "--preview-background": "hsl(240 20% 95%)",
            "--preview-foreground": "hsl(240 20% 10%)",
            "--preview-card": "hsl(240 20% 97%)",
            "--preview-card-foreground": "hsl(240 20% 10%)",
            "--preview-primary": "hsl(320 100% 50%)",
            "--preview-secondary": "hsl(240 20% 90%)",
            "--preview-muted": "hsl(240 20% 90%)",
            "--preview-accent": "hsl(180 100% 50%)",
          },
      pastel: isDark
        ? {
            "--preview-background": "hsl(60 10% 10%)",
            "--preview-foreground": "hsl(60 30% 90%)",
            "--preview-card": "hsl(60 10% 12%)",
            "--preview-card-foreground": "hsl(60 30% 90%)",
            "--preview-primary": "hsl(180 50% 50%)",
            "--preview-secondary": "hsl(60 10% 20%)",
            "--preview-muted": "hsl(60 10% 20%)",
            "--preview-accent": "hsl(330 50% 60%)",
          }
        : {
            "--preview-background": "hsl(60 30% 96%)",
            "--preview-foreground": "hsl(60 10% 20%)",
            "--preview-card": "hsl(60 30% 96%)",
            "--preview-card-foreground": "hsl(60 10% 20%)",
            "--preview-primary": "hsl(180 50% 60%)",
            "--preview-secondary": "hsl(60 20% 90%)",
            "--preview-muted": "hsl(60 20% 90%)",
            "--preview-accent": "hsl(330 50% 70%)",
          },
    }

    return themeStyles[themeStyle]
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-full aspect-video relative cursor-pointer" onClick={onClick}>
        <div className={getPreviewClass()} style={getThemeStyles()}>
          <div
            className="p-2 h-full flex flex-col"
            style={{
              backgroundColor: `var(--preview-background)`,
              color: `var(--preview-foreground)`,
            }}
          >
            <div className="h-2 w-full rounded mb-2" style={{ backgroundColor: `var(--preview-primary)` }}></div>
            <div className="flex gap-1 mb-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: `var(--preview-primary)` }}></div>
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: `var(--preview-secondary)` }}></div>
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: `var(--preview-accent)` }}></div>
            </div>
            <div
              className="p-1 rounded flex-grow flex items-center justify-center"
              style={{
                backgroundColor: `var(--preview-card)`,
                color: `var(--preview-card-foreground)`,
              }}
            >
              <div className="w-full h-1 rounded" style={{ backgroundColor: `var(--preview-muted)` }}></div>
            </div>
          </div>
        </div>
      </div>
      <span className="text-xs font-medium">{label}</span>
    </div>
  )
}

export function ThemeGrid() {
  const { themeStyle, setThemeStyle } = useTheme()

  const themes: { value: ThemeStyle; label: string }[] = [
    { value: "default", label: "Default" },
    { value: "midnight", label: "Midnight" },
    { value: "forest", label: "Forest" },
    { value: "sunset", label: "Sunset" },
    { value: "lavender", label: "Lavender" },
    { value: "cyberpunk", label: "Cyberpunk" },
    { value: "pastel", label: "Pastel" },
  ]

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {themes.map((theme) => (
            <ThemePreview
              key={theme.value}
              themeStyle={theme.value}
              label={theme.label}
              onClick={() => setThemeStyle(theme.value)}
              isActive={themeStyle === theme.value}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
