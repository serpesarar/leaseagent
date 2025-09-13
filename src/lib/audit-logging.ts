import { NextRequest } from 'next/server'
import { prisma } from './prisma'
import { maskSensitiveData } from './encryption'

// Audit event types
export enum AuditEventType {
  // Authentication events
  USER_LOGIN = 'USER_LOGIN',
  USER_LOGOUT = 'USER_LOGOUT',
  USER_LOGIN_FAILED = 'USER_LOGIN_FAILED',
  PASSWORD_CHANGED = 'PASSWORD_CHANGED',
  PASSWORD_RESET_REQUESTED = 'PASSWORD_RESET_REQUESTED',
  PASSWORD_RESET_COMPLETED = 'PASSWORD_RESET_COMPLETED',
  TWO_FACTOR_ENABLED = 'TWO_FACTOR_ENABLED',
  TWO_FACTOR_DISABLED = 'TWO_FACTOR_DISABLED',
  
  // User management events
  USER_CREATED = 'USER_CREATED',
  USER_UPDATED = 'USER_UPDATED',
  USER_DELETED = 'USER_DELETED',
  USER_ROLE_CHANGED = 'USER_ROLE_CHANGED',
  USER_PERMISSIONS_CHANGED = 'USER_PERMISSIONS_CHANGED',
  
  // Property management events
  PROPERTY_CREATED = 'PROPERTY_CREATED',
  PROPERTY_UPDATED = 'PROPERTY_UPDATED',
  PROPERTY_DELETED = 'PROPERTY_DELETED',
  UNIT_CREATED = 'UNIT_CREATED',
  UNIT_UPDATED = 'UNIT_UPDATED',
  UNIT_DELETED = 'UNIT_DELETED',
  
  // Lease management events
  LEASE_CREATED = 'LEASE_CREATED',
  LEASE_UPDATED = 'LEASE_UPDATED',
  LEASE_TERMINATED = 'LEASE_TERMINATED',
  LEASE_RENEWED = 'LEASE_RENEWED',
  
  // Maintenance events
  MAINTENANCE_REQUEST_CREATED = 'MAINTENANCE_REQUEST_CREATED',
  MAINTENANCE_REQUEST_UPDATED = 'MAINTENANCE_REQUEST_UPDATED',
  MAINTENANCE_REQUEST_ASSIGNED = 'MAINTENANCE_REQUEST_ASSIGNED',
  MAINTENANCE_REQUEST_COMPLETED = 'MAINTENANCE_REQUEST_COMPLETED',
  MAINTENANCE_REQUEST_CANCELLED = 'MAINTENANCE_REQUEST_CANCELLED',
  
  // Payment events
  PAYMENT_CREATED = 'PAYMENT_CREATED',
  PAYMENT_UPDATED = 'PAYMENT_UPDATED',
  PAYMENT_PROCESSED = 'PAYMENT_PROCESSED',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  PAYMENT_REFUNDED = 'PAYMENT_REFUNDED',
  
  // Security events
  SECURITY_BREACH_DETECTED = 'SECURITY_BREACH_DETECTED',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  UNAUTHORIZED_ACCESS_ATTEMPT = 'UNAUTHORIZED_ACCESS_ATTEMPT',
  DATA_EXPORT = 'DATA_EXPORT',
  DATA_IMPORT = 'DATA_IMPORT',
  
  // System events
  SYSTEM_BACKUP_CREATED = 'SYSTEM_BACKUP_CREATED',
  SYSTEM_BACKUP_RESTORED = 'SYSTEM_BACKUP_RESTORED',
  SYSTEM_CONFIGURATION_CHANGED = 'SYSTEM_CONFIGURATION_CHANGED',
  API_KEY_CREATED = 'API_KEY_CREATED',
  API_KEY_REVOKED = 'API_KEY_REVOKED',
  
  // AI events
  AI_ANALYSIS_PERFORMED = 'AI_ANALYSIS_PERFORMED',
  AUTOMATED_ROUTING_EXECUTED = 'AUTOMATED_ROUTING_EXECUTED',
  PREDICTIVE_MAINTENANCE_GENERATED = 'PREDICTIVE_MAINTENANCE_GENERATED'
}

// Audit event severity levels
export enum AuditSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

