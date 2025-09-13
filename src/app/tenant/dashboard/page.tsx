'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RouteGuard } from '@/components/route-guard'
import { UserRole } from '@prisma/client'
import { useToast } from '@/hooks/use-toast'
import { IssueReportingFlow } from '@/components/flows/issue-reporting-flow'
import {
  Home,
  Wrench,
  CreditCard,
  FileText,
  Phone,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  User,
  Bell,
  Settings,
  MessageCircle,
  Camera,
  MapPin,
  Thermometer,
  Zap,
  Droplets,
  Shield
} from 'lucide-react'

// Mock data - gerçek uygulamada API'den gelecek
const mockTenantData = {
  user: {
    name: 'Ahmet Yılmaz',
    email: 'ahmet.yilmaz@email.com',
    phone: '+90 532 123 45 67',
    avatar: '/avatars/tenant-avatar.jpg'
  },
  lease: {
    propertyName: 'Merkez Apartmanı',
    unitNumber: 'Daire 3A',
    address: 'Bahçelievler Mah. Atatürk Cad. No:45, Kadıköy/İstanbul',
    monthlyRent: 8500,
    leaseStart: '2024-01-01',
    leaseEnd: '2024-12-31',
    nextPaymentDate: '2024-10-01',
    daysUntilPayment: 5
  },
  maintenance: {
    activeRequests: 1,
    completedThisMonth: 2,
    avgResponseTime: '24 saat'
  },
  payments: {
    currentBalance: 0,
    nextAmount: 8500,
    lastPaymentDate: '2024-09-01',
    paymentHistory: [
      { date: '2024-09-01', amount: 8500, status: 'Ödendi' },
      { date: '2024-08-01', amount: 8500, status: 'Ödendi' },
      { date: '2024-07-01', amount: 8500, status: 'Ödendi' }
    ]
  },
  recentActivities: [
    {
      id: 1,
      type: 'maintenance',
      title: 'Musluk tamiri tamamlandı',
      description: 'Mutfak musluğu başarıyla tamir edildi',
      date: '2024-09-28',
      status: 'completed',
      icon: CheckCircle
    },
    {
      id: 2,
      type: 'payment',
      title: 'Kira ödemesi alındı',
      description: 'Eylül ayı kira ödemesi başarıyla alındı',
      date: '2024-09-01',
      status: 'completed',
      icon: CreditCard
    },
    {
      id: 3,
      type: 'maintenance',
      title: 'Yeni bakım talebi',
      description: 'Banyo lavabo tıkanıklığı bildirimi',
      date: '2024-09-25',
      status: 'pending',
      icon: Clock
    }
  ]
}

