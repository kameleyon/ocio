'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, Code, Files, TerminalSquare } from 'lucide-react'

interface PreviewProps {
  projectName: string | null
  files: string[]
  downloadUrl: string | null
  isGenerating: boolean
  activeTab: 'files' | 'preview' | 'terminal'
  onTabChange: (tab: 'files' | 'preview' | 'terminal') => void
}

export default function Preview({ 
  projectName, 
  files, 
  downloadUrl, 
  isGenerating,
  activeTab,
  onTabChange
}: PreviewProps) {
  return (
    <Card isGlass={true} className="h-full flex flex-col overflow-hidden">
      {/* Header with tabs */}
      <div className="flex items-center justify-between border-b border-slateBlue/20 p-3">
        <div className="flex space-x-1">
          <Button
            variant={activeTab === 'files' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onTabChange('files')}
            className="px-3"
          >
            <Files className="h-4 w-4 mr-2" />
            Files
          </Button>
          <Button
            variant={activeTab === 'preview' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onTabChange('preview')}
            className="px-3"
          >
            <Code className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button
            variant={activeTab === 'terminal' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onTabChange('terminal')}
            className="px-3"
          >
            <TerminalSquare className="h-4 w-4 mr-2" />
            Logs
          </Button>
        </div>
        
        {downloadUrl && (
          <Button 
            variant="gradient" 
            size="sm"
            className="px-3"
            asChild
          >
            <a href={downloadUrl} download>
              <Download className="h-4 w-4 mr-2" />
              Download .zip
            </a>
          </Button>
        )}
      </div>
      
      {/* Content area */}
      <div className="flex-1 overflow-auto p-4 bg-richBlack/50">
        {isGenerating ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slateBlue mb-4"></div>
            <p className="text-lightGray text-center">
              {projectName 
                ? `Generating ${projectName}...` 
                : 'Analyzing requirements...'}
            </p>
          </div>
        ) : activeTab === 'files' ? (
          <div className="font-mono text-sm">
            {files.length > 0 ? (
              <div className="space-y-1">
                {files.map((file, index) => (
                  <div key={index} className="text-whiteSmoke/80">
                    {file}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-6">
                <p className="text-lightGray">
                  Enter a prompt to generate your application
                </p>
              </div>
            )}
          </div>
        ) : activeTab === 'preview' ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <Code className="h-12 w-12 text-slateBlue mx-auto mb-4 opacity-50" />
              <h3 className="text-whiteSmoke font-comfortaa mb-2">App Preview</h3>
              <p className="text-lightGray max-w-md">
                Preview will be available after generation is complete
              </p>
            </div>
          </div>
        ) : (
          <div className="font-mono text-sm text-lightGray whitespace-pre-wrap">
            {projectName ? (
              <>
                <div className="text-robinEggBlue mb-2">&gt; Project: {projectName}</div>
                <div className="mb-2">&gt; Initializing project structure...</div>
                <div className="mb-2">&gt; Setting up dependencies...</div>
                <div className="mb-2">&gt; Configuring build system...</div>
                <div className="mb-2">&gt; Building components...</div>
                <div className="mb-2">&gt; Finalizing application...</div>
              </>
            ) : (
              <div className="text-center">
                <p>No logs available yet</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}
