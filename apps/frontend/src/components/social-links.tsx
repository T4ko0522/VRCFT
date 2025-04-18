"use client"

import { motion } from "framer-motion"
import { Github, Twitter } from "lucide-react"
import { cn } from "@/lib/utils"
import ExternalLink from "./external-link"

interface SocialLinksProps {
  className?: string
  githubUrl: string
  twitterUrl: string
}

export default function SocialLinks({ className, githubUrl, twitterUrl }: SocialLinksProps) {
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.5,
        staggerChildren: 0.2,
      },
    },
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  }

  return (
    <motion.div
      className={cn("flex items-center gap-4", className)}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={item} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
        <ExternalLink
          href={githubUrl}
          className="text-muted-foreground hover:text-foreground transition-colors"
          showIcon={false}
        >
          <Github className="h-6 w-6" />
          <span className="sr-only">GitHub</span>
        </ExternalLink>
      </motion.div>

      <motion.div variants={item} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
        <ExternalLink
          href={twitterUrl}
          className="text-muted-foreground hover:text-foreground transition-colors"
          showIcon={false}
        >
          <Twitter className="h-6 w-6" />
          <span className="sr-only">Twitter</span>
        </ExternalLink>
      </motion.div>
    </motion.div>
  )
}
