'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Users, 
  DollarSign, 
  Wrench, 
  Calendar,
  Phone,
  Mail,
  Edit,
  Plus,
  TrendingUp,
  AlertTriangle
} from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import Link from 'next/link'

// Mock property data
const mockProperty = {
  id: '1',
  name: 'Manhattan Heights',
  address: '456 Park Avenue',
  city: 'New York',
  state: 'NY',
  zipCode: '10016',
  type: 'APARTMENT',
  bedrooms: 3,
  bathrooms: 2,
  squareFeet: 1200,
  description: 'Luxury apartment building in the heart of Manhattan with stunning city views and premium amenities.',
  images: [
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'
  ],
  amenities: ['Gym', 'Rooftop Terrace', 'Concierge', '24/7 Security', 'Laundry', 'Parking', 'Pool', 'Business Center'],
  isActive: true,
  totalUnits: 24,
  occupiedUnits: 22,
  availableUnits: 2,
  averageRent: 4200,
  monthlyRevenue: 92400,
  occupancyRate: 92,
  manager: {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@demo.com',
    phone: '+1 (555) 234-5678',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150'
  },
  units: [
    { id: '1', number: '1A', floor: 1, bedrooms: 2, bathrooms: 1, rent: 3500, isOccupied: true, tenant: 'John Smith' },
    { id: '2', number: '1B', floor: 1, bedrooms: 2, bathrooms: 1, rent: 3500, isOccupied: false },
    { id: '3', number: '2A', floor: 2, bedrooms: 3, bathrooms: 2, rent: 4500, isOccupied: true, tenant: 'Mike Davis' },
    { id: '4', number: '2B', floor: 2, bedrooms: 3, bathrooms: 2, rent: 4500, isOccupied: true, tenant: 'Emily Wilson' },
  ],
  tenants: [
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1 (555) 123-4567',
      unit: '1A',
      leaseStart: '2024-01-01',
      leaseEnd: '2024-12-31',
      rent: 3500,
      status: 'active'
    },
    {
      id: '2',
      name: 'Mike Davis',
      email: 'mike.davis@email.com',
      phone: '+1 (555) 234-5678',
      unit: '2A',
      leaseStart: '2024-01-01',
      leaseEnd: '2024-12-31',
      rent: 4500,
      status: 'active'
    }
  ],
  maintenanceRequests: [
    {
      id: '1',
      title: 'Leaky Faucet in Kitchen',
      unit: '2B',
      priority: 'MEDIUM',
      status: 'PENDING',
      createdAt: '2024-09-15',
      tenant: 'Mike Davis'
    },
    {
      id: '2',
      title: 'Heating Not Working',
      unit: '1A',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      createdAt: '2024-09-14',
      tenant: 'John Smith'
    }
  ],
  financials: {
    monthlyRevenue: 92400,
    yearToDateRevenue: 831600,
    expenses: 15600,
    netIncome: 76800,
    occupancyRate: 92,
    averageRent: 4200
  }
}

