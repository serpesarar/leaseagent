import { NextRequest, NextResponse } from 'next/server'
import { headers, cookies } from 'next/headers'
import { createHash, randomBytes, timingSafeEqual } from 'crypto'

// CSRF token configuration
interface CSRFConfig {
  secret: string
  tokenLength: number
  cookieName: string
  headerName: string
  sameSite: 'strict' | 'lax' | 'none'
  secure: boolean
  httpOnly: boolean
  maxAge: number
  saltLength: number
}

// Default CSRF configuration
const defaultConfig: CSRFConfig = {
  secret: process.env.CSRF_SECRET || 'default-csrf-secret-change-in-production',
  tokenLength: 32,
  cookieName: '_csrf_token',
  headerName: 'x-csrf-token',
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  httpOnly: false, // Must be false to allow JavaScript access
  maxAge: 60 * 60 * 24, // 24 hours
  saltLength: 16
}

export class CSRFProtection {
  private config: CSRFConfig

  constructor(config: Partial<CSRFConfig> = {}) {
    this.config = { ...defaultConfig, ...config }
  }

  /**
   * Generate a CSRF token
   */
  generateToken(): { token: string; hashedToken: string } {
    const salt = randomBytes(this.config.saltLength).toString('hex')
    const token = randomBytes(this.config.tokenLength).toString('hex')
    const tokenWithSalt = `${salt}:${token}`
    
    // Create hash of token with secret
    const hashedToken = createHash('sha256')
      .update(`${tokenWithSalt}:${this.config.secret}`)
      .digest('hex')
    
    return {
      token: Buffer.from(tokenWithSalt).toString('base64'),
      hashedToken
    }
  }

  /**
   * Verify a CSRF token
   */
  verifyToken(token: string, hashedToken: string): boolean {
    try {
      const tokenWithSalt = Buffer.from(token, 'base64').toString('utf8')
      
      // Recreate hash
      const expectedHash = createHash('sha256')
        .update(`${tokenWithSalt}:${this.config.secret}`)
        .digest('hex')
      
      // Use timing-safe comparison to prevent timing attacks
      const expectedBuffer = Buffer.from(expectedHash, 'hex')
      const actualBuffer = Buffer.from(hashedToken, 'hex')
      
      if (expectedBuffer.length !== actualBuffer.length) {
        return false
      }
      
      return timingSafeEqual(expectedBuffer, actualBuffer)
    } catch (error) {
      console.error('CSRF token verification error:', error)
      return false
    }
  }

  /**
   * Set CSRF token in response cookies
   */
  setTokenCookie(response: NextResponse, token: string): void {
    response.cookies.set(this.config.cookieName, token, {
      maxAge: this.config.maxAge,
      sameSite: this.config.sameSite,
      secure: this.config.secure,
      httpOnly: this.config.httpOnly,
      path: '/'
    })
  }

  /**
   * Get CSRF token from request cookies
   */
  getTokenFromCookies(req: NextRequest): string | null {
    return req.cookies.get(this.config.cookieName)?.value || null
  }

  /**
   * Get CSRF token from request headers
   */
  getTokenFromHeaders(req: NextRequest): string | null {
    return req.headers.get(this.config.headerName) || 
           req.headers.get('csrf-token') ||
           null
  }

  /**
   * Get CSRF token from request body (for form submissions)
   */
  async getTokenFromBody(req: NextRequest): Promise<string | null> {
    try {
      const contentType = req.headers.get('content-type') || ''
      
      if (contentType.includes('application/json')) {
        const body = await req.json()
        return body._csrf || body.csrfToken || null
      }
      
      if (contentType.includes('application/x-www-form-urlencoded')) {
        const formData = await req.formData()
        return formData.get('_csrf')?.toString() || 
               formData.get('csrfToken')?.toString() || 
               null
      }
      
      return null
    } catch (error) {
      console.error('Error extracting CSRF token from body:', error)
      return null
    }
  }

