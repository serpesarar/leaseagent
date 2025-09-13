'use client'

import React, { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './core-components'
import { Button } from './core-components'
import { Badge } from './core-components'
import { 
  Download,
  Wifi,
  WifiOff,
  Smartphone,
  Monitor,
  Tablet,
  Laptop,
  Desktop,
  X,
  Check,
  AlertCircle,
  Info,
  Clock,
  RefreshCw,
  Settings,
  Bell,
  BellOff,
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
  Plus,
  Minus,
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
  FileText,
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
interface InstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

interface PWAInstallPromptProps {
  onInstall?: () => void
  onDismiss?: () => void
  className?: string
  variant?: 'banner' | 'modal' | 'toast'
  position?: 'top' | 'bottom' | 'center'
}

interface OfflineIndicatorProps {
  isOnline: boolean
  className?: string
  variant?: 'bar' | 'badge' | 'toast'
  position?: 'top' | 'bottom'
  showReconnectButton?: boolean
  onReconnect?: () => void
}

// PWA Install Prompt Component
export function PWAInstallPrompt({ 
  onInstall, 
  onDismiss,
  className,
  variant = 'banner',
  position = 'bottom'
}: PWAInstallPromptProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<InstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as InstallPromptEvent)
      setShowPrompt(true)
    }

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowPrompt(false)
      onInstall?.()
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [onInstall])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        onInstall?.()
      }
      
      setDeferredPrompt(null)
      setShowPrompt(false)
    } catch (error) {
      console.error('Install prompt failed:', error)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    onDismiss?.()
  }

  if (isInstalled || !showPrompt || !deferredPrompt) {
    return null
  }

  const variants = {
    banner: 'fixed left-0 right-0 z-50 bg-primary text-primary-foreground shadow-lg',
    modal: 'fixed inset-0 z-50 flex items-center justify-center bg-black/50',
    toast: 'fixed right-4 z-50 max-w-sm bg-primary text-primary-foreground shadow-lg rounded-lg'
  }

  const positions = {
    top: 'top-0',
    bottom: 'bottom-0',
    center: 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
  }

  if (variant === 'banner') {
    return (
      <div className={cn(
        variants.banner,
        positions[position],
        className
      )}>
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Download className="w-5 h-5" />
              <div>
                <p className="font-medium">Uygulamayı ana ekranınıza ekleyin</p>
                <p className="text-sm opacity-90">Hızlı erişim ve daha iyi deneyim için</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleInstall}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <Download className="w-4 h-4 mr-2" />
                Ekle
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className="text-white hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'modal') {
    return (
      <div className={cn(variants.modal, className)}>
        <Card className="w-full max-w-md mx-4">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Download className="w-5 h-5 mr-2" />
              Uygulamayı Yükle
            </CardTitle>
            <CardDescription>
              PropManage'i ana ekranınıza ekleyerek daha hızlı erişim sağlayın
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Smartphone className="w-8 h-8 text-primary" />
                <div>
                  <p className="font-medium">Hızlı Erişim</p>
                  <p className="text-sm text-muted-foreground">Ana ekrandan tek tıkla erişim</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Zap className="w-8 h-8 text-primary" />
                <div>
                  <p className="font-medium">Daha Hızlı</p>
                  <p className="text-sm text-muted-foreground">Tarayıcıdan daha hızlı yükleme</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="w-8 h-8 text-primary" />
                <div>
                  <p className="font-medium">Güvenli</p>
                  <p className="text-sm text-muted-foreground">Güvenli ve güncel veriler</p>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleInstall} className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Yükle
              </Button>
              <Button variant="outline" onClick={handleDismiss} className="flex-1">
                Daha Sonra
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (variant === 'toast') {
    return (
      <div className={cn(variants.toast, className)}>
        <div className="p-4">
          <div className="flex items-center space-x-3">
            <Download className="w-5 h-5" />
            <div className="flex-1">
              <p className="font-medium">Uygulamayı yükleyin</p>
              <p className="text-sm opacity-90">Ana ekranınıza ekleyin</p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleInstall}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                Ekle
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className="text-white hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}

// Offline Indicator Component
export function OfflineIndicator({ 
  isOnline, 
  className,
  variant = 'bar',
  position = 'top',
  showReconnectButton = true,
  onReconnect
}: OfflineIndicatorProps) {
  const [showIndicator, setShowIndicator] = useState(false)
  const [wasOffline, setWasOffline] = useState(false)

  useEffect(() => {
    if (!isOnline && !wasOffline) {
      setShowIndicator(true)
      setWasOffline(true)
    } else if (isOnline && wasOffline) {
      // Show briefly when coming back online
      setTimeout(() => {
        setShowIndicator(false)
        setWasOffline(false)
      }, 2000)
    }
  }, [isOnline, wasOffline])

  if (!showIndicator) return null

  const variants = {
    bar: 'fixed left-0 right-0 z-50 bg-orange-500 text-white shadow-lg',
    badge: 'fixed top-4 right-4 z-50 bg-orange-500 text-white rounded-full px-3 py-1 text-sm font-medium shadow-lg',
    toast: 'fixed right-4 z-50 max-w-sm bg-orange-500 text-white shadow-lg rounded-lg'
  }

  const positions = {
    top: 'top-0',
    bottom: 'bottom-0'
  }

  if (variant === 'bar') {
    return (
      <div className={cn(
        variants.bar,
        positions[position],
        className
      )}>
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <WifiOff className="w-4 h-4" />
              <span className="font-medium">Çevrimdışı moddasınız</span>
            </div>
            {showReconnectButton && (
              <Button
                variant="secondary"
                size="sm"
                onClick={onReconnect}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Yeniden Bağlan
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'badge') {
    return (
      <div className={cn(variants.badge, className)}>
        <div className="flex items-center space-x-2">
          <WifiOff className="w-4 h-4" />
          <span>Çevrimdışı</span>
        </div>
      </div>
    )
  }

  if (variant === 'toast') {
    return (
      <div className={cn(variants.toast, className)}>
        <div className="p-4">
          <div className="flex items-center space-x-3">
            <WifiOff className="w-5 h-5" />
            <div className="flex-1">
              <p className="font-medium">Çevrimdışı moddasınız</p>
              <p className="text-sm opacity-90">İnternet bağlantınızı kontrol edin</p>
            </div>
            {showReconnectButton && (
              <Button
                variant="secondary"
                size="sm"
                onClick={onReconnect}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return null
}

// Online Status Indicator
export function OnlineStatusIndicator({ 
  isOnline, 
  className 
}: { 
  isOnline: boolean
  className?: string 
}) {
  return (
    <div className={cn(
      'flex items-center space-x-2 px-2 py-1 rounded-full text-xs font-medium',
      isOnline 
        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
        : 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
      className
    )}>
      {isOnline ? (
        <>
          <Wifi className="w-3 h-3" />
          <span>Çevrimiçi</span>
        </>
      ) : (
        <>
          <WifiOff className="w-3 h-3" />
          <span>Çevrimdışı</span>
        </>
      )}
    </div>
  )
}

// PWA Update Available Component
export function PWAUpdateAvailable({ 
  onUpdate, 
  onDismiss,
  className 
}: { 
  onUpdate: () => void
  onDismiss: () => void
  className?: string 
}) {
  const [showUpdate, setShowUpdate] = useState(false)

  useEffect(() => {
    // Listen for service worker updates
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        setShowUpdate(true)
      })
    }
  }, [])

  if (!showUpdate) return null

  return (
    <div className={cn(
      'fixed bottom-4 right-4 z-50 max-w-sm bg-primary text-primary-foreground shadow-lg rounded-lg',
      className
    )}>
      <div className="p-4">
        <div className="flex items-center space-x-3">
          <RefreshCw className="w-5 h-5" />
          <div className="flex-1">
            <p className="font-medium">Güncelleme mevcut</p>
            <p className="text-sm opacity-90">Yeni özellikler ve iyileştirmeler</p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={onUpdate}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              Güncelle
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowUpdate(false)
                onDismiss()
              }}
              className="text-white hover:bg-white/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// PWA Share Component
export function PWAShareButton({ 
  title,
  text,
  url,
  className 
}: { 
  title?: string
  text?: string
  url?: string
  className?: string 
}) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title || 'PropManage',
          text: text || 'Mülk yönetim platformu',
          url: url || window.location.href
        })
      } catch (error) {
        console.log('Share cancelled')
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(url || window.location.href)
        // Show success message
      } catch (error) {
        console.error('Failed to copy to clipboard')
      }
    }
  }

  return (
    <Button
      onClick={handleShare}
      variant="outline"
      className={className}
    >
      <Share2 className="w-4 h-4 mr-2" />
      Paylaş
    </Button>
  )
}

