'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Plus, Search, Star, Phone, Mail, Globe, MapPin, Wrench, Clock, CheckCircle } from 'lucide-react'

// Mock data for demonstration
const mockContractors = [
  {
    id: '1',
    name: 'Elite Plumbing Services',
    email: 'contact@eliteplumbing.com',
    phone: '+1 (555) 123-4567',
    address: '123 Service Ave, New York, NY 10001',
    website: 'https://eliteplumbing.com',
    description: 'Professional plumbing services with 24/7 emergency support. Licensed and insured.',
    specialties: ['PLUMBING', 'HVAC'],
    rating: 4.8,
    totalJobs: 145,
    completedJobs: 142,
    status: 'ACTIVE',
    hourlyRate: 85,
    isPreferred: true,
    licenseNumber: 'PL-2024-001',
    insuranceInfo: {
      provider: 'State Farm',
      policyNumber: 'SF-123456',
      expiryDate: '2024-12-31'
    },
    availability: {
      immediate: true,
      next24h: true,
      weekends: true
    }
  },
  {
    id: '2',
    name: 'NYC Electrical Solutions',
    email: 'info@nycelectrical.com',
    phone: '+1 (555) 234-5678',
    address: '456 Electric St, Brooklyn, NY 11201',
    website: 'https://nycelectrical.com',
    description: 'Certified electrical contractors specializing in residential and commercial work.',
    specialties: ['ELECTRICAL', 'SECURITY'],
    rating: 4.6,
    totalJobs: 98,
    completedJobs: 95,
    status: 'ACTIVE',
    hourlyRate: 95,
    isPreferred: false,
    licenseNumber: 'EL-2024-002',
    insuranceInfo: {
      provider: 'Liberty Mutual',
      policyNumber: 'LM-789012',
      expiryDate: '2024-11-30'
    },
    availability: {
      immediate: false,
      next24h: true,
      weekends: false
    }
  },
  {
    id: '3',
    name: 'Metro Appliance Repair',
    email: 'service@metroappliance.com',
    phone: '+1 (555) 345-6789',
    address: '789 Repair Blvd, Queens, NY 11354',
    description: 'Expert appliance repair and maintenance for all major brands.',
    specialties: ['APPLIANCE'],
    rating: 4.4,
    totalJobs: 67,
    completedJobs: 63,
    status: 'ACTIVE',
    hourlyRate: 75,
    isPreferred: false,
    licenseNumber: 'AP-2024-003',
    insuranceInfo: {
      provider: 'Allstate',
      policyNumber: 'AS-345678',
      expiryDate: '2025-01-15'
    },
    availability: {
      immediate: true,
      next24h: true,
      weekends: true
    }
  },
  {
    id: '4',
    name: 'General Maintenance Co.',
    email: 'contact@generalmaint.com',
    phone: '+1 (555) 456-7890',
    address: '321 Fix-It Lane, Bronx, NY 10451',
    description: 'Full-service maintenance company handling all types of property repairs.',
    specialties: ['GENERAL', 'STRUCTURAL', 'CLEANING'],
    rating: 4.2,
    totalJobs: 203,
    completedJobs: 195,
    status: 'ACTIVE',
    hourlyRate: 65,
    isPreferred: true,
    licenseNumber: 'GM-2024-004',
    insuranceInfo: {
      provider: 'Progressive',
      policyNumber: 'PR-901234',
      expiryDate: '2024-10-31'
    },
    availability: {
      immediate: false,
      next24h: false,
      weekends: true
    }
  }
]

const specialtyColors = {
  PLUMBING: 'bg-blue-100 text-blue-800',
  ELECTRICAL: 'bg-yellow-100 text-yellow-800',
  APPLIANCE: 'bg-green-100 text-green-800',
  HVAC: 'bg-purple-100 text-purple-800',
  STRUCTURAL: 'bg-gray-100 text-gray-800',
  PEST_CONTROL: 'bg-red-100 text-red-800',
  CLEANING: 'bg-cyan-100 text-cyan-800',
  SECURITY: 'bg-indigo-100 text-indigo-800',
  LANDSCAPING: 'bg-emerald-100 text-emerald-800',
  GENERAL: 'bg-slate-100 text-slate-800'
}

