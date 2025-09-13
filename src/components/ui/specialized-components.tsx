'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from './core-components'
import { Badge, StatusDot, Avatar } from './core-components'
import { 
  User, 
  CreditCard, 
  Phone, 
  Mail, 
  MessageCircle, 
  MoreHorizontal,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Wrench,
  Droplets,
  Zap,
  Building2,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Eye,
  Edit,
  Trash2,
  Plus,
  Minus,
  ChevronRight,
  ChevronDown,
  MapPin,
  Home,
  Users,
  FileText,
  Bell,
  Settings
} from 'lucide-react'

// TenantCard Component
interface TenantCardProps {
  tenant: {
    id: string
    name: string
    unit: string
    avatar?: string
    phone?: string
    email?: string
    paymentStatus: 'current' | 'overdue' | 'pending' | 'paid'
    leaseEndDate?: string
    moveInDate?: string
    rentAmount?: number
    notes?: string
  }
  onCall?: (phone: string) => void
  onEmail?: (email: string) => void
  onMessage?: (tenantId: string) => void
  onView?: (tenantId: string) => void
  onEdit?: (tenantId: string) => void
  onDelete?: (tenantId: string) => void
  className?: string
  compact?: boolean
}

export function TenantCard({ 
  tenant, 
  onCall, 
  onEmail, 
  onMessage, 
  onView, 
  onEdit, 
  onDelete,
  className,
  compact = false
}: TenantCardProps) {
  const paymentStatusConfig = {
    current: { 
      label: 'Güncel', 
      color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
      icon: CheckCircle
    },
    overdue: { 
      label: 'Gecikmiş', 
      color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
      icon: AlertTriangle
    },
    pending: { 
      label: 'Beklemede', 
      color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
      icon: Clock
    },
    paid: { 
      label: 'Ödendi', 
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
      icon: CheckCircle
    }
  }

  const status = paymentStatusConfig[tenant.paymentStatus]
  const StatusIcon = status.icon

  if (compact) {
    return (
      <div className={cn("flex items-center space-x-3 p-3 rounded-lg border bg-card hover:shadow-md transition-shadow", className)}>
        <Avatar src={tenant.avatar} fallback={tenant.name.split(' ').map(n => n[0]).join('')} size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-foreground truncate">{tenant.name}</h4>
              <p className="text-sm text-muted-foreground">Daire {tenant.unit}</p>
            </div>
            <span className={cn("inline-flex items-center rounded-full px-2 py-1 text-xs font-medium", status.color)}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {status.label}
            </span>
          </div>
        </div>
        <div className="flex space-x-1">
          {tenant.phone && (
            <Button variant="ghost" size="icon" onClick={() => onCall?.(tenant.phone!)}>
              <Phone className="w-4 h-4" />
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={() => onView?.(tenant.id)}>
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("rounded-lg border bg-card p-4 hover:shadow-md transition-all duration-200", className)}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Avatar 
            src={tenant.avatar} 
            fallback={tenant.name.split(' ').map(n => n[0]).join('')} 
            size="lg" 
          />
          <div>
            <h3 className="font-semibold text-foreground">{tenant.name}</h3>
            <p className="text-sm text-muted-foreground flex items-center">
              <Home className="w-3 h-3 mr-1" />
              Daire {tenant.unit}
            </p>
          </div>
        </div>
        
        <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", status.color)}>
          <StatusIcon className="w-3 h-3 mr-1" />
          {status.label}
        </span>
      </div>

      {/* Details */}
      <div className="space-y-3 mb-4">
        {tenant.rentAmount && (
          <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
            <span className="text-sm text-muted-foreground">Aylık Kira</span>
            <span className="font-semibold text-foreground">₺{tenant.rentAmount.toLocaleString()}</span>
          </div>
        )}
        
        {tenant.leaseEndDate && (
          <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
            <span className="text-sm text-muted-foreground">Sözleşme Bitişi</span>
            <span className="text-sm font-medium text-foreground">{tenant.leaseEndDate}</span>
          </div>
        )}

        {tenant.notes && (
          <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <p className="text-xs text-blue-700 dark:text-blue-300">{tenant.notes}</p>
          </div>
        )}
      </div>

      {/* Contact Info */}
      <div className="flex items-center space-x-2 mb-4">
        {tenant.phone && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Phone className="w-3 h-3 mr-1" />
            {tenant.phone}
          </div>
        )}
        {tenant.email && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Mail className="w-3 h-3 mr-1" />
            {tenant.email}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          {tenant.phone && (
            <Button variant="outline" size="sm" onClick={() => onCall?.(tenant.phone!)}>
              <Phone className="w-4 h-4 mr-1" />
              Ara
            </Button>
          )}
          {tenant.email && (
            <Button variant="outline" size="sm" onClick={() => onEmail?.(tenant.email!)}>
              <Mail className="w-4 h-4 mr-1" />
              E-posta
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => onMessage?.(tenant.id)}>
            <MessageCircle className="w-4 h-4 mr-1" />
            Mesaj
          </Button>
        </div>
        
        <div className="flex space-x-1">
          <Button variant="ghost" size="sm" onClick={() => onView?.(tenant.id)}>
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onEdit?.(tenant.id)}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete?.(tenant.id)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

// IssueCard Component
interface IssueCardProps {
  issue: {
    id: string
    title: string
    description: string
    category: 'plumbing' | 'electrical' | 'repair' | 'payment' | 'other'
    priority: 'low' | 'medium' | 'high' | 'urgent'
    status: 'open' | 'in_progress' | 'resolved' | 'cancelled'
    assignedTo?: {
      id: string
      name: string
      avatar?: string
      role: string
    }
    progress?: number
    createdAt: string
    updatedAt?: string
    estimatedCost?: number
    estimatedDuration?: string
    images?: string[]
  }
  onView?: (issueId: string) => void
  onEdit?: (issueId: string) => void
  onAssign?: (issueId: string) => void
  onStatusChange?: (issueId: string, status: string) => void
  className?: string
  compact?: boolean
}

export function IssueCard({ 
  issue, 
  onView, 
  onEdit, 
  onAssign, 
  onStatusChange,
  className,
  compact = false
}: IssueCardProps) {
  const categoryConfig = {
    plumbing: { 
      icon: Droplets, 
      color: 'text-blue-600', 
      bgColor: 'bg-blue-50 dark:bg-blue-950',
      label: 'Su Tesisatı'
    },
    electrical: { 
      icon: Zap, 
      color: 'text-yellow-600', 
      bgColor: 'bg-yellow-50 dark:bg-yellow-950',
      label: 'Elektrik'
    },
    repair: { 
      icon: Wrench, 
      color: 'text-green-600', 
      bgColor: 'bg-green-50 dark:bg-green-950',
      label: 'Tamir'
    },
    payment: { 
      icon: CreditCard, 
      color: 'text-purple-600', 
      bgColor: 'bg-purple-50 dark:bg-purple-950',
      label: 'Ödeme'
    },
    other: { 
      icon: Building2, 
      color: 'text-gray-600', 
      bgColor: 'bg-gray-50 dark:bg-gray-950',
      label: 'Diğer'
    }
  }

  const priorityConfig = {
    low: { color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-900', label: 'Düşük' },
    medium: { color: 'text-yellow-600', bgColor: 'bg-yellow-100 dark:bg-yellow-900', label: 'Orta' },
    high: { color: 'text-orange-600', bgColor: 'bg-orange-100 dark:bg-orange-900', label: 'Yüksek' },
    urgent: { color: 'text-red-600', bgColor: 'bg-red-100 dark:bg-red-900', label: 'Acil' }
  }

  const statusConfig = {
    open: { color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900', label: 'Açık' },
    in_progress: { color: 'text-yellow-600', bgColor: 'bg-yellow-100 dark:bg-yellow-900', label: 'Devam Ediyor' },
    resolved: { color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-900', label: 'Çözüldü' },
    cancelled: { color: 'text-red-600', bgColor: 'bg-red-100 dark:bg-red-900', label: 'İptal' }
  }

  const category = categoryConfig[issue.category]
  const priority = priorityConfig[issue.priority]
  const status = statusConfig[issue.status]
  const CategoryIcon = category.icon

  if (compact) {
    return (
      <div className={cn("p-3 rounded-lg border bg-card hover:shadow-md transition-shadow", className)}>
        <div className="flex items-start space-x-3">
          <div className={cn("p-2 rounded-lg", category.bgColor)}>
            <CategoryIcon className={cn("w-4 h-4", category.color)} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-medium text-foreground truncate">{issue.title}</h4>
              <span className={cn("inline-flex items-center rounded-full px-2 py-1 text-xs font-medium", priority.bgColor, priority.color)}>
                {priority.label}
              </span>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">{issue.description}</p>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center space-x-2">
                {issue.assignedTo && (
                  <div className="flex items-center space-x-1">
                    <Avatar src={issue.assignedTo.avatar} fallback={issue.assignedTo.name.split(' ').map(n => n[0]).join('')} size="sm" />
                    <span className="text-xs text-muted-foreground">{issue.assignedTo.name}</span>
                  </div>
                )}
              </div>
              <span className="text-xs text-muted-foreground">{issue.createdAt}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("rounded-lg border bg-card p-4 hover:shadow-md transition-all duration-200", className)}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={cn("p-3 rounded-lg", category.bgColor)}>
            <CategoryIcon className={cn("w-5 h-5", category.color)} />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{issue.title}</h3>
            <p className="text-sm text-muted-foreground">{category.label}</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <span className={cn("inline-flex items-center rounded-full px-2 py-1 text-xs font-medium", priority.bgColor, priority.color)}>
            {priority.label}
          </span>
          <span className={cn("inline-flex items-center rounded-full px-2 py-1 text-xs font-medium", status.bgColor, status.color)}>
            {status.label}
          </span>
        </div>
      </div>

      {/* Description */}
      <div className="mb-4">
        <p className="text-sm text-muted-foreground line-clamp-3">{issue.description}</p>
      </div>

      {/* Progress */}
      {issue.progress !== undefined && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">İlerleme</span>
            <span className="text-sm text-muted-foreground">{issue.progress}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${issue.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Assigned To */}
      {issue.assignedTo && (
        <div className="flex items-center space-x-3 mb-4 p-3 bg-muted/50 rounded-lg">
          <Avatar 
            src={issue.assignedTo.avatar} 
            fallback={issue.assignedTo.name.split(' ').map(n => n[0]).join('')} 
            size="md" 
          />
          <div>
            <p className="font-medium text-foreground">{issue.assignedTo.name}</p>
            <p className="text-sm text-muted-foreground">{issue.assignedTo.role}</p>
          </div>
        </div>
      )}

      {/* Details */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {issue.estimatedCost && (
          <div className="p-2 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground">Tahmini Maliyet</p>
            <p className="font-semibold text-foreground">₺{issue.estimatedCost.toLocaleString()}</p>
          </div>
        )}
        {issue.estimatedDuration && (
          <div className="p-2 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground">Tahmini Süre</p>
            <p className="font-semibold text-foreground">{issue.estimatedDuration}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>{issue.createdAt}</span>
          </div>
          {issue.updatedAt && (
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{issue.updatedAt}</span>
            </div>
          )}
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => onView?.(issue.id)}>
            <Eye className="w-4 h-4 mr-1" />
            Görüntüle
          </Button>
          <Button variant="outline" size="sm" onClick={() => onEdit?.(issue.id)}>
            <Edit className="w-4 h-4 mr-1" />
            Düzenle
          </Button>
          {!issue.assignedTo && (
            <Button variant="outline" size="sm" onClick={() => onAssign?.(issue.id)}>
              <User className="w-4 h-4 mr-1" />
              Ata
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

// PaymentTimeline Component
interface PaymentTimelineProps {
  payments: {
    id: string
    tenantId: string
    tenantName: string
    amount: number
    dueDate: string
    paidDate?: string
    status: 'paid' | 'overdue' | 'pending' | 'partial'
    method?: 'cash' | 'transfer' | 'card' | 'check'
    notes?: string
  }[]
  onPaymentClick?: (paymentId: string) => void
  onTenantClick?: (tenantId: string) => void
  className?: string
  viewMode?: 'month' | 'week' | 'day'
}

export function PaymentTimeline({ 
  payments, 
  onPaymentClick, 
  onTenantClick,
  className,
  viewMode = 'month'
}: PaymentTimelineProps) {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [hoveredPayment, setHoveredPayment] = useState<string | null>(null)

  const statusConfig = {
    paid: { 
      color: 'bg-green-500', 
      textColor: 'text-green-600',
      label: 'Ödendi',
      icon: CheckCircle
    },
    overdue: { 
      color: 'bg-red-500', 
      textColor: 'text-red-600',
      label: 'Gecikmiş',
      icon: AlertTriangle
    },
    pending: { 
      color: 'bg-yellow-500', 
      textColor: 'text-yellow-600',
      label: 'Beklemede',
      icon: Clock
    },
    partial: { 
      color: 'bg-orange-500', 
      textColor: 'text-orange-600',
      label: 'Kısmi',
      icon: Minus
    }
  }

  const methodConfig = {
    cash: { icon: DollarSign, label: 'Nakit' },
    transfer: { icon: CreditCard, label: 'Havale' },
    card: { icon: CreditCard, label: 'Kart' },
    check: { icon: FileText, label: 'Çek' }
  }

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = selectedDate.getFullYear()
    const month = selectedDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())
    
    const days = []
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      days.push(date)
    }
    return days
  }

  const calendarDays = generateCalendarDays()
  const today = new Date()

  const getPaymentsForDate = (date: Date) => {
    return payments.filter(payment => {
      const dueDate = new Date(payment.dueDate)
      return dueDate.toDateString() === date.toDateString()
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className={cn("rounded-lg border bg-card p-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Ödeme Takvimi</h3>
          <p className="text-sm text-muted-foreground">
            {selectedDate.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1))}
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setSelectedDate(new Date())}
          >
            Bugün
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1))}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((date, index) => {
          const isCurrentMonth = date.getMonth() === selectedDate.getMonth()
          const isToday = date.toDateString() === today.toDateString()
          const dayPayments = getPaymentsForDate(date)
          
          return (
            <div
              key={index}
              className={cn(
                "min-h-[80px] p-1 border rounded-lg transition-colors",
                isCurrentMonth ? "bg-background" : "bg-muted/30",
                isToday && "ring-2 ring-primary ring-offset-1"
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={cn(
                  "text-xs font-medium",
                  isCurrentMonth ? "text-foreground" : "text-muted-foreground",
                  isToday && "text-primary font-bold"
                )}>
                  {date.getDate()}
                </span>
                {dayPayments.length > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {dayPayments.length}
                  </span>
                )}
              </div>
              
              <div className="space-y-1">
                {dayPayments.slice(0, 3).map(payment => {
                  const status = statusConfig[payment.status]
                  const StatusIcon = status.icon
                  
                  return (
                    <div
                      key={payment.id}
                      className={cn(
                        "p-1 rounded text-xs cursor-pointer transition-all hover:scale-105",
                        status.color,
                        "text-white"
                      )}
                      onClick={() => onPaymentClick?.(payment.id)}
                      onMouseEnter={() => setHoveredPayment(payment.id)}
                      onMouseLeave={() => setHoveredPayment(null)}
                    >
                      <div className="flex items-center space-x-1">
                        <StatusIcon className="w-2 h-2" />
                        <span className="truncate">{payment.tenantName}</span>
                      </div>
                      <div className="text-xs opacity-90">
                        {formatCurrency(payment.amount)}
                      </div>
                    </div>
                  )
                })}
                
                {dayPayments.length > 3 && (
                  <div className="text-xs text-muted-foreground text-center">
                    +{dayPayments.length - 3} daha
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t">
        <h4 className="text-sm font-medium text-foreground mb-3">Durum Göstergeleri</h4>
        <div className="flex flex-wrap gap-4">
          {Object.entries(statusConfig).map(([status, config]) => {
            const StatusIcon = config.icon
            return (
              <div key={status} className="flex items-center space-x-2">
                <div className={cn("w-3 h-3 rounded-full", config.color)} />
                <StatusIcon className="w-3 h-3 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{config.label}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Payment Details Tooltip */}
      {hoveredPayment && (
        <div className="fixed z-50 p-3 bg-popover border rounded-lg shadow-lg">
          {(() => {
            const payment = payments.find(p => p.id === hoveredPayment)
            if (!payment) return null
            
            const status = statusConfig[payment.status]
            const method = payment.method ? methodConfig[payment.method] : null
            const StatusIcon = status.icon
            
            return (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <StatusIcon className={cn("w-4 h-4", status.textColor)} />
                  <span className="font-medium">{payment.tenantName}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>Tutar: {formatCurrency(payment.amount)}</p>
                  <p>Vade: {payment.dueDate}</p>
                  {payment.paidDate && <p>Ödeme: {payment.paidDate}</p>}
                  {method && <p>Yöntem: {method.label}</p>}
                  {payment.notes && <p>Not: {payment.notes}</p>}
                </div>
              </div>
            )
          })()}
        </div>
      )}
    </div>
  )
}

// Export all components
export {
  TenantCard,
  IssueCard,
  PaymentTimeline
}

