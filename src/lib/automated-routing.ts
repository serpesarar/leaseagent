import { AIService, AIAnalysisResult } from './ai-service'
import { WorkflowEngine } from './workflow-engine'
import { prisma } from './prisma'
import { sendNotification } from './pusher'
import { 
  MaintenanceRequest, 
  Contractor, 
  User, 
  ContractorStatus,
  IssueCategory,
  IssueSeverity,
  MaintenanceStatus 
} from '@prisma/client'

export interface RoutingDecision {
  assignedContractorId?: string
  assignedContractorName?: string
  routingReason: string
  confidence: number
  alternativeContractors: {
    id: string
    name: string
    score: number
    reason: string
  }[]
  estimatedResponseTime: string
  recommendedActions: string[]
  escalationRequired: boolean
}

export interface ContractorMatch {
  contractor: Contractor & { user?: User }
  score: number
  availability: 'AVAILABLE' | 'BUSY' | 'UNAVAILABLE'
  distance?: number
  specialtyMatch: boolean
  workloadFactor: number
  ratingScore: number
  costFactor: number
  responseTime: number
}

export interface RoutingContext {
  request: MaintenanceRequest & {
    property: { id: string; name: string; address: string; companyId: string }
    unit?: { id: string; unitNumber: string }
    requester: { id: string; name: string; email: string }
  }
  aiAnalysis: AIAnalysisResult
  availableContractors: (Contractor & { user?: User })[]
  businessHours: boolean
  urgencyMultiplier: number
}

export class AutomatedRoutingSystem {
  /**
   * Main routing function - analyzes request and assigns optimal contractor
   */
  static async routeMaintenanceRequest(
    requestId: string,
    options: {
      forceReassignment?: boolean
      excludeContractorIds?: string[]
      prioritizeLocal?: boolean
    } = {}
  ): Promise<RoutingDecision> {
    try {
      // Get maintenance request with relations
      const request = await prisma.maintenanceRequest.findUnique({
        where: { id: requestId },
        include: {
          property: true,
          unit: true,
          requester: true,
          contractor: true
        }
      })

      if (!request) {
        throw new Error('Maintenance request not found')
      }

      // Skip if already assigned (unless force reassignment)
      if (request.contractorId && !options.forceReassignment) {
        return {
          assignedContractorId: request.contractorId,
          assignedContractorName: request.contractor?.name || 'Unknown',
          routingReason: 'Already assigned',
          confidence: 1.0,
          alternativeContractors: [],
          estimatedResponseTime: 'Previously assigned',
          recommendedActions: [],
          escalationRequired: false
        }
      }

      // Get AI analysis of the request
      const aiAnalysis = await AIService.analyzeMaintenanceRequest(
        request.title,
        request.description,
        request.location,
        request.images
      )

      // Get available contractors for the company
      const availableContractors = await this.getAvailableContractors(
        request.property.companyId,
        {
          category: aiAnalysis.category,
          excludeIds: options.excludeContractorIds,
          location: options.prioritizeLocal ? request.property.address : undefined
        }
      )

      if (availableContractors.length === 0) {
        return this.handleNoContractorsAvailable(request, aiAnalysis)
      }

      // Build routing context
      const context: RoutingContext = {
        request,
        aiAnalysis,
        availableContractors,
        businessHours: this.isBusinessHours(),
        urgencyMultiplier: this.getUrgencyMultiplier(aiAnalysis.severity, aiAnalysis.urgency)
      }

      // Score and rank contractors
      const contractorMatches = await this.scoreContractors(context)

      // Select best contractor
      const bestMatch = contractorMatches[0]
      
      if (!bestMatch) {
        return this.handleNoSuitableContractor(request, aiAnalysis)
      }

      // Assign contractor
      const routingDecision = await this.assignContractor(
        request,
        bestMatch,
        contractorMatches.slice(1, 4), // Top 3 alternatives
        aiAnalysis
      )

      // Execute workflow rules if any
      await WorkflowEngine.processMaintenanceRequest(request)

      // Send notifications
      await this.sendRoutingNotifications(request, routingDecision, aiAnalysis)

      return routingDecision

    } catch (error) {
      console.error('Error in automated routing:', error)
      throw error
    }
  }

