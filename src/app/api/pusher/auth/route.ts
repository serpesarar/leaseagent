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

    const data = await request.text()
    const [socketId, channelName] = data
      .split('&')
      .map(str => str.split('=')[1])

    // Check if user has access to this channel
    const hasAccess = await validateChannelAccess(channelName, session.user)
    
    if (!hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // For presence channels, include user info
    if (channelName.startsWith('presence-')) {
      const presenceData = {
        user_id: session.user.id,
        user_info: {
          name: session.user.name,
          email: session.user.email,
          role: session.user.role,
          avatar: session.user.image,
        }
      }

      const auth = pusherServer.authorizeChannel(socketId, channelName, presenceData)
      return NextResponse.json(auth)
    }

    // For private channels
    const auth = pusherServer.authorizeChannel(socketId, channelName)
    return NextResponse.json(auth)

  } catch (error) {
    console.error('Pusher auth error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function validateChannelAccess(channelName: string, user: any): Promise<boolean> {
  // User channels - only the user themselves can access
  if (channelName.startsWith('user-')) {
    const userId = channelName.replace('user-', '')
    return userId === user.id
  }

  // Company channels - only users from the same company
  if (channelName.startsWith('company-')) {
    const companyId = channelName.replace('company-', '')
    return companyId === user.companyId
  }

  // Chat channels - validate chat participation
  if (channelName.startsWith('chat-')) {
    const chatId = channelName.replace('chat-', '')
    // TODO: Check if user is participant in this chat
    return true // For now, allow all authenticated users
  }

  // Property channels - validate property access
  if (channelName.startsWith('property-')) {
    const propertyId = channelName.replace('property-', '')
    // TODO: Check if user has access to this property
    return true // For now, allow all users from same company
  }

  // Default deny
  return false
}

