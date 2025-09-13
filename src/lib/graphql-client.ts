import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { getSession } from 'next-auth/react'

// HTTP Link
const httpLink = createHttpLink({
  uri: '/api/graphql',
})

// Auth Link
const authLink = setContext(async (_, { headers }) => {
  // Get the authentication token from NextAuth session
  const session = await getSession()
  
  return {
    headers: {
      ...headers,
      authorization: session?.accessToken ? `Bearer ${session.accessToken}` : '',
    }
  }
})

// Error Link
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      console.error(
        `GraphQL error: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
      
      // Handle specific error codes
      if (extensions?.code === 'UNAUTHENTICATED') {
        // Redirect to login or refresh token
        window.location.href = '/auth/signin'
      }
    })
  }

  if (networkError) {
    console.error(`Network error: ${networkError}`)
    
    // Handle network errors
    if (networkError.message.includes('fetch')) {
      console.error('Network connectivity issue')
    }
  }
})

// Cache configuration with type policies
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        properties: {
          keyArgs: ['search', 'type', 'city'],
          merge(existing, incoming, { args }) {
            if (args?.page === 1) {
              return incoming
            }
            
            return {
              ...incoming,
              properties: [
                ...(existing?.properties || []),
                ...incoming.properties
              ]
            }
          }
        },
        maintenanceRequests: {
          keyArgs: ['status', 'priority', 'propertyId'],
          merge(existing, incoming, { args }) {
            if (args?.page === 1) {
              return incoming
            }
            
            return {
              ...incoming,
              requests: [
                ...(existing?.requests || []),
                ...incoming.requests
              ]
            }
          }
        },
        payments: {
          keyArgs: ['status', 'leaseId', 'propertyId'],
          merge(existing, incoming, { args }) {
            if (args?.page === 1) {
              return incoming
            }
            
            return {
              ...incoming,
              payments: [
                ...(existing?.payments || []),
                ...incoming.payments
              ]
            }
          }
        }
      }
    },
    Property: {
      fields: {
        occupancyRate: {
          read(_, { readField }) {
            const units = readField('units') as any[]
            if (!units) return 0
            
            const occupiedUnits = units.filter(unit => unit.isOccupied).length
            return units.length > 0 ? (occupiedUnits / units.length) * 100 : 0
          }
        },
        monthlyRevenue: {
          read(_, { readField }) {
            const units = readField('units') as any[]
            if (!units) return 0
            
            return units.reduce((sum, unit) => {
              if (unit.isOccupied) {
                return sum + (unit.rent || 0)
              }
              return sum
            }, 0)
          }
        }
      }
    },
    MaintenanceRequest: {
      fields: {
        isOverdue: {
          read(_, { readField }) {
            const scheduledDate = readField('scheduledDate')
            const status = readField('status')
            
            if (!scheduledDate || status === 'COMPLETED') return false
            return new Date() > new Date(scheduledDate as string)
          }
        },
        daysOpen: {
          read(_, { readField }) {
            const createdAt = readField('createdAt')
            const completedDate = readField('completedDate')
            
            if (!createdAt) return 0
            
            const created = new Date(createdAt as string)
            const end = completedDate ? new Date(completedDate as string) : new Date()
            
            return Math.floor((end.getTime() - created.getTime()) / (1000 * 60 * 60 * 24))
          }
        }
      }
    },
    Payment: {
      fields: {
        isOverdue: {
          read(_, { readField }) {
            const status = readField('status')
            const dueDate = readField('dueDate')
            
            return status === 'OVERDUE' || 
                   (status === 'PENDING' && new Date() > new Date(dueDate as string))
          }
        },
        daysOverdue: {
          read(_, { readField }) {
            const status = readField('status')
            const dueDate = readField('dueDate')
            
            if (status !== 'OVERDUE' && status !== 'PENDING') return 0
            
            const due = new Date(dueDate as string)
            const now = new Date()
            
            if (now <= due) return 0
            return Math.floor((now.getTime() - due.getTime()) / (1000 * 60 * 60 * 24))
          }
        }
      }
    }
  }
})

// Create Apollo Client
export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache,
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
      fetchPolicy: 'cache-and-network'
    },
    query: {
      errorPolicy: 'all',
      fetchPolicy: 'cache-first'
    },
    mutate: {
      errorPolicy: 'all'
    }
  }
})

// Utility functions for cache management
export const cacheUtils = {
  // Invalidate specific queries
  invalidateQueries: (queryNames: string[]) => {
    queryNames.forEach(queryName => {
      apolloClient.cache.evict({ fieldName: queryName })
    })
    apolloClient.cache.gc()
  },

  // Update cache after mutations
  updatePropertyCache: (propertyId: string, updates: any) => {
    apolloClient.cache.modify({
      id: apolloClient.cache.identify({ __typename: 'Property', id: propertyId }),
      fields: {
        ...updates
      }
    })
  },

  updateMaintenanceRequestCache: (requestId: string, updates: any) => {
    apolloClient.cache.modify({
      id: apolloClient.cache.identify({ __typename: 'MaintenanceRequest', id: requestId }),
      fields: {
        ...updates
      }
    })
  },

  // Add new item to list
  addToMaintenanceRequestsList: (newRequest: any) => {
    apolloClient.cache.modify({
      fields: {
        maintenanceRequests(existing = { requests: [], pagination: {} }) {
          return {
            ...existing,
            requests: [newRequest, ...existing.requests]
          }
        }
      }
    })
  },

  // Remove item from list
  removeFromMaintenanceRequestsList: (requestId: string) => {
    apolloClient.cache.modify({
      fields: {
        maintenanceRequests(existing = { requests: [], pagination: {} }) {
          return {
            ...existing,
            requests: existing.requests.filter((request: any) => request.id !== requestId)
          }
        }
      }
    })
  },

  // Clear all cache
  clearCache: () => {
    apolloClient.cache.reset()
  }
}

// Optimistic response helpers
export const optimisticResponses = {
  createMaintenanceRequest: (input: any, userId: string) => ({
    __typename: 'Mutation',
    createMaintenanceRequest: {
      __typename: 'MaintenanceRequest',
      id: `temp-${Date.now()}`,
      ...input,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      requester: {
        __typename: 'User',
        id: userId,
        name: 'You',
        email: ''
      },
      assignedContractor: null,
      contractor: null,
      isOverdue: false,
      daysOpen: 0
    }
  }),

  updateMaintenanceStatus: (id: string, status: string) => ({
    __typename: 'Mutation',
    updateMaintenanceRequest: {
      __typename: 'MaintenanceRequest',
      id,
      status,
      updatedAt: new Date().toISOString()
    }
  }),

  assignContractor: (id: string, contractorId: string, contractor: any) => ({
    __typename: 'Mutation',
    assignContractor: {
      __typename: 'MaintenanceRequest',
      id,
      assignedContractor: contractor,
      status: 'IN_PROGRESS',
      updatedAt: new Date().toISOString()
    }
  })
}

// Error handling utilities
export const handleGraphQLError = (error: any) => {
  if (error.networkError) {
    if (error.networkError.statusCode === 401) {
      return 'Authentication required. Please sign in.'
    }
    if (error.networkError.statusCode === 403) {
      return 'You do not have permission to perform this action.'
    }
    if (error.networkError.statusCode >= 500) {
      return 'Server error. Please try again later.'
    }
  }

  if (error.graphQLErrors?.length > 0) {
    const firstError = error.graphQLErrors[0]
    
    switch (firstError.extensions?.code) {
      case 'UNAUTHENTICATED':
        return 'Please sign in to continue.'
      case 'FORBIDDEN':
        return 'You do not have permission to perform this action.'
      case 'NOT_FOUND':
        return 'The requested resource was not found.'
      case 'VALIDATION_ERROR':
        return firstError.message || 'Please check your input and try again.'
      default:
        return firstError.message || 'An unexpected error occurred.'
    }
  }

  return 'An unexpected error occurred.'
}

// Subscription helpers (for future real-time features)
export const subscriptionHelpers = {
  // Subscribe to maintenance request updates
  subscribeToMaintenanceUpdates: (companyId: string) => {
    // This would be implemented when adding subscriptions
    // return apolloClient.subscribe({
    //   query: MAINTENANCE_UPDATES_SUBSCRIPTION,
    //   variables: { companyId }
    // })
  },

  // Subscribe to payment updates
  subscribeToPaymentUpdates: (companyId: string) => {
    // This would be implemented when adding subscriptions
  }
}

