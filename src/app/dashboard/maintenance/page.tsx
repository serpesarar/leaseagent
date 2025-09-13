'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Clock, AlertTriangle, CheckCircle, XCircle, Wrench, User, MapPin, Zap, Trash2, Archive } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { useMaintenanceRealTime } from '@/hooks/use-realtime'
import { TouchListItem, PullToRefresh, ActionSheet } from '@/components/touch-optimized-ui'

// Mock data for demonstration
const mockMaintenanceRequests = [
  {
    id: '1',
    title: 'Leaky Faucet in Kitchen',
    description: 'The kitchen faucet has been dripping constantly for the past week. Water is pooling around the base.',
    priority: 'MEDIUM',
    status: 'PENDING',
    category: 'Plumbing',
    aiCategory: 'Plumbing - Faucet Repair', // AI-generated
    estimatedCost: 150,
    createdAt: '2024-09-15',
    property: 'Manhattan Heights',
    unit: '2B',
    tenant: {
      name: 'Mike Davis',
      email: 'mike.davis@email.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
    },
    images: [
      'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400'
    ]
  },
  {
    id: '2',
    title: 'Heating Not Working',
    description: 'The heating system stopped working yesterday evening. Temperature is dropping significantly.',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    category: 'HVAC',
    aiCategory: 'HVAC - Heating System Malfunction', // AI-generated
    estimatedCost: 300,
    createdAt: '2024-09-14',
    property: 'Brooklyn Commons',
    unit: '3A',
    tenant: {
      name: 'Emily Wilson',
      email: 'emily.wilson@email.com',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150'
    },
    images: []
  },
  {
    id: '3',
    title: 'Broken Window Latch',
    description: 'The window latch in the bedroom is broken and the window won\'t stay closed properly.',
    priority: 'LOW',
    status: 'COMPLETED',
    category: 'General Maintenance',
    aiCategory: 'Hardware - Window Repair', // AI-generated
    estimatedCost: 75,
    actualCost: 65,
    createdAt: '2024-09-10',
    completedDate: '2024-09-12',
    property: 'Queens Garden Apartments',
    unit: '1B',
    tenant: {
      name: 'John Rodriguez',
      email: 'john.rodriguez@email.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
    },
    images: []
  },
  {
    id: '4',
    title: 'Electrical Outlet Not Working',
    description: 'The electrical outlet in the living room has stopped working completely. No power at all.',
    priority: 'HIGH',
    status: 'PENDING',
    category: 'Electrical',
    aiCategory: 'Electrical - Outlet Malfunction', // AI-generated
    estimatedCost: 200,
    createdAt: '2024-09-16',
    property: 'Manhattan Heights',
    unit: '1A',
    tenant: {
      name: 'Sarah Chen',
      email: 'sarah.chen@email.com',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150'
    },
    images: [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400'
    ]
  }
]

const priorityConfig = {
  LOW: { color: 'bg-green-100 text-green-800', icon: Clock },
  MEDIUM: { color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle },
  HIGH: { color: 'bg-red-100 text-red-800', icon: AlertTriangle },
  EMERGENCY: { color: 'bg-red-200 text-red-900', icon: AlertTriangle }
}

const statusConfig = {
  PENDING: { color: 'bg-gray-100 text-gray-800', icon: Clock },
  IN_PROGRESS: { color: 'bg-blue-100 text-blue-800', icon: Wrench },
  COMPLETED: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
  CANCELLED: { color: 'bg-red-100 text-red-800', icon: XCircle }
}

