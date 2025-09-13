'use client'

import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/core-components'
import { Button } from '@/components/ui/core-components'
import { Badge } from '@/components/ui/core-components'
import { 
  EmptyState,
  NoPropertiesEmptyState,
  NoTenantsEmptyState,
  NoMaintenanceRequestsEmptyState,
  NoPaymentsEmptyState,
  NoNotificationsEmptyState,
  NoSearchResultsEmptyState,
  NoDataEmptyState,
  ErrorEmptyState,
  LoadingEmptyState,
  SuccessEmptyState
} from '@/components/ux/empty-states'
import { 
  Building2,
  Users,
  Wrench,
  CreditCard,
  Calendar,
  FileText,
  MessageCircle,
  Bell,
  Settings,
  Search,
  Filter,
  Plus,
  Upload,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  Star,
  Heart,
  ThumbsUp,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Key,
  Shield,
  Zap,
  Target,
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
  DollarSign,
  Phone,
  Mail,
  MapPin,
  User,
  UserCheck,
  UserX,
  UserPlus,
  HelpCircle,
  Lightbulb,
  Info,
  AlertTriangle,
  Loader2,
  ExternalLink,
  Copy,
  Share2,
  Edit,
  Trash2,
  Save,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  Battery,
  BatteryLow,
  Signal,
  SignalOff,
  Camera,
  Image,
  Video,
  Music,
  Mic,
  MicOff,
  Headphones,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Desktop,
  Server,
  Database,
  Cloud,
  CloudOff,
  Globe,
  Globe2,
  Link,
  Link2,
  Unlink,
  Bookmark,
  BookmarkCheck,
  Flag,
  FlagOff,
  Tag,
  Tags,
  Folder,
  FolderOpen,
  FolderPlus,
  FolderMinus,
  File,
  FilePlus,
  FileMinus,
  FileCheck,
  FileX,
  FileImage,
  FileVideo,
  FileAudio,
  FilePdf,
  FileWord,
  FileExcel,
  FilePowerpoint,
  FileArchive,
  FileCode,
  FileText as FileTextIcon,
  FileSpreadsheet,
  FileSliders,
  FileSearch,
  FileEdit,
  FileUp,
  FileDown,
  FileLeft,
  FileRight,
  FileQuestion,
  FileWarning,
  FileInfo,
  FileHeart,
  FileStar,
  FileClock,
  FileCheck2,
  FileX2,
  FilePlus2,
  FileMinus2,
  FileEdit2,
  FileSearch2,
  FileUp2,
  FileDown2,
  FileLeft2,
  FileRight2,
  FileQuestion2,
  FileWarning2,
  FileInfo2,
  FileHeart2,
  FileStar2,
  FileClock2,
  FileCheck3,
  FileX3,
  FilePlus3,
  FileMinus3,
  FileEdit3,
  FileSearch3,
  FileUp3,
  FileDown3,
  FileLeft3,
  FileRight3,
  FileQuestion3,
  FileWarning3,
  FileInfo3,
  FileHeart3,
  FileStar3,
  FileClock3,
  FileCheck4,
  FileX4,
  FilePlus4,
  FileMinus4,
  FileEdit4,
  FileSearch4,
  FileUp4,
  FileDown4,
  FileLeft4,
  FileRight4,
  FileQuestion4,
  FileWarning4,
  FileInfo4,
  FileHeart4,
  FileStar4,
  FileClock4,
  FileCheck5,
  FileX5,
  FilePlus5,
  FileMinus5,
  FileEdit5,
  FileSearch5,
  FileUp5,
  FileDown5,
  FileLeft5,
  FileRight5,
  FileQuestion5,
  FileWarning5,
  FileInfo5,
  FileHeart5,
  FileStar5,
  FileClock5,
  FileCheck6,
  FileX6,
  FilePlus6,
  FileMinus6,
  FileEdit6,
  FileSearch6,
  FileUp6,
  FileDown6,
  FileLeft6,
  FileRight6,
  FileQuestion6,
  FileWarning6,
  FileInfo6,
  FileHeart6,
  FileStar6,
  FileClock6,
  FileCheck7,
  FileX7,
  FilePlus7,
  FileMinus7,
  FileEdit7,
  FileSearch7,
  FileUp7,
  FileDown7,
  FileLeft7,
  FileRight7,
  FileQuestion7,
  FileWarning7,
  FileInfo7,
  FileHeart7,
  FileStar7,
  FileClock7,
  FileCheck8,
  FileX8,
  FilePlus8,
  FileMinus8,
  FileEdit8,
  FileSearch8,
  FileUp8,
  FileDown8,
  FileLeft8,
  FileRight8,
  FileQuestion8,
  FileWarning8,
  FileInfo8,
  FileHeart8,
  FileStar8,
  FileClock8,
  FileCheck9,
  FileX9,
  FilePlus9,
  FileMinus9,
  FileEdit9,
  FileSearch9,
  FileUp9,
  FileDown9,
  FileLeft9,
  FileRight9,
  FileQuestion9,
  FileWarning9,
  FileInfo9,
  FileHeart9,
  FileStar9,
  FileClock9,
  FileCheck10,
  FileX10,
  FilePlus10,
  FileMinus10,
  FileEdit10,
  FileSearch10,
  FileUp10,
  FileDown10,
  FileLeft10,
  FileRight10,
  FileQuestion10,
  FileWarning10,
  FileInfo10,
  FileHeart10,
  FileStar10,
  FileClock10
} from 'lucide-react'

