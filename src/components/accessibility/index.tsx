'use client'

import React, { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  useRef,
  ReactNode,
  KeyboardEvent,
  MouseEvent,
  FocusEvent
} from 'react'
import { cn } from '@/lib/utils'

// Accessibility Context
interface AccessibilityContextType {
  announceMessage: (message: string, priority?: 'polite' | 'assertive') => void
  isReducedMotion: boolean
  isHighContrast: boolean
  fontSize: 'small' | 'medium' | 'large'
  setFontSize: (size: 'small' | 'medium' | 'large') => void
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext)
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider')
  }
  return context
}

// Accessibility Provider
interface AccessibilityProviderProps {
  children: ReactNode
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const [isReducedMotion, setIsReducedMotion] = useState(false)
  const [isHighContrast, setIsHighContrast] = useState(false)
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium')
  const announcerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setIsReducedMotion(mediaQuery.matches)
    
    const handleChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches)
    }
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    // Check for high contrast preference
    const mediaQuery = window.matchMedia('(prefers-contrast: high)')
    setIsHighContrast(mediaQuery.matches)
    
    const handleChange = (e: MediaQueryListEvent) => {
      setIsHighContrast(e.matches)
    }
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const announceMessage = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (announcerRef.current) {
      // Clear previous message
      announcerRef.current.textContent = ''
      
      // Set new message after a brief delay to ensure screen readers pick it up
      setTimeout(() => {
        if (announcerRef.current) {
          announcerRef.current.textContent = message
          announcerRef.current.setAttribute('aria-live', priority)
        }
      }, 100)
    }
  }

  return (
    <AccessibilityContext.Provider
      value={{
        announceMessage,
        isReducedMotion,
        isHighContrast,
        fontSize,
        setFontSize
      }}
    >
      <div
        className={cn(
          'font-size-root',
          fontSize === 'small' && 'text-sm',
          fontSize === 'large' && 'text-lg',
          isHighContrast && 'high-contrast',
          isReducedMotion && 'reduced-motion'
        )}
      >
        {children}
        
        {/* Screen reader announcer */}
        <div
          ref={announcerRef}
          className="sr-only"
          aria-live="polite"
          aria-atomic="true"
        />
      </div>
    </AccessibilityContext.Provider>
  )
}

// Skip Link Component
interface SkipLinkProps {
  href: string
  children: ReactNode
  className?: string
}

export const SkipLink: React.FC<SkipLinkProps> = ({ 
  href, 
  children, 
  className 
}) => {
  return (
    <a
      href={href}
      className={cn(
        'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4',
        'bg-primary text-primary-foreground px-4 py-2 rounded-md',
        'font-medium z-50 focus:outline-none focus:ring-2 focus:ring-offset-2',
        className
      )}
    >
      {children}
    </a>
  )
}

// Landmark Component for better navigation
interface LandmarkProps {
  role?: 'main' | 'navigation' | 'banner' | 'contentinfo' | 'complementary' | 'region'
  'aria-label'?: string
  'aria-labelledby'?: string
  children: ReactNode
  className?: string
}

export const Landmark: React.FC<LandmarkProps> = ({
  role = 'region',
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  children,
  className
}) => {
  const Tag = role === 'main' ? 'main' : 
             role === 'navigation' ? 'nav' : 
             role === 'banner' ? 'header' :
             role === 'contentinfo' ? 'footer' : 'section'

  return (
    <Tag
      role={role}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className={className}
    >
      {children}
    </Tag>
  )
}

// Focus Trap Component
interface FocusTrapProps {
  active: boolean
  children: ReactNode
  restoreFocus?: boolean
  className?: string
}

export const FocusTrap: React.FC<FocusTrapProps> = ({
  active,
  children,
  restoreFocus = true,
  className
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const previousActiveElementRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!active) return

    // Store the previously focused element
    previousActiveElementRef.current = document.activeElement as HTMLElement

    const container = containerRef.current
    if (!container) return

    // Get all focusable elements
    const getFocusableElements = (): HTMLElement[] => {
      const selector = [
        'button:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        'a[href]',
        '[tabindex]:not([tabindex="-1"])',
        '[contenteditable="true"]'
      ].join(', ')

      return Array.from(container.querySelectorAll(selector))
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      const focusableElements = getFocusableElements()
      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    // Focus the first element
    const focusableElements = getFocusableElements()
    if (focusableElements.length > 0) {
      focusableElements[0].focus()
    }

    // Add event listener
    container.addEventListener('keydown', handleKeyDown as any)

    return () => {
      container.removeEventListener('keydown', handleKeyDown as any)
      
      // Restore focus when trap is deactivated
      if (restoreFocus && previousActiveElementRef.current) {
        previousActiveElementRef.current.focus()
      }
    }
  }, [active, restoreFocus])

  if (!active) {
    return <>{children}</>
  }

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  )
}

// Accessible Button Component
interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: ReactNode
}

