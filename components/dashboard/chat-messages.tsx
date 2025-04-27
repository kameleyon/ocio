'use client'

import React, { useEffect, useRef } from 'react'
import { Cpu, User } from 'lucide-react'

export interface Message {
  id: string
  role: 'user' | 'system'
  content: string
  timestamp: Date
}

interface ChatMessagesProps {
  messages: Message[]
}

export default function ChatMessages({ messages }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center p-8">
          <Cpu className="h-12 w-12 text-slateBlue mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-comfortaa font-bold text-whiteSmoke mb-2">Start Building</h3>
          <p className="text-lightGray max-w-md">
            Describe your app in plain text and OptimusCode will generate a full-stack application for you.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${
            message.role === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className={`flex max-w-[80%] ${
              message.role === 'user'
                ? 'bg-slateBlue/30 rounded-tl-xl rounded-tr-sm rounded-bl-xl'
                : 'bg-berkeleyBlue/50 rounded-tl-sm rounded-tr-xl rounded-br-xl'
            } p-3 shadow-sm`}
          >
            <div className="flex-shrink-0 mr-3">
              {message.role === 'user' ? (
                <User className="h-6 w-6 text-whiteSmoke/70" />
              ) : (
                <Cpu className="h-6 w-6 text-robinEggBlue" />
              )}
            </div>
            <div>
              <div className="text-whiteSmoke whitespace-pre-wrap">{message.content}</div>
              <div className="mt-1 text-xs text-whiteSmoke/50">
                {message.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  )
}
