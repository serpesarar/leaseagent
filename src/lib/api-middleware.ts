import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Joi from 'joi'
import { UserRole } from '@prisma/client'

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  code?: string
}

export interface ApiError {
  message: string
  code: string
  statusCode: number
  details?: any
}

// Custom API Error class
export class APIError extends Error {
  public statusCode: number
  public code: string
  public details?: any

  constructor(message: string, statusCode: number = 500, code: string = 'INTERNAL_ERROR', details?: any) {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.details = details
    this.name = 'APIError'
  }
}

// Authentication middleware
export async function withAuth(
  handler: (request: NextRequest, session: any) => Promise<NextResponse>,
  requiredRoles?: UserRole[]
) {
  return async (request: NextRequest) => {
    try {
      const session = await getServerSession(authOptions)

      if (!session) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized', code: 'UNAUTHORIZED' },
          { status: 401 }
        )
      }

      // Check role permissions
      if (requiredRoles && !requiredRoles.includes(session.user.role)) {
        return NextResponse.json(
          { success: false, error: 'Insufficient permissions', code: 'FORBIDDEN' },
          { status: 403 }
        )
      }

      return handler(request, session)
    } catch (error) {
      console.error('Auth middleware error:', error)
      return NextResponse.json(
        { success: false, error: 'Authentication failed', code: 'AUTH_ERROR' },
        { status: 500 }
      )
    }
  }
}

// Validation middleware
export function withValidation<T>(
  schema: Joi.ObjectSchema<T>,
  handler: (request: NextRequest, validatedData: T, session?: any) => Promise<NextResponse>
) {
  return async (request: NextRequest, session?: any) => {
    try {
      const body = await request.json()
      const { error, value } = schema.validate(body, { abortEarly: false })

      if (error) {
        const details = error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message,
          value: detail.context?.value
        }))

        return NextResponse.json(
          {
            success: false,
            error: 'Validation failed',
            code: 'VALIDATION_ERROR',
            details
          },
          { status: 400 }
        )
      }

      return handler(request, value, session)
    } catch (error) {
      if (error instanceof SyntaxError) {
        return NextResponse.json(
          { success: false, error: 'Invalid JSON', code: 'INVALID_JSON' },
          { status: 400 }
        )
      }

      throw error
    }
  }
}

// Error handling middleware
export function withErrorHandling(
  handler: (request: NextRequest, ...args: any[]) => Promise<NextResponse>
) {
  return async (request: NextRequest, ...args: any[]) => {
    try {
      return await handler(request, ...args)
    } catch (error) {
      console.error('API Error:', error)

      if (error instanceof APIError) {
        return NextResponse.json(
          {
            success: false,
            error: error.message,
            code: error.code,
            details: error.details
          },
          { status: error.statusCode }
        )
      }

      // Handle Prisma errors
      if (error instanceof Error && error.message.includes('Prisma')) {
        return NextResponse.json(
          {
            success: false,
            error: 'Database error',
            code: 'DATABASE_ERROR'
          },
          { status: 500 }
        )
      }

      // Generic error
      return NextResponse.json(
        {
          success: false,
          error: 'Internal server error',
          code: 'INTERNAL_ERROR'
        },
        { status: 500 }
      )
    }
  }
}

// Rate limiting middleware (simple implementation)
const requestCounts = new Map<string, { count: number; resetTime: number }>()

export function withRateLimit(
  maxRequests: number = 100,
  windowMs: number = 15 * 60 * 1000 // 15 minutes
) {
  return function (handler: (request: NextRequest, ...args: any[]) => Promise<NextResponse>) {
    return async (request: NextRequest, ...args: any[]) => {
      const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
      const now = Date.now()
      
      const requestData = requestCounts.get(ip)
      
      if (!requestData || now > requestData.resetTime) {
        requestCounts.set(ip, { count: 1, resetTime: now + windowMs })
        return handler(request, ...args)
      }
      
      if (requestData.count >= maxRequests) {
        return NextResponse.json(
          {
            success: false,
            error: 'Rate limit exceeded',
            code: 'RATE_LIMIT_EXCEEDED'
          },
          { status: 429 }
        )
      }
      
      requestData.count++
      return handler(request, ...args)
    }
  }
}

// Combine multiple middlewares
export function withMiddleware(
  handler: (request: NextRequest, ...args: any[]) => Promise<NextResponse>,
  middlewares: Array<(handler: any) => any>
) {
  return middlewares.reduce((acc, middleware) => middleware(acc), handler)
}

