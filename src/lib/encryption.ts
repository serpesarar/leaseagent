import CryptoJS from 'crypto-js'
import { createCipheriv, createDecipheriv, randomBytes, pbkdf2Sync, createHash } from 'crypto'
import bcrypt from 'bcrypt'

// Encryption configuration
interface EncryptionConfig {
  algorithm: string
  keyLength: number
  ivLength: number
  saltLength: number
  iterations: number
  tagLength: number
}

const defaultConfig: EncryptionConfig = {
  algorithm: 'aes-256-gcm',
  keyLength: 32, // 256 bits
  ivLength: 12, // 96 bits for GCM
  saltLength: 16, // 128 bits
  iterations: 100000, // PBKDF2 iterations
  tagLength: 16 // 128 bits
}

// Encryption service for sensitive data
export class EncryptionService {
  private config: EncryptionConfig
  private masterKey: string

  constructor(masterKey?: string, config: Partial<EncryptionConfig> = {}) {
    this.config = { ...defaultConfig, ...config }
    this.masterKey = masterKey || process.env.ENCRYPTION_KEY || 'default-key-change-in-production'
    
    if (this.masterKey === 'default-key-change-in-production' && process.env.NODE_ENV === 'production') {
      throw new Error('ENCRYPTION_KEY environment variable must be set in production')
    }
  }

  /**
   * Derive encryption key from master key and salt using PBKDF2
   */
  private deriveKey(salt: Buffer): Buffer {
    return pbkdf2Sync(
      this.masterKey,
      salt,
      this.config.iterations,
      this.config.keyLength,
      'sha256'
    )
  }

  /**
   * Encrypt sensitive data
   */
  encrypt(plaintext: string): string {
    try {
      const salt = randomBytes(this.config.saltLength)
      const iv = randomBytes(this.config.ivLength)
      const key = this.deriveKey(salt)

      const cipher = createCipheriv(this.config.algorithm, key, iv)
      
      let encrypted = cipher.update(plaintext, 'utf8', 'hex')
      encrypted += cipher.final('hex')
      
      // Get authentication tag for GCM mode
      const tag = cipher.getAuthTag()

      // Combine salt, iv, tag, and encrypted data
      const combined = Buffer.concat([
        salt,
        iv,
        tag,
        Buffer.from(encrypted, 'hex')
      ])

      return combined.toString('base64')
    } catch (error) {
      console.error('Encryption error:', error)
      throw new Error('Failed to encrypt data')
    }
  }

  /**
   * Decrypt sensitive data
   */
  decrypt(encryptedData: string): string {
    try {
      const combined = Buffer.from(encryptedData, 'base64')
      
      // Extract components
      const salt = combined.subarray(0, this.config.saltLength)
      const iv = combined.subarray(this.config.saltLength, this.config.saltLength + this.config.ivLength)
      const tag = combined.subarray(
        this.config.saltLength + this.config.ivLength,
        this.config.saltLength + this.config.ivLength + this.config.tagLength
      )
      const encrypted = combined.subarray(this.config.saltLength + this.config.ivLength + this.config.tagLength)

      const key = this.deriveKey(salt)

      const decipher = createDecipheriv(this.config.algorithm, key, iv)
      decipher.setAuthTag(tag)

      let decrypted = decipher.update(encrypted, undefined, 'utf8')
      decrypted += decipher.final('utf8')

      return decrypted
    } catch (error) {
      console.error('Decryption error:', error)
      throw new Error('Failed to decrypt data')
    }
  }

  /**
   * Hash sensitive data (one-way)
   */
  hash(data: string): string {
    return createHash('sha256')
      .update(data + this.masterKey)
      .digest('hex')
  }

  /**
   * Generate secure random token
   */
  generateToken(length: number = 32): string {
    return randomBytes(length).toString('hex')
  }

  /**
   * Generate secure random password
   */
  generatePassword(length: number = 16): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
    let password = ''
    
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length)
      password += charset[randomIndex]
    }
    
    return password
  }
}

// Password hashing service
export class PasswordService {
  private static readonly SALT_ROUNDS = 12

  /**
   * Hash password with bcrypt
   */
  static async hashPassword(password: string): Promise<string> {
    try {
      return await bcrypt.hash(password, this.SALT_ROUNDS)
    } catch (error) {
      console.error('Password hashing error:', error)
      throw new Error('Failed to hash password')
    }
  }

