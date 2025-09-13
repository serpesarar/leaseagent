'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './core-components'
import { Button } from './core-components'
import { Badge } from './core-components'
import { 
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
  Omega,
  Search,
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
  Bell,
  Settings,
  User,
  Home,
  Menu,
  X,
  Sun,
  Moon,
  Plus,
  Mic,
  MicOff
} from 'lucide-react'

// Types
interface BiometricAuthProps {
  onSuccess: () => void
  onError?: (error: string) => void
  className?: string
  type?: 'fingerprint' | 'face' | 'voice'
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

// Biometric Authentication Component
export function BiometricAuth({ 
  onSuccess,
  onError,
  className,
  type = 'fingerprint'
}: BiometricAuthProps) {
  const [isSupported, setIsSupported] = useState(false)
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  useEffect(() => {
    // Check if WebAuthn is supported
    if (typeof window !== 'undefined' && 'navigator' in window && 'credentials' in navigator) {
      setIsSupported(true)
    }
  }, [])

  const handleAuthenticate = async () => {
    if (!isSupported) {
      onError?.('Biometric authentication not supported')
      return
    }

    setIsAuthenticating(true)

    try {
      // Simulate biometric authentication
      // In a real app, you would use WebAuthn API
      await new Promise(resolve => setTimeout(resolve, 2000))
      onSuccess()
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'Authentication failed')
    } finally {
      setIsAuthenticating(false)
    }
  }

  const getIcon = () => {
    switch (type) {
      case 'fingerprint':
        return <Fingerprint className="w-8 h-8" />
      case 'face':
        return <Camera className="w-8 h-8" />
      case 'voice':
        return <Mic className="w-8 h-8" />
      default:
        return <Fingerprint className="w-8 h-8" />
    }
  }

  const getLabel = () => {
    switch (type) {
      case 'fingerprint':
        return 'Parmak İzi'
      case 'face':
        return 'Yüz Tanıma'
      case 'voice':
        return 'Ses Tanıma'
      default:
        return 'Biyometrik'
    }
  }

  if (!isSupported) {
    return (
      <div className={cn('text-muted-foreground text-sm', className)}>
        Biyometrik kimlik doğrulama desteklenmiyor
      </div>
    )
  }

  return (
    <Button
      onClick={handleAuthenticate}
      disabled={isAuthenticating}
      className={cn(
        'flex items-center space-x-2',
        isAuthenticating && 'animate-pulse',
        className
      )}
    >
      {getIcon()}
      <span>{isAuthenticating ? 'Doğrulanıyor...' : getLabel()}</span>
    </Button>
  )
}

// Progressive Image Loading Component
export function ProgressiveImage({ 
  src,
  alt,
  className,
  placeholder,
  blurDataURL,
  width,
  height,
  priority = false
}: ProgressiveImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  const handleLoad = () => {
    setIsLoaded(true)
  }

  const handleError = () => {
    setHasError(true)
  }

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Placeholder */}
      {!isLoaded && !hasError && (
        <div 
          className={cn(
            'absolute inset-0 bg-muted animate-pulse',
            'flex items-center justify-center'
          )}
          style={{ width, height }}
        >
          {placeholder || <Image className="w-8 h-8 text-muted-foreground" />}
        </div>
      )}

      {/* Blur placeholder */}
      {blurDataURL && !isLoaded && (
        <img
          src={blurDataURL}
          alt=""
          className="absolute inset-0 w-full h-full object-cover blur-sm scale-110"
        />
      )}

      {/* Main image */}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0',
          hasError && 'hidden'
        )}
        loading={priority ? 'eager' : 'lazy'}
      />

      {/* Error state */}
      {hasError && (
        <div 
          className="absolute inset-0 bg-muted flex items-center justify-center"
          style={{ width, height }}
        >
          <div className="text-center text-muted-foreground">
            <Image className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm">Resim yüklenemedi</p>
          </div>
        </div>
      )}
    </div>
  )
}