  /**
   * Score contractors based on multiple factors
   */
  private static async scoreContractors(context: RoutingContext): Promise<ContractorMatch[]> {
    const { request, aiAnalysis, availableContractors } = context
    const matches: ContractorMatch[] = []

    for (const contractor of availableContractors) {
      const match = await this.scoreContractor(contractor, context)
      matches.push(match)
    }

    // Sort by score (highest first)
    return matches.sort((a, b) => b.score - a.score)
  }

  /**
   * Score individual contractor
   */
  private static async scoreContractor(
    contractor: Contractor & { user?: User },
    context: RoutingContext
  ): Promise<ContractorMatch> {
    let score = 0
    let factors: string[] = []

    // 1. Specialty match (30% weight)
    const specialtyMatch = this.checkSpecialtyMatch(contractor, context.aiAnalysis.category)
    const specialtyScore = specialtyMatch ? 30 : 10
    score += specialtyScore
    
    if (specialtyMatch) {
      factors.push('Specialty match')
    }

    // 2. Availability (25% weight)
    const availability = await this.checkAvailability(contractor.id)
    const availabilityScore = availability === 'AVAILABLE' ? 25 : 
                             availability === 'BUSY' ? 15 : 0
    score += availabilityScore

    // 3. Rating/Performance (20% weight)
    const ratingScore = await this.getRatingScore(contractor.id)
    score += ratingScore * 20

    // 4. Current workload (15% weight)
    const workloadFactor = await this.getWorkloadFactor(contractor.id)
    const workloadScore = (1 - workloadFactor) * 15
    score += workloadScore

    // 5. Response time history (10% weight)
    const responseTime = await this.getAverageResponseTime(contractor.id)
    const responseScore = Math.max(0, 10 - (responseTime / 60)) // Better score for faster response
    score += responseScore

    // Urgency multiplier
    score *= context.urgencyMultiplier

    return {
      contractor,
      score,
      availability,
      specialtyMatch,
      workloadFactor,
      ratingScore,
      costFactor: await this.getCostFactor(contractor.id),
      responseTime
    }
  }

  /**
   * Check if contractor specializes in the required category
   */
  private static checkSpecialtyMatch(
    contractor: Contractor,
    category: IssueCategory
  ): boolean {
    const specialties = contractor.specialties as string[] || []
    
    // Direct match
    if (specialties.includes(category)) {
      return true
    }

    // Cross-category matches
    const crossMatches: { [key: string]: string[] } = {
      [IssueCategory.PLUMBING]: ['PLUMBING', 'GENERAL'],
      [IssueCategory.ELECTRICAL]: ['ELECTRICAL', 'GENERAL'],
      [IssueCategory.HVAC]: ['HVAC', 'ELECTRICAL', 'GENERAL'],
      [IssueCategory.APPLIANCE]: ['APPLIANCE', 'ELECTRICAL', 'GENERAL'],
      [IssueCategory.STRUCTURAL]: ['STRUCTURAL', 'GENERAL'],
      [IssueCategory.GENERAL]: ['GENERAL']
    }

    return crossMatches[category]?.some(spec => specialties.includes(spec)) || false
  }

  /**
   * Check contractor availability
   */
  private static async checkAvailability(contractorId: string): Promise<'AVAILABLE' | 'BUSY' | 'UNAVAILABLE'> {
    try {
      // Get active assignments
      const activeAssignments = await prisma.maintenanceRequest.count({
        where: {
          contractorId,
          status: {
            in: [MaintenanceStatus.ASSIGNED, MaintenanceStatus.IN_PROGRESS]
          }
        }
      })

      // Get contractor capacity (default 5 concurrent jobs)
      const contractor = await prisma.contractor.findUnique({
        where: { id: contractorId }
      })

      const maxCapacity = contractor?.maxConcurrentJobs || 5

      if (activeAssignments === 0) {
        return 'AVAILABLE'
      } else if (activeAssignments < maxCapacity) {
        return 'BUSY'
      } else {
        return 'UNAVAILABLE'
      }
    } catch (error) {
      console.error('Error checking availability:', error)
      return 'AVAILABLE' // Default to available on error
    }
  }

