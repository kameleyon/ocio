'use client'

import React, { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  size: number
  speedY: number
  opacity: number
  color: string
  depth: number
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Setup
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    
    // Initial size
    resizeCanvas()
    
    // Handle resize
    window.addEventListener('resize', resizeCanvas)
    
    // Particle settings
    const particleCount = 75 // Moderate density (not overwhelming)
    const particles: Particle[] = []
    
    // Colors
    const colors = [
      '#7357C6', // Slate blue
      '#3DD6D1', // Robin egg blue
    ]
    
    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1, // Sizes between 1-3px
        speedY: -0.2 - Math.random() * 0.8, // Upward speed (like champagne bubbles)
        opacity: 0.1 + Math.random() * 0.5, // Varied opacity
        color: colors[Math.floor(Math.random() * colors.length)],
        depth: 0.3 + Math.random() * 0.7, // For parallax effect (0.3-1)
      })
    }
    
    // Animation
    const animate = () => {
      // Clear canvas with slight fade effect
      ctx.fillStyle = 'rgba(0, 8, 13, 0.1)' // Rich black with slight transparency
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Update and draw particles
      particles.forEach((particle, index) => {
        // Move upward
        particle.y += particle.speedY * particle.depth
        
        // Slowly vary opacity for fade in/out effect
        particle.opacity += (Math.random() - 0.5) * 0.01
        particle.opacity = Math.max(0.1, Math.min(0.7, particle.opacity))
        
        // Reset if out of view
        if (particle.y < -10) {
          particles[index].y = canvas.height + 10
          particles[index].x = Math.random() * canvas.width
        }
        
        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.globalAlpha = particle.opacity * particle.depth
        ctx.fill()
        
        // Add glow effect for some particles
        if (Math.random() > 0.9) {
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2)
          ctx.fillStyle = particle.color
          ctx.globalAlpha = (particle.opacity * 0.3) * particle.depth
          ctx.fill()
        }
        
        ctx.globalAlpha = 1
      })
      
      // Continue animation
      requestAnimationFrame(animate)
    }
    
    animate()
    
    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])
  
  return (
    <canvas 
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ 
        background: 'transparent',
        position: 'fixed',
        top: 0,
        left: 0
      }}
    />
  )
}
