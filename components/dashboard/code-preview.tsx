import React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, RefreshCw } from 'lucide-react'
import { ProjectDetails } from '@/lib/services/ai-service'

interface CodePreviewProps {
  status: 'idle' | 'pending' | 'generating' | 'completed' | 'failed'
  projectDetails?: ProjectDetails
  downloadUrl?: string
  onRegenerate?: () => void
}

export default function CodePreview({ status, projectDetails, downloadUrl, onRegenerate }: CodePreviewProps) {
  if (status === 'idle') {
    return (
      <Card className="w-full h-full p-4 md:p-6 bg-berkeleyBlue/30 backdrop-blur-md border-slateBlue/30 rounded-xl flex flex-col justify-center items-center">
        <div className="text-center text-lightGray">
          <h3 className="text-xl font-comfortaa mb-2">Ready to generate</h3>
          <p className="text-sm">Enter a prompt to start building your app</p>
        </div>
      </Card>
    )
  }

  if (status === 'pending' || status === 'generating') {
    return (
      <Card className="w-full h-full p-4 md:p-6 bg-berkeleyBlue/30 backdrop-blur-md border-slateBlue/30 rounded-xl flex flex-col justify-center items-center">
        <div className="text-center text-lightGray">
          <div className="mb-4">
            <div className="w-12 h-12 border-4 border-slateBlue/30 border-t-slateBlue rounded-full animate-spin mx-auto"></div>
          </div>
          <h3 className="text-xl font-comfortaa mb-2">Building your app</h3>
          <p className="text-sm">This may take a minute...</p>
        </div>
      </Card>
    )
  }

  if (status === 'failed') {
    return (
      <Card className="w-full h-full p-4 md:p-6 bg-berkeleyBlue/30 backdrop-blur-md border-slateBlue/30 rounded-xl flex flex-col justify-center items-center">
        <div className="text-center text-lightGray">
          <h3 className="text-xl font-comfortaa mb-2 text-destructive">Generation failed</h3>
          <p className="text-sm mb-4">Something went wrong during generation</p>
          {onRegenerate && (
            <Button 
              onClick={onRegenerate}
              className="bg-slateBlue hover:bg-slateBlue/80 text-whiteSmoke"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try again
            </Button>
          )}
        </div>
      </Card>
    )
  }

  return (
    <Card className="w-full h-full bg-berkeleyBlue/30 backdrop-blur-md border-slateBlue/30 rounded-xl flex flex-col">
      <div className="p-4 border-b border-slateBlue/20 flex justify-between items-center">
        <h3 className="font-comfortaa text-whiteSmoke">Project Preview</h3>
        {downloadUrl && (
          <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
            <Button className="bg-gradient-to-r from-slateBlue to-robinEggBlue hover:from-slateBlue/90 hover:to-robinEggBlue/90 text-whiteSmoke transition-all duration-200 shadow-glow">
              <Download className="h-4 w-4 mr-2" />
              Download .zip
            </Button>
          </a>
        )}
      </div>
      
      <div className="p-4 md:p-6 overflow-y-auto flex-grow">
        {projectDetails && (
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-lightGray mb-1">Project Name</h4>
              <p className="text-whiteSmoke font-medium">{projectDetails.name}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-lightGray mb-1">Description</h4>
              <p className="text-whiteSmoke">{projectDetails.description}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-lightGray mb-2">Tech Stack</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-richBlack/40 p-3 rounded-lg">
                  <p className="text-sm text-lightGray mb-1">Frontend</p>
                  <p className="text-whiteSmoke">{projectDetails.techStack.frontend}</p>
                </div>
                <div className="bg-richBlack/40 p-3 rounded-lg">
                  <p className="text-sm text-lightGray mb-1">Backend</p>
                  <p className="text-whiteSmoke">{projectDetails.techStack.backend}</p>
                </div>
                <div className="bg-richBlack/40 p-3 rounded-lg">
                  <p className="text-sm text-lightGray mb-1">Database</p>
                  <p className="text-whiteSmoke">{projectDetails.techStack.database}</p>
                </div>
                <div className="bg-richBlack/40 p-3 rounded-lg">
                  <p className="text-sm text-lightGray mb-1">Deployment</p>
                  <p className="text-whiteSmoke">{projectDetails.techStack.deployment}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-lightGray mb-2">Project Structure</h4>
              <div className="bg-richBlack/40 p-3 rounded-lg">
                <pre className="text-whiteSmoke font-mono text-sm overflow-x-auto whitespace-pre-wrap">
                  {projectDetails.structure.join('\n')}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
