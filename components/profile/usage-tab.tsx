"use client"

import React from 'react'
import { Profile } from '@/lib/services/auth-service'
import { Card } from '@/components/ui/card'
import { BarChart2, Clock, Code, Database, Download, FileCode, Zap } from 'lucide-react'

interface UsageTabProps {
  profile: Profile
}

// Mock usage data
const mockUsageData = (profile: Profile) => ({
  appGenerations: profile?.generation_count || 15,
  totalLimit: profile?.subscription_tier === 'free' ? 5 : profile?.subscription_tier === 'pro' ? 50 : 999,
  downloadedApps: 10,
  tokens: 45,
  tokenLimit: 100,
  averageGenerationTime: '3m 42s',
  favoriteStack: 'React + Node.js + Supabase',
  mostUsedFeature: 'Authentication'
})

// Mock monthly history data
const MONTHLY_HISTORY = [
  { month: 'Nov', generations: 3 },
  { month: 'Dec', generations: 5 },
  { month: 'Jan', generations: 8 },
  { month: 'Feb', generations: 12 },
  { month: 'Mar', generations: 10 },
  { month: 'Apr', generations: 15 }
]

// Mock recent projects
const RECENT_PROJECTS = [
  {
    id: 'proj-001',
    name: 'Task Manager',
    date: '2025-04-25',
    features: ['Authentication', 'Drag-and-Drop', 'API Integration'],
    stack: 'React + Express + MongoDB'
  },
  {
    id: 'proj-002',
    name: 'E-commerce Dashboard',
    date: '2025-04-18',
    features: ['Analytics', 'User Management', 'Payment Integration'],
    stack: 'Next.js + Supabase'
  },
  {
    id: 'proj-003',
    name: 'Personal Blog',
    date: '2025-04-10',
    features: ['Content Management', 'Comments', 'SEO'],
    stack: 'Next.js + Supabase'
  }
]

