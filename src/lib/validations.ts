import { z } from 'zod'
import { 
  UserRole, 
  PropertyType, 
  UnitStatus, 
  LeaseStatus,
  MaintenanceStatus,
  IssueSeverity,
  IssueCategory,
  PaymentStatus,
  PaymentMethod,
  ContractorStatus
} from '@prisma/client'

// Base validation schemas
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address')
  .max(255, 'Email must be less than 255 characters')

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be less than 128 characters')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number')

export const phoneSchema = z
  .string()
  .optional()
  .refine((val) => !val || /^\+?[\d\s\-\(\)]{10,}$/.test(val), {
    message: 'Please enter a valid phone number'
  })

export const urlSchema = z
  .string()
  .optional()
  .refine((val) => !val || z.string().url().safeParse(val).success, {
    message: 'Please enter a valid URL'
  })

// User validation schemas
export const userRegistrationSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s\-'\.]+$/, 'Name can only contain letters, spaces, hyphens, apostrophes, and periods'),
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  role: z.nativeEnum(UserRole, {
    errorMap: () => ({ message: 'Please select a valid role' })
  }),
  companyName: z
    .string()
    .min(2, 'Company name must be at least 2 characters')
    .max(100, 'Company name must be less than 100 characters')
    .optional(),
  phone: phoneSchema,
  acceptTerms: z
    .boolean()
    .refine((val) => val === true, {
      message: 'You must accept the terms and conditions'
    })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
}).refine((data) => {
  // Require company name for company owners
  if (data.role === UserRole.COMPANY_OWNER && !data.companyName) {
    return false
  }
  return true
}, {
  message: 'Company name is required for company owners',
  path: ['companyName']
})

export const userLoginSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(1, 'Password is required'),
  rememberMe: z.boolean().optional()
})

export const userProfileSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: emailSchema,
  phone: phoneSchema,
  avatar: z.string().optional(),
  bio: z
    .string()
    .max(500, 'Bio must be less than 500 characters')
    .optional(),
  timezone: z
    .string()
    .optional(),
  notifications: z.object({
    email: z.boolean(),
    push: z.boolean(),
    sms: z.boolean()
  }).optional()
})

// Property validation schemas
export const propertySchema = z.object({
  name: z
    .string()
    .min(2, 'Property name must be at least 2 characters')
    .max(100, 'Property name must be less than 100 characters'),
  address: z
    .string()
    .min(5, 'Address must be at least 5 characters')
    .max(255, 'Address must be less than 255 characters'),
  city: z
    .string()
    .min(2, 'City must be at least 2 characters')
    .max(100, 'City must be less than 100 characters'),
  state: z
    .string()
    .length(2, 'State must be 2 characters (e.g., NY)')
    .regex(/^[A-Z]{2}$/, 'State must be uppercase letters'),
  zipCode: z
    .string()
    .min(5, 'ZIP code must be at least 5 characters')
    .max(10, 'ZIP code must be less than 10 characters')
    .regex(/^\d{5}(-\d{4})?$/, 'Please enter a valid ZIP code'),
  type: z.nativeEnum(PropertyType, {
    errorMap: () => ({ message: 'Please select a valid property type' })
  }),
  totalUnits: z
    .number()
    .int('Total units must be a whole number')
    .min(1, 'Must have at least 1 unit')
    .max(10000, 'Cannot exceed 10,000 units'),
  yearBuilt: z
    .number()
    .int('Year built must be a whole number')
    .min(1800, 'Year built cannot be before 1800')
    .max(new Date().getFullYear(), 'Year built cannot be in the future')
    .optional(),
  description: z
    .string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional(),
  amenities: z
    .array(z.string().min(1, 'Amenity name cannot be empty'))
    .max(50, 'Cannot have more than 50 amenities')
    .default([]),
  images: z
    .array(z.string().url('Each image must be a valid URL'))
    .max(20, 'Cannot have more than 20 images')
    .default([])
})