  /**
   * CSRF middleware for API routes
   */
  async middleware(req: NextRequest): Promise<NextResponse | null> {
    // Skip CSRF check for safe methods
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
      return null
    }

    // Skip CSRF for API endpoints that use other authentication methods
    const pathname = req.nextUrl.pathname
    if (this.shouldSkipCSRF(pathname)) {
      return null
    }

    // Get stored token hash from session/database
    // For this example, we'll store it in a cookie
    const storedHashedToken = req.cookies.get(`${this.config.cookieName}_hash`)?.value

    if (!storedHashedToken) {
      return this.createCSRFErrorResponse('CSRF token not found in session')
    }

    // Get token from various sources
    let submittedToken = this.getTokenFromHeaders(req)
    
    if (!submittedToken) {
      // Clone request to read body without consuming it
      const clonedRequest = req.clone()
      submittedToken = await this.getTokenFromBody(clonedRequest)
    }

    if (!submittedToken) {
      return this.createCSRFErrorResponse('CSRF token not provided')
    }

    // Verify token
    if (!this.verifyToken(submittedToken, storedHashedToken)) {
      return this.createCSRFErrorResponse('Invalid CSRF token')
    }

    return null // Allow request to continue
  }

  /**
   * Generate and set CSRF token for a response
   */
  async setCSRFToken(response: NextResponse): Promise<string> {
    const { token, hashedToken } = this.generateToken()
    
    // Set token cookie (accessible by JavaScript)
    this.setTokenCookie(response, token)
    
    // Set hashed token cookie (for server-side verification)
    response.cookies.set(`${this.config.cookieName}_hash`, hashedToken, {
      maxAge: this.config.maxAge,
      sameSite: this.config.sameSite,
      secure: this.config.secure,
      httpOnly: true, // Secure from JavaScript access
      path: '/'
    })

    return token
  }

  /**
   * Check if CSRF should be skipped for this path
   */
  private shouldSkipCSRF(pathname: string): boolean {
    const skipPaths = [
      '/api/auth/', // NextAuth.js endpoints
      '/api/webhooks/', // Webhook endpoints
      '/api/health', // Health check endpoints
    ]

    return skipPaths.some(path => pathname.startsWith(path))
  }

  /**
   * Create CSRF error response
   */
  private createCSRFErrorResponse(message: string): NextResponse {
    return NextResponse.json(
      {
        success: false,
        error: 'CSRF protection error',
        code: 'CSRF_TOKEN_INVALID',
        message
      },
      { status: 403 }
    )
  }
}

// Global CSRF protection instance
export const csrfProtection = new CSRFProtection()

// CSRF middleware wrapper for API routes
export function withCSRFProtection<T extends any[], R>(
  handler: (...args: T) => Promise<R>
) {
  return async function (this: any, ...args: T): Promise<R> {
    const req = args[0] as NextRequest
    
    const csrfResponse = await csrfProtection.middleware(req)
    if (csrfResponse) {
      throw new Error('CSRF protection failed')
    }
    
    return handler.apply(this, args)
  }
}

// React hook for CSRF token management
export function useCSRFToken() {
  const getCSRFToken = (): string | null => {
    if (typeof window === 'undefined') return null
    
    // Get token from meta tag (set by server)
    const metaToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
    if (metaToken) return metaToken

    // Get token from cookie
    const cookies = document.cookie.split(';')
    const csrfCookie = cookies.find(cookie => 
      cookie.trim().startsWith(`${defaultConfig.cookieName}=`)
    )
    
    if (csrfCookie) {
      return csrfCookie.split('=')[1]
    }

    return null
  }

  const addCSRFToHeaders = (headers: HeadersInit = {}): HeadersInit => {
    const token = getCSRFToken()
    if (token) {
      return {
        ...headers,
        [defaultConfig.headerName]: token
      }
    }
    return headers
  }

  const addCSRFToFormData = (formData: FormData): FormData => {
    const token = getCSRFToken()
    if (token) {
      formData.append('_csrf', token)
    }
    return formData
  }

  const addCSRFToBody = (body: any): any => {
    const token = getCSRFToken()
    if (token && typeof body === 'object') {
      return { ...body, _csrf: token }
    }
    return body
  }

  return {
    getCSRFToken,
    addCSRFToHeaders,
    addCSRFToFormData,
    addCSRFToBody
  }
}

