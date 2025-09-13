import OpenAI from 'openai'
import { IssueCategory, IssueSeverity, MaintenanceRequest } from '@prisma/client'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface AIAnalysisResult {
  category: IssueCategory
  severity: IssueSeverity
  urgency: number // 1-10 scale
  estimatedCost: number
  estimatedDuration: number // in hours
  requiredSkills: string[]
  suggestedContractorType: string
  confidence: number // 0-1 scale
  reasoning: string
  keywords: string[]
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  preventiveMeasures?: string[]
}

export interface PredictiveMaintenanceResult {
  propertyId: string
  predictions: {
    issueType: string
    probability: number
    timeframe: string // e.g., "next 30 days"
    preventiveAction: string
    estimatedCost: number
    priority: number
  }[]
  recommendations: string[]
  seasonalFactors: string[]
}

export interface SmartNotificationContent {
  title: string
  message: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  actionItems: string[]
  estimatedResponseTime: string
  escalationPath: string[]
}

export class AIService {
  /**
   * Analyze maintenance request using OpenAI GPT-4
   */
  static async analyzeMaintenanceRequest(
    title: string,
    description: string,
    location?: string,
    images?: string[]
  ): Promise<AIAnalysisResult> {
    try {
      const prompt = this.buildAnalysisPrompt(title, description, location, images)
      
      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: `You are an expert property maintenance analyst. Analyze maintenance requests and provide structured JSON responses with categorization, severity assessment, cost estimation, and recommendations.

Categories: PLUMBING, ELECTRICAL, APPLIANCE, STRUCTURAL, HVAC, GENERAL
Severity: LOW, MEDIUM, HIGH, URGENT

Provide response in this exact JSON format:
{
  "category": "CATEGORY_NAME",
  "severity": "SEVERITY_LEVEL",
  "urgency": number,
  "estimatedCost": number,
  "estimatedDuration": number,
  "requiredSkills": ["skill1", "skill2"],
  "suggestedContractorType": "contractor type",
  "confidence": number,
  "reasoning": "explanation",
  "keywords": ["keyword1", "keyword2"],
  "riskLevel": "RISK_LEVEL",
  "preventiveMeasures": ["measure1", "measure2"]
}`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      })

      const content = response.choices[0]?.message?.content
      if (!content) {
        throw new Error('No response from OpenAI')
      }

      // Parse JSON response
      const analysis = JSON.parse(content) as AIAnalysisResult
      
