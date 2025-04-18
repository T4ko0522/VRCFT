"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import SearchBox from "@/components/search-box"
import NavBar from "@/components/nav-bar"
import SocialLinks from "@/components/social-links"

export default function Home() {
  const { isAuthenticated, isPendingVerification, isFirstVisit } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      // 未ログイン状態の場合
      if (isFirstVisit) {
        // 初回アクセスの場合はインデックスページへ
        router.push("/index")
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
        <SearchBox />

        {/* ソーシャルリンクを追加 */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center">
          <SocialLinks
            githubUrl="https://github.com/t4ko0522/vrcft"
            twitterUrl="https://twitter.com/tako_0522"
          />
        </div>
      </main>
    </>
  )
}
