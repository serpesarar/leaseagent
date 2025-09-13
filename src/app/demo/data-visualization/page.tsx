'use client'

import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/core-components'
import { Button } from '@/components/ui/core-components'
import { 
  OccupancyWidget,
  RevenueWidget,
  MaintenanceHeatmap,
  IssueCategoriesChart,
  TenantSatisfactionChart,
  PaymentStatusChart
} from '@/components/charts/dashboard-widgets'
import { 
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Target,
  TrendingUp,
  TrendingDown,
  Building2,
  Users,
  DollarSign,
  Wrench,
  CreditCard,
  Calendar,
  Clock,
  RefreshCw,
  Download,
  Settings,
  Eye,
  Filter,
  MoreHorizontal
} from 'lucide-react'

export default function DataVisualizationShowcase() {
  const [selectedPeriod, setSelectedPeriod] = useState('30d')
  const [selectedProperty, setSelectedProperty] = useState('all')

  // Mock data
  const occupancyData = {
    occupancyRate: 87,
    trend: {
      direction: 'up' as const,
      value: '+3%',
      period: 'bu ay'
    },
    sparklineData: [
      { date: '2024-01-01', value: 82 },
      { date: '2024-01-02', value: 84 },
      { date: '2024-01-03', value: 83 },
      { date: '2024-01-04', value: 85 },
      { date: '2024-01-05', value: 86 },
      { date: '2024-01-06', value: 87 },
      { date: '2024-01-07', value: 88 },
      { date: '2024-01-08', value: 87 },
      { date: '2024-01-09', value: 89 },
      { date: '2024-01-10', value: 87 }
    ]
  }

  const revenueData = {
    currentRevenue: 245000,
    previousRevenue: 230000,
    trend: {
      direction: 'up' as const,
      value: '+6.5%',
      period: 'bu ay'
    },
    chartData: [
      { name: 'Oca', revenue: 220000 },
      { name: 'Şub', revenue: 235000 },
      { name: 'Mar', revenue: 240000 },
      { name: 'Nis', revenue: 230000 },
      { name: 'May', revenue: 245000 },
      { name: 'Haz', revenue: 250000 },
      { name: 'Tem', revenue: 245000 }
    ]
  }

  const maintenanceHeatmapData = [
    { day: 'Pzt', hour: 9, count: 3 },
    { day: 'Pzt', hour: 10, count: 5 },
    { day: 'Pzt', hour: 14, count: 2 },
    { day: 'Sal', hour: 8, count: 4 },
    { day: 'Sal', hour: 11, count: 6 },
    { day: 'Sal', hour: 15, count: 3 },
    { day: 'Çar', hour: 9, count: 2 },
    { day: 'Çar', hour: 13, count: 4 },
    { day: 'Çar', hour: 16, count: 5 },
    { day: 'Per', hour: 10, count: 3 },
    { day: 'Per', hour: 14, count: 7 },
    { day: 'Per', hour: 17, count: 2 },
    { day: 'Cum', hour: 8, count: 4 },
    { day: 'Cum', hour: 12, count: 5 },
    { day: 'Cum', hour: 15, count: 3 },
    { day: 'Cmt', hour: 9, count: 2 },
    { day: 'Cmt', hour: 11, count: 4 },
    { day: 'Paz', hour: 10, count: 1 },
    { day: 'Paz', hour: 14, count: 2 }
  ]

  const issueCategoriesData = [
    { category: 'Su Tesisatı', count: 45, color: '#3B82F6' },
    { category: 'Elektrik', count: 32, color: '#F59E0B' },
    { category: 'Tamir', count: 28, color: '#10B981' },
    { category: 'Ödeme', count: 15, color: '#8B5CF6' },
    { category: 'Diğer', count: 12, color: '#6B7280' }
  ]

  const tenantSatisfactionData = [
    { month: 'Oca', satisfaction: 8.2, complaints: 5 },
    { month: 'Şub', satisfaction: 8.5, complaints: 3 },
    { month: 'Mar', satisfaction: 8.1, complaints: 7 },
    { month: 'Nis', satisfaction: 8.7, complaints: 2 },
    { month: 'May', satisfaction: 8.9, complaints: 1 },
    { month: 'Haz', satisfaction: 8.6, complaints: 4 },
    { month: 'Tem', satisfaction: 8.8, complaints: 2 }
  ]

  const paymentStatusData = [
    { status: 'Ödendi', count: 156, amount: 1250000, color: '#10B981' },
    { status: 'Beklemede', count: 24, amount: 192000, color: '#F59E0B' },
    { status: 'Gecikmiş', count: 8, amount: 64000, color: '#EF4444' },
    { status: 'Kısmi', count: 12, amount: 96000, color: '#8B5CF6' }
  ]

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Data Visualization</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Recharts kütüphanesi ile modern dashboard widget'ları. 
            Interaktif grafikler ve gerçek zamanlı veri görselleştirme.
          </p>
        </div>

        {/* Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Dashboard Kontrolleri
            </CardTitle>
            <CardDescription>
              Grafikleri özelleştirin ve farklı zaman dilimlerini görüntüleyin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium">Zaman Dilimi:</label>
                <select 
                  value={selectedPeriod} 
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-3 py-1 border rounded-md text-sm"
                >
                  <option value="7d">Son 7 Gün</option>
                  <option value="30d">Son 30 Gün</option>
                  <option value="90d">Son 90 Gün</option>
                  <option value="1y">Son 1 Yıl</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium">Mülk:</label>
                <select 
                  value={selectedProperty} 
                  onChange={(e) => setSelectedProperty(e.target.value)}
                  className="px-3 py-1 border rounded-md text-sm"
                >
                  <option value="all">Tüm Mülkler</option>
                  <option value="property1">Merkez Apartmanı</option>
                  <option value="property2">Park Residence</option>
                  <option value="property3">Güneş Sitesi</option>
                </select>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Yenile
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Dışa Aktar
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtrele
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Dashboard Widgets */}
        <section className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Dashboard Widget'ları</h2>
            <p className="text-muted-foreground">
              Temel metrikler ve KPI'lar için özel tasarlanmış widget'lar
            </p>
          </div>

          {/* Top Row - Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <OccupancyWidget
              occupancyRate={occupancyData.occupancyRate}
              trend={occupancyData.trend}
              sparklineData={occupancyData.sparklineData}
              size="md"
            />

            <RevenueWidget
              currentRevenue={revenueData.currentRevenue}
              previousRevenue={revenueData.previousRevenue}
              trend={revenueData.trend}
              chartData={revenueData.chartData}
            />

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">Açık Sorunlar</CardTitle>
                  <Wrench className="w-6 h-6 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-bold text-foreground">24</div>
                <div className="flex items-center space-x-2">
                  <TrendingDown className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-red-600 font-medium">-12%</span>
                  <span className="text-sm text-muted-foreground">bu hafta</span>
                </div>
                <div className="h-20">
                  <div className="flex items-end space-x-1 h-full">
                    {[65, 72, 68, 75, 82, 78, 76].map((value, index) => (
                      <div
                        key={index}
                        className="bg-primary rounded-t-sm flex-1"
                        style={{ height: `${value}%` }}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Second Row - Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <IssueCategoriesChart data={issueCategoriesData} />
            <TenantSatisfactionChart data={tenantSatisfactionData} />
          </div>

          {/* Third Row - Heatmap and Payment Status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MaintenanceHeatmap data={maintenanceHeatmapData} />
            <PaymentStatusChart data={paymentStatusData} />
          </div>
        </section>

        {/* Widget Variations */}
        <section className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Widget Varyasyonları</h2>
            <p className="text-muted-foreground">
              Farklı boyutlarda ve stillerde widget örnekleri
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Small Occupancy Widget */}
            <OccupancyWidget
              occupancyRate={92}
              trend={{
                direction: 'up',
                value: '+5%',
                period: 'bu ay'
              }}
              sparklineData={occupancyData.sparklineData}
              size="sm"
            />

            {/* Medium Occupancy Widget */}
            <OccupancyWidget
              occupancyRate={78}
              trend={{
                direction: 'down',
                value: '-2%',
                period: 'bu ay'
              }}
              sparklineData={occupancyData.sparklineData}
              size="md"
            />

            {/* Large Occupancy Widget */}
            <OccupancyWidget
              occupancyRate={95}
              trend={{
                direction: 'stable',
                value: '0%',
                period: 'bu ay'
              }}
              sparklineData={occupancyData.sparklineData}
              size="lg"
            />
          </div>
        </section>

        {/* Chart Types */}
        <section className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Grafik Türleri</h2>
            <p className="text-muted-foreground">
              Recharts kütüphanesi ile desteklenen farklı grafik türleri
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Bar Chart
                </CardTitle>
                <CardDescription>Dikey ve yatay bar grafikleri</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-32 bg-muted/20 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Bar Chart</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChartIcon className="w-5 h-5 mr-2" />
                  Pie Chart
                </CardTitle>
                <CardDescription>Dairesel ve donut grafikleri</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-32 bg-muted/20 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <PieChartIcon className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Pie Chart</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Line Chart
                </CardTitle>
                <CardDescription>Çizgi ve alan grafikleri</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-32 bg-muted/20 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Activity className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Line Chart</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Radial Chart
                </CardTitle>
                <CardDescription>Dairesel ilerleme göstergeleri</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-32 bg-muted/20 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Target className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Radial Chart</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="w-5 h-5 mr-2" />
                  Heatmap
                </CardTitle>
                <CardDescription>Renk yoğunluğu haritaları</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-32 bg-muted/20 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Building2 className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Heatmap</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Composed Chart
                </CardTitle>
                <CardDescription>Kombine grafik türleri</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-32 bg-muted/20 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Composed Chart</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Features */}
        <section className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Özellikler</h2>
            <p className="text-muted-foreground">
              Data visualization sisteminin temel özellikleri
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="w-5 h-5 mr-2" />
                  Interaktif Grafikler
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Hover efektleri ve tooltip'ler</p>
                  <p>• Zoom ve pan özellikleri</p>
                  <p>• Tıklanabilir legend'lar</p>
                  <p>• Responsive tasarım</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Real-time Updates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• WebSocket entegrasyonu</p>
                  <p>• Otomatik veri güncelleme</p>
                  <p>• Smooth animasyonlar</p>
                  <p>• Performance optimizasyonu</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Download className="w-5 h-5 mr-2" />
                  Export & Share
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• PNG/SVG export</p>
                  <p>• PDF rapor oluşturma</p>
                  <p>• Paylaşım linkleri</p>
                  <p>• Email gönderimi</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Advanced Filtering
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Tarih aralığı filtreleme</p>
                  <p>• Kategori bazlı filtreleme</p>
                  <p>• Dinamik veri seçimi</p>
                  <p>• Kayıtlı filtreler</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Customization
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Renk tema desteği</p>
                  <p>• Özelleştirilebilir boyutlar</p>
                  <p>• Widget konfigürasyonu</p>
                  <p>• Dashboard düzeni</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Trend analizi</p>
                  <p>• Karşılaştırmalı grafikler</p>
                  <p>• KPI hesaplamaları</p>
                  <p>• Tahmin modelleri</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Usage Examples */}
        <section className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Kullanım Örnekleri</h2>
            <p className="text-muted-foreground">
              Widget'ların nasıl kullanılacağına dair kod örnekleri
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Import Statements</CardTitle>
              <CardDescription>Widget'ları projenize nasıl dahil edeceğiniz</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                <pre>{`import { 
  OccupancyWidget,
  RevenueWidget,
  MaintenanceHeatmap,
  IssueCategoriesChart,
  TenantSatisfactionChart,
  PaymentStatusChart
} from '@/components/charts/dashboard-widgets'`}</pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Occupancy Widget Usage</CardTitle>
              <CardDescription>Doluluk oranı widget'ının kullanım örneği</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                <pre>{`<OccupancyWidget
  occupancyRate={87}
  trend={{
    direction: 'up',
    value: '+3%',
    period: 'bu ay'
  }}
  sparklineData={[
    { date: '2024-01-01', value: 82 },
    { date: '2024-01-02', value: 84 },
    // ... more data
  ]}
  size="md"
/>`}</pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Maintenance Heatmap Usage</CardTitle>
              <CardDescription>Bakım aktivite haritasının kullanım örneği</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                <pre>{`<MaintenanceHeatmap
  data={[
    { day: 'Pzt', hour: 9, count: 3 },
    { day: 'Pzt', hour: 10, count: 5 },
    // ... more data
  ]}
/>`}</pre>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}

