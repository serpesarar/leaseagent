import { describe, it, expect } from 'vitest'
import { 
  validationSchemas,
  formatValidationErrors,
  propertySchema,
  userRegistrationSchema,
  maintenanceRequestSchema,
  customValidations
} from '@/lib/validations'
import { UserRole, PropertyType, IssueCategory, IssueSeverity } from '@prisma/client'
import { z } from 'zod'

describe('Validation Schemas', () => {
  describe('userRegistrationSchema', () => {
    it('should validate correct user registration data', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        role: UserRole.TENANT,
        phone: '+1-555-123-4567',
        acceptTerms: true
      }

      const result = userRegistrationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject invalid email addresses', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'invalid-email',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        role: UserRole.TENANT,
        acceptTerms: true
      }

      const result = userRegistrationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('valid email')
      }
    })

    it('should reject weak passwords', () => {
      const weakPasswords = [
        'weak',           // Too short
        'password',       // No uppercase or numbers
        'PASSWORD',       // No lowercase or numbers
        '12345678',       // No letters
        'Password'        // No numbers
      ]

      weakPasswords.forEach(password => {
        const invalidData = {
          name: 'John Doe',
          email: 'john@example.com',
          password,
          confirmPassword: password,
          role: UserRole.TENANT,
          acceptTerms: true
        }

        const result = userRegistrationSchema.safeParse(invalidData)
        expect(result.success).toBe(false)
      })
    })

    it('should reject mismatched passwords', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
        confirmPassword: 'DifferentPassword123!',
        role: UserRole.TENANT,
        acceptTerms: true
      }

      const result = userRegistrationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors.some(e => e.message.includes("don't match"))).toBe(true)
      }
    })

    it('should require company name for company owners', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        role: UserRole.COMPANY_OWNER,
        acceptTerms: true
        // Missing companyName
      }

      const result = userRegistrationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors.some(e => e.message.includes('Company name is required'))).toBe(true)
      }
    })

    it('should require terms acceptance', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        role: UserRole.TENANT,
        acceptTerms: false
      }

      const result = userRegistrationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors.some(e => e.message.includes('accept the terms'))).toBe(true)
      }
    })

    it('should validate phone number format', () => {
      const validPhones = [
        '+1-555-123-4567',
        '(555) 123-4567',
        '555.123.4567',
        '+1 555 123 4567',
        '5551234567'
      ]

      validPhones.forEach(phone => {
        const validData = {
          name: 'John Doe',
          email: 'john@example.com',
          password: 'Password123!',
          confirmPassword: 'Password123!',
          role: UserRole.TENANT,
          phone,
          acceptTerms: true
        }

        const result = userRegistrationSchema.safeParse(validData)
        expect(result.success).toBe(true)
      })

      const invalidPhones = ['123', 'abc-def-ghij', '']

      invalidPhones.forEach(phone => {
        const invalidData = {
          name: 'John Doe',
          email: 'john@example.com',
          password: 'Password123!',
          confirmPassword: 'Password123!',
          role: UserRole.TENANT,
          phone,
          acceptTerms: true
        }

        const result = userRegistrationSchema.safeParse(invalidData)
        expect(result.success).toBe(false)
      })
    })
  })

  describe('propertySchema', () => {
    it('should validate correct property data', () => {
      const validData = {
        name: 'Manhattan Heights',
        address: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        type: PropertyType.APARTMENT,
        totalUnits: 50,
        yearBuilt: 2015,
        description: 'Luxury apartment building',
        amenities: ['Gym', 'Pool', 'Parking'],
        images: ['https://example.com/image1.jpg']
      }

      const result = propertySchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject invalid ZIP codes', () => {
      const invalidZipCodes = ['123', '1234567890', 'ABCDE', '12345-67890']

      invalidZipCodes.forEach(zipCode => {
        const invalidData = {
          name: 'Test Property',
          address: '123 Main Street',
          city: 'New York',
          state: 'NY',
          zipCode,
          type: PropertyType.APARTMENT,
          totalUnits: 1
        }

        const result = propertySchema.safeParse(invalidData)
        expect(result.success).toBe(false)
      })
    })

    it('should validate state format', () => {
      const validStates = ['NY', 'CA', 'TX', 'FL']
      const invalidStates = ['New York', 'ny', 'N', 'NYC', '12']

      validStates.forEach(state => {
        const validData = {
          name: 'Test Property',
          address: '123 Main Street',
          city: 'New York',
          state,
          zipCode: '10001',
          type: PropertyType.APARTMENT,
          totalUnits: 1
        }

        const result = propertySchema.safeParse(validData)
        expect(result.success).toBe(true)
      })

      invalidStates.forEach(state => {
        const invalidData = {
          name: 'Test Property',
          address: '123 Main Street',
          city: 'New York',
          state,
          zipCode: '10001',
          type: PropertyType.APARTMENT,
          totalUnits: 1
        }

        const result = propertySchema.safeParse(invalidData)
        expect(result.success).toBe(false)
      })
    })

    it('should validate total units range', () => {
      const invalidUnits = [0, -1, 10001, 1.5]

      invalidUnits.forEach(totalUnits => {
        const invalidData = {
          name: 'Test Property',
          address: '123 Main Street',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          type: PropertyType.APARTMENT,
          totalUnits
        }

        const result = propertySchema.safeParse(invalidData)
        expect(result.success).toBe(false)
      })
    })

    it('should validate year built range', () => {
      const currentYear = new Date().getFullYear()
      
      // Valid years
      const validYears = [1900, 2000, currentYear, currentYear - 1]
      validYears.forEach(yearBuilt => {
        const validData = {
          name: 'Test Property',
          address: '123 Main Street',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          type: PropertyType.APARTMENT,
          totalUnits: 1,
          yearBuilt
        }

        const result = propertySchema.safeParse(validData)
        expect(result.success).toBe(true)
      })

      // Invalid years
      const invalidYears = [1799, currentYear + 1, 1.5]
      invalidYears.forEach(yearBuilt => {
        const invalidData = {
          name: 'Test Property',
          address: '123 Main Street',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          type: PropertyType.APARTMENT,
          totalUnits: 1,
          yearBuilt
        }

        const result = propertySchema.safeParse(invalidData)
        expect(result.success).toBe(false)
      })
    })

    it('should validate image URLs', () => {
      const validImages = [
        'https://example.com/image.jpg',
        'http://example.com/image.png',
        'https://cdn.example.com/path/to/image.gif'
      ]

      const validData = {
        name: 'Test Property',
        address: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        type: PropertyType.APARTMENT,
        totalUnits: 1,
        images: validImages
      }

      const result = propertySchema.safeParse(validData)
      expect(result.success).toBe(true)

      // Invalid images
      const invalidData = {
        ...validData,
        images: ['not-a-url', 'ftp://example.com/image.jpg']
      }

      const invalidResult = propertySchema.safeParse(invalidData)
      expect(invalidResult.success).toBe(false)
    })

    it('should limit amenities count', () => {
      const tooManyAmenities = Array.from({ length: 51 }, (_, i) => `Amenity ${i}`)

      const invalidData = {
        name: 'Test Property',
        address: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        type: PropertyType.APARTMENT,
        totalUnits: 1,
        amenities: tooManyAmenities
      }

      const result = propertySchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('maintenanceRequestSchema', () => {
    it('should validate correct maintenance request data', () => {
      const validData = {
        title: 'Kitchen faucet leaking',
        description: 'The kitchen faucet has been dripping constantly for two days',
        category: IssueCategory.PLUMBING,
        severity: IssueSeverity.MEDIUM,
        location: 'Kitchen',
        propertyId: '123e4567-e89b-12d3-a456-426614174000',
        unitId: '123e4567-e89b-12d3-a456-426614174001',
        preferredTime: 'Weekdays 9-5',
        allowEntry: true,
        contactPhone: '+1-555-123-4567',
        images: ['https://example.com/leak.jpg'],
        enableAI: true
      }

      const result = maintenanceRequestSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should require minimum title length', () => {
      const invalidData = {
        title: 'Ab', // Too short
        description: 'Valid description that is long enough',
        location: 'Kitchen',
        propertyId: '123e4567-e89b-12d3-a456-426614174000'
      }

      const result = maintenanceRequestSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should require minimum description length', () => {
      const invalidData = {
        title: 'Valid title',
        description: 'Too short', // Too short
        location: 'Kitchen',
        propertyId: '123e4567-e89b-12d3-a456-426614174000'
      }

      const result = maintenanceRequestSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should validate UUID format for IDs', () => {
      const invalidUUIDs = [
        'not-a-uuid',
        '123',
        '123e4567-e89b-12d3-a456', // Too short
        '123e4567-e89b-12d3-a456-42661417400x' // Invalid character
      ]

      invalidUUIDs.forEach(propertyId => {
        const invalidData = {
          title: 'Valid title',
          description: 'Valid description that is long enough',
          location: 'Kitchen',
          propertyId
        }

        const result = maintenanceRequestSchema.safeParse(invalidData)
        expect(result.success).toBe(false)
      })
    })

    it('should limit images count', () => {
      const tooManyImages = Array.from({ length: 11 }, (_, i) => `https://example.com/image${i}.jpg`)

      const invalidData = {
        title: 'Valid title',
        description: 'Valid description that is long enough',
        location: 'Kitchen',
        propertyId: '123e4567-e89b-12d3-a456-426614174000',
        images: tooManyImages
      }

      const result = maintenanceRequestSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should set default values correctly', () => {
      const minimalData = {
        title: 'Valid title',
        description: 'Valid description that is long enough',
        location: 'Kitchen',
        propertyId: '123e4567-e89b-12d3-a456-426614174000'
      }

      const result = maintenanceRequestSchema.safeParse(minimalData)
      expect(result.success).toBe(true)
      
      if (result.success) {
        expect(result.data.allowEntry).toBe(true)
        expect(result.data.images).toEqual([])
        expect(result.data.enableAI).toBe(true)
      }
    })
  })

  describe('formatValidationErrors', () => {
    it('should format Zod errors correctly', () => {
      const invalidData = {
        name: '', // Too short
        email: 'invalid-email', // Invalid format
        password: 'weak' // Too short and weak
      }

      const result = userRegistrationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)

      if (!result.success) {
        const formatted = formatValidationErrors(result.error)
        
        expect(formatted).toHaveProperty('name')
        expect(formatted).toHaveProperty('email')
        expect(formatted).toHaveProperty('password')
        expect(typeof formatted.name).toBe('string')
        expect(typeof formatted.email).toBe('string')
        expect(typeof formatted.password).toBe('string')
      }
    })

    it('should handle nested field errors', () => {
      const schema = z.object({
        user: z.object({
          profile: z.object({
            name: z.string().min(1, 'Name is required')
          })
        })
      })

      const result = schema.safeParse({
        user: {
          profile: {
            name: ''
          }
        }
      })

      expect(result.success).toBe(false)

      if (!result.success) {
        const formatted = formatValidationErrors(result.error)
        expect(formatted).toHaveProperty('user.profile.name')
        expect(formatted['user.profile.name']).toBe('Name is required')
      }
    })
  })

  describe('customValidations', () => {
    it('should validate unique email correctly', async () => {
      // Valid email (not taken)
      const validResult = await customValidations.uniqueEmail('new@example.com')
      expect(validResult).toBe(true)

      // Invalid email (taken)
      const invalidResult = await customValidations.uniqueEmail('taken@example.com')
      expect(invalidResult).toBe(false)
    })

    it('should validate address correctly', async () => {
      // Valid address
      const validResult = await customValidations.validateAddress('123 Main Street, New York, NY')
      expect(validResult).toBe(true)

      // Invalid address
      const invalidResult = await customValidations.validateAddress('123 Invalid Street')
      expect(invalidResult).toBe(false)
    })

    it('should validate unique unit number', async () => {
      const result = await customValidations.uniqueUnitNumber('1A', 'property-123')
      expect(result).toBe(true)
    })
  })

  describe('edge cases', () => {
    it('should handle extremely long strings', () => {
      const longString = 'A'.repeat(10000)
      
      const result = propertySchema.safeParse({
        name: longString,
        address: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        type: PropertyType.APARTMENT,
        totalUnits: 1
      })

      expect(result.success).toBe(false)
    })

    it('should handle special characters correctly', () => {
      const specialCharsData = {
        name: 'Property with émojis 🏢',
        address: '123 Main St. & 2nd Ave.',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        type: PropertyType.APARTMENT,
        totalUnits: 1,
        description: 'Description with special chars: àáâãäå & symbols @#$%'
      }

      const result = propertySchema.safeParse(specialCharsData)
      expect(result.success).toBe(true)
    })

    it('should handle null and undefined values', () => {
      const nullData = {
        name: null,
        address: undefined,
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        type: PropertyType.APARTMENT,
        totalUnits: 1
      }

      const result = propertySchema.safeParse(nullData)
      expect(result.success).toBe(false)
    })

    it('should handle array validation edge cases', () => {
      const emptyArrayData = {
        name: 'Test Property',
        address: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        type: PropertyType.APARTMENT,
        totalUnits: 1,
        amenities: [], // Empty array should be valid
        images: [] // Empty array should be valid
      }

      const result = propertySchema.safeParse(emptyArrayData)
      expect(result.success).toBe(true)
    })
  })
})

