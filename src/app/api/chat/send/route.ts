import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { sendChatMessage } from '@/lib/pusher'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { chatId, content, type = 'text' } = await request.json()

    if (!chatId || !content) {
      return NextResponse.json(
        { error: 'Chat ID and content are required' },
        { status: 400 }
      )
    }

    // Create message in database (we'll add Chat model later)
    // For now, we'll just send the real-time message
    const message = {
      id: Date.now().toString(),
      chatId,
      senderId: session.user.id,
      senderName: session.user.name,
      senderRole: session.user.role,
      content,
      type,
      timestamp: new Date().toISOString(),
    }

    // Send real-time message
    await sendChatMessage(chatId, message)

    return NextResponse.json({
      success: true,
      message
    })

  } catch (error) {
    console.error('Error sending chat message:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}

