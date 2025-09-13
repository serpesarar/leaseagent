import { ApolloServer } from '@apollo/server'
import { startServerAndCreateNextHandler } from '@as-integrations/next'
import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { typeDefs } from '@/lib/graphql/schema'
import { resolvers } from '@/lib/graphql/resolvers'
import { GraphQLError } from 'graphql'

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: process.env.NODE_ENV === 'development',
  plugins: [
    // Custom plugin for logging and performance monitoring
    {
      requestDidStart() {
        return {
          didResolveOperation(requestContext) {
            console.log(`GraphQL Operation: ${requestContext.request.operationName}`)
          },
          didEncounterErrors(requestContext) {
            console.error('GraphQL Errors:', requestContext.errors)
          },
          willSendResponse(requestContext) {
            // Add custom headers if needed
            if (requestContext.response.http) {
              requestContext.response.http.headers.set('X-GraphQL-Operation', 
                requestContext.request.operationName || 'unknown')
            }
          }
        }
      }
    },
    // Rate limiting plugin
    {
      requestDidStart() {
        return {
          didResolveOperation(requestContext) {
            // Simple rate limiting based on operation complexity
            const query = requestContext.request.query
            if (query && query.length > 10000) {
              throw new GraphQLError('Query too complex', {
                extensions: { code: 'QUERY_TOO_COMPLEX' }
              })
            }
          }
        }
      }
    }
  ],
  formatError: (error) => {
    // Log errors but don't expose internal details in production
    console.error('GraphQL Error:', error)
    
    if (process.env.NODE_ENV === 'production') {
      // Don't expose internal error details in production
      if (error.extensions?.code === 'INTERNAL_SERVER_ERROR') {
        return new GraphQLError('Internal server error', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' }
        })
      }
    }
    
    return error
  }
})

// Create context function
async function createContext({ req }: { req: NextRequest }) {
  try {
    const session = await getServerSession(authOptions)
    
    return {
      user: session?.user || null,
      req
    }
  } catch (error) {
    console.error('Context creation error:', error)
    return {
      user: null,
      req
    }
  }
}

// Create handler
const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context: createContext
})

// Export handlers for different HTTP methods
export { handler as GET, handler as POST }