// Validation schemas for common endpoints
export const schemas = {
  // Authentication
  signUp: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    name: Joi.string().min(2).required(),
    companyName: Joi.string().min(2).required(),
    role: Joi.string().valid(...Object.values(UserRole)).optional()
  }),

  signIn: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  // Properties
  createProperty: Joi.object({
    name: Joi.string().min(2).required(),
    address: Joi.string().min(5).required(),
    city: Joi.string().min(2).required(),
    state: Joi.string().length(2).required(),
    zipCode: Joi.string().min(5).required(),
    type: Joi.string().valid('APARTMENT', 'HOUSE', 'CONDO', 'COMMERCIAL').required(),
    totalUnits: Joi.number().integer().min(1).required(),
    yearBuilt: Joi.number().integer().min(1800).max(new Date().getFullYear()).optional(),
    amenities: Joi.array().items(Joi.string()).optional()
  }),

  updateProperty: Joi.object({
    name: Joi.string().min(2).optional(),
    address: Joi.string().min(5).optional(),
    city: Joi.string().min(2).optional(),
    state: Joi.string().length(2).optional(),
    zipCode: Joi.string().min(5).optional(),
    type: Joi.string().valid('APARTMENT', 'HOUSE', 'CONDO', 'COMMERCIAL').optional(),
    totalUnits: Joi.number().integer().min(1).optional(),
    yearBuilt: Joi.number().integer().min(1800).max(new Date().getFullYear()).optional(),
    amenities: Joi.array().items(Joi.string()).optional()
  }),

  // Maintenance
  createMaintenanceRequest: Joi.object({
    title: Joi.string().min(3).required(),
    description: Joi.string().min(10).required(),
    priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH', 'URGENT').required(),
    category: Joi.string().optional(),
    propertyId: Joi.string().required(),
    unitId: Joi.string().optional(),
    leaseId: Joi.string().optional(),
    images: Joi.array().items(Joi.string()).optional(),
    scheduledDate: Joi.date().optional()
  }),

  updateMaintenanceRequest: Joi.object({
    title: Joi.string().min(3).optional(),
    description: Joi.string().min(10).optional(),
    priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH', 'URGENT').optional(),
    status: Joi.string().valid('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED').optional(),
    category: Joi.string().optional(),
    scheduledDate: Joi.date().optional(),
    completedDate: Joi.date().optional(),
    actualCost: Joi.number().min(0).optional(),
    notes: Joi.string().optional()
  }),

  assignContractor: Joi.object({
    contractorId: Joi.string().required(),
    scheduledDate: Joi.date().optional(),
    estimatedCost: Joi.number().min(0).optional(),
    notes: Joi.string().optional()
  }),

  // Payments
  createPayment: Joi.object({
    leaseId: Joi.string().required(),
    amount: Joi.number().min(0).required(),
    type: Joi.string().valid('RENT', 'SECURITY_DEPOSIT', 'LATE_FEE', 'MAINTENANCE', 'OTHER').required(),
    dueDate: Joi.date().required(),
    description: Joi.string().optional()
  }),

  processPayment: Joi.object({
    paymentMethodId: Joi.string().required(),
    amount: Joi.number().min(0).required(),
    currency: Joi.string().length(3).default('USD')
  }),

  // Contractors
  createContractor: Joi.object({
    name: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().optional(),
    address: Joi.string().optional(),
    specialties: Joi.array().items(Joi.string().valid('PLUMBING', 'ELECTRICAL', 'APPLIANCE', 'HVAC', 'GENERAL')).required(),
    hourlyRate: Joi.number().min(0).optional(),
    licenseNumber: Joi.string().optional(),
    insuranceInfo: Joi.object().optional()
  }),

  // AI categorization
  categorizeIssue: Joi.object({
    description: Joi.string().min(10).required(),
    title: Joi.string().min(3).optional(),
    images: Joi.array().items(Joi.string()).optional()
  })
}

// Helper function to create API responses
export function createApiResponse<T>(
  data?: T,
  message?: string,
  success: boolean = true
): ApiResponse<T> {
  return {
    success,
    data,
    message
  }
}

export function createApiError(
  error: string,
  code: string = 'API_ERROR',
  details?: any
): ApiResponse {
  return {
    success: false,
    error,
    code,
    details
  }
}

