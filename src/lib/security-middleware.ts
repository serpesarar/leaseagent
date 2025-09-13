import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { rateLimiters, createRateLimitMiddleware } from './rate-limiting'
import { csrfProtection } from './csrf-protection'
import { auditLogger, AuditEventType, AuditSeverity } from './audit-logging'
import { twoFactorAuth } from './two-factor-auth'
import { createHash } from 'crypto'

// Security configuration
interface SecurityConfig {
  enableRateLimit: boolean
  enableCSRF: boolean
  enableAuditLogging: boolean
  enable2FA: boolean
  enableIPWhitelist: boolean
  enableGeoBlocking: boolean
  enableBotDetection: boolean
  enableSecurityHeaders: boolean
  trustedProxies: string[]
  blockedCountries: string[]
  allowedIPs: string[]
  maxRequestSize: number
  sessionTimeout: number
}

const defaultSecurityConfig: SecurityConfig = {
  enableRateLimit: true,
  enableCSRF: true,
  enableAuditLogging: true,
  enable2FA: true,
  enableIPWhitelist: false,
  enableGeoBlocking: false,
  enableBotDetection: true,
  enableSecurityHeaders: true,
  trustedProxies: ['127.0.0.1', '::1'],
  blockedCountries: [],
  allowedIPs: [],
  maxRequestSize: 10 * 1024 * 1024, // 10MB
  sessionTimeout: 30 * 60 * 1000 // 30 minutes
}

// Security threat types
export enum SecurityThreatType {
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  CSRF_TOKEN_INVALID = 'CSRF_TOKEN_INVALID',
  SUSPICIOUS_IP = 'SUSPICIOUS_IP',
  BOT_DETECTED = 'BOT_DETECTED',
  GEOGRAPHIC_RESTRICTION = 'GEOGRAPHIC_RESTRICTION',
  MALFORMED_REQUEST = 'MALFORMED_REQUEST',
  OVERSIZED_REQUEST = 'OVERSIZED_REQUEST',
  SESSION_HIJACK_ATTEMPT = 'SESSION_HIJACK_ATTEMPT',
  BRUTE_FORCE_ATTACK = 'BRUTE_FORCE_ATTACK',
  SQL_INJECTION_ATTEMPT = 'SQL_INJECTION_ATTEMPT',
  XSS_ATTEMPT = 'XSS_ATTEMPT',
  PATH_TRAVERSAL_ATTEMPT = 'PATH_TRAVERSAL_ATTEMPT'
}

// Security middleware class
export class SecurityMiddleware {
  private config: SecurityConfig
  private suspiciousIPs = new Map<string, { count: number; lastSeen: number }>()
  private failedLogins = new Map<string, { count: number; lockUntil: number }>()

  constructor(config: Partial<SecurityConfig> = {}) {
    this.config = { ...defaultSecurityConfig, ...config }
  }

  /**
   * Main security middleware function
   */
  async middleware(req: NextRequest): Promise<NextResponse | null> {
    const startTime = Date.now()
    
    try {
      // 1. Security headers
      if (this.config.enableSecurityHeaders) {
        const headersResponse = this.addSecurityHeaders()
        if (headersResponse) return headersResponse
      }

      // 2. Request size validation
      const sizeResponse = await this.validateRequestSize(req)
      if (sizeResponse) return sizeResponse

      // 3. IP-based security checks
      const ipResponse = await this.checkIPSecurity(req)
      if (ipResponse) return ipResponse

      // 4. Bot detection
      if (this.config.enableBotDetection) {
        const botResponse = await this.detectBot(req)
        if (botResponse) return botResponse
      }

      // 5. Malicious payload detection
      const payloadResponse = await this.detectMaliciousPayload(req)
      if (payloadResponse) return payloadResponse

      // 6. Rate limiting
      if (this.config.enableRateLimit) {
        const rateLimitResponse = await this.applyRateLimit(req)
        if (rateLimitResponse) return rateLimitResponse
      }

      // 7. CSRF protection
      if (this.config.enableCSRF) {
        const csrfResponse = await csrfProtection.middleware(req)
        if (csrfResponse) return csrfResponse
      }

      // 8. Session security validation
      const sessionResponse = await this.validateSessionSecurity(req)
      if (sessionResponse) return sessionResponse

      // 9. 2FA enforcement for sensitive operations
      if (this.config.enable2FA) {
        const twoFactorResponse = await this.enforce2FA(req)
        if (twoFactorResponse) return twoFactorResponse
      }

      // Log successful security check
      if (this.config.enableAuditLogging) {
        const processingTime = Date.now() - startTime
        if (processingTime > 1000) { // Log slow requests
          await auditLogger.log({
            eventType: AuditEventType.SUSPICIOUS_ACTIVITY,
            severity: AuditSeverity.LOW,
            description: `Slow request processing: ${processingTime}ms`,
            success: true,
            ipAddress: this.getClientIP(req),
            metadata: {
              path: req.nextUrl.pathname,
              method: req.method,
              processingTime
            }
          })
        }
      }

      return null // Allow request to continue
    } catch (error) {
      console.error('Security middleware error:', error)
      
      // Log security middleware failure
      if (this.config.enableAuditLogging) {
        await auditLogger.logSecurity(
          AuditEventType.SECURITY_BREACH_DETECTED,
          'Security middleware failure',
          AuditSeverity.CRITICAL,
          req,
          { error: error instanceof Error ? error.message : String(error) }
        )
      }

      return NextResponse.json(
        { success: false, error: 'Security check failed' },
        { status: 500 }
      )
    }
  }

