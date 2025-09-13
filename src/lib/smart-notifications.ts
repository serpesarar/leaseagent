import { AIService, SmartNotificationContent } from './ai-service'
import { sendNotification, sendUserNotification } from './pusher'
import { prisma } from './prisma'
import { 
  User, 
  UserRole, 
  MaintenanceRequest, 
  Payment,
  NotificationType,
  NotificationStatus,
  IssueSeverity 
} from '@prisma/client'

export interface NotificationRule {
  id: string
  name: string
  description: string
  trigger: NotificationTrigger
  conditions: NotificationCondition[]
  recipients: NotificationRecipient[]
  template: NotificationTemplate
  frequency: NotificationFrequency
  isActive: boolean
  aiEnhanced: boolean
  priority: number
}

export interface NotificationCondition {
  field: string
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'in'
  value: any
}

export interface NotificationRecipient {
  type: 'ROLE' | 'USER' | 'EMAIL'
  value: string
  conditions?: NotificationCondition[]
}

export interface NotificationTemplate {
  title: string
  message: string
  actionUrl?: string
  actionText?: string
  variables: string[]
}

export enum NotificationTrigger {
  MAINTENANCE_CREATED = 'MAINTENANCE_CREATED',
  MAINTENANCE_ASSIGNED = 'MAINTENANCE_ASSIGNED',
  MAINTENANCE_COMPLETED = 'MAINTENANCE_COMPLETED',
  MAINTENANCE_OVERDUE = 'MAINTENANCE_OVERDUE',
  PAYMENT_OVERDUE = 'PAYMENT_OVERDUE',
  PAYMENT_RECEIVED = 'PAYMENT_RECEIVED',
  LEASE_EXPIRING = 'LEASE_EXPIRING',
  PROPERTY_ISSUE = 'PROPERTY_ISSUE',
  CONTRACTOR_AVAILABLE = 'CONTRACTOR_AVAILABLE',
  EMERGENCY_ALERT = 'EMERGENCY_ALERT',
  PREDICTIVE_MAINTENANCE = 'PREDICTIVE_MAINTENANCE'
}

export enum NotificationFrequency {
  IMMEDIATE = 'IMMEDIATE',
  HOURLY = 'HOURLY',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY'
}

export interface SmartNotificationContext {
  trigger: NotificationTrigger
  entityId: string
  entityType: string
  companyId: string
  data: Record<string, any>
  urgency?: number
  metadata?: Record<string, any>
}

export class SmartNotificationSystem {
  private static notificationQueue: Map<string, any[]> = new Map()
  private static processingInterval: NodeJS.Timeout | null = null

  /**
   * Initialize the smart notification system
   */
  static initialize() {
    // Start processing queue every 30 seconds
    this.processingInterval = setInterval(() => {
      this.processNotificationQueue()
    }, 30000)

    console.log('Smart notification system initialized')
  }

  /**
   * Stop the notification system
   */
  static shutdown() {
    if (this.processingInterval) {
      clearInterval(this.processingInterval)
      this.processingInterval = null
    }
  }

  /**
   * Send smart notification based on context
   */
  static async sendSmartNotification(context: SmartNotificationContext): Promise<void> {
    try {
      // Get applicable notification rules
      const rules = await this.getApplicableRules(context)

      if (rules.length === 0) {
        console.log(`No notification rules found for trigger: ${context.trigger}`)
        return
      }

      // Process each rule
      for (const rule of rules) {
        await this.processNotificationRule(rule, context)
      }

    } catch (error) {
      console.error('Error sending smart notification:', error)
    }
  }