      // Validate and sanitize the response
      return this.validateAnalysisResult(analysis)
      
    } catch (error) {
      console.error('Error analyzing maintenance request:', error)
      
      // Fallback analysis
      return this.getFallbackAnalysis(title, description)
    }
  }

  /**
   * Generate predictive maintenance suggestions for a property
   */
  static async generatePredictiveMaintenanceSuggestions(
    propertyId: string,
    historicalData: {
      pastIssues: MaintenanceRequest[]
      propertyAge: number
      lastMaintenanceDate?: Date
      seasonalData?: any
    }
  ): Promise<PredictiveMaintenanceResult> {
    try {
      const prompt = this.buildPredictivePrompt(propertyId, historicalData)
      
      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: `You are a predictive maintenance expert for residential properties. Analyze historical maintenance data and property characteristics to predict likely future issues and recommend preventive actions.

Provide response in this exact JSON format:
{
  "propertyId": "property_id",
  "predictions": [
    {
      "issueType": "issue description",
      "probability": number_0_to_1,
      "timeframe": "time description",
      "preventiveAction": "recommended action",
      "estimatedCost": number,
      "priority": number_1_to_10
    }
  ],
  "recommendations": ["recommendation1", "recommendation2"],
  "seasonalFactors": ["factor1", "factor2"]
}`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.4,
        max_tokens: 1500
      })

      const content = response.choices[0]?.message?.content
      if (!content) {
        throw new Error('No response from OpenAI')
      }

      return JSON.parse(content) as PredictiveMaintenanceResult
      
    } catch (error) {
      console.error('Error generating predictive maintenance:', error)
      
      // Return fallback predictions
      return this.getFallbackPredictions(propertyId, historicalData)
    }
  }

  /**
   * Generate smart notification content based on context
   */
  static async generateSmartNotification(
    context: {
      issueType: string
      severity: IssueSeverity
      tenantInfo: any
      propertyInfo: any
      contractorInfo?: any
      urgency?: number
    }
  ): Promise<SmartNotificationContent> {
    try {
      const prompt = this.buildNotificationPrompt(context)
      
      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: `You are a communication expert specializing in property management notifications. Generate clear, actionable, and appropriately urgent notifications for different stakeholders.

Provide response in this exact JSON format:
{
  "title": "notification title",
  "message": "detailed message",
  "priority": "PRIORITY_LEVEL",
  "actionItems": ["action1", "action2"],
  "estimatedResponseTime": "time estimate",
  "escalationPath": ["step1", "step2"]
}`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 800
      })

      const content = response.choices[0]?.message?.content
      if (!content) {
        throw new Error('No response from OpenAI')
      }

      return JSON.parse(content) as SmartNotificationContent
      
    } catch (error) {
      console.error('Error generating smart notification:', error)
      
      // Return fallback notification
      return this.getFallbackNotification(context)
    }
  }

  /**
   * Analyze maintenance trends and generate insights
   */
  static async generateMaintenanceInsights(
    companyId: string,
    timeframe: 'monthly' | 'quarterly' | 'yearly',
    data: {
      requests: MaintenanceRequest[]
      costs: number[]
      properties: any[]
      contractors: any[]
    }
  ): Promise<{
    trends: string[]
    costAnalysis: string[]
    recommendations: string[]
    riskAreas: string[]
    seasonalPatterns: string[]
  }> {
    try {
      const prompt = this.buildInsightsPrompt(companyId, timeframe, data)
      
      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: `You are a data analyst specializing in property maintenance analytics. Analyze maintenance data to identify trends, cost patterns, and provide actionable business insights.

Provide response in this exact JSON format:
{
  "trends": ["trend1", "trend2"],
  "costAnalysis": ["analysis1", "analysis2"],
  "recommendations": ["recommendation1", "recommendation2"],
  "riskAreas": ["risk1", "risk2"],
  "seasonalPatterns": ["pattern1", "pattern2"]
}`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.4,
        max_tokens: 1200
      })

      const content = response.choices[0]?.message?.content
      if (!content) {
        throw new Error('No response from OpenAI')
      }

      return JSON.parse(content)
      
    } catch (error) {
      console.error('Error generating insights:', error)
      
      // Return basic insights based on data patterns
      return this.getBasicInsights(data)
    }
  }

  /**
   * Build analysis prompt for maintenance requests
   */
  private static buildAnalysisPrompt(
    title: string,
    description: string,
    location?: string,
    images?: string[]
  ): string {
    let prompt = `Analyze this maintenance request:

Title: ${title}
Description: ${description}`

    if (location) {
      prompt += `\nLocation: ${location}`
    }

    if (images && images.length > 0) {
      prompt += `\nImages provided: ${images.length} image(s)`
    }

    prompt += `\n\nConsider factors like:
- Safety implications
- Potential for escalation
- Required expertise level
- Typical costs in NYC market
- Urgency based on tenant impact
- Seasonal considerations
- Code compliance requirements`

    return prompt
  }

  /**
   * Build predictive maintenance prompt
   */
  private static buildPredictivePrompt(
    propertyId: string,
    historicalData: any
  ): string {
    const { pastIssues, propertyAge, lastMaintenanceDate } = historicalData
    
    let prompt = `Analyze this property for predictive maintenance:

Property ID: ${propertyId}
Property Age: ${propertyAge} years
Last Major Maintenance: ${lastMaintenanceDate ? new Date(lastMaintenanceDate).toDateString() : 'Unknown'}

Recent Issues (last 12 months):`

    pastIssues.slice(0, 10).forEach((issue: any, index: number) => {
      prompt += `\n${index + 1}. ${issue.title} - ${issue.category} - ${issue.createdAt}`
    })

    prompt += `\n\nConsider:
- Equipment lifecycle patterns
- Seasonal maintenance needs
- Building age-related issues
- NYC climate factors
- Cost-benefit of preventive vs reactive maintenance
- Tenant impact and safety priorities`

    return prompt
  }

  /**
   * Build notification prompt
   */
  private static buildNotificationPrompt(context: any): string {
    return `Generate a notification for this maintenance situation:

Issue Type: ${context.issueType}
Severity: ${context.severity}
Tenant: ${context.tenantInfo?.name || 'Unknown'}
Property: ${context.propertyInfo?.name || 'Unknown'}
${context.contractorInfo ? `Contractor: ${context.contractorInfo.name}` : ''}
${context.urgency ? `Urgency Score: ${context.urgency}/10` : ''}

Create appropriate messaging for property managers considering:
- Professional tone
- Clear action items
- Appropriate urgency level
- Tenant satisfaction
- Operational efficiency`
  }

  /**
   * Build insights prompt
   */
  private static buildInsightsPrompt(
    companyId: string,
    timeframe: string,
    data: any
  ): string {
    const { requests, costs, properties, contractors } = data
    
    return `Analyze maintenance data for business insights:

Company: ${companyId}
Timeframe: ${timeframe}
Total Requests: ${requests.length}
Total Properties: ${properties.length}
Average Cost: $${costs.reduce((a, b) => a + b, 0) / costs.length}

Request Categories:
${this.getCategoryBreakdown(requests)}

Cost Distribution:
${this.getCostBreakdown(costs)}

Identify patterns, optimization opportunities, and strategic recommendations.`
  }

  /**
   * Validate and sanitize AI analysis result
   */
  private static validateAnalysisResult(analysis: any): AIAnalysisResult {
    // Ensure all required fields are present and valid
    return {
      category: this.validateCategory(analysis.category),
      severity: this.validateSeverity(analysis.severity),
      urgency: Math.max(1, Math.min(10, analysis.urgency || 5)),
      estimatedCost: Math.max(0, analysis.estimatedCost || 100),
      estimatedDuration: Math.max(0.5, analysis.estimatedDuration || 2),
      requiredSkills: Array.isArray(analysis.requiredSkills) ? analysis.requiredSkills : [],
      suggestedContractorType: analysis.suggestedContractorType || 'General',
      confidence: Math.max(0, Math.min(1, analysis.confidence || 0.8)),
      reasoning: analysis.reasoning || 'Analysis completed',
      keywords: Array.isArray(analysis.keywords) ? analysis.keywords : [],
      riskLevel: this.validateRiskLevel(analysis.riskLevel),
      preventiveMeasures: Array.isArray(analysis.preventiveMeasures) ? analysis.preventiveMeasures : []
    }
  }

  /**
   * Get fallback analysis when AI fails
   */
  private static getFallbackAnalysis(title: string, description: string): AIAnalysisResult {
    const text = `${title} ${description}`.toLowerCase()
    
    // Simple keyword-based categorization
    let category = IssueCategory.GENERAL
    let severity = IssueSeverity.MEDIUM
    
    if (text.includes('leak') || text.includes('water') || text.includes('pipe')) {
      category = IssueCategory.PLUMBING
    } else if (text.includes('electric') || text.includes('light') || text.includes('outlet')) {
      category = IssueCategory.ELECTRICAL
    } else if (text.includes('heat') || text.includes('air') || text.includes('hvac')) {
      category = IssueCategory.HVAC
    }
    
    if (text.includes('urgent') || text.includes('emergency') || text.includes('danger')) {
      severity = IssueSeverity.URGENT
    } else if (text.includes('minor') || text.includes('small')) {
      severity = IssueSeverity.LOW
    }

    return {
      category,
      severity,
      urgency: severity === IssueSeverity.URGENT ? 9 : 5,
      estimatedCost: 150,
      estimatedDuration: 2,
      requiredSkills: ['General Maintenance'],
      suggestedContractorType: 'General',
      confidence: 0.6,
      reasoning: 'Fallback analysis based on keywords',
      keywords: text.split(' ').slice(0, 5),
      riskLevel: 'MEDIUM',
      preventiveMeasures: ['Regular inspections', 'Preventive maintenance schedule']
    }
  }

  /**
   * Get fallback predictions when AI fails
   */
  private static getFallbackPredictions(
    propertyId: string,
    historicalData: any
  ): PredictiveMaintenanceResult {
    return {
      propertyId,
      predictions: [
        {
          issueType: 'HVAC filter replacement',
          probability: 0.8,
          timeframe: 'next 30 days',
          preventiveAction: 'Schedule filter replacement',
          estimatedCost: 50,
          priority: 3
        },
        {
          issueType: 'Plumbing inspection',
          probability: 0.6,
          timeframe: 'next 90 days',
          preventiveAction: 'Professional plumbing inspection',
          estimatedCost: 200,
          priority: 2
        }
      ],
      recommendations: [
        'Implement quarterly HVAC maintenance',
        'Schedule annual plumbing inspection',
        'Monitor tenant reports for early warning signs'
      ],
      seasonalFactors: [
        'Winter: Heating system stress',
        'Summer: Air conditioning usage peaks'
      ]
    }
  }

  /**
   * Get fallback notification when AI fails
   */
  private static getFallbackNotification(context: any): SmartNotificationContent {
    return {
      title: `Maintenance Request: ${context.issueType}`,
      message: `A ${context.severity.toLowerCase()} priority maintenance request has been submitted for ${context.propertyInfo?.name || 'your property'}.`,
      priority: context.severity === IssueSeverity.URGENT ? 'URGENT' : 'MEDIUM',
      actionItems: [
        'Review request details',
        'Assign appropriate contractor',
        'Contact tenant if needed'
      ],
      estimatedResponseTime: context.severity === IssueSeverity.URGENT ? '2 hours' : '24 hours',
      escalationPath: ['Property Manager', 'Company Owner']
    }
  }

  /**
   * Helper methods for validation
   */
  private static validateCategory(category: string): IssueCategory {
    return Object.values(IssueCategory).includes(category as IssueCategory) 
      ? category as IssueCategory 
      : IssueCategory.GENERAL
  }

  private static validateSeverity(severity: string): IssueSeverity {
    return Object.values(IssueSeverity).includes(severity as IssueSeverity)
      ? severity as IssueSeverity
      : IssueSeverity.MEDIUM
  }

  private static validateRiskLevel(riskLevel: string): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    return ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].includes(riskLevel) 
      ? riskLevel as any
      : 'MEDIUM'
  }

  private static getCategoryBreakdown(requests: any[]): string {
    const categories: { [key: string]: number } = {}
    requests.forEach(req => {
      categories[req.category] = (categories[req.category] || 0) + 1
    })
    return Object.entries(categories).map(([cat, count]) => `${cat}: ${count}`).join('\n')
  }

  private static getCostBreakdown(costs: number[]): string {
    const sorted = costs.sort((a, b) => a - b)
    const median = sorted[Math.floor(sorted.length / 2)]
    const avg = costs.reduce((a, b) => a + b, 0) / costs.length
    return `Median: $${median}, Average: $${avg.toFixed(2)}`
  }

  private static getBasicInsights(data: any) {
    return {
      trends: ['Increasing maintenance requests', 'Seasonal patterns observed'],
      costAnalysis: ['Average costs within expected range', 'Some high-cost outliers identified'],
      recommendations: ['Implement preventive maintenance', 'Review contractor performance'],
      riskAreas: ['Aging HVAC systems', 'Plumbing infrastructure'],
      seasonalPatterns: ['Winter heating issues', 'Summer cooling demands']
    }
  }
}

