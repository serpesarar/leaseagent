'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { RouteGuard } from '@/components/route-guard'
import { UserRole, PaymentStatus, PaymentMethod } from '@prisma/client'
import {
  Search,
  DollarSign,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  CreditCard,
  Download,
  Send,
  Plus,
  TrendingUp,
  TrendingDown,
  Users,
  Building2
} from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface Payment {
  id: string
  amount: number
  dueDate: string
  paidDate?: string
  status: PaymentStatus
  method?: PaymentMethod
  description: string
  tenant: {
    id: string
    name: string
    email: string
  }
  property: {
    id: string
    name: string
  }
  unit: {
    id: string
    unitNumber: string
  }
  lease: {
    id: string
    monthlyRent: number
  }
  lateFee?: number
  transactionId?: string
  stripePaymentIntentId?: string
  notes?: string
}

interface PaymentSummary {
  totalCollected: number
  totalPending: number
  totalOverdue: number
  collectionRate: number
  averageDaysLate: number
  totalTenants: number
  totalProperties: number
}

// Mock data
const mockPayments: Payment[] = [
  {
    id: '1',
    amount: 3500,
    dueDate: '2024-10-01',
    paidDate: '2024-09-30',
    status: PaymentStatus.PAID,
    method: PaymentMethod.BANK_TRANSFER,
    description: 'October 2024 Rent',
    tenant: {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@email.com'
    },
    property: {
      id: '1',
      name: 'Manhattan Heights'
    },
    unit: {
      id: '1',
      unitNumber: '1A'
    },
    lease: {
      id: '1',
      monthlyRent: 3500
    },
    transactionId: 'txn_1234567890'
  },
  {
    id: '2',
    amount: 2800,
    dueDate: '2024-10-01',
    status: PaymentStatus.PENDING,
    description: 'October 2024 Rent',
    tenant: {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com'
    },
    property: {
      id: '1',
      name: 'Manhattan Heights'
    },
    unit: {
      id: '2',
      unitNumber: '2A'
    },
    lease: {
      id: '2',
      monthlyRent: 2800
    }
  },
  {
    id: '3',
    amount: 3200,
    dueDate: '2024-09-01',
    status: PaymentStatus.OVERDUE,
    description: 'September 2024 Rent',
    tenant: {
      id: '3',
      name: 'Mike Wilson',
      email: 'mike.w@email.com'
    },
    property: {
      id: '2',
      name: 'Brooklyn Gardens'
    },
    unit: {
      id: '3',
      unitNumber: '1B'
    },
    lease: {
      id: '3',
      monthlyRent: 3200
    },
    lateFee: 150
  }
]

const mockSummary: PaymentSummary = {
  totalCollected: 45600,
  totalPending: 8400,
  totalOverdue: 3350,
  collectionRate: 87.5,
  averageDaysLate: 5.2,
  totalTenants: 24,
  totalProperties: 3
}

