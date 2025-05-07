'use client'

import React from 'react'
import { CheckCircle, Clock, Code, Database, Edit, FileStack, FileType, Server, Zap, ChevronDown, ChevronUp } from 'lucide-react'
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
  const [expandedDetails, setExpandedDetails] = React.useState<Set<string>>(new Set());

  const toggleDetails = (stepId: string) => {
    setExpandedDetails(prev => {
      const newSet = new Set(prev);
      if (newSet.has(stepId)) {
        newSet.delete(stepId);
      } else {
        newSet.add(stepId);
      }
      return newSet;
    });
  };

  const getTimeRemaining = () => {
    if (!startTime || !estimatedEndTime) return null
    
    const now = new Date()
    const remaining = Math.max(0, estimatedEndTime.getTime() - now.getTime())
    
    if (remaining === 0 && overallProgress < 100) return "Finalizing..."
    if (remaining === 0 && overallProgress === 100) return "Completed!"
    
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
          const isActive = step.id === currentStep && step.status === 'in-progress'
          const isCompleted = step.status === 'completed'
          const isError = step.status === 'error'
          const isPending = step.status === 'pending' && !(step.id === currentStep) // Pending only if not also current (which implies in-progress start)
          const isDetailsExpanded = expandedDetails.has(step.id);

          return (
            <div 
              key={step.id}
              className={cn(
                "border rounded-lg p-4 transition-all duration-300 ease-in-out",
                isActive && "glassmorphism border-slateBlue shadow-lg shadow-slateBlue/30 animate-glow", // Enhanced active glow
                isCompleted && "border-robinEggBlue bg-berkeleyBlue bg-opacity-20",
                isError && "border-red-500 bg-red-900 bg-opacity-20", // Slightly more pronounced error bg
                isPending && "border-berkeleyBlue bg-opacity-0 opacity-70" // Slightly faded pending
              )}
              style={isActive ? { '--glow-color': 'rgba(115, 87, 198, 0.4)' } as React.CSSProperties : {}}
            >
              <div className="flex items-start">
                <div className="mr-4 mt-1 flex-shrink-0">
                  {isCompleted ? (
                    <div className="w-6 h-6 bg-robinEggBlue bg-opacity-30 rounded-full flex items-center justify-center ring-2 ring-robinEggBlue">
                      <CheckCircle className="w-5 h-5 text-robinEggBlue" />
                    </div>
                  ) : isError ? (
                    <div className="w-6 h-6 bg-red-700 bg-opacity-30 rounded-full flex items-center justify-center ring-2 ring-red-500">
                      <span className="text-red-400 font-bold text-lg">!</span>
                    </div>
                  ) : isActive ? (
                    <div className="w-6 h-6 relative">
                      <div className="w-6 h-6 rounded-full border-2 border-slateBlue border-t-transparent animate-spin absolute"></div>
                      <div className="w-6 h-6 rounded-full border-2 border-robinEggBlue border-b-transparent animate-spin absolute" style={{ animationDuration: '1.2s', animationDirection: 'reverse' }}></div>
                    </div>
                  ) : ( // Pending
                    <div className="w-6 h-6 rounded-full border-2 border-lightGray border-opacity-40 flex items-center justify-center">
                      <span className="text-xs text-lightGray text-opacity-60">{index + 1}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0"> {/* Added min-w-0 for flex child truncation */}
                  <div className="flex items-center justify-between">
                    <h4 className={cn(
                      "font-comfortaa font-bold truncate", // Added truncate
                      isActive && "text-slateBlue",
                      isCompleted && "text-robinEggBlue",
                      isError && "text-red-400", // Brighter red for error title
                      isPending && "text-lightGray text-opacity-80"
                    )}>
                      {step.title}
                    </h4>
                    
                    {step.status === 'in-progress' && step.progress !== undefined && (
                      <span className="text-sm text-lightGray flex-shrink-0 ml-2">{step.progress}%</span>
                    )}
                  </div>
                  
                  <p className={cn(
                    "text-sm mt-1 text-lightGray text-opacity-70",
                    (isActive || isCompleted || isError) && "text-opacity-90" // Slightly more visible for active/done
                  )}>
                    {step.description}
                  </p>
                  
                  {isActive && step.progress !== undefined && (
                    <div className="relative h-2 w-full bg-berkeleyBlue bg-opacity-40 rounded-full overflow-hidden mt-3">
                      <div 
                        className="absolute h-full bg-gradient-to-r from-slateBlue to-robinEggBlue transition-all duration-300 ease-out rounded-full"
                        style={{ width: `${step.progress}%` }}
                      />
                    </div>
                  )}
                  
                  {step.details && step.details.length > 0 && (
                    <>
                      <button 
                        onClick={() => toggleDetails(step.id)}
                        className="mt-2 text-xs text-slateBlue hover:text-robinEggBlue flex items-center"
                      >
                        {isDetailsExpanded ? <ChevronUp className="w-3 h-3 mr-1" /> : <ChevronDown className="w-3 h-3 mr-1" />}
                        {isDetailsExpanded ? 'Hide Details' : 'Show Details'} ({step.details.length})
                      </button>
                      <div 
                        className={cn(
                          "overflow-hidden transition-all duration-500 ease-in-out",
                          isDetailsExpanded ? "max-h-96 opacity-100 mt-2" : "max-h-0 opacity-0"
                        )}
                      >
                        <div className="pt-1 space-y-1 text-xs text-lightGray bg-black bg-opacity-10 p-2 rounded-md">
                          {step.details.map((detail, idx) => (
                            <div key={idx} className="flex items-start">
                              <span className="mr-2 text-slateBlue">•</span>
                              <span className="break-all">{detail}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
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
    description: 'Interpreting your app requirements and features.',
    icon: <Edit className="w-full h-full"/>, // Ensure icons are sized if used directly
    status: 'pending',
    details: [],
  },
  {
    id: 'planning',
    title: 'Planning Architecture',
    description: 'Designing the structure, components, and data models.',
    icon: <Zap className="w-full h-full"/>,
    status: 'pending',
    details: [],
  },
  {
    id: 'frontend',
    title: 'Generating Frontend',
    description: 'Creating UI components, views, and client-side logic.',
    icon: <Code className="w-full h-full"/>,
    status: 'pending',
    details: [],
  },
  {
    id: 'backend',
    title: 'Generating Backend',
    description: 'Building API endpoints, server logic, and authentication.',
    icon: <Server className="w-full h-full"/>,
    status: 'pending',
    details: [],
  },
  {
    id: 'database',
    title: 'Setting Up Database',
    description: 'Creating schema, models, and initial data migrations.',
    icon: <Database className="w-full h-full"/>,
    status: 'pending',
    details: [],
  },
  {
    id: 'packaging',
    title: 'Packaging Application',
    description: 'Bundling assets, creating deployment scripts, and preparing for download.',
    icon: <FileStack className="w-full h-full"/>,
    status: 'pending',
    details: [],
  },
  {
    id: 'testing',
    title: 'Finalizing & Verification',
    description: 'Running automated checks and ensuring everything works as expected.',
    icon: <FileType className="w-full h-full"/>,
    status: 'pending',
    details: [],
  }
];