export default function TenantDashboard() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState(mockTenantData)

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleQuickAction = (action: string) => {
    toast({
      title: `${action} sayfasına yönlendiriliyor`,
      description: 'Lütfen bekleyin...'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success'
      case 'pending': return 'warning'
      case 'overdue': return 'danger'
      default: return 'info'
    }
  }

  const getPaymentStatus = () => {
    if (data.lease.daysUntilPayment <= 0) {
      return { status: 'overdue', color: 'danger', text: 'Gecikmiş Ödeme' }
    } else if (data.lease.daysUntilPayment <= 3) {
      return { status: 'due-soon', color: 'warning', text: 'Ödeme Zamanı Yaklaşıyor' }
    } else {
      return { status: 'current', color: 'success', text: 'Güncel' }
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Dashboard yükleniyor...</p>
        </div>
      </div>
    )
  }

  const paymentStatus = getPaymentStatus()

  return (
    <RouteGuard allowedRoles={[UserRole.TENANT]} fallbackPath="/auth/signin">
      <div className="min-h-screen bg-background">
        {/* Mobile Header */}
        <div className="mobile-only">
          <div className="mobile-header flex items-center justify-between px-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-semibold text-foreground">Hoş Geldiniz</h1>
                <p className="text-xs text-muted-foreground">{data.user.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="desktop-only">
          <div className="header flex items-center justify-between px-6">
            <div>
              <h1 className="text-heading-2">Kiracı Paneli</h1>
              <p className="text-muted-foreground">Hoş geldiniz, {data.user.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Bildirimler
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Ayarlar
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mobile-main md:main-content space-y-6">
          
          {/* Welcome & Status Card */}
          <Card className="card-elevated">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Home className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-heading-4">{data.lease.propertyName}</h2>
                    <p className="text-body-small">{data.lease.unitNumber}</p>
                    <p className="text-caption flex items-center mt-1">
                      <MapPin className="w-3 h-3 mr-1" />
                      {data.lease.address}
                    </p>
                  </div>
                </div>
                <div className="text-center md:text-right">
                  <Badge variant={getStatusColor(paymentStatus.status)} className="mb-2">
                    {paymentStatus.text}
                  </Badge>
                  <p className="text-body-small">
                    Sonraki ödeme: <strong>{data.lease.daysUntilPayment} gün</strong>
                  </p>
                  <p className="text-heading-4 text-primary">
                    ₺{data.lease.monthlyRent.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions - Mobile Optimized */}
          <Card className="card-flat">
            <CardHeader>
              <CardTitle className="text-heading-4">Hızlı İşlemler</CardTitle>
              <CardDescription>Sık kullanılan işlemler için hızlı erişim</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                
                {/* Sorun Bildir - Primary Action */}
                <div 
                  className="quick-action-btn quick-action-btn-primary"
                  onClick={() => handleQuickAction('Sorun Bildir')}
                >
                  <div className="quick-action-icon text-primary">
                    <Wrench className="w-6 h-6" />
                  </div>
                  <span className="font-semibold text-primary">Sorun Bildir</span>
                  <span className="text-xs text-muted-foreground mt-1">Bakım talebi</span>
                </div>

                {/* Kira Öde */}
                <div 
                  className="quick-action-btn"
                  onClick={() => handleQuickAction('Kira Öde')}
                >
                  <div className="quick-action-icon text-green-600">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <span className="font-semibold">Kira Öde</span>
                  <span className="text-xs text-muted-foreground mt-1">Online ödeme</span>
                </div>

                {/* Sözleşmemi Gör */}
                <div 
                  className="quick-action-btn"
                  onClick={() => handleQuickAction('Sözleşme')}
                >
                  <div className="quick-action-icon text-blue-600">
                    <FileText className="w-6 h-6" />
                  </div>
                  <span className="font-semibold">Sözleşmem</span>
                  <span className="text-xs text-muted-foreground mt-1">Detayları gör</span>
                </div>

                {/* Acil Durum */}
                <div 
                  className="quick-action-btn"
                  onClick={() => handleQuickAction('Acil Durum')}
                >
                  <div className="quick-action-icon text-red-600">
                    <Phone className="w-6 h-6" />
                  </div>
                  <span className="font-semibold">Acil Durum</span>
                  <span className="text-xs text-muted-foreground mt-1">7/24 destek</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dashboard Tabs */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Genel</TabsTrigger>
              <TabsTrigger value="maintenance">Bakım</TabsTrigger>
              <TabsTrigger value="payments">Ödemeler</TabsTrigger>
              <TabsTrigger value="messages">Mesajlar</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              
              {/* Stats Cards */}
              <div className="dashboard-grid-3">
                <Card className="metric-card">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="metric-label">Aktif Bakım Talepleri</p>
                      <p className="metric-value">{data.maintenance.activeRequests}</p>
                    </div>
                    <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
                      <Wrench className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                    </div>
                  </div>
                </Card>

                <Card className="metric-card">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="metric-label">Bu Ay Tamamlanan</p>
                      <p className="metric-value">{data.maintenance.completedThisMonth}</p>
                    </div>
                    <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                      <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                </Card>

                <Card className="metric-card">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="metric-label">Ortalama Yanıt Süresi</p>
                      <p className="metric-value text-lg">{data.maintenance.avgResponseTime}</p>
                    </div>
                    <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                      <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </Card>
              </div>

              {/* Recent Activities */}
              <Card className="card-flat">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Son Aktiviteler
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {data.recentActivities.map((activity) => {
                    const IconComponent = activity.icon
                    return (
                      <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className={`p-2 rounded-full ${
                          activity.status === 'completed' ? 'bg-green-100 dark:bg-green-900' :
                          activity.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900' :
                          'bg-blue-100 dark:bg-blue-900'
                        }`}>
                          <IconComponent className={`w-4 h-4 ${
                            activity.status === 'completed' ? 'text-green-600 dark:text-green-400' :
                            activity.status === 'pending' ? 'text-yellow-600 dark:text-yellow-400' :
                            'text-blue-600 dark:text-blue-400'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{activity.title}</p>
                          <p className="text-sm text-muted-foreground">{activity.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">{activity.date}</p>
                        </div>
                        <Badge variant={getStatusColor(activity.status)}>
                          {activity.status === 'completed' ? 'Tamamlandı' :
                           activity.status === 'pending' ? 'Bekliyor' : 'Aktif'}
                        </Badge>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Maintenance Tab */}
            <TabsContent value="maintenance" className="space-y-6">
              <div className="dashboard-grid-2">
                
                {/* Create Maintenance Request */}
                <Card className="card-interactive">
                  <CardHeader>
                    <CardTitle className="flex items-center text-primary">
                      <Wrench className="w-5 h-5 mr-2" />
                      Yeni Bakım Talebi
                    </CardTitle>
                    <CardDescription>
                      Dairenizle ilgili bir sorun mu var? Hemen bildirebilirsiniz.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Button className="flex flex-col items-center p-4 h-auto" variant="outline">
                        <Droplets className="w-6 h-6 mb-2 text-blue-500" />
                        <span>Su Tesisatı</span>
                      </Button>
                      <Button className="flex flex-col items-center p-4 h-auto" variant="outline">
                        <Zap className="w-6 h-6 mb-2 text-yellow-500" />
                        <span>Elektrik</span>
                      </Button>
                      <Button className="flex flex-col items-center p-4 h-auto" variant="outline">
                        <Thermometer className="w-6 h-6 mb-2 text-red-500" />
                        <span>Isıtma</span>
                      </Button>
                      <Button className="flex flex-col items-center p-4 h-auto" variant="outline">
                        <Shield className="w-6 h-6 mb-2 text-green-500" />
                        <span>Güvenlik</span>
                      </Button>
                    </div>
                    <Button className="w-full" onClick={() => handleQuickAction('Detaylı Talep')}>
                      <Camera className="w-4 h-4 mr-2" />
                      Fotoğrafla Detaylı Talep Oluştur
                    </Button>
                  </CardContent>
                </Card>

                {/* Maintenance Status */}
                <Card className="card-flat">
                  <CardHeader>
                    <CardTitle>Mevcut Taleplerim</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="status-dot status-dot-warning"></div>
                          <div>
                            <p className="font-medium">Banyo Lavabo Tıkanıklığı</p>
                            <p className="text-sm text-muted-foreground">25 Eylül 2024</p>
                          </div>
                        </div>
                        <Badge variant="warning">İnceleniyor</Badge>
                      </div>
                      
                      <div className="text-center py-8 text-muted-foreground">
                        <Wrench className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Başka aktif talebiniz bulunmuyor</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Payments Tab */}
            <TabsContent value="payments" className="space-y-6">
              <div className="dashboard-grid-2">
                
                {/* Payment Status */}
                <Card className="card-flat">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CreditCard className="w-5 h-5 mr-2" />
                      Ödeme Durumu
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center p-6 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">Sonraki Ödeme</p>
                      <p className="text-3xl font-bold text-primary">₺{data.lease.monthlyRent.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Ödeme Tarihi: {data.lease.nextPaymentDate}
                      </p>
                      <Badge variant={getStatusColor(paymentStatus.status)} className="mt-2">
                        {paymentStatus.text}
                      </Badge>
                    </div>
                    
                    <Button className="w-full" size="lg">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Şimdi Öde
                    </Button>
                  </CardContent>
                </Card>

                {/* Payment History */}
                <Card className="card-flat">
                  <CardHeader>
                    <CardTitle>Ödeme Geçmişi</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {data.payments.paymentHistory.map((payment, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="status-dot status-dot-success"></div>
                            <div>
                              <p className="font-medium">₺{payment.amount.toLocaleString()}</p>
                              <p className="text-sm text-muted-foreground">{payment.date}</p>
                            </div>
                          </div>
                          <Badge variant="success">{payment.status}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Messages Tab */}
            <TabsContent value="messages" className="space-y-6">
              <Card className="card-flat">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Mesajlar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-muted-foreground">
                    <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">Henüz mesajınız yok</p>
                    <p className="text-sm">Yönetim ile iletişime geçtiğinizde mesajlar burada görünecek</p>
                    <Button className="mt-4" variant="outline">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Yeni Mesaj Gönder
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Sorun Bildirme Akışı */}
      <IssueReportingFlow />
    </RouteGuard>
  )
}