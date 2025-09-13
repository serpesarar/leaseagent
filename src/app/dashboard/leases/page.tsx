'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Plus, Search, FileText, Calendar, DollarSign, MapPin, AlertTriangle, FileText as FileTextIcon, DollarSign as DollarSignIcon, RefreshCw as RefreshCwIcon, ChevronRight as ChevronRightIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { formatCurrency, formatDate } from '@/lib/utils'

// Mock data for demonstration
const mockLeases = [
  {
    id: '1',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    monthlyRent: 4500,
    deposit: 4500,
    status: 'ACTIVE',
    terms: 'Standard residential lease agreement with 12-month term.',
    tenant: {
      name: 'Mike Davis',
      email: 'mike.davis@email.com',
      phone: '+1 (555) 345-6789',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
    },
    property: {
      name: 'Manhattan Heights',
      address: '456 Park Avenue',
      unit: '2B'
    },
    daysUntilExpiry: 82,
    paymentHistory: {
      totalPaid: 40500,
      outstandingAmount: 0,
      lastPayment: '2024-09-01'
    }
  },
  {
    id: '2',
    startDate: '2024-03-01',
    endDate: '2025-02-28',
    monthlyRent: 2800,
    deposit: 2800,
    status: 'ACTIVE',
    terms: 'Standard residential lease agreement with 12-month term.',
    tenant: {
      name: 'Emily Wilson',
      email: 'emily.wilson@email.com',
      phone: '+1 (555) 456-7890',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150'
    },
    property: {
      name: 'Brooklyn Commons',
      address: '789 Atlantic Avenue',
      unit: '3A'
    },
    daysUntilExpiry: 151,
    paymentHistory: {
      totalPaid: 16800,
      outstandingAmount: 2800,
      lastPayment: '2024-08-01'
    }
  },
  {
    id: '3',
    startDate: '2023-12-01',
    endDate: '2024-11-30',
    monthlyRent: 3500,
    deposit: 3500,
    status: 'EXPIRING_SOON',
    terms: 'Standard residential lease agreement with 12-month term.',
    tenant: {
      name: 'Sarah Chen',
      email: 'sarah.chen@email.com',
      phone: '+1 (555) 678-9012',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150'
    },
    property: {
      name: 'Manhattan Heights',
      address: '456 Park Avenue',
      unit: '1A'
    },
    daysUntilExpiry: 61,
    paymentHistory: {
      totalPaid: 35000,
      outstandingAmount: 0,
      lastPayment: '2024-09-01'
    }
  },
  {
    id: '4',
    startDate: '2024-06-01',
    endDate: '2025-05-31',
    monthlyRent: 2200,
    deposit: 2200,
    status: 'ACTIVE',
    terms: 'Standard residential lease agreement with 12-month term.',
    tenant: {
      name: 'John Rodriguez',
      email: 'john.rodriguez@email.com',
      phone: '+1 (555) 567-8901',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
    },
    property: {
      name: 'Queens Garden Apartments',
      address: '321 Northern Boulevard',
      unit: '1B'
    },
    daysUntilExpiry: 243,
    paymentHistory: {
      totalPaid: 6600,
      outstandingAmount: 2200,
      lastPayment: '2024-08-01'
    }
  },
  {
    id: '5',
    startDate: '2023-09-01',
    endDate: '2024-08-31',
    monthlyRent: 3200,
    deposit: 3200,
    status: 'EXPIRED',
    terms: 'Standard residential lease agreement with 12-month term.',
    tenant: {
      name: 'Lisa Park',
      email: 'lisa.park@email.com',
      phone: '+1 (555) 789-0123',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'
    },
    property: {
      name: 'Brooklyn Commons',
      address: '789 Atlantic Avenue',
      unit: '2A'
    },
    daysUntilExpiry: -11,
    paymentHistory: {
      totalPaid: 38400,
      outstandingAmount: 0,
      lastPayment: '2024-08-01'
    }
  }
]

const statusConfig = {
  DRAFT: { color: 'bg-gray-100 text-gray-800', priority: 0 },
  ACTIVE: { color: 'bg-green-100 text-green-800', priority: 1 },
  EXPIRING_SOON: { color: 'bg-orange-100 text-orange-800', priority: 2 },
  EXPIRED: { color: 'bg-red-100 text-red-800', priority: 3 },
  TERMINATED: { color: 'bg-red-100 text-red-800', priority: 4 },
  RENEWED: { color: 'bg-blue-100 text-blue-800', priority: 5 }
}

export default function LeasesPage() {
  const [leases, setLeases] = useState(mockLeases)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [])

  const filteredLeases = leases.filter(lease => {
    const matchesSearch = 
      lease.tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lease.property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lease.property.unit.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'ALL' || lease.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const totalMonthlyRevenue = leases
    .filter(lease => lease.status === 'ACTIVE')
    .reduce((sum, lease) => sum + lease.monthlyRent, 0)

  const expiringLeases = leases.filter(lease => 
    lease.status === 'EXPIRING_SOON' || (lease.daysUntilExpiry > 0 && lease.daysUntilExpiry <= 90)
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900">
      {/* Animated Header + Action */}
      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Lease Agreements
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Manage tenant lease agreements and renewals
          </p>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Lease
        </motion.button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8">
        {/* Active Leases */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white shadow-2xl"
        >
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <FileTextIcon className="w-8 h-8 text-white/80" />
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">+12%</span>
            </div>
            <h3 className="text-3xl font-bold mb-1">{leases.filter(l => l.status === 'ACTIVE').length}</h3>
            <p className="text-white/80">Active Leases</p>
          </div>
        </motion.div>

        {/* Monthly Revenue */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 p-6 text-white shadow-2xl"
        >
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <DollarSignIcon className="w-8 h-8 text-white/80" />
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">+8%</span>
            </div>
            <h3 className="text-3xl font-bold mb-1">{formatCurrency(totalMonthlyRevenue)}</h3>
            <p className="text-white/80">Monthly Revenue</p>
          </div>
        </motion.div>

        {/* Renewal Rate */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 p-6 text-white shadow-2xl"
        >
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <RefreshCwIcon className="w-8 h-8 text-white/80" />
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">95%</span>
            </div>
            <h3 className="text-3xl font-bold mb-1">95%</h3>
            <p className="text-white/80">Renewal Rate</p>
          </div>
        </motion.div>
      </div>

      {/* Modern list/table */}
      <div className="p-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">All Leases</h2>
              <input
                type="search"
                placeholder="Search leases..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredLeases.map((lease, index) => (
              <motion.div
                key={lease.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                      {lease.tenant.name
                        .split(' ')
                        .map((n: string) => n[0])
                        .slice(0, 2)
                        .join('')}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{lease.tenant.name}</h3>
                      <p className="text-sm text-gray-500">Unit {lease.property.unit} • {formatCurrency(lease.monthlyRent)}/month</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full text-sm font-medium">
                      {lease.status === 'EXPIRED' ? 'Expired' : 'Active'}
                    </span>
                    <ChevronRightIcon className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:shadow-3xl transition-all duration-300"
        aria-label="Create new lease"
      >
        <Plus className="w-6 h-6" />
      </motion.button>
    </div>
  )
}

