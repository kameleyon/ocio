'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowRight, Terminal } from 'lucide-react'
import Link from 'next/link'

export default function HeroSection() {
  const [prompt, setPrompt] = useState('')
  const [cursorVisible, setCursorVisible] = useState(true)
  const promptRef = useRef<HTMLInputElement>(null)

  // Example prompt for animation
  const examplePrompt = "Build me a task management tool with login and drag-and-drop Kanban."
  
  // Cursor blink effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible(v => !v)
    }, 600)
    
    return () => clearInterval(interval)
  }, [])
  
  // Typing animation
  useEffect(() => {
    let currentIndex = 0
    const typingInterval = setInterval(() => {
      if (currentIndex < examplePrompt.length) {
        setPrompt(examplePrompt.slice(0, currentIndex + 1))
        currentIndex++
      } else {
        clearInterval(typingInterval)
        
        // Reset after 3 seconds
        setTimeout(() => {
          currentIndex = 0
          setPrompt('')
        }, 3000)
      }
    }, 100)
    
    return () => clearInterval(typingInterval)
  }, [])
  
  const handleFocus = () => {
    if (promptRef.current) {
      promptRef.current.value = ''
      setPrompt('')
    }
  }

  return (
    <section className="pt-32 pb-24 relative overflow-hidden">
      {/* Hero section particle concentration area - visual only */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-full h-96 opacity-30 blur-xl bg-gradient-to-b from-slateBlue/20 to-transparent rounded-full" />
      </div>
      
      <Container className="relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slateBlue to-robinEggBlue text-transparent bg-clip-text leading-tight">
            Turn Plain Text Into Production-Ready Apps
          </h1>
          
          <p className="text-xl mb-10 text-lightGray">
            No templates. No boilerplate. Just full-stack code, zipped and ready.
          </p>
          
          <div className="mb-8 relative glassmorphism rounded-xl p-2 mx-auto max-w-2xl">
            <div className="flex items-center mb-2 pl-3 text-xs text-lightGray">
              <Terminal size={12} className="mr-2 text-robinEggBlue" />
              <span>optimuscode.io</span>
            </div>
            <Input
              ref={promptRef}
              type="text"
              placeholder={examplePrompt}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onFocus={handleFocus}
              className="h-14 px-5 text-lg bg-richBlack/50 border-slateBlue/30 shadow-inner"
              containerClassName="mb-2"
            />
            <span className="absolute right-7 top-11 text-2xl text-slateBlue">
              {cursorVisible ? '|' : ''}
            </span>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild variant="gradient" size="lg" className="group">
              <Link href="/build">
                Try a Demo Build
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg">
              <Link href="#features">
                Explore Features
              </Link>
            </Button>
          </div>
        </div>
      </Container>
      
      {/* Decorative code elements - positioned absolutely */}
      <div className="hidden md:block absolute left-10 top-40 transform -rotate-12 opacity-20 glassmorphism p-4 rounded-lg text-robinEggBlue text-xs font-mono">
        <pre>{`const app = optimusCode.generate({
  type: "task-manager",
  features: ["auth", "kanban"],
  techStack: "react-node-supabase"
});`}</pre>
      </div>
      
      <div className="hidden md:block absolute right-10 bottom-20 transform rotate-6 opacity-20 glassmorphism p-4 rounded-lg text-slateBlue text-xs font-mono">
        <pre>{`// Generated in 45 seconds
downloadZip("task-flow-app.zip");`}</pre>
      </div>
    </section>
  )
}