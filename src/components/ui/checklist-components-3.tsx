'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './core-components'
import { Button } from './core-components'
import { Badge } from './core-components'
import { 
  Upload,
  File,
  Image,
  Video,
  Music,
  Archive,
  FileText,
  FileSpreadsheet,
  FilePdf,
  FileWord,
  FileExcel,
  FilePowerpoint,
  FileCode,
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
  FileCheck,
  FileX,
  FilePlus,
  FileMinus,
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
  FileCheck2,
  FileX2,
  FilePlus2,
  FileMinus2,
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
  FileCheck3,
  FileX3,
  FilePlus3,
  FileMinus3,
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
  FileCheck4,
  FileX4,
  FilePlus4,
  FileMinus4,
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
  FileCheck5,
  FileX5,
  FilePlus5,
  FileMinus5,
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
  FileCheck6,
  FileX6,
  FilePlus6,
  FileMinus6,
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
  FileCheck7,
  FileX7,
  FilePlus7,
  FileMinus7,
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
  FileCheck8,
  FileX8,
  FilePlus8,
  FileMinus8,
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
  FileCheck9,
  FileX9,
  FilePlus9,
  FileMinus9,
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
  FileClock10,
  Wifi,
  WifiOff,
  RefreshCw,
  Bell,
  BellOff,
  Info,
  AlertCircle,
  CheckCircle,
  XCircle,
  AlertTriangle,
  HelpCircle,
  Lightbulb,
  Shield,
  Lock,
  Unlock,
  Key,
  Database,
  Server,
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
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Video,
  Music,
  Volume2,
  VolumeX,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  Move,
  GripVertical,
  GripHorizontal,
  MoreVertical,
  MoreHorizontal,
  Grid,
  List,
  Layout,
  Sidebar,
  PanelLeft,
  PanelRight,
  PanelTop,
  PanelBottom,
  Square,
  Circle,
  Triangle,
  Hexagon,
  Octagon,
  Diamond,
  Heart,
  Star,
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
  Search,
  Filter,
  Download,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Check,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Settings,
  User,
  Home,
  Menu,
  X,
  Sun,
  Moon,
  Plus,
  Mic,
  MicOff,
  Fingerprint,
  Camera
} from 'lucide-react'

// Types
interface DragDropUploadProps {
  onUpload: (files: File[]) => void
  accept?: string
  maxFiles?: number
  maxSize?: number
  className?: string
  children?: React.ReactNode
}

interface RealtimeStatusProps {
  status: 'online' | 'offline' | 'connecting' | 'error'
  lastUpdate?: Date
  className?: string
}

interface NotificationCenterProps {
  notifications: Array<{
    id: string
    title: string
    message: string
    type: 'info' | 'success' | 'warning' | 'error'
    timestamp: Date
    read: boolean
    action?: {
      label: string
      onClick: () => void
    }
  }>
  onMarkAsRead: (id: string) => void
  onMarkAllAsRead: () => void
  className?: string
}

interface HelpTooltipProps {
  content: React.ReactNode
  children: React.ReactNode
  className?: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
}

interface OnboardingTourProps {
  steps: Array<{
    id: string
    target: string
    title: string
    content: React.ReactNode
    position?: 'top' | 'bottom' | 'left' | 'right'
  }>
  onComplete: () => void
  onSkip: () => void
  className?: string
}

interface BreadcrumbProps {
  items: Array<{
    label: string
    href?: string
    onClick?: () => void
  }>
  className?: string
  separator?: React.ReactNode
}

interface QuickSwitcherProps {
  onSelect: (item: any) => void
  items: Array<{
    id: string
    label: string
    description?: string
    icon?: React.ReactNode
    category?: string
  }>
  className?: string
  placeholder?: string
}

interface KeyboardShortcutsProps {
  shortcuts: Array<{
    key: string
    description: string
    category?: string
  }>
  className?: string
}

