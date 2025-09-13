import { authenticator } from 'otplib'
import QRCode from 'qrcode'
import { randomBytes, createHash } from 'crypto'
import { prisma } from './prisma'
import { auditLogger, AuditEventType, AuditSeverity } from './audit-logging'
import { encryption } from './encryption'

// 2FA configuration
interface TwoFactorConfig {
  issuer: string
  window: number // Time window for TOTP validation (in steps)
  step: number // Time step in seconds
  digits: number // Number of digits in TOTP
  algorithm: string
  backupCodesCount: number
  backupCodeLength: number
}

const defaultConfig: TwoFactorConfig = {
  issuer: process.env.NEXT_PUBLIC_APP_NAME || 'Property Management Platform',
  window: 1, // Allow 1 step before and after current time
  step: 30, // 30-second time steps
  digits: 6, // 6-digit codes
  algorithm: 'sha1',
  backupCodesCount: 10,
  backupCodeLength: 8
}

// 2FA method types
export enum TwoFactorMethod {
  TOTP = 'TOTP', // Time-based One-Time Password (Google Authenticator, Authy, etc.)
  SMS = 'SMS', // SMS-based codes
  EMAIL = 'EMAIL', // Email-based codes
  BACKUP_CODES = 'BACKUP_CODES' // Backup recovery codes
}

// 2FA setup result
export interface TwoFactorSetupResult {
  secret: string
  qrCodeUrl: string
  backupCodes: string[]
  manualEntryKey: string
}

// 2FA verification result
export interface TwoFactorVerificationResult {
  success: boolean
  method?: TwoFactorMethod
  remainingBackupCodes?: number
  error?: string
}

export class TwoFactorAuthService {
  private config: TwoFactorConfig

  constructor(config: Partial<TwoFactorConfig> = {}) {
    this.config = { ...defaultConfig, ...config }
    
    // Configure otplib
    authenticator.options = {
      step: this.config.step,
      window: this.config.window,
      digits: this.config.digits,
      algorithm: this.config.algorithm as any
    }
  }

  /**
   * Generate 2FA secret for user
   */
  generateSecret(userEmail: string): string {
    return authenticator.generateSecret()
  }

  /**
   * Setup 2FA for a user
   */
  async setupTwoFactor(
    userId: string,
    userEmail: string,
    userName: string
  ): Promise<TwoFactorSetupResult> {
    try {
      // Generate secret
      const secret = this.generateSecret(userEmail)
      
      // Generate backup codes
      const backupCodes = this.generateBackupCodes()
      
      // Create service name for QR code
      const serviceName = `${this.config.issuer} (${userEmail})`
      
      // Generate QR code URL
      const otpauthUrl = authenticator.keyuri(
        userEmail,
        this.config.issuer,
        secret
      )
      
      const qrCodeUrl = await QRCode.toDataURL(otpauthUrl)
      
      // Store encrypted secret and backup codes in database
      await prisma.user.update({
        where: { id: userId },
        data: {
          twoFactorSecret: encryption.encrypt(secret),
          twoFactorBackupCodes: encryption.encrypt(JSON.stringify(backupCodes)),
          twoFactorEnabled: false // Not enabled until verified
        }
      })

      // Log setup attempt
      await auditLogger.log({
        eventType: AuditEventType.TWO_FACTOR_ENABLED,
        severity: AuditSeverity.MEDIUM,
        userId,
        description: '2FA setup initiated',
        success: true,
        metadata: { method: TwoFactorMethod.TOTP }
      })

      return {
        secret,
        qrCodeUrl,
        backupCodes,
        manualEntryKey: secret
      }
    } catch (error) {
      console.error('2FA setup error:', error)
      throw new Error('Failed to setup two-factor authentication')
    }
  }

