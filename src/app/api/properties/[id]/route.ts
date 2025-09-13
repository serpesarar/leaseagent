import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { 
  withAuth, 
  withValidation, 
  withErrorHandling, 
  withMiddleware,
  schemas,
  createApiResponse,
  APIError
} from '@/lib/api-middleware'
import { UserRole } from '@prisma/client'

// GET /api/properties/[id] - Get property details
async function getProperty(request: NextRequest, session: any, context: { params: { id: string } }) {
  const { id } = context.params

  const property = await prisma.property.findFirst({
    where: {
      id,
      companyId: session.user.companyId
    },
    include: {
      units: {
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
              }
            }
          }
        }
      },
      maintenanceRequests: {
        where: {
          status: { in: ['PENDING', 'IN_PROGRESS'] }
        },
        include: {
          requester: {
            select: {
              name: true,
              email: true
            }
          },
          assignedContractor: {
            select: {
              name: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      },
      _count: {
        select: {
          units: true,
          maintenanceRequests: true
        }
      }
    }
  })

  if (!property) {
    throw new APIError('Property not found', 404, 'PROPERTY_NOT_FOUND')
  }

  // Calculate metrics
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

  const propertyWithMetrics = {
    ...property,
    occupancyRate,
    monthlyRevenue,
    occupiedUnits,
    availableUnits: property.units.length - occupiedUnits
  }

  return NextResponse.json(createApiResponse(propertyWithMetrics))
}

// PUT /api/properties/[id] - Update property
async function updateProperty(
  request: NextRequest, 
  validatedData: any, 
  session: any, 
  context: { params: { id: string } }
) {
  const { id } = context.params

  // Check if property exists and belongs to company
  const existingProperty = await prisma.property.findFirst({
    where: {
      id,
      companyId: session.user.companyId
    }
  })

  if (!existingProperty) {
    throw new APIError('Property not found', 404, 'PROPERTY_NOT_FOUND')
  }

  const property = await prisma.property.update({
    where: { id },
    data: validatedData,
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

  return NextResponse.json(createApiResponse(property, 'Property updated successfully'))
}

// DELETE /api/properties/[id] - Delete property
async function deleteProperty(request: NextRequest, session: any, context: { params: { id: string } }) {
  const { id } = context.params

  // Only company owners can delete properties
  if (session.user.role !== 'COMPANY_OWNER') {
    throw new APIError('Only company owners can delete properties', 403, 'FORBIDDEN')
  }

  // Check if property exists and belongs to company
  const existingProperty = await prisma.property.findFirst({
    where: {
      id,
      companyId: session.user.companyId
    },
    include: {
      _count: {
        select: {
          units: true,
          maintenanceRequests: true
        }
      }
    }
  })

  if (!existingProperty) {
    throw new APIError('Property not found', 404, 'PROPERTY_NOT_FOUND')
  }

  // Check if property has active leases
  const activeLeases = await prisma.lease.count({
    where: {
      unit: {
        propertyId: id
      },
      status: 'ACTIVE'
    }
  })

  if (activeLeases > 0) {
    throw new APIError(
      'Cannot delete property with active leases', 
      400, 
      'PROPERTY_HAS_ACTIVE_LEASES',
      { activeLeases }
    )
  }

  await prisma.property.delete({
    where: { id }
  })

  return NextResponse.json(createApiResponse(null, 'Property deleted successfully'))
}

// Middleware wrappers
const getHandler = withMiddleware(
  withAuth(getProperty, [UserRole.COMPANY_OWNER, UserRole.PROPERTY_MANAGER, UserRole.TENANT]),
  [withErrorHandling]
)

const putHandler = withMiddleware(
  withAuth(
    withValidation(schemas.updateProperty, updateProperty),
    [UserRole.COMPANY_OWNER, UserRole.PROPERTY_MANAGER]
  ),
  [withErrorHandling]
)

const deleteHandler = withMiddleware(
  withAuth(deleteProperty, [UserRole.COMPANY_OWNER]),
  [withErrorHandling]
)

export { getHandler as GET, putHandler as PUT, deleteHandler as DELETE }

