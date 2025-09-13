import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { 
  withAuth, 
  withValidation, 
  withErrorHandling, 
  withRateLimit,
  withMiddleware,
  schemas,
  createApiResponse,
  APIError
} from '@/lib/api-middleware'
import { UserRole } from '@prisma/client'

// GET /api/properties - List all properties for the company
async function getProperties(request: NextRequest, session: any) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')
  const search = searchParams.get('search') || ''
  const type = searchParams.get('type') || ''
  const city = searchParams.get('city') || ''

  const skip = (page - 1) * limit

  const where = {
    companyId: session.user.companyId,
    ...(search && {
      OR: [
        { name: { contains: search, mode: 'insensitive' as const } },
        { address: { contains: search, mode: 'insensitive' as const } }
      ]
    }),
    ...(type && { type }),
    ...(city && { city: { contains: city, mode: 'insensitive' as const } })
  }

  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      where,
      skip,
      take: limit,
      include: {
        units: {
          select: {
            id: true,
            unitNumber: true,
            status: true,
            rent: true,
            lease: {
              select: {
                id: true,
                status: true,
                tenant: {
                  select: {
                    name: true,
                    email: true
                  }
                }
              }
            }
          }
        },
        _count: {
          select: {
            units: true,
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

  // Calculate occupancy rates and revenue
  const propertiesWithMetrics = properties.map(property => {
    const occupiedUnits = property.units.filter(unit => 
      unit.lease && unit.lease.status === 'ACTIVE'
    ).length
    const occupancyRate = property.units.length > 0 
      ? Math.round((occupiedUnits / property.units.length) * 100) 
      : 0
    
    const monthlyRevenue = property.units.reduce((sum, unit) => {
      if (unit.lease && unit.lease.status === 'ACTIVE') {
        return sum + (unit.rent || 0)
      }
      return sum
    }, 0)

    return {
      ...property,
      occupancyRate,
      monthlyRevenue,
      occupiedUnits,
      pendingMaintenanceCount: property._count.maintenanceRequests
    }
  })

  return NextResponse.json(createApiResponse({
    properties: propertiesWithMetrics,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  }))
}

// POST /api/properties - Create a new property
async function createProperty(request: NextRequest, validatedData: any, session: any) {
  // Only company owners and property managers can create properties
  if (!['COMPANY_OWNER', 'PROPERTY_MANAGER'].includes(session.user.role)) {
    throw new APIError('Insufficient permissions', 403, 'FORBIDDEN')
  }

  const property = await prisma.property.create({
    data: {
      ...validatedData,
      companyId: session.user.companyId
    },
    include: {
      units: true,
      _count: {
        select: {
          units: true,
          maintenanceRequests: true
        }
      }
    }
  })

  return NextResponse.json(createApiResponse(property, 'Property created successfully'), { status: 201 })
}

// Combined middleware for GET requests
const getHandler = withMiddleware(
  withAuth(getProperties, [UserRole.COMPANY_OWNER, UserRole.PROPERTY_MANAGER, UserRole.TENANT]),
  [withErrorHandling, withRateLimit(100)]
)

// Combined middleware for POST requests
const postHandler = withMiddleware(
  withAuth(
    withValidation(schemas.createProperty, createProperty),
    [UserRole.COMPANY_OWNER, UserRole.PROPERTY_MANAGER]
  ),
  [withErrorHandling, withRateLimit(20)]
)

export { getHandler as GET, postHandler as POST }

