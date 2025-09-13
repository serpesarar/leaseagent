# Property Management API Documentation

## Overview

This document describes the RESTful and GraphQL APIs for the Property Management Platform. The API provides comprehensive endpoints for managing properties, maintenance requests, payments, contractors, and AI-powered features.

## Base URL

- **REST API**: `/api/`
- **GraphQL**: `/api/graphql`

## Authentication

All API endpoints require authentication using NextAuth.js sessions. Include the session cookie in your requests.

### Authentication Headers
```http
Cookie: next-auth.session-token=your-session-token
```

## Error Handling

All API responses follow a consistent error format:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

### Common Error Codes

- `UNAUTHORIZED` (401): Authentication required
- `FORBIDDEN` (403): Insufficient permissions
- `NOT_FOUND` (404): Resource not found
- `VALIDATION_ERROR` (400): Invalid input data
- `RATE_LIMIT_EXCEEDED` (429): Too many requests
- `INTERNAL_ERROR` (500): Server error

## REST API Endpoints

### Authentication

#### POST `/api/auth/register`
Register a new user and company.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "companyName": "Property Management Co"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "COMPANY_OWNER"
    }
  }
}
```

### Properties

#### GET `/api/properties`
List all properties for the authenticated user's company.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `search` (string): Search term for name/address
- `type` (string): Property type filter
- `city` (string): City filter

**Response:**
```json
{
  "success": true,
  "data": {
    "properties": [
      {
        "id": "prop_123",
        "name": "Manhattan Heights",
        "address": "123 Main St",
        "city": "New York",
        "state": "NY",
        "zipCode": "10001",
        "type": "APARTMENT",
        "totalUnits": 50,
        "occupancyRate": 92,
        "monthlyRevenue": 125000,
        "occupiedUnits": 46,
        "pendingMaintenanceCount": 3
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "pages": 3
    }
  }
}
```

#### POST `/api/properties`
Create a new property.

**Required Roles:** `COMPANY_OWNER`, `PROPERTY_MANAGER`

**Request Body:**
```json
{
  "name": "Brooklyn Gardens",
  "address": "456 Oak Avenue",
  "city": "Brooklyn",
  "state": "NY",
  "zipCode": "11201",
  "type": "APARTMENT",
  "totalUnits": 30,
  "yearBuilt": 2015,
  "amenities": ["Gym", "Pool", "Parking"]
}
```

#### GET `/api/properties/{id}`
Get detailed property information.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "prop_123",
    "name": "Manhattan Heights",
    "units": [
      {
        "id": "unit_456",
        "unitNumber": "2B",
        "rent": 2800,
        "status": "OCCUPIED",
        "lease": {
          "tenant": {
            "name": "Jane Smith",
            "email": "jane@example.com"
          }
        }
      }
    ],
    "maintenanceRequests": [
      {
        "id": "maint_789",
        "title": "Leaky faucet",
        "priority": "MEDIUM",
        "status": "PENDING"
      }
    ],
    "occupancyRate": 92,
    "monthlyRevenue": 125000
  }
}
```

#### PUT `/api/properties/{id}`
Update property information.

**Required Roles:** `COMPANY_OWNER`, `PROPERTY_MANAGER`

#### DELETE `/api/properties/{id}`
Delete a property.

**Required Roles:** `COMPANY_OWNER`

### Maintenance Requests

#### POST `/api/maintenance/create`
Create a new maintenance request with AI analysis.

**Request Body:**
```json
{
  "title": "Kitchen sink is leaking",
  "description": "The kitchen sink has been dripping constantly for the past two days. Water is pooling under the sink.",
  "priority": "HIGH",
  "propertyId": "prop_123",
  "unitId": "unit_456",
  "images": ["image1.jpg", "image2.jpg"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "maint_789",
    "title": "Kitchen sink is leaking",
    "description": "...",
    "priority": "HIGH",
    "status": "PENDING",
    "aiCategory": "PLUMBING",
    "aiSeverity": "HIGH",
    "estimatedCost": 150,
    "property": {
      "name": "Manhattan Heights"
    },
    "requester": {
      "name": "Jane Smith"
    }
  }
}
```

#### PUT `/api/maintenance/{id}/assign`
Assign a contractor to a maintenance request.

**Required Roles:** `COMPANY_OWNER`, `PROPERTY_MANAGER`

**Request Body:**
```json
{
  "contractorId": "contractor_123",
  "scheduledDate": "2024-09-20T10:00:00Z",
  "estimatedCost": 200,
  "notes": "Emergency repair needed"
}
```

### Payments

#### GET `/api/payments/pending`
Get pending payments with filtering options.

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `propertyId` (string): Filter by property
- `overdueDays` (number): Filter by days overdue

**Response:**
```json
{
  "success": true,
  "data": {
    "payments": [
      {
        "id": "pay_456",
        "amount": 2800,
        "type": "RENT",
        "status": "OVERDUE",
        "dueDate": "2024-09-01T00:00:00Z",
        "daysOverdue": 15,
        "lease": {
          "tenant": {
            "name": "John Doe",
            "email": "john@example.com"
          },
          "unit": {
            "unitNumber": "3A",
            "property": {
              "name": "Manhattan Heights"
            }
          }
        }
      }
    ],
    "summary": {
      "totalPending": 12,
      "totalAmount": 35600,
      "overdueCount": 3,
      "overdueAmount": 8400
    }
  }
}
```

### AI Services

#### POST `/api/ai/categorize`
Analyze and categorize a maintenance issue using AI.

**Request Body:**
```json
{
  "description": "The toilet in unit 2B is overflowing and water is everywhere",
  "title": "Toilet emergency",
  "images": ["image1.jpg"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "category": "PLUMBING",
    "severity": "URGENT",
    "estimatedCost": 300,
    "suggestedContractor": {
      "id": "contractor_123",
      "name": "Elite Plumbing Services",
      "specialties": ["PLUMBING"]
    },
    "confidence": 0.95,
    "keywords": ["toilet", "overflowing", "water", "emergency"],
    "recommendations": [
      "Schedule emergency repair within 24 hours",
      "Turn off water supply if leak is severe",
      "Check for water damage in surrounding areas"
    ]
  }
}
```

### Contractors

#### GET `/api/contractors`
List contractors for the company.

**Query Parameters:**
- `specialties` (array): Filter by specialties
- `availability` (boolean): Filter by availability

#### POST `/api/contractors`
Add a new contractor.

**Required Roles:** `COMPANY_OWNER`, `PROPERTY_MANAGER`

## GraphQL API

### Endpoint
`POST /api/graphql`

### Schema Overview

The GraphQL schema provides a comprehensive query and mutation interface for all property management operations.

### Key Queries

#### Property Dashboard
Get comprehensive property dashboard data in a single query:

```graphql
query GetPropertyDashboard($propertyId: ID!) {
  propertyDashboard(propertyId: $propertyId) {
    property {
      id
      name
      address
      occupancyRate
      monthlyRevenue
    }
    units {
      unit {
        id
        unitNumber
        rent
        status
      }
      tenant {
        name
        email
      }
      leaseStatus
      pendingIssues {
        id
        title
        priority
      }
      nextPaymentDue {
        id
        amount
        dueDate
      }
    }
    recentMaintenanceRequests {
      id
      title
      priority
      status
      createdAt
    }
    upcomingLeaseExpirations {
      id
      endDate
      tenant {
        name
      }
      unit {
        unitNumber
      }
    }
    maintenanceByCategory {
      category
      count
    }
    revenueByMonth {
      month
      revenue
    }
  }
}
```

#### Company Dashboard
Get company-wide analytics and metrics:

```graphql
query GetCompanyDashboard($dateRange: DateRangeInput, $propertyIds: [ID!]) {
  companyDashboard(dateRange: $dateRange, propertyIds: $propertyIds) {
    totalProperties
    totalUnits
    occupiedUnits
    totalRevenue
    monthlyRevenue
    occupancyRate
    recentMaintenanceRequests {
      id
      title
      priority
      property {
        name
      }
    }
    upcomingLeaseExpirations {
      id
      endDate
      tenant {
        name
      }
    }
    overduePayments {
      id
      amount
      daysOverdue
      lease {
        tenant {
          name
        }
      }
    }
  }
}
```

#### Maintenance Requests with Filtering
```graphql
query GetMaintenanceRequests(
  $page: Int = 1
  $limit: Int = 10
  $status: MaintenanceStatus
  $priority: MaintenancePriority
  $propertyId: ID
) {
  maintenanceRequests(
    page: $page
    limit: $limit
    status: $status
    priority: $priority
    propertyId: $propertyId
  ) {
    requests {
      id
      title
      description
      priority
      status
      createdAt
      isOverdue
      daysOpen
      property {
        name
      }
      requester {
        name
      }
      assignedContractor {
        name
      }
    }
    pagination {
      page
      limit
      total
      pages
    }
  }
}
```

### Key Mutations

#### Create Maintenance Request
```graphql
mutation CreateMaintenanceRequest($input: CreateMaintenanceRequestInput!) {
  createMaintenanceRequest(input: $input) {
    id
    title
    description
    priority
    status
    aiCategory
    aiSeverity
    estimatedCost
    property {
      name
    }
    requester {
      name
    }
  }
}
```

#### Assign Contractor
```graphql
mutation AssignContractor(
  $id: ID!
  $contractorId: ID!
  $scheduledDate: DateTime
  $notes: String
) {
  assignContractor(
    id: $id
    contractorId: $contractorId
    scheduledDate: $scheduledDate
    notes: $notes
  ) {
    id
    status
    assignedContractor {
      name
      email
    }
    scheduledDate
  }
}
```

#### AI Issue Categorization
```graphql
mutation CategorizeIssue(
  $description: String!
  $title: String
  $images: [String!]
) {
  categorizeIssue(
    description: $description
    title: $title
    images: $images
  ) {
    category
    severity
    estimatedCost
    suggestedContractor {
      id
      name
      specialties
    }
    confidence
    keywords
    recommendations
  }
}
```

#### Bulk Operations
```graphql
mutation BulkUpdateMaintenanceStatus($ids: [ID!]!, $status: MaintenanceStatus!) {
  bulkUpdateMaintenanceStatus(ids: $ids, status: $status) {
    success
    updatedCount
    errors
  }
}
```

### Advanced Analytics Queries

#### Revenue Analytics
```graphql
query GetRevenueAnalytics(
  $dateRange: DateRangeInput!
  $groupBy: AnalyticsGroupBy = MONTH
  $propertyIds: [ID!]
) {
  revenueAnalytics(
    dateRange: $dateRange
    groupBy: $groupBy
    propertyIds: $propertyIds
  ) {
    totalRevenue
    averageRent
    growthRate
    revenueByProperty {
      property {
        name
      }
      revenue
    }
    revenueOverTime {
      date
      revenue
    }
  }
}
```

#### Maintenance Analytics
```graphql
query GetMaintenanceAnalytics(
  $dateRange: DateRangeInput!
  $propertyIds: [ID!]
) {
  maintenanceAnalytics(
    dateRange: $dateRange
    propertyIds: $propertyIds
  ) {
    totalRequests
    averageResolutionTime
    requestsByCategory {
      category
      count
    }
    requestsByPriority {
      priority
      count
    }
    costAnalysis {
      totalCost
      averageCost
      costByCategory {
        category
        totalCost
        averageCost
      }
    }
    contractorPerformance {
      contractor {
        name
      }
      averageRating
      completionRate
      averageResponseTime
      totalJobs
    }
  }
}
```

## Rate Limits

- **REST API**: 100 requests per 15 minutes (general), 30 requests per 15 minutes (maintenance creation), 50 requests per 15 minutes (AI endpoints)
- **GraphQL API**: Complex query analysis with automatic rate limiting based on query depth and cost

## Webhooks (Future)

The API will support webhooks for real-time notifications:

- Maintenance request created/updated
- Payment received/failed
- Lease expiration alerts
- Contractor assignment notifications

## SDK and Client Libraries

### JavaScript/TypeScript Client
```typescript
import { apiClient, propertyAPI, maintenanceAPI } from '@/lib/api-client'

// REST API usage
const properties = await propertyAPI.getProperties({ page: 1, limit: 10 })
const newRequest = await maintenanceAPI.createRequest({
  title: "Leaky faucet",
  description: "Kitchen sink is leaking",
  priority: "HIGH",
  propertyId: "prop_123"
})
```

### GraphQL Client
```typescript
import { apolloClient } from '@/lib/graphql-client'
import { GET_PROPERTY_DASHBOARD } from '@/lib/graphql/queries'

const { data } = await apolloClient.query({
  query: GET_PROPERTY_DASHBOARD,
  variables: { propertyId: 'prop_123' }
})
```

## Testing

### API Testing
Use the provided test utilities for integration testing:

```typescript
import { testApiEndpoint } from '@/tests/api-helpers'

await testApiEndpoint('/api/properties', {
  method: 'POST',
  body: { name: 'Test Property' },
  expectedStatus: 201
})
```

### GraphQL Testing
```typescript
import { testGraphQLQuery } from '@/tests/graphql-helpers'

await testGraphQLQuery(GET_PROPERTIES_QUERY, {
  variables: { page: 1 },
  expectedFields: ['properties', 'pagination']
})
```

## Changelog

### v1.0.0
- Initial API release
- REST endpoints for properties, maintenance, payments
- GraphQL schema with comprehensive queries
- AI integration for issue categorization
- Real-time notifications via Pusher
- Authentication and authorization
- Rate limiting and error handling

