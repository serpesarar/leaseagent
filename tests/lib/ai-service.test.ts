import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { AIService, AIAnalysisResult } from '@/lib/ai-service'
import { IssueCategory, IssueSeverity } from '@prisma/client'

// Mock OpenAI
vi.mock('openai', () => ({
  default: vi.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: vi.fn()
      }
    }
  }))
}))

describe('AIService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('analyzeMaintenanceRequest', () => {
    it('should analyze a plumbing issue correctly', async () => {
      const mockOpenAI = await import('openai')
      const mockCreate = vi.fn().mockResolvedValue({
        choices: [{
          message: {
            content: JSON.stringify({
              category: 'PLUMBING',
              severity: 'HIGH',
              urgency: 8,
              estimatedCost: 450,
              estimatedDuration: 3,
              requiredSkills: ['Plumbing', 'Pipe Repair'],
              suggestedContractorType: 'Plumber',
              confidence: 0.89,
              reasoning: 'Water leak requires immediate attention to prevent damage',
              keywords: ['leak', 'water', 'pipe'],
              riskLevel: 'HIGH',
              preventiveMeasures: ['Regular pipe inspection', 'Pressure testing']
            })
          }
        }]
      })

      // @ts-ignore
      mockOpenAI.default.mockImplementation(() => ({
        chat: {
          completions: {
            create: mockCreate
          }
        }
      }))

      const result = await AIService.analyzeMaintenanceRequest(
        'Kitchen faucet leaking',
        'Water dripping constantly from kitchen faucet, pooling under sink',
        'Kitchen',
        []
      )

      expect(result).toBeDefined()
      expect(result.category).toBe(IssueCategory.PLUMBING)
      expect(result.severity).toBe(IssueSeverity.HIGH)
      expect(result.urgency).toBe(8)
      expect(result.estimatedCost).toBe(450)
      expect(result.confidence).toBe(0.89)
      expect(result.riskLevel).toBe('HIGH')
      expect(result.requiredSkills).toContain('Plumbing')
      expect(result.preventiveMeasures).toContain('Regular pipe inspection')

      expect(mockCreate).toHaveBeenCalledWith({
        model: 'gpt-4-turbo-preview',
        messages: expect.arrayContaining([
          expect.objectContaining({
            role: 'system',
            content: expect.stringContaining('You are an expert property maintenance analyst')
          }),
          expect.objectContaining({
            role: 'user',
            content: expect.stringContaining('Kitchen faucet leaking')
          })
        ]),
        temperature: 0.3,
        max_tokens: 1000
      })
    })

    it('should handle OpenAI API errors gracefully', async () => {
      const mockOpenAI = await import('openai')
      const mockCreate = vi.fn().mockRejectedValue(new Error('API Error'))

      // @ts-ignore
      mockOpenAI.default.mockImplementation(() => ({
        chat: {
          completions: {
            create: mockCreate
          }
        }
      }))

      const result = await AIService.analyzeMaintenanceRequest(
        'Test issue',
        'Test description'
      )

      // Should return fallback analysis
      expect(result).toBeDefined()
      expect(result.category).toBe(IssueCategory.GENERAL)
      expect(result.severity).toBe(IssueSeverity.MEDIUM)
      expect(result.confidence).toBe(0.6)
      expect(result.reasoning).toBe('Fallback analysis based on keywords')
    })

    it('should validate and sanitize AI response', async () => {
      const mockOpenAI = await import('openai')
      const mockCreate = vi.fn().mockResolvedValue({
        choices: [{
          message: {
            content: JSON.stringify({
              category: 'INVALID_CATEGORY',
              severity: 'INVALID_SEVERITY',
              urgency: 15, // Should be clamped to 10
              estimatedCost: -100, // Should be set to minimum 0
              estimatedDuration: -1, // Should be set to minimum 0.5
              confidence: 1.5, // Should be clamped to 1
              riskLevel: 'INVALID_RISK'
            })
          }
        }]
      })

      // @ts-ignore
      mockOpenAI.default.mockImplementation(() => ({
        chat: {
          completions: {
            create: mockCreate
          }
        }
      }))

      const result = await AIService.analyzeMaintenanceRequest(
        'Test issue',
        'Test description'
      )

      expect(result.category).toBe(IssueCategory.GENERAL) // Should default to GENERAL
      expect(result.severity).toBe(IssueSeverity.MEDIUM) // Should default to MEDIUM
      expect(result.urgency).toBe(10) // Should be clamped to max 10
      expect(result.estimatedCost).toBe(100) // Should be set to minimum 100
      expect(result.estimatedDuration).toBe(2) // Should be set to minimum 2
      expect(result.confidence).toBe(1) // Should be clamped to max 1
      expect(result.riskLevel).toBe('MEDIUM') // Should default to MEDIUM
    })

    it('should handle empty or invalid JSON response', async () => {
      const mockOpenAI = await import('openai')
      const mockCreate = vi.fn().mockResolvedValue({
        choices: [{
          message: {
            content: 'Invalid JSON response'
          }
        }]
      })

      // @ts-ignore
      mockOpenAI.default.mockImplementation(() => ({
        chat: {
          completions: {
            create: mockCreate
          }
        }
      }))

      const result = await AIService.analyzeMaintenanceRequest(
        'Test issue',
        'Test description'
      )

      // Should return fallback analysis
      expect(result).toBeDefined()
      expect(result.category).toBe(IssueCategory.GENERAL)
      expect(result.confidence).toBe(0.6)
    })

    it('should handle electrical issues correctly with keyword detection', async () => {
      const mockOpenAI = await import('openai')
      vi.fn().mockRejectedValue(new Error('API Error'))

      // @ts-ignore
      mockOpenAI.default.mockImplementation(() => ({
        chat: {
          completions: {
            create: vi.fn().mockRejectedValue(new Error('API Error'))
          }
        }
      }))

      const result = await AIService.analyzeMaintenanceRequest(
        'Light not working',
        'The electrical outlet in the living room is not working'
      )

      // Fallback should detect electrical keywords
      expect(result.category).toBe(IssueCategory.ELECTRICAL)
    })
  })

  describe('generatePredictiveMaintenanceSuggestions', () => {
    it('should generate predictions for a property', async () => {
      const mockOpenAI = await import('openai')
      const mockCreate = vi.fn().mockResolvedValue({
        choices: [{
          message: {
            content: JSON.stringify({
              propertyId: 'property-123',
              predictions: [
                {
                  issueType: 'HVAC filter replacement',
                  probability: 0.8,
                  timeframe: 'next 30 days',
                  preventiveAction: 'Schedule filter replacement',
                  estimatedCost: 50,
                  priority: 3
                }
              ],
              recommendations: ['Implement quarterly HVAC maintenance'],
              seasonalFactors: ['Winter heating system stress']
            })
          }
        }]
      })

      // @ts-ignore
      mockOpenAI.default.mockImplementation(() => ({
        chat: {
          completions: {
            create: mockCreate
          }
        }
      }))

      const historicalData = {
        pastIssues: [
          { title: 'HVAC repair', category: 'HVAC', createdAt: '2024-01-01' }
        ],
        propertyAge: 10,
        lastMaintenanceDate: new Date('2024-01-01')
      }

      const result = await AIService.generatePredictiveMaintenanceSuggestions(
        'property-123',
        historicalData
      )

      expect(result).toBeDefined()
      expect(result.propertyId).toBe('property-123')
      expect(result.predictions).toHaveLength(1)
      expect(result.predictions[0].issueType).toBe('HVAC filter replacement')
      expect(result.predictions[0].probability).toBe(0.8)
      expect(result.recommendations).toContain('Implement quarterly HVAC maintenance')
    })

    it('should return fallback predictions on API error', async () => {
      const mockOpenAI = await import('openai')
      const mockCreate = vi.fn().mockRejectedValue(new Error('API Error'))

      // @ts-ignore
      mockOpenAI.default.mockImplementation(() => ({
        chat: {
          completions: {
            create: mockCreate
          }
        }
      }))

      const historicalData = {
        pastIssues: [],
        propertyAge: 5
      }

      const result = await AIService.generatePredictiveMaintenanceSuggestions(
        'property-123',
        historicalData
      )

      expect(result).toBeDefined()
      expect(result.propertyId).toBe('property-123')
      expect(result.predictions).toHaveLength(2) // Fallback predictions
      expect(result.recommendations).toContain('Implement quarterly HVAC maintenance')
    })
  })

  describe('generateSmartNotification', () => {
    it('should generate contextual notification content', async () => {
      const mockOpenAI = await import('openai')
      const mockCreate = vi.fn().mockResolvedValue({
        choices: [{
          message: {
            content: JSON.stringify({
              title: 'Urgent Maintenance Required',
              message: 'A high-priority plumbing issue has been reported',
              priority: 'HIGH',
              actionItems: ['Assign contractor immediately', 'Contact tenant'],
              estimatedResponseTime: '2 hours',
              escalationPath: ['Property Manager', 'Company Owner']
            })
          }
        }]
      })

      // @ts-ignore
      mockOpenAI.default.mockImplementation(() => ({
        chat: {
          completions: {
            create: mockCreate
          }
        }
      }))

      const context = {
        issueType: 'Plumbing leak',
        severity: IssueSeverity.HIGH,
        tenantInfo: { name: 'John Doe' },
        propertyInfo: { name: 'Test Property' },
        urgency: 8
      }

      const result = await AIService.generateSmartNotification(context)

      expect(result).toBeDefined()
      expect(result.title).toBe('Urgent Maintenance Required')
      expect(result.priority).toBe('HIGH')
      expect(result.actionItems).toContain('Assign contractor immediately')
      expect(result.estimatedResponseTime).toBe('2 hours')
    })

    it('should return fallback notification on error', async () => {
      const mockOpenAI = await import('openai')
      const mockCreate = vi.fn().mockRejectedValue(new Error('API Error'))

      // @ts-ignore
      mockOpenAI.default.mockImplementation(() => ({
        chat: {
          completions: {
            create: mockCreate
          }
        }
      }))

      const context = {
        issueType: 'Test issue',
        severity: IssueSeverity.MEDIUM,
        tenantInfo: { name: 'John Doe' },
        propertyInfo: { name: 'Test Property' }
      }

      const result = await AIService.generateSmartNotification(context)

      expect(result).toBeDefined()
      expect(result.title).toContain('Maintenance Request')
      expect(result.priority).toBe('MEDIUM')
      expect(result.actionItems).toContain('Review request details')
    })
  })

  describe('input validation', () => {
    it('should handle empty title and description', async () => {
      const result = await AIService.analyzeMaintenanceRequest('', '')

      expect(result).toBeDefined()
      expect(result.category).toBe(IssueCategory.GENERAL)
      expect(result.confidence).toBeLessThan(1)
    })

    it('should handle very long descriptions', async () => {
      const longDescription = 'A'.repeat(10000)
      
      const result = await AIService.analyzeMaintenanceRequest(
        'Test title',
        longDescription
      )

      expect(result).toBeDefined()
      expect(result.category).toBeDefined()
    })

    it('should handle special characters in input', async () => {
      const result = await AIService.analyzeMaintenanceRequest(
        'Test with émojis 🚰',
        'Description with special chars: àáâãäå & symbols @#$%'
      )

      expect(result).toBeDefined()
      expect(result.category).toBeDefined()
    })
  })
})

