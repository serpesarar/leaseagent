import { NextRequest, NextResponse } from 'next/server'
import { 
  withAuth, 
  withValidation, 
  withErrorHandling, 
  withRateLimit,
  withMiddleware,
  schemas,
  createApiResponse,
  APIError
} from '@/lib/api-middleware'
import { UserRole } from '@prisma/client'
import { analyzeIssue } from '@/lib/ai-routing'

// POST /api/ai/categorize - Categorize maintenance issue using AI
async function categorizeIssue(request: NextRequest, validatedData: any, session: any) {
  const { description, title, images } = validatedData

  try {
    // Use the existing AI routing system
    const analysis = await analyzeIssue(description)
    
    // Enhanced analysis with additional context
    const enhancedAnalysis = {
      ...analysis,
      confidence: calculateConfidence(description, analysis),
      keywords: extractKeywords(description),
      urgencyFactors: analyzeUrgencyFactors(description),
      seasonalFactors: analyzeSeasonalFactors(description),
      recommendations: generateRecommendations(analysis, description)
    }

    return NextResponse.json(createApiResponse(enhancedAnalysis, 'Issue categorized successfully'))
  } catch (error) {
    console.error('AI categorization error:', error)
    throw new APIError(
      'Failed to categorize issue', 
      500, 
      'AI_CATEGORIZATION_ERROR',
      { originalError: error instanceof Error ? error.message : 'Unknown error' }
    )
  }
}

// Helper functions for enhanced analysis
function calculateConfidence(description: string, analysis: any): number {
  let confidence = 0.7 // Base confidence

  // Increase confidence based on specific keywords
  const categoryKeywords = {
    PLUMBING: ['leak', 'pipe', 'water', 'drain', 'toilet', 'sink', 'faucet', 'shower'],
    ELECTRICAL: ['light', 'outlet', 'power', 'electric', 'breaker', 'wire', 'switch'],
    APPLIANCE: ['refrigerator', 'stove', 'dishwasher', 'washer', 'dryer', 'microwave'],
    HVAC: ['heat', 'air', 'temperature', 'thermostat', 'furnace', 'ac', 'ventilation'],
    GENERAL: []
  }

  const keywords = categoryKeywords[analysis.category as keyof typeof categoryKeywords] || []
  const descriptionLower = description.toLowerCase()
  const matchedKeywords = keywords.filter(keyword => descriptionLower.includes(keyword))
  
  confidence += Math.min(matchedKeywords.length * 0.1, 0.3)

  // Adjust based on description length and detail
  if (description.length > 100) confidence += 0.1
  if (description.length > 200) confidence += 0.1

  return Math.min(confidence, 1.0)
}

function extractKeywords(description: string): string[] {
  const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'need', 'needs', 'not', 'no', 'yes']
  
  const words = description.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2 && !commonWords.includes(word))

  // Count word frequency
  const wordCount = words.reduce((acc, word) => {
    acc[word] = (acc[word] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Return top 5 most frequent words
  return Object.entries(wordCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([word]) => word)
}

function analyzeUrgencyFactors(description: string): string[] {
  const urgencyKeywords = {
    'Water damage': ['flooding', 'water everywhere', 'leak spreading', 'ceiling dripping'],
    'Safety hazard': ['dangerous', 'unsafe', 'hazard', 'risk', 'emergency'],
    'No heat/AC': ['no heat', 'no air', 'freezing', 'too hot', 'temperature'],
    'Electrical issue': ['sparks', 'burning smell', 'no power', 'electrical'],
    'Security concern': ['lock broken', 'door won\'t close', 'window broken', 'security']
  }

  const descriptionLower = description.toLowerCase()
  const factors: string[] = []

  Object.entries(urgencyKeywords).forEach(([factor, keywords]) => {
    if (keywords.some(keyword => descriptionLower.includes(keyword))) {
      factors.push(factor)
    }
  })

  return factors
}

function analyzeSeasonalFactors(description: string): string[] {
  const month = new Date().getMonth() + 1 // 1-12
  const season = month >= 3 && month <= 5 ? 'spring' :
                month >= 6 && month <= 8 ? 'summer' :
                month >= 9 && month <= 11 ? 'fall' : 'winter'

  const seasonalKeywords = {
    winter: ['heat', 'heating', 'cold', 'freezing', 'ice', 'snow'],
    summer: ['air conditioning', 'ac', 'cooling', 'hot', 'overheating'],
    spring: ['leak', 'water', 'moisture', 'mold'],
    fall: ['leaves', 'gutter', 'drainage', 'preparation']
  }

  const descriptionLower = description.toLowerCase()
  const factors: string[] = []

  const currentSeasonKeywords = seasonalKeywords[season]
  if (currentSeasonKeywords.some(keyword => descriptionLower.includes(keyword))) {
    factors.push(`Seasonal relevance: ${season}`)
  }

  return factors
}

function generateRecommendations(analysis: any, description: string): string[] {
  const recommendations: string[] = []

  // Priority-based recommendations
  switch (analysis.severity) {
    case 'URGENT':
      recommendations.push('Schedule emergency repair within 24 hours')
      recommendations.push('Contact tenant to ensure safety')
      break
    case 'HIGH':
      recommendations.push('Schedule repair within 2-3 business days')
      recommendations.push('Monitor for escalation')
      break
    case 'MEDIUM':
      recommendations.push('Schedule repair within 1 week')
      break
    case 'LOW':
      recommendations.push('Schedule during next routine maintenance')
      break
  }

  // Category-specific recommendations
  switch (analysis.category) {
    case 'PLUMBING':
      recommendations.push('Check for water damage in surrounding areas')
      if (description.toLowerCase().includes('leak')) {
        recommendations.push('Turn off water supply if leak is severe')
      }
      break
    case 'ELECTRICAL':
      recommendations.push('Ensure electrical safety - turn off breaker if necessary')
      recommendations.push('Use only licensed electrician')
      break
    case 'APPLIANCE':
      recommendations.push('Check warranty status before repair')
      recommendations.push('Consider replacement if repair cost > 50% of replacement')
      break
  }

  // Cost-based recommendations
  if (analysis.estimatedCost > 1000) {
    recommendations.push('Get multiple quotes for expensive repairs')
    recommendations.push('Consider insurance claim if applicable')
  }

  return recommendations
}

const postHandler = withMiddleware(
  withAuth(
    withValidation(schemas.categorizeIssue, categorizeIssue),
    [UserRole.COMPANY_OWNER, UserRole.PROPERTY_MANAGER, UserRole.TENANT]
  ),
  [withErrorHandling, withRateLimit(50)] // Lower rate limit for AI endpoints
)

export { postHandler as POST }

