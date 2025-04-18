"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useAuth } from "@/components/auth-provider"
import AnimatedText from "@/components/animated-text"
import AnimatedButton from "@/components/animated-button"
import SocialLinks from "@/components/social-links"
import AnimatedBackground from "@/components/animated-background"
import { ArrowRight } from "lucide-react"

export default function IndexPage() {
  const { isAuthenticated, isPendingVerification, isFirstVisit, setFirstVisit } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // ログイン済みで初回アクセスではない場合、ルートパスにリダイレクト
    if (isAuthenticated && !isPendingVerification && !isFirstVisit) {
      // router.push("/")
    } else if (isPendingVerification) {
      // 認証待ち状態の場合は認証ページへ
      router.push("/verify")
    }
    // 未ログイン状態または初回アクセスの場合はこのページに留まる
  }, [isAuthenticated, isPendingVerification, isFirstVisit, router])

  const handleStart = () => {
    // 「始める」ボタンをクリックした時の処理
    if (isAuthenticated) {
      // ログイン済みの場合はルートパスへ
      setFirstVisit(false) // 初回アクセスフラグをfalseに設定
      router.push("/")
    } else {
      // 未ログイン状態の場合はログインページへ
      setFirstVisit(false) // 初回アクセスフラグをfalseに設定
      router.push("/login")
    }
  }

  // ログイン済みで初回アクセスではない場合は何も表示しない
  // if (isAuthenticated && !isFirstVisit) {
  //   return null
  // }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 relative overflow-hidden">
      <AnimatedBackground />

      <motion.div
        className="relative z-10 flex flex-col items-center justify-center gap-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="space-y-2">
          <AnimatedText
            text="Welcome to VRCFT!"
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight"
            delay={1}
          />
          <AnimatedText text="VRChat Friend Tracker" className="text-xl sm:text-2xl text-muted-foreground" delay={2} />
        </div>

        <AnimatedButton onClick={handleStart} size="lg" className="mt-4 text-lg px-8 py-6 flex items-center" delay={3}>
          始める <ArrowRight className="ml-2 h-5 w-5 animate-pulse inline-block" />
        </AnimatedButton>

        {/* ソーシャルリンクを画面下部に固定するのではなく、コンテンツの下に配置 */}
        <div className="mt-12">
          <SocialLinks
            githubUrl="https://github.com/t4ko0522/vrcft"
            twitterUrl="https://twitter.com/tako_0522"
          />
        </div>
      </motion.div>
    </main>
  )
}
