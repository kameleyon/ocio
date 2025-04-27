'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowRight } from 'lucide-react'
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
    <section className="pt-32 pb-20 relative">
      {/* More particles in hero section */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* This is just a visual indicator that more particles should be here */}
        {/* The actual particles are handled by the ParticleBackground component */}
      </div>
      
      <Container className="relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slateBlue to-robinEggBlue text-transparent bg-clip-text">
            Turn Plain Text Into Production-Ready Apps
          </h1>
          
          <p className="text-xl mb-10 text-lightGray">
            No templates. No boilerplate. Just full-stack code, zipped and ready.
          </p>
          
          <div className="mb-8 relative">
            <Input
              ref={promptRef}
              type="text"
              placeholder={examplePrompt}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onFocus={handleFocus}
              className="h-14 px-5 text-xl shadow-md border-slateBlue"
              containerClassName="mb-2"
            />
            <span className="absolute right-5 top-4 text-2xl text-slateBlue animate-pulse">
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
    </section>
  )
}