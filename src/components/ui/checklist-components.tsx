'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './core-components'
import { Button } from './core-components'
import { Badge } from './core-components'
import { 
  Sun,
  Moon,
  Menu,
  X,
  Home,
  Settings,
  User,
  Bell,
  Search,
  Plus,
  Filter,
  Download,
  Upload,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Check,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Mic,
  MicOff,
  Fingerprint,
  Camera,
  Image,
  File,
  Folder,
  Link,
  ExternalLink,
  Copy,
  Share2,
  Heart,
  Star,
  Flag,
  Bookmark,
  Tag,
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
  Heart as HeartIcon,
  Star as StarIcon,
  Zap,
  Target,
  Activity,
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  ArrowUp as ArrowUpIcon,
  ArrowDown as ArrowDownIcon,
  ArrowRight as ArrowRightIcon,
  ArrowLeft as ArrowLeftIcon,
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
  Wifi,
  WifiOff,
  Battery,
  BatteryLow,
  Signal,
  SignalOff,
  Smartphone,
  Monitor,
  Tablet,
  Laptop,
  Desktop,
  Headphones,
  Speaker,
  Keyboard,
  Mouse,
  Gamepad2,
  Tv,
  Radio,
  Watch,
  Compass,
  Map,
  Navigation,
  Car,
  Bus,
  Train,
  Plane,
  Ship,
  Bike,
  Walking,
  Running,
  Swimming,
  Skiing,
  Snowboarding,
  Hiking,
  Camping,
  Fishing,
  Hunting,
  Gardening,
  Cooking,
  Shopping,
  ShoppingCart,
  CreditCard,
  DollarSign,
  Euro,
  PoundSterling,
  Yen,
  Bitcoin,
  Coins,
  Wallet,
  Receipt,
  Calculator,
  Percent,
  Hash,
  AtSign,
  Asterisk,
  Plus as PlusIcon,
  Minus as MinusIcon,
  Equal,
  Divide,
  Multiply,
  SquareRoot,
  Pi,
  Infinity,
  Alpha,
  Beta,
  Gamma,
  Delta,
  Epsilon,
  Zeta,
  Eta,
  Theta,
  Iota,
  Kappa,
  Lambda,
  Mu,
  Nu,
  Xi,
  Omicron,
  Rho,
  Sigma,
  Tau,
  Upsilon,
  Phi,
  Chi,
  Psi,
  Omega
} from 'lucide-react'

// Types
interface ThemeToggleProps {
  className?: string
  variant?: 'button' | 'switch' | 'icon'
  size?: 'sm' | 'md' | 'lg'
}

interface MobileBottomNavProps {
  className?: string
  items: Array<{
    id: string
    label: string
    icon: React.ReactNode
    href?: string
    onClick?: () => void
    badge?: number
    active?: boolean
  }>
}

interface FABProps {
  className?: string
  icon?: React.ReactNode
  label?: string
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'accent'
  size?: 'sm' | 'md' | 'lg'
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
}

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'rectangular' | 'circular' | 'rounded'
  width?: string | number
  height?: string | number
  animation?: 'pulse' | 'wave' | 'none'
}

interface PullToRefreshProps {
  onRefresh: () => Promise<void>
  children: React.ReactNode
  className?: string
  threshold?: number
  resistance?: number
}

interface SwipeGestureProps {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  children: React.ReactNode
  className?: string
  threshold?: number
}

interface VoiceInputProps {
  onTranscript: (text: string) => void
  onError?: (error: string) => void
  className?: string
  language?: string
  continuous?: boolean
}

interface ProgressiveImageProps {
  src: string
  alt: string
  className?: string
  placeholder?: string
  blurDataURL?: string
  width?: number
  height?: number
  priority?: boolean
}

interface InfiniteScrollProps {
  hasMore: boolean
  loadMore: () => void
  children: React.ReactNode
  className?: string
  threshold?: number
  loader?: React.ReactNode
}

interface SearchWithFiltersProps {
  onSearch: (query: string, filters: Record<string, any>) => void
  filters: Array<{
    key: string
    label: string
    type: 'select' | 'multiselect' | 'date' | 'range'
    options?: Array<{ value: string; label: string }>
  }>
  className?: string
  placeholder?: string
}

