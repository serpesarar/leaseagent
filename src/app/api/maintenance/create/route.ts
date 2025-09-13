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
import { analyzeIssue } from '@/lib/ai-routing'
import { AIService } from '@/lib/ai-service'
import { AutomatedRoutingSystem } from '@/lib/automated-routing'
import { SmartNotificationSystem, NotificationTrigger } from '@/lib/smart-notifications'
import { sendMaintenanceUpdate, RealTimeEvents } from '@/lib/pusher'

// POST /api/maintenance/create - Create maintenance request with AI analysis
async function createMaintenanceRequest(request: NextRequest, validatedData: any, session: any) {
  const { title, description, priority, category, propertyId, unitId, leaseId, images, scheduledDate } = validatedData

  // Validate property belongs to user's company
  const property = await prisma.property.findFirst({
    where: {
      id: propertyId,
      companyId: session.user.companyId
    }
  })

  if (!property) {
    throw new APIError('Property not found', 404, 'PROPERTY_NOT_FOUND')
  }

  // Validate unit if provided
  if (unitId) {
    const unit = await prisma.unit.findFirst({
      where: {
        id: unitId,
        propertyId
      }
    })

    if (!unit) {
      throw new APIError('Unit not found', 404, 'UNIT_NOT_FOUND')
    }
  }

  // Enhanced AI analysis of the issue
  let aiAnalysis = null
  let enhancedAnalysis = null
  try {
    // Use legacy AI analysis for backward compatibility
    aiAnalysis = await analyzeIssue(description)
    
    // Use enhanced AI service for detailed analysis
    enhancedAnalysis = await AIService.analyzeMaintenanceRequest(
      title,
      description,
      `Property: ${property.name}`,
      images || []
    )
    
    console.log('Enhanced AI Analysis:', {
      category: enhancedAnalysis.category,
      severity: enhancedAnalysis.severity,
      confidence: enhancedAnalysis.confidence,
      estimatedCost: enhancedAnalysis.estimatedCost,
      riskLevel: enhancedAnalysis.riskLevel
    })
  } catch (error) {
    console.warn('AI analysis failed:', error)
    // Continue without AI analysis if it fails
  }

  // Create maintenance request with enhanced AI insights
  const maintenanceRequest = await prisma.maintenanceRequest.create({
    data: {
      title,
      description,
      priority,
      category: category || enhancedAnalysis?.category || aiAnalysis?.category,
      severity: enhancedAnalysis?.severity || aiAnalysis?.severity,
      aiCategory: enhancedAnalysis?.category || aiAnalysis?.category,
      aiSeverity: enhancedAnalysis?.severity || aiAnalysis?.severity,
      estimatedCost: enhancedAnalysis?.estimatedCost || aiAnalysis?.estimatedCost,
      estimatedDuration: enhancedAnalysis?.estimatedDuration,
      riskLevel: enhancedAnalysis?.riskLevel,
      aiAnalysis: enhancedAnalysis ? JSON.stringify(enhancedAnalysis) : (aiAnalysis ? JSON.stringify(aiAnalysis) : null),
      images: images || [],
      scheduledDate,
      companyId: session.user.companyId,
      propertyId,
      unitId,
      leaseId,
      requesterId: session.user.id,
      notes: enhancedAnalysis ? `AI Analysis (${Math.round(enhancedAnalysis.confidence * 100)}% confidence): ${enhancedAnalysis.reasoning}` : null
    },
    include: {
      property: true,
      unit: true,
      requester: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true
        }
      },
      lease: {
        include: {
          tenant: {
            select: {
              name: true,
              email: true
            }
          }
        }
      }
    }
  })

  // Send real-time notification with enhanced data
  await sendMaintenanceUpdate(session.user.companyId, RealTimeEvents.MAINTENANCE_CREATED, {
    id: maintenanceRequest.id,
    title: maintenanceRequest.title,
    priority: maintenanceRequest.priority,
    property: property.name,
    requester: session.user.name || session.user.email,
    aiCategory: enhancedAnalysis?.category || aiAnalysis?.category,
    severity: enhancedAnalysis?.severity || aiAnalysis?.severity,
    riskLevel: enhancedAnalysis?.riskLevel,
    estimatedCost: enhancedAnalysis?.estimatedCost,
    confidence: enhancedAnalysis?.confidence
  })

  // Trigger automated routing system
  if (enhancedAnalysis) {
    try {
      const routingDecision = await AutomatedRoutingSystem.routeMaintenanceRequest(
        maintenanceRequest.id
      )
      
      console.log('Automated routing decision:', {
        assigned: routingDecision.assignedContractorName,
        confidence: routingDecision.confidence,
        reason: routingDecision.routingReason
      })
    } catch (error) {
      console.warn('Automated routing failed:', error)
      // Continue without automated routing
    }
  }

  // Send smart notifications
  try {
    await SmartNotificationSystem.sendSmartNotification({
      trigger: NotificationTrigger.MAINTENANCE_CREATED,
      entityId: maintenanceRequest.id,
      entityType: 'MaintenanceRequest',
      companyId: session.user.companyId,
      urgency: enhancedAnalysis?.urgency || 5,
      data: {
        title: maintenanceRequest.title,
        category: maintenanceRequest.category,
        severity: maintenanceRequest.severity,
        property: {
          id: property.id,
          name: property.name
        },
        unit: maintenanceRequest.unit ? {
          id: maintenanceRequest.unit.id,
          unitNumber: maintenanceRequest.unit.unitNumber
        } : null,
        requester: {
          id: session.user.id,
          name: session.user.name || session.user.email,
          email: session.user.email
        },
        estimatedCost: enhancedAnalysis?.estimatedCost,
        riskLevel: enhancedAnalysis?.riskLevel
      }
    })
  } catch (error) {
    console.warn('Smart notification failed:', error)
    // Continue without smart notifications
  }

  // Legacy auto-assign contractor logic (kept for backward compatibility)
  if (aiAnalysis?.suggestedContractor && ['HIGH', 'URGENT'].includes(priority)) {
    try {
      await prisma.maintenanceRequest.update({
        where: { id: maintenanceRequest.id },
        data: {
          assignedContractorId: aiAnalysis.suggestedContractor.id,
          status: 'IN_PROGRESS'
        }
      })

      // Send contractor assignment notification
      await sendMaintenanceUpdate(session.user.companyId, RealTimeEvents.CONTRACTOR_ASSIGNED, {
        id: maintenanceRequest.id,
        title: maintenanceRequest.title,
        contractorName: aiAnalysis.suggestedContractor.name,
        property: property.name,
        autoAssigned: true
      })
    } catch (error) {
      console.warn('Auto-assignment failed:', error)
      // Continue even if auto-assignment fails
    }
  }

  return NextResponse.json(
    createApiResponse(maintenanceRequest, 'Maintenance request created successfully'),
    { status: 201 }
  )
}

const postHandler = withMiddleware(
  withAuth(
    withValidation(schemas.createMaintenanceRequest, createMaintenanceRequest),
    [UserRole.COMPANY_OWNER, UserRole.PROPERTY_MANAGER, UserRole.TENANT]
  ),
  [withErrorHandling, withRateLimit(30)] // Allow 30 requests per window for maintenance creation
)

export { postHandler as POST }