export default function UsageTab({ profile }: UsageTabProps) {
  const MONTHLY_USAGE = mockUsageData(profile)
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card className="p-4 bg-berkeleyBlue/40 backdrop-blur-md border border-slateBlue/20 rounded-xl">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-lightGray text-sm">App Generations</p>
              <div className="flex items-baseline gap-1 mt-1">
                <p className="text-2xl font-bold text-whiteSmoke">{MONTHLY_USAGE.appGenerations}</p>
                <p className="text-lightGray text-xs">/ {MONTHLY_USAGE.totalLimit}</p>
              </div>
            </div>
            <div className="h-10 w-10 rounded-full bg-slateBlue/20 flex items-center justify-center">
              <Code className="h-5 w-5 text-robinEggBlue" />
            </div>
          </div>
          <div className="mt-3 h-2 bg-slateBlue/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-robinEggBlue"
              style={{ width: `${(MONTHLY_USAGE.appGenerations / MONTHLY_USAGE.totalLimit) * 100}%` }}
            />
          </div>
          <p className="text-lightGray text-xs mt-1">
            {MONTHLY_USAGE.totalLimit - MONTHLY_USAGE.appGenerations} generations remaining this month
          </p>
        </Card>
        
        <Card className="p-4 bg-berkeleyBlue/40 backdrop-blur-md border border-slateBlue/20 rounded-xl">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-lightGray text-sm">Tokens</p>
              <div className="flex items-baseline gap-1 mt-1">
                <p className="text-2xl font-bold text-whiteSmoke">{MONTHLY_USAGE.tokens}</p>
                <p className="text-lightGray text-xs">/ {MONTHLY_USAGE.tokenLimit}</p>
              </div>
            </div>
            <div className="h-10 w-10 rounded-full bg-slateBlue/20 flex items-center justify-center">
              <Zap className="h-5 w-5 text-robinEggBlue" />
            </div>
          </div>
          <div className="mt-3 h-2 bg-slateBlue/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-robinEggBlue"
              style={{ width: `${(MONTHLY_USAGE.tokens / MONTHLY_USAGE.tokenLimit) * 100}%` }}
            />
          </div>
          <p className="text-lightGray text-xs mt-1">
            {MONTHLY_USAGE.tokenLimit - MONTHLY_USAGE.tokens} tokens remaining
          </p>
        </Card>
        
        <Card className="p-4 bg-berkeleyBlue/40 backdrop-blur-md border border-slateBlue/20 rounded-xl">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-lightGray text-sm">Downloaded Apps</p>
              <p className="text-2xl font-bold text-whiteSmoke mt-1">
                {MONTHLY_USAGE.downloadedApps}
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-slateBlue/20 flex items-center justify-center">
              <Download className="h-5 w-5 text-robinEggBlue" />
            </div>
          </div>
          <p className="text-lightGray text-xs mt-6">
            {((MONTHLY_USAGE.downloadedApps / MONTHLY_USAGE.appGenerations) * 100).toFixed(0)}% download rate
          </p>
        </Card>
        
        <Card className="p-4 bg-berkeleyBlue/40 backdrop-blur-md border border-slateBlue/20 rounded-xl">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-lightGray text-sm">Avg. Generation Time</p>
              <p className="text-2xl font-bold text-whiteSmoke mt-1">
                {MONTHLY_USAGE.averageGenerationTime}
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-slateBlue/20 flex items-center justify-center">
              <Clock className="h-5 w-5 text-robinEggBlue" />
            </div>
          </div>
          <p className="text-lightGray text-xs mt-6">
            Based on your last 10 generations
          </p>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6 bg-berkeleyBlue/40 backdrop-blur-md border border-slateBlue/20 rounded-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-comfortaa font-semibold text-whiteSmoke">
              Monthly Activity
            </h3>
            <div className="h-8 w-8 rounded-full bg-slateBlue/20 flex items-center justify-center">
              <BarChart2 className="h-4 w-4 text-robinEggBlue" />
            </div>
          </div>
          
          <div className="h-48 flex items-end justify-between">
            {MONTHLY_HISTORY.map((month) => (
              <div key={month.month} className="flex flex-col items-center gap-2 flex-1">
                <div 
                  className="w-full max-w-[30px] bg-slateBlue hover:bg-slateBlue/80 rounded-t transition-all"
                  style={{ height: `${(month.generations / 15) * 100}%` }}
                />
                <span className="text-xs text-lightGray">{month.month}</span>
              </div>
            ))}
          </div>
        </Card>
        
        <Card className="p-6 bg-berkeleyBlue/40 backdrop-blur-md border border-slateBlue/20 rounded-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-comfortaa font-semibold text-whiteSmoke">
              Usage Stats
            </h3>
            <div className="h-8 w-8 rounded-full bg-slateBlue/20 flex items-center justify-center">
              <Database className="h-4 w-4 text-robinEggBlue" />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-lightGray">Favorite Tech Stack</span>
                <span className="text-whiteSmoke font-medium">{MONTHLY_USAGE.favoriteStack}</span>
              </div>
              <div className="h-1 w-full bg-slateBlue/20 rounded-full mt-1">
                <div className="h-full w-3/4 bg-robinEggBlue rounded-full" />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-lightGray">Most Used Feature</span>
                <span className="text-whiteSmoke font-medium">{MONTHLY_USAGE.mostUsedFeature}</span>
              </div>
              <div className="h-1 w-full bg-slateBlue/20 rounded-full mt-1">
                <div className="h-full w-2/3 bg-robinEggBlue rounded-full" />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-lightGray">Backend Type</span>
                <span className="text-whiteSmoke font-medium">Node.js + Express</span>
              </div>
              <div className="h-1 w-full bg-slateBlue/20 rounded-full mt-1">
                <div className="h-full w-1/2 bg-robinEggBlue rounded-full" />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-lightGray">Database</span>
                <span className="text-whiteSmoke font-medium">Supabase</span>
              </div>
              <div className="h-1 w-full bg-slateBlue/20 rounded-full mt-1">
                <div className="h-full w-4/5 bg-robinEggBlue rounded-full" />
              </div>
            </div>
          </div>
        </Card>
      </div>
      
      <Card className="p-6 bg-berkeleyBlue/40 backdrop-blur-md border border-slateBlue/20 rounded-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-comfortaa font-semibold text-whiteSmoke">
            Recent Projects
          </h3>
          <div className="h-8 w-8 rounded-full bg-slateBlue/20 flex items-center justify-center">
            <FileCode className="h-4 w-4 text-robinEggBlue" />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slateBlue/20">
                <th className="text-left py-3 px-2 text-lightGray font-medium text-sm">Project Name</th>
                <th className="text-left py-3 px-2 text-lightGray font-medium text-sm">Date</th>
                <th className="text-left py-3 px-2 text-lightGray font-medium text-sm">Features</th>
                <th className="text-left py-3 px-2 text-lightGray font-medium text-sm">Tech Stack</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_PROJECTS.map((project) => (
                <tr key={project.id} className="border-b border-slateBlue/10 hover:bg-slateBlue/5">
                  <td className="py-3 px-2">
                    <div className="font-medium text-whiteSmoke">{project.name}</div>
                  </td>
                  <td className="py-3 px-2 text-lightGray">
                    {new Date(project.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex flex-wrap gap-1">
                      {project.features.map((feature, index) => (
                        <span 
                          key={index}
                          className="px-2 py-0.5 rounded-full text-xs bg-slateBlue/20 text-robinEggBlue"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-2 text-whiteSmoke">{project.stack}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