interface BulkActionsProps {
  selectedItems: string[]
  onAction: (action: string, items: string[]) => void
  actions: Array<{
    id: string
    label: string
    icon: React.ReactNode
    variant?: 'default' | 'destructive'
  }>
  className?: string
}

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

// Theme Toggle Component
export function ThemeToggle({ 
  className, 
  variant = 'button',
  size = 'md'
}: ThemeToggleProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'light'
    setTheme(savedTheme)
    document.documentElement.classList.toggle('dark', savedTheme === 'dark')
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

  if (!mounted) return null

  if (variant === 'switch') {
    return (
      <label className={cn(
        'relative inline-flex items-center cursor-pointer',
        className
      )}>
        <input
          type="checkbox"
          checked={theme === 'dark'}
          onChange={toggleTheme}
          className="sr-only"
        />
        <div className={cn(
          'relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[""] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600'
        )} />
        <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
          {theme === 'dark' ? 'Dark' : 'Light'}
        </span>
      </label>
    )
  }

  if (variant === 'icon') {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleTheme}
        className={className}
      >
        {theme === 'dark' ? (
          <Sun className="w-4 h-4" />
        ) : (
          <Moon className="w-4 h-4" />
        )}
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      onClick={toggleTheme}
      className={cn(
        'flex items-center space-x-2',
        size === 'sm' && 'px-2 py-1 text-sm',
        size === 'md' && 'px-3 py-2',
        size === 'lg' && 'px-4 py-3 text-lg',
        className
      )}
    >
      {theme === 'dark' ? (
        <>
          <Sun className="w-4 h-4" />
          <span>Light Mode</span>
        </>
      ) : (
        <>
          <Moon className="w-4 h-4" />
          <span>Dark Mode</span>
        </>
      )}
    </Button>
  )
}

// Mobile Bottom Navigation Component
export function MobileBottomNav({ className, items }: MobileBottomNavProps) {
  return (
    <nav className={cn(
      'fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border',
      'md:hidden', // Only show on mobile
      className
    )}>
      <div className="flex items-center justify-around py-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={item.onClick}
            className={cn(
              'flex flex-col items-center justify-center p-2 rounded-lg transition-colors',
              'hover:bg-muted active:bg-muted/80',
              item.active && 'bg-primary text-primary-foreground',
              !item.active && 'text-muted-foreground hover:text-foreground'
            )}
          >
            <div className="relative">
              {item.icon}
              {item.badge && item.badge > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {item.badge > 99 ? '99+' : item.badge}
                </Badge>
              )}
            </div>
            <span className="text-xs mt-1 font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}

// Floating Action Button Component
export function FAB({ 
  className,
  icon = <Plus className="w-6 h-6" />,
  label,
  onClick,
  variant = 'primary',
  size = 'md',
  position = 'bottom-right'
}: FABProps) {
  const positions = {
    'bottom-right': 'fixed bottom-6 right-6',
    'bottom-left': 'fixed bottom-6 left-6',
    'top-right': 'fixed top-6 right-6',
    'top-left': 'fixed top-6 left-6'
  }

  const variants = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    accent: 'bg-accent text-accent-foreground hover:bg-accent/90'
  }

  const sizes = {
    sm: 'w-12 h-12',
    md: 'w-14 h-14',
    lg: 'w-16 h-16'
  }

  return (
    <Button
      onClick={onClick}
      className={cn(
        'rounded-full shadow-lg hover:shadow-xl transition-all duration-200',
        'flex items-center justify-center',
        'hover:scale-105 active:scale-95',
        positions[position],
        variants[variant],
        sizes[size],
        className
      )}
    >
      {icon}
      {label && (
        <span className="ml-2 font-medium">
          {label}
        </span>
      )}
    </Button>
  )
}

// Skeleton Loader Component
export function Skeleton({ 
  className,
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse'
}: SkeletonProps) {
  const variants = {
    text: 'h-4 w-full',
    rectangular: 'w-full',
    circular: 'rounded-full',
    rounded: 'rounded-lg'
  }

  const animations = {
    pulse: 'animate-pulse',
    wave: 'animate-wave',
    none: ''
  }

  return (
    <div
      className={cn(
        'bg-muted',
        variants[variant],
        animations[animation],
        className
      )}
      style={{
        width: width || (variant === 'circular' ? height : undefined),
        height: height || (variant === 'circular' ? width : undefined)
      }}
    />
  )
}

