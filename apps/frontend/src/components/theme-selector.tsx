"use client"

import { Check, Circle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "@/hooks/use-theme"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useState } from "react"

type ThemeStyle = "default" | "midnight" | "forest" | "sunset" | "lavender" | "cyberpunk" | "pastel"

interface ThemeOption {
  value: ThemeStyle
  label: string
  color: string
}

const themes: ThemeOption[] = [
  {
    value: "default",
    label: "Default",
    color: "bg-blue-600",
  },
  {
    value: "midnight",
    label: "Midnight Blue",
    color: "bg-blue-900",
  },
  {
    value: "forest",
    label: "Forest Green",
    color: "bg-green-700",
  },
  {
    value: "sunset",
    label: "Sunset Orange",
    color: "bg-orange-500",
  },
  {
    value: "lavender",
    label: "Lavender Purple",
    color: "bg-purple-600",
  },
  {
    value: "cyberpunk",
    label: "Cyberpunk",
    color: "bg-pink-600",
  },
  {
    value: "pastel",
    label: "Pastel",
    color: "bg-teal-400",
  },
]

export function ThemeSelector() {
  const { themeStyle, setThemeStyle } = useTheme()
  const [open, setOpen] = useState(false)

  const selectedTheme = themes.find((theme) => theme.value === themeStyle) || themes[0]

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          <div className="flex items-center gap-2">
            <div className={cn("h-4 w-4 rounded-full", selectedTheme.color)} />
            {selectedTheme.label}
          </div>
          <Circle className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search theme..." />
          <CommandEmpty>No theme found.</CommandEmpty>
          <CommandGroup>
            <CommandList>
              {themes.map((theme) => (
                <CommandItem
                  key={theme.value}
                  value={theme.value}
                  onSelect={(value) => {
                    setThemeStyle(value as ThemeStyle)
                    setOpen(false)
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div className={cn("h-4 w-4 rounded-full", theme.color)} />
                    {theme.label}
                  </div>
                  <Check className={cn("ml-auto h-4 w-4", themeStyle === theme.value ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