  /**
   * Verify 2FA setup with initial token
   */
  async verifySetup(
    userId: string,
    token: string
  ): Promise<TwoFactorVerificationResult> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { 
          twoFactorSecret: true,
          twoFactorEnabled: true,
          email: true,
          companyId: true
        }
      })

      if (!user?.twoFactorSecret) {
        return { success: false, error: '2FA not set up for this user' }
      }

      const secret = encryption.decrypt(user.twoFactorSecret)
      const isValid = authenticator.verify({ token, secret })

      if (isValid) {
        // Enable 2FA for user
        await prisma.user.update({
          where: { id: userId },
          data: { twoFactorEnabled: true }
        })

        // Log successful setup
        await auditLogger.log({
          eventType: AuditEventType.TWO_FACTOR_ENABLED,
          severity: AuditSeverity.MEDIUM,
          userId,
          companyId: user.companyId || undefined,
          description: '2FA successfully enabled',
          success: true,
          metadata: { method: TwoFactorMethod.TOTP }
        })

        return { success: true, method: TwoFactorMethod.TOTP }
      } else {
        return { success: false, error: 'Invalid verification code' }
      }
    } catch (error) {
      console.error('2FA setup verification error:', error)
      return { success: false, error: 'Verification failed' }
    }
  }

  /**
   * Verify 2FA token during login
   */
  async verifyToken(
    userId: string,
    token: string,
    method: TwoFactorMethod = TwoFactorMethod.TOTP
  ): Promise<TwoFactorVerificationResult> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { 
          twoFactorSecret: true,
          twoFactorBackupCodes: true,
          twoFactorEnabled: true,
          email: true,
          companyId: true
        }
      })

      if (!user?.twoFactorEnabled || !user.twoFactorSecret) {
        return { success: false, error: '2FA not enabled for this user' }
      }

      let verificationResult: TwoFactorVerificationResult

      switch (method) {
        case TwoFactorMethod.TOTP:
          verificationResult = await this.verifyTOTP(user.twoFactorSecret, token)
          break
        
        case TwoFactorMethod.BACKUP_CODES:
          verificationResult = await this.verifyBackupCode(
            userId,
            user.twoFactorBackupCodes,
            token
          )
          break
        
        case TwoFactorMethod.SMS:
          verificationResult = await this.verifySMS(userId, token)
          break
        
        case TwoFactorMethod.EMAIL:
          verificationResult = await this.verifyEmail(userId, token)
          break
        
        default:
          return { success: false, error: 'Invalid 2FA method' }
      }

      // Log verification attempt
      await auditLogger.log({
        eventType: verificationResult.success 
          ? AuditEventType.USER_LOGIN 
          : AuditEventType.USER_LOGIN_FAILED,
        severity: verificationResult.success 
          ? AuditSeverity.LOW 
          : AuditSeverity.MEDIUM,
        userId,
        companyId: user.companyId || undefined,
        description: `2FA verification ${verificationResult.success ? 'successful' : 'failed'}`,
        success: verificationResult.success,
        metadata: { 
          method,
          error: verificationResult.error
        }
      })

      return verificationResult
    } catch (error) {
      console.error('2FA verification error:', error)
      return { success: false, error: 'Verification failed' }
    }
  }

  /**
   * Disable 2FA for user
   */
  async disableTwoFactor(userId: string): Promise<boolean> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { companyId: true }
      })

      await prisma.user.update({
        where: { id: userId },
        data: {
          twoFactorSecret: null,
          twoFactorBackupCodes: null,
          twoFactorEnabled: false
        }
      })

      // Log 2FA disabled
      await auditLogger.log({
        eventType: AuditEventType.TWO_FACTOR_DISABLED,
        severity: AuditSeverity.HIGH,
        userId,
        companyId: user?.companyId || undefined,
        description: '2FA disabled for user',
        success: true
      })

      return true
    } catch (error) {
      console.error('2FA disable error:', error)
      return false
    }
  }

  /**
   * Generate new backup codes
   */
  async generateNewBackupCodes(userId: string): Promise<string[]> {
    try {
      const backupCodes = this.generateBackupCodes()
      
      await prisma.user.update({
        where: { id: userId },
        data: {
          twoFactorBackupCodes: encryption.encrypt(JSON.stringify(backupCodes))
        }
      })

      // Log backup code regeneration
      await auditLogger.log({
        eventType: AuditEventType.TWO_FACTOR_ENABLED, // Using this as closest match
        severity: AuditSeverity.MEDIUM,
        userId,
        description: 'New 2FA backup codes generated',
        success: true,
        metadata: { action: 'backup_codes_regenerated' }
      })

      return backupCodes
    } catch (error) {
      console.error('Backup code generation error:', error)
      throw new Error('Failed to generate backup codes')
    }
  }

  /**
   * Check if user has 2FA enabled
   */
  async isTwoFactorEnabled(userId: string): Promise<boolean> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { twoFactorEnabled: true }
      })
      
      return user?.twoFactorEnabled || false
    } catch (error) {
      console.error('2FA status check error:', error)
      return false
    }
  }

  /**
   * Get 2FA status and methods for user
   */
  async getTwoFactorStatus(userId: string): Promise<{
    enabled: boolean
    methods: TwoFactorMethod[]
    backupCodesRemaining: number
  }> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { 
          twoFactorEnabled: true,
          twoFactorBackupCodes: true
        }
      })

      if (!user?.twoFactorEnabled) {
        return {
          enabled: false,
          methods: [],
          backupCodesRemaining: 0
        }
      }

      const methods: TwoFactorMethod[] = [TwoFactorMethod.TOTP]
      let backupCodesRemaining = 0

      if (user.twoFactorBackupCodes) {
        try {
          const backupCodes = JSON.parse(encryption.decrypt(user.twoFactorBackupCodes))
          backupCodesRemaining = backupCodes.length
          methods.push(TwoFactorMethod.BACKUP_CODES)
        } catch (error) {
          console.error('Error parsing backup codes:', error)
        }
      }

      return {
        enabled: true,
        methods,
        backupCodesRemaining
      }
    } catch (error) {
      console.error('2FA status error:', error)
      return {
        enabled: false,
        methods: [],
        backupCodesRemaining: 0
      }
    }
  }

  /**
   * Verify TOTP token
   */
  private async verifyTOTP(
    encryptedSecret: string,
    token: string
  ): Promise<TwoFactorVerificationResult> {
    try {
      const secret = encryption.decrypt(encryptedSecret)
      const isValid = authenticator.verify({ token, secret })
      
      return {
        success: isValid,
        method: TwoFactorMethod.TOTP,
        error: isValid ? undefined : 'Invalid TOTP code'
      }
    } catch (error) {
      return {
        success: false,
        method: TwoFactorMethod.TOTP,
        error: 'TOTP verification failed'
      }
    }
  }

  /**
   * Verify backup code
   */
  private async verifyBackupCode(
    userId: string,
    encryptedBackupCodes: string | null,
    code: string
  ): Promise<TwoFactorVerificationResult> {
    if (!encryptedBackupCodes) {
      return { success: false, error: 'No backup codes available' }
    }

    try {
      const backupCodes = JSON.parse(encryption.decrypt(encryptedBackupCodes))
      const codeIndex = backupCodes.indexOf(code)
      
      if (codeIndex === -1) {
        return { 
          success: false, 
          error: 'Invalid backup code',
          remainingBackupCodes: backupCodes.length
        }
      }

      // Remove used backup code
      backupCodes.splice(codeIndex, 1)
      
      // Update database with remaining codes
      await prisma.user.update({
        where: { id: userId },
        data: {
          twoFactorBackupCodes: backupCodes.length > 0 
            ? encryption.encrypt(JSON.stringify(backupCodes))
            : null
        }
      })

      return {
        success: true,
        method: TwoFactorMethod.BACKUP_CODES,
        remainingBackupCodes: backupCodes.length
      }
    } catch (error) {
      return {
        success: false,
        error: 'Backup code verification failed'
      }
    }
  }

  /**
   * Verify SMS code (placeholder - would integrate with SMS service)
   */
  private async verifySMS(userId: string, code: string): Promise<TwoFactorVerificationResult> {
    // This would integrate with SMS service like Twilio
    // For now, return not implemented
    return {
      success: false,
      error: 'SMS verification not implemented'
    }
  }

  /**
   * Verify email code (placeholder - would integrate with email service)
   */
  private async verifyEmail(userId: string, code: string): Promise<TwoFactorVerificationResult> {
    // This would integrate with email service
    // For now, return not implemented
    return {
      success: false,
      error: 'Email verification not implemented'
    }
  }

  /**
   * Generate backup codes
   */
  private generateBackupCodes(): string[] {
    const codes: string[] = []
    
    for (let i = 0; i < this.config.backupCodesCount; i++) {
      const code = randomBytes(this.config.backupCodeLength / 2)
        .toString('hex')
        .toUpperCase()
      codes.push(code)
    }
    
    return codes
  }

  /**
   * Generate QR code for manual entry
   */
  async generateQRCode(secret: string, userEmail: string): Promise<string> {
    const otpauthUrl = authenticator.keyuri(
      userEmail,
      this.config.issuer,
      secret
    )
    
    return QRCode.toDataURL(otpauthUrl)
  }
}

