'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { propertyAPI } from '@/lib/api-client'
import { RouteGuard } from '@/components/route-guard'
import { UserRole, PropertyType } from '@prisma/client'
import { 
  Plus, 
  Search, 
  Building2, 
  Users, 
  DollarSign, 
  MapPin, 
  Calendar,
  MoreVertical,
  Edit,
  Trash2,
  Eye
} from 'lucide-react'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Property {
  id: string
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  type: PropertyType
  totalUnits: number
  occupiedUnits: number
  occupancyRate: number
  monthlyRevenue: number
  yearBuilt?: number
  amenities: string[]
  createdAt: string
  pendingMaintenanceCount: number
}

// Mock data for demonstration
const mockProperties: Property[] = [
  {
    id: '1',
    name: 'Manhattan Heights',
    address: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    type: PropertyType.APARTMENT,
    totalUnits: 50,
    occupiedUnits: 46,
    occupancyRate: 92,
    monthlyRevenue: 125000,
    yearBuilt: 2015,
    amenities: ['Gym', 'Pool', 'Parking', 'Laundry'],
    createdAt: '2024-01-15T00:00:00Z',
    pendingMaintenanceCount: 3
  },
  {
    id: '2',
    name: 'Brooklyn Gardens',
    address: '456 Oak Avenue',
    city: 'Brooklyn',
    state: 'NY',
    zipCode: '11201',
    type: PropertyType.APARTMENT,
    totalUnits: 30,
    occupiedUnits: 28,
    occupancyRate: 93,
    monthlyRevenue: 84000,
    yearBuilt: 2018,
    amenities: ['Gym', 'Garden', 'Parking'],
    createdAt: '2024-02-10T00:00:00Z',
    pendingMaintenanceCount: 1
  },
  {
    id: '3',
    name: 'Queens Plaza',
    address: '789 Pine Street',
    city: 'Queens',
    state: 'NY',
    zipCode: '11101',
    type: PropertyType.CONDO,
    totalUnits: 25,
    occupiedUnits: 22,
    occupancyRate: 88,
    monthlyRevenue: 66000,
    yearBuilt: 2020,
    amenities: ['Pool', 'Concierge', 'Rooftop'],
    createdAt: '2024-03-05T00:00:00Z',
    pendingMaintenanceCount: 0
  }
]

export default function PropertiesPage() {
  const { toast } = useToast()
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [cityFilter, setCityFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchProperties()
  }, [page, searchQuery, typeFilter, cityFilter])

  const fetchProperties = async () => {
    try {
      setIsLoading(true)
      
      // For now, use mock data. In production, this would call the API
      await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API call
      
      let filtered = mockProperties
      
      if (searchQuery) {
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.city.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }
      
      if (typeFilter !== 'all') {
        filtered = filtered.filter(p => p.type === typeFilter)
      }
      
      if (cityFilter) {
        filtered = filtered.filter(p => 
          p.city.toLowerCase().includes(cityFilter.toLowerCase())
        )
      }
      
      setProperties(filtered)
      setTotalPages(Math.ceil(filtered.length / 12))
      
    } catch (error) {
      console.error('Error fetching properties:', error)
      toast({
        title: 'Error loading properties',
        description: 'Please try again later.',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteProperty = async (propertyId: string) => {
    if (!confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      return
    }

    try {
      // In production, this would call the API
      setProperties(prev => prev.filter(p => p.id !== propertyId))
      
      toast({
        title: 'Property deleted',
        description: 'The property has been removed from your portfolio.'
      })
    } catch (error) {
      console.error('Error deleting property:', error)
      toast({
        title: 'Error deleting property',
        description: 'Please try again.',
        variant: 'destructive'
      })
    }
  }

  if (isLoading && properties.length === 0) {
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
            <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
            <p className="text-gray-600 mt-1">
              Manage your property portfolio ({properties.length} properties)
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard/properties/create">
              <Plus className="mr-2 h-4 w-4" />
              Add Property
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search properties by name, address, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Property Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value={PropertyType.APARTMENT}>Apartment</SelectItem>
              <SelectItem value={PropertyType.HOUSE}>House</SelectItem>
              <SelectItem value={PropertyType.CONDO}>Condo</SelectItem>
              <SelectItem value={PropertyType.COMMERCIAL}>Commercial</SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder="Filter by city"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="w-full sm:w-48"
          />
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Card key={property.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">{property.name}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                      <span className="truncate">{property.address}</span>
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">{property.type}</Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/properties/${property.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/properties/${property.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Property
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleDeleteProperty(property.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Property
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-xl font-bold text-green-600">{property.occupancyRate}%</div>
                    <div className="text-xs text-green-700">Occupancy</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-xl font-bold text-blue-600">
                      ${(property.monthlyRevenue || 0).toLocaleString()}
                    </div>
                    <div className="text-xs text-blue-700">Monthly Revenue</div>
                  </div>
                </div>

                {/* Units Info */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <Building2 className="h-4 w-4 mr-1 text-gray-500" />
                    <span>{property.totalUnits} Units</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1 text-gray-500" />
                    <span>{property.occupiedUnits} Occupied</span>
                  </div>
                </div>

                {/* Maintenance Alert */}
                {property.pendingMaintenanceCount > 0 && (
                  <div className="flex items-center justify-between p-2 bg-orange-50 rounded-lg border border-orange-200">
                    <span className="text-sm text-orange-800">Pending Maintenance</span>
                    <Badge variant="outline" className="text-orange-700 border-orange-300">
                      {property.pendingMaintenanceCount}
                    </Badge>
                  </div>
                )}

                {/* Amenities */}
                {property.amenities && property.amenities.length > 0 && (
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">Amenities</div>
                    <div className="flex flex-wrap gap-1">
                      {property.amenities.slice(0, 3).map((amenity, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
                        >
                          {amenity}
                        </span>
                      ))}
                      {property.amenities.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                          +{property.amenities.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    {property.yearBuilt ? `Built ${property.yearBuilt}` : 'Year unknown'}
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/properties/${property.id}`}>
                      View Details
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="px-4 py-2 text-sm">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        )}

        {/* Empty State */}
        {properties.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <Building2 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No properties found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery || typeFilter !== 'all' || cityFilter
                ? 'Try adjusting your search criteria.'
                : 'Get started by adding your first property.'
              }
            </p>
            {!searchQuery && typeFilter === 'all' && !cityFilter && (
              <div className="mt-6">
                <Button asChild>
                  <Link href="/dashboard/properties/create">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Property
                  </Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </RouteGuard>
  )
}