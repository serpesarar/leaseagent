'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  isolate?: boolean
  showDetails?: boolean
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  errorId: string
}

export class ErrorBoundary extends Component<Props, State> {
  private retryCount = 0
  private maxRetries = 3

  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({
      error,
      errorInfo
    })

    // Log error to monitoring service
    this.logError(error, errorInfo)

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo)
  }

  private logError = (error: Error, errorInfo: ErrorInfo): void => {
    // In production, this would send to error monitoring service (Sentry, LogRocket, etc.)
    console.error('Error Boundary caught an error:', {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      errorInfo: {
        componentStack: errorInfo.componentStack
      },
      errorId: this.state.errorId,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Unknown',
      url: typeof window !== 'undefined' ? window.location.href : 'Unknown'
    })

    // Send to error reporting service
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error, { contexts: { errorInfo } })
    }
  }

  private handleRetry = (): void => {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        errorId: ''
      })
    } else {
      // Max retries reached, redirect to safe page
      if (typeof window !== 'undefined') {
        window.location.href = '/'
      }
    }
  }

  private handleReportError = (): void => {
    const { error, errorInfo, errorId } = this.state
    
    // Create error report
    const errorReport = {
      errorId,
      timestamp: new Date().toISOString(),
      error: {
        name: error?.name,
        message: error?.message,
        stack: error?.stack
      },
      componentStack: errorInfo?.componentStack,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Unknown',
      url: typeof window !== 'undefined' ? window.location.href : 'Unknown'
    }

    // In production, this would submit to error reporting API
    console.log('Error report:', errorReport)
    
    // Copy to clipboard for manual reporting
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(JSON.stringify(errorReport, null, 2))
        .then(() => alert('Error details copied to clipboard'))
        .catch(() => console.error('Failed to copy error details'))
    }
  }

  private renderErrorDetails = (): ReactNode => {
    const { error, errorInfo } = this.state
    
    if (!this.props.showDetails) return null

    return (
      <details className="mt-4 p-4 bg-gray-50 rounded-lg">
        <summary className="cursor-pointer font-medium text-sm text-gray-700 mb-2">
          Technical Details (Click to expand)
        </summary>
        <div className="space-y-2 text-xs font-mono">
          <div>
            <strong>Error:</strong> {error?.name}
          </div>
          <div>
            <strong>Message:</strong> {error?.message}
          </div>
          {error?.stack && (
            <div>
              <strong>Stack Trace:</strong>
              <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-32">
                {error.stack}
              </pre>
            </div>
          )}
          {errorInfo?.componentStack && (
            <div>
              <strong>Component Stack:</strong>
              <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-32">
                {errorInfo.componentStack}
              </pre>
            </div>
          )}
        </div>
      </details>
    )
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
          <Card className="max-w-lg w-full">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <CardTitle className="text-xl text-gray-900">
                Something went wrong
              </CardTitle>
              <CardDescription>
                {this.props.isolate 
                  ? "This component encountered an error, but the rest of the application should continue working."
                  : "We're sorry, but something unexpected happened. Our team has been notified."
                }
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                <strong>Error ID:</strong> {this.state.errorId}
                <br />
                <strong>Time:</strong> {new Date().toLocaleString()}
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  onClick={this.handleRetry}
                  disabled={this.retryCount >= this.maxRetries}
                  className="flex-1"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {this.retryCount >= this.maxRetries ? 'Max Retries Reached' : 'Try Again'}
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = '/'}
                  className="flex-1"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </Button>
              </div>

              <Button 
                variant="ghost" 
                size="sm"
                onClick={this.handleReportError}
                className="w-full"
              >
                <Bug className="w-4 h-4 mr-2" />
                Report This Error
              </Button>

              {this.renderErrorDetails()}
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

// Higher-order component for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  )
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`
  
  return WrappedComponent
}

// Specialized error boundaries for different contexts
export const PageErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ErrorBoundary
    showDetails={process.env.NODE_ENV === 'development'}
    onError={(error, errorInfo) => {
      // Log page-level errors with additional context
      console.error('Page Error:', { error, errorInfo })
    }}
  >
    {children}
  </ErrorBoundary>
)

export const ComponentErrorBoundary: React.FC<{ 
  children: ReactNode
  fallback?: ReactNode 
}> = ({ children, fallback }) => (
  <ErrorBoundary
    isolate={true}
    fallback={fallback || (
      <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
        <div className="flex items-center space-x-2 text-red-800">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-sm">This component failed to load</span>
        </div>
      </div>
    )}
  >
    {children}
  </ErrorBoundary>
)

export const APIErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ErrorBoundary
    fallback={
      <div className="p-8 text-center">
        <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Service Temporarily Unavailable
        </h3>
        <p className="text-gray-600 mb-4">
          We're experiencing some technical difficulties. Please try again in a few moments.
        </p>
        <Button onClick={() => window.location.reload()}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </div>
    }
    onError={(error) => {
      // Log API-related errors with specific context
      console.error('API Error:', error)
    }}
  >
    {children}
  </ErrorBoundary>
)