// Infinite Scroll Component
export function InfiniteScroll({ 
  hasMore,
  loadMore,
  children,
  className,
  threshold = 100,
  loader
}: InfiniteScrollProps) {
  const [isLoading, setIsLoading] = useState(false)
  const observerRef = useRef<HTMLDivElement>(null)

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries
      if (entry.isIntersecting && hasMore && !isLoading) {
        setIsLoading(true)
        loadMore()
        setTimeout(() => setIsLoading(false), 1000) // Simulate loading
      }
    },
    [hasMore, isLoading, loadMore]
  )

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.1,
      rootMargin: `${threshold}px`
    })

    if (observerRef.current) {
      observer.observe(observerRef.current)
    }

    return () => observer.disconnect()
  }, [handleIntersection, threshold])

  return (
    <div className={className}>
      {children}
      
      {/* Loader */}
      {hasMore && (
        <div ref={observerRef} className="flex justify-center py-4">
          {loader || (
            <div className="flex items-center space-x-2 text-muted-foreground">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Yükleniyor...</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Search with Filters Component
export function SearchWithFilters({ 
  onSearch,
  filters,
  className,
  placeholder = "Ara..."
}: SearchWithFiltersProps) {
  const [query, setQuery] = useState('')
  const [filterValues, setFilterValues] = useState<Record<string, any>>({})
  const [showFilters, setShowFilters] = useState(false)

  const handleSearch = () => {
    onSearch(query, filterValues)
  }

  const handleFilterChange = (key: string, value: any) => {
    setFilterValues(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search input */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <Button onClick={handleSearch}>
          <Search className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 border border-border rounded-lg bg-muted/50">
          {filters.map((filter) => (
            <div key={filter.key} className="space-y-2">
              <label className="text-sm font-medium">{filter.label}</label>
              {filter.type === 'select' && (
                <select
                  value={filterValues[filter.key] || ''}
                  onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                  className="w-full p-2 border border-input rounded-md"
                >
                  <option value="">Tümü</option>
                  {filter.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
              {filter.type === 'multiselect' && (
                <div className="space-y-2">
                  {filter.options?.map((option) => (
                    <label key={option.value} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={filterValues[filter.key]?.includes(option.value) || false}
                        onChange={(e) => {
                          const current = filterValues[filter.key] || []
                          const updated = e.target.checked
                            ? [...current, option.value]
                            : current.filter((v: string) => v !== option.value)
                          handleFilterChange(filter.key, updated)
                        }}
                        className="rounded"
                      />
                      <span className="text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
              )}
              {filter.type === 'date' && (
                <input
                  type="date"
                  value={filterValues[filter.key] || ''}
                  onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                  className="w-full p-2 border border-input rounded-md"
                />
              )}
              {filter.type === 'range' && (
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={filterValues[filter.key] || 0}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    className="w-full"
                  />
                  <div className="text-sm text-muted-foreground text-center">
                    {filterValues[filter.key] || 0}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Bulk Actions Component
export function BulkActions({ 
  selectedItems,
  onAction,
  actions,
  className
}: BulkActionsProps) {
  if (selectedItems.length === 0) return null

  return (
    <div className={cn(
      'fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50',
      'bg-background border border-border rounded-lg shadow-lg',
      'flex items-center space-x-2 p-2',
      className
    )}>
      <span className="text-sm font-medium text-muted-foreground">
        {selectedItems.length} öğe seçildi
      </span>
      
      {actions.map((action) => (
        <Button
          key={action.id}
          variant={action.variant === 'destructive' ? 'destructive' : 'outline'}
          size="sm"
          onClick={() => onAction(action.id, selectedItems)}
          className="flex items-center space-x-1"
        >
          {action.icon}
          <span>{action.label}</span>
        </Button>
      ))}
    </div>
  )
}

// Export all components
export {
  BiometricAuth,
  ProgressiveImage,
  InfiniteScroll,
  SearchWithFilters,
  BulkActions
}