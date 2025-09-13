'use client'

import { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        toast({
          title: 'Authentication failed',
          description: 'Invalid email or password',
          variant: 'destructive',
        })
      } else {
        // Get the updated session
        const session = await getSession()
        if (session) {
          toast({
            title: 'Welcome back!',
            description: 'You have successfully signed in.',
          })
          router.push('/dashboard')
        }
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f9fafb',
      padding: '3rem 1rem'
    }}>
      <div style={{
        maxWidth: '28rem',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem'
      }}>
        {/* Back Button */}
        <Link href="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: '#4b5563',
          textDecoration: 'none',
          fontSize: '0.875rem'
        }}>
          ← Ana Sayfaya Dön
        </Link>

        {/* Header */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <Building2 style={{ height: '3rem', width: '3rem', color: '#2563eb' }} />
          </div>
          <h2 style={{
            fontSize: '1.875rem',
            fontWeight: '800',
            color: '#111827',
            marginBottom: '0.5rem'
          }}>
            PropManage'e Hoş Geldiniz
          </h2>
          <p style={{
            fontSize: '0.875rem',
            color: '#4b5563'
          }}>
            Mülk yönetim hesabınıza giriş yapın
          </p>
        </div>

        {/* Form Card */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '0.5rem',
          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
          padding: '2rem'
        }}>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '0.5rem'
          }}>
            Giriş Yap
          </h3>
          <p style={{
            fontSize: '0.875rem',
            color: '#4b5563',
            marginBottom: '1.5rem'
          }}>
            Hesabınıza erişim için email ve şifrenizi girin
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label htmlFor="email" style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.25rem'
              }}>
                Email Adresi
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Email adresinizi girin"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
            </div>
            <div>
              <label htmlFor="password" style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.25rem'
              }}>
                Şifre
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Şifrenizi girin"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: isLoading ? '#9ca3af' : '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 style={{ 
                    height: '1rem', 
                    width: '1rem',
                    animation: 'spin 1s linear infinite'
                  }} />
                  Giriş yapılıyor...
                </>
              ) : (
                'Giriş Yap'
              )}
            </button>
          </form>

          <div style={{
            marginTop: '1.5rem',
            textAlign: 'center'
          }}>
            <p style={{
              fontSize: '0.875rem',
              color: '#4b5563'
            }}>
              Hesabınız yok mu?{' '}
              <Link href="/auth/signup" style={{
                color: '#2563eb',
                textDecoration: 'none'
              }}>
                Kayıt olun
              </Link>
            </p>
          </div>
        </div>

        {/* Demo Credentials */}
        <div style={{
          backgroundColor: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: '0.5rem',
          padding: '1.5rem'
        }}>
          <h3 style={{
            color: '#1e40af',
            fontWeight: '600',
            marginBottom: '1rem'
          }}>
            Demo Hesap Bilgileri
          </h3>
          <div style={{
            fontSize: '0.875rem',
            color: '#1e40af'
          }}>
            <p style={{ marginBottom: '0.5rem' }}><strong>Şirket Sahibi:</strong></p>
            <p style={{ marginBottom: '0.25rem' }}>Email: owner@demo.com</p>
            <p style={{ marginBottom: '1rem' }}>Şifre: demo123</p>
            <p style={{ marginBottom: '0.5rem' }}><strong>Mülk Yöneticisi:</strong></p>
            <p style={{ marginBottom: '0.25rem' }}>Email: manager@demo.com</p>
            <p>Şifre: demo123</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

