'use client'

import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { UserRole } from '@prisma/client'

interface RouteGuardProps {
  children: React.ReactNode
  allowedRoles?: UserRole[]
  fallbackPath?: string
  requireAuth?: boolean
}

export function RouteGuard({ 
  children, 
  allowedRoles, 
  fallbackPath = '/auth/signin',
  requireAuth = true 
}: RouteGuardProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (status === 'loading') return // Still loading

    // Check authentication requirement
    if (requireAuth && !session) {
      router.push(`${fallbackPath}?callbackUrl=${encodeURIComponent(pathname)}`)
      return
    }

    // Check role-based access
    if (session && allowedRoles && !allowedRoles.includes(session.user.role)) {
      // Redirect based on user role
      const roleBasedRedirect = getRoleBasedRedirect(session.user.role)
      router.push(roleBasedRedirect)
      return
    }
  }, [session, status, router, pathname, allowedRoles, fallbackPath, requireAuth])

  // Show loading while checking authentication
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Don't render if authentication is required but user is not authenticated
  if (requireAuth && !session) {
    return null
  }

  // Don't render if user doesn't have required role
  if (session && allowedRoles && !allowedRoles.includes(session.user.role)) {
    return null
  }

  return <>{children}</>
}

// Role-based redirect logic
function getRoleBasedRedirect(role: UserRole): string {
  switch (role) {
    case UserRole.SUPER_ADMIN:
      return '/admin/dashboard'
    case UserRole.COMPANY_OWNER:
      return '/dashboard'
    case UserRole.PROPERTY_MANAGER:
      return '/dashboard/properties'
    case UserRole.TENANT:
      return '/tenant/dashboard'
    case UserRole.CONTRACTOR:
      return '/contractor/dashboard'
    case UserRole.ACCOUNTANT:
      return '/dashboard/payments'
    default:
      return '/dashboard'
  }
}

// Hook for role-based access control
export function useRoleAccess() {
  const { data: session } = useSession()

  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!session?.user) return false
    
    const allowedRoles = Array.isArray(roles) ? roles : [roles]
    return allowedRoles.includes(session.user.role)
  }

  const hasAnyRole = (roles: UserRole[]): boolean => {
    if (!session?.user) return false
    return roles.includes(session.user.role)
  }

  const isRole = (role: UserRole): boolean => {
    return session?.user?.role === role
  }

  const canAccessProperty = (propertyId?: string): boolean => {
    if (!session?.user) return false
    
    // Super admin and company owner can access all properties
    if ([UserRole.SUPER_ADMIN, UserRole.COMPANY_OWNER].includes(session.user.role)) {
      return true
    }
    
    // Property managers can access properties they manage
    if (session.user.role === UserRole.PROPERTY_MANAGER) {
      // In a real app, you'd check the user's assigned properties
      return true
    }
    
    // Tenants can only access their own property
    if (session.user.role === UserRole.TENANT) {
      // In a real app, you'd check if the tenant lives in this property
      return true
    }
    
    return false
  }

  const canManageUsers = (): boolean => {
    return hasAnyRole([UserRole.SUPER_ADMIN, UserRole.COMPANY_OWNER])
  }

  const canManageProperties = (): boolean => {
    return hasAnyRole([
      UserRole.SUPER_ADMIN, 
      UserRole.COMPANY_OWNER, 
      UserRole.PROPERTY_MANAGER
    ])
  }

  const canManagePayments = (): boolean => {
    return hasAnyRole([
      UserRole.SUPER_ADMIN, 
      UserRole.COMPANY_OWNER, 
      UserRole.PROPERTY_MANAGER,
      UserRole.ACCOUNTANT
    ])
  }

  const canViewAnalytics = (): boolean => {
    return hasAnyRole([
      UserRole.SUPER_ADMIN, 
      UserRole.COMPANY_OWNER, 
      UserRole.PROPERTY_MANAGER
    ])
  }

  return {
    user: session?.user || null,
    hasRole,
    hasAnyRole,
    isRole,
    canAccessProperty,
    canManageUsers,
    canManageProperties,
    canManagePayments,
    canViewAnalytics,
    // Role checks
    isSuperAdmin: isRole(UserRole.SUPER_ADMIN),
    isCompanyOwner: isRole(UserRole.COMPANY_OWNER),
    isPropertyManager: isRole(UserRole.PROPERTY_MANAGER),
    isTenant: isRole(UserRole.TENANT),
    isContractor: isRole(UserRole.CONTRACTOR),
    isAccountant: isRole(UserRole.ACCOUNTANT)
  }
}

