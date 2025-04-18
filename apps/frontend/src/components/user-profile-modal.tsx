"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import UserProfileDetail from "@/components/user-profile-detail"
import type { Friend } from "@/lib/mock-data"

interface UserProfileModalProps {
  userId: string | null
  friends: Friend[]
  onClose: () => void
}

export default function UserProfileModal({ userId, friends, onClose }: UserProfileModalProps) {
  const [user, setUser] = useState<Friend | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (userId) {
      const foundUser = friends.find((friend) => friend.id === userId)
      setUser(foundUser || null)
    } else {
      setUser(null)
    }
  }, [userId, friends])

  const handleClose = () => {
    onClose()
  }

  if (!userId || !user) {
    return null
  }

  return (
    <Dialog open={!!userId} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden max-h-[90vh] flex flex-col">
        {/* ✅ スクリーンリーダー用のDialogTitle（非表示で可） */}
        <DialogTitle className="sr-only">ユーザープロフィール</DialogTitle>

        <div className="overflow-y-auto">
          <UserProfileDetail user={user} onClose={handleClose} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
