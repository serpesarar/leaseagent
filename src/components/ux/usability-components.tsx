'use client'

import React, { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './core-components'
import { Button } from './core-components'
import { Badge } from './core-components'
import { 
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ChevronLeft,
  Eye,
  EyeOff,
  Info,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  Settings,
  MoreHorizontal,
  Filter,
  Search,
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
  Bell,
  BellOff,
  Star,
  Heart,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Building2,
  Home,
  Users,
  DollarSign,
  CreditCard,
  Wrench,
  AlertCircle,
  HelpCircle,
  Lightbulb,
  Target,
  Zap,
  Shield,
  Lock,
  Unlock,
  Key,
  User,
  UserCheck,
  UserX,
  UserPlus,
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
  MoreHorizontal as MoreHorizontalIcon,
  X,
  Check,
  Plus as PlusIcon,
  Minus as MinusIcon
} from 'lucide-react'

// Types
interface Step {
  id: string
  title: string
  description?: string
  status: 'pending' | 'current' | 'completed' | 'error'
  icon?: React.ReactNode
}

interface ToastConfig {
  id: string
  type: 'success' | 'error' | 'warning' | 'info' | 'loading'
  title: string
  description?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

// Progressive Disclosure Components

// Collapsible Section Component
interface CollapsibleSectionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
  icon?: React.ReactNode
  badge?: string | number
  className?: string
  variant?: 'default' | 'compact' | 'minimal'
}

export function CollapsibleSection({ 
  title, 
  children, 
  defaultOpen = false,
  icon,
  badge,
  className,
  variant = 'default'
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const variants = {
    default: 'border rounded-lg',
    compact: 'border-b',
    minimal: 'border-0'
  }

  return (
    <div className={cn('transition-all duration-200', variants[variant], className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center justify-between p-4 text-left transition-colors hover:bg-muted/50',
          variant === 'compact' && 'p-2',
          variant === 'minimal' && 'p-1'
        )}
      >
        <div className="flex items-center space-x-3">
          {icon && (
            <div className="text-muted-foreground">
              {icon}
            </div>
          )}
          <span className="font-medium text-foreground">{title}</span>
          {badge && (
            <Badge variant="secondary" className="text-xs">
              {badge}
            </Badge>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      </button>
      
      <div className={cn(
        'overflow-hidden transition-all duration-300 ease-in-out',
        isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
      )}>
        <div className={cn(
          'p-4',
          variant === 'compact' && 'p-2',
          variant === 'minimal' && 'p-1'
        )}>
          {children}
        </div>
      </div>
    </div>
  )
}

// Progressive Form Component
interface ProgressiveFormProps {
  steps: Step[]
  currentStep: number
  onStepChange: (step: number) => void
  children: React.ReactNode
  className?: string
}

export function ProgressiveForm({ 
  steps, 
  currentStep, 
  onStepChange, 
  children,
  className 
}: ProgressiveFormProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {/* Step Progress */}
      <div className="flex items-center space-x-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <button
              onClick={() => onStepChange(index)}
              className={cn(
                'flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors',
                step.status === 'completed' && 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
                step.status === 'current' && 'bg-primary text-primary-foreground',
                step.status === 'error' && 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
                step.status === 'pending' && 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              {step.icon && <div className="w-4 h-4">{step.icon}</div>}
              <span className="text-sm font-medium">{step.title}</span>
            </button>
            
            {index < steps.length - 1 && (
              <ChevronRight className="w-4 h-4 text-muted-foreground mx-2" />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="min-h-[400px]">
        {children}
      </div>
    </div>
  )
}

// Advanced Settings Component
interface AdvancedSettingsProps {
  children: React.ReactNode
  title?: string
  description?: string
  className?: string
}

export function AdvancedSettings({ 
  children, 
  title = "Gelişmiş Ayarlar",
  description = "Bu ayarlar varsayılan olarak gizlidir",
  className 
}: AdvancedSettingsProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <CollapsibleSection
      title={title}
      defaultOpen={isOpen}
      icon={<Settings className="w-4 h-4" />}
      variant="compact"
      className={className}
    >
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">{description}</p>
        {children}
      </div>
    </CollapsibleSection>
  )
}

// Feedback Components

// Enhanced Toast System
interface ToastProps {
  toast: ToastConfig
  onClose: (id: string) => void
  className?: string
}

export function Toast({ toast, onClose, className }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    
    if (toast.duration && toast.type !== 'loading') {
      const timer = setTimeout(() => {
        handleClose()
      }, toast.duration)

      return () => clearTimeout(timer)
    }
  }, [toast.duration, toast.type])

  const handleClose = () => {
    setIsLeaving(true)
    setTimeout(() => {
      onClose(toast.id)
    }, 300)
  }

  const typeConfig = {
    success: {
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950',
      borderColor: 'border-green-200 dark:border-green-800'
    },
    error: {
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-950',
      borderColor: 'border-red-200 dark:border-red-800'
    },
    warning: {
      icon: AlertTriangle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-950',
      borderColor: 'border-yellow-200 dark:border-yellow-800'
    },
    info: {
      icon: Info,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
      borderColor: 'border-blue-200 dark:border-blue-800'
    },
    loading: {
      icon: Loader2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
      borderColor: 'border-blue-200 dark:border-blue-800'
    }
  }

  const config = typeConfig[toast.type]
  const Icon = config.icon

  return (
    <div className={cn(
      'fixed top-4 right-4 z-50 max-w-sm w-full transform transition-all duration-300 ease-out',
      isVisible && !isLeaving 
        ? 'translate-x-0 opacity-100' 
        : 'translate-x-full opacity-0',
      className
    )}>
      <div className={cn(
        'p-4 rounded-lg border shadow-lg',
        config.bgColor,
        config.borderColor
      )}>
        <div className="flex items-start space-x-3">
          <Icon className={cn(
            'w-5 h-5 mt-0.5',
            config.color,
            toast.type === 'loading' && 'animate-spin'
          )} />
          
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-foreground">{toast.title}</h4>
            {toast.description && (
              <p className="mt-1 text-sm text-muted-foreground">{toast.description}</p>
            )}
            
            {toast.action && (
              <button
                onClick={toast.action.onClick}
                className="mt-2 text-sm font-medium text-primary hover:text-primary/80"
              >
                {toast.action.label}
              </button>
            )}
          </div>
          
          <button
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

// Toast Manager Hook
export function useToast() {
  const [toasts, setToasts] = useState<ToastConfig[]>([])

  const addToast = (toast: Omit<ToastConfig, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts(prev => [...prev, { ...toast, id }])
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const success = (title: string, description?: string, action?: ToastConfig['action']) => {
    addToast({ type: 'success', title, description, action, duration: 5000 })
  }

  const error = (title: string, description?: string, action?: ToastConfig['action']) => {
    addToast({ type: 'error', title, description, action, duration: 7000 })
  }

  const warning = (title: string, description?: string, action?: ToastConfig['action']) => {
    addToast({ type: 'warning', title, description, action, duration: 6000 })
  }

  const info = (title: string, description?: string, action?: ToastConfig['action']) => {
    addToast({ type: 'info', title, description, action, duration: 5000 })
  }

  const loading = (title: string, description?: string) => {
    addToast({ type: 'loading', title, description })
  }

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
    loading
  }
}

// Enhanced Input Component
interface EnhancedInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
  error?: string
  success?: boolean
  helper?: string
  required?: boolean
  disabled?: boolean
  className?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  onRightIconClick?: () => void
}

export function EnhancedInput({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  error,
  success,
  helper,
  required,
  disabled,
  className,
  leftIcon,
  rightIcon,
  onRightIconClick
}: EnhancedInputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const inputType = type === 'password' && showPassword ? 'text' : type

  return (
    <div className={cn('space-y-2', className)}>
      <label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            {leftIcon}
          </div>
        )}
        
        <input
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            'w-full px-3 py-2 border rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            error && 'border-red-500 focus:ring-red-500',
            success && 'border-green-500 focus:ring-green-500',
            disabled && 'bg-muted cursor-not-allowed',
            isFocused && 'ring-2 ring-primary'
          )}
        />
        
        {rightIcon && (
          <button
            type="button"
            onClick={onRightIconClick}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {rightIcon}
          </button>
        )}
        
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      
      {/* Helper Text */}
      {helper && !error && (
        <p className="text-xs text-muted-foreground">{helper}</p>
      )}
      
      {/* Error Message */}
      {error && (
        <div className="flex items-center space-x-1 text-xs text-red-600">
          <AlertCircle className="w-3 h-3" />
          <span>{error}</span>
        </div>
      )}
      
      {/* Success Indicator */}
      {success && !error && (
        <div className="flex items-center space-x-1 text-xs text-green-600">
          <CheckCircle className="w-3 h-3" />
          <span>Geçerli</span>
        </div>
      )}
    </div>
  )
}

// Step Progress Component
interface StepProgressProps {
  steps: Step[]
  currentStep: number
  onStepClick?: (step: number) => void
  className?: string
  variant?: 'horizontal' | 'vertical' | 'compact'
}

export function StepProgress({ 
  steps, 
  currentStep, 
  onStepClick,
  className,
  variant = 'horizontal'
}: StepProgressProps) {
  const variants = {
    horizontal: 'flex items-center space-x-4',
    vertical: 'flex flex-col space-y-4',
    compact: 'flex items-center space-x-2'
  }

  return (
    <div className={cn(variants[variant], className)}>
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <button
            onClick={() => onStepClick?.(index)}
            className={cn(
              'flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors',
              step.status === 'completed' && 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
              step.status === 'current' && 'bg-primary text-primary-foreground',
              step.status === 'error' && 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
              step.status === 'pending' && 'bg-muted text-muted-foreground hover:bg-muted/80',
              variant === 'compact' && 'px-2 py-1 text-xs'
            )}
          >
            {step.icon && <div className="w-4 h-4">{step.icon}</div>}
            <span className="font-medium">{step.title}</span>
          </button>
          
          {index < steps.length - 1 && variant === 'horizontal' && (
            <ChevronRight className="w-4 h-4 text-muted-foreground mx-2" />
          )}
          
          {index < steps.length - 1 && variant === 'vertical' && (
            <div className="w-px h-6 bg-muted mx-auto" />
          )}
        </div>
      ))}
    </div>
  )
}

