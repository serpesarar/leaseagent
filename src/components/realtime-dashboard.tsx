'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useDashboardRealTime, useMaintenanceRealTime } from '@/hooks/use-realtime'
import { 
  Building2, 
  Users, 
  DollarSign, 
  Wrench, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

interface DashboardStats {
  totalProperties: number
  totalTenants: number
  monthlyRevenue: number
  occupancyRate: number
  maintenanceRequests: {
    total: number
    pending: number
    inProgress: number
    urgent: number
  }
  recentActivity: Array<{
    id: string
    type: 'maintenance' | 'payment' | 'lease' | 'tenant'
    title: string
    description: string
    timestamp: string
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
    status?: string
  }>
}

export function RealTimeDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProperties: 3,
    totalTenants: 48,
    monthlyRevenue: 168400,
    occupancyRate: 92,
    maintenanceRequests: {
      total: 12,
      pending: 7,
      inProgress: 3,
      urgent: 2
    },
    recentActivity: [
      {
        id: '1',
        type: 'maintenance',
        title: 'New Maintenance Request',
        description: 'Plumbing issue in Manhattan Heights - Unit 2B',
        timestamp: '2024-09-16T10:30:00Z',
        priority: 'HIGH',
        status: 'PENDING'
      },
      {
        id: '2',
        type: 'payment',
        title: 'Payment Received',
        description: '$2,800 rent payment from Emily Wilson',
        timestamp: '2024-09-16T09:15:00Z',
        status: 'COMPLETED'
      },
      {
        id: '3',
        type: 'maintenance',
        title: 'Contractor Assigned',
        description: 'Elite Plumbing assigned to Unit 1A repair',
        timestamp: '2024-09-16T08:45:00Z',
        status: 'IN_PROGRESS'
      }
    ]
  })

  const [liveUpdates, setLiveUpdates] = useState<any[]>([])
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connecting')

  // Real-time dashboard updates
  useDashboardRealTime({
    onUpdate: (data) => {
      console.log('Dashboard update received:', data)
      
      // Update stats based on the type of update
      if (data.type === 'stats') {
        setStats(prev => ({ ...prev, ...data.stats }))
      }
      
      // Add to live updates feed
      setLiveUpdates(prev => [data, ...prev.slice(0, 4)]) // Keep last 5 updates
      setConnectionStatus('connected')
    },
    onUrgentAlert: (alert) => {
      // Handle urgent alerts
      setLiveUpdates(prev => [{
        type: 'urgent',
        title: 'Urgent Alert',
        description: alert.message,
        timestamp: new Date().toISOString(),
        urgent: true
      }, ...prev.slice(0, 4)])
    }
  })

  // Real-time maintenance updates
  useMaintenanceRealTime({
    onCreate: (data) => {
      setStats(prev => ({
        ...prev,
        maintenanceRequests: {
          ...prev.maintenanceRequests,
          total: prev.maintenanceRequests.total + 1,
          pending: prev.maintenanceRequests.pending + 1,
          urgent: data.priority === 'URGENT' ? prev.maintenanceRequests.urgent + 1 : prev.maintenanceRequests.urgent
        },
        recentActivity: [{
          id: data.id,
          type: 'maintenance',
          title: 'New Maintenance Request',
          description: `${data.title} - ${data.property}`,
          timestamp: new Date().toISOString(),
          priority: data.priority,
          status: 'PENDING'
        }, ...prev.recentActivity.slice(0, 9)]
      }))
    },
    onStatusChange: (data) => {
      setStats(prev => {
        const newStats = { ...prev }
        
        // Update maintenance counts based on status change
        if (data.oldStatus === 'PENDING' && data.newStatus === 'IN_PROGRESS') {
          newStats.maintenanceRequests.pending -= 1
          newStats.maintenanceRequests.inProgress += 1
        } else if (data.oldStatus === 'IN_PROGRESS' && data.newStatus === 'COMPLETED') {
          newStats.maintenanceRequests.inProgress -= 1
          newStats.maintenanceRequests.total -= 1
        }
        
        // Add to recent activity
        newStats.recentActivity = [{
          id: `status-${data.id}`,
          type: 'maintenance',
          title: 'Status Updated',
          description: `${data.title} is now ${data.newStatus.toLowerCase()}`,
          timestamp: new Date().toISOString(),
          status: data.newStatus
        }, ...prev.recentActivity.slice(0, 9)]
        
        return newStats
      })
    },
    onContractorAssigned: (data) => {
      setStats(prev => ({
        ...prev,
        recentActivity: [{
          id: `contractor-${data.id}`,
          type: 'maintenance',
          title: 'Contractor Assigned',
          description: `${data.contractorName} assigned to ${data.title}`,
          timestamp: new Date().toISOString(),
          status: 'ASSIGNED'
        }, ...prev.recentActivity.slice(0, 9)]
      }))
    }
  })

  useEffect(() => {
    // Simulate connection status
    const timer = setTimeout(() => {
      setConnectionStatus('connected')
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'maintenance': return Wrench
      case 'payment': return DollarSign
      case 'lease': return Building2
      case 'tenant': return Users
      default: return CheckCircle
    }
  }

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'URGENT': return 'bg-red-100 text-red-800'
      case 'HIGH': return 'bg-orange-100 text-orange-800'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800'
      case 'LOW': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${
            connectionStatus === 'connected' ? 'bg-green-500' :
            connectionStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' :
            'bg-red-500'
          }`}></div>
          <span className="text-sm text-gray-600">
            {connectionStatus === 'connected' ? 'Live updates active' :
             connectionStatus === 'connecting' ? 'Connecting...' :
             'Connection lost'}
          </span>
        </div>
        
        {liveUpdates.length > 0 && (
          <div className="flex items-center space-x-2">
            <Zap className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-blue-600">
              {liveUpdates.length} live update{liveUpdates.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Properties</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProperties}</div>
            <p className="text-xs text-muted-foreground">
              {stats.occupancyRate}% average occupancy
            </p>
          </CardContent>
          {liveUpdates.some(u => u.type === 'property') && (
            <div className="absolute top-2 right-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
            </div>
          )}
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tenants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTenants}</div>
            <p className="text-xs text-muted-foreground">
              Active leases
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.monthlyRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +5.2% from last month
            </p>
          </CardContent>
          {liveUpdates.some(u => u.type === 'payment') && (
            <div className="absolute top-2 right-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
            </div>
          )}
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.maintenanceRequests.total}</div>
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-orange-600">{stats.maintenanceRequests.pending} pending</span>
              <span className="text-red-600">{stats.maintenanceRequests.urgent} urgent</span>
            </div>
          </CardContent>
          {liveUpdates.some(u => u.type === 'maintenance') && (
            <div className="absolute top-2 right-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-ping"></div>
            </div>
          )}
        </Card>
      </div>

      {/* Live Updates & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Updates Feed */}
        {liveUpdates.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-blue-500" />
                <span>Live Updates</span>
              </CardTitle>
              <CardDescription>
                Real-time updates from your properties
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {liveUpdates.map((update, index) => (
                  <div key={index} className={`flex items-start space-x-3 p-3 rounded-lg ${
                    update.urgent ? 'bg-red-50 border border-red-200' : 'bg-blue-50 border border-blue-200'
                  }`}>
                    <div className={`p-1 rounded-full ${
                      update.urgent ? 'bg-red-100' : 'bg-blue-100'
                    }`}>
                      <Zap className={`h-3 w-3 ${
                        update.urgent ? 'text-red-600' : 'text-blue-600'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{update.title}</p>
                      <p className="text-sm text-gray-600">{update.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(update.timestamp)}
                      </p>
                    </div>
                    {update.urgent && (
                      <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates across your properties
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentActivity.map((activity) => {
                const Icon = getActivityIcon(activity.type)
                
                return (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full ${
                      activity.priority === 'URGENT' ? 'bg-red-100' :
                      activity.priority === 'HIGH' ? 'bg-orange-100' :
                      activity.type === 'payment' ? 'bg-green-100' :
                      'bg-blue-100'
                    }`}>
                      <Icon className={`h-4 w-4 ${
                        activity.priority === 'URGENT' ? 'text-red-600' :
                        activity.priority === 'HIGH' ? 'text-orange-600' :
                        activity.type === 'payment' ? 'text-green-600' :
                        'text-blue-600'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-sm">{activity.title}</p>
                        {activity.priority && (
                          <Badge variant="outline" className={getPriorityColor(activity.priority)}>
                            {activity.priority}
                          </Badge>
                        )}
                        {activity.status && !activity.priority && (
                          <Badge variant="outline">
                            {activity.status}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

