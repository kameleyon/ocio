import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Download, 
  RefreshCw, 
  Code, 
  FilesIcon, 
  FolderIcon, 
  Server, 
  Database,
  ChevronDown,
  ChevronRight,
  FileCode,
  MonitorIcon
} from 'lucide-react'
import { ProjectDetails } from '@/lib/services/ai-service'

interface CodePreviewProps {
  status: 'idle' | 'pending' | 'generating' | 'completed' | 'failed'
  projectDetails?: ProjectDetails
  downloadUrl?: string
  onRegenerate?: () => void
  onDownload?: () => void
}

export default function CodePreview({ 
  status, 
  projectDetails, 
  downloadUrl, 
  onRegenerate,
  onDownload
}: CodePreviewProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'structure' | 'preview'>('overview')
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['src', 'public']))

  // Toggle folder expansion state
  const toggleFolder = (path: string) => {
    const newExpandedFolders = new Set(expandedFolders)
    if (expandedFolders.has(path)) {
      newExpandedFolders.delete(path)
    } else {
      newExpandedFolders.add(path)
    }
    setExpandedFolders(newExpandedFolders)
  }

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
          <h3 className="text-xl font-comfortaa mb-2 text-red-400">Generation failed</h3>
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

  // Render project structure as a tree
  const renderFileTree = () => {
    if (!projectDetails || !projectDetails.structure || projectDetails.structure.length === 0) {
      return <p className="text-lightGray">No structure available</p>
    }

    // Simplified parse of the file structure
    // Format example: "📁 project-name/", "├── 📁 src/", "│   ├── 📄 App.jsx"
    
    // Function to determine the indentation level based on pipe characters
    const getIndentationLevel = (line: string) => {
      const match = line.match(/^(│\s+)*├──\s+/ || line.match(/^(│\s+)*└──\s+/))
      return match ? match[0].length / 4 : 0 // Assuming each level is 4 chars (│   )
    }

    // Function to get the file/folder name from a line
    const getName = (line: string) => {
      const match = line.match(/(?:├──|└──)\s+(?:📁|📄)\s+(.+)/)
      return match ? match[1] : line.replace(/^📁\s+/, '') // Handle root folder
    }
    
    // Function to determine if a line is a folder
    const isFolder = (line: string) => line.includes('📁')
    
    // Generate file tree structure
    const structure = projectDetails.structure.map((line, index) => {
      const name = getName(line)
      const level = index === 0 ? 0 : getIndentationLevel(line)
      const isDir = isFolder(line)
      const path = name.replace(/\/$/, '') // Remove trailing slash for folders
      
      // Apply indentation based on level
      const indentStyle = { paddingLeft: `${level * 12}px` }
      
      if (isDir) {
        const isExpanded = expandedFolders.has(path)
        return (
          <div key={index} className="py-1 flex items-center" style={indentStyle}>
            <button 
              onClick={() => toggleFolder(path)}
              className="mr-1 text-lightGray hover:text-whiteSmoke"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
            <FolderIcon className="h-4 w-4 mr-1.5 text-slateBlue" />
            <span className="text-whiteSmoke">{path}</span>
          </div>
        )
      } else {
        return (
          <div key={index} className="py-1 flex items-center" style={indentStyle}>
            <span className="w-4 mr-1"></span> {/* Spacer to align with folders */}
            <FileCode className="h-4 w-4 mr-1.5 text-robinEggBlue" />
            <span className="text-lightGray">{name}</span>
          </div>
        )
      }
    })
    
    return (
      <div className="bg-richBlack/40 p-3 rounded-lg overflow-y-auto max-h-80 font-mono text-sm">
        {structure}
      </div>
    )
  }

  return (
    <Card className="w-full h-full bg-berkeleyBlue/30 backdrop-blur-md border-slateBlue/30 rounded-xl flex flex-col">
      <div className="p-4 border-b border-slateBlue/20 flex justify-between items-center">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center text-sm font-medium transition-colors ${
              activeTab === 'overview' 
                ? 'text-whiteSmoke' 
                : 'text-lightGray hover:text-whiteSmoke/80'
            }`}
          >
            <Code className="mr-1.5 h-4 w-4" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('structure')}
            className={`flex items-center text-sm font-medium transition-colors ${
              activeTab === 'structure' 
                ? 'text-whiteSmoke' 
                : 'text-lightGray hover:text-whiteSmoke/80'
            }`}
          >
            <FilesIcon className="mr-1.5 h-4 w-4" />
            Structure
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center text-sm font-medium transition-colors ${
              activeTab === 'preview' 
                ? 'text-whiteSmoke' 
                : 'text-lightGray hover:text-whiteSmoke/80'
            }`}
          >
            <MonitorIcon className="mr-1.5 h-4 w-4" />
            Preview
          </button>
        </div>
        {downloadUrl && (
          <Button 
            className="bg-gradient-to-r from-slateBlue to-robinEggBlue hover:from-slateBlue/90 hover:to-robinEggBlue/90 text-whiteSmoke transition-all duration-200 shadow-glow"
            onClick={onDownload}
          >
            <Download className="h-4 w-4 mr-2" />
            Download .zip
          </Button>
        )}
      </div>
      
      <div className="p-4 md:p-6 overflow-y-auto flex-grow">
        {projectDetails && activeTab === 'overview' && (
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
                  <div className="flex items-center gap-2">
                    <MonitorIcon className="h-4 w-4 text-robinEggBlue" />
                    <p className="text-sm text-lightGray">Frontend</p>
                  </div>
                  <p className="text-whiteSmoke mt-1">{projectDetails.techStack.frontend}</p>
                </div>
                <div className="bg-richBlack/40 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Server className="h-4 w-4 text-robinEggBlue" />
                    <p className="text-sm text-lightGray">Backend</p>
                  </div>
                  <p className="text-whiteSmoke mt-1">{projectDetails.techStack.backend}</p>
                </div>
                <div className="bg-richBlack/40 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-robinEggBlue" />
                    <p className="text-sm text-lightGray">Database</p>
                  </div>
                  <p className="text-whiteSmoke mt-1">{projectDetails.techStack.database}</p>
                </div>
                <div className="bg-richBlack/40 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Code className="h-4 w-4 text-robinEggBlue" />
                    <p className="text-sm text-lightGray">Deployment</p>
                  </div>
                  <p className="text-whiteSmoke mt-1">{projectDetails.techStack.deployment}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-lightGray mb-1">Features</h4>
              <ul className="space-y-1 text-whiteSmoke list-disc list-inside">
                {projectDetails.description.split('.').map((sentence, index) => {
                  const trimmed = sentence.trim()
                  if (trimmed && trimmed.length > 10) {
                    return <li key={index}>{trimmed}</li>
                  }
                  return null
                }).filter(Boolean)}
              </ul>
            </div>
          </div>
        )}

        {projectDetails && activeTab === 'structure' && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-lightGray mb-2">Project Structure</h4>
            {renderFileTree()}
          </div>
        )}

        {projectDetails && activeTab === 'preview' && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-lightGray mb-2">Code Preview</h4>
            <div className="bg-richBlack/40 rounded-lg overflow-hidden border border-slateBlue/20">
              <div className="border-b border-slateBlue/20 p-2 bg-richBlack/60 flex justify-between items-center">
                <span className="text-xs text-lightGray">📄 index.html</span>
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/40"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/40"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/40"></div>
                </div>
              </div>
              <pre className="p-4 text-lightGray font-mono text-sm overflow-x-auto">
                <code>
                  {`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${projectDetails.name}</title>
    <link rel="stylesheet" href="/styles.css">
</head>
<body>
    <div id="root"></div>
    <script src="/main.js"></script>
</body>
</html>`}
                </code>
              </pre>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 mt-4">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-lightGray mb-2">Getting Started</h4>
                <div className="bg-richBlack/40 p-4 rounded-lg font-mono text-sm text-lightGray">
                  <p className="mb-2"># Install dependencies</p>
                  <p className="text-robinEggBlue mb-4">npm install</p>
                  
                  <p className="mb-2"># Start development server</p>
                  <p className="text-robinEggBlue mb-4">npm run dev</p>
                  
                  <p className="mb-2"># Build for production</p>
                  <p className="text-robinEggBlue">npm run build</p>
                </div>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-lightGray mb-2">Environment Setup</h4>
                <div className="bg-richBlack/40 p-4 rounded-lg font-mono text-sm text-lightGray">
                  <p className="mb-2"># .env.example</p>
                  {projectDetails.techStack.database === 'MongoDB' ? (
                    <p className="text-robinEggBlue mb-2">MONGODB_URI=mongodb://localhost:27017/my_database</p>
                  ) : projectDetails.techStack.database === 'PostgreSQL' ? (
                    <p className="text-robinEggBlue mb-2">DATABASE_URL=postgresql://user:password@localhost:5432/my_database</p>
                  ) : (
                    <p className="text-robinEggBlue mb-2">DATABASE_URL=your_database_connection_string</p>
                  )}
                  <p className="text-robinEggBlue mb-2">PORT=3000</p>
                  <p className="text-robinEggBlue">NODE_ENV=development</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
