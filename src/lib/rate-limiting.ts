import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'

// Rate limiting configuration
interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
  skipSuccessfulRequests?: boolean
  skipFailedRequests?: boolean
  keyGenerator?: (req: NextRequest) => string
  message?: string
  statusCode?: number
  headers?: boolean
}

// Rate limit store interface
interface RateLimitStore {
  get(key: string): Promise<{ count: number; resetTime: number } | null>
  set(key: string, value: { count: number; resetTime: number }, ttl: number): Promise<void>
  increment(key: string, ttl: number): Promise<{ count: number; resetTime: number }>
}

// In-memory store (for development - use Redis in production)
class MemoryStore implements RateLimitStore {
  private store = new Map<string, { count: number; resetTime: number }>()

  async get(key: string): Promise<{ count: number; resetTime: number } | null> {
    const data = this.store.get(key)
    if (!data) return null
    
    // Clean up expired entries
    if (Date.now() > data.resetTime) {
      this.store.delete(key)
      return null
    }
    
    return data
  }

  async set(key: string, value: { count: number; resetTime: number }, ttl: number): Promise<void> {
    this.store.set(key, value)
    
    // Set cleanup timeout
    setTimeout(() => {
      this.store.delete(key)
    }, ttl)
  }

  async increment(key: string, ttl: number): Promise<{ count: number; resetTime: number }> {
    const now = Date.now()
    const resetTime = now + ttl
    const existing = await this.get(key)
    
    if (!existing) {
      const newData = { count: 1, resetTime }
      await this.set(key, newData, ttl)
      return newData
    }
    
    const updatedData = { count: existing.count + 1, resetTime: existing.resetTime }
    this.store.set(key, updatedData)
    return updatedData
  }
}

// Redis store (for production)
class RedisStore implements RateLimitStore {
  private redis: any // Redis client would be injected

  constructor(redisClient: any) {
    this.redis = redisClient
  }

  async get(key: string): Promise<{ count: number; resetTime: number } | null> {
    try {
      const data = await this.redis.get(key)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error('Redis get error:', error)
      return null
    }
  }

  async set(key: string, value: { count: number; resetTime: number }, ttl: number): Promise<void> {
    try {
      await this.redis.setex(key, Math.ceil(ttl / 1000), JSON.stringify(value))
    } catch (error) {
      console.error('Redis set error:', error)
    }
  }

  async increment(key: string, ttl: number): Promise<{ count: number; resetTime: number }> {
    const now = Date.now()
    const resetTime = now + ttl
    
    try {
      const multi = this.redis.multi()
      multi.incr(key)
      multi.expire(key, Math.ceil(ttl / 1000))
      const [count] = await multi.exec()
      
      return { count: count[1], resetTime }
    } catch (error) {
      console.error('Redis increment error:', error)
      // Fallback
      return { count: 1, resetTime }
    }
  }
}

// Rate limiter class
export class RateLimiter {
  private store: RateLimitStore
  private config: Required<RateLimitConfig>

  constructor(config: RateLimitConfig, store?: RateLimitStore) {
    this.config = {
      windowMs: config.windowMs,
      maxRequests: config.maxRequests,
      skipSuccessfulRequests: config.skipSuccessfulRequests ?? false,
      skipFailedRequests: config.skipFailedRequests ?? false,
      keyGenerator: config.keyGenerator ?? this.defaultKeyGenerator,
      message: config.message ?? 'Too many requests, please try again later.',
      statusCode: config.statusCode ?? 429,
      headers: config.headers ?? true
    }
    
    this.store = store ?? new MemoryStore()
  }

  private defaultKeyGenerator(req: NextRequest): string {
    // Get client IP with fallbacks for various proxy configurations
    const forwarded = req.headers.get('x-forwarded-for')
    const realIp = req.headers.get('x-real-ip')
    const clientIp = forwarded?.split(',')[0] ?? realIp ?? req.ip ?? 'unknown'
    
    return `rate_limit:${clientIp}`
  }