  /**
   * Get contractor rating score (0-1)
   */
  private static async getRatingScore(contractorId: string): Promise<number> {
    try {
      // This would integrate with a rating system
      // For now, return a default good score
      return 0.85
    } catch (error) {
      return 0.75 // Default score
    }
  }

  /**
   * Get contractor workload factor (0-1, where 1 is fully loaded)
   */
  private static async getWorkloadFactor(contractorId: string): Promise<number> {
    try {
      const activeJobs = await prisma.maintenanceRequest.count({
        where: {
          contractorId,
          status: {
            in: [MaintenanceStatus.ASSIGNED, MaintenanceStatus.IN_PROGRESS]
          }
        }
      })

      const contractor = await prisma.contractor.findUnique({
        where: { id: contractorId }
      })

      const maxCapacity = contractor?.maxConcurrentJobs || 5
      return Math.min(1, activeJobs / maxCapacity)
    } catch (error) {
      return 0.5 // Default moderate workload
    }
  }

  /**
   * Get average response time in minutes
   */
  private static async getAverageResponseTime(contractorId: string): Promise<number> {
    try {
      // This would calculate based on historical data
      // For now, return a reasonable default
      return 120 // 2 hours
    } catch (error) {
      return 180 // Default 3 hours
    }
  }

  /**
   * Get cost factor for contractor
   */
  private static async getCostFactor(contractorId: string): Promise<number> {
    try {
      // This would be based on historical cost data
      // For now, return neutral factor
      return 1.0
    } catch (error) {
      return 1.0
    }
  }