export default function PaymentsPage() {
  const { toast } = useToast()
  const [payments, setPayments] = useState<Payment[]>([])
  const [summary, setSummary] = useState<PaymentSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [propertyFilter, setPropertyFilter] = useState<string>('all')
  const [showReminderDialog, setShowReminderDialog] = useState(false)
  const [selectedPayments, setSelectedPayments] = useState<string[]>([])

  useEffect(() => {
    fetchPayments()
    fetchSummary()
  }, [])

  const fetchPayments = async () => {
    try {
      setIsLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      setPayments(mockPayments)
    } catch (error) {
      console.error('Error fetching payments:', error)
      toast({
        title: 'Error loading payments',
        description: 'Please try again later.',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSummary = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300))
      setSummary(mockSummary)
    } catch (error) {
      console.error('Error fetching summary:', error)
    }
  }

  const getStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PAID:
        return 'bg-green-100 text-green-800'
      case PaymentStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800'
      case PaymentStatus.OVERDUE:
        return 'bg-red-100 text-red-800'
      case PaymentStatus.FAILED:
        return 'bg-red-100 text-red-800'
      case PaymentStatus.CANCELLED:
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PAID:
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case PaymentStatus.PENDING:
        return <Clock className="h-4 w-4 text-yellow-600" />
      case PaymentStatus.OVERDUE:
      case PaymentStatus.FAILED:
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getDaysOverdue = (dueDate: string) => {
    const due = new Date(dueDate)
    const today = new Date()
    const diffTime = today.getTime() - due.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.tenant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.unit.unitNumber.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter
    const matchesProperty = propertyFilter === 'all' || payment.property.id === propertyFilter

    return matchesSearch && matchesStatus && matchesProperty
  })

  const handleSendReminder = async (paymentIds: string[]) => {
    try {
      // Simulate API call to send reminders
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: 'Reminders sent',
        description: `Payment reminders sent to ${paymentIds.length} tenant(s).`
      })
      
      setShowReminderDialog(false)
      setSelectedPayments([])
    } catch (error) {
      toast({
        title: 'Error sending reminders',
        description: 'Please try again.',
        variant: 'destructive'
      })
    }
  }

  const handleExportPayments = () => {
    // Simulate CSV export
    const csvData = filteredPayments.map(p => ({
      'Tenant': p.tenant.name,
      'Property': p.property.name,
      'Unit': p.unit.unitNumber,
      'Amount': p.amount,
      'Due Date': p.dueDate,
      'Paid Date': p.paidDate || 'N/A',
      'Status': p.status,
      'Method': p.method || 'N/A'
    }))
    
    console.log('Exporting payments:', csvData)
    toast({
      title: 'Export started',
      description: 'Your payment report will be downloaded shortly.'
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <RouteGuard allowedRoles={[UserRole.COMPANY_OWNER, UserRole.PROPERTY_MANAGER, UserRole.ACCOUNTANT]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
            <p className="text-gray-600 mt-1">
              Track rent payments and manage collections
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={handleExportPayments}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Dialog open={showReminderDialog} onOpenChange={setShowReminderDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Send className="h-4 w-4 mr-2" />
                  Send Reminders
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Send Payment Reminders</DialogTitle>
                  <DialogDescription>
                    Send automated payment reminders to tenants with pending or overdue payments.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    This will send email reminders to all tenants with pending or overdue payments.
                  </p>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowReminderDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => handleSendReminder(payments.filter(p => p.status !== PaymentStatus.PAID).map(p => p.id))}>
                      Send Reminders
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Collected</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  ${summary.totalCollected.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  This month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  ${summary.totalPending.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Awaiting payment
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                <TrendingDown className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  ${summary.totalOverdue.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Past due date
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Collection Rate</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {summary.collectionRate}%
                </div>
                <p className="text-xs text-muted-foreground">
                  On-time payments
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by tenant, property, or unit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Payment Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value={PaymentStatus.PAID}>Paid</SelectItem>
              <SelectItem value={PaymentStatus.PENDING}>Pending</SelectItem>
              <SelectItem value={PaymentStatus.OVERDUE}>Overdue</SelectItem>
              <SelectItem value={PaymentStatus.FAILED}>Failed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={propertyFilter} onValueChange={setPropertyFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Property" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Properties</SelectItem>
              <SelectItem value="1">Manhattan Heights</SelectItem>
              <SelectItem value="2">Brooklyn Gardens</SelectItem>
              <SelectItem value="3">Queens Plaza</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Payments Table */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Records</CardTitle>
            <CardDescription>
              Detailed view of all rent payments ({filteredPayments.length} records)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tenant</TableHead>
                    <TableHead>Property/Unit</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{payment.tenant.name}</p>
                          <p className="text-sm text-gray-500">{payment.tenant.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{payment.property.name}</p>
                          <p className="text-sm text-gray-500">Unit {payment.unit.unitNumber}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">${payment.amount.toLocaleString()}</p>
                          {payment.lateFee && (
                            <p className="text-sm text-red-600">+${payment.lateFee} late fee</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{new Date(payment.dueDate).toLocaleDateString()}</p>
                          {payment.status === PaymentStatus.OVERDUE && (
                            <p className="text-xs text-red-600">
                              {getDaysOverdue(payment.dueDate)} days overdue
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(payment.status)}
                          <Badge className={getStatusColor(payment.status)}>
                            {payment.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          {payment.method === PaymentMethod.CREDIT_CARD && <CreditCard className="h-4 w-4" />}
                          <span className="text-sm">
                            {payment.method ? payment.method.replace('_', ' ') : 'N/A'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {payment.status === PaymentStatus.OVERDUE && (
                            <Button size="sm" variant="outline">
                              <Send className="h-3 w-3 mr-1" />
                              Remind
                            </Button>
                          )}
                          <Button size="sm" variant="ghost">
                            View
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredPayments.length === 0 && (
                <div className="text-center py-12">
                  <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No payments found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchQuery || statusFilter !== 'all' || propertyFilter !== 'all'
                      ? 'Try adjusting your search criteria.'
                      : 'Payment records will appear here once tenants start making payments.'
                    }
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </RouteGuard>
  )
}