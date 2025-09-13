import { 
  WorkflowRule, 
  WorkflowTrigger, 
  WorkflowAction,
  IssueCategory,
  IssueSeverity,
  MaintenanceRequest,
  Contractor,
  User
} from '@prisma/client'
import { prisma } from './prisma'
import { sendNotification } from './pusher'

export interface WorkflowCondition {
  field: string
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'in'
  value: string | number | string[]
}

export interface WorkflowRuleData extends Omit<WorkflowRule, 'id' | 'createdAt' | 'updatedAt'> {
  conditions: WorkflowCondition[]
  actionData: Record<string, any>
}

export interface MaintenanceRequestWithRelations extends MaintenanceRequest {
  property: {
    id: string
    name: string
    companyId: string
  }
  unit?: {
    id: string
    unitNumber: string
  }
  requester: {
    id: string
    name: string
    email: string
  }
}

export class WorkflowEngine {
  /**
   * Process a maintenance request through all applicable workflow rules
   */
  static async processMaintenanceRequest(
    request: MaintenanceRequestWithRelations
  ): Promise<void> {
    try {
      // Get all active workflow rules for the company
      const rules = await prisma.workflowRule.findMany({
        where: {
          companyId: request.property.companyId,
          isActive: true,
          trigger: WorkflowTrigger.MAINTENANCE_CREATED
        },
        orderBy: {
          priority: 'asc'
        }
      })

      // Process each rule
      for (const rule of rules) {
        if (await this.evaluateRule(rule, request)) {
          await this.executeRuleActions(rule, request)
        }
      }
    } catch (error) {
      console.error('Error processing workflow rules:', error)
      throw error
    }
  }

  /**
   * Evaluate if a rule conditions match the maintenance request
   */
  private static async evaluateRule(
    rule: WorkflowRule,
    request: MaintenanceRequestWithRelations
  ): Promise<boolean> {
    try {
      const conditions = rule.conditions as WorkflowCondition[]
      
      if (!conditions || conditions.length === 0) {
        return true // No conditions means rule always applies
      }

      // All conditions must be true (AND logic)
      for (const condition of conditions) {
        if (!this.evaluateCondition(condition, request)) {
          return false
        }
      }

      return true
    } catch (error) {
      console.error('Error evaluating rule:', error)
      return false
    }
  }

  /**
   * Evaluate a single condition against the maintenance request
   */
  private static evaluateCondition(
    condition: WorkflowCondition,
    request: MaintenanceRequestWithRelations
  ): boolean {
    const fieldValue = this.getFieldValue(condition.field, request)
    
    switch (condition.operator) {
      case 'equals':
        return fieldValue === condition.value

      case 'contains':
        if (typeof fieldValue === 'string' && typeof condition.value === 'string') {
          return fieldValue.toLowerCase().includes(condition.value.toLowerCase())
        }
        return false

      case 'greater_than':
        if (typeof fieldValue === 'number' && typeof condition.value === 'number') {
          return fieldValue > condition.value
        }
        return false

      case 'less_than':
        if (typeof fieldValue === 'number' && typeof condition.value === 'number') {
          return fieldValue < condition.value
        }
        return false

      case 'in':
        if (Array.isArray(condition.value)) {
          return condition.value.includes(fieldValue as string)
        }
        return false

      default:
        return false
    }
  }

  /**
   * Get field value from maintenance request
   */
  private static getFieldValue(
    field: string,
    request: MaintenanceRequestWithRelations
  ): any {
    switch (field) {
      case 'category':
        return request.category
      case 'severity':
        return request.severity
      case 'title':
        return request.title
      case 'description':
        return request.description
      case 'location':
        return request.location
      case 'property.name':
        return request.property.name
      case 'unit.unitNumber':
        return request.unit?.unitNumber
      case 'requester.name':
        return request.requester.name
      default:
        return null
    }
  }

