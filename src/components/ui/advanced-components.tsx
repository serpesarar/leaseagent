'use client'

import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Button } from './core-components'
import { 
  ChevronDown, 
  ChevronUp, 
  Search, 
  X, 
  Check, 
  Plus,
  Minus,
  Star,
  Heart,
  Share2,
  Download,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Calendar,
  Clock,
  User,
  MapPin,
  Phone,
  Mail,
  ExternalLink
} from 'lucide-react'

// Dropdown Component
interface DropdownProps {
  trigger: React.ReactNode
  children: React.ReactNode
  align?: 'start' | 'center' | 'end'
  side?: 'top' | 'right' | 'bottom' | 'left'
  className?: string
}

export function Dropdown({ trigger, children, align = 'start', side = 'bottom', className }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={dropdownRef} className="relative inline-block">
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      
      {isOpen && (
        <div
          className={cn(
            "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
            side === 'top' && 'bottom-full mb-1',
            side === 'bottom' && 'top-full mt-1',
            side === 'left' && 'right-full mr-1',
            side === 'right' && 'left-full ml-1',
            align === 'start' && 'left-0',
            align === 'center' && 'left-1/2 -translate-x-1/2',
            align === 'end' && 'right-0',
            className
          )}
        >
          {children}
        </div>
      )}
    </div>
  )
}

// DropdownItem Component
interface DropdownItemProps {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  className?: string
}

export function DropdownItem({ children, onClick, disabled, className }: DropdownItemProps) {
  return (
    <div
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        "focus:bg-accent focus:text-accent-foreground",
        disabled && "pointer-events-none opacity-50",
        className
      )}
      onClick={disabled ? undefined : onClick}
    >
      {children}
    </div>
  )
}

// SearchInput Component
interface SearchInputProps {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  onSearch?: (value: string) => void
  className?: string
  showClear?: boolean
}

export function SearchInput({ 
  placeholder = "Ara...", 
  value = "", 
  onChange, 
  onSearch, 
  className,
  showClear = true 
}: SearchInputProps) {
  const [searchValue, setSearchValue] = useState(value)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setSearchValue(newValue)
    onChange?.(newValue)
  }

  const handleClear = () => {
    setSearchValue("")
    onChange?.("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch?.(searchValue)
    }
  }

  return (
    <div className={cn("relative", className)}>
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
        <Search className="h-4 w-4" />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={searchValue}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        className="w-full rounded-md border border-input bg-background pl-10 pr-10 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      />
      {showClear && searchValue && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

// Counter Component
interface CounterProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Counter({ 
  value, 
  onChange, 
  min = 0, 
  max = 100, 
  step = 1, 
  size = 'md',
  className 
}: CounterProps) {
  const handleIncrement = () => {
    if (value + step <= max) {
      onChange(value + step)
    }
  }

  const handleDecrement = () => {
    if (value - step >= min) {
      onChange(value - step)
    }
  }

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10", 
    lg: "h-12 w-12"
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Button
        variant="outline"
        size="icon"
        onClick={handleDecrement}
        disabled={value <= min}
        className={sizeClasses[size]}
      >
        <Minus className="h-4 w-4" />
      </Button>
      
      <div className="min-w-[3rem] text-center font-medium">
        {value}
      </div>
      
      <Button
        variant="outline"
        size="icon"
        onClick={handleIncrement}
        disabled={value >= max}
        className={sizeClasses[size]}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  )
}

// Rating Component
interface RatingProps {
  value: number
  onChange?: (value: number) => void
  max?: number
  size?: 'sm' | 'md' | 'lg'
  readonly?: boolean
  className?: string
}

export function Rating({ 
  value, 
  onChange, 
  max = 5, 
  size = 'md', 
  readonly = false,
  className 
}: RatingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6"
  }

  return (
    <div className={cn("flex items-center space-x-1", className)}>
      {Array.from({ length: max }, (_, index) => {
        const rating = index + 1
        const isFilled = rating <= value
        
        return (
          <button
            key={index}
            onClick={() => !readonly && onChange?.(rating)}
            disabled={readonly}
            className={cn(
              "transition-colors",
              !readonly && "hover:scale-110",
              readonly && "cursor-default"
            )}
          >
            <Star
              className={cn(
                sizeClasses[size],
                isFilled 
                  ? "fill-yellow-400 text-yellow-400" 
                  : "text-muted-foreground"
              )}
            />
          </button>
        )
      })}
    </div>
  )
}

// ActionButton Component
interface ActionButtonProps {
  icon: React.ReactNode
  label: string
  onClick: () => void
  variant?: 'default' | 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  className?: string
}

export function ActionButton({ 
  icon, 
  label, 
  onClick, 
  variant = 'default',
  size = 'md',
  disabled = false,
  className 
}: ActionButtonProps) {
  const variants = {
    default: "hover:bg-muted",
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
    danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90"
  }

  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base"
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
    >
      <span className="mr-2">{icon}</span>
      {label}
    </button>
  )
}

// QuickActions Component
interface QuickAction {
  icon: React.ReactNode
  label: string
  onClick: () => void
  variant?: 'default' | 'primary' | 'secondary'
}

