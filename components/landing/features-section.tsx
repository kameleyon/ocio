'use client'

import React from 'react'
import { Container } from '@/components/ui/container'
import { 
  Archive, 
  KeyRound, 
  Database, 
  Code2, 
  Box, 
  Sparkles 
} from 'lucide-react'

const features = [
  {
    title: 'Auto-Zipped Output',
    description: 'Get your entire project bundled as a downloadable .zip file, ready to use.',
    icon: Archive,
    colSpan: 'md:col-span-1',
    rowSpan: 'md:row-span-1',
  },
  {
    title: 'Auth + DB Included',
    description: 'Every app comes with authentication and database built-in.',
    icon: KeyRound,
    colSpan: 'md:col-span-1',
    rowSpan: 'md:row-span-1',
  },
  {
    title: 'Adaptable Tech Stack',
    description: 'Comprehensive tech stack customized to your project needs.',
    icon: Database,
    colSpan: 'md:col-span-2',
    rowSpan: 'md:row-span-1',
  },
  {
    title: 'No Templates',
    description: 'Fully custom code generation based on your specific requirements.',
    icon: Code2,
    colSpan: 'md:col-span-1',
    rowSpan: 'md:row-span-1',
  },
  {
    title: 'One-Prompt Deploy',
    description: 'From concept to code with just a single text prompt.',
    icon: Box,
    colSpan: 'md:col-span-1',
    rowSpan: 'md:row-span-1',
  },
  {
    title: 'AI-Powered Analysis',
    description: 'Advanced AI understands your project needs and builds accordingly.',
    icon: Sparkles,
    colSpan: 'md:col-span-2',
    rowSpan: 'md:row-span-1',
  },
]

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-richBlack via-berkeleyBlue/30 to-richBlack pointer-events-none" />
      
      <Container className="relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">The Future of Web Development</span>
          </h2>
          <p className="text-lightGray max-w-2xl mx-auto">
            OptimusCode eliminates boilerplate and generates complete, 
            production-ready applications from a simple text description.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`glassmorphism rounded-xl border border-slateBlue/20 backdrop-blur-lg p-6 transition-all duration-300 hover:shadow-glow hover:border-slateBlue/60 hover:-translate-y-1 ${feature.colSpan} ${feature.rowSpan}`}
            >
              <div className="mb-4 w-12 h-12 rounded-lg bg-slateBlue/20 flex items-center justify-center">
                <feature.icon className="h-6 w-6 text-robinEggBlue" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-whiteSmoke font-comfortaa">
                {feature.title}
              </h3>
              <p className="text-lightGray">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