  /**
   * Execute all actions for a rule
   */
  private static async executeRuleActions(
    rule: WorkflowRule,
    request: MaintenanceRequestWithRelations
  ): Promise<void> {
    try {
      const actionData = rule.actionData as Record<string, any>

      switch (rule.action) {
        case WorkflowAction.ASSIGN_CONTRACTOR:
          await this.assignContractor(rule, request, actionData)
          break

        case WorkflowAction.SET_PRIORITY:
          await this.setPriority(rule, request, actionData)
          break

        case WorkflowAction.SEND_NOTIFICATION:
          await this.sendNotification(rule, request, actionData)
          break

        case WorkflowAction.ESCALATE:
          await this.escalateRequest(rule, request, actionData)
          break

        case WorkflowAction.AUTO_APPROVE:
          await this.autoApprove(rule, request, actionData)
          break

        default:
          console.warn(`Unknown workflow action: ${rule.action}`)
      }
    } catch (error) {
      console.error('Error executing rule actions:', error)
    }
  }

  /**
   * Assign contractor to maintenance request
   */
  private static async assignContractor(
    rule: WorkflowRule,
    request: MaintenanceRequestWithRelations,
    actionData: Record<string, any>
  ): Promise<void> {
    const contractorId = actionData.contractorId

    if (!contractorId) {
      console.warn('No contractor ID specified in rule action data')
      return
    }

    // Check if contractor exists and is available
    const contractor = await prisma.contractor.findFirst({
      where: {
        id: contractorId,
        status: 'ACTIVE',
        companyId: request.property.companyId
      }
    })

    if (!contractor) {
      console.warn(`Contractor ${contractorId} not found or not available`)
      return
    }

    // Assign contractor to request
    await prisma.maintenanceRequest.update({
      where: { id: request.id },
      data: {
        contractorId: contractor.id,
        status: 'ASSIGNED'
      }
    })

    // Send notification to contractor
    await sendNotification({
      userId: contractor.userId || '',
      title: 'New Maintenance Assignment',
      message: `You've been assigned to: ${request.title}`,
      type: 'MAINTENANCE_ASSIGNED',
      data: { requestId: request.id }
    })

    console.log(`Assigned contractor ${contractor.name} to request ${request.id}`)
  }

  /**
   * Set priority of maintenance request
   */
  private static async setPriority(
    rule: WorkflowRule,
    request: MaintenanceRequestWithRelations,
    actionData: Record<string, any>
  ): Promise<void> {
    const priority = actionData.priority as IssueSeverity

    if (!priority) {
      console.warn('No priority specified in rule action data')
      return
    }

    await prisma.maintenanceRequest.update({
      where: { id: request.id },
      data: { severity: priority }
    })

    console.log(`Set priority of request ${request.id} to ${priority}`)
  }

  /**
   * Send notification based on rule
   */
  private static async sendNotification(
    rule: WorkflowRule,
    request: MaintenanceRequestWithRelations,
    actionData: Record<string, any>
  ): Promise<void> {
    const { userIds, message, title } = actionData

    if (!userIds || !Array.isArray(userIds)) {
      console.warn('No user IDs specified for notification')
      return
    }

    for (const userId of userIds) {
      await sendNotification({
        userId,
        title: title || 'Maintenance Request Update',
        message: message || `New maintenance request: ${request.title}`,
        type: 'MAINTENANCE_NOTIFICATION',
        data: { requestId: request.id }
      })
    }

    console.log(`Sent notifications to ${userIds.length} users for request ${request.id}`)
  }

  /**
   * Escalate maintenance request
   */
  private static async escalateRequest(
    rule: WorkflowRule,
    request: MaintenanceRequestWithRelations,
    actionData: Record<string, any>
  ): Promise<void> {
    const { escalateToUserId, escalationMessage } = actionData

    if (!escalateToUserId) {
      console.warn('No escalation user ID specified')
      return
    }

    // Update request with escalation flag
    await prisma.maintenanceRequest.update({
      where: { id: request.id },
      data: {
        severity: 'HIGH', // Escalate priority
        notes: `Escalated: ${escalationMessage || 'Automatic escalation by workflow rule'}`
      }
    })

    // Send escalation notification
    await sendNotification({
      userId: escalateToUserId,
      title: 'Maintenance Request Escalated',
      message: escalationMessage || `Request escalated: ${request.title}`,
      type: 'MAINTENANCE_ESCALATED',
      data: { requestId: request.id }
    })

    console.log(`Escalated request ${request.id} to user ${escalateToUserId}`)
  }