// Unit validation schemas
export const unitSchema = z.object({
  unitNumber: z
    .string()
    .min(1, 'Unit number is required')
    .max(20, 'Unit number must be less than 20 characters')
    .regex(/^[A-Za-z0-9\-#]+$/, 'Unit number can only contain letters, numbers, hyphens, and #'),
  bedrooms: z
    .number()
    .int('Bedrooms must be a whole number')
    .min(0, 'Bedrooms cannot be negative')
    .max(20, 'Cannot exceed 20 bedrooms'),
  bathrooms: z
    .number()
    .min(0, 'Bathrooms cannot be negative')
    .max(20, 'Cannot exceed 20 bathrooms'),
  squareFeet: z
    .number()
    .int('Square feet must be a whole number')
    .min(1, 'Square feet must be at least 1')
    .max(50000, 'Cannot exceed 50,000 square feet')
    .optional(),
  rent: z
    .number()
    .min(0, 'Rent cannot be negative')
    .max(100000, 'Rent cannot exceed $100,000'),
  deposit: z
    .number()
    .min(0, 'Deposit cannot be negative')
    .max(100000, 'Deposit cannot exceed $100,000')
    .optional(),
  status: z.nativeEnum(UnitStatus, {
    errorMap: () => ({ message: 'Please select a valid unit status' })
  }),
  propertyId: z.string().uuid('Invalid property ID'),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  images: z
    .array(z.string().url('Each image must be a valid URL'))
    .max(10, 'Cannot have more than 10 images')
    .default([])
})

// Maintenance request validation schemas
export const maintenanceRequestSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description must be less than 2000 characters'),
  category: z.nativeEnum(IssueCategory, {
    errorMap: () => ({ message: 'Please select a valid category' })
  }).optional(),
  severity: z.nativeEnum(IssueSeverity, {
    errorMap: () => ({ message: 'Please select a valid severity level' })
  }).optional(),
  location: z
    .string()
    .min(2, 'Location must be at least 2 characters')
    .max(100, 'Location must be less than 100 characters'),
  propertyId: z.string().uuid('Invalid property ID'),
  unitId: z.string().uuid('Invalid unit ID').optional(),
  preferredTime: z
    .string()
    .max(100, 'Preferred time must be less than 100 characters')
    .optional(),
  allowEntry: z.boolean().default(true),
  contactPhone: phoneSchema,
  images: z
    .array(z.string().url('Each image must be a valid URL'))
    .max(10, 'Cannot have more than 10 images')
    .default([]),
  enableAI: z.boolean().default(true)
})

// Lease validation schemas
export const leaseSchema = z.object({
  propertyId: z.string().uuid('Invalid property ID'),
  unitId: z.string().uuid('Invalid unit ID'),
  tenantId: z.string().uuid('Invalid tenant ID'),
  startDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Please enter a valid start date'
    }),
  endDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Please enter a valid end date'
    }),
  monthlyRent: z
    .number()
    .min(0, 'Monthly rent cannot be negative')
    .max(100000, 'Monthly rent cannot exceed $100,000'),
  securityDeposit: z
    .number()
    .min(0, 'Security deposit cannot be negative')
    .max(100000, 'Security deposit cannot exceed $100,000'),
  status: z.nativeEnum(LeaseStatus, {
    errorMap: () => ({ message: 'Please select a valid lease status' })
  }),
  terms: z
    .string()
    .max(5000, 'Terms must be less than 5000 characters')
    .optional(),
  notes: z
    .string()
    .max(1000, 'Notes must be less than 1000 characters')
    .optional()
}).refine((data) => {
  const startDate = new Date(data.startDate)
  const endDate = new Date(data.endDate)
  return endDate > startDate
}, {
  message: 'End date must be after start date',
  path: ['endDate']
})

// Payment validation schemas
export const paymentSchema = z.object({
  leaseId: z.string().uuid('Invalid lease ID'),
  amount: z
    .number()
    .min(0.01, 'Payment amount must be greater than $0')
    .max(100000, 'Payment amount cannot exceed $100,000'),
  dueDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Please enter a valid due date'
    }),
  method: z.nativeEnum(PaymentMethod, {
    errorMap: () => ({ message: 'Please select a valid payment method' })
  }).optional(),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(200, 'Description must be less than 200 characters'),
  notes: z
    .string()
    .max(500, 'Notes must be less than 500 characters')
    .optional()
})

// Contractor validation schemas
export const contractorSchema = z.object({
  name: z
    .string()
    .min(2, 'Contractor name must be at least 2 characters')
    .max(100, 'Contractor name must be less than 100 characters'),
  email: emailSchema,
  phone: z
    .string()
    .min(10, 'Phone number is required')
    .regex(/^\+?[\d\s\-\(\)]{10,}$/, 'Please enter a valid phone number'),
  specialties: z
    .array(z.nativeEnum(IssueCategory))
    .min(1, 'Must select at least one specialty')
    .max(10, 'Cannot have more than 10 specialties'),
  hourlyRate: z
    .number()
    .min(0, 'Hourly rate cannot be negative')
    .max(1000, 'Hourly rate cannot exceed $1000')
    .optional(),
  status: z.nativeEnum(ContractorStatus, {
    errorMap: () => ({ message: 'Please select a valid status' })
  }),
  description: z
    .string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional(),
  website: urlSchema,
  licenseNumber: z
    .string()
    .max(50, 'License number must be less than 50 characters')
    .optional(),
  insuranceExpiry: z
    .string()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: 'Please enter a valid insurance expiry date'
    })
    .optional(),
  maxConcurrentJobs: z
    .number()
    .int('Max concurrent jobs must be a whole number')
    .min(1, 'Must be able to handle at least 1 job')
    .max(100, 'Cannot exceed 100 concurrent jobs')
    .default(5)
})