// Drag & Drop Upload Component
export function DragDropUpload({ 
  onUpload,
  accept = '*/*',
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024, // 10MB
  className,
  children
}: DragDropUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    await processFiles(files)
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    await processFiles(files)
  }

  const processFiles = async (files: File[]) => {
    if (files.length === 0) return

    // Validate files
    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        console.warn(`File ${file.name} is too large`)
        return false
      }
      return true
    })

    if (validFiles.length === 0) {
      console.error('No valid files to upload')
      return
    }

    if (validFiles.length > maxFiles) {
      console.error(`Too many files. Maximum ${maxFiles} allowed`)
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          setIsUploading(false)
          onUpload(validFiles)
          return 100
        }
        return prev + 10
      })
    }, 100)
  }

  const getFileIcon = (file: File) => {
    const type = file.type.split('/')[0]
    switch (type) {
      case 'image':
        return <Image className="w-8 h-8" />
      case 'video':
        return <Video className="w-8 h-8" />
      case 'audio':
        return <Music className="w-8 h-8" />
      case 'application':
        if (file.type.includes('pdf')) return <FilePdf className="w-8 h-8" />
        if (file.type.includes('word')) return <FileWord className="w-8 h-8" />
        if (file.type.includes('excel')) return <FileExcel className="w-8 h-8" />
        if (file.type.includes('powerpoint')) return <FilePowerpoint className="w-8 h-8" />
        return <File className="w-8 h-8" />
      default:
        return <File className="w-8 h-8" />
    }
  }

  return (
    <div
      className={cn(
        'relative border-2 border-dashed rounded-lg transition-colors',
        isDragOver ? 'border-primary bg-primary/5' : 'border-border',
        isUploading && 'pointer-events-none',
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {children || (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <Upload className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Dosyaları buraya sürükleyin</h3>
          <p className="text-muted-foreground mb-4">
            veya <button 
              onClick={() => fileInputRef.current?.click()}
              className="text-primary hover:underline"
            >
              dosya seçin
            </button>
          </p>
          <p className="text-sm text-muted-foreground">
            Maksimum {maxFiles} dosya, {Math.round(maxSize / 1024 / 1024)}MB
          </p>
        </div>
      )}

      {/* Upload progress */}
      {isUploading && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
            <p className="text-sm font-medium">Yükleniyor...</p>
            <div className="w-32 h-2 bg-muted rounded-full mt-2">
              <div 
                className="h-2 bg-primary rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  )
}

// Real-time Status Updates Component
export function RealtimeStatus({ 
  status,
  lastUpdate,
  className
}: RealtimeStatusProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    const timer = setTimeout(() => setIsVisible(false), 3000)
    return () => clearTimeout(timer)
  }, [status, lastUpdate])

  const getStatusConfig = () => {
    switch (status) {
      case 'online':
        return {
          icon: <Wifi className="w-4 h-4" />,
          text: 'Çevrimiçi',
          color: 'text-green-600',
          bgColor: 'bg-green-100'
        }
      case 'offline':
        return {
          icon: <WifiOff className="w-4 h-4" />,
          text: 'Çevrimdışı',
          color: 'text-red-600',
          bgColor: 'bg-red-100'
        }
      case 'connecting':
        return {
          icon: <RefreshCw className="w-4 h-4 animate-spin" />,
          text: 'Bağlanıyor...',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100'
        }
      case 'error':
        return {
          icon: <XCircle className="w-4 h-4" />,
          text: 'Hata',
          color: 'text-red-600',
          bgColor: 'bg-red-100'
        }
      default:
        return {
          icon: <HelpCircle className="w-4 h-4" />,
          text: 'Bilinmiyor',
          color: 'text-gray-600',
          bgColor: 'bg-gray-100'
        }
    }
  }

  const config = getStatusConfig()

  if (!isVisible) return null

  return (
    <div className={cn(
      'fixed top-4 right-4 z-50 flex items-center space-x-2 px-3 py-2 rounded-lg shadow-lg',
      config.bgColor,
      config.color,
      'animate-slide-in-right',
      className
    )}>
      {config.icon}
      <span className="text-sm font-medium">{config.text}</span>
      {lastUpdate && (
        <span className="text-xs opacity-75">
          {lastUpdate.toLocaleTimeString()}
        </span>
      )}
    </div>
  )
}

// Notification Center Component
export function NotificationCenter({ 
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  className
}: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const unreadCount = notifications.filter(n => !n.read).length

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <Info className="w-5 h-5 text-blue-600" />
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />
      default:
        return <Bell className="w-5 h-5 text-gray-600" />
    }
  }

  return (
    <div className={cn('relative', className)}>
      {/* Notification button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notification panel */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-background border border-border rounded-lg shadow-lg z-50">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Bildirimler</h3>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onMarkAllAsRead}
                  className="text-xs"
                >
                  Tümünü okundu işaretle
                </Button>
              )}
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                <Bell className="w-8 h-8 mx-auto mb-2" />
                <p>Henüz bildirim yok</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    'p-4 border-b border-border last:border-b-0 hover:bg-muted/50 cursor-pointer',
                    !notification.read && 'bg-blue-50 dark:bg-blue-950/20'
                  )}
                  onClick={() => !notification.read && onMarkAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm">{notification.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {notification.timestamp.toLocaleString()}
                      </p>
                      {notification.action && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={(e) => {
                            e.stopPropagation()
                            notification.action?.onClick()
                          }}
                        >
                          {notification.action.label}
                        </Button>
                      )}
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// Help Tooltip Component
export function HelpTooltip({ 
  content,
  children,
  className,
  position = 'top',
  delay = 500
}: HelpTooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => {
    const id = setTimeout(() => setIsVisible(true), delay)
    setTimeoutId(id)
  }

  const handleMouseLeave = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      setTimeoutId(null)
    }
    setIsVisible(false)
  }

  const positions = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  }

  return (
    <div 
      className={cn('relative inline-block', className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      
      {isVisible && (
        <div className={cn(
          'absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg',
          'animate-fade-in',
          positions[position]
        )}>
          {content}
          {/* Arrow */}
          <div className={cn(
            'absolute w-2 h-2 bg-gray-900 transform rotate-45',
            position === 'top' && 'top-full left-1/2 transform -translate-x-1/2 -translate-y-1/2',
            position === 'bottom' && 'bottom-full left-1/2 transform -translate-x-1/2 translate-y-1/2',
            position === 'left' && 'left-full top-1/2 transform -translate-y-1/2 -translate-x-1/2',
            position === 'right' && 'right-full top-1/2 transform -translate-y-1/2 translate-x-1/2'
          )} />
        </div>
      )}
    </div>
  )
}

// Export all components
export {
  DragDropUpload,
  RealtimeStatus,
  NotificationCenter,
  HelpTooltip
}