export const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  className,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'
  
  const variantClasses = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-secondary',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground focus:ring-primary',
    ghost: 'hover:bg-accent hover:text-accent-foreground focus:ring-primary',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:ring-destructive'
  }
  
  const sizeClasses = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4 py-2',
    lg: 'h-11 px-8 text-lg'
  }

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  )
}

// Accessible Form Field Component
interface AccessibleFieldProps {
  id: string
  label: string
  description?: string
  error?: string
  required?: boolean
  children: ReactNode
  className?: string
}

export const AccessibleField: React.FC<AccessibleFieldProps> = ({
  id,
  label,
  description,
  error,
  required = false,
  children,
  className
}) => {
  const descriptionId = description ? `${id}-description` : undefined
  const errorId = error ? `${id}-error` : undefined

  return (
    <div className={cn('space-y-2', className)}>
      <label
        htmlFor={id}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
        {required && (
          <span className="text-destructive ml-1" aria-label="required">
            *
          </span>
        )}
      </label>
      
      {description && (
        <p id={descriptionId} className="text-sm text-muted-foreground">
          {description}
        </p>
      )}
      
      <div>
        {React.cloneElement(children as React.ReactElement, {
          id,
          'aria-describedby': [descriptionId, errorId].filter(Boolean).join(' ') || undefined,
          'aria-invalid': error ? 'true' : undefined,
          'aria-required': required
        })}
      </div>
      
      {error && (
        <p
          id={errorId}
          className="text-sm text-destructive"
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}
    </div>
  )
}

// Live Region for dynamic content updates
interface LiveRegionProps {
  children: ReactNode
  priority?: 'polite' | 'assertive'
  atomic?: boolean
  className?: string
}

export const LiveRegion: React.FC<LiveRegionProps> = ({
  children,
  priority = 'polite',
  atomic = true,
  className
}) => {
  return (
    <div
      className={className}
      aria-live={priority}
      aria-atomic={atomic}
      role="status"
    >
      {children}
    </div>
  )
}

// Progress Indicator
interface ProgressIndicatorProps {
  value: number
  max?: number
  label?: string
  description?: string
  className?: string
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  value,
  max = 100,
  label,
  description,
  className
}) => {
  const percentage = Math.round((value / max) * 100)

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <div className="flex justify-between text-sm">
          <span>{label}</span>
          <span>{percentage}%</span>
        </div>
      )}
      
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || 'Progress'}
        className="w-full bg-secondary rounded-full h-2"
      >
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  )
}

// Keyboard Navigation Helper
export const useKeyboardNavigation = (
  items: string[],
  onSelect: (item: string, index: number) => void
) => {
  const [activeIndex, setActiveIndex] = useState(-1)

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActiveIndex(prev => (prev + 1) % items.length)
        break
      case 'ArrowUp':
        e.preventDefault()
        setActiveIndex(prev => prev <= 0 ? items.length - 1 : prev - 1)
        break
      case 'Enter':
      case ' ':
        if (activeIndex >= 0) {
          e.preventDefault()
          onSelect(items[activeIndex], activeIndex)
        }
        break
      case 'Escape':
        setActiveIndex(-1)
        break
    }
  }

  const resetActiveIndex = () => setActiveIndex(-1)

  return {
    activeIndex,
    handleKeyDown,
    resetActiveIndex,
    setActiveIndex
  }
}

// Screen Reader Only Content
interface ScreenReaderOnlyProps {
  children: ReactNode
  className?: string
}

export const ScreenReaderOnly: React.FC<ScreenReaderOnlyProps> = ({
  children,
  className
}) => {
  return (
    <span className={cn('sr-only', className)}>
      {children}
    </span>
  )
}

// High Contrast Mode Toggle
export const HighContrastToggle: React.FC = () => {
  const [isHighContrast, setIsHighContrast] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)')
    setIsHighContrast(mediaQuery.matches)
    
    const handleChange = (e: MediaQueryListEvent) => {
      setIsHighContrast(e.matches)
    }
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const toggleHighContrast = () => {
    document.documentElement.classList.toggle('high-contrast')
    setIsHighContrast(!isHighContrast)
  }

  return (
    <AccessibleButton
      onClick={toggleHighContrast}
      variant="outline"
      size="sm"
      aria-pressed={isHighContrast}
      aria-label={`${isHighContrast ? 'Disable' : 'Enable'} high contrast mode`}
    >
      {isHighContrast ? 'Disable High Contrast' : 'Enable High Contrast'}
    </AccessibleButton>
  )
}

// Font Size Controls
export const FontSizeControls: React.FC = () => {
  const { fontSize, setFontSize } = useAccessibility()

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium">Font Size:</span>
      <div className="flex space-x-1">
        {(['small', 'medium', 'large'] as const).map((size) => (
          <AccessibleButton
            key={size}
            onClick={() => setFontSize(size)}
            variant={fontSize === size ? 'primary' : 'outline'}
            size="sm"
            aria-pressed={fontSize === size}
            aria-label={`Set font size to ${size}`}
          >
            {size === 'small' ? 'A' : size === 'medium' ? 'A' : 'A'}
          </AccessibleButton>
        ))}
      </div>
    </div>
  )
}

