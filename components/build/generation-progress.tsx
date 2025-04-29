'use client'

import React from 'react'
import { CheckCircle, Clock, Code, Database, Edit, FileStack, FileType, Server, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

export type GenerationStep = {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  status: 'pending' | 'in-progress' | 'completed' | 'error'
  progress?: number // 0-100
  details?: string[]
}

interface GenerationProgressProps {
  steps: GenerationStep[]
  currentStep: string
  overallProgress: number // 0-100
  startTime?: Date
  estimatedEndTime?: Date
}

export default function GenerationProgress({
  steps,
  currentStep,
  overallProgress,
  startTime,
  estimatedEndTime,
}: GenerationProgressProps) {
  // Calculate time remaining if both start and estimated end time are provided
  const getTimeRemaining = () => {
    if (!startTime || !estimatedEndTime) return null
    
    const now = new Date()
    const remaining = Math.max(0, estimatedEndTime.getTime() - now.getTime())
    
    // If remaining is 0, return "Finalizing..."
    if (remaining === 0) return "Finalizing..."
    
    // Convert to minutes and seconds
    const minutes = Math.floor(remaining / 60000)
    const seconds = Math.floor((remaining % 60000) / 1000)
    
    if (minutes > 0) {
      return `~${minutes}m ${seconds}s remaining`
    } else {
      return `~${seconds}s remaining`
    }
  }

  const timeRemaining = getTimeRemaining()

  return (
    <div className="flex flex-col w-full space-y-8">
      {/* Overall Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-comfortaa font-bold text-whiteSmoke">
            App Generation Progress
          </h3>
          {timeRemaining && (
            <div className="flex items-center text-sm text-lightGray">
              <Clock className="w-4 h-4 mr-1" />
              <span>{timeRemaining}</span>
            </div>
          )}
        </div>
        
        <div className="relative h-4 w-full bg-berkeleyBlue bg-opacity-30 rounded-full overflow-hidden">
          <div 
            className="absolute h-full bg-gradient-to-r from-slateBlue to-robinEggBlue transition-all duration-500 ease-out rounded-full"
            style={{ width: `${overallProgress}%` }}
          />
          <div 
            className="absolute h-full w-full opacity-20"
            style={{ 
              background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0) 100%)',
              backgroundSize: '200% 100%',
              animation: 'shine 2s infinite'
            }}
          />
        </div>
        
        <p className="text-right text-sm text-lightGray">
          {overallProgress}% Complete
        </p>
      </div>
      
      {/* Steps */}
      <div className="space-y-4">
        {steps.map((step, index) => {
          const isActive = step.id === currentStep
          const isCompleted = step.status === 'completed'
          const isError = step.status === 'error'
          const isPending = step.status === 'pending'
          
          return (
            <div 
              key={step.id}
              className={cn(
                "border rounded-lg p-4 transition-all duration-300",
                isActive && "glassmorphism border-slateBlue animate-glow",
                isCompleted && "border-robinEggBlue bg-berkeleyBlue bg-opacity-20",
                isError && "border-red-500 bg-red-900 bg-opacity-10",
                isPending && "border-berkeleyBlue bg-opacity-0"
              )}
              style={isActive ? { '--glow-color': 'rgba(115, 87, 198, 0.3)' } as React.CSSProperties : {}}
            >
              <div className="flex items-start">
                <div className="mr-4 mt-1">
                  {isCompleted ? (
                    <div className="w-6 h-6 bg-robinEggBlue bg-opacity-20 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-robinEggBlue" />
                    </div>
                  ) : isError ? (
                    <div className="w-6 h-6 bg-red-500 bg-opacity-20 rounded-full flex items-center justify-center">
                      <span className="text-red-500 font-bold">!</span>
                    </div>
                  ) : isActive ? (
                    <div className="w-6 h-6 relative">
                      <div className="w-6 h-6 rounded-full border-2 border-slateBlue border-t-transparent animate-spin absolute"></div>
                      <div className="w-6 h-6 rounded-full border-2 border-robinEggBlue border-b-transparent animate-spin absolute" style={{ animationDuration: '1.5s' }}></div>
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border border-lightGray border-opacity-30 flex items-center justify-center">
                      <span className="text-xs text-lightGray">{index + 1}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className={cn(
                      "font-comfortaa font-bold",
                      isActive && "text-slateBlue",
                      isCompleted && "text-robinEggBlue",
                      isError && "text-red-500",
                      isPending && "text-lightGray"
                    )}>
                      {step.title}
                    </h4>
                    
                    {step.status === 'in-progress' && step.progress !== undefined && (
                      <span className="text-sm text-lightGray">{step.progress}%</span>
                    )}
                  </div>
                  
                  <p className={cn(
                    "text-sm mt-1",
                    isPending && "text-lightGray text-opacity-70"
                  )}>
                    {step.description}
                  </p>
                  
                  {/* Step-specific progress bar (only for active step) */}
                  {isActive && step.progress !== undefined && (
                    <div className="relative h-2 w-full bg-berkeleyBlue bg-opacity-30 rounded-full overflow-hidden mt-3">
                      <div 
                        className="absolute h-full bg-gradient-to-r from-slateBlue to-slateBlue transition-all duration-300 ease-out rounded-full"
                        style={{ width: `${step.progress}%` }}
                      />
                    </div>
                  )}
                  
                  {/* Details list (expanded for active/completed steps) */}
                  {(isActive || isCompleted) && step.details && step.details.length > 0 && (
                    <div className="mt-3 space-y-1 text-sm text-lightGray">
                      {step.details.map((detail, idx) => (
                        <div key={idx} className="flex items-start">
                          <span className="mr-2 text-xs">•</span>
                          <span>{detail}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export const defaultGenerationSteps: GenerationStep[] = [
  {
    id: 'analysis',
    title: 'Analyzing Request',
    description: 'Interpreting your app requirements and features',
    icon: <Edit />,
    status: 'pending',
  },
  {
    id: 'planning',
    title: 'Planning Architecture',
    description: 'Designing the structure and components',
    icon: <Zap />,
    status: 'pending',
  },
  {
    id: 'frontend',
    title: 'Generating Frontend',
    description: 'Creating UI components and views',
    icon: <Code />,
    status: 'pending',
  },
  {
    id: 'backend',
    title: 'Generating Backend',
    description: 'Building API endpoints and server logic',
    icon: <Server />,
    status: 'pending',
  },
  {
    id: 'database',
    title: 'Setting Up Database',
    description: 'Creating schema and models',
    icon: <Database />,
    status: 'pending',
  },
  {
    id: 'packaging',
    title: 'Packaging Application',
    description: 'Bundling all components and preparing for download',
    icon: <FileStack />,
    status: 'pending',
  },
  {
    id: 'testing',
    title: 'Testing & Verification',
    description: 'Ensuring everything works as expected',
    icon: <FileType />,
    status: 'pending',
  }
]