// Audit log entry interface
export interface AuditLogEntry {
  id?: string
  eventType: AuditEventType
  severity: AuditSeverity
  userId?: string
  companyId?: string
  entityType?: string
  entityId?: string
  description: string
  metadata?: Record<string, any>
  ipAddress?: string
  userAgent?: string
  timestamp: Date
  success: boolean
  errorMessage?: string
  requestId?: string
  sessionId?: string
}

// Audit logger class
export class AuditLogger {
  private static instance: AuditLogger
  private logQueue: AuditLogEntry[] = []
  private isProcessing = false
  private batchSize = 100
  private flushInterval = 5000 // 5 seconds

  constructor() {
    // Start periodic flush
    setInterval(() => {
      this.flush()
    }, this.flushInterval)
  }

  static getInstance(): AuditLogger {
    if (!AuditLogger.instance) {
      AuditLogger.instance = new AuditLogger()
    }
    return AuditLogger.instance
  }

  /**
   * Log an audit event
   */
  async log(entry: Omit<AuditLogEntry, 'timestamp'>): Promise<void> {
    const auditEntry: AuditLogEntry = {
      ...entry,
      timestamp: new Date(),
      metadata: entry.metadata ? maskSensitiveData(entry.metadata) : undefined
    }

    // Add to queue for batch processing
    this.logQueue.push(auditEntry)

    // Flush immediately for critical events
    if (entry.severity === AuditSeverity.CRITICAL) {
      await this.flush()
    }
  }

  /**
   * Log authentication event
   */
  async logAuth(
    eventType: AuditEventType,
    userId: string,
    companyId: string,
    success: boolean,
    req?: NextRequest,
    metadata?: Record<string, any>
  ): Promise<void> {
    await this.log({
      eventType,
      severity: success ? AuditSeverity.LOW : AuditSeverity.MEDIUM,
      userId,
      companyId,
      description: this.getEventDescription(eventType, { success, userId }),
      success,
      ipAddress: this.getClientIP(req),
      userAgent: req?.headers.get('user-agent') || undefined,
      metadata
    })
  }

  /**
   * Log security event
   */
  async logSecurity(
    eventType: AuditEventType,
    description: string,
    severity: AuditSeverity = AuditSeverity.HIGH,
    req?: NextRequest,
    metadata?: Record<string, any>
  ): Promise<void> {
    await this.log({
      eventType,
      severity,
      description,
      success: false,
      ipAddress: this.getClientIP(req),
      userAgent: req?.headers.get('user-agent') || undefined,
      metadata
    })
  }

  /**
   * Log data access event
   */
  async logDataAccess(
    eventType: AuditEventType,
    userId: string,
    companyId: string,
    entityType: string,
    entityId: string,
    description: string,
    req?: NextRequest,
    metadata?: Record<string, any>
  ): Promise<void> {
    await this.log({
      eventType,
      severity: AuditSeverity.MEDIUM,
      userId,
      companyId,
      entityType,
      entityId,
      description,
      success: true,
      ipAddress: this.getClientIP(req),
      userAgent: req?.headers.get('user-agent') || undefined,
      metadata
    })
  }

  /**
   * Log system event
   */
  async logSystem(
    eventType: AuditEventType,
    description: string,
    severity: AuditSeverity = AuditSeverity.LOW,
    metadata?: Record<string, any>
  ): Promise<void> {
    await this.log({
      eventType,
      severity,
      description,
      success: true,
      metadata
    })
  }

  /**
   * Log API request
   */
  async logAPIRequest(
    userId: string | undefined,
    companyId: string | undefined,
    method: string,
    path: string,
    statusCode: number,
    responseTime: number,
    req?: NextRequest
  ): Promise<void> {
    const success = statusCode < 400
    const severity = statusCode >= 500 ? AuditSeverity.HIGH : 
                    statusCode >= 400 ? AuditSeverity.MEDIUM : 
                    AuditSeverity.LOW

    await this.log({
      eventType: AuditEventType.DATA_EXPORT, // Generic for API access
      severity,
      userId,
      companyId,
      description: `API ${method} ${path} - ${statusCode}`,
      success,
      ipAddress: this.getClientIP(req),
      userAgent: req?.headers.get('user-agent') || undefined,
      metadata: {
        method,
        path,
        statusCode,
        responseTime
      }
    })
  }

