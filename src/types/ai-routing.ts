import { IssueCategory, IssueSeverity, MaintenanceRequest, Contractor, WorkflowRule } from '@prisma/client'

// Core interface as requested in the user query
export interface IssueRoutingSystem {
  // AI analyzes issue description
  analyzeIssue(description: string): Promise<{
    category: 'PLUMBING' | 'ELECTRICAL' | 'APPLIANCE' | 'PAYMENT' | 'GENERAL'
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
    estimatedCost: number
    suggestedContractor: Contractor
  }>
  
  // Route based on company's predefined rules
  routeToContractor(issue: MaintenanceRequest, rules: WorkflowRule[]): Promise<void>
}

// Extended interfaces for our implementation
export interface AIAnalysisResult {
  category: IssueCategory
  severity: IssueSeverity
  estimatedCost: number
  suggestedContractor: Contractor | null
  confidence: number
  reasoning: string
  urgencyFactors?: string[]
  skillsRequired?: string[]
  estimatedDuration?: string
}

export interface ContractorRoutingResult {
  contractor: Contractor | null
  reasoning: string
  confidence: number
  alternativeContractors?: Contractor[]
}

export interface WorkflowRuleConditions {
  category?: IssueCategory | IssueCategory[]
  severity?: IssueSeverity | IssueSeverity[]
  estimatedCostMin?: number
  estimatedCostMax?: number
  propertyType?: string
  timeOfDay?: 'business_hours' | 'after_hours' | 'weekend'
  tenantType?: 'premium' | 'standard'
}

export interface WorkflowRuleActions {
  assignContractor?: boolean
  contractorId?: string
  sendNotification?: boolean
  sendEmail?: boolean
  escalateIssue?: boolean
  createPaymentRequest?: boolean
  updateStatus?: string
  notificationTemplate?: string
  emailTemplate?: string
  escalationDelayMinutes?: number
}

export interface NotificationData {
  maintenanceRequestId?: string
  contractorId?: string
  propertyId?: string
  tenantId?: string
  amount?: number
  dueDate?: string
  routing?: string
  [key: string]: any
}

// Enhanced maintenance request with relations
export interface MaintenanceRequestWithRelations extends MaintenanceRequest {
  property: {
    id: string
    name: string
    type: string
    address: string
  }
  requester: {
    id: string
    name: string
    email: string
    role: string
  }
  assignedContractor?: Contractor
  contractor?: Contractor
  lease?: {
    id: string
    tenant: {
      id: string
      name: string
      email: string
    }
  }
}

// Contractor scoring system
export interface ContractorScore {
  contractor: Contractor
  score: number
  factors: {
    specialtyMatch: number
    rating: number
    availability: number
    experience: number
    preferred: number
    workload: number
  }
}

// AI routing configuration
export interface AIRoutingConfig {
  openaiModel: string
  maxTokens: number
  temperature: number
  fallbackAnalysis: boolean
  confidenceThreshold: number
  maxContractorsToConsider: number
  scoringWeights: {
    specialtyMatch: number
    rating: number
    availability: number
    experience: number
    preferred: number
    workload: number
  }
}

// Workflow trigger events
export type WorkflowTriggerEvent = 
  | 'MAINTENANCE_REQUEST_CREATED'
  | 'PAYMENT_OVERDUE'
  | 'LEASE_EXPIRING'
  | 'CONTRACTOR_ASSIGNED'
  | 'ISSUE_ESCALATED'
  | 'WORK_COMPLETED'
  | 'TENANT_COMPLAINT'

// Notification types for the system
export type NotificationEvent = 
  | 'MAINTENANCE_REQUEST'
  | 'PAYMENT_REMINDER'
  | 'LEASE_EXPIRING'
  | 'CONTRACTOR_ASSIGNED'
  | 'WORK_COMPLETED'
  | 'SYSTEM_ALERT'
  | 'URGENT_ISSUE'
  | 'ESCALATION_REQUIRED'

// API response types
export interface CreateMaintenanceRequestResponse {
  success: boolean
  maintenanceRequest: MaintenanceRequestWithRelations
  aiAnalysis: AIAnalysisResult
  routing: ContractorRoutingResult
}

export interface AnalyzeIssueResponse {
  success: boolean
  analysis: AIAnalysisResult
}

export interface GetContractorsResponse {
  contractors: Contractor[]
}

export interface WorkflowRuleResponse {
  success: boolean
  workflowRule: WorkflowRule & {
    contractor?: Contractor
  }
}

// Error types
export interface AIRoutingError {
  code: 'AI_ANALYSIS_FAILED' | 'NO_CONTRACTORS_AVAILABLE' | 'WORKFLOW_RULE_ERROR' | 'NOTIFICATION_FAILED'
  message: string
  details?: any
}

// Utility types for form handling
export interface CreateMaintenanceRequestForm {
  title: string
  description: string
  propertyId: string
  leaseId?: string
  images?: File[]
  priority?: IssueSeverity
  category?: IssueCategory
}

export interface CreateContractorForm {
  name: string
  email: string
  phone?: string
  address?: string
  website?: string
  description?: string
  specialties: IssueCategory[]
  hourlyRate?: number
  licenseNumber?: string
  insuranceInfo?: {
    provider: string
    policyNumber: string
    expiryDate: string
  }
  availability?: {
    immediate: boolean
    next24h: boolean
    weekends: boolean
    businessHours: string
  }
}

export interface CreateWorkflowRuleForm {
  name: string
  description?: string
  trigger: WorkflowTriggerEvent
  conditions: WorkflowRuleConditions
  actions: WorkflowRuleActions
  priority: number
  contractorId?: string
}

