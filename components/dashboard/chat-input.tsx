'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send } from 'lucide-react'

interface ChatInputProps {
  onSubmit: (message: string) => void
  isProcessing: boolean
  placeholder?: string
}

export default function ChatInput({ onSubmit, isProcessing, placeholder = "Describe your app..." }: ChatInputProps) {
  const [message, setMessage] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus input on component mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (message.trim() && !isProcessing) {
      onSubmit(message)
      setMessage('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full">
      <Input
        ref={inputRef}
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={placeholder}
        disabled={isProcessing}
        className="rounded-r-none border-r-0 focus:ring-0 focus:border-slateBlue"
      />
      <Button 
        type="submit"
        variant="gradient"
        size="default"
        disabled={!message.trim() || isProcessing}
        className="rounded-l-none px-4"
      >
        <Send className="h-5 w-5" />
      </Button>
    </form>
  )
}
