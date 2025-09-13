'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { RouteGuard, useRoleAccess } from '@/components/route-guard'
import { Button } from '@/components/ui/button'
import { Sidebar } from '@/components/layout/Sidebar'
import { 
  Building2, 
  Users, 
  FileText, 
  DollarSign, 
  Wrench, 
  BarChart3,
  Settings,
  Bell,
  User
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { MobileBottomNavigation, MobileTopBar, MobileFloatingActionButton } from '@/components/mobile-navigation'
import { AppHeader } from '@/components/layout/AppHeader'
import { UserRole } from '@prisma/client'

const navigation = [
  { name: 'Properties', href: '/dashboard/properties', icon: Building2 },
  { name: 'Tenants', href: '/dashboard/tenants', icon: Users },
  { name: 'Leases', href: '/dashboard/leases', icon: FileText },
  { name: 'Payments', href: '/dashboard/payments', icon: DollarSign },
  { name: 'Maintenance', href: '/dashboard/maintenance', icon: Wrench },
  { name: 'Contractors', href: '/dashboard/contractors', icon: User },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
]

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const pathname = usePathname()
  const { canManageProperties, canViewAnalytics, canManagePayments } = useRoleAccess()

  // Filter navigation based on user permissions
  const filteredNavigation = navigation.filter(item => {
    switch (item.href) {
      case '/dashboard/properties':
        return canManageProperties()
      case '/dashboard/payments':
        return canManagePayments()
      case '/dashboard/analytics':
        return canViewAnalytics()
      case '/dashboard/tenants':
      case '/dashboard/leases':
        return canManageProperties()
      default:
        return true
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900">
      {/* Mobile Top Bar - Only visible on mobile */}
      <div className="md:hidden">
        <MobileTopBar />
      </div>

      {/* Desktop Header - modern glass */}
      <div className="hidden md:block">
        <AppHeader title="LeaseFlow" subtitle={session?.user?.role as string} />
      </div>

      <div className="flex">
        {/* Desktop Sidebar - glassmorphism + collapse */}
        <Sidebar
          items={filteredNavigation}
          footer={(
            <Link href="/dashboard/settings" className="flex items-center gap-2 text-sm">
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          )}
          className=""
        />

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6">
          {children}
        </main>
      </div>

      {/* Mobile Navigation - Only visible on mobile */}
      <MobileBottomNavigation />
      
      {/* Mobile Floating Action Button */}
      <MobileFloatingActionButton />
    </div>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RouteGuard 
      allowedRoles={[UserRole.COMPANY_OWNER, UserRole.PROPERTY_MANAGER, UserRole.ACCOUNTANT]}
      fallbackPath="/auth/signin"
    >
      <DashboardContent>{children}</DashboardContent>
    </RouteGuard>
  )
}
