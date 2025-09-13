'use client'

import React, { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { Button } from './core-components'
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info, 
  Loader2, 
  Heart, 
  Star, 
  ThumbsUp,
  Download,
  Upload,
  RefreshCw,
  Plus,
  Minus,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ChevronLeft,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Bell,
  BellOff,
  Settings,
  User,
  Home,
  Building2,
  CreditCard,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Share2,
  Copy,
  ExternalLink,
  Trash2,
  Edit,
  Save,
  X,
  Search,
  Filter,
  SortAsc,
  SortDesc
} from 'lucide-react'

// Animation Variants
export const animationVariants = {
  // Fade animations
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  },
  fadeInDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 }
  },
  fadeInLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 }
  },
  fadeInRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  },

  // Scale animations
  scaleIn: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 }
  },
  scaleInUp: {
    initial: { opacity: 0, scale: 0.8, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.8, y: 20 }
  },

  // Slide animations
  slideUp: {
    initial: { y: '100%' },
    animate: { y: 0 },
    exit: { y: '100%' }
  },
  slideDown: {
    initial: { y: '-100%' },
    animate: { y: 0 },
    exit: { y: '-100%' }
  },
  slideLeft: {
    initial: { x: '-100%' },
    animate: { x: 0 },
    exit: { x: '-100%' }
  },
  slideRight: {
    initial: { x: '100%' },
    animate: { x: 0 },
    exit: { x: '100%' }
  },

  // Bounce animations
  bounceIn: {
    initial: { opacity: 0, scale: 0.3 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        damping: 10,
        stiffness: 100
      }
    },
    exit: { opacity: 0, scale: 0.3 }
  },

  // Rotate animations
  rotateIn: {
    initial: { opacity: 0, rotate: -180 },
    animate: { opacity: 1, rotate: 0 },
    exit: { opacity: 0, rotate: 180 }
  }
}

// Animated Card Component
interface AnimatedCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  clickable?: boolean
  animation?: 'fadeIn' | 'fadeInUp' | 'scaleIn' | 'bounceIn'
  delay?: number
  duration?: number
}

export function AnimatedCard({ 
  children, 
  className, 
  hover = true, 
  clickable = false,
  animation = 'fadeInUp',
  delay = 0,
  duration = 0.3
}: AnimatedCardProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  const animationClasses = {
    fadeIn: 'opacity-0',
    fadeInUp: 'opacity-0 translate-y-4',
    scaleIn: 'opacity-0 scale-95',
    bounceIn: 'opacity-0 scale-75'
  }

  const hoverClasses = hover ? 'hover:shadow-lg hover:-translate-y-1' : ''
  const clickableClasses = clickable ? 'cursor-pointer active:scale-95' : ''

  return (
    <div
      ref={cardRef}
      className={cn(
        'transition-all duration-300 ease-out',
        animationClasses[animation],
        hoverClasses,
        clickableClasses,
        isVisible && 'opacity-100 translate-y-0 scale-100',
        className
      )}
      style={{
        transitionDelay: `${delay}ms`,
        transitionDuration: `${duration}s`
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </div>
  )
}

// Loading Skeleton Component
interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded'
  width?: string | number
  height?: string | number
  animation?: 'pulse' | 'wave' | 'shimmer'
}

export function Skeleton({ 
  className, 
  variant = 'rectangular',
  width,
  height,
  animation = 'shimmer'
}: SkeletonProps) {
  const variantClasses = {
    text: 'h-4 w-full',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-md'
  }

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-wave',
    shimmer: 'animate-shimmer'
  }

  return (
    <div
      className={cn(
        'bg-muted',
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
      style={{
        width: width || 'auto',
        height: height || 'auto'
      }}
    />
  )
}

// Success Animation Component
interface SuccessAnimationProps {
  show: boolean
  onComplete?: () => void
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function SuccessAnimation({ 
  show, 
  onComplete, 
  size = 'md',
  className 
}: SuccessAnimationProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (show) {
      setIsAnimating(true)
      const timer = setTimeout(() => {
        setIsAnimating(false)
        onComplete?.()
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [show, onComplete])

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }

  if (!show) return null

  return (
    <div className={cn('relative', className)}>
      <div className={cn(
        'relative',
        sizeClasses[size]
      )}>
        {/* Background circle */}
        <div className={cn(
          'absolute inset-0 rounded-full bg-green-500',
          isAnimating ? 'animate-ping' : ''
        )} />
        
        {/* Checkmark icon */}
        <div className={cn(
          'relative flex items-center justify-center rounded-full bg-green-500 text-white',
          sizeClasses[size],
          isAnimating ? 'animate-scale-in' : ''
        )}>
          <CheckCircle className={cn(
            'text-white',
            size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-6 h-6' : 'w-8 h-8'
          )} />
        </div>
      </div>
    </div>
  )
}

// Error Animation Component
interface ErrorAnimationProps {
  show: boolean
  onComplete?: () => void
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function ErrorAnimation({ 
  show, 
  onComplete, 
  size = 'md',
  className 
}: ErrorAnimationProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (show) {
      setIsAnimating(true)
      const timer = setTimeout(() => {
        setIsAnimating(false)
        onComplete?.()
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [show, onComplete])

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }

  if (!show) return null

  return (
    <div className={cn('relative', className)}>
      <div className={cn(
        'relative',
        sizeClasses[size]
      )}>
        {/* Background circle */}
        <div className={cn(
          'absolute inset-0 rounded-full bg-red-500',
          isAnimating ? 'animate-ping' : ''
        )} />
        
        {/* X icon */}
        <div className={cn(
          'relative flex items-center justify-center rounded-full bg-red-500 text-white',
          sizeClasses[size],
          isAnimating ? 'animate-shake' : ''
        )}>
          <XCircle className={cn(
            'text-white',
            size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-6 h-6' : 'w-8 h-8'
          )} />
        </div>
      </div>
    </div>
  )
}

// Loading Button Component
interface LoadingButtonProps {
  loading: boolean
  children: React.ReactNode
  loadingText?: string
  className?: string
  variant?: 'default' | 'primary' | 'secondary' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  disabled?: boolean
}

export function LoadingButton({ 
  loading, 
  children, 
  loadingText = 'Yükleniyor...',
  className,
  variant = 'default',
  size = 'md',
  onClick,
  disabled
}: LoadingButtonProps) {
  const variants = {
    default: 'bg-background text-foreground hover:bg-accent',
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
  }

  const sizes = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-base'
  }

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size],
        loading && 'cursor-not-allowed',
        className
      )}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  )
}

// Floating Action Button with Animation
interface FloatingActionButtonProps {
  onClick: () => void
  icon: React.ReactNode
  label?: string
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  pulse?: boolean
}

export function FloatingActionButton({ 
  onClick, 
  icon, 
  label,
  position = 'bottom-right',
  size = 'md',
  className,
  pulse = false
}: FloatingActionButtonProps) {
  const [isPressed, setIsPressed] = useState(false)

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
  }

  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-16 h-16'
  }

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  return (
    <button
      className={cn(
        'fixed z-50 rounded-full shadow-lg transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'bg-primary text-primary-foreground hover:bg-primary/90',
        'hover:shadow-xl hover:scale-105',
        'active:scale-95',
        positionClasses[position],
        sizeClasses[size],
        pulse && 'animate-pulse',
        className
      )}
      onClick={onClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
    >
      <div className={cn(
        'flex items-center justify-center',
        iconSizeClasses[size]
      )}>
        {icon}
      </div>
      
      {label && (
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-popover text-popover-foreground px-2 py-1 rounded-md text-xs whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
          {label}
        </div>
      )}
    </button>
  )
}