export default function EmptyStatesShowcase() {
  const [selectedVariant, setSelectedVariant] = useState<'default' | 'compact' | 'minimal' | 'card'>('default')
  const [selectedSize, setSelectedSize] = useState<'sm' | 'md' | 'lg'>('md')

  const handleAddProperty = () => {
    console.log('Add property clicked')
  }

  const handleAddTenant = () => {
    console.log('Add tenant clicked')
  }

  const handleCreateRequest = () => {
    console.log('Create maintenance request clicked')
  }

  const handleRecordPayment = () => {
    console.log('Record payment clicked')
  }

  const handleRefresh = () => {
    console.log('Refresh clicked')
  }

  const handleClearFilters = () => {
    console.log('Clear filters clicked')
  }

  const handleAddData = () => {
    console.log('Add data clicked')
  }

  const handleRetry = () => {
    console.log('Retry clicked')
  }

  const handleGoBack = () => {
    console.log('Go back clicked')
  }

  const handleContinue = () => {
    console.log('Continue clicked')
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Empty States</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Veri olmadığında gösterilen boş durumlar. Kullanıcıya rehberlik eden, 
            eylem öneren ve deneyimi iyileştiren empty state bileşenleri.
          </p>
        </div>

        {/* Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Empty State Kontrolleri
            </CardTitle>
            <CardDescription>
              Farklı varyasyonları ve boyutları test edin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium">Varyasyon:</label>
                <select 
                  value={selectedVariant} 
                  onChange={(e) => setSelectedVariant(e.target.value as any)}
                  className="px-3 py-1 border rounded-md text-sm"
                >
                  <option value="default">Default</option>
                  <option value="compact">Compact</option>
                  <option value="minimal">Minimal</option>
                  <option value="card">Card</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium">Boyut:</label>
                <select 
                  value={selectedSize} 
                  onChange={(e) => setSelectedSize(e.target.value as any)}
                  className="px-3 py-1 border rounded-md text-sm"
                >
                  <option value="sm">Small</option>
                  <option value="md">Medium</option>
                  <option value="lg">Large</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Property Management Specific Empty States */}
        <section className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Property Management Empty States</h2>
            <p className="text-muted-foreground">
              Mülk yönetimi platformuna özel empty state bileşenleri
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <NoPropertiesEmptyState
                  onAddProperty={handleAddProperty}
                  className={selectedVariant === 'card' ? 'bg-card rounded-lg border' : ''}
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <NoTenantsEmptyState
                  onAddTenant={handleAddTenant}
                  className={selectedVariant === 'card' ? 'bg-card rounded-lg border' : ''}
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <NoMaintenanceRequestsEmptyState
                  onCreateRequest={handleCreateRequest}
                  className={selectedVariant === 'card' ? 'bg-card rounded-lg border' : ''}
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <NoPaymentsEmptyState
                  onRecordPayment={handleRecordPayment}
                  className={selectedVariant === 'card' ? 'bg-card rounded-lg border' : ''}
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <NoNotificationsEmptyState
                  onRefresh={handleRefresh}
                  className={selectedVariant === 'card' ? 'bg-card rounded-lg border' : ''}
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <NoSearchResultsEmptyState
                  onClearFilters={handleClearFilters}
                  searchTerm="apartman"
                  className={selectedVariant === 'card' ? 'bg-card rounded-lg border' : ''}
                />
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Generic Empty States */}
        <section className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Generic Empty States</h2>
            <p className="text-muted-foreground">
              Genel amaçlı empty state bileşenleri
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <NoDataEmptyState
                  onRefresh={handleRefresh}
                  onAddData={handleAddData}
                  dataType="veri"
                  className={selectedVariant === 'card' ? 'bg-card rounded-lg border' : ''}
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <ErrorEmptyState
                  onRetry={handleRetry}
                  onGoBack={handleGoBack}
                  errorMessage="Veritabanı bağlantısı kurulamadı"
                  className={selectedVariant === 'card' ? 'bg-card rounded-lg border' : ''}
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <LoadingEmptyState
                  message="Veriler yükleniyor..."
                  className={selectedVariant === 'card' ? 'bg-card rounded-lg border' : ''}
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <SuccessEmptyState
                  onContinue={handleContinue}
                  message="İşlem tamamlandı"
                  description="Mülk başarıyla eklendi ve kiracılar eklenebilir."
                  className={selectedVariant === 'card' ? 'bg-card rounded-lg border' : ''}
                />
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Custom Empty States */}
        <section className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Custom Empty States</h2>
            <p className="text-muted-foreground">
              Özelleştirilebilir empty state örnekleri
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <EmptyState
                  icon={<FileText className="w-12 h-12" />}
                  title="Henüz rapor yok"
                  description="Detaylı raporlar oluşturmak için veri ekleyin"
                  action={{
                    label: 'Rapor Oluştur',
                    onClick: () => console.log('Create report'),
                    icon: <Plus className="w-4 h-4" />
                  }}
                  secondaryAction={{
                    label: 'Şablon Kullan',
                    onClick: () => console.log('Use template'),
                    variant: 'outline',
                    icon: <FileText className="w-4 h-4" />
                  }}
                  variant={selectedVariant}
                  size={selectedSize}
                  className={selectedVariant === 'card' ? 'bg-card rounded-lg border' : ''}
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <EmptyState
                  icon={<Calendar className="w-12 h-12" />}
                  title="Henüz randevu yok"
                  description="Mülk görüntüleme randevuları burada görünecek"
                  action={{
                    label: 'Randevu Oluştur',
                    onClick: () => console.log('Create appointment'),
                    icon: <Calendar className="w-4 h-4" />
                  }}
                  variant={selectedVariant}
                  size={selectedSize}
                  className={selectedVariant === 'card' ? 'bg-card rounded-lg border' : ''}
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <EmptyState
                  icon={<MessageCircle className="w-12 h-12" />}
                  title="Henüz mesaj yok"
                  description="Kiracılarla mesajlaşma buradan başlar"
                  action={{
                    label: 'Mesaj Gönder',
                    onClick: () => console.log('Send message'),
                    icon: <MessageCircle className="w-4 h-4" />
                  }}
                  variant={selectedVariant}
                  size={selectedSize}
                  className={selectedVariant === 'card' ? 'bg-card rounded-lg border' : ''}
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <EmptyState
                  icon={<BarChart3 className="w-12 h-12" />}
                  title="Henüz analiz yok"
                  description="Veri analizi için yeterli veri bulunmuyor"
                  action={{
                    label: 'Veri Ekle',
                    onClick: () => console.log('Add data'),
                    icon: <Plus className="w-4 h-4" />
                  }}
                  secondaryAction={{
                    label: 'Demo Veri',
                    onClick: () => console.log('Load demo data'),
                    variant: 'outline',
                    icon: <Download className="w-4 h-4" />
                  }}
                  variant={selectedVariant}
                  size={selectedSize}
                  className={selectedVariant === 'card' ? 'bg-card rounded-lg border' : ''}
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <EmptyState
                  icon={<Settings className="w-12 h-12" />}
                  title="Ayarlar boş"
                  description="Özelleştirilebilir ayarlar burada görünecek"
                  action={{
                    label: 'Ayarları Yapılandır',
                    onClick: () => console.log('Configure settings'),
                    icon: <Settings className="w-4 h-4" />
                  }}
                  variant={selectedVariant}
                  size={selectedSize}
                  className={selectedVariant === 'card' ? 'bg-card rounded-lg border' : ''}
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <EmptyState
                  icon={<Upload className="w-12 h-12" />}
                  title="Henüz dosya yok"
                  description="Belgeler ve dosyalar burada saklanır"
                  action={{
                    label: 'Dosya Yükle',
                    onClick: () => console.log('Upload file'),
                    icon: <Upload className="w-4 h-4" />
                  }}
                  secondaryAction={{
                    label: 'Klasör Oluştur',
                    onClick: () => console.log('Create folder'),
                    variant: 'outline',
                    icon: <Folder className="w-4 h-4" />
                  }}
                  variant={selectedVariant}
                  size={selectedSize}
                  className={selectedVariant === 'card' ? 'bg-card rounded-lg border' : ''}
                />
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Size Variations */}
        <section className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Boyut Varyasyonları</h2>
            <p className="text-muted-foreground">
              Farklı boyutlarda empty state örnekleri
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Small Size</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <EmptyState
                  icon={<Building2 className="w-8 h-8" />}
                  title="Küçük boyut"
                  description="Compact tasarım için ideal"
                  action={{
                    label: 'Ekle',
                    onClick: () => console.log('Add'),
                    icon: <Plus className="w-4 h-4" />
                  }}
                  size="sm"
                  variant={selectedVariant}
                  className={selectedVariant === 'card' ? 'bg-card rounded-lg border' : ''}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Medium Size</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <EmptyState
                  icon={<Building2 className="w-12 h-12" />}
                  title="Orta boyut"
                  description="Standart kullanım için ideal"
                  action={{
                    label: 'Ekle',
                    onClick: () => console.log('Add'),
                    icon: <Plus className="w-4 h-4" />
                  }}
                  size="md"
                  variant={selectedVariant}
                  className={selectedVariant === 'card' ? 'bg-card rounded-lg border' : ''}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Large Size</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <EmptyState
                  icon={<Building2 className="w-16 h-16" />}
                  title="Büyük boyut"
                  description="Önemli empty state'ler için ideal"
                  action={{
                    label: 'Ekle',
                    onClick: () => console.log('Add'),
                    icon: <Plus className="w-4 h-4" />
                  }}
                  size="lg"
                  variant={selectedVariant}
                  className={selectedVariant === 'card' ? 'bg-card rounded-lg border' : ''}
                />
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Usage Examples */}
        <section className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Kullanım Örnekleri</h2>
            <p className="text-muted-foreground">
              Empty state bileşenlerinin nasıl kullanılacağına dair kod örnekleri
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Usage</CardTitle>
                <CardDescription>Temel empty state kullanımı</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                  <pre>{`<EmptyState
  icon={<Building2 className="w-12 h-12" />}
  title="Henüz mülk yok"
  description="İlk mülkünüzü ekleyerek başlayın"
  action={{
    label: 'Mülk Ekle',
    onClick: () => console.log('Add property'),
    icon: <Plus className="w-4 h-4" />
  }}
/>`}</pre>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Property Management Specific</CardTitle>
                <CardDescription>Mülk yönetimi özel empty state'leri</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                  <pre>{`<NoPropertiesEmptyState
  onAddProperty={() => console.log('Add property')}
