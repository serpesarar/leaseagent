'use client'

import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/core-components'
import { Button } from '@/components/ui/core-components'
import { Badge } from '@/components/ui/core-components'
import { 
  CollapsibleSection,
  ProgressiveForm,
  AdvancedSettings,
  Toast,
  useToast,
  EnhancedInput,
  StepProgress,
  LoadingStates,
  EmptyState
} from '@/components/ux/usability-components'
import { 
  Settings,
  User,
  Building2,
  CreditCard,
  Wrench,
  Bell,
  Shield,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Loader2,
  Clock,
  Calendar,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Download,
  Upload,
  RefreshCw,
  Save,
  Edit,
  Trash2,
  Plus,
  Minus,
  ExternalLink,
  Copy,
  Share2,
  Star,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Activity,
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  ArrowLeft,
  Maximize,
  Minimize,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Move,
  GripVertical,
  GripHorizontal,
  MoreVertical,
  MoreHorizontal,
  X,
  Check,
  Plus as PlusIcon,
  Minus as MinusIcon,
  Home,
  Users,
  DollarSign,
  Target,
  Zap,
  Lock,
  Unlock,
  Key,
  UserCheck,
  UserX,
  UserPlus,
  HelpCircle,
  Lightbulb,
  AlertCircle
} from 'lucide-react'

