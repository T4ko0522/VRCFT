"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import NavBar from "@/components/nav-bar"
import FriendsList from "@/components/friends-list"
import UserProfileModal from "@/components/user-profile-modal"
import { mockFriends } from "@/lib/mock-data"

export default function FriendsPage() {
  const { isAuthenticated, isPendingVerification } = useAuth()
  const router = useRouter()
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    } else if (isPendingVerification) {
      router.push("/verify")
    }
  }, [isAuthenticated, isPendingVerification, router])

  if (!isAuthenticated) {
    return null
  }

  const handleSelectUser = (userId: string) => {
    setSelectedUserId(userId)
  }

  const handleCloseModal = () => {
    setSelectedUserId(null)
  }

  return (
    <>
      <NavBar />
      <main className="flex min-h-screen flex-col items-center pt-24 p-4">
        <div className="w-full max-w-3xl">
          <h1 className="text-3xl font-bold mb-6">フレンド</h1>
          <FriendsList onSelectUser={handleSelectUser} />
          <UserProfileModal userId={selectedUserId} friends={mockFriends} onClose={handleCloseModal} />
        </div>
      </main>
    </>
  )
}