  /**
   * Flush queued logs to database
   */
  private async flush(): Promise<void> {
    if (this.isProcessing || this.logQueue.length === 0) {
      return
    }

    this.isProcessing = true
    const logsToProcess = this.logQueue.splice(0, this.batchSize)

    try {
      // Batch insert to database
      await prisma.auditLog.createMany({
        data: logsToProcess.map(entry => ({
          eventType: entry.eventType,
          severity: entry.severity,
          userId: entry.userId,
          companyId: entry.companyId,
          entityType: entry.entityType,
          entityId: entry.entityId,
          description: entry.description,
          metadata: entry.metadata ? JSON.stringify(entry.metadata) : null,
          ipAddress: entry.ipAddress,
          userAgent: entry.userAgent,
          timestamp: entry.timestamp,
          success: entry.success,
          errorMessage: entry.errorMessage,
          requestId: entry.requestId,
          sessionId: entry.sessionId
        }))
      })

      // Also log to external services in production
      if (process.env.NODE_ENV === 'production') {
        await this.sendToExternalLogging(logsToProcess)
      }

    } catch (error) {
      console.error('Failed to flush audit logs:', error)
      
      // Re-queue failed logs
      this.logQueue.unshift(...logsToProcess)
    } finally {
      this.isProcessing = false
    }
  }

