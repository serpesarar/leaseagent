'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import { RouteGuard } from '@/components/route-guard'
import { UserRole, UnitStatus, LeaseStatus, MaintenanceStatus } from '@prisma/client'
import {
  ArrowLeft,
  Building2,
  Users,
  DollarSign,
  Calendar,
  MapPin,
  Edit,
  Plus,
  Wrench,
  Home,
  Phone,
  Mail,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react'
import Link from 'next/link'

interface Unit {
  id: string
  unitNumber: string
  bedrooms: number
  bathrooms: number
  squareFeet?: number
  rent: number
  deposit?: number
  status: UnitStatus
  lease?: {
    id: string
    status: LeaseStatus
    startDate: string
    endDate: string
    monthlyRent: number
    tenant: {
      id: string
      name: string
      email: string
      phone?: string
    }
  }
}

interface MaintenanceRequest {
  id: string
  title: string
  description: string
  priority: string
  status: MaintenanceStatus
  createdAt: string
  requester: {
    name: string
  }
  unit?: {
    unitNumber: string
  }
}

interface Property {
  id: string
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  type: string
  totalUnits: number
  yearBuilt?: number
  description?: string
  amenities: string[]
  occupancyRate: number
  monthlyRevenue: number
  occupiedUnits: number
  availableUnits: number
  units: Unit[]
  maintenanceRequests: MaintenanceRequest[]
}

// Mock data
const mockProperty: Property = {
  id: '1',
  name: 'Manhattan Heights',
  address: '123 Main Street',
  city: 'New York',
  state: 'NY',
  zipCode: '10001',
  type: 'APARTMENT',
  totalUnits: 6,
  yearBuilt: 2015,
  description: 'Luxury apartment building in the heart of Manhattan with stunning city views and premium amenities.',
  amenities: ['Gym', 'Pool', 'Parking', 'Laundry', 'Concierge', 'Rooftop Terrace'],
  occupancyRate: 83,
  monthlyRevenue: 18500,
  occupiedUnits: 5,
  availableUnits: 1,
  units: [
    {
      id: '1',
      unitNumber: '1A',
      bedrooms: 2,
      bathrooms: 2,
      squareFeet: 1200,
      rent: 3500,
      deposit: 3500,
      status: UnitStatus.OCCUPIED,
      lease: {
        id: '1',
        status: LeaseStatus.ACTIVE,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        monthlyRent: 3500,
        tenant: {
          id: '1',
          name: 'John Smith',
          email: 'john.smith@email.com',
          phone: '+1 (555) 123-4567'
        }
      }
    },
    {
      id: '2',
      unitNumber: '1B',
      bedrooms: 1,
      bathrooms: 1,
      squareFeet: 800,
      rent: 2800,
      deposit: 2800,
      status: UnitStatus.AVAILABLE
    },
    {
      id: '3',
      unitNumber: '2A',
      bedrooms: 2,
      bathrooms: 2,
      squareFeet: 1300,
      rent: 3800,
      deposit: 3800,
      status: UnitStatus.OCCUPIED,
      lease: {
        id: '2',
        status: LeaseStatus.ACTIVE,
        startDate: '2024-03-01',
        endDate: '2025-02-28',
        monthlyRent: 3800,
        tenant: {
          id: '2',
          name: 'Sarah Johnson',
          email: 'sarah.j@email.com',
          phone: '+1 (555) 987-6543'
        }
      }
    }
  ],
  maintenanceRequests: [
    {
      id: '1',
      title: 'Kitchen faucet leaking',
      description: 'The kitchen faucet in unit 1A has been leaking for the past few days.',
      priority: 'MEDIUM',
      status: MaintenanceStatus.PENDING,
      createdAt: '2024-09-15T10:30:00Z',
      requester: {
        name: 'John Smith'
      },
      unit: {
        unitNumber: '1A'
      }
    },
    {
      id: '2',
      title: 'Air conditioning not working',
      description: 'AC unit in 2A stopped working yesterday.',
      priority: 'HIGH',
      status: MaintenanceStatus.IN_PROGRESS,
      createdAt: '2024-09-14T14:15:00Z',
      requester: {
        name: 'Sarah Johnson'
      },
      unit: {
        unitNumber: '2A'
      }
    }
  ]
}

export default function PropertyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [property, setProperty] = useState<Property | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchProperty()
  }, [params.id])

  const fetchProperty = async () => {
    try {
      setIsLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      setProperty(mockProperty)
    } catch (error) {
      console.error('Error fetching property:', error)
      toast({
        title: 'Error loading property',
        description: 'Please try again later.',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case UnitStatus.AVAILABLE:
        return 'bg-green-100 text-green-800'
      case UnitStatus.OCCUPIED:
        return 'bg-blue-100 text-blue-800'
      case UnitStatus.MAINTENANCE:
        return 'bg-yellow-100 text-yellow-800'
      case UnitStatus.UNAVAILABLE:
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW':
        return 'bg-green-100 text-green-800'
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800'
      case 'HIGH':
        return 'bg-orange-100 text-orange-800'
      case 'URGENT':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getMaintenanceStatusIcon = (status: MaintenanceStatus) => {
    switch (status) {
      case MaintenanceStatus.PENDING:
        return <Clock className="h-4 w-4 text-yellow-600" />
      case MaintenanceStatus.IN_PROGRESS:
        return <Wrench className="h-4 w-4 text-blue-600" />
      case MaintenanceStatus.COMPLETED:
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case MaintenanceStatus.CANCELLED:
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="text-center py-12">
        <Building2 className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Property not found</h3>
        <p className="mt-1 text-sm text-gray-500">
          The property you're looking for doesn't exist or has been removed.
        </p>
        <div className="mt-6">
          <Button onClick={() => router.push('/dashboard/properties')}>
            Back to Properties
          </Button>
        </div>
      </div>
    )
  }

  return (
    <RouteGuard allowedRoles={[UserRole.COMPANY_OWNER, UserRole.PROPERTY_MANAGER]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{property.name}</h1>
              <p className="text-gray-600 flex items-center mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                {property.address}, {property.city}, {property.state} {property.zipCode}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" asChild>
              <Link href={`/dashboard/properties/${property.id}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Property
              </Link>
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{property.occupancyRate}%</div>
              <p className="text-xs text-muted-foreground">
                {property.occupiedUnits} of {property.totalUnits} units
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${property.monthlyRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Current month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Units</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{property.availableUnits}</div>
              <p className="text-xs text-muted-foreground">
                Ready for lease
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Year Built</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{property.yearBuilt || 'N/A'}</div>
              <p className="text-xs text-muted-foreground">
                {property.yearBuilt ? `${new Date().getFullYear() - property.yearBuilt} years old` : 'Unknown age'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="units">Units ({property.units.length})</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance ({property.maintenanceRequests.length})</TabsTrigger>
            <TabsTrigger value="financials">Financials</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Property Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Property Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Type</label>
                      <p className="text-sm">{property.type}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Total Units</label>
                      <p className="text-sm">{property.totalUnits}</p>
                    </div>
                  </div>
                  
                  {property.description && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Description</label>
                      <p className="text-sm text-gray-900">{property.description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Amenities */}
              <Card>
                <CardHeader>
                  <CardTitle>Amenities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {property.amenities.map((amenity, index) => (
                      <Badge key={index} variant="secondary">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="units" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Unit Management</h3>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Unit
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {property.units.map((unit) => (
                <Card key={unit.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Unit {unit.unitNumber}</CardTitle>
                      <Badge className={getStatusColor(unit.status)}>
                        {unit.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">Beds:</span>
                        <p className="font-medium">{unit.bedrooms}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Baths:</span>
                        <p className="font-medium">{unit.bathrooms}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Sq Ft:</span>
                        <p className="font-medium">{unit.squareFeet || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm text-gray-500">Rent:</span>
                        <p className="font-semibold">${unit.rent}/mo</p>
                      </div>
                      {unit.deposit && (
                        <div>
                          <span className="text-sm text-gray-500">Deposit:</span>
                          <p className="font-semibold">${unit.deposit}</p>
                        </div>
                      )}
                    </div>

                    {unit.lease && (
                      <>
                        <Separator />
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Current Tenant</span>
                            <Badge variant="outline" className="text-xs">
                              {unit.lease.status}
                            </Badge>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium">{unit.lease.tenant.name}</p>
                            <div className="flex items-center text-xs text-gray-500">
                              <Mail className="h-3 w-3 mr-1" />
                              {unit.lease.tenant.email}
                            </div>
                            {unit.lease.tenant.phone && (
                              <div className="flex items-center text-xs text-gray-500">
                                <Phone className="h-3 w-3 mr-1" />
                                {unit.lease.tenant.phone}
                              </div>
                            )}
                          </div>
                          <div className="text-xs text-gray-500">
                            Lease: {new Date(unit.lease.startDate).toLocaleDateString()} - {new Date(unit.lease.endDate).toLocaleDateString()}
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="maintenance" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Maintenance Requests</h3>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Request
              </Button>
            </div>

            <div className="space-y-4">
              {property.maintenanceRequests.map((request) => (
                <Card key={request.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {getMaintenanceStatusIcon(request.status)}
                          <h4 className="font-medium">{request.title}</h4>
                          <Badge className={getPriorityColor(request.priority)}>
                            {request.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{request.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>Requested by: {request.requester.name}</span>
                          {request.unit && (
                            <span>Unit: {request.unit.unitNumber}</span>
                          )}
                          <span>{new Date(request.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <Badge variant="outline">
                        {request.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {property.maintenanceRequests.length === 0 && (
                <div className="text-center py-8">
                  <Wrench className="mx-auto h-8 w-8 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No maintenance requests</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    All maintenance is up to date for this property.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="financials" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Current Month</span>
                    <span className="font-semibold">${property.monthlyRevenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Potential Monthly</span>
                    <span className="font-semibold">
                      ${property.units.reduce((sum, unit) => sum + unit.rent, 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Vacancy Loss</span>
                    <span className="text-red-600 font-semibold">
                      -${(property.units.reduce((sum, unit) => sum + unit.rent, 0) - property.monthlyRevenue).toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Unit Rent Range</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Lowest Rent</span>
                    <span className="font-semibold">
                      ${Math.min(...property.units.map(u => u.rent)).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Highest Rent</span>
                    <span className="font-semibold">
                      ${Math.max(...property.units.map(u => u.rent)).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Rent</span>
                    <span className="font-semibold">
                      ${Math.round(property.units.reduce((sum, unit) => sum + unit.rent, 0) / property.units.length).toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </RouteGuard>
  )
}

