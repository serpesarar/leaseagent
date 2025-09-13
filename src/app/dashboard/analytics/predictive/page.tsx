'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/hooks/use-toast'
import { RouteGuard } from '@/components/route-guard'
import { UserRole } from '@prisma/client'
import { AIService, PredictiveMaintenanceResult } from '@/lib/ai-service'
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Calendar,
  DollarSign,
  Wrench,
  Building2,
  Brain,
  Clock,
  Target,
  CheckCircle,
  XCircle,
  RefreshCw
} from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts'

interface PredictiveInsight {
  id: string
  propertyId: string
  propertyName: string
  issueType: string
  probability: number
  timeframe: string
  preventiveAction: string
  estimatedCost: number
  priority: number
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  confidence: number
  lastUpdated: string
  status: 'PENDING' | 'SCHEDULED' | 'COMPLETED' | 'IGNORED'
}

interface MaintenanceTrend {
  month: string
  predicted: number
  actual: number
  savings: number
}

interface CategoryAnalysis {
  category: string
  frequency: number
  avgCost: number
  trend: 'UP' | 'DOWN' | 'STABLE'
  predictedIncrease: number
}

// Mock data for demonstration
const mockInsights: PredictiveInsight[] = [
  {
    id: '1',
    propertyId: '1',
    propertyName: 'Manhattan Heights',
    issueType: 'HVAC Filter Replacement',
    probability: 0.92,
    timeframe: 'next 15 days',
    preventiveAction: 'Schedule filter replacement and system inspection',
    estimatedCost: 150,
    priority: 8,
    riskLevel: 'MEDIUM',
    confidence: 0.89,
    lastUpdated: '2024-09-25T10:30:00Z',
    status: 'PENDING'
  },
  {
    id: '2',
    propertyId: '1',
    propertyName: 'Manhattan Heights',
    issueType: 'Plumbing Leak Risk - Unit 2A',
    probability: 0.78,
    timeframe: 'next 30 days',
    preventiveAction: 'Inspect bathroom plumbing and replace aging fixtures',
    estimatedCost: 450,
    priority: 7,
    riskLevel: 'HIGH',
    confidence: 0.82,
    lastUpdated: '2024-09-25T10:30:00Z',
    status: 'SCHEDULED'
  },
  {
    id: '3',
    propertyId: '2',
    propertyName: 'Brooklyn Gardens',
    issueType: 'Elevator Maintenance Due',
    probability: 0.95,
    timeframe: 'next 7 days',
    preventiveAction: 'Schedule quarterly elevator maintenance',
    estimatedCost: 800,
    priority: 9,
    riskLevel: 'CRITICAL',
    confidence: 0.94,
    lastUpdated: '2024-09-25T10:30:00Z',
    status: 'PENDING'
  }
]

const mockTrends: MaintenanceTrend[] = [
  { month: 'Jan', predicted: 12, actual: 15, savings: 2400 },
  { month: 'Feb', predicted: 8, actual: 6, savings: 1800 },
  { month: 'Mar', predicted: 15, actual: 18, savings: 3200 },
  { month: 'Apr', predicted: 10, actual: 8, savings: 2100 },
  { month: 'May', predicted: 14, actual: 12, savings: 2800 },
  { month: 'Jun', predicted: 18, actual: 16, savings: 3600 }
]