  /**
   * Send logs to external logging service
   */
  private async sendToExternalLogging(logs: AuditLogEntry[]): Promise<void> {
    try {
      // Example: Send to external service like DataDog, Splunk, etc.
      if (process.env.EXTERNAL_LOGGING_ENDPOINT) {
        await fetch(process.env.EXTERNAL_LOGGING_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.EXTERNAL_LOGGING_TOKEN}`
          },
          body: JSON.stringify({ logs })
        })
      }
    } catch (error) {
      console.error('Failed to send logs to external service:', error)
    }
  }

  /**
   * Get client IP address from request
   */
  private getClientIP(req?: NextRequest): string | undefined {
    if (!req) return undefined

    const forwarded = req.headers.get('x-forwarded-for')
    const realIp = req.headers.get('x-real-ip')
    const clientIp = forwarded?.split(',')[0] ?? realIp ?? req.ip

    return clientIp || undefined
  }

  /**
   * Generate event description
   */
  private getEventDescription(eventType: AuditEventType, context: any = {}): string {
    const descriptions: Record<AuditEventType, string> = {
      [AuditEventType.USER_LOGIN]: `User ${context.userId} logged in ${context.success ? 'successfully' : 'unsuccessfully'}`,
      [AuditEventType.USER_LOGOUT]: `User ${context.userId} logged out`,
      [AuditEventType.USER_LOGIN_FAILED]: `Failed login attempt for user ${context.userId}`,
      [AuditEventType.PASSWORD_CHANGED]: `User ${context.userId} changed password`,
      [AuditEventType.PASSWORD_RESET_REQUESTED]: `Password reset requested for user ${context.userId}`,
      [AuditEventType.PASSWORD_RESET_COMPLETED]: `Password reset completed for user ${context.userId}`,
      [AuditEventType.TWO_FACTOR_ENABLED]: `Two-factor authentication enabled for user ${context.userId}`,
      [AuditEventType.TWO_FACTOR_DISABLED]: `Two-factor authentication disabled for user ${context.userId}`,
      [AuditEventType.USER_CREATED]: `User ${context.userId} was created`,
      [AuditEventType.USER_UPDATED]: `User ${context.userId} was updated`,
      [AuditEventType.USER_DELETED]: `User ${context.userId} was deleted`,
      [AuditEventType.USER_ROLE_CHANGED]: `User ${context.userId} role was changed`,
      [AuditEventType.USER_PERMISSIONS_CHANGED]: `User ${context.userId} permissions were changed`,
      [AuditEventType.PROPERTY_CREATED]: `Property ${context.entityId} was created`,
      [AuditEventType.PROPERTY_UPDATED]: `Property ${context.entityId} was updated`,
      [AuditEventType.PROPERTY_DELETED]: `Property ${context.entityId} was deleted`,
      [AuditEventType.UNIT_CREATED]: `Unit ${context.entityId} was created`,
      [AuditEventType.UNIT_UPDATED]: `Unit ${context.entityId} was updated`,
      [AuditEventType.UNIT_DELETED]: `Unit ${context.entityId} was deleted`,
      [AuditEventType.LEASE_CREATED]: `Lease ${context.entityId} was created`,
      [AuditEventType.LEASE_UPDATED]: `Lease ${context.entityId} was updated`,
      [AuditEventType.LEASE_TERMINATED]: `Lease ${context.entityId} was terminated`,
      [AuditEventType.LEASE_RENEWED]: `Lease ${context.entityId} was renewed`,
      [AuditEventType.MAINTENANCE_REQUEST_CREATED]: `Maintenance request ${context.entityId} was created`,
      [AuditEventType.MAINTENANCE_REQUEST_UPDATED]: `Maintenance request ${context.entityId} was updated`,
      [AuditEventType.MAINTENANCE_REQUEST_ASSIGNED]: `Maintenance request ${context.entityId} was assigned`,
      [AuditEventType.MAINTENANCE_REQUEST_COMPLETED]: `Maintenance request ${context.entityId} was completed`,
      [AuditEventType.MAINTENANCE_REQUEST_CANCELLED]: `Maintenance request ${context.entityId} was cancelled`,
      [AuditEventType.PAYMENT_CREATED]: `Payment ${context.entityId} was created`,
      [AuditEventType.PAYMENT_UPDATED]: `Payment ${context.entityId} was updated`,
      [AuditEventType.PAYMENT_PROCESSED]: `Payment ${context.entityId} was processed`,
      [AuditEventType.PAYMENT_FAILED]: `Payment ${context.entityId} failed`,
      [AuditEventType.PAYMENT_REFUNDED]: `Payment ${context.entityId} was refunded`,
      [AuditEventType.SECURITY_BREACH_DETECTED]: 'Security breach detected',
      [AuditEventType.SUSPICIOUS_ACTIVITY]: 'Suspicious activity detected',
      [AuditEventType.RATE_LIMIT_EXCEEDED]: 'Rate limit exceeded',
      [AuditEventType.UNAUTHORIZED_ACCESS_ATTEMPT]: 'Unauthorized access attempt',
      [AuditEventType.DATA_EXPORT]: 'Data export performed',
      [AuditEventType.DATA_IMPORT]: 'Data import performed',
      [AuditEventType.SYSTEM_BACKUP_CREATED]: 'System backup created',
      [AuditEventType.SYSTEM_BACKUP_RESTORED]: 'System backup restored',
      [AuditEventType.SYSTEM_CONFIGURATION_CHANGED]: 'System configuration changed',
      [AuditEventType.API_KEY_CREATED]: 'API key created',
      [AuditEventType.API_KEY_REVOKED]: 'API key revoked',
      [AuditEventType.AI_ANALYSIS_PERFORMED]: 'AI analysis performed',
      [AuditEventType.AUTOMATED_ROUTING_EXECUTED]: 'Automated routing executed',
      [AuditEventType.PREDICTIVE_MAINTENANCE_GENERATED]: 'Predictive maintenance generated'
    }

    return descriptions[eventType] || `Event ${eventType} occurred`
  }
}

// Middleware for automatic API request logging
export function createAuditMiddleware() {
  return async (req: NextRequest, context: any) => {
    const startTime = Date.now()
    const auditLogger = AuditLogger.getInstance()
    
    // Extract user info from request (this would be from your auth system)
    const userId = context.user?.id
    const companyId = context.user?.companyId
    
    return new Promise((resolve) => {
      // Log the API request after response
      const originalSend = context.response?.send
      if (context.response && originalSend) {
        context.response.send = function(data: any) {
          const responseTime = Date.now() - startTime
          const statusCode = context.response.statusCode || 200
          
          auditLogger.logAPIRequest(
            userId,
            companyId,
            req.method,
            req.nextUrl.pathname,
            statusCode,
            responseTime,
            req
          )
          
          return originalSend.call(this, data)
        }
      }
      
      resolve(context)
    })
  }
}

// Audit decorators for common operations
export function auditOperation(eventType: AuditEventType, entityType?: string) {
  return function <T extends any[], R>(
    target: (...args: T) => Promise<R>
  ) {
    return async function (this: any, ...args: T): Promise<R> {
      const auditLogger = AuditLogger.getInstance()
      const startTime = Date.now()
      
      try {
        const result = await target.apply(this, args)
        
        // Log successful operation
        await auditLogger.log({
          eventType,
          severity: AuditSeverity.LOW,
          entityType,
          description: `${eventType} completed successfully`,
          success: true,
          metadata: {
            executionTime: Date.now() - startTime
          }
        })
        
        return result
      } catch (error) {
        // Log failed operation
        await auditLogger.log({
          eventType,
          severity: AuditSeverity.HIGH,
          entityType,
          description: `${eventType} failed`,
          success: false,
          errorMessage: error instanceof Error ? error.message : String(error),
          metadata: {
            executionTime: Date.now() - startTime
          }
        })
        
        throw error
      }
    }
  }
}

// Utility functions for common audit scenarios
export async function auditUserAction(
  eventType: AuditEventType,
  userId: string,
  companyId: string,
  description: string,
  req?: NextRequest,
  metadata?: Record<string, any>
): Promise<void> {
  const auditLogger = AuditLogger.getInstance()
  await auditLogger.log({
    eventType,
    severity: AuditSeverity.MEDIUM,
    userId,
    companyId,
    description,
    success: true,
    ipAddress: auditLogger['getClientIP'](req),
    userAgent: req?.headers.get('user-agent') || undefined,
    metadata
  })
}

export async function auditSecurityEvent(
  eventType: AuditEventType,
  description: string,
  severity: AuditSeverity = AuditSeverity.HIGH,
  req?: NextRequest,
  metadata?: Record<string, any>
): Promise<void> {
  const auditLogger = AuditLogger.getInstance()
  await auditLogger.logSecurity(eventType, description, severity, req, metadata)
}

export async function auditDataChange(
  eventType: AuditEventType,
  userId: string,
  companyId: string,
  entityType: string,
  entityId: string,
  changes: Record<string, { from: any; to: any }>,
  req?: NextRequest
): Promise<void> {
  const auditLogger = AuditLogger.getInstance()
  await auditLogger.logDataAccess(
    eventType,
    userId,
    companyId,
    entityType,
    entityId,
    `${entityType} ${entityId} was modified`,
    req,
    { changes: maskSensitiveData(changes) }
  )
}

// Export singleton instance
export const auditLogger = AuditLogger.getInstance()

// Audit log query helpers
export class AuditLogQuery {
  /**
   * Get audit logs for a specific user
   */
  static async getLogsForUser(
    userId: string,
    options: {
      startDate?: Date
      endDate?: Date
      eventTypes?: AuditEventType[]
      limit?: number
      offset?: number
    } = {}
  ) {
    const where: any = { userId }
    
    if (options.startDate || options.endDate) {
      where.timestamp = {}
      if (options.startDate) where.timestamp.gte = options.startDate
      if (options.endDate) where.timestamp.lte = options.endDate
    }
    
    if (options.eventTypes) {
      where.eventType = { in: options.eventTypes }
    }
    
    return prisma.auditLog.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: options.limit || 100,
      skip: options.offset || 0
    })
  }

  /**
   * Get audit logs for a specific entity
   */
  static async getLogsForEntity(
    entityType: string,
    entityId: string,
    options: {
      startDate?: Date
      endDate?: Date
      limit?: number
      offset?: number
    } = {}
  ) {
    const where: any = { entityType, entityId }
    
    if (options.startDate || options.endDate) {
      where.timestamp = {}
      if (options.startDate) where.timestamp.gte = options.startDate
      if (options.endDate) where.timestamp.lte = options.endDate
    }
    
    return prisma.auditLog.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: options.limit || 100,
      skip: options.offset || 0
    })
  }

  /**
   * Get security events
   */
  static async getSecurityEvents(
    companyId?: string,
    options: {
      severity?: AuditSeverity[]
      startDate?: Date
      endDate?: Date
      limit?: number
      offset?: number
    } = {}
  ) {
    const where: any = {
      eventType: {
        in: [
          AuditEventType.SECURITY_BREACH_DETECTED,
          AuditEventType.SUSPICIOUS_ACTIVITY,
          AuditEventType.RATE_LIMIT_EXCEEDED,
          AuditEventType.UNAUTHORIZED_ACCESS_ATTEMPT,
          AuditEventType.USER_LOGIN_FAILED
        ]
      }
    }
    
    if (companyId) where.companyId = companyId
    
    if (options.severity) {
      where.severity = { in: options.severity }
    }
    
    if (options.startDate || options.endDate) {
      where.timestamp = {}
      if (options.startDate) where.timestamp.gte = options.startDate
      if (options.endDate) where.timestamp.lte = options.endDate
    }
    
    return prisma.auditLog.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: options.limit || 100,
      skip: options.offset || 0
    })
  }
}

