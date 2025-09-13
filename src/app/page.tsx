'use client'

import { Building2, Users, Smartphone, Shield, Zap, Globe, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const features = [
    {
      icon: Building2,
      title: 'Mülk Yönetimi',
      description: 'Kapsamlı portföy yönetimi ve takibi'
    },
    {
      icon: Users,
      title: 'Kiracı Portalı',
      description: 'Kiracılar için özel erişim alanı'
    },
    {
      icon: Smartphone,
      title: 'PWA Desteği',
      description: 'Mobil uygulama deneyimi'
    },
    {
      icon: Shield,
      title: 'Güvenli Platform',
      description: 'Enterprise düzeyde güvenlik'
    },
    {
      icon: Zap,
      title: 'Gerçek Zamanlı',
      description: 'Anlık bildirimler ve güncellemeler'
    },
    {
      icon: Globe,
      title: 'Çoklu Dil',
      description: 'Türkçe ve İngilizce desteği'
    }
  ]

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #eff6ff, #ffffff, #faf5ff)'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(4px)',
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
              <h1 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#111827'
              }}>
                PropManage
              </h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Link href="/auth/signin" style={{ textDecoration: 'none' }}>
                <button style={{
                  border: '1px solid #d1d5db',
                  backgroundColor: '#ffffff',
                  color: '#374151',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#ffffff'}
                >
                  Giriş Yap
                </button>
              </Link>
              <Link href="/auth/signup" style={{ textDecoration: 'none' }}>
                <button style={{
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#1d4ed8'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#2563eb'}
                >
                  Kaydol
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '5rem 1rem'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{
            fontSize: '2.25rem',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '1.5rem'
          }}>
            Modern <span style={{ color: '#2563eb' }}>Mülk Yönetim</span> Platformu
          </h1>
          <p style={{
            fontSize: '1.25rem',
            color: '#4b5563',
            marginBottom: '2rem',
            maxWidth: '48rem',
            margin: '0 auto 2rem auto'
          }}>
            New York'ta mülk yönetimi için tasarlanmış kapsamlı SaaS platformu. 
            Gerçek zamanlı özellikler, PWA desteği ve modern arayüz ile.
          </p>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            alignItems: 'center'
          }}>
            <Link href="/dashboard" style={{ textDecoration: 'none' }}>
              <button style={{
                backgroundColor: '#2563eb',
                color: '#ffffff',
                padding: '0.75rem 2rem',
                borderRadius: '0.5rem',
                fontSize: '1.125rem',
                fontWeight: '500',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'background-color 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#1d4ed8'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#2563eb'}
              >
                Hemen Başla
                <ArrowRight style={{ height: '1.25rem', width: '1.25rem' }} />
              </button>
            </Link>
            <Link href="/demo/ui-checklist" style={{ textDecoration: 'none' }}>
              <button style={{
                border: '1px solid #d1d5db',
                backgroundColor: '#ffffff',
                color: '#374151',
                padding: '0.75rem 2rem',
                borderRadius: '0.5rem',
                fontSize: '1.125rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#ffffff'}
              >
                Demo'yu İncele
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '5rem 1rem'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{
            fontSize: '1.875rem',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '1rem'
          }}>
            Özellikler
          </h2>
          <p style={{
            color: '#4b5563',
            maxWidth: '42rem',
            margin: '0 auto'
          }}>
            Modern teknolojiler ile geliştirilmiş güçlü özellikler
          </p>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem'
        }}>
          {features.map((feature, index) => (
            <div key={index} style={{
              backgroundColor: '#ffffff',
              borderRadius: '0.5rem',
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
              padding: '1.5rem',
              transition: 'box-shadow 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.boxShadow = '0 20px 25px -5px rgb(0 0 0 / 0.1)'}
            onMouseLeave={(e) => e.target.style.boxShadow = '0 10px 15px -3px rgb(0 0 0 / 0.1)'}
            >
              <div style={{
                width: '3rem',
                height: '3rem',
                backgroundColor: '#dbeafe',
                borderRadius: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <feature.icon style={{ 
                  height: '1.5rem', 
                  width: '1.5rem', 
                  color: '#2563eb' 
                }} />
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '0.5rem'
              }}>
                {feature.title}
              </h3>
              <p style={{
                color: '#4b5563'
              }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Demo Account Info */}
      <section style={{
        maxWidth: '56rem',
        margin: '0 auto',
        padding: '5rem 1rem'
      }}>
        <div style={{
          background: 'linear-gradient(to right, #3b82f6, #9333ea)',
          color: '#ffffff',
          borderRadius: '0.75rem',
          boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
          padding: '2rem'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              marginBottom: '1rem'
            }}>
              Demo Hesap Bilgileri
            </h2>
            <p style={{ color: '#dbeafe' }}>
              Platformu test etmek için aşağıdaki bilgileri kullanabilirsiniz
            </p>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(4px)',
              borderRadius: '0.5rem',
              padding: '1rem'
            }}>
              <h3 style={{
                fontWeight: '600',
                marginBottom: '0.5rem'
              }}>
                Şirket Sahibi
              </h3>
              <p style={{
                fontSize: '0.875rem',
                color: '#dbeafe'
              }}>
                Email: owner@demo.com
              </p>
              <p style={{
                fontSize: '0.875rem',
                color: '#dbeafe'
              }}>
                Şifre: demo123
              </p>
            </div>
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(4px)',
              borderRadius: '0.5rem',
              padding: '1rem'
            }}>
              <h3 style={{
                fontWeight: '600',
                marginBottom: '0.5rem'
              }}>
                Mülk Yöneticisi
              </h3>
              <p style={{
                fontSize: '0.875rem',
                color: '#dbeafe'
              }}>
                Email: manager@demo.com
              </p>
              <p style={{
                fontSize: '0.875rem',
                color: '#dbeafe'
              }}>
                Şifre: demo123
              </p>
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Link href="/auth/signin" style={{ textDecoration: 'none' }}>
              <button style={{
                backgroundColor: '#ffffff',
                color: '#2563eb',
                padding: '0.75rem 2rem',
                borderRadius: '0.5rem',
                fontWeight: '500',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'background-color 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#eff6ff'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#ffffff'}
              >
                Demo'yu Dene
                <ArrowRight style={{ height: '1.25rem', width: '1.25rem' }} />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Demo Pages Section */}
      <section style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '4rem 1rem'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '1rem'
          }}>
            Demo Sayfaları
          </h2>
          <p style={{ color: '#4b5563' }}>
            Platformun özelliklerini keşfedin
          </p>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
          maxWidth: '42rem',
          margin: '0 auto'
        }}>
          <Link href="/demo/ui-checklist" style={{ textDecoration: 'none' }}>
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              padding: '1.5rem',
              cursor: 'pointer',
              transition: 'box-shadow 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.boxShadow = '0 10px 15px -3px rgb(0 0 0 / 0.1)'}
            onMouseLeave={(e) => e.target.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)'}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <h3 style={{
                    fontWeight: '600',
                    color: '#111827',
                    marginBottom: '0.25rem'
                  }}>
                    UI Checklist
                  </h3>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#4b5563'
                  }}>
                    Modern UI bileşenleri
                  </p>
                </div>
                <ArrowRight style={{ 
                  height: '1.25rem', 
                  width: '1.25rem', 
                  color: '#9ca3af' 
                }} />
              </div>
            </div>
          </Link>
          
          <Link href="/demo/pwa-ui" style={{ textDecoration: 'none' }}>
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              padding: '1.5rem',
              cursor: 'pointer',
              transition: 'box-shadow 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.boxShadow = '0 10px 15px -3px rgb(0 0 0 / 0.1)'}
            onMouseLeave={(e) => e.target.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)'}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <h3 style={{
                    fontWeight: '600',
                    color: '#111827',
                    marginBottom: '0.25rem'
                  }}>
                    PWA Demo
                  </h3>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#4b5563'
                  }}>
                    Progressive Web App özellikleri
                  </p>
                </div>
                <ArrowRight style={{ 
                  height: '1.25rem', 
                  width: '1.25rem', 
                  color: '#9ca3af' 
                }} />
              </div>
            </div>
          </Link>

          <Link href="/test-css" style={{ textDecoration: 'none' }}>
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              padding: '1.5rem',
              cursor: 'pointer',
              transition: 'box-shadow 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.boxShadow = '0 10px 15px -3px rgb(0 0 0 / 0.1)'}
            onMouseLeave={(e) => e.target.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)'}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <h3 style={{
                    fontWeight: '600',
                    color: '#111827',
                    marginBottom: '0.25rem'
                  }}>
                    CSS Test
                  </h3>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#4b5563'
                  }}>
                    Renk ve stil testleri
                  </p>
                </div>
                <ArrowRight style={{ 
                  height: '1.25rem', 
                  width: '1.25rem', 
                  color: '#9ca3af' 
                }} />
              </div>
            </div>
          </Link>

          <Link href="/dashboard" style={{ textDecoration: 'none' }}>
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              padding: '1.5rem',
              cursor: 'pointer',
              transition: 'box-shadow 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.boxShadow = '0 10px 15px -3px rgb(0 0 0 / 0.1)'}
            onMouseLeave={(e) => e.target.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)'}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <h3 style={{
                    fontWeight: '600',
                    color: '#111827',
                    marginBottom: '0.25rem'
                  }}>
                    Dashboard
                  </h3>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#4b5563'
                  }}>
                    Yönetim paneli (giriş gerekli)
                  </p>
                </div>
                <ArrowRight style={{ 
                  height: '1.25rem', 
                  width: '1.25rem', 
                  color: '#9ca3af' 
                }} />
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#111827',
        color: '#ffffff',
        padding: '3rem 0'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 1rem'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center'
            }}>
              <Building2 style={{ 
                height: '1.5rem', 
                width: '1.5rem', 
                color: '#60a5fa', 
                marginRight: '0.5rem' 
              }} />
              <span style={{
                fontSize: '1.125rem',
                fontWeight: '600'
              }}>
                PropManage
              </span>
            </div>
            <div style={{
              display: 'flex',
              gap: '1.5rem',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              <Link href="/demo/ui-checklist" style={{
                color: '#9ca3af',
                textDecoration: 'none',
                transition: 'color 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.color = '#ffffff'}
              onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
              >
                UI Demo
              </Link>
              <Link href="/demo/pwa-ui" style={{
                color: '#9ca3af',
                textDecoration: 'none',
                transition: 'color 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.color = '#ffffff'}
              onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
              >
                PWA Demo
              </Link>
              <Link href="/test-css" style={{
                color: '#9ca3af',
                textDecoration: 'none',
                transition: 'color 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.color = '#ffffff'}
              onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
              >
                CSS Test
              </Link>
              <Link href="/auth/signin" style={{
                color: '#9ca3af',
                textDecoration: 'none',
                transition: 'color 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.color = '#ffffff'}
              onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
              >
                Giriş
              </Link>
            </div>
          </div>
          <div style={{
            borderTop: '1px solid #374151',
            marginTop: '2rem',
            paddingTop: '2rem',
            textAlign: 'center',
            color: '#9ca3af'
          }}>
            <p>&copy; 2024 PropManage. Modern mülk yönetim platformu.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}