interface QuickActionsProps {
  actions: QuickAction[]
  className?: string
}

export function QuickActions({ actions, className }: QuickActionsProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {actions.map((action, index) => (
        <ActionButton
          key={index}
          icon={action.icon}
          label={action.label}
          onClick={action.onClick}
          variant={action.variant}
          size="sm"
        />
      ))}
    </div>
  )
}

// PropertyCard Component
interface PropertyCardProps {
  property: {
    id: string
    name: string
    address: string
    image?: string
    price: number
    status: 'available' | 'occupied' | 'maintenance'
    rating?: number
    amenities?: string[]
  }
  onView?: (id: string) => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  className?: string
}

export function PropertyCard({ property, onView, onEdit, onDelete, className }: PropertyCardProps) {
  const statusColors = {
    available: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    occupied: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
    maintenance: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
  }

  const statusLabels = {
    available: 'Müsait',
    occupied: 'Dolu',
    maintenance: 'Bakımda'
  }

  return (
    <div className={cn("group rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all duration-200", className)}>
      {/* Image */}
      <div className="relative h-48 overflow-hidden rounded-t-lg">
        {property.image ? (
          <img 
            src={property.image} 
            alt={property.name}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="h-full w-full bg-muted flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-muted-foreground/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <MapPin className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">Fotoğraf Yok</p>
            </div>
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", statusColors[property.status])}>
            {statusLabels[property.status]}
          </span>
        </div>

        {/* Rating */}
        {property.rating && (
          <div className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm rounded-full p-1">
            <div className="flex items-center space-x-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-medium">{property.rating}</span>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Header */}
        <div>
          <h3 className="font-semibold text-foreground line-clamp-1">{property.name}</h3>
          <p className="text-sm text-muted-foreground flex items-center mt-1">
            <MapPin className="w-3 h-3 mr-1" />
            {property.address}
          </p>
        </div>

        {/* Price */}
        <div className="text-center p-3 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">Aylık Kira</p>
          <p className="text-2xl font-bold text-foreground">₺{property.price.toLocaleString()}</p>
        </div>

        {/* Amenities */}
        {property.amenities && property.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {property.amenities.slice(0, 3).map((amenity, index) => (
              <span key={index} className="inline-flex items-center rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
                {amenity}
              </span>
            ))}
            {property.amenities.length > 3 && (
              <span className="inline-flex items-center rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
                +{property.amenities.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" onClick={() => onView?.(property.id)}>
              <Eye className="w-4 h-4 mr-1" />
              Görüntüle
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onEdit?.(property.id)}>
              <Edit className="w-4 h-4 mr-1" />
              Düzenle
            </Button>
          </div>
          <Button variant="ghost" size="sm" onClick={() => onDelete?.(property.id)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

// ContactCard Component
interface ContactCardProps {
  contact: {
    id: string
    name: string
    role: string
    avatar?: string
    phone?: string
    email?: string
    company?: string
  }
  onCall?: (phone: string) => void
  onEmail?: (email: string) => void
  onView?: (id: string) => void
  className?: string
}

export function ContactCard({ contact, onCall, onEmail, onView, className }: ContactCardProps) {
  return (
    <div className={cn("rounded-lg border bg-card p-4 hover:shadow-md transition-shadow", className)}>
      <div className="flex items-start space-x-3">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
          {contact.avatar ? (
            <img src={contact.avatar} alt={contact.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            <User className="w-6 h-6 text-muted-foreground" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-foreground">{contact.name}</h4>
              <p className="text-sm text-muted-foreground">{contact.role}</p>
              {contact.company && (
                <p className="text-xs text-muted-foreground">{contact.company}</p>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={() => onView?.(contact.id)}>
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>

          {/* Contact Actions */}
          <div className="flex space-x-2 mt-3">
            {contact.phone && (
              <Button variant="outline" size="sm" onClick={() => onCall?.(contact.phone!)}>
                <Phone className="w-4 h-4 mr-1" />
                Ara
              </Button>
            )}
            {contact.email && (
              <Button variant="outline" size="sm" onClick={() => onEmail?.(contact.email!)}>
                <Mail className="w-4 h-4 mr-1" />
                E-posta
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// StatsCard Component
interface StatsCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    type: 'increase' | 'decrease'
    period: string
  }
  icon?: React.ReactNode
  className?: string
}

export function StatsCard({ title, value, change, icon, className }: StatsCardProps) {
  return (
    <div className={cn("rounded-lg border bg-card p-6", className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {change && (
            <div className="flex items-center space-x-1 mt-1">
              <span className={cn(
                "text-sm font-medium",
                change.type === 'increase' ? "text-green-600" : "text-red-600"
              )}>
                {change.type === 'increase' ? '+' : '-'}{Math.abs(change.value)}%
              </span>
              <span className="text-sm text-muted-foreground">{change.period}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="p-3 rounded-full bg-primary/10">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}

// Export all components
export {
  Dropdown,
  DropdownItem,
  SearchInput,
  Counter,
  Rating,
  ActionButton,
  QuickActions,
  PropertyCard,
  ContactCard,
  StatsCard
}

