"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import SearchBox from "@/components/search-box"
import NavBar from "@/components/nav-bar"
import SocialLinks from "@/components/social-links"
import { motion } from "framer-motion"

export default function Home() {
  const { isAuthenticated, isPendingVerification, isFirstVisit } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      // 未ログイン状態の場合
      if (isFirstVisit) {
        // 初回アクセスの場合はインデックスページへ
        router.push("/front")
      } else {
        // 初回ではない場合はログインページへ
        router.push("/login")
      }
    } else if (isPendingVerification) {
      // 認証待ち状態の場合は認証ページへ
      router.push("/verify")
    }
    // ログイン済みの場合はこのページ（ルートパス）に留まる
  }, [isAuthenticated, isPendingVerification, isFirstVisit, router])

  if (!isAuthenticated) {
    return null
  }

  return (
    <>
      <NavBar />
      <main className="flex min-h-screen flex-col items-center justify-center p-4 relative">
        <div className="text-center mb-8">
          <motion.h1
            className="text-4xl font-bold mb-1"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            VRCFT
          </motion.h1>
          <motion.p
            className="text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            VRChat Friend Tracker
          </motion.p>
        </div>
        <SearchBox />

        {/* ソーシャルリンクを追加 */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center">
          <SocialLinks
            githubUrl="https://github.com/T4ko0522"
            twitterUrl="https://x.com/Tako_0522"
          />
        </div>
      </main>
    </>
  )
}