export default function ContractorsPage() {
  const [contractors, setContractors] = useState(mockContractors)
  const [searchQuery, setSearchQuery] = useState('')
  const [specialtyFilter, setSpecialtyFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [])

  const filteredContractors = contractors.filter(contractor => {
    const matchesSearch = 
      contractor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contractor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contractor.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesSpecialty = specialtyFilter === 'ALL' || contractor.specialties.includes(specialtyFilter as any)
    const matchesStatus = statusFilter === 'ALL' || contractor.status === statusFilter

    return matchesSearch && matchesSpecialty && matchesStatus
  })

  const averageRating = contractors.reduce((sum, c) => sum + c.rating, 0) / contractors.length
  const totalActiveJobs = contractors.reduce((sum, c) => sum + (c.totalJobs - c.completedJobs), 0)
  const preferredContractors = contractors.filter(c => c.isPreferred).length

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
          <h1 className="text-3xl font-bold text-gray-900">Contractors</h1>
          <p className="text-gray-600 mt-1">
            Manage your network of service providers
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Contractor
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contractors</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contractors.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Out of 5.0</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalActiveJobs}</div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Preferred</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{preferredContractors}</div>
            <p className="text-xs text-muted-foreground">Preferred partners</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search contractors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={specialtyFilter}
          onChange={(e) => setSpecialtyFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="ALL">All Specialties</option>
          <option value="PLUMBING">Plumbing</option>
          <option value="ELECTRICAL">Electrical</option>
          <option value="APPLIANCE">Appliance</option>
          <option value="HVAC">HVAC</option>
          <option value="STRUCTURAL">Structural</option>
          <option value="GENERAL">General</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="ALL">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="SUSPENDED">Suspended</option>
        </select>
      </div>

      {/* Contractors Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredContractors.map((contractor) => (
          <Card key={contractor.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <span>{contractor.name}</span>
                    {contractor.isPreferred && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        Preferred
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription>{contractor.description}</CardDescription>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">{contractor.rating}</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Contact Info */}
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  {contractor.email}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  {contractor.phone}
                </div>
                {contractor.website && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Globe className="h-4 w-4 mr-2" />
                    <a href={contractor.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      Website
                    </a>
                  </div>
                )}
                {contractor.address && (
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {contractor.address}
                  </div>
                )}
              </div>

              {/* Specialties */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Specialties:</p>
                <div className="flex flex-wrap gap-1">
                  {contractor.specialties.map((specialty) => (
                    <span
                      key={specialty}
                      className={`px-2 py-1 text-xs rounded-full font-medium ${
                        specialtyColors[specialty as keyof typeof specialtyColors] || 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {specialty.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-2 border-t">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Hourly Rate</p>
                  <p className="font-semibold">${contractor.hourlyRate}/hr</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="font-semibold">{contractor.completedJobs}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Success Rate</p>
                  <p className="font-semibold">
                    {((contractor.completedJobs / contractor.totalJobs) * 100).toFixed(0)}%
                  </p>
                </div>
              </div>

              {/* Availability */}
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${contractor.availability.immediate ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span>Available Now</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${contractor.availability.weekends ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span>Weekends</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  View Details
                </Button>
                <Button variant="outline" size="sm">
                  <Mail className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button size="sm">
                  Assign Job
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredContractors.length === 0 && (
        <div className="text-center py-12">
          <Wrench className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No contractors found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery || specialtyFilter !== 'ALL' || statusFilter !== 'ALL' 
              ? 'Try adjusting your search criteria or filters.' 
              : 'Get started by adding your first contractor.'}
          </p>
          {!searchQuery && specialtyFilter === 'ALL' && statusFilter === 'ALL' && (
            <div className="mt-6">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Contractor
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

