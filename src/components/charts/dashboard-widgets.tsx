'use client'

import React, { useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './core-components'
import { Badge } from './core-components'
import { 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  RadialBarChart,
  RadialBar,
  ScatterChart,
  Scatter,
  ComposedChart,
  ReferenceLine,
  ReferenceArea
} from 'recharts'
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Building2,
  Users,
  DollarSign,
  Wrench,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Target,
  Zap,
  Home,
  CreditCard,
  Phone,
  Mail,
  MessageCircle,
  Eye,
  Download,
  RefreshCw,
  Settings,
  MoreHorizontal
} from 'lucide-react'

// Types
interface ChartData {
  name: string
  value: number
  [key: string]: any
}

interface TrendData {
  direction: 'up' | 'down' | 'stable'
  value: string
  period: string
}

interface SparklineData {
  date: string
  value: number
}

// Occupancy Widget Component
interface OccupancyWidgetProps {
  occupancyRate: number
  trend: TrendData
  sparklineData: SparklineData[]
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function OccupancyWidget({ 
  occupancyRate, 
  trend, 
  sparklineData,
  className,
  size = 'md'
}: OccupancyWidgetProps) {
  const sizeClasses = {
    sm: 'h-32',
    md: 'h-48',
    lg: 'h-64'
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  const trendIcon = {
    up: TrendingUp,
    down: TrendingDown,
    stable: Minus
  }

  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    stable: 'text-gray-600'
  }

  const TrendIcon = trendIcon[trend.direction]

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Doluluk Oranı</CardTitle>
          <Building2 className={cn('text-muted-foreground', iconSizes[size])} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main Metric */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-3xl font-bold text-foreground">
              {occupancyRate}%
            </div>
            <div className="flex items-center space-x-2">
              <TrendIcon className={cn('w-4 h-4', trendColors[trend.direction])} />
              <span className={cn('text-sm font-medium', trendColors[trend.direction])}>
                {trend.value}
              </span>
              <span className="text-sm text-muted-foreground">
                {trend.period}
              </span>
            </div>
          </div>
          
          {/* Circular Progress */}
          <div className="relative">
            <ResponsiveContainer width={size === 'sm' ? 60 : size === 'md' ? 80 : 100} height={size === 'sm' ? 60 : size === 'md' ? 80 : 100}>
              <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={[{ value: occupancyRate }]}>
                <RadialBar
                  dataKey="value"
                  fill="hsl(var(--primary))"
                  cornerRadius={4}
                  startAngle={90}
                  endAngle={-270}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-semibold text-muted-foreground">
                {occupancyRate}%
              </span>
            </div>
          </div>
        </div>

        {/* Sparkline */}
        <div className={sizeClasses[size]}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparklineData}>
              <defs>
                <linearGradient id="occupancyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#occupancyGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

// Revenue Widget Component
interface RevenueWidgetProps {
  currentRevenue: number
  previousRevenue: number
  trend: TrendData
  chartData: ChartData[]
  className?: string
}

export function RevenueWidget({ 
  currentRevenue, 
  previousRevenue, 
  trend, 
  chartData,
  className 
}: RevenueWidgetProps) {
  const revenueChange = ((currentRevenue - previousRevenue) / previousRevenue) * 100

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Aylık Gelir</CardTitle>
          <DollarSign className="w-6 h-6 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main Metric */}
        <div className="space-y-2">
          <div className="text-3xl font-bold text-foreground">
            ₺{currentRevenue.toLocaleString()}
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={revenueChange >= 0 ? 'success' : 'destructive'}>
              {revenueChange >= 0 ? '+' : ''}{revenueChange.toFixed(1)}%
            </Badge>
            <span className="text-sm text-muted-foreground">
              Geçen aya göre
            </span>
          </div>
        </div>

        {/* Chart */}
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `₺${(value / 1000)}K`}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

// Maintenance Heatmap Component
interface MaintenanceHeatmapProps {
  data: {
    day: string
    hour: number
    count: number
  }[]
  className?: string
}

export function MaintenanceHeatmap({ data, className }: MaintenanceHeatmapProps) {
  const [hoveredCell, setHoveredCell] = useState<{day: string, hour: number} | null>(null)

  // Group data by day and hour
  const heatmapData = useMemo(() => {
    const days = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz']
    const hours = Array.from({ length: 24 }, (_, i) => i)
    
    return days.map(day => ({
      day,
      hours: hours.map(hour => {
        const cellData = data.find(d => d.day === day && d.hour === hour)
        return {
          hour,
          count: cellData?.count || 0
        }
      })
    }))
  }, [data])

  const getIntensityColor = (count: number) => {
    if (count === 0) return 'bg-muted'
    if (count <= 2) return 'bg-green-200 dark:bg-green-900'
    if (count <= 5) return 'bg-yellow-200 dark:bg-yellow-900'
    if (count <= 10) return 'bg-orange-200 dark:bg-orange-900'
    return 'bg-red-200 dark:bg-red-900'
  }

  const maxCount = Math.max(...data.map(d => d.count))

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Bakım Aktivite Haritası</CardTitle>
            <CardDescription>
              Son 30 günlük bakım talepleri - gün/saat dağılımı
            </CardDescription>
          </div>
          <Wrench className="w-6 h-6 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Heatmap Grid */}
          <div className="space-y-2">
            {/* Hour Labels */}
            <div className="flex">
              <div className="w-12"></div>
              <div className="flex-1 grid grid-cols-24 gap-0.5">
                {Array.from({ length: 24 }, (_, i) => (
                  <div key={i} className="text-xs text-center text-muted-foreground">
                    {i}
                  </div>
                ))}
              </div>
            </div>

            {/* Heatmap Rows */}
            {heatmapData.map(({ day, hours }) => (
              <div key={day} className="flex items-center space-x-2">
                <div className="w-12 text-sm font-medium text-muted-foreground">
                  {day}
                </div>
                <div className="flex-1 grid grid-cols-24 gap-0.5">
                  {hours.map(({ hour, count }) => (
                    <div
                      key={hour}
                      className={cn(
                        'w-3 h-3 rounded-sm cursor-pointer transition-all hover:scale-110',
                        getIntensityColor(count),
                        hoveredCell?.day === day && hoveredCell?.hour === hour && 'ring-2 ring-primary'
                      )}
                      onMouseEnter={() => setHoveredCell({ day, hour })}
                      onMouseLeave={() => setHoveredCell(null)}
                      title={`${day} ${hour}:00 - ${count} talep`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>Daha az</span>
              <div className="flex space-x-1">
                <div className="w-3 h-3 bg-muted rounded-sm"></div>
                <div className="w-3 h-3 bg-green-200 dark:bg-green-900 rounded-sm"></div>
                <div className="w-3 h-3 bg-yellow-200 dark:bg-yellow-900 rounded-sm"></div>
                <div className="w-3 h-3 bg-orange-200 dark:bg-orange-900 rounded-sm"></div>
                <div className="w-3 h-3 bg-red-200 dark:bg-red-900 rounded-sm"></div>
              </div>
              <span>Daha fazla</span>
            </div>
            
            {hoveredCell && (
              <div className="text-sm text-muted-foreground">
                {hoveredCell.day} {hoveredCell.hour}:00 - {
                  data.find(d => d.day === hoveredCell.day && d.hour === hoveredCell.hour)?.count || 0
                } talep
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Issue Categories Pie Chart Component
interface IssueCategoriesChartProps {
  data: {
    category: string
    count: number
    color: string
  }[]
  className?: string
}

export function IssueCategoriesChart({ data, className }: IssueCategoriesChartProps) {
  const total = data.reduce((sum, item) => sum + item.count, 0)

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Sorun Kategorileri</CardTitle>
            <CardDescription>
              Toplam {total} sorun - kategori dağılımı
            </CardDescription>
          </div>
          <PieChartIcon className="w-6 h-6 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Pie Chart */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="count"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`${value} sorun`, '']}
                  labelFormatter={(label) => `Kategori: ${label}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="space-y-2">
            {data.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium">{item.category}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">
                    {item.count} ({((item.count / total) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Tenant Satisfaction Chart Component
interface TenantSatisfactionChartProps {
  data: {
    month: string
    satisfaction: number
    complaints: number
  }[]
  className?: string
}

export function TenantSatisfactionChart({ data, className }: TenantSatisfactionChartProps) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Kiracı Memnuniyeti</CardTitle>
            <CardDescription>
              Aylık memnuniyet skoru ve şikayet sayısı
            </CardDescription>
          </div>
          <Users className="w-6 h-6 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                yAxisId="satisfaction"
                orientation="left"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                domain={[0, 10]}
              />
              <YAxis 
                yAxisId="complaints"
                orientation="right"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  name === 'satisfaction' ? `${value}/10` : `${value} şikayet`,
                  name === 'satisfaction' ? 'Memnuniyet' : 'Şikayetler'
                ]}
              />
              <Legend />
              <Bar 
                yAxisId="complaints"
                dataKey="complaints" 
                fill="hsl(var(--destructive))"
                name="Şikayetler"
                radius={[2, 2, 0, 0]}
              />
              <Line 
                yAxisId="satisfaction"
                type="monotone" 
                dataKey="satisfaction" 
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                name="Memnuniyet"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

// Payment Status Chart Component
interface PaymentStatusChartProps {
  data: {
    status: string
    count: number
    amount: number
    color: string
  }[]
  className?: string
}

export function PaymentStatusChart({ data, className }: PaymentStatusChartProps) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Ödeme Durumu</CardTitle>
            <CardDescription>
              Ödeme durumlarına göre dağılım
            </CardDescription>
          </div>
          <CreditCard className="w-6 h-6 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Horizontal Bar Chart */}
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                <XAxis type="number" axisLine={false} tickLine={false} />
                <YAxis 
                  type="category" 
                  dataKey="status" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    name === 'count' ? `${value} ödeme` : `₺${value.toLocaleString()}`,
                    name === 'count' ? 'Sayı' : 'Tutar'
                  ]}
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-2 gap-4">
            {data.map((item, index) => (
              <div key={index} className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium">{item.status}</span>
                </div>
                <div className="text-lg font-bold text-foreground">
                  {item.count}
                </div>
                <div className="text-sm text-muted-foreground">
                  ₺{item.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Export all components
export {
  OccupancyWidget,
  RevenueWidget,
  MaintenanceHeatmap,
  IssueCategoriesChart,
  TenantSatisfactionChart,
  PaymentStatusChart
}