  /**
   * Add security headers to response
   */
  private addSecurityHeaders(): NextResponse | null {
    // Security headers are typically added in middleware.ts or next.config.js
    // This is a placeholder for demonstration
    return null
  }

  /**
   * Validate request size
   */
  private async validateRequestSize(req: NextRequest): Promise<NextResponse | null> {
    const contentLength = req.headers.get('content-length')
    
    if (contentLength && parseInt(contentLength) > this.config.maxRequestSize) {
      await this.logSecurityThreat(
        req,
        SecurityThreatType.OVERSIZED_REQUEST,
        `Request size ${contentLength} exceeds limit ${this.config.maxRequestSize}`
      )
      
      return NextResponse.json(
        { success: false, error: 'Request too large' },
        { status: 413 }
      )
    }

    return null
  }

  /**
   * Check IP-based security
   */
  private async checkIPSecurity(req: NextRequest): Promise<NextResponse | null> {
    const clientIP = this.getClientIP(req)
    if (!clientIP) return null

    // Check IP whitelist
    if (this.config.enableIPWhitelist && this.config.allowedIPs.length > 0) {
      if (!this.config.allowedIPs.includes(clientIP)) {
        await this.logSecurityThreat(
          req,
          SecurityThreatType.SUSPICIOUS_IP,
          `IP ${clientIP} not in whitelist`
        )
        
        return NextResponse.json(
          { success: false, error: 'Access denied' },
          { status: 403 }
        )
      }
    }

    // Check suspicious IP activity
    const suspicious = this.suspiciousIPs.get(clientIP)
    if (suspicious && suspicious.count > 10) {
      const timeSinceLastSeen = Date.now() - suspicious.lastSeen
      if (timeSinceLastSeen < 60000) { // 1 minute cooldown
        await this.logSecurityThreat(
          req,
          SecurityThreatType.SUSPICIOUS_IP,
          `Suspicious IP ${clientIP} blocked`
        )
        
        return NextResponse.json(
          { success: false, error: 'Too many suspicious requests' },
          { status: 429 }
        )
      }
    }

    return null
  }

  /**
   * Detect bot traffic
   */
  private async detectBot(req: NextRequest): Promise<NextResponse | null> {
    const userAgent = req.headers.get('user-agent') || ''
    const clientIP = this.getClientIP(req)

    // Common bot patterns
    const botPatterns = [
      /bot/i,
      /crawler/i,
      /spider/i,
      /scraper/i,
      /python/i,
      /curl/i,
      /wget/i,
      /http/i
    ]

    const isBot = botPatterns.some(pattern => pattern.test(userAgent))
    
    // Additional bot detection heuristics
    const hasNoUserAgent = !userAgent
    const hasNoAcceptHeader = !req.headers.get('accept')
    const hasNoAcceptLanguage = !req.headers.get('accept-language')
    
    const suspiciousScore = (hasNoUserAgent ? 1 : 0) + 
                           (hasNoAcceptHeader ? 1 : 0) + 
                           (hasNoAcceptLanguage ? 1 : 0)

    if (isBot || suspiciousScore >= 2) {
      // Allow legitimate bots for certain paths
      const pathname = req.nextUrl.pathname
      const allowedBotPaths = ['/api/health', '/robots.txt', '/sitemap.xml']
      
      if (!allowedBotPaths.some(path => pathname.startsWith(path))) {
        await this.logSecurityThreat(
          req,
          SecurityThreatType.BOT_DETECTED,
          `Bot detected: ${userAgent}`
        )
        
        return NextResponse.json(
          { success: false, error: 'Bot access not allowed' },
          { status: 403 }
        )
      }
    }

    return null
  }

