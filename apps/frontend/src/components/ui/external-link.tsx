"use client"

import type React from "react"

import { useState } from "react"
import { ExternalLinkIcon } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>外部リンクを開く</DialogTitle>
            <DialogDescription>
              次の外部サイトに移動しようとしています：
              <span className="block mt-2 font-medium">{getDomainFromUrl(linkUrl)}</span>
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            外部サイトはVRCFTの管理下にありません。セキュリティ、プライバシーポリシー、コンテンツについて注意してください。
          </p>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <Button variant="outline" onClick={handleCancel}>
              キャンセル
            </Button>
            <Button onClick={handleConfirm}>続ける</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
