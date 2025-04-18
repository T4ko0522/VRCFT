"use client"

import { DialogFooter } from "@/components/ui/dialog"

import type React from "react"

import { useState } from "react"
import { ExternalLinkIcon } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ExternalLinkProps {
  href: string
  children: React.ReactNode
  className?: string
  showIcon?: boolean
  iconClassName?: string
}

export default function ExternalLink({ href, children, className, showIcon = true, iconClassName }: ExternalLinkProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    setLinkUrl(href)
    setIsDialogOpen(true)
  }

  const handleConfirm = () => {
    window.open(linkUrl, "_blank", "noopener,noreferrer")
    setIsDialogOpen(false)
  }

  const handleCancel = () => {
    setIsDialogOpen(false)
  }

  // URLからドメイン名を抽出
  const getDomainFromUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname
      return domain
    } catch (error) {
      return url
    }
  }

  return (
    <>
      <a href={href} onClick={handleLinkClick} className={cn("inline-flex items-center gap-1", className)}>
        {children}
        {showIcon && <ExternalLinkIcon className={cn("h-3 w-3", iconClassName)} />}
      </a>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>外部サイトへ移動</DialogTitle>
          </DialogHeader>
          <div className="flex items-center gap-2 text-sm">
            <ExternalLinkIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="font-medium truncate">{getDomainFromUrl(linkUrl)}</span>
          </div>
          <DialogFooter className="sm:justify-between mt-2">
            <Button variant="outline" size="sm" onClick={handleCancel}>
              キャンセル
            </Button>
            <Button size="sm" onClick={handleConfirm}>
              開く
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