  /**
   * Process a specific notification rule
   */
  private static async processNotificationRule(
    rule: NotificationRule,
    context: SmartNotificationContext
  ): Promise<void> {
    try {
      // Check if conditions are met
      if (!this.evaluateConditions(rule.conditions, context)) {
        return
      }

      // Check frequency constraints
      if (!await this.checkFrequencyConstraints(rule, context)) {
        return
      }

      // Generate notification content
      const content = await this.generateNotificationContent(rule, context)

      // Get recipients
      const recipients = await this.resolveRecipients(rule.recipients, context)

      // Send notifications
      for (const recipient of recipients) {
        await this.deliverNotification(recipient, content, rule, context)
      }

      // Log notification sent
      await this.logNotification(rule, context, recipients, content)

    } catch (error) {
      console.error('Error processing notification rule:', error)
    }
  }

  /**
   * Generate notification content using AI if enabled
   */
  private static async generateNotificationContent(
    rule: NotificationRule,
    context: SmartNotificationContext
  ): Promise<SmartNotificationContent> {
    try {
      if (rule.aiEnhanced) {
        // Use AI to generate smart content
        const aiContent = await AIService.generateSmartNotification({
          issueType: context.entityType,
          severity: context.data.severity || IssueSeverity.MEDIUM,
          tenantInfo: context.data.tenant,
          propertyInfo: context.data.property,
          contractorInfo: context.data.contractor,
          urgency: context.urgency
        })

        return aiContent
      } else {
        // Use template-based content
        return this.generateTemplateContent(rule.template, context)
      }
    } catch (error) {
      console.error('Error generating notification content:', error)
      return this.generateFallbackContent(rule, context)
    }
  }

  /**
   * Generate content from template
   */
  private static generateTemplateContent(
    template: NotificationTemplate,
    context: SmartNotificationContext
  ): SmartNotificationContent {
    let title = template.title
    let message = template.message

    // Replace variables
    template.variables.forEach(variable => {
      const value = this.getVariableValue(variable, context)
      title = title.replace(`{{${variable}}}`, String(value))
      message = message.replace(`{{${variable}}}`, String(value))
    })

    return {
      title,
      message,
      priority: this.determinePriority(context),
      actionItems: this.generateActionItems(context),
      estimatedResponseTime: this.calculateResponseTime(context),
      escalationPath: this.getEscalationPath(context)
    }
  }

  /**
   * Get variable value from context
   */
  private static getVariableValue(variable: string, context: SmartNotificationContext): any {
    const paths = variable.split('.')
    let value: any = context

    for (const path of paths) {
      if (value && typeof value === 'object' && path in value) {
        value = value[path]
      } else {
        return `{{${variable}}}`
      }
    }

    return value
  }

  /**
   * Resolve notification recipients
   */
  private static async resolveRecipients(
    recipients: NotificationRecipient[],
    context: SmartNotificationContext
  ): Promise<User[]> {
    const resolvedRecipients: User[] = []

    for (const recipient of recipients) {
      try {
        switch (recipient.type) {
          case 'ROLE':
            const roleUsers = await prisma.user.findMany({
              where: {
                companyId: context.companyId,
                role: recipient.value as UserRole
              }
            })
            resolvedRecipients.push(...roleUsers)
            break

          case 'USER':
            const user = await prisma.user.findUnique({
              where: { id: recipient.value }
            })
            if (user) resolvedRecipients.push(user)
            break

          case 'EMAIL':
            // Handle external email recipients
            // This would require creating temporary user records or handling differently
            break
        }
      } catch (error) {
        console.error(`Error resolving recipient ${recipient.type}:${recipient.value}:`, error)
      }
    }

    return resolvedRecipients
  }

