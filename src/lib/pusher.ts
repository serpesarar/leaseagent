import Pusher from 'pusher'
import PusherClient from 'pusher-js'

// Server-side Pusher instance
export const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
})

// Client-side Pusher instance - will be initialized in hook
let pusherClientInstance: PusherClient | null = null

export const getPusherClient = () => {
  if (!pusherClientInstance) {
    pusherClientInstance = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      authEndpoint: '/api/pusher/auth',
      auth: {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    })
  }
  return pusherClientInstance
}

// Real-time event types
export enum RealTimeEvents {
  // Chat events
  MESSAGE_SENT = 'message-sent',
  MESSAGE_RECEIVED = 'message-received',
  TYPING_START = 'typing-start',
  TYPING_STOP = 'typing-stop',
  USER_ONLINE = 'user-online',
  USER_OFFLINE = 'user-offline',
  
  // Maintenance events
  MAINTENANCE_CREATED = 'maintenance-created',
  MAINTENANCE_UPDATED = 'maintenance-updated',
  MAINTENANCE_STATUS_CHANGED = 'maintenance-status-changed',
  CONTRACTOR_ASSIGNED = 'contractor-assigned',
  
  // Payment events
  PAYMENT_RECEIVED = 'payment-received',
  PAYMENT_FAILED = 'payment-failed',
  PAYMENT_OVERDUE = 'payment-overdue',
  
  // Property events
  PROPERTY_UPDATED = 'property-updated',
  UNIT_AVAILABILITY_CHANGED = 'unit-availability-changed',
  LEASE_SIGNED = 'lease-signed',
  LEASE_EXPIRING = 'lease-expiring',
  
  // Dashboard events
  DASHBOARD_UPDATE = 'dashboard-update',
  URGENT_ALERT = 'urgent-alert',
  SYSTEM_NOTIFICATION = 'system-notification',
}

// Channel types
export enum ChannelTypes {
  COMPANY = 'company',
  USER = 'user',
  PROPERTY = 'property',
  CHAT = 'chat',
  MAINTENANCE = 'maintenance',
}

// Real-time service class
export class RealTimeService {
  private static instance: RealTimeService
  private pusher: PusherClient | null = null
  private subscribedChannels = new Map<string, any>()
  private userId: string | null = null
  private companyId: string | null = null

  private constructor() {}

  static getInstance(): RealTimeService {
    if (!RealTimeService.instance) {
      RealTimeService.instance = new RealTimeService()
    }
    return RealTimeService.instance
  }

  initialize(userId: string, companyId: string) {
    this.userId = userId
    this.companyId = companyId
    this.pusher = getPusherClient()
    
    // Subscribe to user and company channels
    this.subscribeToChannel(`${ChannelTypes.USER}-${userId}`)
    this.subscribeToChannel(`${ChannelTypes.COMPANY}-${companyId}`)
    
    // Set user as online
    this.setUserOnlineStatus(true)
  }

  subscribeToChannel(channelName: string) {
    if (!this.pusher || this.subscribedChannels.has(channelName)) return

    const channel = this.pusher.subscribe(channelName)
    this.subscribedChannels.set(channelName, channel)
    return channel
  }

  unsubscribeFromChannel(channelName: string) {
    if (!this.pusher) return

    const channel = this.subscribedChannels.get(channelName)
    if (channel) {
      this.pusher.unsubscribe(channelName)
      this.subscribedChannels.delete(channelName)
    }
  }

  // Chat functionality
  subscribeToChat(chatId: string, callbacks: {
    onMessage?: (message: any) => void
    onTyping?: (data: any) => void
    onUserOnline?: (data: any) => void
    onUserOffline?: (data: any) => void
  }) {
    const channelName = `${ChannelTypes.CHAT}-${chatId}`
    const channel = this.subscribeToChannel(channelName)
    
    if (channel) {
      if (callbacks.onMessage) {
        channel.bind(RealTimeEvents.MESSAGE_SENT, callbacks.onMessage)
      }
      if (callbacks.onTyping) {
        channel.bind(RealTimeEvents.TYPING_START, callbacks.onTyping)
        channel.bind(RealTimeEvents.TYPING_STOP, callbacks.onTyping)
      }
      if (callbacks.onUserOnline) {
        channel.bind(RealTimeEvents.USER_ONLINE, callbacks.onUserOnline)
      }
      if (callbacks.onUserOffline) {
        channel.bind(RealTimeEvents.USER_OFFLINE, callbacks.onUserOffline)
      }
    }
  }