/>

<NoTenantsEmptyState
  onAddTenant={() => console.log('Add tenant')}
/>

<NoMaintenanceRequestsEmptyState
  onCreateRequest={() => console.log('Create request')}
/>`}</pre>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>With Secondary Action</CardTitle>
                <CardDescription>İkincil eylem ile empty state</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                  <pre>{`<EmptyState
  icon={<Search className="w-12 h-12" />}
  title="Sonuç bulunamadı"
  description="Arama teriminizi değiştirin"
  action={{
    label: 'Filtreleri Temizle',
    onClick: () => console.log('Clear filters'),
    icon: <Filter className="w-4 h-4" />
  }}
  secondaryAction={{
    label: 'Yeniden Ara',
    onClick: () => console.log('Search again'),
    variant: 'outline',
    icon: <RefreshCw className="w-4 h-4" />
  }}
/>`}</pre>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Error State</CardTitle>
                <CardDescription>Hata durumu empty state'i</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                  <pre>{`<ErrorEmptyState
  onRetry={() => console.log('Retry')}
  onGoBack={() => console.log('Go back')}
  errorMessage="Veritabanı bağlantısı kurulamadı"
/>`}</pre>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Best Practices */}
        <section className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Best Practices</h2>
            <p className="text-muted-foreground">
              Empty state tasarımı için en iyi uygulamalar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2" />
                  Clear Communication
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Net ve anlaşılır başlık kullanın</p>
                  <p>• Açıklayıcı description ekleyin</p>
                  <p>• Kullanıcıya ne yapması gerektiğini söyleyin</p>
                  <p>• Teknik jargon kullanmaktan kaçının</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Actionable
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Her zaman bir eylem önerin</p>
                  <p>• Primary action net olsun</p>
                  <p>• Secondary action alternatif sunsun</p>
                  <p>• Eylemler gerçekçi olsun</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="w-5 h-5 mr-2" />
                  Visual Design
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Uygun ikonlar kullanın</p>
                  <p>• Renk kodlaması yapın</p>
                  <p>• Boşlukları doğru kullanın</p>
                  <p>• Responsive tasarım yapın</p>
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
                  <p>• Lazy loading kullanın</p>
                  <p>• Skeleton screens ekleyin</p>
                  <p>• Loading states gösterin</p>
                  <p>• Error handling yapın</p>
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
                  <p>• Alt text ekleyin</p>
                  <p>• Keyboard navigation</p>
                  <p>• Screen reader support</p>
                  <p>• High contrast mode</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Context Awareness
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Kullanıcı rolüne göre</p>
                  <p>• Sayfa bağlamına göre</p>
                  <p>• Zaman bazlı mesajlar</p>
                  <p>• Kişiselleştirme</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}