  /**
   * Deliver notification to recipient
   */
  private static async deliverNotification(
    recipient: User,
    content: SmartNotificationContent,
    rule: NotificationRule,
    context: SmartNotificationContext
  ): Promise<void> {
    try {
      // Send real-time notification
      await sendUserNotification({
        userId: recipient.id,
        title: content.title,
        message: content.message,
        type: this.mapTriggerToNotificationType(context.trigger),
        data: {
          entityId: context.entityId,
          entityType: context.entityType,
          ruleId: rule.id,
          priority: content.priority,
          actionItems: content.actionItems
        }
      })

      // Store in database for persistence
      await prisma.notification.create({
        data: {
          userId: recipient.id,
          title: content.title,
          message: content.message,
          type: this.mapTriggerToNotificationType(context.trigger),
          status: NotificationStatus.SENT,
          data: context.data,
          metadata: {
            ruleId: rule.id,
            trigger: context.trigger,
            priority: content.priority
          }
        }
      })

      // Send email if high priority or specified
      if (content.priority === 'HIGH' || content.priority === 'URGENT') {
        await this.sendEmailNotification(recipient, content, context)
      }

    } catch (error) {
      console.error('Error delivering notification:', error)
    }
  }

  /**
   * Send email notification
   */
  private static async sendEmailNotification(
    recipient: User,
    content: SmartNotificationContent,
    context: SmartNotificationContext
  ): Promise<void> {
    try {
      // This would integrate with your email service (SendGrid, AWS SES, etc.)
      console.log(`Sending email to ${recipient.email}:`, content.title)
      
      // Implementation would go here
      // await emailService.send({
      //   to: recipient.email,
      //   subject: content.title,
      //   html: this.generateEmailTemplate(content, context)
      // })
      
    } catch (error) {
      console.error('Error sending email notification:', error)
    }
  }

  /**
   * Evaluate notification conditions
   */
  private static evaluateConditions(
    conditions: NotificationCondition[],
    context: SmartNotificationContext
  ): boolean {
    if (!conditions || conditions.length === 0) {
      return true
    }

    return conditions.every(condition => {
      const fieldValue = this.getVariableValue(condition.field, context)
      
      switch (condition.operator) {
        case 'equals':
          return fieldValue === condition.value
        case 'contains':
          return String(fieldValue).toLowerCase().includes(String(condition.value).toLowerCase())
        case 'greater_than':
          return Number(fieldValue) > Number(condition.value)
        case 'less_than':
          return Number(fieldValue) < Number(condition.value)
        case 'in':
          return Array.isArray(condition.value) && condition.value.includes(fieldValue)
        default:
          return false
      }
    })
  }

  /**
   * Check frequency constraints
   */
  private static async checkFrequencyConstraints(
    rule: NotificationRule,
    context: SmartNotificationContext
  ): Promise<boolean> {
    if (rule.frequency === NotificationFrequency.IMMEDIATE) {
      return true
    }

    try {
      const timeWindow = this.getTimeWindow(rule.frequency)
      const recentNotifications = await prisma.notification.count({
        where: {
          metadata: {
            path: ['ruleId'],
            equals: rule.id
          },
          createdAt: {
            gte: new Date(Date.now() - timeWindow)
          }
        }
      })

      return recentNotifications === 0
    } catch (error) {
      console.error('Error checking frequency constraints:', error)
      return true // Allow notification on error
    }
  }

  /**
   * Get applicable notification rules
   */
  private static async getApplicableRules(
    context: SmartNotificationContext
  ): Promise<NotificationRule[]> {
    try {
      // This would fetch from database in real implementation
      // For now, return mock rules based on trigger
      return this.getMockRules().filter(rule => 
        rule.trigger === context.trigger && rule.isActive
      )
    } catch (error) {
      console.error('Error getting applicable rules:', error)
      return []
    }
  }

  /**
   * Log notification for analytics
   */
  private static async logNotification(
    rule: NotificationRule,
    context: SmartNotificationContext,
    recipients: User[],
    content: SmartNotificationContent
  ): Promise<void> {
    try {
      // Log notification event for analytics
      console.log(`Notification sent: ${rule.name} to ${recipients.length} recipients`)
      
      // This would integrate with analytics service
      // await analytics.track('notification_sent', {
      //   ruleId: rule.id,
      //   trigger: context.trigger,
      //   recipientCount: recipients.length,
      //   priority: content.priority
      // })
      
    } catch (error) {
      console.error('Error logging notification:', error)
    }
  }

