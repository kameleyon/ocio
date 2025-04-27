import React from 'react'
import { Card } from '@/components/ui/card'
import { Check, Clock, Code, Database, Layers, PackageOpen, Server } from 'lucide-react'

type GenerationStatus = 'idle' | 'pending' | 'generating' | 'completed' | 'failed'

interface LogStep {
  id: string
  title: string
  description: string
  status: 'completed' | 'in-progress' | 'pending'
  icon: React.ReactNode
  timestamp?: string
}

interface GenerationLogProps {
  prompt: string
  status: GenerationStatus
  projectName?: string
  logs: LogStep[]
}

export default function GenerationLog({ prompt, status, projectName, logs }: GenerationLogProps) {
  return (
    <Card className="w-full h-full p-4 md:p-6 bg-berkeleyBlue/30 backdrop-blur-md border-slateBlue/30 rounded-xl overflow-y-auto">
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-lightGray">Your Prompt</h3>
          <p className="mt-1 text-whiteSmoke">{prompt || "Enter a prompt to get started"}</p>
        </div>

        {projectName && (
          <div>
            <h3 className="text-sm font-medium text-lightGray">Project Name</h3>
            <p className="mt-1 text-robinEggBlue font-medium">{projectName}</p>
          </div>
        )}

        {(status !== 'idle') && (
          <div>
            <h3 className="text-sm font-medium text-lightGray mb-3">Generation Progress</h3>
            <ul className="space-y-4">
              {logs.map((step) => (
                <li key={step.id} className="flex items-start gap-3">
                  <div className={`mt-0.5 p-1.5 rounded-md flex-shrink-0 ${
                    step.status === 'completed' 
                      ? 'bg-robinEggBlue/20 text-robinEggBlue' 
                      : step.status === 'in-progress'
                      ? 'bg-slateBlue/20 text-slateBlue animate-pulse' 
                      : 'bg-lightGray/10 text-lightGray'
                  }`}>
                    {step.icon}
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between">
                      <p className={`font-medium ${
                        step.status === 'completed' 
                          ? 'text-whiteSmoke' 
                          : step.status === 'in-progress'
                          ? 'text-slateBlue' 
                          : 'text-lightGray'
                      }`}>
                        {step.title}
                      </p>
                      {step.timestamp && (
                        <span className="text-xs text-lightGray">{step.timestamp}</span>
                      )}
                    </div>
                    <p className="text-sm text-lightGray">{step.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  )
}

export function getDefaultLogs(status: GenerationStatus): LogStep[] {
  const now = new Date()
  
  // Format time as HH:MM:SS
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    })
  }
  
  // Basic logs for all statuses
  const logs: LogStep[] = [
    {
      id: 'analyze',
      title: 'Analyzing Prompt',
      description: 'Parsing requirements and features',
      status: status === 'idle' ? 'pending' : 'completed',
      icon: <Layers className="h-4 w-4" />,
      timestamp: status !== 'idle' ? formatTime(now) : undefined
    },
    {
      id: 'structure',
      title: 'Designing Architecture',
      description: 'Planning project structure and components',
      status: status === 'idle' || status === 'pending' ? 'pending' : 'completed',
      icon: <Code className="h-4 w-4" />,
      timestamp: status !== 'idle' && status !== 'pending' ? formatTime(new Date(now.getTime() + 1000)) : undefined
    },
    {
      id: 'frontend',
      title: 'Generating Frontend',
      description: 'Creating UI components and pages',
      status: status === 'idle' || status === 'pending' ? 'pending' : status === 'generating' ? 'in-progress' : 'completed',
      icon: <PackageOpen className="h-4 w-4" />,
      timestamp: status === 'completed' || status === 'failed' ? formatTime(new Date(now.getTime() + 2000)) : undefined
    },
    {
      id: 'backend',
      title: 'Generating Backend',
      description: 'Setting up API endpoints and services',
      status: status === 'idle' || status === 'pending' || (status === 'generating' && Math.random() > 0.5) ? 'pending' : status === 'generating' ? 'in-progress' : 'completed',
      icon: <Server className="h-4 w-4" />,
      timestamp: status === 'completed' || status === 'failed' ? formatTime(new Date(now.getTime() + 3000)) : undefined
    },
    {
      id: 'database',
      title: 'Setting Up Database',
      description: 'Creating schemas and relationships',
      status: status === 'idle' || status === 'pending' || status === 'generating' ? 'pending' : 'completed',
      icon: <Database className="h-4 w-4" />,
      timestamp: status === 'completed' || status === 'failed' ? formatTime(new Date(now.getTime() + 4000)) : undefined
    },
    {
      id: 'packaging',
      title: 'Packaging Project',
      description: 'Preparing zip file for download',
      status: status === 'idle' || status === 'pending' || status === 'generating' ? 'pending' : 'completed',
      icon: <Check className="h-4 w-4" />,
      timestamp: status === 'completed' || status === 'failed' ? formatTime(new Date(now.getTime() + 5000)) : undefined
    },
  ]
  
  return logs
}
