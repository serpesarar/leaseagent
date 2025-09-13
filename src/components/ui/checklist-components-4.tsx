'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './core-components'
import { Button } from './core-components'
import { Badge } from './core-components'
import { 
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
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
  X,
  Menu,
  Sun,
  Moon,
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

// Onboarding Tour Component
export function OnboardingTour({ 
  steps,
  onComplete,
  onSkip,
  className
}: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (steps.length > 0) {
      setIsVisible(true)
      const element = document.querySelector(steps[currentStep].target) as HTMLElement
      setTargetElement(element)
    }
  }, [currentStep, steps])

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const skipTour = () => {
    setIsVisible(false)
    onSkip()
  }

  if (!isVisible || !targetElement) return null

  const step = steps[currentStep]
  const rect = targetElement.getBoundingClientRect()

  const getTooltipPosition = () => {
    const position = step.position || 'bottom'
    const offset = 20

    switch (position) {
      case 'top':
        return {
          top: rect.top - offset,
          left: rect.left + rect.width / 2,
          transform: 'translate(-50%, -100%)'
        }
      case 'bottom':
        return {
          top: rect.bottom + offset,
          left: rect.left + rect.width / 2,
          transform: 'translate(-50%, 0)'
        }
      case 'left':
        return {
          top: rect.top + rect.height / 2,
          left: rect.left - offset,
          transform: 'translate(-100%, -50%)'
        }
      case 'right':
        return {
          top: rect.top + rect.height / 2,
          left: rect.right + offset,
          transform: 'translate(0, -50%)'
        }
      default:
        return {
          top: rect.bottom + offset,
          left: rect.left + rect.width / 2,
          transform: 'translate(-50%, 0)'
        }
    }
  }

  const tooltipStyle = getTooltipPosition()

  return (
    <div className={cn('fixed inset-0 z-50', className)}>
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/50"
        onClick={skipTour}
      />

      {/* Highlighted element */}
      <div
        className="absolute border-2 border-primary rounded-lg shadow-lg"
        style={{
          top: rect.top - 4,
          left: rect.left - 4,
          width: rect.width + 8,
          height: rect.height + 8,
          pointerEvents: 'none'
        }}
      />

      {/* Tooltip */}
      <div
        className="absolute bg-background border border-border rounded-lg shadow-lg p-4 max-w-sm"
        style={tooltipStyle}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">{step.title}</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={skipTour}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">
            {step.content}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={prevStep}
                disabled={currentStep === 0}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={nextStep}
              >
                {currentStep === steps.length - 1 ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs text-muted-foreground">
                {currentStep + 1} / {steps.length}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={skipTour}
                className="text-xs"
              >
                Atla
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Breadcrumb Navigation Component
export function Breadcrumb({ 
  items,
  className,
  separator = <ChevronRight className="w-4 h-4" />
}: BreadcrumbProps) {
  return (
    <nav className={cn('flex items-center space-x-2 text-sm', className)}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <span className="text-muted-foreground">
              {separator}
            </span>
          )}
          {item.href ? (
            <a
              href={item.href}
              className="text-primary hover:underline"
            >
              {item.label}
            </a>
          ) : item.onClick ? (
            <button
              onClick={item.onClick}
              className="text-primary hover:underline"
            >
              {item.label}
            </button>
          ) : (
            <span className={cn(
              index === items.length - 1 ? 'text-foreground font-medium' : 'text-muted-foreground'
            )}>
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}

// Quick Switcher Component (CMD+K)
export function QuickSwitcher({ 
  onSelect,
  items,
  className,
  placeholder = "Ara..."
}: QuickSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  // Group items by category
  const groupedItems = items.reduce((acc, item) => {
    const category = item.category || 'Diğer'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(item)
    return acc
  }, {} as Record<string, typeof items>)

  // Filter items based on query
  const filteredItems = Object.entries(groupedItems).map(([category, items]) => [
    category,
    items.filter(item => 
      item.label.toLowerCase().includes(query.toLowerCase()) ||
      item.description?.toLowerCase().includes(query.toLowerCase())
    )
  ]).filter(([_, items]) => items.length > 0)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false)
      setQuery('')
    } else if (e.key === 'Enter') {
      const flatItems = filteredItems.flatMap(([_, items]) => items)
      if (flatItems[selectedIndex]) {
        onSelect(flatItems[selectedIndex])
        setIsOpen(false)
        setQuery('')
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const flatItems = filteredItems.flatMap(([_, items]) => items)
      setSelectedIndex(prev => Math.min(prev + 1, flatItems.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => Math.max(prev - 1, 0))
    }
  }

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
        setTimeout(() => inputRef.current?.focus(), 0)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  if (!isOpen) return null

  return (
    <div className={cn('fixed inset-0 z-50 flex items-start justify-center pt-20', className)}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50" 
        onClick={() => setIsOpen(false)}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4 bg-background border border-border rounded-lg shadow-lg">
        {/* Input */}
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="w-full pl-10 pr-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {filteredItems.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <Search className="w-8 h-8 mx-auto mb-2" />
              <p>Sonuç bulunamadı</p>
            </div>
          ) : (
            filteredItems.map(([category, items]) => (
              <div key={category}>
                <div className="px-4 py-2 text-xs font-medium text-muted-foreground bg-muted/50">
                  {category}
                </div>
                {items.map((item, index) => {
                  const flatIndex = filteredItems
                    .slice(0, filteredItems.findIndex(([cat]) => cat === category))
                    .reduce((acc, [_, items]) => acc + items.length, 0) + index
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelect(item)
                        setIsOpen(false)
                        setQuery('')
                      }}
                      className={cn(
                        'w-full px-4 py-3 text-left hover:bg-muted/50 flex items-center space-x-3',
                        selectedIndex === flatIndex && 'bg-muted'
                      )}
                    >
                      {item.icon && (
                        <div className="text-muted-foreground">
                          {item.icon}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">{item.label}</div>
                        {item.description && (
                          <div className="text-sm text-muted-foreground">
                            {item.description}
                          </div>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border text-xs text-muted-foreground">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span>↑↓ Navigate</span>
              <span>↵ Select</span>
              <span>⎋ Close</span>
            </div>
            <span>⌘K to open</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Keyboard Shortcuts Overlay Component
export function KeyboardShortcuts({ 
  shortcuts,
  className
}: KeyboardShortcutsProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === '?' && e.shiftKey) {
        e.preventDefault()
        setIsVisible(true)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  // Group shortcuts by category
  const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
    const category = shortcut.category || 'Diğer'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(shortcut)
    return acc
  }, {} as Record<string, typeof shortcuts>)

  if (!isVisible) return null

  return (
    <div className={cn('fixed inset-0 z-50 flex items-center justify-center', className)}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50" 
        onClick={() => setIsVisible(false)}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4 bg-background border border-border rounded-lg shadow-lg">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Klavye Kısayolları</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-6">
            {Object.entries(groupedShortcuts).map(([category, shortcuts]) => (
              <div key={category}>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  {category}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {shortcuts.map((shortcut, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <span className="text-sm">{shortcut.description}</span>
                      <kbd className="px-2 py-1 text-xs font-mono bg-background border border-border rounded">
                        {shortcut.key}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-border text-xs text-muted-foreground text-center">
            <p>Bu pencereyi kapatmak için <kbd className="px-1 py-0.5 bg-muted border border-border rounded">?</kbd> tuşuna basın</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Export all components
export {
  OnboardingTour,
  Breadcrumb,
  QuickSwitcher,
  KeyboardShortcuts
}

