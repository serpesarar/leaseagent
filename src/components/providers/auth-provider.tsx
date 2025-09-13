'use client'

import { SessionProvider } from 'next-auth/react'
import { useSession } from 'next-auth/react'
import { useAuthStore } from '@/store/auth'
import { useEffect } from 'react'

function AuthStateSync() {
  const { data: session, status } = useSession()
  const { setUser, setLoading } = useAuthStore()

  useEffect(() => {
    if (status === 'loading') {
      setLoading(true)
      return
    }

    if (session?.user) {
      setUser({
        id: session.user.id,
        email: session.user.email!,
        name: session.user.name,
        role: session.user.role,
        companyId: session.user.companyId,
        company: session.user.company,
        avatar: session.user.image,
      })
    } else {
      setUser(null)
    }
    setLoading(false)
  }, [session, status, setUser, setLoading])

  return null
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthStateSync />
      {children}
    </SessionProvider>
  )
}

