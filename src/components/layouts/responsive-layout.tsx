'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { UserRole } from '@prisma/client'
import {
  Home,
  Building2,
  Wrench,
  CreditCard,
  Users,
  Settings,
  Menu,
  Bell,
  Search,
  User,
  LogOut,
  Moon,
  Sun,
  ChevronDown,
  MessageCircle,
  BarChart3,
  FileText,
  Shield,
  HelpCircle
} from 'lucide-react'

// Navigation items for different roles
const navigationConfig = {
  [UserRole.TENANT]: [
    { name: 'Ana Sayfa', href: '/tenant/dashboard', icon: Home },
    { name: 'Bakım Talepleri', href: '/tenant/maintenance', icon: Wrench },
    { name: 'Ödemeler', href: '/tenant/payments', icon: CreditCard },
    { name: 'Mesajlar', href: '/tenant/messages', icon: MessageCircle },
    { name: 'Sözleşme', href: '/tenant/lease', icon: FileText },
    { name: 'Ayarlar', href: '/tenant/settings', icon: Settings }
  ],
  [UserRole.PROPERTY_MANAGER]: [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Mülkler', href: '/dashboard/properties', icon: Building2 },
    { name: 'Bakım Yönetimi', href: '/dashboard/maintenance', icon: Wrench },
    { name: 'Kiracılar', href: '/dashboard/tenants', icon: Users },
    { name: 'Ödemeler', href: '/dashboard/payments', icon: CreditCard },
    { name: 'Raporlar', href: '/dashboard/reports', icon: BarChart3 },
    { name: 'Ayarlar', href: '/dashboard/settings', icon: Settings }
  ],
  [UserRole.COMPANY_OWNER]: [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Mülkler', href: '/dashboard/properties', icon: Building2 },
    { name: 'Bakım Yönetimi', href: '/dashboard/maintenance', icon: Wrench },
    { name: 'Kullanıcılar', href: '/dashboard/users', icon: Users },
    { name: 'Finansal', href: '/dashboard/financial', icon: CreditCard },
    { name: 'Analitik', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Güvenlik', href: '/dashboard/security', icon: Shield },
    { name: 'Ayarlar', href: '/dashboard/settings', icon: Settings }
  ],
  [UserRole.CONTRACTOR]: [
    { name: 'Görevlerim', href: '/contractor/tasks', icon: Wrench },
    { name: 'Takvim', href: '/contractor/calendar', icon: Home },
    { name: 'Mesajlar', href: '/contractor/messages', icon: MessageCircle },
    { name: 'Profil', href: '/contractor/profile', icon: User },
    { name: 'Ayarlar', href: '/contractor/settings', icon: Settings }
  ]
}

interface ResponsiveLayoutProps {
  children: React.ReactNode
  userRole?: UserRole
}

export function ResponsiveLayout({ children, userRole }: ResponsiveLayoutProps) {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Get user role from session or prop
  const currentRole = userRole || session?.user?.role || UserRole.TENANT
  const navigationItems = navigationConfig[currentRole] || navigationConfig[UserRole.TENANT]

  // Check if mobile
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // Dark mode toggle
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
  }

  // Desktop Sidebar Component
  const DesktopSidebar = () => (
    <div className="sidebar flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-foreground">PropManage</h1>
            <p className="text-xs text-muted-foreground">Mülk Yönetimi</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                'nav-item',
                isActive && 'nav-item-active'
              )}
            >
              <item.icon className="nav-icon" />
              {item.name}
            </a>
          )
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {session?.user?.name || 'Kullanıcı'}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {session?.user?.email}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={toggleDarkMode}>
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  )

  // Desktop Header Component
  const DesktopHeader = () => (
    <div className="header flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <h2 className="text-lg font-semibold text-foreground">
          {navigationItems.find(item => item.href === pathname)?.name || 'Dashboard'}
        </h2>
      </div>

      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Ara..."
            className="form-input pl-10 w-64"
          />
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="sm">
          <Bell className="w-4 h-4" />
        </Button>

        {/* Help */}
        <Button variant="ghost" size="sm">
          <HelpCircle className="w-4 h-4" />
        </Button>

        {/* User Menu */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
    </div>
  )

  // Mobile Header Component
  const MobileHeader = () => (
    <div className="mobile-header flex items-center justify-between px-4">
      <div className="flex items-center space-x-3">
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0">
            <MobileSidebar />
          </SheetContent>
        </Sheet>

        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
            <Building2 className="w-4 h-4 text-primary-foreground" />
          </div>
          <h1 className="font-semibold text-foreground">PropManage</h1>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm">
          <Search className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <Bell className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )

  // Mobile Sidebar Component
  const MobileSidebar = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Building2 className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-foreground">PropManage</h1>
            <p className="text-sm text-muted-foreground">Mülk Yönetimi</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
            <User className="w-6 h-6" />
          </div>
          <div>
            <p className="font-medium text-foreground">
              {session?.user?.name || 'Kullanıcı'}
            </p>
            <p className="text-sm text-muted-foreground">
              {session?.user?.email}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {currentRole === UserRole.TENANT ? 'Kiracı' :
               currentRole === UserRole.PROPERTY_MANAGER ? 'Mülk Yöneticisi' :
               currentRole === UserRole.COMPANY_OWNER ? 'Şirket Sahibi' :
               currentRole === UserRole.CONTRACTOR ? 'Müteahhit' : 'Kullanıcı'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                'nav-item text-base py-3',
                isActive && 'nav-item-active'
              )}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon className="nav-icon w-5 h-5" />
              {item.name}
            </a>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border space-y-2">
        <Button variant="ghost" className="w-full justify-start" onClick={toggleDarkMode}>
          {isDarkMode ? <Sun className="w-4 h-4 mr-3" /> : <Moon className="w-4 h-4 mr-3" />}
          {isDarkMode ? 'Açık Tema' : 'Koyu Tema'}
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <HelpCircle className="w-4 h-4 mr-3" />
          Yardım
        </Button>
        <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
          <LogOut className="w-4 h-4 mr-3" />
          Çıkış Yap
        </Button>
      </div>
    </div>
  )

  // Mobile Bottom Navigation Component
  const MobileBottomNav = () => {
    const primaryItems = navigationItems.slice(0, 4) // İlk 4 önemli item
    
    return (
      <div className="mobile-nav fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="flex items-center justify-around">
          {primaryItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <a
                key={item.href}
                href={item.href}
                className={cn(
                  'mobile-nav-item',
                  isActive && 'mobile-nav-item-active'
                )}
              >
                <item.icon className="mobile-nav-icon" />
                <span className="text-xs font-medium">{item.name}</span>
              </a>
            )
          })}
          
          {/* More Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <button className="mobile-nav-item">
                <Menu className="mobile-nav-icon" />
                <span className="text-xs font-medium">Daha Fazla</span>
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-auto">
              <div className="p-4">
                <h3 className="font-semibold text-foreground mb-4">Tüm Menü</h3>
                <div className="grid grid-cols-3 gap-4">
                  {navigationItems.slice(4).map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className="flex flex-col items-center p-3 rounded-lg hover:bg-muted transition-colors"
                    >
                      <item.icon className="w-6 h-6 mb-2 text-muted-foreground" />
                      <span className="text-xs text-center">{item.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    )
  }

  // Render layout based on screen size
  if (isMobile) {
    return (
      <div className="layout-mobile">
        <MobileHeader />
        <main className="mobile-main">
          {children}
        </main>
        <MobileBottomNav />
      </div>
    )
  }

  return (
    <div className="layout-desktop">
      <DesktopSidebar />
      <DesktopHeader />
      <main className="main-content">
        {children}
      </main>
    </div>
  )
}

// Layout wrapper with role detection
export function RoleBasedLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const userRole = session?.user?.role as UserRole

  return (
    <ResponsiveLayout userRole={userRole}>
      {children}
    </ResponsiveLayout>
  )
}

// Utility hook for layout information
export function useLayout() {
  const [isMobile, setIsMobile] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  return {
    isMobile,
    sidebarCollapsed,
    setSidebarCollapsed,
    toggleSidebar: () => setSidebarCollapsed(!sidebarCollapsed)
  }
}

