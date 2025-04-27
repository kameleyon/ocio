'use client'

import React from 'react'
import { Container } from '@/components/ui/container'
import { 
  Keyboard, 
  FileText, 
  Code, 
  Package, 
  Download 
} from 'lucide-react'

const steps = [
  {
    title: 'Input',
    description: 'Describe your app in plain text',
    icon: Keyboard,
  },
  {
    title: 'Plan',
    description: 'AI analyzes requirements',
    icon: FileText,
  },
  {
    title: 'Generate',
    description: 'Code is created & tested',
    icon: Code,
  },
  {
    title: 'Package',
    description: 'Files bundled together',
    icon: Package,
  },
  {
    title: 'Download',
    description: 'Get your ready-to-use app',
    icon: Download,
  },
]

export default function ProcessTimeline() {
  return (
    <section className="py-20 bg-berkeleyBlue/20">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">How It Works</span>
          </h2>
          <p className="text-lightGray max-w-2xl mx-auto">
            From text prompt to complete application in five simple steps.
          </p>
        </div>
        
        <div className="relative flex flex-col md:flex-row justify-between items-start max-w-5xl mx-auto">
          {/* Line connecting all steps */}
          <div className="hidden md:block absolute h-1 bg-gradient-to-r from-slateBlue to-robinEggBlue top-10 left-[10%] right-[10%]"></div>
          
          {steps.map((step, index) => (
            <div key={index} className="flex flex-row md:flex-col items-center mb-8 md:mb-0 w-full md:w-auto relative z-10">
              {/* Mobile line connector */}
              <div className="md:hidden absolute w-1 bg-gradient-to-b from-slateBlue to-robinEggBlue top-10 bottom-[-2rem] left-6"></div>
              
              {/* Icon circle */}
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-slateBlue to-robinEggBlue shadow-glow">
                <step.icon className="h-6 w-6 text-whiteSmoke" />
              </div>
              
              {/* Step content */}
              <div className="md:text-center ml-6 md:ml-0 md:mt-4">
                <h3 className="text-lg font-bold text-whiteSmoke font-comfortaa">
                  {step.title}
                </h3>
                <p className="text-sm text-lightGray max-w-[150px]">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
