'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Building2, Users, AlertCircle, DollarSign, Calendar, Settings, Plus } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f9fafb'
      }}>
        <div style={{
          width: '8rem',
          height: '8rem',
          border: '4px solid #e5e7eb',
          borderTop: '4px solid #2563eb',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <style jsx>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  if (!session) {
    redirect('/auth/signin')
  }

  const stats = [
    {
      title: 'Total Properties',
      value: '12',
      description: 'Active properties under management',
      icon: Building2,
      color: '#2563eb'
    },
    {
      title: 'Total Tenants', 
      value: '45',
      description: 'Currently occupied units',
      icon: Users,
      color: '#10b981'
    },
    {
      title: 'Open Issues',
      value: '8',
      description: 'Maintenance requests pending',
      icon: AlertCircle,
      color: '#f59e0b'
    },
    {
      title: 'Monthly Revenue',
      value: '$24,800',
      description: 'This month\'s rent collection',
      icon: DollarSign,
      color: '#059669'
    }
  ]

  const recentActivities = [
    {
      id: 1,
      type: 'maintenance',
      title: 'Plumbing issue reported',
      description: 'Apartment 3B - Kitchen sink leak',
      time: '2 hours ago',
      status: 'pending'
    },
    {
      id: 2,
      type: 'payment',
      title: 'Rent payment received',
      description: 'Apartment 2A - $1,200',
      time: '4 hours ago',
      status: 'completed'
    },
    {
      id: 3,
      type: 'tenant',
      title: 'New tenant application',
      description: 'John Smith - Apartment 1C',
      time: '1 day ago',
      status: 'review'
    }
  ]

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f9fafb' 
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 1rem'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem 0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Building2 style={{ 
                height: '2rem', 
                width: '2rem', 
                color: '#2563eb', 
                marginRight: '0.75rem' 
              }} />
              <div>
                <h1 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#111827',
                  margin: 0
                }}>
                  PropManage
                </h1>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  margin: 0
                }}>
                  Welcome back, {session.user?.name || session.user?.email}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                backgroundColor: '#ffffff',
                color: '#374151',
                fontSize: '0.875rem',
                cursor: 'pointer'
              }}>
                <Settings style={{ height: '1rem', width: '1rem' }} />
                Settings
              </button>
              <button style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '0.375rem',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                fontSize: '0.875rem',
                cursor: 'pointer'
              }}>
                <Plus style={{ height: '1rem', width: '1rem' }} />
                Add Property
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '2rem 1rem'
      }}>
        {/* Role Info */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{
            background: 'linear-gradient(to right, #3b82f6, #9333ea)',
            color: '#ffffff',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h2 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  margin: '0 0 0.5rem 0'
                }}>
                  Dashboard
                </h2>
                <p style={{ 
                  color: '#dbeafe', 
                  margin: '0 0 0.25rem 0',
                  fontSize: '0.875rem'
                }}>
                  Role: {session.user?.role || 'User'}
                </p>
                <p style={{ 
                  color: '#dbeafe', 
                  margin: 0,
                  fontSize: '0.875rem'
                }}>
                  Company: {session.user?.company?.name || 'Demo Company'}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  margin: '0 0 0.25rem 0'
                }}>
                  {new Date().toLocaleDateString('tr-TR')}
                </p>
                <p style={{ 
                  color: '#dbeafe', 
                  margin: 0,
                  fontSize: '0.875rem'
                }}>
                  Today
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {stats.map((stat, index) => (
            <div key={index} style={{
              backgroundColor: '#ffffff',
              borderRadius: '0.5rem',
              padding: '1.5rem',
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
              transition: 'box-shadow 0.3s ease'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <p style={{
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#6b7280',
                    margin: '0 0 0.5rem 0'
                  }}>
                    {stat.title}
                  </p>
                  <p style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: '#111827',
                    margin: '0 0 0.25rem 0'
                  }}>
                    {stat.value}
                  </p>
                  <p style={{
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    margin: 0
                  }}>
                    {stat.description}
                  </p>
                </div>
                <stat.icon style={{ 
                  height: '2rem', 
                  width: '2rem', 
                  color: stat.color 
                }} />
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#111827',
              margin: '0 0 0.5rem 0'
            }}>
              Quick Actions
            </h3>
            <p style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              margin: '0 0 1.5rem 0'
            }}>
              Common tasks and shortcuts
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1rem'
            }}>
              {[
                { icon: Building2, label: 'Add Property' },
                { icon: Users, label: 'Manage Tenants' },
                { icon: AlertCircle, label: 'Maintenance' },
                { icon: DollarSign, label: 'Payments' },
                { icon: Calendar, label: 'Schedule' },
                { icon: Settings, label: 'Settings' }
              ].map((action, index) => (
                <button key={index} style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '5rem',
                  padding: '1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  backgroundColor: '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}>
                  <action.icon style={{ 
                    height: '1.5rem', 
                    width: '1.5rem', 
                    marginBottom: '0.5rem',
                    color: '#6b7280'
                  }} />
                  <span style={{ 
                    fontSize: '0.875rem',
                    color: '#374151'
                  }}>
                    {action.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#111827',
              margin: '0 0 0.5rem 0'
            }}>
              Occupancy Rate
            </h3>
            <p style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              margin: '0 0 1.5rem 0'
            }}>
              Current occupancy status
            </p>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '3rem',
                fontWeight: '700',
                color: '#10b981',
                margin: '0 0 0.5rem 0'
              }}>
                87%
              </div>
              <p style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                margin: '0 0 1rem 0'
              }}>
                39 of 45 units occupied
              </p>
              <div style={{
                width: '100%',
                height: '0.5rem',
                backgroundColor: '#e5e7eb',
                borderRadius: '0.25rem',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: '87%',
                  height: '100%',
                  backgroundColor: '#10b981'
                }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '0.5rem',
          padding: '1.5rem',
          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
        }}>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#111827',
            margin: '0 0 0.5rem 0'
          }}>
            Recent Activities
          </h3>
          <p style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            margin: '0 0 1.5rem 0'
          }}>
            Latest updates and notifications
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recentActivities.map((activity) => (
              <div key={activity.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}>
                  <div style={{
                    width: '0.75rem',
                    height: '0.75rem',
                    borderRadius: '50%',
                    backgroundColor: activity.status === 'completed' ? '#10b981' :
                      activity.status === 'pending' ? '#f59e0b' : '#3b82f6'
                  }}></div>
                  <div>
                    <h4 style={{
                      fontWeight: '500',
                      color: '#111827',
                      margin: '0 0 0.25rem 0'
                    }}>
                      {activity.title}
                    </h4>
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#6b7280',
                      margin: 0
                    }}>
                      {activity.description}
                    </p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#6b7280',
                    margin: '0 0 0.5rem 0'
                  }}>
                    {activity.time}
                  </p>
                  <span style={{
                    padding: '0.25rem 0.625rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    backgroundColor: activity.status === 'completed' ? '#dcfce7' :
                      activity.status === 'pending' ? '#fef3c7' : '#dbeafe',
                    color: activity.status === 'completed' ? '#166534' :
                      activity.status === 'pending' ? '#92400e' : '#1e40af'
                  }}>
                    {activity.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Demo Navigation */}
        <div style={{ marginTop: '2rem' }}>
          <div style={{
            backgroundColor: '#f3f4f6',
            borderRadius: '0.5rem',
            padding: '1.5rem'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              margin: '0 0 1rem 0',
              color: '#111827'
            }}>
              Explore Demo Features
            </h3>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <Link href="/demo/ui-checklist">
                <button style={{
                  padding: '0.5rem 1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  backgroundColor: '#ffffff',
                  color: '#374151',
                  textDecoration: 'none',
                  cursor: 'pointer'
                }}>
                  UI Components Demo
                </button>
              </Link>
              <Link href="/demo/pwa-ui">
                <button style={{
                  padding: '0.5rem 1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  backgroundColor: '#ffffff',
                  color: '#374151',
                  textDecoration: 'none',
                  cursor: 'pointer'
                }}>
                  PWA Features Demo
                </button>
              </Link>
              <Link href="/test-css">
                <button style={{
                  padding: '0.5rem 1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  backgroundColor: '#ffffff',
                  color: '#374151',
                  textDecoration: 'none',
                  cursor: 'pointer'
                }}>
                  CSS Test Page
                </button>
              </Link>
              <Link href="/">
                <button style={{
                  padding: '0.5rem 1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  backgroundColor: '#ffffff',
                  color: '#374151',
                  textDecoration: 'none',
                  cursor: 'pointer'
                }}>
                  Back to Landing Page
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}