  /**
   * Detect malicious payloads
   */
  private async detectMaliciousPayload(req: NextRequest): Promise<NextResponse | null> {
    const url = req.nextUrl.toString()
    const pathname = req.nextUrl.pathname
    
    // SQL injection patterns
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC)\b)/i,
      /(UNION\s+SELECT)/i,
      /(\'\s*OR\s+\'\d+\'\s*=\s*\'\d+)/i,
      /(--|\#|\/\*)/
    ]

    // XSS patterns
    const xssPatterns = [
      /<script[^>]*>.*?<\/script>/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /<iframe[^>]*>.*?<\/iframe>/i
    ]

    // Path traversal patterns
    const pathTraversalPatterns = [
      /\.\.\//,
      /\.\.\\/,
      /%2e%2e%2f/i,
      /%2e%2e%5c/i
    ]

    // Check URL for malicious patterns
    const allPatterns = [...sqlPatterns, ...xssPatterns, ...pathTraversalPatterns]
    const maliciousPattern = allPatterns.find(pattern => pattern.test(url))

    if (maliciousPattern) {
      let threatType = SecurityThreatType.MALFORMED_REQUEST
      
      if (sqlPatterns.some(p => p.test(url))) {
        threatType = SecurityThreatType.SQL_INJECTION_ATTEMPT
      } else if (xssPatterns.some(p => p.test(url))) {
        threatType = SecurityThreatType.XSS_ATTEMPT
      } else if (pathTraversalPatterns.some(p => p.test(url))) {
        threatType = SecurityThreatType.PATH_TRAVERSAL_ATTEMPT
      }

      await this.logSecurityThreat(
        req,
        threatType,
        `Malicious payload detected in URL: ${pathname}`,
        AuditSeverity.HIGH
      )

      // Block the request
      return NextResponse.json(
        { success: false, error: 'Malicious request detected' },
        { status: 400 }
      )
    }

    // Check request body for malicious content (for POST requests)
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      try {
        const body = await req.clone().text()
        const bodyMaliciousPattern = allPatterns.find(pattern => pattern.test(body))
        
        if (bodyMaliciousPattern) {
          await this.logSecurityThreat(
            req,
            SecurityThreatType.MALFORMED_REQUEST,
            'Malicious payload detected in request body',
            AuditSeverity.HIGH
          )

          return NextResponse.json(
            { success: false, error: 'Malicious request detected' },
            { status: 400 }
          )
        }
      } catch (error) {
        // If we can't parse the body, it might be suspicious
        console.error('Error parsing request body for security check:', error)
      }
    }

    return null
  }

  /**
   * Apply appropriate rate limiting
   */
  private async applyRateLimit(req: NextRequest): Promise<NextResponse | null> {
    const pathname = req.nextUrl.pathname
    
    // Choose appropriate rate limiter based on endpoint
    let limiterName: keyof typeof rateLimiters = 'general'
    
    if (pathname.startsWith('/api/auth')) {
      limiterName = 'auth'
    } else if (pathname.includes('/password-reset')) {
      limiterName = 'passwordReset'
    } else if (pathname.includes('/upload')) {
      limiterName = 'upload'
    } else if (pathname.includes('/search')) {
      limiterName = 'search'
    } else if (pathname.includes('/ai/')) {
      limiterName = 'ai'
    } else if (pathname.includes('/maintenance')) {
      limiterName = 'maintenance'
    } else if (pathname.includes('/payment')) {
      limiterName = 'payment'
    }

    const rateLimitMiddleware = createRateLimitMiddleware(limiterName)
    const rateLimitResponse = await rateLimitMiddleware(req)
    
    if (rateLimitResponse) {
      await this.logSecurityThreat(
        req,
        SecurityThreatType.RATE_LIMIT_EXCEEDED,
        `Rate limit exceeded for ${limiterName} endpoint`
      )
    }
    
    return rateLimitResponse
  }

  /**
   * Validate session security
   */
  private async validateSessionSecurity(req: NextRequest): Promise<NextResponse | null> {
    try {
      const token = await getToken({ req })
      if (!token) return null // No session to validate

      // Check session age
      const sessionAge = Date.now() - (token.iat || 0) * 1000
      if (sessionAge > this.config.sessionTimeout) {
        await this.logSecurityThreat(
          req,
          SecurityThreatType.SESSION_HIJACK_ATTEMPT,
          'Session expired due to timeout'
        )
        
        return NextResponse.json(
          { success: false, error: 'Session expired' },
          { status: 401 }
        )
      }

      // Check for session fingerprint changes (basic implementation)
      const currentFingerprint = this.generateSessionFingerprint(req)
      const storedFingerprint = token.fingerprint as string
      
      if (storedFingerprint && storedFingerprint !== currentFingerprint) {
        await this.logSecurityThreat(
          req,
          SecurityThreatType.SESSION_HIJACK_ATTEMPT,
          'Session fingerprint mismatch detected',
          AuditSeverity.HIGH
        )
        
        return NextResponse.json(
          { success: false, error: 'Session security violation' },
          { status: 401 }
        )
      }

      return null
    } catch (error) {
      console.error('Session validation error:', error)
      return null
    }
  }

  /**
   * Enforce 2FA for sensitive operations
   */
  private async enforce2FA(req: NextRequest): Promise<NextResponse | null> {
    const pathname = req.nextUrl.pathname
    const method = req.method
    
    // Define sensitive operations requiring 2FA
    const sensitiveOperations = [
      { path: '/api/users', methods: ['DELETE'] },
      { path: '/api/company/settings', methods: ['PUT', 'PATCH'] },
      { path: '/api/payments', methods: ['POST'] },
      { path: '/api/data/export', methods: ['GET'] }
    ]

    const requiresTwoFactor = sensitiveOperations.some(op => 
      pathname.startsWith(op.path) && op.methods.includes(method)
    )

    if (requiresTwoFactor) {
      try {
        const token = await getToken({ req })
        if (token?.role === 'COMPANY_OWNER') {
          const has2FA = await twoFactorAuth.isTwoFactorEnabled(token.sub || '')
          
          if (!has2FA) {
            await this.logSecurityThreat(
              req,
              SecurityThreatType.SUSPICIOUS_IP,
              'Sensitive operation attempted without 2FA'
            )
            
            return NextResponse.json(
              { success: false, error: 'Two-factor authentication required' },
              { status: 403 }
            )
          }
        }
      } catch (error) {
        console.error('2FA enforcement error:', error)
      }
    }

    return null
  }

  /**
   * Generate session fingerprint for security validation
   */
  private generateSessionFingerprint(req: NextRequest): string {
    const userAgent = req.headers.get('user-agent') || ''
    const acceptLanguage = req.headers.get('accept-language') || ''
    const clientIP = this.getClientIP(req) || ''
    
    const fingerprint = `${userAgent}:${acceptLanguage}:${clientIP}`
    return createHash('sha256').update(fingerprint).digest('hex')
  }

  /**
   * Get client IP address
   */
  private getClientIP(req: NextRequest): string | null {
    const forwarded = req.headers.get('x-forwarded-for')
    const realIp = req.headers.get('x-real-ip')
    const clientIp = forwarded?.split(',')[0] ?? realIp ?? req.ip
    
    return clientIp || null
  }

  /**
   * Log security threat
   */
  private async logSecurityThreat(
    req: NextRequest,
    threatType: SecurityThreatType,
    description: string,
    severity: AuditSeverity = AuditSeverity.MEDIUM
  ): Promise<void> {
    const clientIP = this.getClientIP(req)
    
    // Track suspicious IP
    if (clientIP) {
      const current = this.suspiciousIPs.get(clientIP) || { count: 0, lastSeen: 0 }
      this.suspiciousIPs.set(clientIP, {
        count: current.count + 1,
        lastSeen: Date.now()
      })
    }

    // Log to audit system
    if (this.config.enableAuditLogging) {
      await auditLogger.logSecurity(
        AuditEventType.SUSPICIOUS_ACTIVITY,
        `${threatType}: ${description}`,
        severity,
        req,
        { threatType, clientIP }
      )
    }
  }

  /**
   * Check for brute force attacks
   */
  async checkBruteForce(identifier: string, maxAttempts: number = 5): Promise<boolean> {
    const attempts = this.failedLogins.get(identifier)
    
    if (!attempts) return true // No previous attempts
    
    if (attempts.lockUntil > Date.now()) {
      return false // Still locked
    }
    
    if (attempts.count >= maxAttempts) {
      // Extend lock period
      attempts.lockUntil = Date.now() + (15 * 60 * 1000) // 15 minutes
      return false
    }
    
    return true
  }

  /**
   * Record failed login attempt
   */
  recordFailedLogin(identifier: string): void {
    const current = this.failedLogins.get(identifier) || { count: 0, lockUntil: 0 }
    current.count += 1
    
    if (current.count >= 5) {
      current.lockUntil = Date.now() + (15 * 60 * 1000) // 15 minutes
    }
    
    this.failedLogins.set(identifier, current)
  }

  /**
   * Clear failed login attempts
   */
  clearFailedLogins(identifier: string): void {
    this.failedLogins.delete(identifier)
  }
}

// Global security middleware instance
export const securityMiddleware = new SecurityMiddleware()

// Security headers configuration
export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
}

// Utility function to apply security middleware
export async function applySecurityMiddleware(req: NextRequest): Promise<NextResponse | null> {
  return await securityMiddleware.middleware(req)
}

// Security configuration for different environments
export const securityConfigs = {
  development: {
    enableRateLimit: false,
    enableCSRF: false,
    enableAuditLogging: true,
    enable2FA: false,
    enableIPWhitelist: false,
    enableBotDetection: false
  },
  production: {
    enableRateLimit: true,
    enableCSRF: true,
    enableAuditLogging: true,
    enable2FA: true,
    enableIPWhitelist: false,
    enableBotDetection: true
  }
}

