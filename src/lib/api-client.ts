import { ApiResponse } from './api-middleware'

// Base API client configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

// Request configuration
interface RequestConfig extends RequestInit {
  timeout?: number
}

// Generic API client
class APIClient {
  private baseURL: string
  private defaultTimeout: number = 30000

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL
  }

  private async request<T>(
    endpoint: string, 
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const { timeout = this.defaultTimeout, ...requestConfig } = config
    
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...requestConfig,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...requestConfig.headers,
        },
      })

      clearTimeout(timeoutId)

      const data = await response.json()

      if (!response.ok) {
        throw new APIError(
          data.error || 'Request failed',
          response.status,
          data.code || 'API_ERROR',
          data.details
        )
      }

      return data
    } catch (error) {
      clearTimeout(timeoutId)
      
      if (error instanceof APIError) {
        throw error
      }
      
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new APIError('Request timeout', 408, 'TIMEOUT')
      }
      
      throw new APIError(
        error instanceof Error ? error.message : 'Unknown error',
        500,
        'NETWORK_ERROR'
      )
    }
  }

  // HTTP methods
  async get<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'GET' })
  }

  async post<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async patch<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' })
  }
}

// Custom API Error class
export class APIError extends Error {
  public statusCode: number
  public code: string
  public details?: any

  constructor(message: string, statusCode: number = 500, code: string = 'API_ERROR', details?: any) {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.details = details
    this.name = 'APIError'
  }
}

// Create API client instance
export const apiClient = new APIClient()

// Typed API methods for specific endpoints
export const propertyAPI = {
  // Properties
  getProperties: (params?: {
    page?: number
    limit?: number
    search?: string
    type?: string
    city?: string
  }) => {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString())
        }
      })
    }
    const query = searchParams.toString()
    return apiClient.get(`/properties${query ? `?${query}` : ''}`)
  },

  getProperty: (id: string) => 
    apiClient.get(`/properties/${id}`),

  createProperty: (data: any) => 
    apiClient.post('/properties', data),

  updateProperty: (id: string, data: any) => 
    apiClient.put(`/properties/${id}`, data),

  deleteProperty: (id: string) => 
    apiClient.delete(`/properties/${id}`),
}

export const maintenanceAPI = {
  // Maintenance requests
  createRequest: (data: any) => 
    apiClient.post('/maintenance/create', data),

  getRequests: (params?: {
    page?: number
    limit?: number
    status?: string
    priority?: string
    propertyId?: string
  }) => {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString())
        }
      })
    }
    const query = searchParams.toString()
    return apiClient.get(`/maintenance${query ? `?${query}` : ''}`)
  },

  getRequest: (id: string) => 
    apiClient.get(`/maintenance/${id}`),

  updateRequest: (id: string, data: any) => 
    apiClient.put(`/maintenance/${id}`, data),

  assignContractor: (id: string, data: {
    contractorId: string
    scheduledDate?: string
    estimatedCost?: number
    notes?: string
  }) => 
    apiClient.put(`/maintenance/${id}/assign`, data),

  updateStatus: (id: string, status: string) => 
    apiClient.patch(`/maintenance/${id}/status`, { status }),
}

export const paymentAPI = {
  // Payments
  getPendingPayments: (params?: {
    page?: number
    limit?: number
    propertyId?: string
    overdueDays?: number
  }) => {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString())
        }
      })
    }
    const query = searchParams.toString()
    return apiClient.get(`/payments/pending${query ? `?${query}` : ''}`)
  },

  createPayment: (data: any) => 
    apiClient.post('/payments', data),

  processPayment: (paymentId: string, paymentMethodId: string) => 
    apiClient.post(`/payments/${paymentId}/process`, { paymentMethodId }),

  getPaymentHistory: (params?: {
    page?: number
    limit?: number
    leaseId?: string
    dateRange?: { start: string; end: string }
  }) => {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          if (typeof value === 'object') {
            searchParams.append(key, JSON.stringify(value))
          } else {
            searchParams.append(key, value.toString())
          }
        }
      })
    }
    const query = searchParams.toString()
    return apiClient.get(`/payments${query ? `?${query}` : ''}`)
  }
}

export const aiAPI = {
  // AI services
  categorizeIssue: (data: {
    description: string
    title?: string
    images?: string[]
  }) => 
    apiClient.post('/ai/categorize', data),

  analyzeProperty: (propertyId: string) => 
    apiClient.post(`/ai/analyze-property/${propertyId}`),

  predictMaintenance: (propertyId: string, timeframe?: string) => 
    apiClient.post(`/ai/predict-maintenance/${propertyId}`, { timeframe }),
}

export const contractorAPI = {
  // Contractors
  getContractors: (params?: {
    page?: number
    limit?: number
    specialties?: string[]
    availability?: boolean
  }) => {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            value.forEach(v => searchParams.append(key, v.toString()))
          } else {
            searchParams.append(key, value.toString())
          }
        }
      })
    }
    const query = searchParams.toString()
    return apiClient.get(`/contractors${query ? `?${query}` : ''}`)
  },

  createContractor: (data: any) => 
    apiClient.post('/contractors', data),

  updateContractor: (id: string, data: any) => 
    apiClient.put(`/contractors/${id}`, data),

  getContractorPerformance: (id: string, timeframe?: string) => 
    apiClient.get(`/contractors/${id}/performance${timeframe ? `?timeframe=${timeframe}` : ''}`),
}

// Utility functions for error handling
export function isAPIError(error: any): error is APIError {
  return error instanceof APIError
}

export function handleAPIError(error: any): string {
  if (isAPIError(error)) {
    switch (error.code) {
      case 'VALIDATION_ERROR':
        return 'Please check your input and try again.'
      case 'UNAUTHORIZED':
        return 'Please sign in to continue.'
      case 'FORBIDDEN':
        return 'You do not have permission to perform this action.'
      case 'NOT_FOUND':
        return 'The requested resource was not found.'
      case 'RATE_LIMIT_EXCEEDED':
        return 'Too many requests. Please try again later.'
      case 'NETWORK_ERROR':
        return 'Network error. Please check your connection.'
      case 'TIMEOUT':
        return 'Request timed out. Please try again.'
      default:
        return error.message || 'An unexpected error occurred.'
    }
  }
  
  return 'An unexpected error occurred.'
}

// Request interceptors for common functionality
export function addAuthInterceptor(token: string) {
  const originalRequest = apiClient['request'].bind(apiClient)
  
  apiClient['request'] = async function<T>(endpoint: string, config: RequestConfig = {}) {
    config.headers = {
      ...config.headers,
      'Authorization': `Bearer ${token}`
    }
    return originalRequest<T>(endpoint, config)
  }
}

// Response interceptors
export function addResponseInterceptor(
  onSuccess?: (response: any) => any,
  onError?: (error: any) => any
) {
  const originalRequest = apiClient['request'].bind(apiClient)
  
  apiClient['request'] = async function<T>(endpoint: string, config: RequestConfig = {}) {
    try {
      const response = await originalRequest<T>(endpoint, config)
      return onSuccess ? onSuccess(response) : response
    } catch (error) {
      if (onError) {
        return onError(error)
      }
      throw error
    }
  }
}

