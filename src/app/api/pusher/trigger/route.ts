import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { pusherServer } from '@/lib/pusher'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { channel, event, data } = await request.json()

    if (!channel || !event) {
      return NextResponse.json({ error: 'Channel and event are required' }, { status: 400 })
    }

    // Validate that user can trigger events on this channel
    const canTrigger = await validateTriggerAccess(channel, session.user)
    
    if (!canTrigger) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Add user info to the data
    const eventData = {
      ...data,
      triggeredBy: {
        userId: session.user.id,
        name: session.user.name,
        role: session.user.role,
      },
      timestamp: new Date().toISOString(),
    }

    await pusherServer.trigger(channel, event, eventData)

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Pusher trigger error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function validateTriggerAccess(channel: string, user: any): Promise<boolean> {
  // Only allow triggering on channels the user has access to
  
  // Company channels - only users from the same company
  if (channel.startsWith('company-')) {
    const companyId = channel.replace('company-', '')
    return companyId === user.companyId
  }

  // Chat channels - only participants can send messages
  if (channel.startsWith('chat-')) {
    // TODO: Validate chat participation
    return true // For now, allow all authenticated users
  }

  // User channels - only the user themselves
  if (channel.startsWith('user-')) {
    const userId = channel.replace('user-', '')
    return userId === user.id
  }

  // Property channels - validate property access
  if (channel.startsWith('property-')) {
    // TODO: Check property access permissions
    return user.companyId // Allow if user belongs to a company
  }

  return false
}