// Company validation schemas
export const companySchema = z.object({
  name: z
    .string()
    .min(2, 'Company name must be at least 2 characters')
    .max(100, 'Company name must be less than 100 characters'),
  email: emailSchema,
  phone: phoneSchema,
  address: z
    .string()
    .min(5, 'Address must be at least 5 characters')
    .max(255, 'Address must be less than 255 characters')
    .optional(),
  website: urlSchema,
  description: z
    .string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional(),
  logo: z
    .string()
    .url('Logo must be a valid URL')
    .optional(),
  settings: z.object({
    timezone: z.string().optional(),
    currency: z.string().default('USD'),
    dateFormat: z.string().default('MM/DD/YYYY'),
    businessHours: z.object({
      start: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format (HH:MM)').default('09:00'),
      end: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format (HH:MM)').default('17:00'),
      days: z.array(z.number().min(0).max(6)).default([1, 2, 3, 4, 5]) // Monday-Friday
    }).optional()
  }).optional()
})

// Search and filter schemas
export const propertySearchSchema = z.object({
  search: z.string().optional(),
  type: z.nativeEnum(PropertyType).optional(),
  city: z.string().optional(),
  minUnits: z.number().int().min(0).optional(),
  maxUnits: z.number().int().min(0).optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  sortBy: z.enum(['name', 'createdAt', 'totalUnits', 'occupancyRate']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
})

export const maintenanceSearchSchema = z.object({
  search: z.string().optional(),
  status: z.nativeEnum(MaintenanceStatus).optional(),
  category: z.nativeEnum(IssueCategory).optional(),
  severity: z.nativeEnum(IssueSeverity).optional(),
  propertyId: z.string().uuid().optional(),
  contractorId: z.string().uuid().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  sortBy: z.enum(['createdAt', 'updatedAt', 'priority', 'estimatedCost']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
})

// Form-specific validation helpers
export const createFormValidation = <T extends z.ZodType>(schema: T) => ({
  schema,
  defaultValues: {} as Partial<z.infer<T>>,
  mode: 'onChange' as const,
  reValidateMode: 'onChange' as const
})

// Validation error formatter
export const formatValidationErrors = (errors: z.ZodError) => {
  return errors.errors.reduce((acc, error) => {
    const path = error.path.join('.')
    acc[path] = error.message
    return acc
  }, {} as Record<string, string>)
}

// Custom validation rules
export const customValidations = {
  // Check if email is already in use
  uniqueEmail: async (email: string, excludeId?: string) => {
    // This would typically make an API call
    // For now, return a mock validation
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        // Mock: emails ending with 'taken@' are considered taken
        resolve(!email.includes('taken@'))
      }, 500)
    })
  },

  // Validate property address
  validateAddress: async (address: string) => {
    // This would typically use a geocoding service
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        // Mock: addresses containing 'invalid' are invalid
        resolve(!address.toLowerCase().includes('invalid'))
      }, 300)
    })
  },

  // Check unit number uniqueness within property
  uniqueUnitNumber: async (unitNumber: string, propertyId: string, excludeId?: string) => {
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        // Mock validation
        resolve(true)
      }, 200)
    })
  }
}

// Export all schemas for use in forms
export const validationSchemas = {
  user: {
    registration: userRegistrationSchema,
    login: userLoginSchema,
    profile: userProfileSchema
  },
  property: propertySchema,
  unit: unitSchema,
  maintenance: maintenanceRequestSchema,
  lease: leaseSchema,
  payment: paymentSchema,
  contractor: contractorSchema,
  company: companySchema,
  search: {
    properties: propertySearchSchema,
    maintenance: maintenanceSearchSchema
  }
}

// Type exports for TypeScript
export type UserRegistrationData = z.infer<typeof userRegistrationSchema>
export type UserLoginData = z.infer<typeof userLoginSchema>
export type UserProfileData = z.infer<typeof userProfileSchema>
export type PropertyData = z.infer<typeof propertySchema>
export type UnitData = z.infer<typeof unitSchema>
export type MaintenanceRequestData = z.infer<typeof maintenanceRequestSchema>
export type LeaseData = z.infer<typeof leaseSchema>
export type PaymentData = z.infer<typeof paymentSchema>
export type ContractorData = z.infer<typeof contractorSchema>
export type CompanyData = z.infer<typeof companySchema>
export type PropertySearchData = z.infer<typeof propertySearchSchema>
export type MaintenanceSearchData = z.infer<typeof maintenanceSearchSchema>