  async checkLimit(req: NextRequest): Promise<{
    allowed: boolean
    limit: number
    remaining: number
    resetTime: number
    retryAfter?: number
  }> {
    const key = this.config.keyGenerator(req)
    const data = await this.store.increment(key, this.config.windowMs)
    
    const allowed = data.count <= this.config.maxRequests
    const remaining = Math.max(0, this.config.maxRequests - data.count)
    const retryAfter = allowed ? undefined : Math.ceil((data.resetTime - Date.now()) / 1000)
    
    return {
      allowed,
      limit: this.config.maxRequests,
      remaining,
      resetTime: data.resetTime,
      retryAfter
    }
  }

  async middleware(req: NextRequest): Promise<NextResponse | null> {
    const result = await this.checkLimit(req)
    
    if (!result.allowed) {
      const response = NextResponse.json(
        {
          success: false,
          error: this.config.message,
          code: 'RATE_LIMIT_EXCEEDED',
          retryAfter: result.retryAfter
        },
        { status: this.config.statusCode }
      )
      
      if (this.config.headers) {
        response.headers.set('X-RateLimit-Limit', result.limit.toString())
        response.headers.set('X-RateLimit-Remaining', result.remaining.toString())
        response.headers.set('X-RateLimit-Reset', new Date(result.resetTime).toISOString())
        if (result.retryAfter) {
          response.headers.set('Retry-After', result.retryAfter.toString())
        }
      }
      
      return response
    }
    
    return null // Allow request to continue
  }
}

// Pre-configured rate limiters for different use cases
export const rateLimiters = {
  // General API rate limiting
  general: new RateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
    message: 'Too many requests from this IP, please try again later.'
  }),

  // Authentication endpoints (stricter)
  auth: new RateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
    message: 'Too many authentication attempts, please try again later.'
  }),

  // Password reset (very strict)
  passwordReset: new RateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 3,
    message: 'Too many password reset attempts, please try again later.'
  }),

  // File uploads
  upload: new RateLimiter({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10,
    message: 'Too many file uploads, please wait before uploading more.'
  }),

  // Search endpoints
  search: new RateLimiter({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 30,
    message: 'Too many search requests, please wait before searching again.'
  }),

  // AI endpoints (expensive operations)
  ai: new RateLimiter({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10,
    message: 'AI service rate limit exceeded, please wait before making more requests.'
  }),

  // Maintenance request creation
  maintenance: new RateLimiter({
    windowMs: 5 * 60 * 1000, // 5 minutes
    maxRequests: 10,
    message: 'Too many maintenance requests, please wait before creating more.'
  }),

  // Payment processing
  payment: new RateLimiter({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 5,
    message: 'Too many payment attempts, please wait before trying again.'
  })
}

// Rate limiting middleware factory
export function createRateLimitMiddleware(limiterName: keyof typeof rateLimiters) {
  return async (req: NextRequest) => {
    const limiter = rateLimiters[limiterName]
    return await limiter.middleware(req)
  }
}

// User-specific rate limiting (for authenticated requests)
export class UserRateLimiter extends RateLimiter {
  constructor(config: RateLimitConfig, store?: RateLimitStore) {
    super({
      ...config,
      keyGenerator: (req: NextRequest) => {
        // Try to get user ID from various sources
        const authHeader = req.headers.get('authorization')
        const userId = this.extractUserIdFromToken(authHeader)
        
        if (userId) {
          return `user_rate_limit:${userId}`
        }
        
        // Fallback to IP-based limiting
        return this.defaultKeyGenerator(req)
      }
    }, store)
  }

  private extractUserIdFromToken(authHeader: string | null): string | null {
    if (!authHeader?.startsWith('Bearer ')) return null
    
    try {
      const token = authHeader.substring(7)
      // In a real implementation, you'd decode the JWT token
      // For now, we'll use a placeholder
      return `user_from_token_${token.substring(0, 10)}`
    } catch (error) {
      return null
    }
  }
}

