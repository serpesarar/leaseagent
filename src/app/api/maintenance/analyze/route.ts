import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { issueRoutingSystem } from '@/lib/ai-routing'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, propertyType } = body

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      )
    }

    // Perform AI analysis
    const analysis = await issueRoutingSystem.analyzeIssue(
      description,
      title,
      propertyType
    )

    return NextResponse.json({
      success: true,
      analysis
    })

  } catch (error) {
    console.error('Error analyzing maintenance issue:', error)
    return NextResponse.json(
      { error: 'Failed to analyze issue' },
      { status: 500 }
    )
  }
}

