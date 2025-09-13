'use client'

import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  ChevronRight,
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
  Star,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  Search,
  SortAsc,
  Eye,
  Edit,
  Trash2,
  Download,
  Share,
  Heart,
  MessageCircle,
  Bookmark,
  ExternalLink
} from 'lucide-react'

// Modern Metric Card with trend indicator
interface MetricCardProps {
  title: string
  value: string | number
  description?: string
  trend?: {
    value: number
    period: string
    positive?: boolean
  }
  icon?: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
  className?: string
}

export function MetricCard({
  title,
  value,
  description,
  trend,
  icon,
  variant = 'default',
  className
}: MetricCardProps) {
  const variantStyles = {
    default: 'bg-card border-border',
    success: 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800',
    warning: 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800',
    danger: 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800',
    info: 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800'
  }

  return (
    <Card className={cn('relative overflow-hidden', variantStyles[variant], className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold text-foreground">{value}</p>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
            {trend && (
              <div className="flex items-center space-x-2">
                {trend.positive ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
                <span className={cn(
                  'text-sm font-medium',
                  trend.positive ? 'text-green-600' : 'text-red-600'
                )}>
                  {trend.positive ? '+' : ''}{trend.value}%
                </span>
                <span className="text-sm text-muted-foreground">{trend.period}</span>
              </div>
            )}
          </div>
          {icon && (
            <div className="p-3 rounded-full bg-primary/10">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Interactive Property Card
interface PropertyCardProps {
  property: {
    id: string
    name: string
    address: string
    image?: string
    type: string
    units: number
    occupancy: number
    monthlyRevenue: number
    rating?: number
    status: 'active' | 'maintenance' | 'inactive'
  }
  onView?: (id: string) => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  className?: string
}

export function PropertyCard({ property, onView, onEdit, onDelete, className }: PropertyCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const occupancyPercentage = (property.occupancy / property.units) * 100

  const statusStyles = {
    active: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100',
    maintenance: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100',
    inactive: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100'
  }

  const statusText = {
    active: 'Aktif',
    maintenance: 'Bakımda',
    inactive: 'Pasif'
  }

  return (
    <Card className={cn('group hover:shadow-lg transition-all duration-300 overflow-hidden', className)}>
      {/* Image Header */}
      <div className="relative h-48 bg-muted overflow-hidden">
        {property.image ? (
          <img 
            src={property.image} 
            alt={property.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">Fotoğraf Yok</p>
            </div>
          </div>
        )}
        
        {/* Overlay Actions */}
        <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            variant="secondary"
            className="w-8 h-8 p-0"
            onClick={() => setIsBookmarked(!isBookmarked)}
          >
            <Bookmark className={cn('w-4 h-4', isBookmarked && 'fill-current')} />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="w-8 h-8 p-0"
            onClick={() => onView?.(property.id)}
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <Badge className={statusStyles[property.status]}>
            {statusText[property.status]}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-4 space-y-4">
        {/* Header */}
        <div>
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-foreground line-clamp-1">{property.name}</h3>
            {property.rating && (
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{property.rating}</span>
              </div>
            )}
          </div>
          <p className="text-sm text-muted-foreground flex items-center">
            <MapPin className="w-3 h-3 mr-1" />
            {property.address}
          </p>
          <p className="text-xs text-muted-foreground mt-1">{property.type}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-lg font-semibold text-foreground">{property.units}</p>
            <p className="text-xs text-muted-foreground">Daire</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">{property.occupancy}</p>
            <p className="text-xs text-muted-foreground">Dolu</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">₺{property.monthlyRevenue.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Aylık</p>
          </div>
        </div>

        {/* Occupancy Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Doluluk Oranı</span>
            <span className="font-medium">{occupancyPercentage.toFixed(0)}%</span>
          </div>
          <Progress value={occupancyPercentage} className="h-2" />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
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
      </CardContent>
    </Card>
  )
}

// Modern Data Table with advanced features
interface Column<T> {
  key: keyof T
  label: string
  sortable?: boolean
  filterable?: boolean
  render?: (value: any, row: T) => React.ReactNode
  width?: string
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  searchable?: boolean
  filterable?: boolean
  exportable?: boolean
  selectable?: boolean
  onRowClick?: (row: T) => void
  onSelectionChange?: (selectedRows: T[]) => void
  className?: string
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchable = true,
  filterable = true,
  exportable = true,
  selectable = false,
  onRowClick,
  onSelectionChange,
  className
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [selectedRows, setSelectedRows] = useState<T[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Filter and sort data
  const filteredData = React.useMemo(() => {
    let filtered = data

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(row =>
        Object.values(row).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }

    // Sort
    if (sortColumn) {
      filtered.sort((a, b) => {
        const aVal = a[sortColumn]
        const bVal = b[sortColumn]
        
        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
        return 0
      })
    }

    return filtered
  }, [data, searchTerm, sortColumn, sortDirection])

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage)

  const handleSort = (column: keyof T) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const handleSelectAll = () => {
    if (selectedRows.length === paginatedData.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(paginatedData)
    }
    onSelectionChange?.(selectedRows)
  }

  const handleSelectRow = (row: T) => {
    const newSelection = selectedRows.includes(row)
      ? selectedRows.filter(r => r !== row)
      : [...selectedRows, row]
    
    setSelectedRows(newSelection)
    onSelectionChange?.(newSelection)
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-2">
          {searchable && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10 w-64"
              />
            </div>
          )}
          {filterable && (
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filtrele
            </Button>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {selectedRows.length > 0 && (
            <Badge variant="secondary">
              {selectedRows.length} seçili
            </Badge>
          )}
          {exportable && (
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Dışa Aktar
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="w-full">
          <thead>
            <tr className="table-header">
              {selectable && (
                <th className="w-12 p-4">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === paginatedData.length && paginatedData.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-border"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th 
                  key={String(column.key)} 
                  className={cn(
                    'text-left font-medium text-muted-foreground p-4',
                    column.sortable && 'cursor-pointer hover:text-foreground',
                    column.width && `w-[${column.width}]`
                  )}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center space-x-2">
                    <span>{column.label}</span>
                    {column.sortable && (
                      <SortAsc className={cn(
                        'w-4 h-4 transition-transform',
                        sortColumn === column.key && sortDirection === 'desc' && 'rotate-180'
                      )} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, index) => (
              <tr 
                key={index}
                className={cn(
                  'table-row cursor-pointer',
                  selectedRows.includes(row) && 'bg-primary/5'
                )}
                onClick={() => onRowClick?.(row)}
              >
                {selectable && (
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(row)}
                      onChange={() => handleSelectRow(row)}
                      onClick={(e) => e.stopPropagation()}
                      className="rounded border-border"
                    />
                  </td>
                )}
                {columns.map((column) => (
                  <td key={String(column.key)} className="p-4">
                    {column.render 
                      ? column.render(row[column.key], row)
                      : String(row[column.key])
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {paginatedData.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>Veri bulunamadı</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredData.length)} / {filteredData.length} sonuç
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Önceki
            </Button>
            <span className="text-sm text-muted-foreground">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Sonraki
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

// Activity Feed Component
interface Activity {
  id: string
  type: 'maintenance' | 'payment' | 'lease' | 'message' | 'system'
  title: string
  description: string
  timestamp: string
  user?: {
    name: string
    avatar?: string
  }
  metadata?: Record<string, any>
}

interface ActivityFeedProps {
  activities: Activity[]
  className?: string
}

export function ActivityFeed({ activities, className }: ActivityFeedProps) {
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'maintenance':
        return <Activity className="w-4 h-4 text-blue-600" />
      case 'payment':
        return <DollarSign className="w-4 h-4 text-green-600" />
      case 'lease':
        return <Users className="w-4 h-4 text-purple-600" />
      case 'message':
        return <MessageCircle className="w-4 h-4 text-orange-600" />
      case 'system':
        return <AlertTriangle className="w-4 h-4 text-red-600" />
      default:
        return <Activity className="w-4 h-4 text-gray-600" />
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return 'Az önce'
    if (diffInHours < 24) return `${diffInHours} saat önce`
    if (diffInHours < 48) return 'Dün'
    return date.toLocaleDateString('tr-TR')
  }

  return (
    <div className={cn('space-y-4', className)}>
      {activities.map((activity, index) => (
        <div key={activity.id} className="flex space-x-4">
          {/* Timeline */}
          <div className="relative flex flex-col items-center">
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
              {getActivityIcon(activity.type)}
            </div>
            {index < activities.length - 1 && (
              <div className="w-0.5 h-8 bg-border mt-2" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-foreground">{activity.title}</h4>
              <time className="text-xs text-muted-foreground">
                {formatTimestamp(activity.timestamp)}
              </time>
            </div>
            <p className="text-sm text-muted-foreground">{activity.description}</p>
            {activity.user && (
              <div className="flex items-center space-x-2 mt-2">
                <div className="w-4 h-4 bg-muted rounded-full flex items-center justify-center">
                  <Users className="w-2 h-2" />
                </div>
                <span className="text-xs text-muted-foreground">{activity.user.name}</span>
              </div>
            )}
          </div>
        </div>
      ))}

      {activities.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Henüz aktivite yok</p>
        </div>
      )}
    </div>
  )
}

// Modern Progress Ring Component
interface ProgressRingProps {
  progress: number
  size?: 'sm' | 'md' | 'lg'
  strokeWidth?: number
  color?: string
  backgroundColor?: string
  children?: React.ReactNode
  className?: string
}

export function ProgressRing({
  progress,
  size = 'md',
  strokeWidth,
  color = 'rgb(var(--primary))',
  backgroundColor = 'rgb(var(--muted))',
  children,
  className
}: ProgressRingProps) {
  const sizes = {
    sm: { diameter: 60, defaultStroke: 4 },
    md: { diameter: 80, defaultStroke: 6 },
    lg: { diameter: 120, defaultStroke: 8 }
  }

  const { diameter, defaultStroke } = sizes[size]
  const stroke = strokeWidth || defaultStroke
  const radius = (diameter - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg
        width={diameter}
        height={diameter}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={diameter / 2}
          cy={diameter / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={stroke}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={diameter / 2}
          cy={diameter / 2}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-300 ease-in-out"
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  )
}

