'use client'

import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/core-components'
import { TenantCard, IssueCard, PaymentTimeline } from '@/components/ui/specialized-components'
import { Button } from '@/components/ui/core-components'
import { 
  Users, 
  Wrench, 
  Calendar, 
  Eye, 
  Edit, 
  Trash2,
  Phone,
  Mail,
  MessageCircle,
  User,
  CheckCircle,
  AlertTriangle,
  Clock,
  Droplets,
  Zap,
  CreditCard,
  Building2,
  DollarSign,
  FileText,
  ChevronRight,
  ChevronDown,
  Plus,
  Minus
} from 'lucide-react'

export default function SpecializedComponentsShowcase() {
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month')

  // Mock data
  const mockTenants = [
    {
      id: '1',
      name: 'Ahmet Yılmaz',
      unit: 'A-101',
      avatar: undefined,
      phone: '+90 532 123 45 67',
      email: 'ahmet@example.com',
      paymentStatus: 'current' as const,
      leaseEndDate: '2025-07-31',
      moveInDate: '2023-08-01',
      rentAmount: 8500,
      notes: 'Güvenilir kiracı, ödemelerini zamanında yapıyor.'
    },
    {
      id: '2',
      name: 'Fatma Demir',
      unit: 'B-205',
      avatar: undefined,
      phone: '+90 533 987 65 43',
      email: 'fatma@example.com',
      paymentStatus: 'overdue' as const,
      leaseEndDate: '2025-05-15',
      moveInDate: '2023-06-01',
      rentAmount: 7200,
      notes: 'Son 2 ay ödeme gecikmesi var.'
    },
    {
      id: '3',
      name: 'Mehmet Kaya',
      unit: 'C-301',
      avatar: undefined,
      phone: '+90 534 555 44 33',
      email: 'mehmet@example.com',
      paymentStatus: 'paid' as const,
      leaseEndDate: '2025-12-31',
      moveInDate: '2023-01-01',
      rentAmount: 9500,
      notes: 'Uzun süreli kiracı, çok memnun.'
    }
  ]

  const mockIssues = [
    {
      id: '1',
      title: 'Mutfak Lavabosu Su Sızıntısı',
      description: 'Mutfak lavabosunda sürekli su sızıntısı var. Alt dolaplar ıslanıyor.',
      category: 'plumbing' as const,
      priority: 'high' as const,
      status: 'in_progress' as const,
      assignedTo: {
        id: 'contractor-1',
        name: 'Ali Usta',
        avatar: undefined,
        role: 'Su Tesisatçısı'
      },
      progress: 75,
      createdAt: '2024-01-15',
      updatedAt: '2024-01-16',
      estimatedCost: 250,
      estimatedDuration: '2-3 gün',
      images: []
    },
    {
      id: '2',
      title: 'Elektrik Kesintisi',
      description: 'Dairede elektrik kesintisi yaşanıyor. Ana pano kontrol edilmeli.',
      category: 'electrical' as const,
      priority: 'urgent' as const,
      status: 'open' as const,
      assignedTo: undefined,
      progress: 0,
      createdAt: '2024-01-16',
      estimatedCost: 500,
      estimatedDuration: '1 gün',
      images: []
    },
    {
      id: '3',
      title: 'Kapı Tamiri',
      description: 'Ana kapı menteşeleri gevşemiş, kapanmıyor.',
      category: 'repair' as const,
      priority: 'medium' as const,
      status: 'resolved' as const,
      assignedTo: {
        id: 'contractor-2',
        name: 'Veli Tamirci',
        avatar: undefined,
        role: 'Genel Tamirci'
      },
      progress: 100,
      createdAt: '2024-01-10',
      updatedAt: '2024-01-12',
      estimatedCost: 150,
      estimatedDuration: '1 gün',
      images: []
    }
  ]

  const mockPayments = [
    {
      id: '1',
      tenantId: '1',
      tenantName: 'Ahmet Yılmaz',
      amount: 8500,
      dueDate: '2024-01-01',
      paidDate: '2024-01-01',
      status: 'paid' as const,
      method: 'transfer' as const,
      notes: 'Zamanında ödeme'
    },
    {
      id: '2',
      tenantId: '2',
      tenantName: 'Fatma Demir',
      amount: 7200,
      dueDate: '2024-01-01',
      paidDate: undefined,
      status: 'overdue' as const,
      method: undefined,
      notes: 'Gecikmiş ödeme'
    },
    {
      id: '3',
      tenantId: '3',
      tenantName: 'Mehmet Kaya',
      amount: 9500,
      dueDate: '2024-01-01',
      paidDate: '2024-01-02',
      status: 'paid' as const,
      method: 'card' as const,
      notes: 'Kart ile ödeme'
    },
    {
      id: '4',
      tenantId: '1',
      tenantName: 'Ahmet Yılmaz',
      amount: 8500,
      dueDate: '2024-02-01',
      paidDate: undefined,
      status: 'pending' as const,
      method: undefined,
      notes: 'Bekleyen ödeme'
    },
    {
      id: '5',
      tenantId: '2',
      tenantName: 'Fatma Demir',
      amount: 7200,
      dueDate: '2024-02-01',
      paidDate: undefined,
      status: 'pending' as const,
      method: undefined,
      notes: 'Bekleyen ödeme'
    }
  ]

  const handleTenantAction = (action: string, tenantId: string) => {
    console.log(`${action} tenant:`, tenantId)
  }

  const handleIssueAction = (action: string, issueId: string) => {
    console.log(`${action} issue:`, issueId)
  }

  const handlePaymentClick = (paymentId: string) => {
    console.log('Payment clicked:', paymentId)
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Özel Bileşenler</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Property Management Platform'a özel tasarlanmış bileşenler. 
            Gerçek dünya senaryolarına uygun, kullanıcı dostu arayüzler.
          </p>
        </div>

        {/* TenantCard Section */}
        <section className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Kiracı Kartı (TenantCard)</h2>
            <p className="text-muted-foreground">
              Kiracı bilgilerini görüntülemek ve yönetmek için özel tasarlanmış kart bileşeni
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Kiracı Kartları
              </CardTitle>
              <CardDescription>
                Avatar, ödeme durumu, iletişim bilgileri ve hızlı eylemler
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Full Tenant Cards */}
              <div>
                <h4 className="font-semibold mb-3">Tam Boyut Kartlar</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockTenants.map(tenant => (
                    <TenantCard
                      key={tenant.id}
                      tenant={tenant}
                      onCall={(phone) => handleTenantAction('call', tenant.id)}
                      onEmail={(email) => handleTenantAction('email', tenant.id)}
                      onMessage={(tenantId) => handleTenantAction('message', tenantId)}
                      onView={(tenantId) => handleTenantAction('view', tenantId)}
                      onEdit={(tenantId) => handleTenantAction('edit', tenantId)}
                      onDelete={(tenantId) => handleTenantAction('delete', tenantId)}
                    />
                  ))}
                </div>
              </div>

              {/* Compact Tenant Cards */}
              <div>
                <h4 className="font-semibold mb-3">Kompakt Kartlar</h4>
                <div className="space-y-2">
                  {mockTenants.map(tenant => (
                    <TenantCard
                      key={tenant.id}
                      tenant={tenant}
                      compact
                      onCall={(phone) => handleTenantAction('call', tenant.id)}
                      onView={(tenantId) => handleTenantAction('view', tenantId)}
                    />
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h5 className="font-semibold mb-2">Ödeme Durumu</h5>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                      <span className="text-sm">Güncel</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full" />
                      <span className="text-sm">Gecikmiş</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                      <span className="text-sm">Beklemede</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full" />
                      <span className="text-sm">Ödendi</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <h5 className="font-semibold mb-2">Hızlı Eylemler</h5>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Ara</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">E-posta</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MessageCircle className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Mesaj</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Eye className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Görüntüle</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <h5 className="font-semibold mb-2">Bilgiler</h5>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>• Avatar ve isim</p>
                    <p>• Daire numarası</p>
                    <p>• Kira miktarı</p>
                    <p>• Sözleşme bitiş tarihi</p>
                    <p>• Özel notlar</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* IssueCard Section */}
        <section className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Sorun Kartı (IssueCard)</h2>
            <p className="text-muted-foreground">
              Bakım taleplerini ve sorunları görüntülemek için özel tasarlanmış kart bileşeni
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wrench className="w-5 h-5 mr-2" />
                Sorun Kartları
              </CardTitle>
              <CardDescription>
                Kategori ikonu, başlık, atanan kişi, ilerleme çubuğu ve zaman damgası
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Full Issue Cards */}
              <div>
                <h4 className="font-semibold mb-3">Tam Boyut Kartlar</h4>
                <div className="space-y-4">
                  {mockIssues.map(issue => (
                    <IssueCard
                      key={issue.id}
                      issue={issue}
                      onView={(issueId) => handleIssueAction('view', issueId)}
                      onEdit={(issueId) => handleIssueAction('edit', issueId)}
                      onAssign={(issueId) => handleIssueAction('assign', issueId)}
                      onStatusChange={(issueId, status) => handleIssueAction('status', issueId)}
                    />
                  ))}
                </div>
              </div>

              {/* Compact Issue Cards */}
              <div>
                <h4 className="font-semibold mb-3">Kompakt Kartlar</h4>
                <div className="space-y-2">
                  {mockIssues.map(issue => (
                    <IssueCard
                      key={issue.id}
                      issue={issue}
                      compact
                      onView={(issueId) => handleIssueAction('view', issueId)}
                    />
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div>
                <h4 className="font-semibold mb-3">Kategori İkonları</h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <Droplets className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm font-medium">Su Tesisatı</p>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                    <Zap className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                    <p className="text-sm font-medium">Elektrik</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                    <Wrench className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <p className="text-sm font-medium">Tamir</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                    <CreditCard className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                    <p className="text-sm font-medium">Ödeme</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-950 rounded-lg">
                    <Building2 className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                    <p className="text-sm font-medium">Diğer</p>
                  </div>
                </div>
              </div>

              {/* Priority Levels */}
              <div>
                <h4 className="font-semibold mb-3">Öncelik Seviyeleri</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="flex items-center space-x-2 p-2 bg-green-50 dark:bg-green-950 rounded-lg">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <span className="text-sm font-medium">Düşük</span>
                  </div>
                  <div className="flex items-center space-x-2 p-2 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                    <span className="text-sm font-medium">Orta</span>
                  </div>
                  <div className="flex items-center space-x-2 p-2 bg-orange-50 dark:bg-orange-950 rounded-lg">
                    <div className="w-3 h-3 bg-orange-500 rounded-full" />
                    <span className="text-sm font-medium">Yüksek</span>
                  </div>
                  <div className="flex items-center space-x-2 p-2 bg-red-50 dark:bg-red-950 rounded-lg">
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                    <span className="text-sm font-medium">Acil</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* PaymentTimeline Section */}
        <section className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Ödeme Takvimi (PaymentTimeline)</h2>
            <p className="text-muted-foreground">
              Ödemeleri görsel takvim formatında görüntülemek için özel tasarlanmış bileşen
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Ödeme Takvimi
              </CardTitle>
              <CardDescription>
                Visual calendar, renk kodlu durumlar ve hover detayları
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentTimeline
                payments={mockPayments}
                onPaymentClick={handlePaymentClick}
                onTenantClick={(tenantId) => console.log('Tenant clicked:', tenantId)}
                viewMode={viewMode}
              />
            </CardContent>
          </Card>

          {/* Timeline Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Renk Kodlaması</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full" />
                  <span className="text-sm">Ödendi</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-500 rounded-full" />
                  <span className="text-sm">Gecikmiş</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full" />
                  <span className="text-sm">Beklemede</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-orange-500 rounded-full" />
                  <span className="text-sm">Kısmi</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Hover Detayları</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>• Kiracı adı</p>
                <p>• Ödeme tutarı</p>
                <p>• Vade tarihi</p>
                <p>• Ödeme tarihi</p>
                <p>• Ödeme yöntemi</p>
                <p>• Özel notlar</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Navigasyon</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>• Ay bazlı navigasyon</p>
                <p>• Bugün'e hızlı dönüş</p>
                <p>• Responsive tasarım</p>
                <p>• Tıklanabilir ödemeler</p>
                <p>• Durum göstergeleri</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Usage Examples */}
        <section className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Kullanım Örnekleri</h2>
            <p className="text-muted-foreground">
              Bileşenlerin nasıl kullanılacağına dair kod örnekleri
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Import Statements</CardTitle>
              <CardDescription>Özel bileşenleri projenize nasıl dahil edeceğiniz</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                <pre>{`import { 
  TenantCard, 
  IssueCard, 
  PaymentTimeline 
} from '@/components/ui/specialized-components'`}</pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>TenantCard Usage</CardTitle>
              <CardDescription>Kiracı kartının kullanım örneği</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                <pre>{`<TenantCard
  tenant={{
    id: '1',
    name: 'Ahmet Yılmaz',
    unit: 'A-101',
    paymentStatus: 'current',
    rentAmount: 8500,
    phone: '+90 532 123 45 67',
    email: 'ahmet@example.com'
  }}
  onCall={(phone) => console.log('Call:', phone)}
  onEmail={(email) => console.log('Email:', email)}
  onView={(id) => console.log('View:', id)}
  compact={false}
/>`}</pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>IssueCard Usage</CardTitle>
              <CardDescription>Sorun kartının kullanım örneği</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                <pre>{`<IssueCard
  issue={{
    id: '1',
    title: 'Mutfak Lavabosu Su Sızıntısı',
    description: 'Mutfak lavabosunda sürekli su sızıntısı var.',
    category: 'plumbing',
    priority: 'high',
    status: 'in_progress',
    progress: 75,
    createdAt: '2024-01-15'
  }}
  onView={(id) => console.log('View issue:', id)}
  onEdit={(id) => console.log('Edit issue:', id)}
  onAssign={(id) => console.log('Assign issue:', id)}
/>`}</pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>PaymentTimeline Usage</CardTitle>
              <CardDescription>Ödeme takviminin kullanım örneği</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                <pre>{`<PaymentTimeline
  payments={[
    {
      id: '1',
      tenantName: 'Ahmet Yılmaz',
      amount: 8500,
      dueDate: '2024-01-01',
      status: 'paid',
      method: 'transfer'
    }
  ]}
  onPaymentClick={(id) => console.log('Payment:', id)}
  onTenantClick={(id) => console.log('Tenant:', id)}
  viewMode="month"
/>`}</pre>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Integration Example */}
        <section className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Entegrasyon Örneği</h2>
            <p className="text-muted-foreground">
              Tüm özel bileşenlerin birlikte kullanımı
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Dashboard Layout</CardTitle>
              <CardDescription>Özel bileşenlerin dashboard'da kullanımı</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Mülk Yönetim Dashboard</h3>
                    <p className="text-sm text-muted-foreground">Kiracılar, sorunlar ve ödemeler</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline">Yeni Kiracı</Button>
                    <Button variant="outline">Yeni Sorun</Button>
                    <Button>Rapor</Button>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg text-center">
                    <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold">24</p>
                    <p className="text-sm text-muted-foreground">Toplam Kiracı</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg text-center">
                    <Wrench className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold">8</p>
                    <p className="text-sm text-muted-foreground">Açık Sorun</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg text-center">
                    <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold">₺245K</p>
                    <p className="text-sm text-muted-foreground">Aylık Gelir</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg text-center">
                    <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold">3</p>
                    <p className="text-sm text-muted-foreground">Gecikmiş Ödeme</p>
                  </div>
                </div>

                {/* Recent Tenants */}
                <div>
                  <h4 className="font-semibold mb-3">Son Kiracılar</h4>
                  <div className="space-y-2">
                    {mockTenants.slice(0, 2).map(tenant => (
                      <TenantCard
                        key={tenant.id}
                        tenant={tenant}
                        compact
                        onCall={(phone) => console.log('Call:', phone)}
                        onView={(id) => console.log('View:', id)}
                      />
                    ))}
                  </div>
                </div>

                {/* Recent Issues */}
                <div>
                  <h4 className="font-semibold mb-3">Son Sorunlar</h4>
                  <div className="space-y-2">
                    {mockIssues.slice(0, 2).map(issue => (
                      <IssueCard
                        key={issue.id}
                        issue={issue}
                        compact
                        onView={(id) => console.log('View issue:', id)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}

