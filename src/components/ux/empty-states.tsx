'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './core-components'
import { Button } from './core-components'
import { Badge } from './core-components'
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

// Types
interface EmptyStateAction {
  label: string
  onClick: () => void
  variant?: 'default' | 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost'
  icon?: React.ReactNode
}

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: EmptyStateAction
  secondaryAction?: EmptyStateAction
  className?: string
  variant?: 'default' | 'compact' | 'minimal' | 'card'
  size?: 'sm' | 'md' | 'lg'
}

// Main EmptyState Component
export function EmptyState({ 
  icon, 
  title, 
  description, 
  action,
  secondaryAction,
  className,
  variant = 'default',
  size = 'md'
}: EmptyStateProps) {
  const variants = {
    default: 'text-center py-12',
    compact: 'text-center py-8',
    minimal: 'text-center py-6',
    card: 'text-center py-12 bg-card rounded-lg border'
  }

  const sizes = {
    sm: {
      icon: 'w-8 h-8',
      title: 'text-base',
      description: 'text-sm',
      spacing: 'mb-3'
    },
    md: {
      icon: 'w-12 h-12',
      title: 'text-lg',
      description: 'text-sm',
      spacing: 'mb-4'
    },
    lg: {
      icon: 'w-16 h-16',
      title: 'text-xl',
      description: 'text-base',
      spacing: 'mb-6'
    }
  }

  const sizeConfig = sizes[size]

  return (
    <div className={cn(variants[variant], className)}>
      {icon && (
        <div className={cn(
          'mx-auto text-muted-foreground',
          sizeConfig.icon,
          sizeConfig.spacing
        )}>
          {icon}
        </div>
      )}
      
      <h3 className={cn(
        'font-medium text-foreground mb-2',
        sizeConfig.title
      )}>
        {title}
      </h3>
      
      {description && (
        <p className={cn(
          'text-muted-foreground mb-6 max-w-sm mx-auto',
          sizeConfig.description
        )}>
          {description}
        </p>
      )}
      
      {(action || secondaryAction) && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {action && (
            <Button 
              onClick={action.onClick}
              variant={action.variant || 'default'}
              className="flex items-center"
            >
              {action.icon && <span className="mr-2">{action.icon}</span>}
              {action.label}
            </Button>
          )}
          
          {secondaryAction && (
            <Button 
              onClick={secondaryAction.onClick}
              variant={secondaryAction.variant || 'outline'}
              className="flex items-center"
            >
              {secondaryAction.icon && <span className="mr-2">{secondaryAction.icon}</span>}
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

// Property Management Specific Empty States

// No Properties Empty State
export function NoPropertiesEmptyState({ 
  onAddProperty,
  className 
}: { 
  onAddProperty: () => void
  className?: string 
}) {
  return (
    <EmptyState
      icon={<Building2 className="w-12 h-12" />}
      title="Henüz mülk yok"
      description="İlk mülkünüzü ekleyerek başlayın. Mülk ekledikten sonra kiracılar, ödemeler ve bakım taleplerini yönetebilirsiniz."
      action={{
        label: 'Mülk Ekle',
        onClick: onAddProperty,
        icon: <Plus className="w-4 h-4" />
      }}
      secondaryAction={{
        label: 'Nasıl Başlarım?',
        onClick: () => console.log('Show help'),
        variant: 'outline',
        icon: <HelpCircle className="w-4 h-4" />
      }}
      className={className}
    />
  )
}

// No Tenants Empty State
export function NoTenantsEmptyState({ 
  onAddTenant,
  className 
}: { 
  onAddTenant: () => void
  className?: string 
}) {
  return (
    <EmptyState
      icon={<Users className="w-12 h-12" />}
      title="Henüz kiracı yok"
      description="Bu mülk için henüz kiracı kaydı bulunmuyor. Kiracı ekleyerek kira ödemelerini ve bakım taleplerini takip edebilirsiniz."
      action={{
        label: 'Kiracı Ekle',
        onClick: onAddTenant,
        icon: <UserPlus className="w-4 h-4" />
      }}
      secondaryAction={{
        label: 'Toplu İçe Aktar',
        onClick: () => console.log('Bulk import'),
        variant: 'outline',
        icon: <Upload className="w-4 h-4" />
      }}
      className={className}
    />
  )
}

// No Maintenance Requests Empty State
export function NoMaintenanceRequestsEmptyState({ 
  onCreateRequest,
  className 
}: { 
  onCreateRequest: () => void
  className?: string 
}) {
  return (
    <EmptyState
      icon={<Wrench className="w-12 h-12" />}
      title="Henüz sorun bildirilmedi"
      description="Bir sorun olduğunda buradan bildirebilirsiniz. Bakım talepleri otomatik olarak uygun teknisyenlere yönlendirilir."
      action={{
        label: 'İlk Sorunu Bildir',
        onClick: onCreateRequest,
        icon: <Plus className="w-4 h-4" />
      }}
      secondaryAction={{
        label: 'Acil Durum',
        onClick: () => console.log('Emergency'),
        variant: 'destructive',
        icon: <AlertCircle className="w-4 h-4" />
      }}
      className={className}
    />
  )
}

// No Payments Empty State
export function NoPaymentsEmptyState({ 
  onRecordPayment,
  className 
}: { 
  onRecordPayment: () => void
  className?: string 
}) {
  return (
    <EmptyState
      icon={<CreditCard className="w-12 h-12" />}
      title="Henüz ödeme kaydı yok"
      description="Kira ödemelerini buradan takip edebilirsiniz. Ödeme kayıtları otomatik olarak kiracı hesaplarına yansır."
      action={{
        label: 'Ödeme Kaydet',
        onClick: onRecordPayment,
        icon: <Plus className="w-4 h-4" />
      }}
      secondaryAction={{
        label: 'Ödeme Geçmişi',
        onClick: () => console.log('Payment history'),
        variant: 'outline',
        icon: <Calendar className="w-4 h-4" />
      }}
      className={className}
    />
  )
}

// No Notifications Empty State
export function NoNotificationsEmptyState({ 
  onRefresh,
  className 
}: { 
  onRefresh: () => void
  className?: string 
}) {
  return (
    <EmptyState
      icon={<Bell className="w-12 h-12" />}
      title="Henüz bildirim yok"
      description="Yeni bildirimler burada görünecek. Önemli güncellemeler ve hatırlatmalar için bildirimleri açık tutun."
      action={{
        label: 'Yenile',
        onClick: onRefresh,
        icon: <RefreshCw className="w-4 h-4" />
      }}
      secondaryAction={{
        label: 'Bildirim Ayarları',
        onClick: () => console.log('Notification settings'),
        variant: 'outline',
        icon: <Settings className="w-4 h-4" />
      }}
      className={className}
    />
  )
}

// No Search Results Empty State
export function NoSearchResultsEmptyState({ 
  onClearFilters,
  searchTerm,
  className 
}: { 
  onClearFilters: () => void
  searchTerm?: string
  className?: string 
}) {
  return (
    <EmptyState
      icon={<Search className="w-12 h-12" />}
      title={searchTerm ? `"${searchTerm}" için sonuç bulunamadı` : 'Sonuç bulunamadı'}
      description={searchTerm 
        ? 'Arama teriminizi değiştirmeyi deneyin veya filtreleri temizleyin.'
        : 'Filtreleri temizleyerek daha fazla sonuç görebilirsiniz.'
      }
      action={{
        label: 'Filtreleri Temizle',
        onClick: onClearFilters,
        icon: <Filter className="w-4 h-4" />
      }}
      secondaryAction={{
        label: 'Yeniden Ara',
        onClick: () => console.log('Search again'),
        variant: 'outline',
        icon: <RefreshCw className="w-4 h-4" />
      }}
      className={className}
    />
  )
}

// No Data Empty State
export function NoDataEmptyState({ 
  onRefresh,
  onAddData,
  dataType = 'veri',
  className 
}: { 
  onRefresh: () => void
  onAddData: () => void
  dataType?: string
  className?: string 
}) {
  return (
    <EmptyState
      icon={<FileText className="w-12 h-12" />}
      title={`Henüz ${dataType} yok`}
      description={`${dataType.charAt(0).toUpperCase() + dataType.slice(1)} ekleyerek başlayın. Verileriniz güvenli bir şekilde saklanır ve istediğiniz zaman erişebilirsiniz.`}
      action={{
        label: `${dataType.charAt(0).toUpperCase() + dataType.slice(1)} Ekle`,
        onClick: onAddData,
        icon: <Plus className="w-4 h-4" />
      }}
      secondaryAction={{
        label: 'Yenile',
        onClick: onRefresh,
        variant: 'outline',
        icon: <RefreshCw className="w-4 h-4" />
      }}
      className={className}
    />
  )
}

// Error Empty State
export function ErrorEmptyState({ 
  onRetry,
  onGoBack,
  errorMessage = 'Bir hata oluştu',
  className 
}: { 
  onRetry: () => void
  onGoBack: () => void
  errorMessage?: string
  className?: string 
}) {
  return (
    <EmptyState
      icon={<AlertCircle className="w-12 h-12 text-red-500" />}
      title="Bir hata oluştu"
      description={errorMessage}
      action={{
        label: 'Tekrar Dene',
        onClick: onRetry,
        icon: <RefreshCw className="w-4 h-4" />
      }}
      secondaryAction={{
        label: 'Geri Dön',
        onClick: onGoBack,
        variant: 'outline',
        icon: <ArrowLeft className="w-4 h-4" />
      }}
      className={className}
    />
  )
}

// Loading Empty State
export function LoadingEmptyState({ 
  message = 'Yükleniyor...',
  className 
}: { 
  message?: string
  className?: string 
}) {
  return (
    <EmptyState
      icon={<Loader2 className="w-12 h-12 animate-spin text-primary" />}
      title={message}
      description="Lütfen bekleyin, verileriniz yükleniyor."
      className={className}
    />
  )
}

// Success Empty State
export function SuccessEmptyState({ 
  onContinue,
  message = 'İşlem tamamlandı',
  description = 'İşleminiz başarıyla tamamlandı.',
  className 
}: { 
  onContinue: () => void
  message?: string
  description?: string
  className?: string 
}) {
  return (
    <EmptyState
      icon={<CheckCircle className="w-12 h-12 text-green-500" />}
      title={message}
      description={description}
      action={{
        label: 'Devam Et',
        onClick: onContinue,
        icon: <ArrowRight className="w-4 h-4" />
      }}
      className={className}
    />
  )
}

// Export all components
export {
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
}

