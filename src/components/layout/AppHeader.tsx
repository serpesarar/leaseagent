"use client"

import { motion } from "framer-motion"
import { Bell, User, LayoutGrid } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AppHeaderProps {
  title?: string
  subtitle?: string
  right?: React.ReactNode
}

export function AppHeader({ title, subtitle, right }: AppHeaderProps) {
  return (
    <div className="px-4 md:px-6 py-4 sticky top-0 z-30">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass dark:glass-dark rounded-2xl border-white/20 shadow-lg"
      >
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">
              {title ?? "Property Management"}
            </h1>
            {subtitle && (
              <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" aria-label="Apps">
              <LayoutGrid className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Notifications">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Profile">
              <User className="h-5 w-5" />
            </Button>
            {right}
          </div>
        </div>
      </motion.div>
    </div>
  )
}


