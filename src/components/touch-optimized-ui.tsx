'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useSwipeGestures, usePullToRefresh } from '@/hooks/use-swipe-gestures'
import { 
  Trash2, 
  Archive, 
  Check, 
  X, 
  MoreVertical, 
  ChevronRight,
  RefreshCw,
  ArrowDown
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Touch-optimized button with haptic feedback
interface TouchButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  disabled?: boolean
}

export function TouchButton({ 
  children, 
  onClick, 
  variant = 'default', 
  size = 'md',
  className,
  disabled = false
}: TouchButtonProps) {
  const [isPressed, setIsPressed] = useState(false)

  const handleTouchStart = () => {
    if (!disabled) {
      setIsPressed(true)
      // Haptic feedback for supported devices
      if (navigator.vibrate) {
        navigator.vibrate(10)
      }
    }
  }

  const handleTouchEnd = () => {
    setIsPressed(false)
    if (!disabled && onClick) {
      onClick()
    }
  }

  const sizeClasses = {
    sm: 'h-10 px-4 text-sm',
    md: 'h-12 px-6 text-base',
    lg: 'h-14 px-8 text-lg'
  }

  return (
    <Button
      variant={variant}
      className={cn(
        sizeClasses[size],
        'touch-manipulation select-none transition-all duration-150',
        isPressed && !disabled && 'scale-95 opacity-80',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      disabled={disabled}
    >
      {children}
    </Button>
  )
}

// Swipeable card with action buttons
interface SwipeableCardProps {
  children: React.ReactNode
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  leftAction?: {
    icon: React.ComponentType<any>
    label: string
    color: 'red' | 'green' | 'blue' | 'yellow'
  }
  rightAction?: {
    icon: React.ComponentType<any>
    label: string
    color: 'red' | 'green' | 'blue' | 'yellow'
  }
  className?: string
}

export function SwipeableCard({
  children,
  onSwipeLeft,
  onSwipeRight,
  leftAction,
  rightAction,
  className
}: SwipeableCardProps) {
  const [swipeOffset, setSwipeOffset] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const swipeHandlers = useSwipeGestures({
    onSwipeLeft: () => {
      if (onSwipeLeft) {
        setIsAnimating(true)
        setSwipeOffset(-100)
        setTimeout(() => {
          onSwipeLeft()
          resetCard()
        }, 300)
      }
    },
    onSwipeRight: () => {
      if (onSwipeRight) {
        setIsAnimating(true)
        setSwipeOffset(100)
        setTimeout(() => {
          onSwipeRight()
          resetCard()
        }, 300)
      }
    },
    threshold: 60
  })

  const resetCard = () => {
    setSwipeOffset(0)
    setIsAnimating(false)
  }

  const getActionColor = (color: string) => {
    const colors = {
      red: 'bg-red-500 text-white',
      green: 'bg-green-500 text-white',
      blue: 'bg-blue-500 text-white',
      yellow: 'bg-yellow-500 text-white'
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <div className="relative overflow-hidden">
      {/* Left Action */}
      {leftAction && (
        <div className={cn(
          "absolute inset-y-0 left-0 flex items-center justify-center w-20 transition-transform duration-300",
          getActionColor(leftAction.color),
          swipeOffset > 0 ? 'translate-x-0' : '-translate-x-full'
        )}>
          <div className="flex flex-col items-center">
            <leftAction.icon className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">{leftAction.label}</span>
          </div>
        </div>
      )}

      {/* Right Action */}
      {rightAction && (
        <div className={cn(
          "absolute inset-y-0 right-0 flex items-center justify-center w-20 transition-transform duration-300",
          getActionColor(rightAction.color),
          swipeOffset < 0 ? 'translate-x-0' : 'translate-x-full'
        )}>
          <div className="flex flex-col items-center">
            <rightAction.icon className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">{rightAction.label}</span>
          </div>
        </div>
      )}

      {/* Card Content */}
      <div
        ref={cardRef}
        className={cn(
          "transition-transform duration-300 bg-white",
          isAnimating && 'transition-transform duration-300',
          className
        )}
        style={{ transform: `translateX(${swipeOffset}%)` }}
        {...swipeHandlers}
      >
        {children}
      </div>
    </div>
  )
}

// Pull-to-refresh container
interface PullToRefreshProps {
  children: React.ReactNode
  onRefresh: () => Promise<void> | void
  className?: string
}

export function PullToRefresh({ children, onRefresh, className }: PullToRefreshProps) {
  const { isRefreshing, pullDistance, pullToRefreshProps } = usePullToRefresh(onRefresh)
  const threshold = 80

  return (
    <div className={cn('relative', className)} {...pullToRefreshProps}>
      {/* Pull indicator */}
      <div 
        className={cn(
          "absolute top-0 left-0 right-0 flex items-center justify-center transition-all duration-200 bg-blue-50 border-b border-blue-200",
          pullDistance > 0 ? 'opacity-100' : 'opacity-0'
        )}
        style={{ 
          height: `${Math.min(pullDistance, threshold)}px`,
          transform: `translateY(${pullDistance > threshold ? 0 : pullDistance - threshold}px)`
        }}
      >
        <div className="flex flex-col items-center">
          {isRefreshing ? (
            <RefreshCw className="h-5 w-5 text-blue-600 animate-spin" />
          ) : (
            <ArrowDown 
              className={cn(
                "h-5 w-5 text-blue-600 transition-transform duration-200",
                pullDistance > threshold && "rotate-180"
              )} 
            />
          )}
          <span className="text-xs text-blue-600 mt-1">
            {isRefreshing ? 'Refreshing...' : pullDistance > threshold ? 'Release to refresh' : 'Pull to refresh'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div 
        className="transition-transform duration-200"
        style={{ transform: `translateY(${pullDistance}px)` }}
      >
        {children}
      </div>
    </div>
  )
}

// Touch-optimized list item
interface TouchListItemProps {
  title: string
  subtitle?: string
  badge?: string | number
  icon?: React.ComponentType<any>
  onClick?: () => void
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  leftAction?: {
    icon: React.ComponentType<any>
    label: string
    color: 'red' | 'green' | 'blue' | 'yellow'
  }
  rightAction?: {
    icon: React.ComponentType<any>
    label: string
    color: 'red' | 'green' | 'blue' | 'yellow'
  }
  className?: string
}

export function TouchListItem({
  title,
  subtitle,
  badge,
  icon: Icon,
  onClick,
  onSwipeLeft,
  onSwipeRight,
  leftAction,
  rightAction,
  className
}: TouchListItemProps) {
  const [isPressed, setIsPressed] = useState(false)

  const handlePress = () => {
    setIsPressed(true)
    if (navigator.vibrate) {
      navigator.vibrate(5)
    }
    setTimeout(() => setIsPressed(false), 150)
    if (onClick) {
      onClick()
    }
  }

  const content = (
    <div 
      className={cn(
        "flex items-center space-x-4 p-4 bg-white border-b border-gray-100 touch-manipulation transition-all duration-150",
        onClick && "cursor-pointer hover:bg-gray-50 active:bg-gray-100",
        isPressed && "bg-gray-100 scale-[0.98]",
        className
      )}
      onTouchStart={() => onClick && setIsPressed(true)}
      onTouchEnd={() => onClick && setIsPressed(false)}
      onTouchCancel={() => onClick && setIsPressed(false)}
      onClick={handlePress}
    >
      {Icon && (
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
            <Icon className="h-5 w-5 text-gray-600" />
          </div>
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900 truncate">{title}</h4>
        {subtitle && (
          <p className="text-sm text-gray-500 truncate">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center space-x-2 flex-shrink-0">
        {badge && (
          <Badge variant="secondary" className="text-xs">
            {badge}
          </Badge>
        )}
        {onClick && <ChevronRight className="h-4 w-4 text-gray-400" />}
      </div>
    </div>
  )

  if (onSwipeLeft || onSwipeRight) {
    return (
      <SwipeableCard
        onSwipeLeft={onSwipeLeft}
        onSwipeRight={onSwipeRight}
        leftAction={leftAction}
        rightAction={rightAction}
      >
        {content}
      </SwipeableCard>
    )
  }

  return content
}

// Touch-optimized action sheet
interface ActionSheetProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  actions: Array<{
    label: string
    icon?: React.ComponentType<any>
    onClick: () => void
    destructive?: boolean
  }>
}

export function ActionSheet({ isOpen, onClose, title, actions }: ActionSheetProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Action Sheet */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl p-4 space-y-2">
        {title && (
          <div className="text-center pb-2 border-b border-gray-200 mb-4">
            <h3 className="font-semibold text-gray-900">{title}</h3>
          </div>
        )}
        
        {actions.map((action, index) => (
          <TouchButton
            key={index}
            onClick={() => {
              action.onClick()
              onClose()
            }}
            variant={action.destructive ? 'destructive' : 'outline'}
            size="lg"
            className="w-full justify-start"
          >
            {action.icon && <action.icon className="mr-3 h-5 w-5" />}
            {action.label}
          </TouchButton>
        ))}
        
        <TouchButton
          onClick={onClose}
          variant="secondary"
          size="lg"
          className="w-full mt-4"
        >
          Cancel
        </TouchButton>
      </div>
    </div>
  )
}