  /**
   * Process notification queue for batching
   */
  private static async processNotificationQueue(): Promise<void> {
    for (const [key, notifications] of this.notificationQueue) {
      try {
        // Process batched notifications
        await this.processBatchedNotifications(key, notifications)
        this.notificationQueue.delete(key)
      } catch (error) {
        console.error('Error processing notification queue:', error)
      }
    }
  }

  /**
   * Process batched notifications
   */
  private static async processBatchedNotifications(
    key: string,
    notifications: any[]
  ): Promise<void> {
    // Group notifications by recipient and send digest
    const groupedByRecipient = new Map<string, any[]>()
    
    notifications.forEach(notification => {
      notification.recipients.forEach((recipient: User) => {
        if (!groupedByRecipient.has(recipient.id)) {
          groupedByRecipient.set(recipient.id, [])
        }
        groupedByRecipient.get(recipient.id)!.push(notification)
      })
    })

    // Send digest to each recipient
    for (const [recipientId, recipientNotifications] of groupedByRecipient) {
      await this.sendNotificationDigest(recipientId, recipientNotifications)
    }
  }

  /**
   * Send notification digest
   */
  private static async sendNotificationDigest(
    recipientId: string,
    notifications: any[]
  ): Promise<void> {
    try {
      const recipient = await prisma.user.findUnique({
        where: { id: recipientId }
      })

      if (!recipient) return

      const digestTitle = `Daily Summary: ${notifications.length} updates`
      const digestMessage = this.generateDigestMessage(notifications)

      await sendUserNotification({
        userId: recipient.id,
        title: digestTitle,
        message: digestMessage,
        type: NotificationType.SYSTEM_NOTIFICATION,
        data: {
          digest: true,
          notificationCount: notifications.length
        }
      })

    } catch (error) {
      console.error('Error sending notification digest:', error)
    }
  }

