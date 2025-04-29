'use client'

import React, { useEffect, useRef } from 'react'
import { AlertCircle, ArrowUp, Check, Info, Terminal } from 'lucide-react'
import { cn } from '@/lib/utils'

export type LogLevel = 'info' | 'success' | 'warning' | 'error' | 'command'
export type StatusLog = {
  id: string
  message: string
  level: LogLevel
  timestamp: Date
  details?: string
}

interface StatusUpdateProps {
  logs: StatusLog[]
  scrollToBottom?: boolean
  maxHeight?: string
  className?: string
}

export default function StatusUpdate({
  logs,
  scrollToBottom = true,
  maxHeight = '400px',
  className
}: StatusUpdateProps) {
  const logContainerRef = useRef<HTMLDivElement>(null)
  const isAutoScrollingRef = useRef(true)
  
  // Auto-scroll to bottom when new logs come in
  useEffect(() => {
    if (scrollToBottom && logContainerRef.current && isAutoScrollingRef.current) {
      const container = logContainerRef.current
      container.scrollTop = container.scrollHeight
    }
  }, [logs, scrollToBottom])
  
  // Handle scroll events to detect if user has scrolled up manually
  const handleScroll = () => {
    if (!logContainerRef.current) return
    
    const container = logContainerRef.current
    const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 50
    
    // If user scrolls up, disable auto-scrolling. If they scroll to bottom, re-enable it.
    isAutoScrollingRef.current = isAtBottom
  }
  
  // Scroll to bottom button handler
  const scrollToBottomHandler = () => {
    if (!logContainerRef.current) return
    
    const container = logContainerRef.current
    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth'
    })
    
    isAutoScrollingRef.current = true
  }

  // Icon mapping for log levels
  const getIcon = (level: LogLevel) => {
    switch (level) {
      case 'info':
        return <Info className="w-4 h-4 text-slateBlue" />
      case 'success':
        return <Check className="w-4 h-4 text-robinEggBlue" />
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-400" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      case 'command':
        return <Terminal className="w-4 h-4 text-whiteSmoke" />
    }
  }

  return (
    <div className={cn("relative", className)}>
      <div 
        ref={logContainerRef}
        onScroll={handleScroll}
        className="w-full overflow-y-auto rounded-lg border border-berkeleyBlue bg-richBlack p-4 font-mono text-sm"
        style={{ maxHeight }}
      >
        {logs.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-lightGray">
            No status updates yet. Generation logs will appear here.
          </div>
        ) : (
          <div className="space-y-2">
            {logs.map((log) => (
              <div 
                key={log.id}
                className={cn(
                  "flex items-start py-1 border-b border-berkeleyBlue border-opacity-30 last:border-0",
                  log.level === 'command' && "bg-berkeleyBlue bg-opacity-30 -mx-2 px-2 rounded",
                )}
              >
                <div className="flex-shrink-0 w-5 h-5 mt-0.5 mr-2">
                  {getIcon(log.level)}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <span className={cn(
                      "font-medium",
                      log.level === 'info' && "text-whiteSmoke",
                      log.level === 'success' && "text-robinEggBlue",
                      log.level === 'warning' && "text-yellow-400",
                      log.level === 'error' && "text-red-500",
                      log.level === 'command' && "text-slateBlue",
                    )}>
                      {log.message}
                    </span>
                    
                    <span className="text-xs text-lightGray ml-2 flex-shrink-0">
                      {log.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                  
                  {log.details && (
                    <div className="mt-1 text-xs text-lightGray whitespace-pre-wrap ml-1">
                      {log.details}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Scroll to bottom button (only visible when not at bottom) */}
      {!isAutoScrollingRef.current && (
        <button
          onClick={scrollToBottomHandler}
          className="absolute bottom-4 right-4 p-2 rounded-full bg-slateBlue text-whiteSmoke shadow-md hover:bg-opacity-80 transition-opacity"
          aria-label="Scroll to bottom"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