export default function UsabilityShowcase() {
  const { toasts, success, error, warning, info, loading, removeToast } = useToast()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    propertyType: '',
    budget: '',
    preferences: ''
  })

  // Mock data
  const steps = [
    {
      id: 'basic-info',
      title: 'Temel Bilgiler',
      description: 'Kişisel bilgilerinizi girin',
      status: 'completed' as const,
      icon: <User className="w-4 h-4" />
    },
    {
      id: 'property-details',
      title: 'Mülk Detayları',
      description: 'Mülk bilgilerini belirtin',
      status: 'current' as const,
      icon: <Building2 className="w-4 h-4" />
    },
    {
      id: 'preferences',
      title: 'Tercihler',
      description: 'Özel tercihlerinizi seçin',
      status: 'pending' as const,
      icon: <Settings className="w-4 h-4" />
    },
    {
      id: 'review',
      title: 'Gözden Geçir',
      description: 'Bilgileri kontrol edin',
      status: 'pending' as const,
      icon: <CheckCircle className="w-4 h-4" />
    }
  ]

  const handleToastDemo = (type: 'success' | 'error' | 'warning' | 'info' | 'loading') => {
    switch (type) {
      case 'success':
        success('Kira ödemesi alındı ✓', 'Ödeme başarıyla işlendi ve kiracıya bildirim gönderildi.', {
          label: 'Detayları Gör',
          onClick: () => console.log('Payment details')
        })
        break
      case 'error':
        error('İşlem başarısız', 'Ödeme işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.', {
          label: 'Tekrar Dene',
          onClick: () => console.log('Retry payment')
        })
        break
      case 'warning':
        warning('Dikkat', 'Bu işlem geri alınamaz. Devam etmek istediğinizden emin misiniz?', {
          label: 'Devam Et',
          onClick: () => console.log('Continue')
        })
        break
      case 'info':
        info('Bilgi', 'Yeni özellikler eklendi. Güncellemeleri görmek için sayfayı yenileyin.', {
          label: 'Yenile',
          onClick: () => window.location.reload()
        })
        break
      case 'loading':
        loading('İşleniyor...', 'Ödeme bilgileri kontrol ediliyor')
        break
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Kullanılabilirlik (UX) İlkeleri</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Progressive Disclosure, feedback mekanizmaları ve kullanıcı deneyimi optimizasyonları. 
            Modern UX pattern'leri ve accessibility standartları.
          </p>
        </div>

        {/* Progressive Disclosure */}
        <section className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Progressive Disclosure</h2>
            <p className="text-muted-foreground">
              Basit → Detaylı yaklaşımı ile kullanıcı deneyimini optimize edin
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Collapsible Sections */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Collapsible Sections
                </CardTitle>
                <CardDescription>
                  İlk ekranda sadece kritik bilgiler, detaylar için "Daha fazla göster"
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <CollapsibleSection
                  title="Temel Bilgiler"
                  icon={<User className="w-4 h-4" />}
                  badge="3"
                  defaultOpen={true}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Ad Soyad</span>
                      <span className="text-sm font-medium">Ahmet Yılmaz</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Email</span>
                      <span className="text-sm font-medium">ahmet@example.com</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Telefon</span>
                      <span className="text-sm font-medium">+90 555 123 4567</span>
                    </div>
                  </div>
                </CollapsibleSection>

                <CollapsibleSection
                  title="Mülk Detayları"
                  icon={<Building2 className="w-4 h-4" />}
                  badge="5"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Mülk Türü</span>
                      <span className="text-sm font-medium">Apartman</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Oda Sayısı</span>
                      <span className="text-sm font-medium">3+1</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Metrekare</span>
                      <span className="text-sm font-medium">120 m²</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Kat</span>
                      <span className="text-sm font-medium">5. Kat</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Balkon</span>
                      <span className="text-sm font-medium">Var</span>
                    </div>
                  </div>
                </CollapsibleSection>

                <CollapsibleSection
                  title="Özel Tercihler"
                  icon={<Settings className="w-4 h-4" />}
                  variant="compact"
                >
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Asansör</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Otopark</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <XCircle className="w-4 h-4 text-red-600" />
                      <span className="text-sm">Havuz</span>
                    </div>
                  </div>
                </CollapsibleSection>
              </CardContent>
            </Card>

            {/* Advanced Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Advanced Settings
                </CardTitle>
                <CardDescription>
                  Gelişmiş ayarlar varsayılan olarak gizlidir
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Bildirimler</span>
                    <Badge variant="secondary">Aktif</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Otomatik Yedekleme</span>
                    <Badge variant="secondary">Aktif</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Güvenlik</span>
                    <Badge variant="secondary">Yüksek</Badge>
                  </div>
                </div>

                <AdvancedSettings
                  title="Gelişmiş Ayarlar"
                  description="Bu ayarlar varsayılan olarak gizlidir"
                >
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">API Rate Limit</label>
                      <select className="w-full px-3 py-2 border rounded-md text-sm">
                        <option>1000 requests/hour</option>
                        <option>5000 requests/hour</option>
                        <option>10000 requests/hour</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Cache Duration</label>
                      <select className="w-full px-3 py-2 border rounded-md text-sm">
                        <option>5 minutes</option>
                        <option>15 minutes</option>
                        <option>30 minutes</option>
                        <option>1 hour</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Log Level</label>
                      <select className="w-full px-3 py-2 border rounded-md text-sm">
                        <option>Error</option>
                        <option>Warning</option>
                        <option>Info</option>
                        <option>Debug</option>
                      </select>
                    </div>
                  </div>
                </AdvancedSettings>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Feedback Mechanisms */}
        <section className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Feedback Mekanizmaları</h2>
            <p className="text-muted-foreground">
              Kullanıcıya anında geri bildirim sağlayan bileşenler
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Toast Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Toast Notifications
                </CardTitle>
                <CardDescription>
                  Başarı, hata, uyarı ve bilgi mesajları
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="default" 
                    onClick={() => handleToastDemo('success')}
                    className="flex items-center"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Success
                  </Button>
                  
                  <Button 
                    variant="destructive" 
                    onClick={() => handleToastDemo('error')}
                    className="flex items-center"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Error
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => handleToastDemo('warning')}
                    className="flex items-center"
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Warning
                  </Button>
                  
                  <Button 
                    variant="secondary" 
                    onClick={() => handleToastDemo('info')}
                    className="flex items-center"
                  >
                    <Info className="w-4 h-4 mr-2" />
                    Info
                  </Button>
                </div>

                <div className="pt-4 border-t">
                  <Button 
                    variant="outline" 
                    onClick={() => handleToastDemo('loading')}
                    className="flex items-center"
                  >
                    <Loader2 className="w-4 h-4 mr-2" />
                    Loading Toast
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Input */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Edit className="w-5 h-5 mr-2" />
                  Enhanced Input
                </CardTitle>
                <CardDescription>
                  Inline validation ve helper text ile gelişmiş input
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <EnhancedInput
                  label="Email Adresi"
                  value={formData.email}
                  onChange={(value) => setFormData(prev => ({ ...prev, email: value }))}
                  placeholder="örnek@email.com"
                  type="email"
                  helper="Geçerli bir email adresi girin"
                  leftIcon={<Mail className="w-4 h-4" />}
                />

                <EnhancedInput
                  label="Şifre"
                  value=""
                  onChange={() => {}}
                  placeholder="Şifrenizi girin"
                  type="password"
                  helper="En az 8 karakter olmalı"
                />

                <EnhancedInput
                  label="Telefon"
                  value={formData.phone}
                  onChange={(value) => setFormData(prev => ({ ...prev, phone: value }))}
                  placeholder="+90 555 123 4567"
                  type="tel"
                  leftIcon={<Phone className="w-4 h-4" />}
                />

                <EnhancedInput
                  label="Adres"
                  value={formData.address}
                  onChange={(value) => setFormData(prev => ({ ...prev, address: value }))}
                  placeholder="Tam adresinizi girin"
                  leftIcon={<MapPin className="w-4 h-4" />}
                />
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Progress Indicators */}
        <section className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Progress Indicators</h2>
            <p className="text-muted-foreground">
              Kullanıcının ilerlemesini gösteren bileşenler
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Step Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Step Progress
                </CardTitle>
                <CardDescription>
                  Çok adımlı formlar için ilerleme göstergesi
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <StepProgress
                  steps={steps}
                  currentStep={currentStep}
                  onStepClick={setCurrentStep}
                />

                <div className="pt-4 border-t">
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                      disabled={currentStep === 0}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Önceki
                    </Button>
                    <Button 
                      onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                      disabled={currentStep === steps.length - 1}
                    >
                      Sonraki
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Loading States */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Loader2 className="w-5 h-5 mr-2" />
                  Loading States
                </CardTitle>
                <CardDescription>
                  Farklı loading state türleri
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium w-20">Skeleton:</span>
                    <LoadingStates type="skeleton" size="sm" />
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium w-20">Spinner:</span>
                    <LoadingStates type="spinner" size="md" />
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium w-20">Dots:</span>
                    <LoadingStates type="dots" size="md" />
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium w-20">Pulse:</span>
                    <LoadingStates type="pulse" size="lg" />
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Form Loading Example</h4>
                    <div className="p-4 border rounded-lg">
                      <LoadingStates type="skeleton" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Progressive Form */}
        <section className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Progressive Form</h2>
            <p className="text-muted-foreground">
              Çok adımlı form örneği ile progressive disclosure
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Mülk Kayıt Formu
              </CardTitle>
              <CardDescription>
                Adım adım mülk kayıt işlemi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProgressiveForm
                steps={steps}
                currentStep={currentStep}
                onStepChange={setCurrentStep}
              >
                {currentStep === 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Temel Bilgiler</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <EnhancedInput
                        label="Ad Soyad"
                        value={formData.name}
                        onChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
                        placeholder="Adınızı girin"
                        required
                      />
                      <EnhancedInput
                        label="Email"
                        value={formData.email}
                        onChange={(value) => setFormData(prev => ({ ...prev, email: value }))}
                        placeholder="email@example.com"
                        type="email"
                        required
                      />
                    </div>
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Mülk Detayları</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <EnhancedInput
                        label="Mülk Türü"
                        value={formData.propertyType}
                        onChange={(value) => setFormData(prev => ({ ...prev, propertyType: value }))}
                        placeholder="Apartman, Villa, Daire"
                        required
                      />
                      <EnhancedInput
                        label="Bütçe"
                        value={formData.budget}
                        onChange={(value) => setFormData(prev => ({ ...prev, budget: value }))}
                        placeholder="₺1,000,000"
                        type="number"
                        required
                      />
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Tercihler</h3>
                    <div className="space-y-4">
                      <EnhancedInput
                        label="Özel Tercihler"
                        value={formData.preferences}
                        onChange={(value) => setFormData(prev => ({ ...prev, preferences: value }))}
                        placeholder="Özel isteklerinizi belirtin"
                      />
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Gözden Geçir</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Ad Soyad:</span>
                        <span className="text-sm font-medium">{formData.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Email:</span>
                        <span className="text-sm font-medium">{formData.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Mülk Türü:</span>
                        <span className="text-sm font-medium">{formData.propertyType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Bütçe:</span>
                        <span className="text-sm font-medium">{formData.budget}</span>
                      </div>
                    </div>
                  </div>
                )}
              </ProgressiveForm>
            </CardContent>
          </Card>
        </section>

        {/* Empty States */}
        <section className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Empty States</h2>
            <p className="text-muted-foreground">
              Veri olmadığında gösterilen boş durumlar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <EmptyState
                  icon={<Building2 className="w-12 h-12" />}
                  title="Henüz mülk yok"
                  description="İlk mülkünüzü ekleyerek başlayın"
                  action={{
                    label: 'Mülk Ekle',
                    onClick: () => console.log('Add property')
                  }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <EmptyState
                  icon={<Users className="w-12 h-12" />}
                  title="Kiracı bulunamadı"
                  description="Bu mülk için henüz kiracı kaydı yok"
                  action={{
                    label: 'Kiracı Ekle',
                    onClick: () => console.log('Add tenant')
                  }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <EmptyState
                  icon={<Wrench className="w-12 h-12" />}
                  title="Bakım talebi yok"
                  description="Henüz hiç bakım talebi oluşturulmamış"
                  action={{
                    label: 'Talep Oluştur',
                    onClick: () => console.log('Create request')
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </section>

        {/* UX Principles */}
        <section className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">UX İlkeleri</h2>
            <p className="text-muted-foreground">
              Uygulanan kullanılabilirlik ilkeleri ve best practice'ler
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="w-5 h-5 mr-2" />
                  Progressive Disclosure
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• İlk ekranda sadece kritik bilgiler</p>
                  <p>• "Daha fazla göster" ile detaylar</p>
                  <p>• Advanced settings collapsed</p>
                  <p>• Adım adım form süreci</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Feedback Mechanisms
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Toast notifications</p>
                  <p>• Inline validation</p>
                  <p>• Progress indicators</p>
                  <p>• Loading states</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  User Guidance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Step-by-step guidance</p>
                  <p>• Clear error messages</p>
                  <p>• Helpful tooltips</p>
                  <p>• Empty state guidance</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Lazy loading</p>
                  <p>• Skeleton screens</p>
                  <p>• Optimistic updates</p>
                  <p>• Smooth transitions</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Accessibility
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Keyboard navigation</p>
                  <p>• Screen reader support</p>
                  <p>• High contrast mode</p>
                  <p>• Focus management</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Responsive Design
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Mobile-first approach</p>
                  <p>• Touch-friendly interfaces</p>
                  <p>• Adaptive layouts</p>
                  <p>• Flexible components</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>

      {/* Toast Container */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onClose={removeToast}
        />
      ))}
    </div>
  )
}

