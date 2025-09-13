import { gql } from 'graphql-tag'

export const typeDefs = gql`
  scalar DateTime
  scalar JSON

  type Query {
    # Properties
    properties(
      page: Int = 1
      limit: Int = 10
      search: String
      type: PropertyType
      city: String
    ): PropertiesResponse!
    
    property(id: ID!): Property
    
    # Property Dashboard - Complex query combining multiple data sources
    propertyDashboard(propertyId: ID!): PropertyDashboard!
    
    # Company Dashboard
    companyDashboard(
      dateRange: DateRangeInput
      propertyIds: [ID!]
    ): CompanyDashboard!
    
    # Maintenance
    maintenanceRequests(
      page: Int = 1
      limit: Int = 10
      status: MaintenanceStatus
      priority: MaintenancePriority
      propertyId: ID
    ): MaintenanceRequestsResponse!
    
    maintenanceRequest(id: ID!): MaintenanceRequest
    
    # Payments
    payments(
      page: Int = 1
      limit: Int = 10
      status: PaymentStatus
      leaseId: ID
      propertyId: ID
      dateRange: DateRangeInput
    ): PaymentsResponse!
    
    # Analytics
    revenueAnalytics(
      dateRange: DateRangeInput!
      groupBy: AnalyticsGroupBy = MONTH
      propertyIds: [ID!]
    ): RevenueAnalytics!
    
    occupancyAnalytics(
      dateRange: DateRangeInput!
      propertyIds: [ID!]
    ): OccupancyAnalytics!
    
    maintenanceAnalytics(
      dateRange: DateRangeInput!
      propertyIds: [ID!]
    ): MaintenanceAnalytics!
  }

  type Mutation {
    # Properties
    createProperty(input: CreatePropertyInput!): Property!
    updateProperty(id: ID!, input: UpdatePropertyInput!): Property!
    deleteProperty(id: ID!): Boolean!
    
    # Maintenance
    createMaintenanceRequest(input: CreateMaintenanceRequestInput!): MaintenanceRequest!
    updateMaintenanceRequest(id: ID!, input: UpdateMaintenanceRequestInput!): MaintenanceRequest!
    assignContractor(id: ID!, contractorId: ID!, scheduledDate: DateTime, notes: String): MaintenanceRequest!
    
    # Payments
    createPayment(input: CreatePaymentInput!): Payment!
    processPayment(paymentId: ID!, paymentMethodId: String!): PaymentResult!
    
    # AI Operations
    categorizeIssue(description: String!, title: String, images: [String!]): IssueAnalysis!
    
    # Bulk Operations
    bulkUpdateMaintenanceStatus(ids: [ID!]!, status: MaintenanceStatus!): BulkUpdateResult!
    bulkAssignContractor(ids: [ID!]!, contractorId: ID!): BulkUpdateResult!
  }

  # Input Types
  input DateRangeInput {
    start: DateTime!
    end: DateTime!
  }

  input CreatePropertyInput {
    name: String!
    address: String!
    city: String!
    state: String!
    zipCode: String!
    type: PropertyType!
    totalUnits: Int!
    yearBuilt: Int
    amenities: [String!]
  }

  input UpdatePropertyInput {
    name: String
    address: String
    city: String
    state: String
    zipCode: String
    type: PropertyType
    totalUnits: Int
    yearBuilt: Int
    amenities: [String!]
  }

  input CreateMaintenanceRequestInput {
    title: String!
    description: String!
    priority: MaintenancePriority!
    category: String
    propertyId: ID!
    unitId: ID
    leaseId: ID
    images: [String!]
    scheduledDate: DateTime
  }

  input UpdateMaintenanceRequestInput {
    title: String
    description: String
    priority: MaintenancePriority
    status: MaintenanceStatus
    category: String
    scheduledDate: DateTime
    completedDate: DateTime
    actualCost: Float
    notes: String
  }

  input CreatePaymentInput {
    leaseId: ID!
    amount: Float!
    type: PaymentType!
    dueDate: DateTime!
    description: String
  }

  # Core Types
  type Property {
    id: ID!
    name: String!
    address: String!
    city: String!
    state: String!
    zipCode: String!
    type: PropertyType!
    totalUnits: Int!
    yearBuilt: Int
    amenities: [String!]!
    createdAt: DateTime!
    updatedAt: DateTime!
    
    # Relations
    units: [Unit!]!
    maintenanceRequests: [MaintenanceRequest!]!
    
    # Computed fields
    occupancyRate: Float!
    monthlyRevenue: Float!
    occupiedUnits: Int!
    availableUnits: Int!
    pendingMaintenanceCount: Int!
  }

  type Unit {
    id: ID!
    unitNumber: String!
    bedrooms: Int!
    bathrooms: Float!
    squareFeet: Int
    rent: Float!
    deposit: Float
    status: UnitStatus!
    amenities: [String!]!
    
    # Relations
    property: Property!
    lease: Lease
    maintenanceRequests: [MaintenanceRequest!]!
    
    # Computed fields
    isOccupied: Boolean!
  }

  type Lease {
    id: ID!
    startDate: DateTime!
    endDate: DateTime!
    monthlyRent: Float!
    securityDeposit: Float!
    status: LeaseStatus!
    terms: JSON
    
    # Relations
    tenant: User!
    unit: Unit!
    payments: [Payment!]!
    
    # Computed fields
    daysRemaining: Int
    isExpiringSoon: Boolean!
  }

  type MaintenanceRequest {
    id: ID!
    title: String!
    description: String!
    priority: MaintenancePriority!
    status: MaintenanceStatus!
    category: String
    aiCategory: IssueCategory
    aiSeverity: IssueSeverity
    estimatedCost: Float
    actualCost: Float
    scheduledDate: DateTime
    completedDate: DateTime
    images: [String!]!
    notes: String
    aiAnalysis: JSON
    createdAt: DateTime!
    updatedAt: DateTime!
    
    # Relations
    property: Property!
    unit: Unit
    lease: Lease
    requester: User!
    assignedContractor: User
    contractor: Contractor
    
    # Computed fields
    isOverdue: Boolean!
    daysOpen: Int!
    statusHistory: [StatusChange!]!
  }

  type Payment {
    id: ID!
    amount: Float!
    type: PaymentType!
    status: PaymentStatus!
    dueDate: DateTime!
    paidDate: DateTime
    description: String
    stripePaymentIntentId: String
    createdAt: DateTime!
    updatedAt: DateTime!
    
    # Relations
    lease: Lease!
    
    # Computed fields
    isOverdue: Boolean!
    daysOverdue: Int
  }

  type User {
    id: ID!
    name: String!
    email: String!
    phone: String
    role: UserRole!
    createdAt: DateTime!
    
    # Relations (role-dependent)
    company: Company
    managedProperties: [Property!]!
    leases: [Lease!]!
    maintenanceRequests: [MaintenanceRequest!]!
  }

  type Contractor {
    id: ID!
    name: String!
    email: String!
    phone: String
    specialties: [IssueCategory!]!
    rating: Float
    totalJobs: Int!
    completedJobs: Int!
    hourlyRate: Float
    isPreferred: Boolean!
    
    # Relations
    maintenanceRequests: [MaintenanceRequest!]!
    
    # Computed fields
    completionRate: Float!
    averageResponseTime: Float
  }

  # Complex Response Types
  type PropertyDashboard {
    property: Property!
    units: [UnitWithDetails!]!
    monthlyRevenue: Float!
    occupancyRate: Float!
    recentMaintenanceRequests: [MaintenanceRequest!]!
    upcomingLeaseExpirations: [Lease!]!
    pendingPayments: [Payment!]!
    maintenanceByCategory: [CategoryCount!]!
    revenueByMonth: [MonthlyRevenue!]!
  }

  type CompanyDashboard {
    totalProperties: Int!
    totalUnits: Int!
    occupiedUnits: Int!
    totalRevenue: Float!
    monthlyRevenue: Float!
    occupancyRate: Float!
    
    # Recent activity
    recentMaintenanceRequests: [MaintenanceRequest!]!
    upcomingLeaseExpirations: [Lease!]!
    overduePayments: [Payment!]!
    
    # Analytics
    revenueByProperty: [PropertyRevenue!]!
    maintenanceByPriority: [PriorityCount!]!
    occupancyTrend: [OccupancyDataPoint!]!
  }

  type UnitWithDetails {
    unit: Unit!
    tenant: User
    leaseStatus: LeaseStatus
    pendingIssues: [MaintenanceRequest!]!
    nextPaymentDue: Payment
  }

  # Analytics Types
  type RevenueAnalytics {
    totalRevenue: Float!
    averageRent: Float!
    revenueByProperty: [PropertyRevenue!]!
    revenueOverTime: [RevenueDataPoint!]!
    growthRate: Float!
  }

  type OccupancyAnalytics {
    currentOccupancyRate: Float!
    averageOccupancyRate: Float!
    occupancyByProperty: [PropertyOccupancy!]!
    occupancyTrend: [OccupancyDataPoint!]!
    turnoverRate: Float!
  }

  type MaintenanceAnalytics {
    totalRequests: Int!
    averageResolutionTime: Float!
    requestsByCategory: [CategoryCount!]!
    requestsByPriority: [PriorityCount!]!
    costAnalysis: MaintenanceCostAnalysis!
    contractorPerformance: [ContractorPerformance!]!
  }

  # Helper Types
  type CategoryCount {
    category: String!
    count: Int!
  }

  type PriorityCount {
    priority: MaintenancePriority!
    count: Int!
  }

  type MonthlyRevenue {
    month: String!
    revenue: Float!
  }

  type PropertyRevenue {
    property: Property!
    revenue: Float!
  }

  type RevenueDataPoint {
    date: DateTime!
    revenue: Float!
  }

  type OccupancyDataPoint {
    date: DateTime!
    occupancyRate: Float!
  }

  type PropertyOccupancy {
    property: Property!
    occupancyRate: Float!
  }

  type MaintenanceCostAnalysis {
    totalCost: Float!
    averageCost: Float!
    costByCategory: [CategoryCost!]!
  }

  type CategoryCost {
    category: String!
    totalCost: Float!
    averageCost: Float!
  }

  type ContractorPerformance {
    contractor: Contractor!
    averageRating: Float!
    completionRate: Float!
    averageResponseTime: Float!
    totalJobs: Int!
  }

  type StatusChange {
    status: MaintenanceStatus!
    changedAt: DateTime!
    changedBy: User!
  }

  type IssueAnalysis {
    category: IssueCategory!
    severity: IssueSeverity!
    estimatedCost: Float!
    suggestedContractor: Contractor
    confidence: Float!
    keywords: [String!]!
    recommendations: [String!]!
  }

  type PaymentResult {
    success: Boolean!
    payment: Payment
    error: String
    stripePaymentIntentId: String
  }

  type BulkUpdateResult {
    success: Boolean!
    updatedCount: Int!
    errors: [String!]!
  }

  # Response wrapper types
  type PropertiesResponse {
    properties: [Property!]!
    pagination: PaginationInfo!
  }

  type MaintenanceRequestsResponse {
    requests: [MaintenanceRequest!]!
    pagination: PaginationInfo!
  }

  type PaymentsResponse {
    payments: [Payment!]!
    pagination: PaginationInfo!
  }

  type PaginationInfo {
    page: Int!
    limit: Int!
    total: Int!
    pages: Int!
  }

  # Enums
  enum PropertyType {
    APARTMENT
    HOUSE
    CONDO
    COMMERCIAL
  }

  enum UnitStatus {
    AVAILABLE
    OCCUPIED
    MAINTENANCE
    UNAVAILABLE
  }

  enum LeaseStatus {
    ACTIVE
    EXPIRED
    TERMINATED
    PENDING
  }

  enum MaintenancePriority {
    LOW
    MEDIUM
    HIGH
    URGENT
  }

  enum MaintenanceStatus {
    PENDING
    IN_PROGRESS
    COMPLETED
    CANCELLED
  }

  enum PaymentType {
    RENT
    SECURITY_DEPOSIT
    LATE_FEE
    MAINTENANCE
    OTHER
  }

  enum PaymentStatus {
    PENDING
    PAID
    OVERDUE
    FAILED
    REFUNDED
  }

  enum UserRole {
    SUPER_ADMIN
    COMPANY_OWNER
    PROPERTY_MANAGER
    TENANT
    CONTRACTOR
    ACCOUNTANT
  }

  enum IssueCategory {
    PLUMBING
    ELECTRICAL
    APPLIANCE
    HVAC
    GENERAL
  }

  enum IssueSeverity {
    LOW
    MEDIUM
    HIGH
    URGENT
  }

  enum AnalyticsGroupBy {
    DAY
    WEEK
    MONTH
    QUARTER
    YEAR
  }
`

