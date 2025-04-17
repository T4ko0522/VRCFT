"use client"

import SocialLinks from "@/components/social-links"

export default function Footer() {
  return (
    <footer className="w-full py-4 mt-auto">
      <div className="container mx-auto flex justify-center">
        <SocialLinks githubUrl="https://github.com/t4ko0522/vrcft" twitterUrl="https://twitter.com/tako_0522" />
      </div>
    </footer>
  )
}