// Pull to Refresh Component
export function PullToRefresh({ 
  onRefresh, 
  children, 
  className,
  threshold = 60,
  resistance = 2.5
}: PullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const [isPulling, setIsPulling] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const startY = useRef(0)
  const currentY = useRef(0)

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY
      setIsPulling(true)
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPulling) return

    currentY.current = e.touches[0].clientY
    const distance = Math.max(0, currentY.current - startY.current)
    const resistanceDistance = distance / resistance

    if (distance > 0) {
      e.preventDefault()
      setPullDistance(resistanceDistance)
    }
  }

  const handleTouchEnd = async () => {
    if (pullDistance >= threshold) {
      setIsRefreshing(true)
      await onRefresh()
      setIsRefreshing(false)
    }
    
    setPullDistance(0)
    setIsPulling(false)
  }

  return (
    <div
      ref={containerRef}
      className={cn('relative', className)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull indicator */}
      <div
        className={cn(
          'absolute top-0 left-0 right-0 flex items-center justify-center',
          'bg-primary text-primary-foreground transition-all duration-200',
          pullDistance > 0 ? 'opacity-100' : 'opacity-0'
        )}
        style={{
          height: `${Math.min(pullDistance, threshold)}px`,
          transform: `translateY(${Math.min(pullDistance - threshold, 0)}px)`
        }}
      >
        {isRefreshing ? (
          <RefreshCw className="w-6 h-6 animate-spin" />
        ) : (
          <ArrowDown className={cn(
            'w-6 h-6 transition-transform duration-200',
            pullDistance >= threshold && 'rotate-180'
          )} />
        )}
      </div>

      {/* Content */}
      <div
        style={{
          transform: `translateY(${Math.min(pullDistance, threshold)}px)`
        }}
      >
        {children}
      </div>
    </div>
  )
}

// Swipe Gesture Component
export function SwipeGesture({ 
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  children,
  className,
  threshold = 50
}: SwipeGestureProps) {
  const [startX, setStartX] = useState(0)
  const [startY, setStartY] = useState(0)
  const [isSwipe, setIsSwipe] = useState(false)

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX)
    setStartY(e.touches[0].clientY)
    setIsSwipe(false)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isSwipe) return

    const endX = e.changedTouches[0].clientX
    const endY = e.changedTouches[0].clientY
    const deltaX = endX - startX
    const deltaY = endY - startY

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (Math.abs(deltaX) > threshold) {
        if (deltaX > 0) {
          onSwipeRight?.()
        } else {
          onSwipeLeft?.()
        }
        setIsSwipe(true)
      }
    } else {
      // Vertical swipe
      if (Math.abs(deltaY) > threshold) {
        if (deltaY > 0) {
          onSwipeDown?.()
        } else {
          onSwipeUp?.()
        }
        setIsSwipe(true)
      }
    }
  }

  return (
    <div
      className={className}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {children}
    </div>
  )
}

// Voice Input Component
export function VoiceInput({ 
  onTranscript,
  onError,
  className,
  language = 'tr-TR',
  continuous = false
}: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = continuous
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = language

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript
        onTranscript(transcript)
      }

      recognitionRef.current.onerror = (event: any) => {
        onError?.(event.error)
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }

      setIsSupported(true)
    }
  }, [language, continuous, onTranscript, onError])

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  if (!isSupported) {
    return (
      <div className={cn('text-muted-foreground text-sm', className)}>
        Sesli giriş desteklenmiyor
      </div>
    )
  }

  return (
    <Button
      variant={isListening ? 'destructive' : 'outline'}
      onClick={isListening ? stopListening : startListening}
      className={cn(
        'flex items-center space-x-2',
        isListening && 'animate-pulse',
        className
      )}
    >
      {isListening ? (
        <>
          <MicOff className="w-4 h-4" />
          <span>Dinlemeyi Durdur</span>
        </>
      ) : (
        <>
          <Mic className="w-4 h-4" />
          <span>Sesli Giriş</span>
        </>
      )}
    </Button>
  )
}

// Export all components
export {
  ThemeToggle,
  MobileBottomNav,
  FAB,
  Skeleton,
  PullToRefresh,
  SwipeGesture,
  VoiceInput
}
