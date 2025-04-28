'use client'

import React from 'react'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { Download, Terminal, Code, FolderTree } from 'lucide-react'

export default function DemoPreview() {
  return (
    <section className="py-24 relative">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-richBlack via-berkeleyBlue/20 to-richBlack pointer-events-none" />
      
      <Container className="relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">See The Magic In Action</span>
          </h2>
          <p className="text-lightGray max-w-2xl mx-auto">
            Watch as OptimusCode transforms text into a complete, working application in minutes.
          </p>
        </div>
        
        <div className="glassmorphism rounded-xl overflow-hidden shadow-md border border-slateBlue/30 transition-all hover:shadow-glow hover:border-slateBlue/50 duration-300">
          <div className="bg-richBlack/80 p-2 border-b border-slateBlue/30 flex items-center">
            <div className="flex space-x-2 mr-4">
              <div className="w-3 h-3 rounded-full bg-red-500/70"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/70"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/70"></div>
            </div>
            <div className="flex-1 text-center text-xs text-whiteSmoke/60 font-mono">
              optimuscode-terminal
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slateBlue/30">
            {/* Left Side - Input & Generation Logs */}
            <div className="p-5 bg-richBlack/60">
              <div className="flex items-center text-robinEggBlue text-sm mb-3">
                <Terminal size={16} className="mr-2" />
                <span>Input & Generation</span>
              </div>
              
              <div className="font-mono text-sm text-whiteSmoke/80 space-y-3">
                <div>
                  <span className="text-slateBlue">$</span>
                  <span className="text-whiteSmoke ml-2">optimuscode generate</span>
                </div>
                
                <div>
                  <span className="text-slateBlue">&gt;</span>
                  <span className="text-robinEggBlue ml-2">Enter your app description:</span>
                </div>
                
                <div className="pl-4 text-whiteSmoke border-l-2 border-slateBlue/40 py-1">
                  Build me a task management tool with login and drag-and-drop Kanban.
                </div>
                
                <div>
                  <span className="text-slateBlue">&gt;</span>
                  <span className="text-robinEggBlue ml-2">Analyzing requirements...</span>
                </div>
                
                <div className="pl-4 text-whiteSmoke/60 space-y-1">
                  <div className="flex items-start">
                    <div className="text-robinEggBlue mr-2">✓</div>
                    <div>Authentication system required</div>
                  </div>
                  <div className="flex items-start">
                    <div className="text-robinEggBlue mr-2">✓</div>
                    <div>Database for tasks and users</div>
                  </div>
                  <div className="flex items-start">
                    <div className="text-robinEggBlue mr-2">✓</div>
                    <div>Drag-and-drop functionality</div>
                  </div>
                  <div className="flex items-start">
                    <div className="text-robinEggBlue mr-2">✓</div>
                    <div>Kanban board layout</div>
                  </div>
                </div>
                
                <div>
                  <span className="text-slateBlue">&gt;</span>
                  <span className="text-robinEggBlue ml-2">Generating files...</span>
                </div>
                
                <div className="pl-4 text-whiteSmoke/60">
                  <div className="flex items-center">
                    <div className="w-4 h-4 mr-2 rounded-full border-2 border-t-transparent border-slateBlue animate-spin"></div>
                    <div>Creating project structure...</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Side - Output Preview */}
            <div className="p-5 bg-berkeleyBlue/30 min-h-[350px]">
              <div className="flex items-center text-robinEggBlue text-sm mb-3">
                <FolderTree size={16} className="mr-2" />
                <span>Project Output</span>
              </div>
              
              <div className="font-mono text-sm space-y-3">
                <div>
                  <span className="text-slateBlue">&gt;</span>
                  <span className="text-robinEggBlue ml-2">Project structure:</span>
                </div>
                
                <div className="pl-2 text-whiteSmoke/80">
                  <div className="flex items-start">
                    <div className="text-robinEggBlue mr-2">📁</div>
                    <div>kanban-task-manager/</div>
                  </div>
                  <div className="flex items-start pl-6">
                    <div className="text-robinEggBlue mr-2">📁</div>
                    <div>frontend/</div>
                  </div>
                  <div className="flex items-start pl-10">
                    <div className="text-robinEggBlue mr-2">📄</div>
                    <div>package.json</div>
                  </div>
                  <div className="flex items-start pl-10">
                    <div className="text-robinEggBlue mr-2">📁</div>
                    <div>src/</div>
                  </div>
                  <div className="flex items-start pl-14">
                    <div className="text-robinEggBlue mr-2">📁</div>
                    <div>components/</div>
                  </div>
                  <div className="flex items-start pl-18">
                    <div className="text-robinEggBlue mr-2">📄</div>
                    <div>Board.tsx</div>
                  </div>
                  <div className="flex items-start pl-18">
                    <div className="text-robinEggBlue mr-2">📄</div>
                    <div>Column.tsx</div>
                  </div>
                  <div className="flex items-start pl-18">
                    <div className="text-robinEggBlue mr-2">📄</div>
                    <div>Task.tsx</div>
                  </div>
                  <div className="flex items-start pl-6">
                    <div className="text-robinEggBlue mr-2">📁</div>
                    <div>backend/</div>
                  </div>
                  <div className="flex items-start pl-10">
                    <div className="text-robinEggBlue mr-2">📄</div>
                    <div>server.js</div>
                  </div>
                  <div className="flex items-start pl-10">
                    <div className="text-robinEggBlue mr-2">📁</div>
                    <div>models/</div>
                  </div>
                  <div className="flex items-start pl-14">
                    <div className="text-robinEggBlue mr-2">📄</div>
                    <div>User.js</div>
                  </div>
                  <div className="flex items-start pl-14">
                    <div className="text-robinEggBlue mr-2">📄</div>
                    <div>Task.js</div>
                  </div>
                  <div className="flex items-start pl-6">
                    <div className="text-robinEggBlue mr-2">📄</div>
                    <div>README.md</div>
                  </div>
                  <div className="flex items-start pl-6">
                    <div className="text-robinEggBlue mr-2">📄</div>
                    <div>.env.example</div>
                  </div>
                </div>
                
                <div>
                  <span className="text-slateBlue">&gt;</span>
                  <span className="text-robinEggBlue ml-2">Build complete!</span>
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