export default function MaintenancePage() {
  const [requests, setRequests] = useState(mockMaintenanceRequests)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [priorityFilter, setPriorityFilter] = useState('ALL')
  const [isLoading, setIsLoading] = useState(true)
  const [realtimeUpdates, setRealtimeUpdates] = useState<any[]>([])

  // Real-time maintenance updates
  useMaintenanceRealTime({
    onCreate: (data) => {
      setRequests(prev => [data, ...prev])
      setRealtimeUpdates(prev => [{
        type: 'created',
        data,
        timestamp: new Date().toISOString()
      }, ...prev.slice(0, 4)])
    },
    onUpdate: (data) => {
      setRequests(prev => prev.map(req => 
        req.id === data.id ? { ...req, ...data } : req
      ))
      setRealtimeUpdates(prev => [{
        type: 'updated',
        data,
        timestamp: new Date().toISOString()
      }, ...prev.slice(0, 4)])
    },
    onStatusChange: (data) => {
      setRequests(prev => prev.map(req => 
        req.id === data.id ? { ...req, status: data.newStatus } : req
      ))
      setRealtimeUpdates(prev => [{
        type: 'status_changed',
        data,
        timestamp: new Date().toISOString()
      }, ...prev.slice(0, 4)])
    },
    onContractorAssigned: (data) => {
      setRequests(prev => prev.map(req => 
        req.id === data.id ? { ...req, contractor: data.contractorName } : req
      ))
      setRealtimeUpdates(prev => [{
        type: 'contractor_assigned',
        data,
        timestamp: new Date().toISOString()
      }, ...prev.slice(0, 4)])
    }
  })

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [])

  const filteredRequests = requests.filter(request => {
    const matchesSearch = 
      request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.tenant.name.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'ALL' || request.status === statusFilter
    const matchesPriority = priorityFilter === 'ALL' || request.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  const handleRefresh = async () => {
    // Simulate refreshing data
    await new Promise(resolve => setTimeout(resolve, 1000))
    // In real app, refetch maintenance requests
  }

  const handleArchive = (request: any) => {
    setRequests(prev => prev.filter(r => r.id !== request.id))
  }

  const handleDelete = (request: any) => {
    setRequests(prev => prev.filter(r => r.id !== request.id))
  }

  return (
    <PullToRefresh onRefresh={handleRefresh} className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Maintenance Requests</h1>
          <p className="text-gray-600 mt-1 text-sm md:text-base">
            Track and manage property maintenance issues with real-time updates
          </p>
          {realtimeUpdates.length > 0 && (
            <div className="flex items-center space-x-2 mt-2">
              <Zap className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-blue-600">
                {realtimeUpdates.length} live update{realtimeUpdates.length !== 1 ? 's' : ''} received
              </span>
            </div>
          )}
        </div>
        <Button className="hidden md:flex">
          <Plus className="mr-2 h-4 w-4" />
          New Request
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{requests.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {requests.filter(r => r.status === 'PENDING').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {requests.filter(r => r.status === 'IN_PROGRESS').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {requests.filter(r => r.priority === 'HIGH' || r.priority === 'EMERGENCY').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search requests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="ALL">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="ALL">All Priority</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="EMERGENCY">Emergency</option>
        </select>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.map((request) => {
          const PriorityIcon = priorityConfig[request.priority]?.icon || Clock
          const StatusIcon = statusConfig[request.status]?.icon || Clock

          return (
            <Card key={request.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <CardTitle className="text-lg">{request.title}</CardTitle>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityConfig[request.priority]?.color}`}>
                        <PriorityIcon className="inline h-3 w-3 mr-1" />
                        {request.priority}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[request.status]?.color}`}>
                        <StatusIcon className="inline h-3 w-3 mr-1" />
                        {request.status.replace('_', ' ')}
                      </span>
                    </div>
                    <CardDescription className="text-sm text-gray-600 mb-2">
                      {request.description}
                    </CardDescription>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {request.property} - Unit {request.unit}
                      </div>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {request.tenant.name}
                      </div>
                      <div>
                        Created: {formatDate(request.createdAt)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <img
                      src={request.tenant.avatar}
                      alt={request.tenant.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* AI Category */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium text-blue-800">AI Classification:</span>
                    <span className="text-sm text-blue-700">{request.aiCategory}</span>
                  </div>
                </div>

                {/* Cost Information */}
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <span className="text-gray-600">Estimated Cost:</span>
                    <span className="ml-2 font-semibold">${request.estimatedCost}</span>
                    {request.actualCost && (
                      <>
                        <span className="text-gray-600 ml-4">Actual Cost:</span>
                        <span className="ml-2 font-semibold">${request.actualCost}</span>
                      </>
                    )}
                  </div>
                  {request.completedDate && (
                    <div>
                      <span className="text-gray-600">Completed:</span>
                      <span className="ml-2 font-semibold">{formatDate(request.completedDate)}</span>
                    </div>
                  )}
                </div>

                {/* Images */}
                {request.images.length > 0 && (
                  <div className="flex space-x-2">
                    {request.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Request ${request.id} - ${index + 1}`}
                        className="h-16 w-16 object-cover rounded-lg border"
                      />
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-2 pt-2">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  {request.status === 'PENDING' && (
                    <Button size="sm">
                      Start Work
                    </Button>
                  )}
                  {request.status === 'IN_PROGRESS' && (
                    <Button size="sm">
                      Mark Complete
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    Contact Tenant
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredRequests.length === 0 && (
        <div className="text-center py-12">
          <Wrench className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No maintenance requests found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery || statusFilter !== 'ALL' || priorityFilter !== 'ALL' 
              ? 'Try adjusting your search criteria or filters.' 
              : 'All maintenance requests will appear here.'}
          </p>
        </div>
      )}
    </div>
  )
}
