"use client"

import { motion } from "framer-motion"
import { Button, type ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface AnimatedButtonProps extends ButtonProps {
  delay?: number
}

export default function AnimatedButton({ children, className, delay = 0, ...props }: AnimatedButtonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        damping: 12,
        stiffness: 100,
        delay: delay * 0.1,
      }}
    >
      <Button className={cn("relative overflow-hidden group inline-flex items-center", className)} {...props}>
        <span className="relative z-10 flex items-center">{children}</span>
        <motion.div
          className="absolute inset-0 bg-primary/20"
          initial={{ x: "-100%" }}
          whileHover={{ x: 0 }}
          transition={{ type: "spring", damping: 15, stiffness: 100 }}
        />
      </Button>
    </motion.div>
  )
}
