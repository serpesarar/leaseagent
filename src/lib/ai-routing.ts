import OpenAI from 'openai'
import { prisma } from '@/lib/prisma'
import { IssueCategory, IssueSeverity, MaintenanceRequest, Contractor, WorkflowRule } from '@prisma/client'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface AIAnalysisResult {
  category: IssueCategory
  severity: IssueSeverity
  estimatedCost: number
  suggestedContractor: Contractor | null
  confidence: number
  reasoning: string
}

export interface IssueRoutingSystem {
  analyzeIssue(description: string, title: string, propertyType?: string): Promise<AIAnalysisResult>
  routeToContractor(
    issue: MaintenanceRequest, 
    rules: WorkflowRule[], 
    companyId: string
  ): Promise<{ contractor: Contractor | null; reasoning: string }>
}

class AIIssueRoutingSystem implements IssueRoutingSystem {
  
  async analyzeIssue(description: string, title: string, propertyType = 'APARTMENT'): Promise<AIAnalysisResult> {
    try {
      const analysisPrompt = `
Analyze this maintenance issue and provide a structured response:

Title: ${title}
Description: ${description}
Property Type: ${propertyType}

Please categorize this issue and provide analysis in the following JSON format:
{
  "category": "PLUMBING|ELECTRICAL|APPLIANCE|HVAC|STRUCTURAL|PEST_CONTROL|CLEANING|SECURITY|LANDSCAPING|PAYMENT|GENERAL",
  "severity": "LOW|MEDIUM|HIGH|URGENT",
  "estimatedCost": number,
  "confidence": number (0-1),
  "reasoning": "Brief explanation of the categorization and cost estimate",
  "urgencyFactors": ["list", "of", "factors", "that", "affect", "urgency"],
  "skillsRequired": ["list", "of", "skills", "needed"],
  "estimatedDuration": "time estimate in hours"
}

Consider these factors:
- Safety hazards (electrical, water damage, structural issues) = URGENT/HIGH
- Tenant comfort issues (heating, cooling, appliances) = MEDIUM/HIGH
- Cosmetic issues (paint, minor repairs) = LOW/MEDIUM
- Emergency situations (flooding, gas leaks, no heat in winter) = URGENT

Cost estimates should be based on NYC market rates for 2024.
`

      const completion = await openai.chat.completions.create({
        messages: [{ role: 'user', content: analysisPrompt }],
        model: 'gpt-4',
        max_tokens: 500,
        temperature: 0.3,
      })

      const responseText = completion.choices[0]?.message?.content?.trim()
      if (!responseText) {
        throw new Error('No response from OpenAI')
      }

      // Parse the JSON response
      const aiAnalysis = JSON.parse(responseText)

      return {
        category: aiAnalysis.category as IssueCategory,
        severity: aiAnalysis.severity as IssueSeverity,
        estimatedCost: Math.max(50, Math.min(5000, aiAnalysis.estimatedCost || 200)),
        suggestedContractor: null, // Will be determined by routing logic
        confidence: aiAnalysis.confidence || 0.8,
        reasoning: aiAnalysis.reasoning || 'AI analysis completed'
      }

    } catch (error) {
      console.error('Error in AI issue analysis:', error)
      // Fallback analysis
      return this.fallbackAnalysis(description, title)
    }
  }

  private fallbackAnalysis(description: string, title: string): AIAnalysisResult {
    const text = `${title} ${description}`.toLowerCase()
    
    // Simple keyword-based fallback
    let category: IssueCategory = 'GENERAL'
    let severity: IssueSeverity = 'MEDIUM'
    let estimatedCost = 150

    // Category detection
    if (text.includes('water') || text.includes('leak') || text.includes('pipe') || text.includes('faucet')) {
      category = 'PLUMBING'
      estimatedCost = 200
    } else if (text.includes('electric') || text.includes('outlet') || text.includes('light') || text.includes('power')) {
      category = 'ELECTRICAL'
      estimatedCost = 250
    } else if (text.includes('heat') || text.includes('ac') || text.includes('hvac') || text.includes('air condition')) {
      category = 'HVAC'
      estimatedCost = 300
    } else if (text.includes('appliance') || text.includes('refrigerator') || text.includes('stove') || text.includes('washer')) {
      category = 'APPLIANCE'
      estimatedCost = 180
    }

    // Severity detection
    if (text.includes('emergency') || text.includes('urgent') || text.includes('flooding') || text.includes('no heat')) {
      severity = 'URGENT'
      estimatedCost *= 1.5
    } else if (text.includes('broken') || text.includes('not working') || text.includes('stopped')) {
      severity = 'HIGH'
      estimatedCost *= 1.2
    }

    return {
      category,
      severity,
      estimatedCost: Math.round(estimatedCost),
      suggestedContractor: null,
      confidence: 0.6,
      reasoning: 'Fallback keyword-based analysis'
    }
  }

