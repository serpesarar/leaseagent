'use client'

import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'

// Base loading component with accessibility
interface LoadingSkeletonProps {
  className?: string
  'aria-label'?: string
  lines?: number
  height?: string
  width?: string
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  className,
  'aria-label': ariaLabel = 'Loading content',
  lines = 1,
  height = 'h-4',
  width = 'w-full'
}) => {
  return (
    <div 
      className={cn('space-y-2', className)}
      role="status"
      aria-label={ariaLabel}
      aria-live="polite"
    >
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton 
          key={index} 
          className={cn(height, width, index === lines - 1 && lines > 1 ? 'w-3/4' : '')} 
        />
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  )
}

// Property card skeleton
export const PropertyCardSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <Card className={cn('hover:shadow-lg transition-shadow', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <div className="flex items-center space-x-2">
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-6 w-6 rounded" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <Skeleton className="h-6 w-12 mx-auto mb-1" />
            <Skeleton className="h-3 w-16 mx-auto" />
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <Skeleton className="h-6 w-16 mx-auto mb-1" />
            <Skeleton className="h-3 w-20 mx-auto" />
          </div>
        </div>
        
        {/* Units Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
        
        {/* Amenities */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <div className="flex flex-wrap gap-1">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-5 w-12 rounded-full" />
            ))}
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center space-x-1">
            <Skeleton className="h-3 w-3" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-8 w-20 rounded" />
        </div>
      </CardContent>
    </Card>
  )
}

// Maintenance request skeleton
export const MaintenanceRequestSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-5 w-1/2" />
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Skeleton className="h-3 w-3" />
                <Skeleton className="h-3 w-24" />
              </div>
              <div className="flex items-center space-x-1">
                <Skeleton className="h-3 w-3" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </div>
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <LoadingSkeleton lines={2} />
        
        {/* Status indicators */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-20" />
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-8" />
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex space-x-2 pt-2 border-t">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-20" />
        </div>
      </CardContent>
    </Card>
  )
}

// Table skeleton
export const TableSkeleton: React.FC<{ 
  rows?: number
  columns?: number
  className?: string 
}> = ({ rows = 5, columns = 4, className }) => {
  return (
    <div className={cn('space-y-4', className)} role="status" aria-label="Loading table data">
      {/* Table header */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton key={`header-${index}`} className="h-4 w-full" />
        ))}
      </div>
      
      {/* Table rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div 
          key={`row-${rowIndex}`}
          className="grid gap-4 py-2 border-t"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={`cell-${rowIndex}-${colIndex}`} className="h-4 w-full" />
          ))}
        </div>
      ))}
      <span className="sr-only">Loading table data...</span>
    </div>
  )
}

// Dashboard skeleton
export const DashboardSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn('space-y-6', className)} role="status" aria-label="Loading dashboard">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      
      {/* Metrics cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Main content area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 border rounded">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            ))}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-48 w-full" />
          </CardContent>
        </Card>
      </div>
      
      <span className="sr-only">Loading dashboard data...</span>
    </div>
  )
}

// Form skeleton
export const FormSkeleton: React.FC<{ 
  fields?: number
  className?: string 
}> = ({ fields = 4, className }) => {
  return (
    <div className={cn('space-y-4', className)} role="status" aria-label="Loading form">
      {Array.from({ length: fields }).map((_, index) => (
        <div key={index} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      
      <div className="flex justify-end space-x-2 pt-4">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-24" />
      </div>
      
      <span className="sr-only">Loading form...</span>
    </div>
  )
}

// List skeleton
export const ListSkeleton: React.FC<{ 
  items?: number
  showAvatar?: boolean
  className?: string 
}> = ({ items = 5, showAvatar = false, className }) => {
  return (
    <div className={cn('space-y-3', className)} role="status" aria-label="Loading list">
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="flex items-center space-x-3 p-3 border rounded">
          {showAvatar && <Skeleton className="h-10 w-10 rounded-full" />}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-8 w-16" />
        </div>
      ))}
      <span className="sr-only">Loading list items...</span>
    </div>
  )
}

// Chart skeleton
export const ChartSkeleton: React.FC<{ 
  height?: string
  className?: string 
}> = ({ height = 'h-64', className }) => {
  return (
    <div className={cn('space-y-4', className)} role="status" aria-label="Loading chart">
      <div className="flex justify-between items-center">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-24" />
      </div>
      <Skeleton className={cn('w-full rounded', height)} />
      <div className="flex justify-center space-x-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>
      <span className="sr-only">Loading chart data...</span>
    </div>
  )
}

// Page loading overlay
export const PageLoadingOverlay: React.FC<{ 
  message?: string
  className?: string 
}> = ({ message = 'Loading...', className }) => {
  return (
    <div 
      className={cn(
        'fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center',
        className
      )}
      role="status"
      aria-label={message}
    >
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
      <span className="sr-only">{message}</span>
    </div>
  )
}

// Inline loading spinner
export const InlineLoading: React.FC<{ 
  size?: 'sm' | 'md' | 'lg'
  message?: string
  className?: string 
}> = ({ size = 'md', message, className }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  }

  return (
    <div 
      className={cn('flex items-center space-x-2', className)}
      role="status"
      aria-label={message || 'Loading'}
    >
      <div className={cn('animate-spin rounded-full border-b-2 border-current', sizeClasses[size])} />
      {message && <span className="text-sm text-muted-foreground">{message}</span>}
      <span className="sr-only">{message || 'Loading'}</span>
    </div>
  )
}

// Button loading state
export const ButtonLoading: React.FC<{ 
  size?: 'sm' | 'md' | 'lg'
  className?: string 
}> = ({ size = 'sm', className }) => {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  }

  return (
    <div 
      className={cn('animate-spin rounded-full border-b-2 border-current', sizeClasses[size], className)}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

