'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/core-components'
import { Button } from '@/components/ui/core-components'
import { 
  AnimatedCard,
  Skeleton,
  SuccessAnimation,
  ErrorAnimation,
  LoadingButton,
  FloatingActionButton,
  ProgressRing,
  Toast,
  AnimatedCounter
} from '@/components/ui/animations'
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info, 
  Loader2, 
  Heart, 
  Star, 
  ThumbsUp,
  Download,
  Upload,
  RefreshCw,
  Plus,
  Minus,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ChevronLeft,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Bell,
  BellOff,
  Settings,
  User,
  Home,
  Building2,
  CreditCard,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Share2,
  Copy,
  ExternalLink,
  Trash2,
  Edit,
  Save,
  X,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  Battery,
  BatteryLow,
  Signal,
  SignalOff
} from 'lucide-react'

export default function AnimationsShowcase() {
  const [showSuccess, setShowSuccess] = useState(false)
  const [showError, setShowError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [counter, setCounter] = useState(0)
  const [toast, setToast] = useState<{
    show: boolean
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    description?: string
  }>({
    show: false,
    type: 'success',
    title: '',
    description: ''
  })

  // Progress animation
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 0
        return prev + 10
      })
    }, 500)

    return () => clearInterval(interval)
  }, [])

  // Counter animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCounter(prev => prev + Math.floor(Math.random() * 100))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const handleSuccess = () => {
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 2000)
  }

  const handleError = () => {
    setShowError(true)
    setTimeout(() => setShowError(false), 2000)
  }

  const handleLoading = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 3000)
  }

  const showToast = (type: 'success' | 'error' | 'warning' | 'info') => {
    const configs = {
      success: {
        title: 'Başarılı!',
        description: 'İşlem başarıyla tamamlandı.'
      },
      error: {
        title: 'Hata!',
        description: 'Bir hata oluştu.'
      },
      warning: {
        title: 'Uyarı!',
        description: 'Dikkatli olun.'
      },
      info: {
        title: 'Bilgi',
        description: 'Önemli bir bilgi.'
      }
    }

    setToast({
      show: true,
      type,
      ...configs[type]
    })
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Micro-interactions & Animations</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Modern, akıcı ve kullanıcı dostu animasyonlar. 
            Smooth transitions, loading states ve interactive effects.
          </p>
        </div>

        {/* Animated Cards */}
        <section className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Animated Cards</h2>
            <p className="text-muted-foreground">Hover effects ve smooth transitions ile kartlar</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatedCard 
              animation="fadeInUp" 
              delay={0}
              hover
              clickable
            >
              <Card className="h-32 flex items-center justify-center">
                <div className="text-center">
                  <Building2 className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <p className="font-medium">Fade In Up</p>
                </div>
              </Card>
            </AnimatedCard>

            <AnimatedCard 
              animation="scaleIn" 
              delay={100}
              hover
              clickable
            >
              <Card className="h-32 flex items-center justify-center">
                <div className="text-center">
                  <Home className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <p className="font-medium">Scale In</p>
                </div>
              </Card>
            </AnimatedCard>

            <AnimatedCard 
              animation="bounceIn" 
              delay={200}
              hover
              clickable
            >
              <Card className="h-32 flex items-center justify-center">
                <div className="text-center">
                  <Heart className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <p className="font-medium">Bounce In</p>
                </div>
              </Card>
            </AnimatedCard>
          </div>
        </section>

        {/* Loading States */}
        <section className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Loading States</h2>
            <p className="text-muted-foreground">Skeleton loaders ve loading animations</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Skeleton Examples */}
            <Card>
              <CardHeader>
                <CardTitle>Skeleton Loaders</CardTitle>
                <CardDescription>İçerik yüklenirken gösterilen placeholder'lar</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Skeleton variant="text" width="100%" height="20px" />
                  <Skeleton variant="text" width="80%" height="20px" />
                  <Skeleton variant="text" width="60%" height="20px" />
                </div>
                
                <div className="flex items-center space-x-4">
                  <Skeleton variant="circular" width="40px" height="40px" />
                  <div className="space-y-2 flex-1">
                    <Skeleton variant="text" width="70%" height="16px" />
                    <Skeleton variant="text" width="50%" height="14px" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <Skeleton variant="rounded" width="100%" height="60px" />
                  <Skeleton variant="rounded" width="100%" height="60px" />
                  <Skeleton variant="rounded" width="100%" height="60px" />
                </div>
              </CardContent>
            </Card>

            {/* Loading Buttons */}
            <Card>
              <CardHeader>
                <CardTitle>Loading Buttons</CardTitle>
                <CardDescription>Farklı durumlarda loading gösteren butonlar</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <LoadingButton
                    loading={loading}
                    loadingText="Yükleniyor..."
                    onClick={handleLoading}
                    className="w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Dosya İndir
                  </LoadingButton>

                  <LoadingButton
                    loading={loading}
                    loadingText="Kaydediliyor..."
                    variant="secondary"
                    onClick={handleLoading}
                    className="w-full"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Kaydet
                  </LoadingButton>

                  <LoadingButton
                    loading={loading}
                    loadingText="Gönderiliyor..."
                    variant="destructive"
                    onClick={handleLoading}
                    className="w-full"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Gönder
                  </LoadingButton>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Success & Error Animations */}
        <section className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Success & Error Animations</h2>
            <p className="text-muted-foreground">Başarı ve hata durumları için animasyonlar</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Success Animation</CardTitle>
                <CardDescription>Başarılı işlemler için animasyon</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-center space-x-4">
                  <SuccessAnimation 
                    show={showSuccess} 
                    size="sm"
                    onComplete={() => console.log('Success animation completed')}
                  />
                  <SuccessAnimation 
                    show={showSuccess} 
                    size="md"
                    onComplete={() => console.log('Success animation completed')}
                  />
                  <SuccessAnimation 
                    show={showSuccess} 
                    size="lg"
                    onComplete={() => console.log('Success animation completed')}
                  />
                </div>
                
                <Button onClick={handleSuccess} className="w-full">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Success Animation Göster
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Error Animation</CardTitle>
                <CardDescription>Hata durumları için animasyon</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-center space-x-4">
                  <ErrorAnimation 
                    show={showError} 
                    size="sm"
                    onComplete={() => console.log('Error animation completed')}
                  />
                  <ErrorAnimation 
                    show={showError} 
                    size="md"
                    onComplete={() => console.log('Error animation completed')}
                  />
                  <ErrorAnimation 
                    show={showError} 
                    size="lg"
                    onComplete={() => console.log('Error animation completed')}
                  />
                </div>
                
                <Button onClick={handleError} variant="destructive" className="w-full">
                  <XCircle className="w-4 h-4 mr-2" />
                  Error Animation Göster
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Progress Components */}
        <section className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Progress Components</h2>
            <p className="text-muted-foreground">İlerleme göstergeleri ve animasyonlu sayaçlar</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Progress Ring</CardTitle>
                <CardDescription>Dairesel ilerleme göstergesi</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-center space-x-8">
                  <ProgressRing 
                    progress={progress} 
                    size={80} 
                    strokeWidth={6}
                    animated
                  />
                  <ProgressRing 
                    progress={progress} 
                    size={100} 
                    strokeWidth={8}
                    animated
                    color="hsl(var(--destructive))"
                  />
                  <ProgressRing 
                    progress={progress} 
                    size={120} 
                    strokeWidth={10}
                    animated
                    color="hsl(var(--secondary))"
                  />
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Otomatik olarak 0-100% arasında değişiyor
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Animated Counter</CardTitle>
                <CardDescription>Sayısal değerler için smooth animasyon</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary mb-2">
                      <AnimatedCounter 
                        value={counter} 
                        duration={1000}
                        prefix="₺"
                        suffix=""
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">Aylık Gelir</p>
                  </div>

                  <div className="text-center">
                    <div className="text-3xl font-bold text-secondary mb-2">
                      <AnimatedCounter 
                        value={counter} 
                        duration={800}
                        prefix=""
                        suffix=" Kiracı"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">Toplam Kiracı</p>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl font-bold text-destructive mb-2">
                      <AnimatedCounter 
                        value={counter} 
                        duration={600}
                        prefix=""
                        suffix="%"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">Doluluk Oranı</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Floating Action Buttons */}
        <section className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Floating Action Buttons</h2>
            <p className="text-muted-foreground">Farklı pozisyonlarda FAB'lar</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>FAB Positions</CardTitle>
              <CardDescription>Farklı köşelerde konumlandırılmış FAB'lar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative h-64 bg-muted/20 rounded-lg">
                <FloatingActionButton
                  icon={<Plus className="w-6 h-6" />}
                  position="top-left"
                  size="md"
                  label="Yeni Ekle"
                  onClick={() => console.log('Top Left FAB')}
                />
                
                <FloatingActionButton
                  icon={<Settings className="w-6 h-6" />}
                  position="top-right"
                  size="md"
                  label="Ayarlar"
                  onClick={() => console.log('Top Right FAB')}
                />
                
                <FloatingActionButton
                  icon={<User className="w-6 h-6" />}
                  position="bottom-left"
                  size="md"
                  label="Profil"
                  onClick={() => console.log('Bottom Left FAB')}
                />
                
                <FloatingActionButton
                  icon={<Heart className="w-6 h-6" />}
                  position="bottom-right"
                  size="lg"
                  label="Beğen"
                  pulse
                  onClick={() => console.log('Bottom Right FAB')}
                />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Toast Notifications */}
        <section className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Toast Notifications</h2>
            <p className="text-muted-foreground">Slide-in animasyonlu bildirimler</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Toast Types</CardTitle>
              <CardDescription>Farklı türde toast bildirimleri</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button 
                  variant="default" 
                  onClick={() => showToast('success')}
                  className="flex items-center"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Success
                </Button>
                
                <Button 
                  variant="destructive" 
                  onClick={() => showToast('error')}
                  className="flex items-center"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Error
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => showToast('warning')}
                  className="flex items-center"
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Warning
                </Button>
                
                <Button 
                  variant="secondary" 
                  onClick={() => showToast('info')}
                  className="flex items-center"
                >
                  <Info className="w-4 h-4 mr-2" />
                  Info
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Interactive Elements */}
        <section className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Interactive Elements</h2>
            <p className="text-muted-foreground">Hover, focus ve click efektleri</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Hover Effects */}
            <Card>
              <CardHeader>
                <CardTitle>Hover Effects</CardTitle>
                <CardDescription>Mouse hover efektleri</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-4 bg-muted/50 rounded-lg hover-lift cursor-pointer">
                    <p className="font-medium">Hover Lift</p>
                    <p className="text-sm text-muted-foreground">Yukarı kaldırma efekti</p>
                  </div>
                  
                  <div className="p-4 bg-muted/50 rounded-lg hover-scale cursor-pointer">
                    <p className="font-medium">Hover Scale</p>
                    <p className="text-sm text-muted-foreground">Büyütme efekti</p>
                  </div>
                  
                  <div className="p-4 bg-muted/50 rounded-lg hover-glow cursor-pointer">
                    <p className="font-medium">Hover Glow</p>
                    <p className="text-sm text-muted-foreground">Parlama efekti</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Button Animations */}
            <Card>
              <CardHeader>
                <CardTitle>Button Animations</CardTitle>
                <CardDescription>Buton animasyonları</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Button className="w-full btn-press">
                    <Download className="w-4 h-4 mr-2" />
                    Press Effect
                  </Button>
                  
                  <Button variant="secondary" className="w-full btn-loading">
                    <Upload className="w-4 h-4 mr-2" />
                    Loading Shimmer
                  </Button>
                  
                  <Button variant="outline" className="w-full hover-scale">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Hover Scale
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Icon Animations */}
            <Card>
              <CardHeader>
                <CardTitle>Icon Animations</CardTitle>
                <CardDescription>İkon animasyonları</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center p-3 hover-scale cursor-pointer">
                    <Heart className="w-6 h-6 mx-auto mb-2 text-red-500 animate-pulse" />
                    <p className="text-xs">Pulse</p>
                  </div>
                  
                  <div className="text-center p-3 hover-scale cursor-pointer">
                    <Star className="w-6 h-6 mx-auto mb-2 text-yellow-500 animate-bounce" />
                    <p className="text-xs">Bounce</p>
                  </div>
                  
                  <div className="text-center p-3 hover-scale cursor-pointer">
                    <RefreshCw className="w-6 h-6 mx-auto mb-2 text-blue-500 animate-spin" />
                    <p className="text-xs">Spin</p>
                  </div>
                  
                  <div className="text-center p-3 hover-scale cursor-pointer">
                    <Bell className="w-6 h-6 mx-auto mb-2 text-green-500 animate-ping" />
                    <p className="text-xs">Ping</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CSS Animation Classes */}
        <section className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">CSS Animation Classes</h2>
            <p className="text-muted-foreground">Tailwind CSS ile kullanılabilir animasyon sınıfları</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Available Classes</CardTitle>
              <CardDescription>Kullanılabilir animasyon sınıfları</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[
                  'animate-shimmer',
                  'animate-wave',
                  'animate-scale-in',
                  'animate-shake',
                  'animate-progress',
                  'animate-bounce-in',
                  'animate-slide-in-up',
                  'animate-slide-in-down',
                  'animate-slide-in-left',
                  'animate-slide-in-right',
                  'animate-fade-in',
                  'animate-fade-in-up',
                  'animate-fade-in-down',
                  'animate-fade-in-left',
                  'animate-fade-in-right',
                  'animate-rotate-in',
                  'animate-float',
                  'animate-glow',
                  'animate-pulse-ring',
                  'animate-typing'
                ].map((className) => (
                  <div key={className} className="p-2 bg-muted/50 rounded text-center">
                    <code className="text-xs">{className}</code>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Toast Component */}
      <Toast
        show={toast.show}
        type={toast.type}
        title={toast.title}
        description={toast.description}
        onClose={() => setToast(prev => ({ ...prev, show: false }))}
      />
    </div>
  )
}

