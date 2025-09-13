import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { Prisma } from '@prisma/client'

// Error types and interfaces
export interface AppError extends Error {
  statusCode: number
  code?: string
  details?: any
  isOperational: boolean
}

export interface ErrorResponse {
  success: false
  error: string
  code?: string
  details?: any
  timestamp: string
  requestId?: string
}

export interface SuccessResponse<T = any> {
  success: true
  data: T
  message?: string
  timestamp: string
  requestId?: string
}

export type APIResponse<T = any> = SuccessResponse<T> | ErrorResponse

// Custom error classes
export class ValidationError extends Error implements AppError {
  statusCode = 400
  code = 'VALIDATION_ERROR'
  isOperational = true

  constructor(message: string, public details?: any) {
    super(message)
    this.name = 'ValidationError'
  }
}

export class AuthenticationError extends Error implements AppError {
  statusCode = 401
  code = 'AUTHENTICATION_ERROR'
  isOperational = true

  constructor(message: string = 'Authentication required') {
    super(message)
    this.name = 'AuthenticationError'
  }
}

export class AuthorizationError extends Error implements AppError {
  statusCode = 403
  code = 'AUTHORIZATION_ERROR'
  isOperational = true

  constructor(message: string = 'Insufficient permissions') {
    super(message)
    this.name = 'AuthorizationError'
  }
}

export class NotFoundError extends Error implements AppError {
  statusCode = 404
  code = 'NOT_FOUND'
  isOperational = true

  constructor(resource: string = 'Resource') {
    super(`${resource} not found`)
    this.name = 'NotFoundError'
  }
}

export class ConflictError extends Error implements AppError {
  statusCode = 409
  code = 'CONFLICT_ERROR'
  isOperational = true

  constructor(message: string = 'Resource conflict') {
    super(message)
    this.name = 'ConflictError'
  }
}

export class RateLimitError extends Error implements AppError {
  statusCode = 429
  code = 'RATE_LIMIT_ERROR'
  isOperational = true

  constructor(message: string = 'Rate limit exceeded') {
    super(message)
    this.name = 'RateLimitError'
  }
}

export class ExternalServiceError extends Error implements AppError {
  statusCode = 502
  code = 'EXTERNAL_SERVICE_ERROR'
  isOperational = true

  constructor(service: string, message?: string) {
    super(message || `External service ${service} is unavailable`)
    this.name = 'ExternalServiceError'
  }
}

export class DatabaseError extends Error implements AppError {
  statusCode = 500
  code = 'DATABASE_ERROR'
  isOperational = true

  constructor(message: string = 'Database operation failed') {
    super(message)
    this.name = 'DatabaseError'
  }
}

// Error handling utilities
export class ErrorHandler {
  /**
   * Handle different types of errors and convert them to standardized format
   */
  static handleError(error: unknown, requestId?: string): ErrorResponse {
    const timestamp = new Date().toISOString()

    // Handle custom app errors
    if (this.isAppError(error)) {
      return {
        success: false,
        error: error.message,
        code: error.code,
        details: error.details,
        timestamp,
        requestId
      }
    }

    // Handle Zod validation errors
    if (error instanceof ZodError) {
      return {
        success: false,
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: this.formatZodErrors(error),
        timestamp,
        requestId
      }
    }

    // Handle Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return this.handlePrismaError(error, timestamp, requestId)
    }

    // Handle other Prisma errors
    if (error instanceof Prisma.PrismaClientUnknownRequestError) {
      return {
        success: false,
        error: 'Database operation failed',
        code: 'DATABASE_ERROR',
        timestamp,
        requestId
      }
    }

    // Handle validation errors from other libraries
    if (error instanceof Error && error.name === 'ValidationError') {
      return {
        success: false,
        error: error.message,
        code: 'VALIDATION_ERROR',
        timestamp,
        requestId
      }
    }

    // Handle generic errors
    if (error instanceof Error) {
      // Log unexpected errors for debugging
      console.error('Unexpected error:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
        requestId,
        timestamp
      })

