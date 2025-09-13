'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Plus, Search, Phone, Mail, MapPin, Calendar, DollarSign } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

// Mock data for demonstration
const mockTenants = [
  {
    id: '1',
    name: 'Mike Davis',
    email: 'mike.davis@email.com',
    phone: '+1 (555) 345-6789',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    lease: {
      id: '1',
      property: 'Manhattan Heights',
      unit: '2B',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      monthlyRent: 4500,
      status: 'ACTIVE'
    },
    paymentHistory: {
      totalPaid: 40500,
      lastPayment: '2024-09-01',
      nextDue: '2024-10-01'
    }
  },
  {
    id: '2',
    name: 'Emily Wilson',
    email: 'emily.wilson@email.com',
    phone: '+1 (555) 456-7890',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
    lease: {
      id: '2',
      property: 'Brooklyn Commons',
      unit: '3A',
      startDate: '2024-03-01',
      endDate: '2025-02-28',
      monthlyRent: 2800,
      status: 'ACTIVE'
    },
    paymentHistory: {
      totalPaid: 16800,
      lastPayment: '2024-09-01',
      nextDue: '2024-10-01'
    }
  },
  {
    id: '3',
    name: 'John Rodriguez',
    email: 'john.rodriguez@email.com',
    phone: '+1 (555) 567-8901',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    lease: {
      id: '3',
      property: 'Queens Garden Apartments',
      unit: '1B',
      startDate: '2024-06-01',
      endDate: '2025-05-31',
      monthlyRent: 2200,
      status: 'ACTIVE'
    },
    paymentHistory: {
      totalPaid: 8800,
      lastPayment: '2024-09-01',
      nextDue: '2024-10-01'
    }
  },
  {
    id: '4',
    name: 'Sarah Chen',
    email: 'sarah.chen@email.com',
    phone: '+1 (555) 678-9012',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    lease: {
      id: '4',
      property: 'Manhattan Heights',
      unit: '1A',
      startDate: '2023-12-01',
      endDate: '2024-11-30',
      monthlyRent: 3500,
      status: 'EXPIRING_SOON'
    },
    paymentHistory: {
      totalPaid: 35000,
      lastPayment: '2024-09-01',
      nextDue: '2024-10-01'
    }
  }
]

export default function TenantsPage() {
  const [tenants, setTenants] = useState(mockTenants)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [])

  const filteredTenants = tenants.filter(tenant =>
    tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tenant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tenant.lease.property.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
          <h1 className="text-3xl font-bold text-gray-900">Tenants</h1>
          <p className="text-gray-600 mt-1">
            Manage your tenant relationships
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Tenant
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search tenants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tenants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tenants.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Leases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tenants.filter(t => t.lease.status === 'ACTIVE').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {tenants.filter(t => t.lease.status === 'EXPIRING_SOON').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(tenants.reduce((sum, t) => sum + t.lease.monthlyRent, 0))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tenants Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTenants.map((tenant) => (
          <Card key={tenant.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <img
                  src={tenant.avatar}
                  alt={tenant.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <CardTitle className="text-lg">{tenant.name}</CardTitle>
                  <CardDescription className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {tenant.lease.property} - Unit {tenant.lease.unit}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    tenant.lease.status === 'ACTIVE' 
                      ? 'bg-green-100 text-green-800'
                      : tenant.lease.status === 'EXPIRING_SOON'
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {tenant.lease.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Contact Info */}
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  {tenant.email}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  {tenant.phone}
                </div>
              </div>

              {/* Lease Info */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-gray-600">Monthly Rent</p>
                  <p className="font-semibold">{formatCurrency(tenant.lease.monthlyRent)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Lease End</p>
                  <p className="font-semibold">{formatDate(tenant.lease.endDate)}</p>
                </div>
              </div>

              {/* Payment Info */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <p className="text-sm text-gray-600">Last Payment</p>
                  <p className="font-semibold">{formatDate(tenant.paymentHistory.lastPayment)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Next Due</p>
                  <p className="font-semibold">{formatDate(tenant.paymentHistory.nextDue)}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2 pt-4">
                <Button variant="outline" size="sm" className="flex-1">
                  View Details
                </Button>
                <Button variant="outline" size="sm">
                  <Mail className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Phone className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTenants.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No tenants found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery ? 'Try adjusting your search criteria.' : 'Get started by adding your first tenant.'}
          </p>
          {!searchQuery && (
            <div className="mt-6">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Tenant
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