  /**
   * Verify password against hash
   */
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hash)
    } catch (error) {
      console.error('Password verification error:', error)
      return false
    }
  }

  /**
   * Check password strength
   */
  static checkPasswordStrength(password: string): {
    score: number
    feedback: string[]
    isStrong: boolean
  } {
    const feedback: string[] = []
    let score = 0

    // Length check
    if (password.length >= 8) score += 1
    else feedback.push('Password should be at least 8 characters long')

    if (password.length >= 12) score += 1
    else feedback.push('Consider using 12 or more characters for better security')

    // Character variety checks
    if (/[a-z]/.test(password)) score += 1
    else feedback.push('Include lowercase letters')

    if (/[A-Z]/.test(password)) score += 1
    else feedback.push('Include uppercase letters')

    if (/\d/.test(password)) score += 1
    else feedback.push('Include numbers')

    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 1
    else feedback.push('Include special characters')

    // Common pattern checks
    if (!/(.)\1{2,}/.test(password)) score += 1
    else feedback.push('Avoid repeating characters')

    if (!/123|abc|qwe|password|admin/i.test(password)) score += 1
    else feedback.push('Avoid common patterns and words')

    const isStrong = score >= 6

    return { score, feedback, isStrong }
  }

  /**
   * Generate secure random password
   */
  static generateSecurePassword(length: number = 16): string {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz'
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const numbers = '0123456789'
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?'
    
    const allChars = lowercase + uppercase + numbers + symbols
    let password = ''
    
    // Ensure at least one character from each category
    password += lowercase[Math.floor(Math.random() * lowercase.length)]
    password += uppercase[Math.floor(Math.random() * uppercase.length)]
    password += numbers[Math.floor(Math.random() * numbers.length)]
    password += symbols[Math.floor(Math.random() * symbols.length)]
    
    // Fill remaining length with random characters
    for (let i = 4; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)]
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('')
  }
}

// Field-level encryption for database
export class FieldEncryption {
  private encryption: EncryptionService

  constructor(key?: string) {
    this.encryption = new EncryptionService(key)
  }

  /**
   * Encrypt field data before storing in database
   */
  encryptField(value: string | null): string | null {
    if (!value) return null
    return this.encryption.encrypt(value)
  }

  /**
   * Decrypt field data after retrieving from database
   */
  decryptField(encryptedValue: string | null): string | null {
    if (!encryptedValue) return null
    try {
      return this.encryption.decrypt(encryptedValue)
    } catch (error) {
      console.error('Field decryption failed:', error)
      return null
    }
  }

  /**
   * Encrypt multiple fields
   */
  encryptFields<T extends Record<string, any>>(
    data: T,
    fieldsToEncrypt: (keyof T)[]
  ): T {
    const encrypted = { ...data }
    
    fieldsToEncrypt.forEach(field => {
      if (encrypted[field] && typeof encrypted[field] === 'string') {
        encrypted[field] = this.encryptField(encrypted[field] as string)
      }
    })
    
    return encrypted
  }

  /**
   * Decrypt multiple fields
   */
  decryptFields<T extends Record<string, any>>(
    data: T,
    fieldsToDecrypt: (keyof T)[]
  ): T {
    const decrypted = { ...data }
    
    fieldsToDecrypt.forEach(field => {
      if (decrypted[field] && typeof decrypted[field] === 'string') {
        decrypted[field] = this.decryptField(decrypted[field] as string)
      }
    })
    
    return decrypted
  }
}

// Token management for secure tokens (API keys, reset tokens, etc.)
export class TokenManager {
  private encryption: EncryptionService

  constructor(key?: string) {
    this.encryption = new EncryptionService(key)
  }

  /**
   * Generate secure token with expiration
   */
  generateToken(payload: any, expiresInMs: number): string {
    const tokenData = {
      payload,
      expiresAt: Date.now() + expiresInMs,
      nonce: randomBytes(16).toString('hex')
    }
    
    return this.encryption.encrypt(JSON.stringify(tokenData))
  }

  /**
   * Verify and decode token
   */
  verifyToken<T = any>(token: string): { payload: T; isValid: boolean } {
    try {
      const decrypted = this.encryption.decrypt(token)
      const tokenData = JSON.parse(decrypted)
      
      const isValid = tokenData.expiresAt > Date.now()
      
      return {
        payload: tokenData.payload,
        isValid
      }
    } catch (error) {
      return {
        payload: null as T,
        isValid: false
      }
    }
  }

  /**
   * Generate API key
   */
  generateAPIKey(userId: string, permissions: string[]): string {
    return this.generateToken(
      { userId, permissions, type: 'api_key' },
      365 * 24 * 60 * 60 * 1000 // 1 year
    )
  }