  /**
   * Get available contractors for company
   */
  private static async getAvailableContractors(
    companyId: string,
    filters: {
      category?: IssueCategory
      excludeIds?: string[]
      location?: string
    }
  ): Promise<(Contractor & { user?: User })[]> {
    const where: any = {
      companyId,
      status: ContractorStatus.ACTIVE
    }

    if (filters.excludeIds && filters.excludeIds.length > 0) {
      where.id = { notIn: filters.excludeIds }
    }

    if (filters.category) {
      where.specialties = {
        has: filters.category
      }
    }

    return await prisma.contractor.findMany({
      where,
      include: {
        user: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  }

  /**
   * Assign contractor to request
   */
  private static async assignContractor(
    request: any,
    bestMatch: ContractorMatch,
    alternatives: ContractorMatch[],
    aiAnalysis: AIAnalysisResult
  ): Promise<RoutingDecision> {
    try {
      // Update maintenance request
      await prisma.maintenanceRequest.update({
        where: { id: request.id },
        data: {
          contractorId: bestMatch.contractor.id,
          status: MaintenanceStatus.ASSIGNED,
          assignedAt: new Date(),
          estimatedCost: aiAnalysis.estimatedCost,
          priority: aiAnalysis.severity,
          aiAnalysis: aiAnalysis as any, // Store AI analysis
          notes: `Auto-assigned by AI routing system. Confidence: ${aiAnalysis.confidence}`
        }
      })

      return {
        assignedContractorId: bestMatch.contractor.id,
        assignedContractorName: bestMatch.contractor.name,
        routingReason: `Best match based on specialty (${bestMatch.specialtyMatch ? 'Yes' : 'No'}), availability (${bestMatch.availability}), and performance score (${bestMatch.score.toFixed(1)})`,
        confidence: aiAnalysis.confidence,
        alternativeContractors: alternatives.map(alt => ({
          id: alt.contractor.id,
          name: alt.contractor.name,
          score: alt.score,
          reason: `Score: ${alt.score.toFixed(1)}, Specialty: ${alt.specialtyMatch ? 'Match' : 'No match'}, Availability: ${alt.availability}`
        })),
        estimatedResponseTime: this.calculateEstimatedResponseTime(bestMatch, aiAnalysis),
        recommendedActions: this.getRecommendedActions(aiAnalysis),
        escalationRequired: aiAnalysis.severity === IssueSeverity.URGENT && bestMatch.score < 70
      }
    } catch (error) {
      console.error('Error assigning contractor:', error)
      throw error
    }
  }

  /**
   * Handle case when no contractors are available
   */
  private static handleNoContractorsAvailable(
    request: any,
    aiAnalysis: AIAnalysisResult
  ): RoutingDecision {
    return {
      routingReason: 'No contractors available for this request type',
      confidence: 0,
      alternativeContractors: [],
      estimatedResponseTime: 'Unknown - manual assignment required',
      recommendedActions: [
        'Contact external contractors',
        'Notify property manager',
        'Consider temporary solutions if urgent'
      ],
      escalationRequired: true
    }
  }

  /**
   * Handle case when no suitable contractor found
   */
  private static handleNoSuitableContractor(
    request: any,
    aiAnalysis: AIAnalysisResult
  ): RoutingDecision {
    return {
      routingReason: 'No suitable contractors found based on scoring criteria',
      confidence: 0,
      alternativeContractors: [],
      estimatedResponseTime: 'Manual review required',
      recommendedActions: [
        'Review contractor qualifications',
        'Consider expanding search criteria',
        'Manual assignment may be necessary'
      ],
      escalationRequired: aiAnalysis.severity === IssueSeverity.URGENT
    }
  }

  /**
   * Calculate estimated response time
   */
  private static calculateEstimatedResponseTime(
    match: ContractorMatch,
    aiAnalysis: AIAnalysisResult
  ): string {
    let baseTime = match.responseTime // in minutes
    
    // Adjust for urgency
    if (aiAnalysis.severity === IssueSeverity.URGENT) {
      baseTime *= 0.5 // Urgent requests get priority
    } else if (aiAnalysis.severity === IssueSeverity.LOW) {
      baseTime *= 1.5 // Low priority can wait
    }

    // Adjust for availability
    if (match.availability === 'BUSY') {
      baseTime *= 1.3
    }

    const hours = Math.round(baseTime / 60)
    
    if (hours < 1) {
      return 'Within 1 hour'
    } else if (hours === 1) {
      return '1 hour'
    } else if (hours < 24) {
      return `${hours} hours`
    } else {
      const days = Math.round(hours / 24)
      return `${days} day${days > 1 ? 's' : ''}`
    }
  }

  /**
   * Get recommended actions based on AI analysis
   */
  private static getRecommendedActions(aiAnalysis: AIAnalysisResult): string[] {
    const actions = ['Contact assigned contractor', 'Monitor progress']

    if (aiAnalysis.severity === IssueSeverity.URGENT) {
      actions.unshift('Immediate response required')
    }

    if (aiAnalysis.riskLevel === 'HIGH' || aiAnalysis.riskLevel === 'CRITICAL') {
      actions.push('Safety assessment recommended')
    }

    if (aiAnalysis.estimatedCost > 1000) {
      actions.push('Cost approval may be required')
    }

    if (aiAnalysis.preventiveMeasures && aiAnalysis.preventiveMeasures.length > 0) {
      actions.push('Consider preventive measures for future')
    }

    return actions
  }

  /**
   * Send notifications about routing decision
   */
  private static async sendRoutingNotifications(
    request: any,
    decision: RoutingDecision,
    aiAnalysis: AIAnalysisResult
  ): Promise<void> {
    try {
      // Notify assigned contractor
      if (decision.assignedContractorId) {
        const contractor = await prisma.contractor.findUnique({
          where: { id: decision.assignedContractorId },
          include: { user: true }
        })

        if (contractor?.user) {
          await sendNotification({
            userId: contractor.user.id,
            title: 'New Maintenance Assignment',
            message: `You've been assigned to: ${request.title}`,
            type: 'MAINTENANCE_ASSIGNED',
            data: { 
              requestId: request.id,
              estimatedCost: aiAnalysis.estimatedCost,
              urgency: aiAnalysis.urgency
            }
          })
        }
      }

      // Notify property manager
      const propertyManagers = await prisma.user.findMany({
        where: {
          companyId: request.property.companyId,
          role: 'PROPERTY_MANAGER'
        }
      })

      for (const manager of propertyManagers) {
        await sendNotification({
          userId: manager.id,
          title: decision.assignedContractorId ? 'Maintenance Request Assigned' : 'Manual Assignment Required',
          message: `${request.title} - ${decision.routingReason}`,
          type: 'MAINTENANCE_ROUTED',
          data: { 
            requestId: request.id,
            confidence: decision.confidence,
            escalationRequired: decision.escalationRequired
          }
        })
      }

      // Escalation notification if required
      if (decision.escalationRequired) {
        const companyOwners = await prisma.user.findMany({
          where: {
            companyId: request.property.companyId,
            role: 'COMPANY_OWNER'
          }
        })

        for (const owner of companyOwners) {
          await sendNotification({
            userId: owner.id,
            title: 'Urgent Maintenance Escalation',
            message: `${request.title} requires immediate attention`,
            type: 'MAINTENANCE_ESCALATED',
            data: { 
              requestId: request.id,
              aiAnalysis: aiAnalysis
            }
          })
        }
      }

    } catch (error) {
      console.error('Error sending routing notifications:', error)
    }
  }

  /**
   * Utility functions
   */
  private static isBusinessHours(): boolean {
    const now = new Date()
    const hour = now.getHours()
    const day = now.getDay()
    
    // Monday-Friday, 8 AM - 6 PM
    return day >= 1 && day <= 5 && hour >= 8 && hour < 18
  }

  private static getUrgencyMultiplier(severity: IssueSeverity, urgency: number): number {
    let multiplier = 1.0

    switch (severity) {
      case IssueSeverity.URGENT:
        multiplier = 1.5
        break
      case IssueSeverity.HIGH:
        multiplier = 1.2
        break
      case IssueSeverity.LOW:
        multiplier = 0.8
        break
    }

    // Additional urgency factor
    multiplier += (urgency - 5) * 0.05 // +/- 0.25 max

    return Math.max(0.5, Math.min(2.0, multiplier))
  }

  /**
   * Batch routing for multiple requests
   */
  static async batchRouteRequests(
    requestIds: string[],
    options: { prioritizeUrgent?: boolean } = {}
  ): Promise<{ [requestId: string]: RoutingDecision }> {
    const results: { [requestId: string]: RoutingDecision } = {}
    
    // Sort by urgency if requested
    let sortedIds = requestIds
    if (options.prioritizeUrgent) {
      const requests = await prisma.maintenanceRequest.findMany({
        where: { id: { in: requestIds } },
        select: { id: true, priority: true }
      })
      
      sortedIds = requests
        .sort((a, b) => {
          const priorityOrder = { URGENT: 4, HIGH: 3, MEDIUM: 2, LOW: 1 }
          return priorityOrder[b.priority as keyof typeof priorityOrder] - 
                 priorityOrder[a.priority as keyof typeof priorityOrder]
        })
        .map(r => r.id)
    }

    for (const requestId of sortedIds) {
      try {
        results[requestId] = await this.routeMaintenanceRequest(requestId)
      } catch (error) {
        console.error(`Error routing request ${requestId}:`, error)
        results[requestId] = {
          routingReason: 'Error during routing',
          confidence: 0,
          alternativeContractors: [],
          estimatedResponseTime: 'Unknown',
          recommendedActions: ['Manual review required'],
          escalationRequired: true
        }
      }
    }

    return results
  }
}

