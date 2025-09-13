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
import { sendMaintenanceUpdate, RealTimeEvents } from '@/lib/pusher'

// PUT /api/maintenance/[id]/assign - Assign contractor to maintenance request
async function assignContractor(
  request: NextRequest, 
  validatedData: any, 
  session: any, 
  context: { params: { id: string } }
) {
  const { id } = context.params
  const { contractorId, scheduledDate, estimatedCost, notes } = validatedData

  // Check if maintenance request exists and belongs to company
  const maintenanceRequest = await prisma.maintenanceRequest.findFirst({
    where: {
      id,
      companyId: session.user.companyId
    },
    include: {
      property: true,
      requester: true
    }
  })

  if (!maintenanceRequest) {
    throw new APIError('Maintenance request not found', 404, 'MAINTENANCE_REQUEST_NOT_FOUND')
  }

  // Validate contractor exists and belongs to company
  const contractor = await prisma.user.findFirst({
    where: {
      id: contractorId,
      companyId: session.user.companyId,
      role: 'CONTRACTOR'
    }
  })

  if (!contractor) {
    throw new APIError('Contractor not found', 404, 'CONTRACTOR_NOT_FOUND')
  }

  // Update maintenance request
  const updatedRequest = await prisma.maintenanceRequest.update({
    where: { id },
    data: {
      assignedContractorId: contractorId,
      scheduledDate,
      estimatedCost,
      notes,
      status: 'IN_PROGRESS'
    },
    include: {
      property: true,
      assignedContractor: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true
        }
      },
      requester: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  })

  // Send real-time notifications
  await Promise.all([
    // Notify company about contractor assignment
    sendMaintenanceUpdate(session.user.companyId, RealTimeEvents.CONTRACTOR_ASSIGNED, {
      id: updatedRequest.id,
      title: updatedRequest.title,
      contractorName: contractor.name,
      property: maintenanceRequest.property.name,
      scheduledDate,
      assignedBy: session.user.name || session.user.email
    }),
    
    // Notify the contractor about new assignment
    sendMaintenanceUpdate(`user-${contractorId}`, RealTimeEvents.MAINTENANCE_CREATED, {
      id: updatedRequest.id,
      title: updatedRequest.title,
      description: updatedRequest.description,
      priority: updatedRequest.priority,
      property: maintenanceRequest.property.name,
      scheduledDate,
      requester: maintenanceRequest.requester.name
    })
  ])

  // Create notification record for contractor
  await prisma.notification.create({
    data: {
      type: 'MAINTENANCE_ASSIGNED',
      title: 'New Maintenance Assignment',
      message: `You have been assigned to: ${updatedRequest.title}`,
      data: {
        maintenanceRequestId: updatedRequest.id,
        propertyName: maintenanceRequest.property.name,
        scheduledDate,
        priority: updatedRequest.priority
      },
      userId: contractorId,
      companyId: session.user.companyId
    }
  })

  return NextResponse.json(
    createApiResponse(updatedRequest, 'Contractor assigned successfully')
  )
}

const putHandler = withMiddleware(
  withAuth(
    withValidation(schemas.assignContractor, assignContractor),
    [UserRole.COMPANY_OWNER, UserRole.PROPERTY_MANAGER]
  ),
  [withErrorHandling]
)

export { putHandler as PUT }

