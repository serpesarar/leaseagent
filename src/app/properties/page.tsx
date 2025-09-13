'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Plus, Search, MapPin, Bed, Bath, Square, Users, DollarSign, TrendingUp } from 'lucide-react'
import { usePropertiesStore } from '@/store/properties'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'

// Mock data for demonstration
const mockProperties = [
  {
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
    description: 'Luxury apartment building in the heart of Manhattan with stunning city views.',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'
    ],
    amenities: ['Gym', 'Rooftop Terrace', 'Concierge', 'Laundry', 'Parking'],
    isActive: true,
    totalUnits: 24,
    occupiedUnits: 22,
    availableUnits: 2,
    averageRent: 4200,
    monthlyRevenue: 92400,
    occupancyRate: 92
  },
  {
    id: '2',
    name: 'Brooklyn Commons',
    address: '789 Atlantic Avenue',
    city: 'Brooklyn',
    state: 'NY',
    zipCode: '11217',
    type: 'APARTMENT',
    bedrooms: 2,
    bathrooms: 1,
    squareFeet: 900,
    description: 'Modern apartment complex in trendy Brooklyn neighborhood.',
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'
    ],
    amenities: ['Gym', 'Courtyard', 'Pet Friendly', 'Bike Storage'],
    isActive: true,
    totalUnits: 18,
    occupiedUnits: 16,
    availableUnits: 2,
    averageRent: 3100,
    monthlyRevenue: 49600,
    occupancyRate: 89
  },
  {
    id: '3',
    name: 'Queens Garden Apartments',
    address: '321 Northern Boulevard',
    city: 'Queens',
    state: 'NY',
    zipCode: '11354',
    type: 'APARTMENT',
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 650,
    description: 'Affordable housing in a quiet Queens neighborhood.',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'
    ],
    amenities: ['Parking', 'Laundry', 'Garden'],
    isActive: true,
    totalUnits: 12,
    occupiedUnits: 11,
    availableUnits: 1,
    averageRent: 2400,
    monthlyRevenue: 26400,
    occupancyRate: 92
  }
]

export default function PropertiesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [properties, setProperties] = useState(mockProperties)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading properties
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [])

  const filteredProperties = properties.filter(property =>
    property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.city.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalUnits = properties.reduce((sum, p) => sum + p.totalUnits, 0)
  const totalOccupied = properties.reduce((sum, p) => sum + p.occupiedUnits, 0)
  const totalRevenue = properties.reduce((sum, p) => sum + p.monthlyRevenue, 0)
  const averageOccupancy = totalUnits > 0 ? (totalOccupied / totalUnits) * 100 : 0

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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
          <p className="text-gray-600 mt-1">
            Manage your property portfolio
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Property
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{properties.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Units</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUnits}</div>
            <p className="text-xs text-muted-foreground">{totalOccupied} occupied</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageOccupancy.toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search properties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <Link key={property.id} href={`/properties/${property.id}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <div className="relative">
                <img
                  src={property.images[0]}
                  alt={property.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    property.availableUnits > 0 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {property.availableUnits} / {property.totalUnits} Available
                  </span>
                </div>
              </div>
              
              <CardHeader>
                <CardTitle className="text-xl">{property.name}</CardTitle>
                <CardDescription className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {property.address}, {property.city}, {property.state}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center">
                    <Bed className="h-4 w-4 mr-1" />
                    {property.bedrooms} beds
                  </div>
                  <div className="flex items-center">
                    <Bath className="h-4 w-4 mr-1" />
                    {property.bathrooms} baths
                  </div>
                  <div className="flex items-center">
                    <Square className="h-4 w-4 mr-1" />
                    {property.squareFeet} sq ft
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Avg. Rent</p>
                    <p className="text-lg font-semibold">{formatCurrency(property.averageRent)}/mo</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Occupancy</p>
                    <p className="text-lg font-semibold">{property.occupancyRate}%</p>
                  </div>
                </div>

                <div className="border-t pt-3">
                  <p className="text-sm text-gray-600">Monthly Revenue</p>
                  <p className="text-xl font-bold text-green-600">{formatCurrency(property.monthlyRevenue)}</p>
                </div>

                <div className="flex flex-wrap gap-1">
                  {property.amenities.slice(0, 3).map((amenity) => (
                    <span
                      key={amenity}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      {amenity}
                    </span>
                  ))}
                  {property.amenities.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      +{property.amenities.length - 3} more
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {filteredProperties.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No properties found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery ? 'Try adjusting your search criteria.' : 'Get started by adding your first property.'}
          </p>
          {!searchQuery && (
            <div className="mt-6">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Property
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

