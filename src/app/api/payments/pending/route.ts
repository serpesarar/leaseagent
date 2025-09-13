import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { 
  withAuth, 
  withErrorHandling, 
  withMiddleware,
  createApiResponse
} from '@/lib/api-middleware'
import { UserRole } from '@prisma/client'

// GET /api/payments/pending - Get pending payments
async function getPendingPayments(request: NextRequest, session: any) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const propertyId = searchParams.get('propertyId')
  const overdueDays = parseInt(searchParams.get('overdueDays') || '0')

  const skip = (page - 1) * limit
  const now = new Date()

  let where: any = {
    lease: {
      unit: {
        property: {
          companyId: session.user.companyId
        }
      }
    },
    status: { in: ['PENDING', 'OVERDUE'] }
  }

  // Filter by property if specified
  if (propertyId) {
    where.lease.unit.propertyId = propertyId
  }

  // Filter by overdue days
  if (overdueDays > 0) {
    const overdueDate = new Date()
    overdueDate.setDate(overdueDate.getDate() - overdueDays)
    where.dueDate = { lte: overdueDate }
    where.status = 'OVERDUE'
  }

  // For tenants, only show their own payments
  if (session.user.role === 'TENANT') {
    where.lease.tenantId = session.user.id
  }

  const [payments, total] = await Promise.all([
    prisma.payment.findMany({
      where,
      skip,
      take: limit,
      include: {
        lease: {
          include: {
            tenant: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true
              }
            },
            unit: {
              select: {
                id: true,
                unitNumber: true,
                property: {
                  select: {
                    id: true,
                    name: true,
                    address: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: [
        { status: 'desc' }, // OVERDUE first
        { dueDate: 'asc' }
      ]
    }),
    prisma.payment.count({ where })
  ])

  // Calculate days overdue for each payment
  const paymentsWithOverdue = payments.map(payment => {
    const daysOverdue = payment.status === 'OVERDUE' 
      ? Math.max(0, Math.floor((now.getTime() - payment.dueDate.getTime()) / (1000 * 60 * 60 * 24)))
      : 0

    return {
      ...payment,
      daysOverdue,
      isOverdue: payment.status === 'OVERDUE',
      isDueSoon: !payment.daysOverdue && payment.dueDate <= new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // Due within 7 days
    }
  })

  // Calculate summary statistics
  const summary = {
    totalPending: payments.length,
    totalAmount: payments.reduce((sum, p) => sum + p.amount, 0),
    overdueCount: payments.filter(p => p.status === 'OVERDUE').length,
    overdueAmount: payments.filter(p => p.status === 'OVERDUE').reduce((sum, p) => sum + p.amount, 0),
    dueSoonCount: paymentsWithOverdue.filter(p => p.isDueSoon).length
  }

  return NextResponse.json(createApiResponse({
    payments: paymentsWithOverdue,
    summary,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  }))
}

const getHandler = withMiddleware(
  withAuth(getPendingPayments, [
    UserRole.COMPANY_OWNER, 
    UserRole.PROPERTY_MANAGER, 
    UserRole.ACCOUNTANT, 
    UserRole.TENANT
  ]),
  [withErrorHandling]
)

export { getHandler as GET }

