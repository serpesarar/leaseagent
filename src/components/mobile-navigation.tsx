'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { 
  Home, 
  Building2, 
  Wrench, 
  DollarSign, 
  MessageSquare, 
  User,
  Plus,
  Bell,
  Search
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface NavigationItem {
  id: string
  label: string
  icon: React.ComponentType<any>
  href: string
  badge?: number
  roles?: string[]
}

const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Home',
    icon: Home,
    href: '/dashboard',
  },
  {
    id: 'properties',
    label: 'Properties',
    icon: Building2,
    href: '/dashboard/properties',
    roles: ['COMPANY_OWNER', 'PROPERTY_MANAGER']
  },
  {
    id: 'maintenance',
    label: 'Maintenance',
    icon: Wrench,
    href: '/dashboard/maintenance',
    badge: 3, // This would come from real data
  },
  {
    id: 'payments',
    label: 'Payments',
    icon: DollarSign,
    href: '/dashboard/payments',
    roles: ['COMPANY_OWNER', 'PROPERTY_MANAGER', 'ACCOUNTANT']
  },
  {
    id: 'messages',
    label: 'Messages',
    icon: MessageSquare,
    href: '/dashboard/messages',
    badge: 2,
  },
]

export function MobileBottomNavigation() {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  // Auto-hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false) // Hide when scrolling down
      } else {
        setIsVisible(true) // Show when scrolling up
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  // Filter navigation items based on user role
  const filteredItems = navigationItems.filter(item => 
    !item.roles || item.roles.includes(session?.user?.role || '')
  )

  const handleNavigation = (href: string) => {
    router.push(href)
  }

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <div className={cn(
        "md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 transition-transform duration-300",
        isVisible ? "translate-y-0" : "translate-y-full"
      )}>
        <div className="flex items-center justify-around px-2 py-1">
          {filteredItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            const Icon = item.icon
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.href)}
                className={cn(
                  "flex flex-col items-center justify-center p-2 min-w-[60px] rounded-lg transition-colors relative",
                  isActive 
                    ? "text-blue-600 bg-blue-50" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 active:bg-gray-100"
                )}
              >
                <div className="relative">
                  <Icon className="h-5 w-5 mb-1" />
                  {item.badge && item.badge > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-2 -right-2 h-4 w-4 p-0 text-xs flex items-center justify-center"
                    >
                      {item.badge > 9 ? '9+' : item.badge}
                    </Badge>
                  )}
                </div>
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Spacer to prevent content from being hidden behind navigation */}
      <div className="md:hidden h-16"></div>
    </>
  )
}

export function MobileTopBar() {
  const { data: session } = useSession()
  const [notificationCount, setNotificationCount] = useState(5)

  return (
    <div className="md:hidden sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-gray-900">PropManager</h1>
            <p className="text-xs text-gray-500">
              {session?.user?.companyName || 'Property Management'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="relative">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            {notificationCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs flex items-center justify-center"
              >
                {notificationCount > 9 ? '9+' : notificationCount}
              </Badge>
            )}
          </Button>
          <Button variant="ghost" size="sm">
            <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
              {session?.user?.image ? (
                <img 
                  src={session.user.image} 
                  alt={session.user.name || ''}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="h-3 w-3" />
              )}
            </div>
          </Button>
        </div>
      </div>
    </div>
  )
}

export function MobileFloatingActionButton() {
  const pathname = usePathname()
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  // Auto-hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  const getActionForPage = () => {
    if (pathname.includes('/maintenance')) {
      return {
        label: 'New Request',
        action: () => router.push('/maintenance/create'),
        icon: Wrench
      }
    }
    if (pathname.includes('/properties')) {
      return {
        label: 'Add Property',
        action: () => router.push('/properties/create'),
        icon: Building2
      }
    }
    return {
      label: 'Quick Action',
      action: () => router.push('/maintenance/create'),
      icon: Plus
    }
  }

  const currentAction = getActionForPage()
  const ActionIcon = currentAction.icon

  return (
    <div className={cn(
      "md:hidden fixed bottom-20 right-4 z-40 transition-all duration-300",
      isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
    )}>
      <Button
        onClick={currentAction.action}
        size="lg"
        className="h-14 w-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 active:scale-95 transition-transform"
      >
        <ActionIcon className="h-6 w-6" />
      </Button>
    </div>
  )
}