// Global 2FA service instance
export const twoFactorAuth = new TwoFactorAuthService()

// Middleware to enforce 2FA for company owners
export async function requireTwoFactorForCompanyOwners(
  userId: string,
  userRole: string
): Promise<boolean> {
  if (userRole !== 'COMPANY_OWNER') {
    return true // 2FA not required for other roles
  }

  return await twoFactorAuth.isTwoFactorEnabled(userId)
}

// React hook for 2FA management
export function useTwoFactorAuth() {
  const setupTwoFactor = async (userId: string, userEmail: string, userName: string) => {
    return await twoFactorAuth.setupTwoFactor(userId, userEmail, userName)
  }

  const verifySetup = async (userId: string, token: string) => {
    return await twoFactorAuth.verifySetup(userId, token)
  }

  const verifyToken = async (userId: string, token: string, method?: TwoFactorMethod) => {
    return await twoFactorAuth.verifyToken(userId, token, method)
  }

  const disableTwoFactor = async (userId: string) => {
    return await twoFactorAuth.disableTwoFactor(userId)
  }

  const generateNewBackupCodes = async (userId: string) => {
    return await twoFactorAuth.generateNewBackupCodes(userId)
  }

  const getTwoFactorStatus = async (userId: string) => {
    return await twoFactorAuth.getTwoFactorStatus(userId)
  }

  return {
    setupTwoFactor,
    verifySetup,
    verifyToken,
    disableTwoFactor,
    generateNewBackupCodes,
    getTwoFactorStatus
  }
}