const mockCategoryAnalysis: CategoryAnalysis[] = [
  { category: 'HVAC', frequency: 45, avgCost: 320, trend: 'UP', predictedIncrease: 15 },
  { category: 'Plumbing', frequency: 38, avgCost: 280, trend: 'STABLE', predictedIncrease: 2 },
  { category: 'Electrical', frequency: 22, avgCost: 180, trend: 'DOWN', predictedIncrease: -8 },
  { category: 'Appliances', frequency: 31, avgCost: 420, trend: 'UP', predictedIncrease: 12 }
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

export default function PredictiveMaintenancePage() {
  const { toast } = useToast()
  const [insights, setInsights] = useState<PredictiveInsight[]>([])
  const [trends, setTrends] = useState<MaintenanceTrend[]>([])
  const [categoryAnalysis, setCategoryAnalysis] = useState<CategoryAnalysis[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  useEffect(() => {
    loadPredictiveData()
  }, [])

  const loadPredictiveData = async () => {
    try {
      setIsLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setInsights(mockInsights)
      setTrends(mockTrends)
      setCategoryAnalysis(mockCategoryAnalysis)
      setLastUpdate(new Date())
    } catch (error) {
      console.error('Error loading predictive data:', error)
      toast({
        title: 'Error loading data',
        description: 'Please try again later.',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const generateNewPredictions = async () => {
    try {
      setIsGenerating(true)
      
      // Simulate AI prediction generation
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      toast({
        title: 'Predictions updated',
        description: 'AI has generated new predictive maintenance insights.'
      })
      
      await loadPredictiveData()
    } catch (error) {
      toast({
        title: 'Error generating predictions',
        description: 'Please try again later.',
        variant: 'destructive'
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleActionTaken = async (insightId: string, action: 'SCHEDULE' | 'IGNORE') => {
    try {
      setInsights(prev => prev.map(insight => 
        insight.id === insightId 
          ? { ...insight, status: action === 'SCHEDULE' ? 'SCHEDULED' : 'IGNORED' }
          : insight
      ))
      
      toast({
        title: action === 'SCHEDULE' ? 'Action scheduled' : 'Insight dismissed',
        description: action === 'SCHEDULE' 
          ? 'Preventive maintenance has been scheduled.'
          : 'This insight has been marked as ignored.'
      })
    } catch (error) {
      toast({
        title: 'Error updating status',
        description: 'Please try again.',
        variant: 'destructive'
      })
    }
  }

  const getPriorityColor = (priority: number) => {
    if (priority >= 8) return 'text-red-600 bg-red-50'
    if (priority >= 6) return 'text-orange-600 bg-orange-50'
    if (priority >= 4) return 'text-yellow-600 bg-yellow-50'
    return 'text-green-600 bg-green-50'
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'CRITICAL': return 'bg-red-100 text-red-800'
      case 'HIGH': return 'bg-orange-100 text-orange-800'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800'
      case 'LOW': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'COMPLETED': return <CheckCircle className="h-4 w-4 text-blue-600" />
      case 'IGNORED': return <XCircle className="h-4 w-4 text-gray-600" />
      default: return <Clock className="h-4 w-4 text-yellow-600" />
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'UP': return <TrendingUp className="h-4 w-4 text-red-600" />
      case 'DOWN': return <TrendingDown className="h-4 w-4 text-green-600" />
      default: return <Target className="h-4 w-4 text-blue-600" />
    }
  }

  const totalPredictedCost = insights
    .filter(i => i.status === 'PENDING' || i.status === 'SCHEDULED')
    .reduce((sum, i) => sum + i.estimatedCost, 0)

  const highPriorityCount = insights.filter(i => i.priority >= 7).length
  const scheduledCount = insights.filter(i => i.status === 'SCHEDULED').length

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <RouteGuard allowedRoles={[UserRole.COMPANY_OWNER, UserRole.PROPERTY_MANAGER]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Brain className="mr-3 h-8 w-8 text-blue-600" />
              Predictive Maintenance
            </h1>
            <p className="text-gray-600 mt-1">
              AI-powered insights to prevent issues before they occur
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </span>
            <Button 
              variant="outline" 
              onClick={generateNewPredictions}
              disabled={isGenerating}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
              {isGenerating ? 'Generating...' : 'Refresh Predictions'}
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Predictions</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{insights.length}</div>
              <p className="text-xs text-muted-foreground">
                {highPriorityCount} high priority
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Scheduled Actions</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{scheduledCount}</div>
              <p className="text-xs text-muted-foreground">
                Preventive measures planned
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Predicted Costs</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalPredictedCost.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Next 90 days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Potential Savings</CardTitle>
              <TrendingDown className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ${Math.round(totalPredictedCost * 0.3).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                vs reactive maintenance
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="insights" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="insights">AI Insights ({insights.length})</TabsTrigger>
            <TabsTrigger value="trends">Trends & Analytics</TabsTrigger>
            <TabsTrigger value="categories">Category Analysis</TabsTrigger>
            <TabsTrigger value="settings">AI Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="insights" className="space-y-4">
            {insights.map((insight) => (
              <Card key={insight.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <CardTitle className="text-lg">{insight.issueType}</CardTitle>
                        <Badge className={getRiskColor(insight.riskLevel)}>
                          {insight.riskLevel}
                        </Badge>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(insight.status)}
                          <span className="text-sm capitalize">{insight.status.toLowerCase()}</span>
                        </div>
                      </div>
                      <CardDescription className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <Building2 className="h-3 w-3 mr-1" />
                          {insight.propertyName}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {insight.timeframe}
                        </span>
                        <span className="flex items-center">
                          <DollarSign className="h-3 w-3 mr-1" />
                          ${insight.estimatedCost}
                        </span>
                      </CardDescription>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(insight.priority)}`}>
                      Priority {insight.priority}/10
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Probability:</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={insight.probability * 100} className="w-24" />
                      <span className="text-sm font-medium">{Math.round(insight.probability * 100)}%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">AI Confidence:</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={insight.confidence * 100} className="w-24" />
                      <span className="text-sm font-medium">{Math.round(insight.confidence * 100)}%</span>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-1">Recommended Action:</h4>
                    <p className="text-sm text-blue-800">{insight.preventiveAction}</p>
                  </div>

                  {insight.status === 'PENDING' && (
                    <div className="flex items-center space-x-2 pt-2 border-t">
                      <Button 
                        size="sm"
                        onClick={() => handleActionTaken(insight.id, 'SCHEDULE')}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Schedule Action
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleActionTaken(insight.id, 'IGNORE')}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Dismiss
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {insights.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <Brain className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No predictions available</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    AI is analyzing your maintenance data to generate insights.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Maintenance Trends</CardTitle>
                  <CardDescription>
                    Predicted vs actual maintenance requests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={trends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="predicted" 
                        stroke="#8884d8" 
                        strokeWidth={2}
                        name="AI Predicted"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="actual" 
                        stroke="#82ca9d" 
                        strokeWidth={2}
                        name="Actual"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cost Savings</CardTitle>
                  <CardDescription>
                    Monthly savings from predictive maintenance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={trends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="savings" fill="#00C49F" name="Savings ($)" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>
                  AI prediction accuracy and system performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">87%</div>
                    <p className="text-sm text-gray-600">Prediction Accuracy</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">$18,400</div>
                    <p className="text-sm text-gray-600">Total Savings (YTD)</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">34%</div>
                    <p className="text-sm text-gray-600">Issue Prevention Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Category Frequency</CardTitle>
                  <CardDescription>
                    Distribution of maintenance issues by category
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryAnalysis}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ category, frequency }) => `${category}: ${frequency}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="frequency"
                      >
                        {categoryAnalysis.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Average Costs by Category</CardTitle>
                  <CardDescription>
                    Typical maintenance costs per category
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={categoryAnalysis} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="category" type="category" width={80} />
                      <Tooltip />
                      <Bar dataKey="avgCost" fill="#8884d8" name="Avg Cost ($)" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Category Trends</CardTitle>
                <CardDescription>
                  Predicted changes in maintenance patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryAnalysis.map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getTrendIcon(category.trend)}
                        <div>
                          <h4 className="font-medium">{category.category}</h4>
                          <p className="text-sm text-gray-600">
                            {category.frequency} issues • ${category.avgCost} avg cost
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-medium ${
                          category.predictedIncrease > 0 ? 'text-red-600' : 
                          category.predictedIncrease < 0 ? 'text-green-600' : 'text-gray-600'
                        }`}>
                          {category.predictedIncrease > 0 ? '+' : ''}{category.predictedIncrease}%
                        </div>
                        <p className="text-xs text-gray-500">predicted change</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Configuration</CardTitle>
                <CardDescription>
                  Configure AI prediction settings and thresholds
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Prediction Sensitivity</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Conservative</span>
                        <span className="text-sm">Aggressive</span>
                      </div>
                      <Progress value={70} className="w-full" />
                      <p className="text-xs text-gray-600">
                        Higher sensitivity generates more predictions but may include false positives
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Cost Threshold</h4>
                    <div className="space-y-2">
                      <input 
                        type="number" 
                        value={500}
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder="Minimum cost for predictions"
                      />
                      <p className="text-xs text-gray-600">
                        Only generate predictions for issues above this cost threshold
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-medium mb-4">Notification Settings</h4>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm">Email notifications for high-priority predictions</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm">Weekly AI insights summary</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">SMS alerts for critical predictions</span>
                    </label>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">AI Model Version</h4>
                      <p className="text-sm text-gray-600">Currently using GPT-4 Turbo</p>
                    </div>
                    <Button variant="outline">
                      Update Model
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </RouteGuard>
  )
}

