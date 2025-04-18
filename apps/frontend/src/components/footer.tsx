"use client"

import SocialLinks from "@/components/social-links"

export default function Footer() {
  return (
    <footer className="w-full py-4 mt-auto">
      <div className="container mx-auto flex justify-center">
        <SocialLinks githubUrl="https://github.com/T4ko0522" twitterUrl="https://x.com/Tako_0522" />
      </div>
    </footer>
  )
}