// Utility functions
export async function generateTwoFactorSecret(userEmail: string): Promise<string> {
  return twoFactorAuth.generateSecret(userEmail)
}

export async function verifyTwoFactorToken(
  userId: string,
  token: string,
  method: TwoFactorMethod = TwoFactorMethod.TOTP
): Promise<TwoFactorVerificationResult> {
  return await twoFactorAuth.verifyToken(userId, token, method)
}

export async function isTwoFactorRequired(userId: string, userRole: string): Promise<boolean> {
  return await requireTwoFactorForCompanyOwners(userId, userRole)
}

// 2FA enforcement decorator
export function requireTwoFactor(requiredRoles: string[] = ['COMPANY_OWNER']) {
  return function <T extends any[], R>(
    target: (...args: T) => Promise<R>
  ) {
    return async function (this: any, ...args: T): Promise<R> {
      // This would extract user info from request context
      const userRole = 'COMPANY_OWNER' // Placeholder
      const userId = 'user-id' // Placeholder
      
      if (requiredRoles.includes(userRole)) {
        const has2FA = await twoFactorAuth.isTwoFactorEnabled(userId)
        if (!has2FA) {
          throw new Error('Two-factor authentication is required for this operation')
        }
      }
      
      return target.apply(this, args)
    }
  }
}

