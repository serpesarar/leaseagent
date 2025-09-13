'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
  LineChart,
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Building2,
  Calendar,
  Filter,
  Download,
  Maximize2,
  Info
} from 'lucide-react'

// Chart data interfaces
interface ChartDataPoint {
  label: string
  value: number
  color?: string
  percentage?: number
}

interface TimeSeriesData {
  period: string
  revenue: number
  expenses: number
  profit: number
  occupancy: number
}

interface ChartProps {
  className?: string
  showControls?: boolean
  height?: number
}

// Revenue/Expense Line Chart
interface RevenueChartProps extends ChartProps {
  data: TimeSeriesData[]
  title?: string
  timeRange?: 'week' | 'month' | 'quarter' | 'year'
}

export function RevenueExpenseChart({ 
  data, 
  title = "Gelir/Gider Analizi", 
  timeRange = 'month',
  className,
  showControls = true,
  height = 300
}: RevenueChartProps) {
  const [selectedMetric, setSelectedMetric] = useState<'all' | 'revenue' | 'expenses' | 'profit'>('all')
  
  const maxValue = Math.max(
    ...data.map(d => Math.max(d.revenue, d.expenses, d.profit))
  )

  const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0)
  const totalExpenses = data.reduce((sum, d) => sum + d.expenses, 0)
  const totalProfit = totalRevenue - totalExpenses
  const profitMargin = ((totalProfit / totalRevenue) * 100).toFixed(1)

  return (
    <Card className={cn("card-elevated", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <LineChart className="w-5 h-5 mr-2" />
              {title}
            </CardTitle>
            <CardDescription>
              {timeRange === 'month' ? 'Aylık' : 
               timeRange === 'quarter' ? 'Çeyreklik' : 
               timeRange === 'year' ? 'Yıllık' : 'Haftalık'} finansal performans analizi
            </CardDescription>
          </div>
          {showControls && (
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filtre
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                İndir
              </Button>
              <Button variant="outline" size="sm">
                <Maximize2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Summary Metrics */}
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
            <p className="text-sm text-muted-foreground">Toplam Gelir</p>
            <p className="text-lg font-bold text-green-700 dark:text-green-300">
              ₺{totalRevenue.toLocaleString()}
            </p>
          </div>
          <div className="text-center p-3 bg-red-50 dark:bg-red-950 rounded-lg">
            <p className="text-sm text-muted-foreground">Toplam Gider</p>
            <p className="text-lg font-bold text-red-700 dark:text-red-300">
              ₺{totalExpenses.toLocaleString()}
            </p>
          </div>
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <p className="text-sm text-muted-foreground">Net Kar</p>
            <p className="text-lg font-bold text-blue-700 dark:text-blue-300">
              ₺{totalProfit.toLocaleString()}
            </p>
          </div>
          <div className="text-center p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
            <p className="text-sm text-muted-foreground">Kar Marjı</p>
            <p className="text-lg font-bold text-purple-700 dark:text-purple-300">
              %{profitMargin}
            </p>
          </div>
        </div>

        {/* Chart Legend */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <button
              onClick={() => setSelectedMetric(selectedMetric === 'revenue' ? 'all' : 'revenue')}
              className={cn(
                "flex items-center space-x-2 px-3 py-1 rounded-lg transition-colors",
                selectedMetric === 'revenue' || selectedMetric === 'all' 
                  ? "bg-green-100 dark:bg-green-900" 
                  : "hover:bg-muted"
              )}
            >
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">Gelir</span>
            </button>
            <button
              onClick={() => setSelectedMetric(selectedMetric === 'expenses' ? 'all' : 'expenses')}
              className={cn(
                "flex items-center space-x-2 px-3 py-1 rounded-lg transition-colors",
                selectedMetric === 'expenses' || selectedMetric === 'all'
                  ? "bg-red-100 dark:bg-red-900"
                  : "hover:bg-muted"
              )}
            >
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm font-medium">Gider</span>
            </button>
            <button
              onClick={() => setSelectedMetric(selectedMetric === 'profit' ? 'all' : 'profit')}
              className={cn(
                "flex items-center space-x-2 px-3 py-1 rounded-lg transition-colors",
                selectedMetric === 'profit' || selectedMetric === 'all'
                  ? "bg-blue-100 dark:bg-blue-900"
                  : "hover:bg-muted"
              )}
            >
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium">Kar</span>
            </button>
          </div>
        </div>

        {/* Chart Area */}
        <div className="space-y-3" style={{ height }}>
          {data.map((item, index) => {
            const revenueWidth = (item.revenue / maxValue) * 100
            const expensesWidth = (item.expenses / maxValue) * 100
            const profitWidth = (item.profit / maxValue) * 100

            return (
              <div key={item.period} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-foreground">{item.period}</span>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    {(selectedMetric === 'all' || selectedMetric === 'revenue') && (
                      <span className="text-green-600">₺{item.revenue.toLocaleString()}</span>
                    )}
                    {(selectedMetric === 'all' || selectedMetric === 'expenses') && (
                      <span className="text-red-600">₺{item.expenses.toLocaleString()}</span>
                    )}
                    {(selectedMetric === 'all' || selectedMetric === 'profit') && (
                      <span className="text-blue-600">₺{item.profit.toLocaleString()}</span>
                    )}
                  </div>
                </div>
                
                <div className="space-y-1">
                  {(selectedMetric === 'all' || selectedMetric === 'revenue') && (
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 rounded-full transition-all duration-500"
                        style={{ width: `${revenueWidth}%` }}
                      />
                    </div>
                  )}
                  {(selectedMetric === 'all' || selectedMetric === 'expenses') && (
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-red-500 rounded-full transition-all duration-500"
                        style={{ width: `${expensesWidth}%` }}
                      />
                    </div>
                  )}
                  {(selectedMetric === 'all' || selectedMetric === 'profit') && (
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${profitWidth}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Insights */}
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-500 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-medium text-foreground">Analiz Özeti</h4>
              <p className="text-sm text-muted-foreground">
                {totalProfit > 0 ? (
                  <>Bu dönemde <span className="font-medium text-green-600">₺{totalProfit.toLocaleString()}</span> kar elde edilmiştir. 
                  Kar marjı <span className="font-medium">%{profitMargin}</span> olarak gerçekleşmiştir.</>
                ) : (
                  <>Bu dönemde <span className="font-medium text-red-600">₺{Math.abs(totalProfit).toLocaleString()}</span> zarar yaşanmıştır. 
                  Giderlerin optimize edilmesi önerilmektedir.</>
                )}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Issue Categories Pie Chart
interface IssuePieChartProps extends ChartProps {
  data: ChartDataPoint[]
  title?: string
}

export function IssueCategoriesPieChart({ 
  data, 
  title = "Sorun Kategorileri",
  className,
  showControls = true
}: IssuePieChartProps) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  
  const totalIssues = data.reduce((sum, item) => sum + item.value, 0)
  const colors = [
    'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 
    'bg-purple-500', 'bg-orange-500', 'bg-pink-500', 'bg-indigo-500'
  ]

  return (
    <Card className={cn("card-elevated", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <PieChart className="w-5 h-5 mr-2" />
              {title}
            </CardTitle>
            <CardDescription>Bu dönem bildirilen sorunların kategorilere göre dağılımı</CardDescription>
          </div>
          {showControls && (
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              İndir
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Center Summary */}
        <div className="flex justify-center">
          <div className="relative">
            {/* Outer Ring */}
            <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-background flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{totalIssues}</div>
                  <div className="text-xs text-muted-foreground">Toplam</div>
                </div>
              </div>
            </div>
            
            {/* Colored Segments (Visual representation) */}
            <div className="absolute inset-0 rounded-full overflow-hidden">
              {data.map((item, index) => {
                const percentage = (item.value / totalIssues) * 100
                const rotation = data.slice(0, index).reduce((sum, prev) => sum + (prev.value / totalIssues) * 360, 0)
                
                return (
                  <div
                    key={item.label}
                    className={`absolute inset-0 ${colors[index % colors.length].replace('bg-', 'border-')} border-4 rounded-full`}
                    style={{
                      clipPath: `conic-gradient(from ${rotation}deg, transparent 0deg, transparent ${percentage * 3.6}deg, black ${percentage * 3.6}deg, black 360deg)`,
                      opacity: hoveredCategory === item.label ? 1 : 0.8
                    }}
                  />
                )
              })}
            </div>
          </div>
        </div>

        {/* Categories List */}
        <div className="space-y-3">
          {data.map((category, index) => {
            const percentage = ((category.value / totalIssues) * 100).toFixed(1)
            
            return (
              <div
                key={category.label}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg transition-colors cursor-pointer",
                  hoveredCategory === category.label ? "bg-muted" : "hover:bg-muted/50"
                )}
                onMouseEnter={() => setHoveredCategory(category.label)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${colors[index % colors.length]}`} />
                  <div>
                    <span className="font-medium text-foreground">{category.label}</span>
                    <p className="text-sm text-muted-foreground">
                      {category.value} sorun ({percentage}%)
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline">
                    {category.value}
                  </Badge>
                </div>
              </div>
            )
          })}
        </div>

        {/* Top Issue Alert */}
        {data.length > 0 && (
          <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <TrendingUp className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800 dark:text-yellow-200">En Sık Karşılaşılan Sorun</h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  <strong>{data[0].label}</strong> kategorisinde {data[0].value} sorun bildirildi. 
                  Bu kategoriye özel önlemler alınması önerilir.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Tenant Satisfaction Bar Chart
interface SatisfactionChartProps extends ChartProps {
  data: Record<string, number>
  title?: string
}

export function TenantSatisfactionChart({
  data,
  title = "Kiracı Memnuniyeti",
  className,
  showControls = true
}: SatisfactionChartProps) {
  const totalResponses = Object.values(data).reduce((sum, value) => sum + value, 0)
  const averageScore = (
    (data.excellent * 5 + data.good * 4 + data.average * 3 + data.poor * 2 + data.terrible * 1) / totalResponses
  ).toFixed(1)

  const categories = [
    { key: 'excellent', label: 'Mükemmel', color: 'bg-green-500', value: data.excellent },
    { key: 'good', label: 'İyi', color: 'bg-blue-500', value: data.good },
    { key: 'average', label: 'Orta', color: 'bg-yellow-500', value: data.average },
    { key: 'poor', label: 'Kötü', color: 'bg-orange-500', value: data.poor },
    { key: 'terrible', label: 'Çok Kötü', color: 'bg-red-500', value: data.terrible }
  ]

  const maxValue = Math.max(...Object.values(data))

  return (
    <Card className={cn("card-elevated", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              {title}
            </CardTitle>
            <CardDescription>Son memnuniyet anketine göre kiracı değerlendirmeleri</CardDescription>
          </div>
          {showControls && (
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-green-50 dark:bg-green-950">
                Ortalama: {averageScore}/5.0
              </Badge>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                İndir
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
            <p className="text-sm text-muted-foreground">Memnun Kiracılar</p>
            <p className="text-lg font-bold text-green-700 dark:text-green-300">
              %{(((data.excellent + data.good) / totalResponses) * 100).toFixed(1)}
            </p>
          </div>
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <p className="text-sm text-muted-foreground">Toplam Yanıt</p>
            <p className="text-lg font-bold text-blue-700 dark:text-blue-300">
              {totalResponses}
            </p>
          </div>
          <div className="text-center p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
            <p className="text-sm text-muted-foreground">Ortalama Puan</p>
            <p className="text-lg font-bold text-purple-700 dark:text-purple-300">
              {averageScore}/5.0
            </p>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="space-y-4">
          {categories.map((category) => {
            const percentage = ((category.value / totalResponses) * 100).toFixed(1)
            const barWidth = (category.value / maxValue) * 100
            
            return (
              <div key={category.key} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${category.color}`} />
                    <span className="font-medium text-foreground">{category.label}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-foreground">{category.value}</span>
                    <span className="text-xs text-muted-foreground ml-2">({percentage}%)</span>
                  </div>
                </div>
                
                <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${category.color}`}
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* Insights */}
        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-200">Memnuniyet Analizi</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Kiracıların <strong>%{(((data.excellent + data.good) / totalResponses) * 100).toFixed(1)}</strong>'i 
                hizmetlerden memnun. Ortalama memnuniyet puanı <strong>{averageScore}/5.0</strong> olarak ölçülmüştür.
                {parseFloat(averageScore) >= 4.0 ? " Mükemmel bir performans!" : 
                 parseFloat(averageScore) >= 3.5 ? " İyi bir performans, geliştirme alanları mevcut." :
                 " Memnuniyet artırıcı önlemler alınması önerilir."}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Occupancy Trend Chart
interface OccupancyTrendProps extends ChartProps {
  data: TimeSeriesData[]
  title?: string
}

export function OccupancyTrendChart({
  data,
  title = "Doluluk Oranı Trendi",
  className,
  showControls = true
}: OccupancyTrendProps) {
  const averageOccupancy = (data.reduce((sum, d) => sum + d.occupancy, 0) / data.length).toFixed(1)
  const trend = data.length > 1 ? data[data.length - 1].occupancy - data[0].occupancy : 0
  const isPositiveTrend = trend >= 0

  return (
    <Card className={cn("card-elevated", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Building2 className="w-5 h-5 mr-2" />
              {title}
            </CardTitle>
            <CardDescription>Zaman içerisinde doluluk oranı değişimi</CardDescription>
          </div>
          {showControls && (
            <div className="flex items-center space-x-2">
              <Badge variant={isPositiveTrend ? "default" : "destructive"}>
                {isPositiveTrend ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                {isPositiveTrend ? '+' : ''}{trend.toFixed(1)}%
              </Badge>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Summary */}
        <div className="text-center p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">Ortalama Doluluk Oranı</p>
          <p className="text-3xl font-bold text-foreground">%{averageOccupancy}</p>
        </div>

        {/* Trend Line Chart */}
        <div className="space-y-3">
          {data.map((item, index) => {
            const isLast = index === data.length - 1
            const prevValue = index > 0 ? data[index - 1].occupancy : item.occupancy
            const change = item.occupancy - prevValue
            
            return (
              <div key={item.period} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-foreground">{item.period}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-foreground">%{item.occupancy}</span>
                    {index > 0 && (
                      <Badge variant={change >= 0 ? "default" : "destructive"} className="text-xs">
                        {change >= 0 ? '+' : ''}{change.toFixed(1)}%
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="relative">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        item.occupancy >= 90 ? 'bg-green-500' :
                        item.occupancy >= 75 ? 'bg-blue-500' :
                        item.occupancy >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${item.occupancy}%` }}
                    />
                  </div>
                  {isLast && (
                    <div className="absolute -top-1 right-0 w-4 h-4 bg-primary rounded-full border-2 border-background" />
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Performance Indicator */}
        <div className={cn(
          "rounded-lg p-4 border",
          averageOccupancy >= '85' ? "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800" :
          averageOccupancy >= '75' ? "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800" :
          "bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800"
        )}>
          <div className="flex items-start space-x-3">
            {parseFloat(averageOccupancy) >= 85 ? (
              <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
            ) : (
              <TrendingDown className="w-5 h-5 text-yellow-600 mt-0.5" />
            )}
            <div>
              <h4 className={cn(
                "font-medium",
                parseFloat(averageOccupancy) >= 85 ? "text-green-800 dark:text-green-200" :
                "text-yellow-800 dark:text-yellow-200"
              )}>
                Doluluk Performansı
              </h4>
              <p className={cn(
                "text-sm",
                parseFloat(averageOccupancy) >= 85 ? "text-green-700 dark:text-green-300" :
                "text-yellow-700 dark:text-yellow-300"
              )}>
                {parseFloat(averageOccupancy) >= 85 
                  ? "Mükemmel doluluk oranı! Portföy performansı hedeflerin üzerinde."
                  : parseFloat(averageOccupancy) >= 75 
                  ? "İyi doluluk oranı. Pazarlama stratejileri ile artırılabilir."
                  : "Doluluk oranı düşük. Acil pazarlama ve kiracı kazanma stratejileri gerekli."
                }
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