  /**
   * Generate password reset token
   */
  generatePasswordResetToken(userId: string): string {
    return this.generateToken(
      { userId, type: 'password_reset' },
      60 * 60 * 1000 // 1 hour
    )
  }

  /**
   * Generate email verification token
   */
  generateEmailVerificationToken(email: string): string {
    return this.generateToken(
      { email, type: 'email_verification' },
      24 * 60 * 60 * 1000 // 24 hours
    )
  }
}

// Data masking for logs and non-production environments
export class DataMasking {
  /**
   * Mask sensitive data for logging
   */
  static maskForLogging(data: any): any {
    if (typeof data !== 'object' || data === null) {
      return data
    }

    const sensitiveFields = [
      'password', 'token', 'secret', 'key', 'ssn', 'sin',
      'creditCard', 'bankAccount', 'routingNumber', 'cvv'
    ]

    const masked = { ...data }

    Object.keys(masked).forEach(key => {
      const lowerKey = key.toLowerCase()
      const isSensitive = sensitiveFields.some(field => 
        lowerKey.includes(field.toLowerCase())
      )

      if (isSensitive && typeof masked[key] === 'string') {
        masked[key] = this.maskString(masked[key])
      } else if (typeof masked[key] === 'object') {
        masked[key] = this.maskForLogging(masked[key])
      }
    })

    return masked
  }

  /**
   * Mask string data
   */
  static maskString(str: string, showLast: number = 4): string {
    if (!str || str.length <= showLast) {
      return '*'.repeat(str?.length || 0)
    }

    const masked = '*'.repeat(str.length - showLast)
    const visible = str.slice(-showLast)
    
    return masked + visible
  }

  /**
   * Mask email address
   */
  static maskEmail(email: string): string {
    const [username, domain] = email.split('@')
    if (!username || !domain) return email

    const maskedUsername = username.length > 2 
      ? username[0] + '*'.repeat(username.length - 2) + username[username.length - 1]
      : '*'.repeat(username.length)

    return `${maskedUsername}@${domain}`
  }

  /**
   * Mask phone number
   */
  static maskPhone(phone: string): string {
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length < 4) return '*'.repeat(phone.length)

    const masked = '*'.repeat(cleaned.length - 4)
    const visible = cleaned.slice(-4)
    
    return masked + visible
  }
}

// Global encryption instance
export const encryption = new EncryptionService()
export const fieldEncryption = new FieldEncryption()
export const tokenManager = new TokenManager()

// Utility functions
export function encryptSensitiveData(data: string): string {
  return encryption.encrypt(data)
}

export function decryptSensitiveData(encryptedData: string): string {
  return encryption.decrypt(encryptedData)
}

export async function hashPassword(password: string): Promise<string> {
  return PasswordService.hashPassword(password)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return PasswordService.verifyPassword(password, hash)
}

export function generateSecureToken(length: number = 32): string {
  return encryption.generateToken(length)
}

export function maskSensitiveData(data: any): any {
  return DataMasking.maskForLogging(data)
}

// Prisma middleware for automatic field encryption/decryption
export function createEncryptionMiddleware(fieldsToEncrypt: Record<string, string[]>) {
  return async (params: any, next: any) => {
    // Encrypt on create/update
    if (['create', 'update', 'upsert'].includes(params.action)) {
      const modelFields = fieldsToEncrypt[params.model]
      if (modelFields && params.args.data) {
        params.args.data = fieldEncryption.encryptFields(params.args.data, modelFields)
      }
    }

    const result = await next(params)

    // Decrypt on read operations
    if (['findUnique', 'findFirst', 'findMany'].includes(params.action)) {
      const modelFields = fieldsToEncrypt[params.model]
      if (modelFields) {
        if (Array.isArray(result)) {
          result.forEach((item: any) => {
            fieldEncryption.decryptFields(item, modelFields)
          })
        } else if (result) {
          fieldEncryption.decryptFields(result, modelFields)
        }
      }
    }

    return result
  }
}

// Environment-based encryption key management
export function getEncryptionKey(): string {
  const key = process.env.ENCRYPTION_KEY
  
  if (!key) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('ENCRYPTION_KEY environment variable is required in production')
    }
    console.warn('Using default encryption key - set ENCRYPTION_KEY environment variable')
    return 'default-development-key-not-secure'
  }
  
  if (key.length < 32) {
    throw new Error('ENCRYPTION_KEY must be at least 32 characters long')
  }
  
  return key
}

