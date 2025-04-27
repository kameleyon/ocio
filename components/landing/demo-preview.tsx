'use client'

import React from 'react'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

export default function DemoPreview() {
  return (
    <section className="py-20 bg-richBlack">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">See The Magic In Action</span>
          </h2>
          <p className="text-lightGray max-w-2xl mx-auto">
            Watch as OptimusCode transforms text into a complete, working application in minutes.
          </p>
        </div>
        
        <div className="glassmorphism rounded-xl overflow-hidden shadow-glow">
          <div className="bg-richBlack/80 p-2 border-b border-slateBlue/30">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500/70"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/70"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/70"></div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slateBlue/30">
            {/* Left Side - Input & Generation Logs */}
            <div className="p-4 bg-richBlack/60">
              <div className="font-mono text-sm text-whiteSmoke/80">
                <div className="text-robinEggBlue mb-2">&gt; Prompt:</div>
                <div className="mb-4 pl-4 text-whiteSmoke">
                  Build me a task management tool with login and drag-and-drop Kanban.
                </div>
                
                <div className="text-robinEggBlue mb-2">&gt; Analyzing requirements...</div>
                <div className="mb-2 pl-4 text-whiteSmoke/60">
                  <div>- Authentication system</div>
                  <div>- Database for tasks and users</div>
                  <div>- Drag-and-drop interface</div>
                  <div>- Kanban board layout</div>
                </div>
                
                <div className="text-robinEggBlue mb-2">&gt; Generating files...</div>
                <div className="mb-2 pl-4 text-whiteSmoke/60">
                  <div className="animate-pulse">Creating project structure...</div>
                </div>
              </div>
            </div>
            
            {/* Right Side - Output Preview */}
            <div className="p-4 bg-berkeleyBlue/30 min-h-[300px]">
              <div className="font-mono text-sm">
                <div className="text-robinEggBlue mb-2">&gt; Project structure:</div>
                
                <div className="pl-4 text-whiteSmoke/80">
                  <div>📁 kanban-task-manager/</div>
                  <div className="pl-4">📁 frontend/</div>
                  <div className="pl-8">📄 package.json</div>
                  <div className="pl-8">📁 src/</div>
                  <div className="pl-12">📁 components/</div>
                  <div className="pl-16">📄 Board.tsx</div>
                  <div className="pl-16">📄 Column.tsx</div>
                  <div className="pl-16">📄 Task.tsx</div>
                  <div className="pl-4">📁 backend/</div>
                  <div className="pl-8">📄 server.js</div>
                  <div className="pl-8">📁 models/</div>
                  <div className="pl-12">📄 User.js</div>
                  <div className="pl-12">📄 Task.js</div>
                  <div className="pl-4">📄 README.md</div>
                  <div className="pl-4">📄 .env.example</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Download Button */}
          <div className="bg-richBlack/80 p-4 border-t border-slateBlue/30 flex justify-end">
            <Button variant="gradient" size="default" className="group">
              <Download className="mr-2 h-4 w-4" />
              Download .zip
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}
