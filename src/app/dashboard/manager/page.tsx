'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RouteGuard } from '@/components/route-guard'
import { UserRole } from '@prisma/client'
import { useToast } from '@/hooks/use-toast'
import { MetricCard, DataTable, ActivityFeed, ProgressRing } from '@/components/ui/modern-components'
import { 
  RevenueExpenseChart, 
  IssueCategoriesPieChart, 
  TenantSatisfactionChart,
  OccupancyTrendChart 
} from '@/components/charts/analytics-charts'
import {
  Building2,
  DollarSign,
  AlertTriangle,
  Users,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Filter,
  Download,
  RefreshCw,
  BarChart3,
  PieChart,
  LineChart,
  Settings,
  Bell,
  Search,
  Eye,
  Edit,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Zap,
  Shield
} from 'lucide-react'

// Mock data - gerçek uygulamada API'den gelecek
const mockManagerData = {
  kpis: {
    occupancyRate: { current: 87, target: 90, trend: 2.3 },
    monthlyRevenue: { current: 245000, target: 250000, trend: 8.5 },
    openIssues: { current: 12, urgent: 3, trend: -15.2 },
    overduePayments: { current: 8, amount: 34500, trend: -22.1 }
  },
  chartData: {
    revenueExpenses: [
      { period: 'Oca', revenue: 220000, expenses: 180000, profit: 40000, occupancy: 85 },
      { period: 'Şub', revenue: 235000, expenses: 185000, profit: 50000, occupancy: 87 },
      { period: 'Mar', revenue: 245000, expenses: 190000, profit: 55000, occupancy: 89 },
      { period: 'Nis', revenue: 238000, expenses: 195000, profit: 43000, occupancy: 86 },
      { period: 'May', revenue: 252000, expenses: 188000, profit: 64000, occupancy: 91 },
      { period: 'Haz', revenue: 245000, expenses: 192000, profit: 53000, occupancy: 87 }
    ],
    issueCategories: [
      { label: 'Su Tesisatı', value: 15, percentage: 35 },
      { label: 'Elektrik', value: 8, percentage: 19 },
      { label: 'Isıtma', value: 7, percentage: 16 },
      { label: 'Genel Bakım', value: 6, percentage: 14 },
      { label: 'Güvenlik', value: 4, percentage: 9 },
      { label: 'Diğer', value: 3, percentage: 7 }
    ],
    tenantSatisfaction: {
      excellent: 45,
      good: 32,
      average: 15,
      poor: 6,
      terrible: 2
    }
  },
  recentTransactions: [
    {
      id: '1',
      tenant: 'Ahmet Yılmaz',
      property: 'Merkez Apt.',
      unit: '3A',
      amount: 8500,
      type: 'Kira',
      status: 'completed',
      date: '2024-09-28'
    },
    {
      id: '2',
      tenant: 'Fatma Kaya',
      property: 'Park Residence',
      unit: '12B',
      amount: 9200,
      type: 'Kira',
      status: 'pending',
      date: '2024-09-27'
    },
    {
      id: '3',
      tenant: 'Mehmet Demir',
      property: 'Güneş Sitesi',
      unit: '5C',
      amount: 1200,
      type: 'Depozit',
      status: 'completed',
      date: '2024-09-26'
    }
  ],
  pendingApprovals: [
    {
      id: '1',
      type: 'maintenance',
      title: 'Klima Tamiri',
      property: 'Merkez Apt.',
      unit: '7A',
      cost: 2500,
      priority: 'high',
      requestDate: '2024-09-25'
    },
    {
      id: '2',
      type: 'expense',
      title: 'Asansör Bakımı',
      property: 'Park Residence',
      cost: 4500,
      priority: 'medium',
      requestDate: '2024-09-24'
    },
    {
      id: '3',
      type: 'lease',
      title: 'Yeni Sözleşme',
      property: 'Güneş Sitesi',
      unit: '2B',
      cost: 0,
      priority: 'low',
      requestDate: '2024-09-23'
    }
  ]
}