export default function PropertyDetailPage() {
  const params = useParams()
  const [property, setProperty] = useState(mockProperty)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    // Simulate loading property data
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [params.propertyId])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">{property.name}</h1>
            <Badge variant={property.isActive ? "default" : "secondary"}>
              {property.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          <div className="flex items-center text-gray-600 mb-4">
            <MapPin className="h-4 w-4 mr-1" />
            {property.address}, {property.city}, {property.state} {property.zipCode}
          </div>
          <p className="text-gray-600 max-w-2xl">{property.description}</p>
        </div>
        <Button>
          <Edit className="mr-2 h-4 w-4" />
          Edit Property
        </Button>
      </div>

      {/* Property Images */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <img
            src={property.images[0]}
            alt={property.name}
            className="w-full h-64 md:h-80 object-cover rounded-lg"
          />
        </div>
        <div className="space-y-4">
          {property.images.slice(1, 3).map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${property.name} ${index + 2}`}
              className="w-full h-28 md:h-36 object-cover rounded-lg"
            />
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Occupancy</p>
                <p className="text-lg font-semibold">{property.occupancyRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                <p className="text-lg font-semibold">{formatCurrency(property.monthlyRevenue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Square className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Total Units</p>
                <p className="text-lg font-semibold">{property.totalUnits}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Avg. Rent</p>
                <p className="text-lg font-semibold">{formatCurrency(property.averageRent)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="units">Units ({property.totalUnits})</TabsTrigger>
          <TabsTrigger value="tenants">Tenants ({property.tenants.length})</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance ({property.maintenanceRequests.length})</TabsTrigger>
          <TabsTrigger value="financials">Financials</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Property Details */}
            <Card>
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="font-medium">{property.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Square Feet</p>
                    <p className="font-medium">{property.squareFeet?.toLocaleString()} sq ft</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Bedrooms</p>
                    <p className="font-medium">{property.bedrooms}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Bathrooms</p>
                    <p className="font-medium">{property.bathrooms}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Amenities</p>
                  <div className="flex flex-wrap gap-2">
                    {property.amenities.map((amenity) => (
                      <Badge key={amenity} variant="outline">{amenity}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Property Manager */}
            <Card>
              <CardHeader>
                <CardTitle>Property Manager</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <img
                    src={property.manager.avatar}
                    alt={property.manager.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{property.manager.name}</h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Mail className="h-3 w-3 mr-1" />
                        {property.manager.email}
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                        {property.manager.phone}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="units" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Units</h3>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Unit
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {property.units.map((unit) => (
              <Card key={unit.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Unit {unit.number}</CardTitle>
                    <Badge variant={unit.isOccupied ? "default" : "outline"}>
                      {unit.isOccupied ? 'Occupied' : 'Available'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>Floor {unit.floor}</span>
                    <span>{unit.bedrooms}BR / {unit.bathrooms}BA</span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Rent</p>
                    <p className="text-lg font-semibold">{formatCurrency(unit.rent)}/mo</p>
                  </div>
                  {unit.isOccupied && unit.tenant && (
                    <div>
                      <p className="text-sm text-muted-foreground">Tenant</p>
                      <p className="font-medium">{unit.tenant}</p>
                    </div>
                  )}
                  <Button variant="outline" size="sm" className="w-full">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tenants" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Tenants</h3>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Tenant
            </Button>
          </div>
          <div className="space-y-4">
            {property.tenants.map((tenant) => (
              <Card key={tenant.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{tenant.name}</h4>
                        <p className="text-sm text-muted-foreground">Unit {tenant.unit}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(tenant.rent)}/mo</p>
                      <p className="text-sm text-muted-foreground">
                        Lease: {formatDate(tenant.leaseStart)} - {formatDate(tenant.leaseEnd)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Maintenance Requests</h3>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Request
            </Button>
          </div>
          <div className="space-y-4">
            {property.maintenanceRequests.map((request) => (
              <Card key={request.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        request.priority === 'HIGH' ? 'bg-red-100' :
                        request.priority === 'MEDIUM' ? 'bg-yellow-100' : 'bg-green-100'
                      }`}>
                        <Wrench className={`h-5 w-5 ${
                          request.priority === 'HIGH' ? 'text-red-600' :
                          request.priority === 'MEDIUM' ? 'text-yellow-600' : 'text-green-600'
                        }`} />
                      </div>
                      <div>
                        <h4 className="font-medium">{request.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          Unit {request.unit} • {request.tenant}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={
                        request.status === 'PENDING' ? 'outline' :
                        request.status === 'IN_PROGRESS' ? 'default' : 'secondary'
                      }>
                        {request.status.replace('_', ' ')}
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-1">
                        {formatDate(request.createdAt)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="financials" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(property.financials.monthlyRevenue)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">YTD Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(property.financials.yearToDateRevenue)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Net Income</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(property.financials.netIncome)}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

