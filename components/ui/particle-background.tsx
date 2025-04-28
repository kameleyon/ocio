'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  size: number
  color: string
  speed: number
  opacity: number
  life: number
  maxLife: number
}

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas to full window size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    setCanvasSize()
    window.addEventListener('resize', setCanvasSize)

    // Particle settings
    const colors = ['#7357C6', '#3DD6D1'] // slateBlue and robinEggBlue
    const maxParticles = 100
    const particles: Particle[] = []

    // Create initial particles
    for (let i = 0; i < maxParticles; i++) {
      createParticle()
    }

    function createParticle() {
      const size = Math.random() * 2 + 1 // Size between 1-3px
      particles.push({
        x: Math.random() * canvas!.width,
        y: canvas!.height + size, // Start below the screen
        size,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 1 + 0.2, // Speed between 0.2-1.2
        opacity: 0,
        life: 0,
        maxLife: Math.random() * 1000 + 3000, // Life between 3-4 seconds
      })
    }

    function animate() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height)
      
      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        
        // Update life
        p.life += 16 // ~60fps
        
        // Fade in/out based on life
        if (p.life < 500) {
          p.opacity = Math.min(p.life / 500, 0.7) // Fade in up to 70% opacity
        } else if (p.life > p.maxLife - 500) {
          p.opacity = Math.max((p.maxLife - p.life) / 500, 0) * 0.7
        }
        
        // Update position
        p.y -= p.speed
        
        // Draw particle
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx!.fillStyle = p.color
        ctx!.globalAlpha = p.opacity
        ctx!.fill()
        ctx!.globalAlpha = 1
        
        // If particle is done, reset it
        if (p.life >= p.maxLife) {
          createParticle()
          particles.splice(i, 1)
          i--
        }
      }
      
      requestAnimationFrame(animate)
    }

    const animationId = requestAnimationFrame(animate)

    // Cleanup
    return () => {
      window.removeEventListener('resize', setCanvasSize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10 pointer-events-none"
    />
  )
}