export default function ManagerDashboard() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState(mockManagerData)
  const [selectedTimeRange, setSelectedTimeRange] = useState('thisMonth')

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Veriler güncellendi",
        description: "Dashboard verileri başarıyla yenilendi."
      })
    }, 1000)
  }

  const handleApproval = (id: string, action: 'approve' | 'reject') => {
    toast({
      title: `İşlem ${action === 'approve' ? 'onaylandı' : 'reddedildi'}`,
      description: `Onay işlemi başarıyla gerçekleştirildi.`
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Dashboard yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <RouteGuard allowedRoles={[UserRole.PROPERTY_MANAGER, UserRole.COMPANY_OWNER]} fallbackPath="/auth/signin">
      <div className="space-y-6 p-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-heading-2">Yönetici Dashboard</h1>
            <p className="text-muted-foreground">Mülk portföyünüzün genel görünümü</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filtrele
              </Button>
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Yenile
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Dışa Aktar
              </Button>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="dashboard-grid-4">
          
          {/* Doluluk Oranı */}
          <Card className="card-elevated">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Doluluk Oranı</p>
                  <p className="text-2xl font-bold text-foreground">{data.kpis.occupancyRate.current}%</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-600">
                      +{data.kpis.occupancyRate.trend}%
                    </span>
                    <span className="text-sm text-muted-foreground">bu ay</span>
                  </div>
                </div>
                
                <ProgressRing 
                  progress={data.kpis.occupancyRate.current} 
                  size="lg"
                  color="rgb(34 197 94)"
                >
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{data.kpis.occupancyRate.current}%</div>
                    <div className="text-xs text-muted-foreground">Hedef: {data.kpis.occupancyRate.target}%</div>
                  </div>
                </ProgressRing>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Hedef</span>
                  <span className="font-medium">{data.kpis.occupancyRate.target}%</span>
                </div>
                <Progress value={(data.kpis.occupancyRate.current / data.kpis.occupancyRate.target) * 100} className="h-1" />
              </div>
            </CardContent>
          </Card>

          {/* Aylık Gelir */}
          <MetricCard
            title="Aylık Gelir"
            value={`₺${data.kpis.monthlyRevenue.current.toLocaleString()}`}
            description={`Hedef: ₺${data.kpis.monthlyRevenue.target.toLocaleString()}`}
            trend={{
              value: data.kpis.monthlyRevenue.trend,
              period: "bu ay",
              positive: true
            }}
            icon={<DollarSign className="w-6 h-6 text-green-600" />}
            variant="success"
          />

          {/* Açık Sorunlar */}
          <Card className="card-elevated">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Açık Sorunlar</p>
                  <p className="text-3xl font-bold text-foreground">{data.kpis.openIssues.current}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <TrendingDown className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-600">
                      {data.kpis.openIssues.trend}%
                    </span>
                    <span className="text-sm text-muted-foreground">bu ay</span>
                  </div>
                </div>
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
                  <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-medium text-red-800 dark:text-red-200">
                    {data.kpis.openIssues.urgent} Acil Sorun
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Geciken Ödemeler */}
          <Card className="card-elevated">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Geciken Ödemeler</p>
                  <p className="text-3xl font-bold text-foreground">{data.kpis.overduePayments.current}</p>
                  <p className="text-sm text-red-600 font-medium">
                    ₺{data.kpis.overduePayments.amount.toLocaleString()}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <TrendingDown className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-600">
                      {data.kpis.overduePayments.trend}%
                    </span>
                    <span className="text-sm text-muted-foreground">bu ay</span>
                  </div>
                </div>
                <div className="p-3 bg-red-100 dark:bg-red-900 rounded-full">
                  <Clock className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Charts */}
        <div className="space-y-6">
          
          {/* Gelir/Gider ve Doluluk Analizi */}
          <div className="dashboard-grid-2">
            <RevenueExpenseChart 
              data={data.chartData.revenueExpenses}
              title="Gelir/Gider Analizi"
              timeRange="month"
              className="lg:col-span-1"
            />
            
            <OccupancyTrendChart
              data={data.chartData.revenueExpenses}
              title="Doluluk Oranı Trendi"
              className="lg:col-span-1"
            />
          </div>

          {/* Sorun Kategorileri ve Kiracı Memnuniyeti */}
          <div className="dashboard-grid-2">
            <IssueCategoriesPieChart 
              data={data.chartData.issueCategories}
              title="Sorun Kategorileri"
            />
            
            <TenantSatisfactionChart
              data={data.chartData.tenantSatisfaction}
              title="Kiracı Memnuniyeti"
            />
          </div>
        </div>


        {/* Data Tables */}
        <div className="dashboard-grid-2">
          
          {/* Son İşlemler */}
          <Card className="card-elevated">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Son İşlemler</CardTitle>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  Tümünü Gör
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${
                        transaction.status === 'completed' ? 'bg-green-100 dark:bg-green-900' : 'bg-yellow-100 dark:bg-yellow-900'
                      }`}>
                        {transaction.status === 'completed' ? (
                          <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                        ) : (
                          <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{transaction.tenant}</p>
                        <p className="text-sm text-muted-foreground">
                          {transaction.property} - {transaction.unit}
                        </p>
                        <p className="text-xs text-muted-foreground">{transaction.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">₺{transaction.amount.toLocaleString()}</p>
                      <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                        {transaction.status === 'completed' ? 'Tamamlandı' : 'Bekliyor'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Bekleyen Onaylar */}
          <Card className="card-elevated">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Bekleyen Onaylar
                </CardTitle>
                <Badge variant="secondary">{data.pendingApprovals.length}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.pendingApprovals.map((approval) => (
                  <div key={approval.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-foreground">{approval.title}</h4>
                          <Badge variant={
                            approval.priority === 'high' ? 'destructive' :
                            approval.priority === 'medium' ? 'default' : 'secondary'
                          }>
                            {approval.priority === 'high' ? 'Yüksek' :
                             approval.priority === 'medium' ? 'Orta' : 'Düşük'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {approval.property}
                          {approval.unit && ` - ${approval.unit}`}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Talep Tarihi: {approval.requestDate}
                        </p>
                        {approval.cost > 0 && (
                          <p className="text-sm font-medium text-foreground mt-1">
                            Maliyet: ₺{approval.cost.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleApproval(approval.id, 'reject')}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reddet
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleApproval(approval.id, 'approve')}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Onayla
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="card-flat">
          <CardHeader>
            <CardTitle>Hızlı Eylemler</CardTitle>
            <CardDescription>Sık kullanılan yönetim işlemleri</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Building2 className="w-6 h-6" />
                <span>Yeni Mülk</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Users className="w-6 h-6" />
                <span>Kiracı Ekle</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <BarChart3 className="w-6 h-6" />
                <span>Rapor Oluştur</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Settings className="w-6 h-6" />
                <span>Ayarlar</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </RouteGuard>
  )
}