  // Maintenance real-time updates
  subscribeToMaintenance(callbacks: {
    onCreate?: (data: any) => void
    onUpdate?: (data: any) => void
    onStatusChange?: (data: any) => void
    onContractorAssigned?: (data: any) => void
  }) {
    if (!this.companyId) return

    const channelName = `${ChannelTypes.COMPANY}-${this.companyId}`
    const channel = this.subscribedChannels.get(channelName)
    
    if (channel) {
      if (callbacks.onCreate) {
        channel.bind(RealTimeEvents.MAINTENANCE_CREATED, callbacks.onCreate)
      }
      if (callbacks.onUpdate) {
        channel.bind(RealTimeEvents.MAINTENANCE_UPDATED, callbacks.onUpdate)
      }
      if (callbacks.onStatusChange) {
        channel.bind(RealTimeEvents.MAINTENANCE_STATUS_CHANGED, callbacks.onStatusChange)
      }
      if (callbacks.onContractorAssigned) {
        channel.bind(RealTimeEvents.CONTRACTOR_ASSIGNED, callbacks.onContractorAssigned)
      }
    }
  }

  // Dashboard real-time updates
  subscribeToDashboard(callbacks: {
    onUpdate?: (data: any) => void
    onUrgentAlert?: (data: any) => void
    onSystemNotification?: (data: any) => void
  }) {
    if (!this.companyId) return

    const channelName = `${ChannelTypes.COMPANY}-${this.companyId}`
    const channel = this.subscribedChannels.get(channelName)
    
    if (channel) {
      if (callbacks.onUpdate) {
        channel.bind(RealTimeEvents.DASHBOARD_UPDATE, callbacks.onUpdate)
      }
      if (callbacks.onUrgentAlert) {
        channel.bind(RealTimeEvents.URGENT_ALERT, callbacks.onUrgentAlert)
      }
      if (callbacks.onSystemNotification) {
        channel.bind(RealTimeEvents.SYSTEM_NOTIFICATION, callbacks.onSystemNotification)
      }
    }
  }

  setUserOnlineStatus(isOnline: boolean) {
    if (!this.userId || !this.companyId) return

    // This would typically be handled by presence channels
    // For now, we'll trigger an event
    this.triggerEvent(
      `${ChannelTypes.COMPANY}-${this.companyId}`,
      isOnline ? RealTimeEvents.USER_ONLINE : RealTimeEvents.USER_OFFLINE,
      { userId: this.userId, timestamp: new Date().toISOString() }
    )
  }

  private async triggerEvent(channel: string, event: string, data: any) {
    try {
      await fetch('/api/pusher/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channel, event, data })
      })
    } catch (error) {
      console.error('Error triggering event:', error)
    }
  }

  disconnect() {
    if (this.pusher) {
      this.setUserOnlineStatus(false)
      this.subscribedChannels.forEach((_, channelName) => {
        this.unsubscribeFromChannel(channelName)
      })
      this.pusher.disconnect()
      this.pusher = null
    }
  }
}

// Server-side functions
export const sendChatMessage = async (chatId: string, message: any) => {
  try {
    await pusherServer.trigger(`${ChannelTypes.CHAT}-${chatId}`, RealTimeEvents.MESSAGE_SENT, {
      ...message,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error sending chat message:', error)
  }
}

export const sendMaintenanceUpdate = async (companyId: string, type: RealTimeEvents, data: any) => {
  try {
    await pusherServer.trigger(`${ChannelTypes.COMPANY}-${companyId}`, type, {
      ...data,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error sending maintenance update:', error)
  }
}

export const sendDashboardUpdate = async (companyId: string, data: any) => {
  try {
    await pusherServer.trigger(`${ChannelTypes.COMPANY}-${companyId}`, RealTimeEvents.DASHBOARD_UPDATE, {
      ...data,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error sending dashboard update:', error)
  }
}

export const sendUrgentAlert = async (companyId: string, alert: any) => {
  try {
    await pusherServer.trigger(`${ChannelTypes.COMPANY}-${companyId}`, RealTimeEvents.URGENT_ALERT, {
      ...alert,
      timestamp: new Date().toISOString(),
      urgent: true,
    })
  } catch (error) {
    console.error('Error sending urgent alert:', error)
  }
}

// Legacy support
export const sendNotification = async (companyId: string, type: string, data: any) => {
  return sendDashboardUpdate(companyId, { type, ...data })
}

export const sendUserNotification = async (userId: string, type: string, data: any) => {
  try {
    await pusherServer.trigger(`${ChannelTypes.USER}-${userId}`, RealTimeEvents.SYSTEM_NOTIFICATION, {
      type,
      ...data,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error sending user notification:', error)
  }
}