// Advanced rate limiting with different tiers
export class TieredRateLimiter {
  private limiters: Map<string, RateLimiter> = new Map()

  constructor(private tiers: Record<string, RateLimitConfig>) {
    Object.entries(tiers).forEach(([tier, config]) => {
      this.limiters.set(tier, new RateLimiter(config))
    })
  }

  async checkLimit(req: NextRequest, tier: string = 'default') {
    const limiter = this.limiters.get(tier)
    if (!limiter) {
      throw new Error(`Rate limiter tier '${tier}' not found`)
    }
    
    return await limiter.checkLimit(req)
  }

  async middleware(req: NextRequest, tier: string = 'default') {
    const limiter = this.limiters.get(tier)
    if (!limiter) {
      return null // Allow request if tier not found
    }
    
    return await limiter.middleware(req)
  }
}

// Rate limiting for different user roles
export const roleBasedLimiters = new TieredRateLimiter({
  'SUPER_ADMIN': {
    windowMs: 15 * 60 * 1000,
    maxRequests: 1000, // Higher limits for admins
    message: 'Admin rate limit exceeded'
  },
  'COMPANY_OWNER': {
    windowMs: 15 * 60 * 1000,
    maxRequests: 500,
    message: 'Company owner rate limit exceeded'
  },
  'PROPERTY_MANAGER': {
    windowMs: 15 * 60 * 1000,
    maxRequests: 200,
    message: 'Property manager rate limit exceeded'
  },
  'TENANT': {
    windowMs: 15 * 60 * 1000,
    maxRequests: 100,
    message: 'Tenant rate limit exceeded'
  },
  'CONTRACTOR': {
    windowMs: 15 * 60 * 1000,
    maxRequests: 150,
    message: 'Contractor rate limit exceeded'
  },
  'default': {
    windowMs: 15 * 60 * 1000,
    maxRequests: 50,
    message: 'Rate limit exceeded'
  }
})

// Utility functions
export async function addRateLimitHeaders(
  response: NextResponse,
  req: NextRequest,
  limiter: RateLimiter
): Promise<void> {
  const result = await limiter.checkLimit(req)
  
  response.headers.set('X-RateLimit-Limit', result.limit.toString())
  response.headers.set('X-RateLimit-Remaining', result.remaining.toString())
  response.headers.set('X-RateLimit-Reset', new Date(result.resetTime).toISOString())
}

// Rate limiting decorator for API routes
export function withRateLimit(limiterName: keyof typeof rateLimiters) {
  return function <T extends any[], R>(
    target: (...args: T) => Promise<R>
  ) {
    return async function (this: any, ...args: T): Promise<R> {
      const req = args[0] as NextRequest
      const limiter = rateLimiters[limiterName]
      
      const rateLimitResponse = await limiter.middleware(req)
      if (rateLimitResponse) {
        throw new Error('Rate limit exceeded')
      }
      
      return target.apply(this, args)
    }
  }
}

// Sliding window rate limiter (more accurate)
export class SlidingWindowRateLimiter {
  private windows = new Map<string, number[]>()
  
  constructor(
    private windowSizeMs: number,
    private maxRequests: number
  ) {}

  checkLimit(key: string): boolean {
    const now = Date.now()
    const window = this.windows.get(key) || []
    
    // Remove old requests outside the window
    const validRequests = window.filter(timestamp => 
      now - timestamp < this.windowSizeMs
    )
    
    // Check if we can allow this request
    if (validRequests.length >= this.maxRequests) {
      return false
    }
    
    // Add current request
    validRequests.push(now)
    this.windows.set(key, validRequests)
    
    return true
  }

  getRemainingRequests(key: string): number {
    const now = Date.now()
    const window = this.windows.get(key) || []
    const validRequests = window.filter(timestamp => 
      now - timestamp < this.windowSizeMs
    )
    
    return Math.max(0, this.maxRequests - validRequests.length)
  }
}