// Enhanced fetch wrapper with CSRF protection
export async function csrfFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const csrfToken = typeof window !== 'undefined' ? 
    document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ||
    document.cookie
      .split(';')
      .find(c => c.trim().startsWith(`${defaultConfig.cookieName}=`))
      ?.split('=')[1]
    : null

  const headers = new Headers(options.headers)
  
  if (csrfToken && !['GET', 'HEAD', 'OPTIONS'].includes(options.method?.toUpperCase() || 'GET')) {
    headers.set(defaultConfig.headerName, csrfToken)
  }

  return fetch(url, {
    ...options,
    headers
  })
}

// CSRF token component for forms
export function CSRFTokenInput(): JSX.Element {
  const { getCSRFToken } = useCSRFToken()
  const token = getCSRFToken()

  if (!token) {
    console.warn('CSRF token not found')
    return <></>
  }

  return <input type="hidden" name="_csrf" value={token} />
}

// Double submit cookie pattern implementation
export class DoubleSubmitCSRF {
  private config: CSRFConfig

  constructor(config: Partial<CSRFConfig> = {}) {
    this.config = { ...defaultConfig, ...config }
  }

  /**
   * Generate a random token for double submit pattern
   */
  generateToken(): string {
    return randomBytes(this.config.tokenLength).toString('hex')
  }

  /**
   * Set token in both cookie and require it in request
   */
  setToken(response: NextResponse): string {
    const token = this.generateToken()
    
    // Set secure cookie
    response.cookies.set(this.config.cookieName, token, {
      maxAge: this.config.maxAge,
      sameSite: this.config.sameSite,
      secure: this.config.secure,
      httpOnly: false, // Must be accessible to JavaScript
      path: '/'
    })

    return token
  }

  /**
   * Verify double submit token
   */
  async verifyToken(req: NextRequest): Promise<boolean> {
    const cookieToken = this.getTokenFromCookies(req)
    if (!cookieToken) return false

    let submittedToken = this.getTokenFromHeaders(req)
    
    if (!submittedToken) {
      const clonedRequest = req.clone()
      submittedToken = await this.getTokenFromBody(clonedRequest)
    }

    if (!submittedToken) return false

    // Timing-safe comparison
    const cookieBuffer = Buffer.from(cookieToken)
    const submittedBuffer = Buffer.from(submittedToken)

    if (cookieBuffer.length !== submittedBuffer.length) {
      return false
    }

    return timingSafeEqual(cookieBuffer, submittedBuffer)
  }

  /**
   * Middleware for double submit pattern
   */
  async middleware(req: NextRequest): Promise<NextResponse | null> {
    // Skip for safe methods
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
      return null
    }

    const isValid = await this.verifyToken(req)
    if (!isValid) {
      return NextResponse.json(
        {
          success: false,
          error: 'CSRF token validation failed',
          code: 'CSRF_TOKEN_INVALID'
        },
        { status: 403 }
      )
    }

    return null
  }
}

// Export instances
export const doubleSubmitCSRF = new DoubleSubmitCSRF()

// Utility to add CSRF meta tag to HTML
export function getCSRFMetaTag(token: string): string {
  return `<meta name="csrf-token" content="${token}" />`
}

// Express-style CSRF middleware adapter
export function createCSRFMiddleware(options: Partial<CSRFConfig> = {}) {
  const csrf = new CSRFProtection(options)
  
  return {
    // Generate and set token
    generateToken: async (response: NextResponse) => {
      return await csrf.setCSRFToken(response)
    },
    
    // Verify token middleware
    verifyToken: async (req: NextRequest) => {
      return await csrf.middleware(req)
    },
    
    // Get token for client
    getToken: (req: NextRequest) => {
      return csrf.getTokenFromCookies(req)
    }
  }
}