// PWA Install Banner (Simplified)
export function InstallBanner({ 
  onInstall,
  onDismiss,
  className 
}: { 
  onInstall: () => void
  onDismiss: () => void
  className?: string 
}) {
  return (
    <div className={cn(
      'fixed bottom-0 left-0 right-0 z-50 bg-primary text-primary-foreground shadow-lg',
      className
    )}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Download className="w-5 h-5" />
            <div>
              <p className="font-medium">Uygulamayı ana ekranınıza ekleyin</p>
              <p className="text-sm opacity-90">Hızlı erişim ve daha iyi deneyim için</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={onInstall}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              <Download className="w-4 h-4 mr-2" />
              Ekle
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className="text-white hover:bg-white/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Offline Bar (Simplified)
export function OfflineBar({ 
  show,
  className 
}: { 
  show: boolean
  className?: string 
}) {
  if (!show) return null

  return (
    <div className={cn(
      'fixed top-0 left-0 right-0 z-50 bg-orange-500 text-white shadow-lg',
      className
    )}>
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center space-x-2">
          <WifiOff className="w-4 h-4" />
          <span className="font-medium">Çevrimdışı moddasınız</span>
        </div>
      </div>
    </div>
  )
}

// Export all components
export {
  PWAInstallPrompt,
  OfflineIndicator,
  OnlineStatusIndicator,
  PWAUpdateAvailable,
  PWAShareButton,
  InstallBanner,
  OfflineBar
}

