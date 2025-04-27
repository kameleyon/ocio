'use client'

import React from 'react'
import { Container } from '@/components/ui/container'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { 
  Archive, 
  KeyRound, 
  Database, 
  Code2, 
  Box, 
  Rocket, 
  Sparkles 
} from 'lucide-react'

const features = [
  {
    title: 'Auto-Zipped Output',
    description: 'Get your entire project bundled as a downloadable .zip file, ready to use.',
    icon: Archive,
  },
  {
    title: 'Auth + DB Included',
    description: 'Every app comes with authentication and database built-in.',
    icon: KeyRound,
  },
  {
    title: 'Adaptable Tech Stack',
    description: 'Comprehensive tech stack customized to your project needs.',
    icon: Database,
  },
  {
    title: 'No Templates',
    description: 'Fully custom code generation based on your specific requirements.',
    icon: Code2,
  },
  {
    title: 'One-Prompt Deploy',
    description: 'From concept to code with just a single text prompt.',
    icon: Box,
  },
  {
    title: 'AI-Powered Analysis',
    description: 'Advanced AI understands your project needs and builds accordingly.',
    icon: Sparkles,
  },
]

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-gradient-to-b from-richBlack to-berkeleyBlue/40">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">The Future of Web Development</span>
          </h2>
          <p className="text-lightGray max-w-2xl mx-auto">
            OptimusCode eliminates boilerplate and generates complete, 
            production-ready applications from a simple text description.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              isGlass={true}
              className="card-hover h-full"
            >
              <CardHeader>
                <div className="mb-4 w-12 h-12 rounded-lg bg-slateBlue/20 flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-slateBlue" />
                </div>
                <CardTitle className="text-whiteSmoke">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lightGray text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  )
}