  /**
   * Utility methods
   */
  private static determinePriority(context: SmartNotificationContext): 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' {
    if (context.urgency && context.urgency >= 8) return 'URGENT'
    if (context.urgency && context.urgency >= 6) return 'HIGH'
    if (context.urgency && context.urgency >= 4) return 'MEDIUM'
    return 'LOW'
  }

  private static generateActionItems(context: SmartNotificationContext): string[] {
    const actions = ['Review details']
    
    switch (context.trigger) {
      case NotificationTrigger.MAINTENANCE_CREATED:
        actions.push('Assign contractor', 'Set priority')
        break
      case NotificationTrigger.PAYMENT_OVERDUE:
        actions.push('Contact tenant', 'Send reminder')
        break
      case NotificationTrigger.EMERGENCY_ALERT:
        actions.push('Immediate response required')
        break
    }

    return actions
  }

  private static calculateResponseTime(context: SmartNotificationContext): string {
    switch (context.trigger) {
      case NotificationTrigger.EMERGENCY_ALERT:
        return 'Immediate'
      case NotificationTrigger.MAINTENANCE_CREATED:
        return context.urgency && context.urgency >= 7 ? '2 hours' : '24 hours'
      default:
        return '24 hours'
    }
  }

  private static getEscalationPath(context: SmartNotificationContext): string[] {
    return ['Property Manager', 'Company Owner', 'Emergency Services']
  }

  private static generateFallbackContent(
    rule: NotificationRule,
    context: SmartNotificationContext
  ): SmartNotificationContent {
    return {
      title: rule.template.title || 'Notification',
      message: rule.template.message || 'You have a new notification',
      priority: 'MEDIUM',
      actionItems: ['Review notification'],
      estimatedResponseTime: '24 hours',
      escalationPath: ['Manager']
    }
  }

  private static mapTriggerToNotificationType(trigger: NotificationTrigger): NotificationType {
    switch (trigger) {
      case NotificationTrigger.MAINTENANCE_CREATED:
      case NotificationTrigger.MAINTENANCE_ASSIGNED:
      case NotificationTrigger.MAINTENANCE_COMPLETED:
        return NotificationType.MAINTENANCE_UPDATE
      case NotificationTrigger.PAYMENT_OVERDUE:
      case NotificationTrigger.PAYMENT_RECEIVED:
        return NotificationType.PAYMENT_REMINDER
      default:
        return NotificationType.SYSTEM_NOTIFICATION
    }
  }

  private static getTimeWindow(frequency: NotificationFrequency): number {
    switch (frequency) {
      case NotificationFrequency.HOURLY:
        return 60 * 60 * 1000 // 1 hour
      case NotificationFrequency.DAILY:
        return 24 * 60 * 60 * 1000 // 24 hours
      case NotificationFrequency.WEEKLY:
        return 7 * 24 * 60 * 60 * 1000 // 7 days
      default:
        return 0
    }
  }

  private static generateDigestMessage(notifications: any[]): string {
    const types = new Map<string, number>()
    notifications.forEach(n => {
      const type = n.context.trigger
      types.set(type, (types.get(type) || 0) + 1)
    })

    let message = 'Summary of recent activity:\n'
    for (const [type, count] of types) {
      message += `• ${count} ${type.replace('_', ' ').toLowerCase()}\n`
    }

    return message
  }

  private static getMockRules(): NotificationRule[] {
    return [
      {
        id: '1',
        name: 'Urgent Maintenance Alert',
        description: 'Notify managers immediately for urgent maintenance requests',
        trigger: NotificationTrigger.MAINTENANCE_CREATED,
        conditions: [
          { field: 'data.severity', operator: 'equals', value: 'URGENT' }
        ],
        recipients: [
          { type: 'ROLE', value: 'PROPERTY_MANAGER' }
        ],
        template: {
          title: 'Urgent Maintenance Required',
          message: 'An urgent maintenance request has been submitted: {{data.title}}',
          variables: ['data.title', 'data.property.name']
        },
        frequency: NotificationFrequency.IMMEDIATE,
        isActive: true,
        aiEnhanced: true,
        priority: 1
      },
      {
        id: '2',
        name: 'Payment Overdue Alert',
        description: 'Notify when payments are overdue',
        trigger: NotificationTrigger.PAYMENT_OVERDUE,
        conditions: [],
        recipients: [
          { type: 'ROLE', value: 'PROPERTY_MANAGER' },
          { type: 'ROLE', value: 'ACCOUNTANT' }
        ],
        template: {
          title: 'Payment Overdue',
          message: 'Payment is overdue for {{data.tenant.name}} - {{data.property.name}}',
          variables: ['data.tenant.name', 'data.property.name', 'data.amount']
        },
        frequency: NotificationFrequency.DAILY,
        isActive: true,
        aiEnhanced: false,
        priority: 2
      }
    ]
  }

  /**
   * Create custom notification rule
   */
  static async createNotificationRule(ruleData: Omit<NotificationRule, 'id'>): Promise<NotificationRule> {
    const rule: NotificationRule = {
      id: Date.now().toString(),
      ...ruleData
    }

    // In real implementation, save to database
    console.log('Created notification rule:', rule.name)

    return rule
  }

  /**
   * Send immediate notification (bypass rules)
   */
  static async sendImmediateNotification(
    recipients: string[],
    title: string,
    message: string,
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' = 'MEDIUM'
  ): Promise<void> {
    for (const recipientId of recipients) {
      try {
        await sendUserNotification({
          userId: recipientId,
          title,
          message,
          type: NotificationType.SYSTEM_NOTIFICATION,
          data: { priority, immediate: true }
        })
      } catch (error) {
        console.error(`Error sending immediate notification to ${recipientId}:`, error)
      }
    }
  }
}