  /**
   * Auto-approve maintenance request
   */
  private static async autoApprove(
    rule: WorkflowRule,
    request: MaintenanceRequestWithRelations,
    actionData: Record<string, any>
  ): Promise<void> {
    const maxCost = actionData.maxCost || 0

    // Only auto-approve if estimated cost is within limit
    if (request.estimatedCost && request.estimatedCost > maxCost) {
      console.log(`Request ${request.id} cost (${request.estimatedCost}) exceeds auto-approval limit (${maxCost})`)
      return
    }

    await prisma.maintenanceRequest.update({
      where: { id: request.id },
      data: {
        status: 'APPROVED',
        approvedAt: new Date(),
        notes: 'Auto-approved by workflow rule'
      }
    })

    console.log(`Auto-approved request ${request.id}`)
  }

  /**
   * Create a new workflow rule
   */
  static async createRule(ruleData: WorkflowRuleData): Promise<WorkflowRule> {
    return await prisma.workflowRule.create({
      data: {
        ...ruleData,
        conditions: ruleData.conditions,
        actionData: ruleData.actionData
      }
    })
  }

  /**
   * Update an existing workflow rule
   */
  static async updateRule(
    ruleId: string, 
    ruleData: Partial<WorkflowRuleData>
  ): Promise<WorkflowRule> {
    return await prisma.workflowRule.update({
      where: { id: ruleId },
      data: {
        ...ruleData,
        conditions: ruleData.conditions,
        actionData: ruleData.actionData
      }
    })
  }

  /**
   * Delete a workflow rule
   */
  static async deleteRule(ruleId: string): Promise<void> {
    await prisma.workflowRule.delete({
      where: { id: ruleId }
    })
  }

  /**
   * Get workflow rules for a company
   */
  static async getCompanyRules(companyId: string): Promise<WorkflowRule[]> {
    return await prisma.workflowRule.findMany({
      where: { companyId },
      orderBy: { priority: 'asc' }
    })
  }

  /**
   * Test a rule against sample data
   */
  static async testRule(
    rule: WorkflowRule,
    sampleRequest: MaintenanceRequestWithRelations
  ): Promise<boolean> {
    return await this.evaluateRule(rule, sampleRequest)
  }
}

// Helper functions for common workflow patterns
export const WorkflowPatterns = {
  /**
   * Create rule to auto-assign plumbing issues to specific contractor
   */
  createPlumbingAutoAssign: (companyId: string, contractorId: string): WorkflowRuleData => ({
    companyId,
    name: 'Auto-assign Plumbing Issues',
    description: 'Automatically assign plumbing-related maintenance requests to preferred contractor',
    trigger: WorkflowTrigger.MAINTENANCE_CREATED,
    conditions: [
      {
        field: 'category',
        operator: 'equals',
        value: IssueCategory.PLUMBING
      }
    ],
    action: WorkflowAction.ASSIGN_CONTRACTOR,
    actionData: { contractorId },
    priority: 1,
    isActive: true
  }),

  /**
   * Create rule to escalate urgent issues
   */
  createUrgentEscalation: (companyId: string, managerId: string): WorkflowRuleData => ({
    companyId,
    name: 'Escalate Urgent Issues',
    description: 'Automatically escalate urgent maintenance requests to property manager',
    trigger: WorkflowTrigger.MAINTENANCE_CREATED,
    conditions: [
      {
        field: 'severity',
        operator: 'equals',
        value: IssueSeverity.URGENT
      }
    ],
    action: WorkflowAction.ESCALATE,
    actionData: {
      escalateToUserId: managerId,
      escalationMessage: 'Urgent maintenance request requires immediate attention'
    },
    priority: 0, // Highest priority
    isActive: true
  }),

  /**
   * Create rule to auto-approve low-cost maintenance
   */
  createLowCostAutoApproval: (companyId: string, maxCost: number = 100): WorkflowRuleData => ({
    companyId,
    name: 'Auto-approve Low Cost Maintenance',
    description: `Automatically approve maintenance requests under $${maxCost}`,
    trigger: WorkflowTrigger.MAINTENANCE_CREATED,
    conditions: [
      {
        field: 'severity',
        operator: 'in',
        value: [IssueSeverity.LOW, IssueSeverity.MEDIUM]
      }
    ],
    action: WorkflowAction.AUTO_APPROVE,
    actionData: { maxCost },
    priority: 2,
    isActive: true
  })
}

