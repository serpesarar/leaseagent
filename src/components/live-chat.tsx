'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useChat } from '@/hooks/use-realtime'
import { useSession } from 'next-auth/react'
import { 
  MessageSquare, 
  Send, 
  Phone, 
  Video, 
  MoreVertical, 
  X,
  Minimize2,
  Maximize2,
  Paperclip,
  Smile
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface LiveChatProps {
  chatId: string
  participants: Array<{
    id: string
    name: string
    role: string
    avatar?: string
    isOnline?: boolean
  }>
  isMinimized?: boolean
  onToggleMinimize?: () => void
  onClose?: () => void
}

export function LiveChat({ 
  chatId, 
  participants, 
  isMinimized = false,
  onToggleMinimize,
  onClose 
}: LiveChatProps) {
  const { data: session } = useSession()
  const [message, setMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()
  
  const { messages, typingUsers, sendMessage, startTyping, stopTyping } = useChat(chatId)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!message.trim()) return

    await sendMessage(message.trim())
    setMessage('')
    stopTyping()
    setIsTyping(false)
  }

  const handleTyping = (value: string) => {
    setMessage(value)

    if (!isTyping) {
      setIsTyping(true)
      startTyping()
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Stop typing after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
      stopTyping()
    }, 3000)
  }

  const currentUser = session?.user
  const otherParticipants = participants.filter(p => p.id !== currentUser?.id)
  const onlineParticipants = participants.filter(p => p.isOnline)

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={onToggleMinimize}
          className="h-12 w-12 rounded-full shadow-lg"
        >
          <MessageSquare className="h-5 w-5" />
        </Button>
        {typingUsers.length > 0 && (
          <div className="absolute -top-8 right-0 bg-blue-500 text-white text-xs px-2 py-1 rounded">
            Someone is typing...
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 h-96 bg-white border border-gray-200 rounded-lg shadow-xl flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <div className="flex -space-x-2">
            {otherParticipants.slice(0, 2).map((participant) => (
              <div key={participant.id} className="relative">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center border-2 border-white">
                  {participant.avatar ? (
                    <img 
                      src={participant.avatar} 
                      alt={participant.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-xs font-medium text-gray-600">
                      {participant.name.charAt(0)}
                    </span>
                  )}
                </div>
                {participant.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
            ))}
          </div>
          <div>
            <h4 className="font-medium text-sm">
              {otherParticipants.length === 1 
                ? otherParticipants[0].name
                : `${otherParticipants.length} participants`
              }
            </h4>
            <p className="text-xs text-gray-500">
              {onlineParticipants.length} online
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="sm">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Video className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onToggleMinimize}>
            <Minimize2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 text-sm py-8">
            <MessageSquare className="mx-auto h-8 w-8 mb-2 opacity-50" />
            <p>No messages yet</p>
            <p className="text-xs">Start a conversation!</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isOwn = msg.senderId === currentUser?.id
            const sender = participants.find(p => p.id === msg.senderId)
            const showAvatar = !isOwn && (index === 0 || messages[index - 1].senderId !== msg.senderId)
            
            return (
              <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-end space-x-2 max-w-[70%] ${isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  {showAvatar && !isOwn && (
                    <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                      {sender?.avatar ? (
                        <img 
                          src={sender.avatar} 
                          alt={sender.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-xs font-medium text-gray-600">
                          {sender?.name.charAt(0)}
                        </span>
                      )}
                    </div>
                  )}
                  
                  <div className={`rounded-lg px-3 py-2 ${
                    isOwn 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    {!isOwn && showAvatar && (
                      <p className="text-xs opacity-70 mb-1">{sender?.name}</p>
                    )}
                    <p className="text-sm">{msg.content}</p>
                    <p className={`text-xs mt-1 ${isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            )
          })
        )}
        
        {/* Typing indicator */}
        {typingUsers.length > 0 && (
          <div className="flex items-center space-x-2 text-gray-500">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span className="text-xs">
              {typingUsers.length === 1 ? 'Someone is typing...' : `${typingUsers.length} people are typing...`}
            </span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-3 border-t">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <Button type="button" variant="ghost" size="sm">
            <Paperclip className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" size="sm">
            <Smile className="h-4 w-4" />
          </Button>
          <Input
            value={message}
            onChange={(e) => handleTyping(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
            maxLength={1000}
          />
          <Button 
            type="submit" 
            size="sm"
            disabled={!message.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}

// Chat List Component
export function ChatList() {
  const { data: session } = useSession()
  const [chats, setChats] = useState([
    {
      id: 'chat-1',
      name: 'Property Manager',
      lastMessage: 'The maintenance request has been assigned to a contractor.',
      lastMessageTime: '2024-09-16T10:30:00Z',
      unreadCount: 2,
      participants: [
        {
          id: 'user-1',
          name: 'Sarah Johnson',
          role: 'Property Manager',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
          isOnline: true
        }
      ]
    },
    {
      id: 'chat-2',
      name: 'Maintenance Team',
      lastMessage: 'We can schedule the repair for tomorrow morning.',
      lastMessageTime: '2024-09-16T09:15:00Z',
      unreadCount: 0,
      participants: [
        {
          id: 'user-2',
          name: 'Mike Thompson',
          role: 'Contractor',
          isOnline: false
        },
        {
          id: 'user-3',
          name: 'Lisa Park',
          role: 'Property Manager',
          isOnline: true
        }
      ]
    }
  ])

  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [isChatMinimized, setIsChatMinimized] = useState(false)

  const selectedChatData = chats.find(chat => chat.id === selectedChat)

  return (
    <>
      {/* Chat List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>Messages</span>
          </CardTitle>
          <CardDescription>
            Live chat with property managers and contractors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => {
                  setSelectedChat(chat.id)
                  setIsChatMinimized(false)
                }}
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    {chat.participants[0]?.avatar ? (
                      <img 
                        src={chat.participants[0].avatar} 
                        alt={chat.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <MessageSquare className="h-5 w-5 text-gray-600" />
                    )}
                  </div>
                  {chat.participants.some(p => p.isOnline) && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm truncate">{chat.name}</h4>
                    <span className="text-xs text-gray-500">
                      {new Date(chat.lastMessageTime).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                </div>
                
                {chat.unreadCount > 0 && (
                  <Badge variant="default" className="bg-blue-500">
                    {chat.unreadCount}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Live Chat Component */}
      {selectedChat && selectedChatData && (
        <LiveChat
          chatId={selectedChat}
          participants={[
            {
              id: session?.user.id || '',
              name: session?.user.name || '',
              role: session?.user.role || '',
              avatar: session?.user.image || undefined,
              isOnline: true
            },
            ...selectedChatData.participants
          ]}
          isMinimized={isChatMinimized}
          onToggleMinimize={() => setIsChatMinimized(!isChatMinimized)}
          onClose={() => setSelectedChat(null)}
        />
      )}
    </>
  )
}