// Progress Ring Component
interface ProgressRingProps {
  progress: number
  size?: number
  strokeWidth?: number
  className?: string
  animated?: boolean
  color?: string
}

export function ProgressRing({ 
  progress, 
  size = 120, 
  strokeWidth = 8,
  className,
  animated = true,
  color = 'hsl(var(--primary))'
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className={cn('relative', className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-muted"
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={cn(
            'transition-all duration-1000 ease-out',
            animated && 'animate-progress'
          )}
        />
      </svg>
      
      {/* Progress text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-semibold text-foreground">
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  )
}

// Toast Notification Component
interface ToastProps {
  show: boolean
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  description?: string
  onClose: () => void
  duration?: number
  className?: string
}

export function Toast({ 
  show, 
  type, 
  title, 
  description,
  onClose,
  duration = 5000,
  className
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onClose, 300) // Wait for exit animation
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [show, duration, onClose])

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
    }
  }

  const config = typeConfig[type]
  const Icon = config.icon

  if (!show) return null

  return (
    <div className={cn(
      'fixed top-4 right-4 z-50 max-w-sm w-full',
      'transform transition-all duration-300 ease-out',
      isVisible 
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
          <Icon className={cn('w-5 h-5 mt-0.5', config.color)} />
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-foreground">{title}</h4>
            {description && (
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

// Animated Counter Component
interface AnimatedCounterProps {
  value: number
  duration?: number
  className?: string
  prefix?: string
  suffix?: string
}

export function AnimatedCounter({ 
  value, 
  duration = 1000,
  className,
  prefix = '',
  suffix = ''
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    setIsAnimating(true)
    const startTime = Date.now()
    const startValue = displayValue

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const currentValue = startValue + (value - startValue) * easeOut
      
      setDisplayValue(Math.round(currentValue))

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setIsAnimating(false)
      }
    }

    requestAnimationFrame(animate)
  }, [value, duration])

  return (
    <span className={cn(
      'inline-block transition-all duration-200',
      isAnimating && 'scale-105',
      className
    )}>
      {prefix}{displayValue.toLocaleString()}{suffix}
    </span>
  )
}

// Export all components
export {
  animationVariants,
  AnimatedCard,
  Skeleton,
  SuccessAnimation,
  ErrorAnimation,
  LoadingButton,
  FloatingActionButton,
  ProgressRing,
  Toast,
  AnimatedCounter
}