// Loading States Component
interface LoadingStatesProps {
  type: 'skeleton' | 'spinner' | 'dots' | 'pulse'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingStates({ type, size = 'md', className }: LoadingStatesProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  if (type === 'skeleton') {
    return (
      <div className={cn('animate-pulse', className)}>
        <div className="space-y-3">
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="h-4 bg-muted rounded w-5/6"></div>
        </div>
      </div>
    )
  }

  if (type === 'spinner') {
    return (
      <Loader2 className={cn('animate-spin text-primary', sizes[size], className)} />
    )
  }

  if (type === 'dots') {
    return (
      <div className={cn('flex space-x-1', className)}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              'bg-primary rounded-full animate-pulse',
              size === 'sm' && 'w-1 h-1',
              size === 'md' && 'w-2 h-2',
              size === 'lg' && 'w-3 h-3'
            )}
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    )
  }

  if (type === 'pulse') {
    return (
      <div className={cn('animate-pulse bg-primary rounded-full', sizes[size], className)} />
    )
  }

  return null
}

// Empty State Component
interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({ 
  icon, 
  title, 
  description, 
  action,
  className 
}: EmptyStateProps) {
  return (
    <div className={cn('text-center py-12', className)}>
      {icon && (
        <div className="mx-auto w-12 h-12 text-muted-foreground mb-4">
          {icon}
        </div>
      )}
      
      <h3 className="text-lg font-medium text-foreground mb-2">{title}</h3>
      
      {description && (
        <p className="text-muted-foreground mb-6 max-w-sm mx-auto">{description}</p>
      )}
      
      {action && (
        <Button onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  )
}

// Export all components
export {
  CollapsibleSection,
  ProgressiveForm,
  AdvancedSettings,
  Toast,
  useToast,
  EnhancedInput,
  StepProgress,
  LoadingStates,
  EmptyState
}