      return {
        success: false,
        error: process.env.NODE_ENV === 'production' 
          ? 'An unexpected error occurred' 
          : error.message,
        code: 'INTERNAL_SERVER_ERROR',
        timestamp,
        requestId
      }
    }

    // Handle non-Error objects
    console.error('Unknown error type:', error)
    return {
      success: false,
      error: 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR',
      timestamp,
      requestId
    }
  }

  /**
   * Create a success response
   */
  static createSuccessResponse<T>(
    data: T,
    message?: string,
    requestId?: string
  ): SuccessResponse<T> {
    return {
      success: true,
      data,
      message,
      timestamp: new Date().toISOString(),
      requestId
    }
  }

  /**
   * Convert error to Next.js response
   */
  static toNextResponse(error: unknown, requestId?: string): NextResponse {
    const errorResponse = this.handleError(error, requestId)
    const statusCode = this.getStatusCodeFromError(error)

    return NextResponse.json(errorResponse, { status: statusCode })
  }

  /**
   * Check if error is an operational app error
   */
  private static isAppError(error: unknown): error is AppError {
    return (
      error instanceof Error &&
      'statusCode' in error &&
      'isOperational' in error &&
      (error as AppError).isOperational === true
    )
  }

  /**
   * Get HTTP status code from error
   */
  private static getStatusCodeFromError(error: unknown): number {
    if (this.isAppError(error)) {
      return error.statusCode
    }

    if (error instanceof ZodError) {
      return 400
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002': // Unique constraint violation
          return 409
        case 'P2025': // Record not found
          return 404
        case 'P2003': // Foreign key constraint violation
          return 400
        default:
          return 500
      }
    }

    return 500
  }

  /**
   * Format Zod validation errors
   */
  private static formatZodErrors(error: ZodError): Record<string, string> {
    const formatted: Record<string, string> = {}
    
    error.errors.forEach((err) => {
      const path = err.path.join('.')
      formatted[path] = err.message
    })

    return formatted
  }

  /**
   * Handle Prisma-specific errors
   */
  private static handlePrismaError(
    error: Prisma.PrismaClientKnownRequestError,
    timestamp: string,
    requestId?: string
  ): ErrorResponse {
    switch (error.code) {
      case 'P2002':
        return {
          success: false,
          error: 'A record with this information already exists',
          code: 'DUPLICATE_RECORD',
          details: { field: error.meta?.target },
          timestamp,
          requestId
        }

      case 'P2025':
        return {
          success: false,
          error: 'Record not found',
          code: 'RECORD_NOT_FOUND',
          timestamp,
          requestId
        }

      case 'P2003':
        return {
          success: false,
          error: 'Related record not found',
          code: 'FOREIGN_KEY_VIOLATION',
          details: { field: error.meta?.field_name },
          timestamp,
          requestId
        }

      case 'P2014':
        return {
          success: false,
          error: 'Invalid relationship data',
          code: 'INVALID_RELATION',
          timestamp,
          requestId
        }

      default:
        return {
          success: false,
          error: 'Database operation failed',
          code: 'DATABASE_ERROR',
          details: process.env.NODE_ENV === 'development' ? { prismaCode: error.code } : undefined,
          timestamp,
          requestId
        }
    }
  }
}

// Async error wrapper for API routes
export function withErrorHandling<T extends any[], R>(
  fn: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args)
    } catch (error) {
      // Re-throw operational errors
      if (ErrorHandler['isAppError'](error)) {
        throw error
      }

      // Log and re-throw unexpected errors
      console.error('Unexpected error in API handler:', error)
      throw error
    }
  }
}

// Error boundary helper for React components
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === 'string') {
    return error
  }

  return 'An unexpected error occurred'
}

// Validation helper
export function validateOrThrow<T>(
  schema: { parse: (data: unknown) => T },
  data: unknown
): T {
  try {
    return schema.parse(data)
  } catch (error) {
    if (error instanceof ZodError) {
      throw new ValidationError('Validation failed', ErrorHandler['formatZodErrors'](error))
    }
    throw error
  }
}

// Database operation wrapper
export async function withDatabaseErrorHandling<T>(
  operation: () => Promise<T>
): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          throw new ConflictError('A record with this information already exists')
        case 'P2025':
          throw new NotFoundError('Record')
        case 'P2003':
          throw new ValidationError('Invalid relationship data')
        default:
          throw new DatabaseError('Database operation failed')
      }
    }

    if (error instanceof Prisma.PrismaClientUnknownRequestError) {
      throw new DatabaseError('Database connection failed')
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
      throw new ValidationError('Invalid data provided')
    }

    throw error
  }
}

// External service wrapper
export async function withExternalServiceErrorHandling<T>(
  serviceName: string,
  operation: () => Promise<T>
): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    console.error(`External service error (${serviceName}):`, error)
    throw new ExternalServiceError(serviceName, `${serviceName} service is temporarily unavailable`)
  }
}

// Retry wrapper for operations that might fail temporarily
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: unknown

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error

      // Don't retry operational errors
      if (ErrorHandler['isAppError'](error)) {
        throw error
      }

      // Wait before retrying
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)))
      }
    }
  }

  throw lastError
}

// Type guards for error checking
export const isValidationError = (error: unknown): error is ValidationError => {
  return error instanceof ValidationError
}

export const isAuthenticationError = (error: unknown): error is AuthenticationError => {
  return error instanceof AuthenticationError
}

export const isAuthorizationError = (error: unknown): error is AuthorizationError => {
  return error instanceof AuthorizationError
}

export const isNotFoundError = (error: unknown): error is NotFoundError => {
  return error instanceof NotFoundError
}

export const isDatabaseError = (error: unknown): error is DatabaseError => {
  return error instanceof DatabaseError
}

export const isExternalServiceError = (error: unknown): error is ExternalServiceError => {
  return error instanceof ExternalServiceError
}

// Error logging utility
export function logError(error: unknown, context?: Record<string, any>): void {
  const errorInfo = {
    timestamp: new Date().toISOString(),
    error: {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    },
    context
  }

  // In production, this would send to error monitoring service
  if (process.env.NODE_ENV === 'production') {
    // Example: Sentry.captureException(error, { extra: context })
    console.error('Production Error:', errorInfo)
  } else {
    console.error('Development Error:', errorInfo)
  }
}