  async routeToContractor(
    issue: MaintenanceRequest & { property: any },
    rules: WorkflowRule[],
    companyId: string
  ): Promise<{ contractor: Contractor | null; reasoning: string }> {
    try {
      // Get available contractors for this company and category
      const availableContractors = await prisma.contractor.findMany({
        where: {
          companyId,
          status: 'ACTIVE',
          specialties: {
            has: issue.aiCategory
          }
        },
        orderBy: [
          { isPreferred: 'desc' },
          { rating: 'desc' },
          { completedJobs: 'desc' }
        ]
      })

      if (availableContractors.length === 0) {
        // Fallback: get contractors without specialty filter
        const fallbackContractors = await prisma.contractor.findMany({
          where: {
            companyId,
            status: 'ACTIVE'
          },
          orderBy: [
            { isPreferred: 'desc' },
            { rating: 'desc' }
          ]
        })

        return {
          contractor: fallbackContractors[0] || null,
          reasoning: fallbackContractors.length > 0 
            ? 'No specialized contractors available, assigned general contractor'
            : 'No active contractors available'
        }
      }

      // Apply workflow rules
      const applicableRules = rules.filter(rule => 
        rule.isActive && this.evaluateRuleConditions(rule, issue)
      ).sort((a, b) => b.priority - a.priority)

      if (applicableRules.length > 0) {
        const rule = applicableRules[0]
        const ruleActions = rule.actions as any

        if (ruleActions.assignContractor && rule.contractorId) {
          const ruleContractor = availableContractors.find(c => c.id === rule.contractorId)
          if (ruleContractor) {
            return {
              contractor: ruleContractor,
              reasoning: `Assigned via workflow rule: ${rule.name}`
            }
          }
        }
      }

      // AI-based contractor selection
      const bestContractor = await this.selectBestContractor(availableContractors, issue)

      return {
        contractor: bestContractor,
        reasoning: bestContractor 
          ? `AI selected based on specialty match, rating (${bestContractor.rating?.toFixed(1) || 'N/A'}), and availability`
          : 'No suitable contractor found'
      }

    } catch (error) {
      console.error('Error in contractor routing:', error)
      return {
        contractor: null,
        reasoning: 'Error occurred during contractor assignment'
      }
    }
  }

  private evaluateRuleConditions(rule: WorkflowRule, issue: MaintenanceRequest): boolean {
    const conditions = rule.conditions as any

    // Check trigger match
    if (rule.trigger === 'MAINTENANCE_REQUEST_CREATED') {
      // Evaluate conditions
      if (conditions.category && conditions.category !== issue.aiCategory) {
        return false
      }
      if (conditions.severity && conditions.severity !== issue.aiSeverity) {
        return false
      }
      if (conditions.estimatedCostMin && issue.estimatedCost && issue.estimatedCost < conditions.estimatedCostMin) {
        return false
      }
      if (conditions.estimatedCostMax && issue.estimatedCost && issue.estimatedCost > conditions.estimatedCostMax) {
        return false
      }
      return true
    }

    return false
  }

  private async selectBestContractor(contractors: Contractor[], issue: MaintenanceRequest): Promise<Contractor | null> {
    if (contractors.length === 0) return null

    // Score contractors based on multiple factors
    const scoredContractors = contractors.map(contractor => {
      let score = 0

      // Specialty match bonus
      if (contractor.specialties.includes(issue.aiCategory as any)) {
        score += 40
      }

      // Rating bonus (0-25 points)
      if (contractor.rating) {
        score += (contractor.rating / 5) * 25
      }

      // Preferred contractor bonus
      if (contractor.isPreferred) {
        score += 20
      }

      // Experience bonus based on completed jobs
      score += Math.min(contractor.completedJobs / 10, 10)

      // Availability bonus (if available in next 24 hours)
      const availability = contractor.availability as any
      if (availability?.immediate || availability?.next24h) {
        score += 15
      }

      return { contractor, score }
    })

    // Sort by score and return the best contractor
    scoredContractors.sort((a, b) => b.score - a.score)
    return scoredContractors[0].contractor
  }
}

// Export singleton instance
export const issueRoutingSystem = new AIIssueRoutingSystem()

// Helper function to create a maintenance request with AI analysis
export async function createMaintenanceRequestWithAI(data: {
  title: string
  description: string
  propertyId: string
  requesterId: string
  companyId: string
  leaseId?: string
  images?: string[]
}) {
  // Get property info for better analysis
  const property = await prisma.property.findUnique({
    where: { id: data.propertyId }
  })

  // Perform AI analysis
  const aiAnalysis = await issueRoutingSystem.analyzeIssue(
    data.description,
    data.title,
    property?.type
  )

  // Create the maintenance request
  const maintenanceRequest = await prisma.maintenanceRequest.create({
    data: {
      title: data.title,
      description: data.description,
      propertyId: data.propertyId,
      requesterId: data.requesterId,
      companyId: data.companyId,
      leaseId: data.leaseId,
      images: data.images || [],
      aiCategory: aiAnalysis.category,
      aiSeverity: aiAnalysis.severity,
      estimatedCost: aiAnalysis.estimatedCost,
      aiAnalysis: {
        confidence: aiAnalysis.confidence,
        reasoning: aiAnalysis.reasoning,
        timestamp: new Date().toISOString()
      }
    },
    include: {
      property: true,
      requester: true
    }
  })

  // Get workflow rules and route to contractor
  const workflowRules = await prisma.workflowRule.findMany({
    where: {
      companyId: data.companyId,
      isActive: true,
      trigger: 'MAINTENANCE_REQUEST_CREATED'
    }
  })

  const routing = await issueRoutingSystem.routeToContractor(
    maintenanceRequest as any,
    workflowRules,
    data.companyId
  )

  // Update with contractor assignment if found
  if (routing.contractor) {
    await prisma.maintenanceRequest.update({
      where: { id: maintenanceRequest.id },
      data: {
        contractorId: routing.contractor.id,
        assignedContractorId: routing.contractor.id
      }
    })

    // Create notification for contractor
    await prisma.notification.create({
      data: {
        title: 'New Maintenance Request Assigned',
        message: `You have been assigned a new ${aiAnalysis.category.toLowerCase()} maintenance request: ${data.title}`,
        type: 'CONTRACTOR_ASSIGNED',
        companyId: data.companyId,
        userId: routing.contractor.id,
        data: {
          maintenanceRequestId: maintenanceRequest.id,
          routing: routing.reasoning
        }
      }
    })
  }

  return {
    maintenanceRequest,
    aiAnalysis,
    routing
  }
}

