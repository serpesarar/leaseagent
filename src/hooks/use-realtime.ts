import { useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { RealTimeService, RealTimeEvents } from '@/lib/pusher'
import { useToast } from '@/hooks/use-toast'

export function useRealTime() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const realTimeService = useRef<RealTimeService | null>(null)
  const isInitialized = useRef(false)

  useEffect(() => {
    if (session?.user && !isInitialized.current) {
      realTimeService.current = RealTimeService.getInstance()
      realTimeService.current.initialize(session.user.id, session.user.companyId)
      isInitialized.current = true

      // Set up global notification handlers
      realTimeService.current.subscribeToDashboard({
        onUrgentAlert: (data) => {
          toast({
            title: 'Urgent Alert',
            description: data.message,
            variant: 'destructive',
          })
        },
        onSystemNotification: (data) => {
          toast({
            title: data.title || 'Notification',
            description: data.message,
          })
        }
      })
    }

    return () => {
      if (realTimeService.current && isInitialized.current) {
        realTimeService.current.disconnect()
        isInitialized.current = false
      }
    }
  }, [session, toast])

  return realTimeService.current
}

export function useChat(chatId: string) {
  const realTimeService = useRealTime()
  const messagesRef = useRef<any[]>([])
  const typingUsersRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    if (realTimeService && chatId) {
      realTimeService.subscribeToChat(chatId, {
        onMessage: (message) => {
          messagesRef.current = [...messagesRef.current, message]
        },
        onTyping: (data) => {
          if (data.event === 'typing-start') {
            typingUsersRef.current.add(data.userId)
          } else {
            typingUsersRef.current.delete(data.userId)
          }
        }
      })
    }
  }, [realTimeService, chatId])

  const sendMessage = async (content: string, type = 'text') => {
    if (!realTimeService) return

    const message = {
      id: Date.now().toString(),
      content,
      type,
      senderId: realTimeService['userId'],
      chatId,
      timestamp: new Date().toISOString(),
    }

    try {
      await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message)
      })
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  const startTyping = () => {
    if (!realTimeService) return
    
    realTimeService['triggerEvent'](
      `chat-${chatId}`,
      RealTimeEvents.TYPING_START,
      { userId: realTimeService['userId'] }
    )
  }

  const stopTyping = () => {
    if (!realTimeService) return
    
    realTimeService['triggerEvent'](
      `chat-${chatId}`,
      RealTimeEvents.TYPING_STOP,
      { userId: realTimeService['userId'] }
    )
  }

  return {
    messages: messagesRef.current,
    typingUsers: Array.from(typingUsersRef.current),
    sendMessage,
    startTyping,
    stopTyping,
  }
}

export function useMaintenanceRealTime(callbacks?: {
  onCreate?: (data: any) => void
  onUpdate?: (data: any) => void
  onStatusChange?: (data: any) => void
  onContractorAssigned?: (data: any) => void
}) {
  const realTimeService = useRealTime()
  const { toast } = useToast()

  useEffect(() => {
    if (realTimeService) {
      realTimeService.subscribeToMaintenance({
        onCreate: (data) => {
          toast({
            title: 'New Maintenance Request',
            description: `${data.title} - ${data.property}`,
          })
          callbacks?.onCreate?.(data)
        },
        onUpdate: (data) => {
          callbacks?.onUpdate?.(data)
        },
        onStatusChange: (data) => {
          toast({
            title: 'Status Update',
            description: `${data.title} is now ${data.status.toLowerCase()}`,
          })
          callbacks?.onStatusChange?.(data)
        },
        onContractorAssigned: (data) => {
          toast({
            title: 'Contractor Assigned',
            description: `${data.contractorName} assigned to ${data.title}`,
          })
          callbacks?.onContractorAssigned?.(data)
        }
      })
    }
  }, [realTimeService, callbacks, toast])

  return realTimeService
}

export function useDashboardRealTime(callbacks?: {
  onUpdate?: (data: any) => void
  onUrgentAlert?: (data: any) => void
}) {
  const realTimeService = useRealTime()

  useEffect(() => {
    if (realTimeService) {
      realTimeService.subscribeToDashboard({
        onUpdate: callbacks?.onUpdate,
        onUrgentAlert: callbacks?.onUrgentAlert,
      })
    }
  }, [realTimeService, callbacks])

  return realTimeService
}

