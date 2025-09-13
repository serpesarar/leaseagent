"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Menu, X } from "lucide-react"
import { useState } from "react"

export interface SidebarItem {
  name: string
  href: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  badge?: string | number
}

interface SidebarProps {
  items: SidebarItem[]
  footer?: React.ReactNode
  header?: React.ReactNode
  className?: string
}

export function Sidebar({ items, footer, header, className }: SidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className={cn("hidden md:flex h-[100dvh] sticky top-0 z-40", className)}>
      <motion.aside
        initial={{ x: 0, opacity: 0.95 }}
        animate={{ width: collapsed ? 72 : 260, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 24 }}
        className={cn(
          "glass dark:glass-dark border-r border-white/10 flex flex-col rounded-r-2xl m-3 shadow-xl",
          "bg-gradient-to-b from-slate-900/70 via-purple-900/40 to-slate-900/60 text-white"
        )}
      >
        <div className="flex items-center justify-between p-3">
          <div className={cn("flex items-center gap-2", collapsed && "justify-center w-full")}> 
            {header}
          </div>
          <button
            aria-label="Toggle sidebar"
            onClick={() => setCollapsed((s) => !s)}
            className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10"
          >
            {collapsed ? <Menu className="h-5 w-5"/> : <X className="h-5 w-5"/>}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-1">
          <ul className="space-y-1">
            {items.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium",
                      "transition-all duration-200 hover:bg-white/10",
                      isActive && "bg-gradient-to-r from-blue-600/80 to-purple-600/80 text-white shadow-lg"
                    )}
                    title={collapsed ? item.name : undefined}
                  >
                    <Icon className={cn("h-5 w-5 text-white/90 group-hover:scale-110 transition", isActive && "text-white")}/>
                    {!collapsed && (
                      <span className="truncate">{item.name}</span>
                    )}
                    {!collapsed && item.badge != null && (
                      <span className="ml-auto inline-flex items-center rounded-full bg-white/20 px-2 py-0.5 text-xs">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {footer && (
          <div className={cn("p-3 border-t border-white/10", collapsed && "hidden")}>{footer}</div>
        )}
      </motion.aside>
    </div>
  )
}


