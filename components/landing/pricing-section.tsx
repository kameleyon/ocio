'use client'

import React from 'react'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { Check, Zap } from 'lucide-react'
import Link from 'next/link'

const pricingPlans = [
  {
    name: 'Starter',
    description: 'Perfect for trying out OptimusCode',
    price: '$0',
    period: 'forever',
    features: [
      '3 app generations per month',
      'Basic frontend templates',
      'Simple authentication',
      'Community support',
      'Standard queue priority',
    ],
    cta: 'Get Started',
    ctaVariant: 'outline' as const,
    popular: false,
  },
  {
    name: 'Pro',
    description: 'For developers and small teams',
    price: '$29',
    period: 'per month',
    features: [
      'Unlimited app generations',
      'Advanced component library',
      'Full authentication system',
      'Database integration',
      'Priority support',
      'Custom tech stack',
      'API integrations',
    ],
    cta: 'Start Free Trial',
    ctaVariant: 'gradient' as const,
    popular: true,
  },
  {
    name: 'Custom',
    description: 'For large teams and companies',
    price: 'Custom',
    period: 'contact us',
    features: [
      'Everything in Pro plan',
      'White-label solutions',
      'Priority queue processing',
      'Custom API integrations',
      'Dedicated support',
      'Team collaboration',
      'Enterprise SLAs',
    ],
    cta: 'Contact Sales',
    ctaVariant: 'outline' as const,
    popular: false,
  }
]

export default function PricingSection() {
  return (
    <section id="pricing" className="py-24 relative">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-richBlack via-berkeleyBlue/20 to-richBlack pointer-events-none" />
      
      <Container className="relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">Simple, Transparent Pricing</span>
          </h2>
          <p className="text-lightGray max-w-2xl mx-auto">
            Choose the plan that fits your needs. All plans include core features.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <div 
              key={index} 
              className={`flex ${plan.popular ? 'md:-mt-4 md:mb-4 z-10' : ''}`}
            >
              <div 
                className={`
                  w-full flex flex-col rounded-xl glassmorphism transition-all duration-300
                  ${plan.popular 
                    ? 'border-slateBlue shadow-glow' 
                    : 'border-slateBlue/20 hover:border-slateBlue/60 hover:shadow-glow hover:-translate-y-1'
                  }
                `}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-0 right-0 text-center">
                    <span className="bg-gradient-to-r from-slateBlue to-robinEggBlue text-whiteSmoke py-1 px-4 rounded-full text-xs font-bold shadow-glow flex items-center justify-center max-w-max mx-auto">
                      <Zap size={12} className="mr-1" />
                      MOST POPULAR
                    </span>
                  </div>
                )}
                
                <div className="p-6 text-center border-b border-slateBlue/20">
                  <h3 className="text-xl font-bold text-whiteSmoke font-comfortaa">{plan.name}</h3>
                  <p className="text-sm text-lightGray mt-1">{plan.description}</p>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-whiteSmoke font-comfortaa">{plan.price}</span>
                    <span className="text-lightGray ml-2 text-sm">{plan.period}</span>
                  </div>
                </div>
                
                <div className="p-6 flex-grow">
                  <ul className="space-y-4">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <div className={`h-5 w-5 rounded-full ${plan.popular ? 'bg-gradient-to-r from-slateBlue to-robinEggBlue' : 'bg-slateBlue/20'} flex items-center justify-center shrink-0 mr-3 mt-0.5`}>
                          <Check className="h-3 w-3 text-whiteSmoke" />
                        </div>
                        <span className="text-lightGray text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="p-6 pt-0">
                  <Button 
                    variant={plan.ctaVariant} 
                    size="lg" 
                    className={`w-full ${plan.popular ? 'animate-pulse' : ''}`}
                    asChild
                  >
                    <Link href="/signup">
                      {plan.cta}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center text-lightGray/70 text-sm">
          <p>All plans include core features: App Generation, Code Download, and Basic Support</p>
        </div>
      </Container>
    </section>
  )
}
