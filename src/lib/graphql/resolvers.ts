import { prisma } from '@/lib/prisma'
import { GraphQLError } from 'graphql'
import { analyzeIssue } from '@/lib/ai-routing'
import { sendMaintenanceUpdate, RealTimeEvents } from '@/lib/pusher'
import { UserRole, MaintenanceStatus, PaymentStatus } from '@prisma/client'

// Context type
interface GraphQLContext {
  user: {
    id: string
    email: string
    role: UserRole
    companyId: string
  } | null
}

// Auth helper
function requireAuth(context: GraphQLContext) {
  if (!context.user) {
    throw new GraphQLError('Authentication required', {
      extensions: { code: 'UNAUTHENTICATED' }
    })
  }
  return context.user
}

function requireRole(context: GraphQLContext, allowedRoles: UserRole[]) {
  const user = requireAuth(context)
  if (!allowedRoles.includes(user.role)) {
    throw new GraphQLError('Insufficient permissions', {
      extensions: { code: 'FORBIDDEN' }
    })
  }
  return user
}

export const resolvers = {
  Query: {
    // Properties
    properties: async (_: any, args: any, context: GraphQLContext) => {
      const user = requireAuth(context)
      const { page = 1, limit = 10, search, type, city } = args
      const skip = (page - 1) * limit

      const where: any = {
        companyId: user.companyId,
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { address: { contains: search, mode: 'insensitive' } }
          ]
        }),
        ...(type && { type }),
        ...(city && { city: { contains: city, mode: 'insensitive' } })
      }

      const [properties, total] = await Promise.all([
        prisma.property.findMany({
          where,
          skip,
          take: limit,
          include: {
            units: {
              include: {
                lease: {
                  where: { status: 'ACTIVE' }
                }
              }
            },
            _count: {
              select: {
                maintenanceRequests: {
                  where: { status: { in: ['PENDING', 'IN_PROGRESS'] } }
                }
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }),
        prisma.property.count({ where })
      ])

      return {
        properties,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    },

    property: async (_: any, { id }: { id: string }, context: GraphQLContext) => {
      const user = requireAuth(context)
      
      const property = await prisma.property.findFirst({
        where: {
          id,
          companyId: user.companyId
        },
        include: {
          units: {
            include: {
              lease: {
                include: {
                  tenant: true
                }
              }
            }
          },
          maintenanceRequests: {
            where: { status: { in: ['PENDING', 'IN_PROGRESS'] } },
            include: {
              requester: true,
              assignedContractor: true
            },
            orderBy: { createdAt: 'desc' },
            take: 10
          }
        }
      })

      if (!property) {
        throw new GraphQLError('Property not found', {
          extensions: { code: 'NOT_FOUND' }
        })
      }

      return property
    },

    // Complex Property Dashboard Query
    propertyDashboard: async (_: any, { propertyId }: { propertyId: string }, context: GraphQLContext) => {
      const user = requireAuth(context)
      
      const property = await prisma.property.findFirst({
        where: {
          id: propertyId,
          companyId: user.companyId
        },
        include: {
          units: {
            include: {
              lease: {
                include: {
                  tenant: true,
                  payments: {
                    where: { status: 'PENDING' },
                    orderBy: { dueDate: 'asc' },
                    take: 1
                  }
                }
              },
              maintenanceRequests: {
                where: { status: { in: ['PENDING', 'IN_PROGRESS'] } }
              }
            }
          }
        }
      })

      if (!property) {
        throw new GraphQLError('Property not found')
      }

      // Get recent maintenance requests
      const recentMaintenanceRequests = await prisma.maintenanceRequest.findMany({
        where: { propertyId },
        include: {
          requester: true,
          assignedContractor: true
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      })

      // Get upcoming lease expirations (next 90 days)
      const ninetyDaysFromNow = new Date()
      ninetyDaysFromNow.setDate(ninetyDaysFromNow.getDate() + 90)
      
      const upcomingLeaseExpirations = await prisma.lease.findMany({
        where: {
          unit: { propertyId },
          endDate: { lte: ninetyDaysFromNow },
          status: 'ACTIVE'
        },
        include: {
          tenant: true,
          unit: true
        },
        orderBy: { endDate: 'asc' }
      })

      // Get maintenance by category
      const maintenanceByCategory = await prisma.maintenanceRequest.groupBy({
        by: ['category'],
        where: { propertyId },
        _count: { id: true }
      })

      // Get revenue by month (last 12 months)
      const twelveMonthsAgo = new Date()
      twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12)
      
      const revenueByMonth = await prisma.payment.groupBy({
        by: ['paidDate'],
        where: {
          lease: { unit: { propertyId } },
          status: 'PAID',
          paidDate: { gte: twelveMonthsAgo }
        },
        _sum: { amount: true }
      })

      // Calculate metrics
      const occupiedUnits = property.units.filter(unit => 
        unit.lease && unit.lease.status === 'ACTIVE'
      ).length
      
      const monthlyRevenue = property.units.reduce((sum, unit) => {
        if (unit.lease && unit.lease.status === 'ACTIVE') {
          return sum + (unit.rent || 0)
        }
        return sum
      }, 0)

      const occupancyRate = property.units.length > 0 
        ? (occupiedUnits / property.units.length) * 100 
        : 0

      return {
        property,
        units: property.units.map(unit => ({
          unit,
          tenant: unit.lease?.tenant || null,
          leaseStatus: unit.lease?.status || null,
          pendingIssues: unit.maintenanceRequests,
          nextPaymentDue: unit.lease?.payments[0] || null
        })),
        monthlyRevenue,
        occupancyRate,
        recentMaintenanceRequests,
        upcomingLeaseExpirations,
        pendingPayments: property.units.flatMap(unit => unit.lease?.payments || []),
        maintenanceByCategory: maintenanceByCategory.map(item => ({
          category: item.category || 'Uncategorized',
          count: item._count.id
        })),
        revenueByMonth: revenueByMonth.map(item => ({
          month: item.paidDate?.toISOString().slice(0, 7) || '',
          revenue: item._sum.amount || 0
        }))
      }
    },

    // Company Dashboard
    companyDashboard: async (_: any, args: any, context: GraphQLContext) => {
      const user = requireAuth(context)
      const { dateRange, propertyIds } = args

      let propertyFilter: any = { companyId: user.companyId }
      if (propertyIds?.length) {
        propertyFilter.id = { in: propertyIds }
      }

      // Get basic counts
      const [totalProperties, totalUnits, occupiedUnits] = await Promise.all([
        prisma.property.count({ where: propertyFilter }),
        prisma.unit.count({ 
          where: { property: propertyFilter } 
        }),
        prisma.unit.count({ 
          where: { 
            property: propertyFilter,
            lease: { status: 'ACTIVE' }
          } 
        })
      ])

      // Get revenue data
      let revenueWhere: any = {
        lease: { unit: { property: propertyFilter } },
        status: 'PAID'
      }
      
      if (dateRange) {
        revenueWhere.paidDate = {
          gte: new Date(dateRange.start),
          lte: new Date(dateRange.end)
        }
      }

      const revenueData = await prisma.payment.aggregate({
        where: revenueWhere,
        _sum: { amount: true }
      })

      // Get monthly revenue for current month
      const currentMonth = new Date()
      currentMonth.setDate(1)
      const nextMonth = new Date(currentMonth)
      nextMonth.setMonth(nextMonth.getMonth() + 1)

      const monthlyRevenueData = await prisma.payment.aggregate({
        where: {
          lease: { unit: { property: propertyFilter } },
          status: 'PAID',
          paidDate: {
            gte: currentMonth,
            lt: nextMonth
          }
        },
        _sum: { amount: true }
      })

      // Recent activity
      const [recentMaintenanceRequests, upcomingLeaseExpirations, overduePayments] = await Promise.all([
        prisma.maintenanceRequest.findMany({
          where: { property: propertyFilter },
          include: { requester: true, property: true },
          orderBy: { createdAt: 'desc' },
          take: 5
        }),
        prisma.lease.findMany({
          where: {
            unit: { property: propertyFilter },
            status: 'ACTIVE',
            endDate: { lte: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) }
          },
          include: { tenant: true, unit: { include: { property: true } } },
          orderBy: { endDate: 'asc' },
          take: 5
        }),
        prisma.payment.findMany({
          where: {
            lease: { unit: { property: propertyFilter } },
            status: 'OVERDUE'
          },
          include: { lease: { include: { tenant: true, unit: { include: { property: true } } } } },
          orderBy: { dueDate: 'asc' },
          take: 10
        })
      ])

      const occupancyRate = totalUnits > 0 ? (occupiedUnits / totalUnits) * 100 : 0

      return {
        totalProperties,
        totalUnits,
        occupiedUnits,
        totalRevenue: revenueData._sum.amount || 0,
        monthlyRevenue: monthlyRevenueData._sum.amount || 0,
        occupancyRate,
        recentMaintenanceRequests,
        upcomingLeaseExpirations,
        overduePayments,
        revenueByProperty: [], // TODO: Implement
        maintenanceByPriority: [], // TODO: Implement
        occupancyTrend: [] // TODO: Implement
      }
    },

    // Maintenance requests
    maintenanceRequests: async (_: any, args: any, context: GraphQLContext) => {
      const user = requireAuth(context)
      const { page = 1, limit = 10, status, priority, propertyId } = args
      const skip = (page - 1) * limit

      let where: any = {
        companyId: user.companyId
      }

      if (status) where.status = status
      if (priority) where.priority = priority
      if (propertyId) where.propertyId = propertyId

      // For tenants, only show their own requests
      if (user.role === 'TENANT') {
        where.requesterId = user.id
      }

      const [requests, total] = await Promise.all([
        prisma.maintenanceRequest.findMany({
          where,
          skip,
          take: limit,
          include: {
            property: true,
            unit: true,
            requester: true,
            assignedContractor: true,
            contractor: true
          },
          orderBy: { createdAt: 'desc' }
        }),
        prisma.maintenanceRequest.count({ where })
      ])

      return {
        requests,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    }
  },

  Mutation: {
    // Create maintenance request
    createMaintenanceRequest: async (_: any, { input }: any, context: GraphQLContext) => {
      const user = requireAuth(context)

      // Validate property belongs to user's company
      const property = await prisma.property.findFirst({
        where: {
          id: input.propertyId,
          companyId: user.companyId
        }
      })

      if (!property) {
        throw new GraphQLError('Property not found')
      }

      const maintenanceRequest = await prisma.maintenanceRequest.create({
        data: {
          ...input,
          companyId: user.companyId,
          requesterId: user.id,
          images: input.images || []
        },
        include: {
          property: true,
          requester: true
        }
      })

      // Send real-time notification
      await sendMaintenanceUpdate(user.companyId, RealTimeEvents.MAINTENANCE_CREATED, {
        id: maintenanceRequest.id,
        title: maintenanceRequest.title,
        priority: maintenanceRequest.priority,
        property: property.name,
        requester: user.email
      })

      return maintenanceRequest
    },

    // Assign contractor
    assignContractor: async (_: any, { id, contractorId, scheduledDate, notes }: any, context: GraphQLContext) => {
      const user = requireRole(context, [UserRole.COMPANY_OWNER, UserRole.PROPERTY_MANAGER])

      const maintenanceRequest = await prisma.maintenanceRequest.findFirst({
        where: {
          id,
          companyId: user.companyId
        }
      })

      if (!maintenanceRequest) {
        throw new GraphQLError('Maintenance request not found')
      }

      const updatedRequest = await prisma.maintenanceRequest.update({
        where: { id },
        data: {
          assignedContractorId: contractorId,
          scheduledDate,
          notes,
          status: MaintenanceStatus.IN_PROGRESS
        },
        include: {
          property: true,
          assignedContractor: true
        }
      })

      // Send real-time notification
      await sendMaintenanceUpdate(user.companyId, RealTimeEvents.CONTRACTOR_ASSIGNED, {
        id: updatedRequest.id,
        title: updatedRequest.title,
        contractorName: updatedRequest.assignedContractor?.name,
        property: updatedRequest.property.name
      })

      return updatedRequest
    },

    // AI categorization
    categorizeIssue: async (_: any, { description, title, images }: any, context: GraphQLContext) => {
      requireAuth(context)

      try {
        const analysis = await analyzeIssue(description)
        
        // Find suggested contractor
        const suggestedContractor = await prisma.contractor.findFirst({
          where: {
            specialties: { has: analysis.category },
            status: 'ACTIVE',
            companyId: context.user!.companyId
          },
          orderBy: [
            { isPreferred: 'desc' },
            { rating: 'desc' }
          ]
        })

        return {
          ...analysis,
          suggestedContractor,
          confidence: 0.85, // Mock confidence score
          keywords: description.toLowerCase().split(' ').slice(0, 5),
          recommendations: [
            'Schedule inspection within 24 hours',
            'Check for related issues in adjacent units',
            'Document with photos before repair'
          ]
        }
      } catch (error) {
        throw new GraphQLError('Failed to analyze issue', {
          extensions: { code: 'AI_ERROR' }
        })
      }
    },

    // Bulk operations
    bulkUpdateMaintenanceStatus: async (_: any, { ids, status }: any, context: GraphQLContext) => {
      const user = requireRole(context, [UserRole.COMPANY_OWNER, UserRole.PROPERTY_MANAGER])

      const result = await prisma.maintenanceRequest.updateMany({
        where: {
          id: { in: ids },
          companyId: user.companyId
        },
        data: { status }
      })

      return {
        success: true,
        updatedCount: result.count,
        errors: []
      }
    }
  },

  // Field resolvers
  Property: {
    occupancyRate: (property: any) => {
      const occupiedUnits = property.units?.filter((unit: any) => 
        unit.lease && unit.lease.status === 'ACTIVE'
      ).length || 0
      
      return property.units?.length > 0 
        ? (occupiedUnits / property.units.length) * 100 
        : 0
    },

    monthlyRevenue: (property: any) => {
      return property.units?.reduce((sum: number, unit: any) => {
        if (unit.lease && unit.lease.status === 'ACTIVE') {
          return sum + (unit.rent || 0)
        }
        return sum
      }, 0) || 0
    },

    occupiedUnits: (property: any) => {
      return property.units?.filter((unit: any) => 
        unit.lease && unit.lease.status === 'ACTIVE'
      ).length || 0
    },

    availableUnits: (property: any) => {
      const occupiedUnits = property.units?.filter((unit: any) => 
        unit.lease && unit.lease.status === 'ACTIVE'
      ).length || 0
      
      return (property.units?.length || 0) - occupiedUnits
    },

    pendingMaintenanceCount: (property: any) => {
      return property._count?.maintenanceRequests || 0
    }
  },

  MaintenanceRequest: {
    isOverdue: (request: any) => {
      if (!request.scheduledDate || request.status === 'COMPLETED') return false
      return new Date() > new Date(request.scheduledDate)
    },

    daysOpen: (request: any) => {
      const created = new Date(request.createdAt)
      const now = request.completedDate ? new Date(request.completedDate) : new Date()
      return Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24))
    }
  },

  Payment: {
    isOverdue: (payment: any) => {
      return payment.status === 'OVERDUE' || 
             (payment.status === 'PENDING' && new Date() > new Date(payment.dueDate))
    },

    daysOverdue: (payment: any) => {
      if (payment.status !== 'OVERDUE' && payment.status !== 'PENDING') return 0
      const dueDate = new Date(payment.dueDate)
      const now = new Date()
      if (now <= dueDate) return 0
      return Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))
    }
  },

  Unit: {
    isOccupied: (unit: any) => {
      return unit.lease && unit.lease.status === 'ACTIVE'
    }
  },

  Lease: {
    daysRemaining: (lease: any) => {
      if (lease.status !== 'ACTIVE') return 0
      const endDate = new Date(lease.endDate)
      const now = new Date()
      if (now >= endDate) return 0
      return Math.floor((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    },

    isExpiringSoon: (lease: any) => {
      if (lease.status !== 'ACTIVE') return false
      const endDate = new Date(lease.endDate)
      const now = new Date()
      const daysUntilExpiry = Math.floor((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      return daysUntilExpiry <= 60 && daysUntilExpiry > 0
    }
  }
}

