'use client'

import React from 'react'
import { Container } from '@/components/ui/container'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import Link from 'next/link'

const pricingPlans = [
  {
    name: 'Free',
    description: 'Perfect for trying out OptimusCode',
    price: '$0',
    period: 'forever',
    features: [
      '3 app generations per month',
      'Basic frontend templates',
      'Simple authentication',
      'Community support',
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
    ],
    cta: 'Start Free Trial',
    ctaVariant: 'gradient' as const,
    popular: true,
  },
  {
    name: 'Enterprise',
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
    ],
    cta: 'Contact Sales',
    ctaVariant: 'outline' as const,
    popular: false,
  }
]

export default function PricingSection() {
  return (
    <section id="pricing" className="py-20 bg-richBlack">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">Simple, Transparent Pricing</span>
          </h2>
          <p className="text-lightGray max-w-2xl mx-auto">
            Choose the plan that fits your needs.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <div key={index} className={`flex ${plan.popular ? 'md:-mt-4 md:mb-4' : ''}`}>
              <Card 
                isGlass={true}
                className={`w-full flex flex-col card-hover
                  ${plan.popular ? 'border-slateBlue border-opacity-50 relative z-10' : 'border-whiteSmoke/10'}
                `}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-0 right-0 text-center">
                    <span className="bg-slateBlue text-whiteSmoke py-1 px-4 rounded-full text-xs">
                      MOST POPULAR
                    </span>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <h3 className="text-xl font-bold text-whiteSmoke">{plan.name}</h3>
                  <p className="text-sm text-lightGray">{plan.description}</p>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-whiteSmoke">{plan.price}</span>
                    <span className="text-lightGray ml-2">{plan.period}</span>
                  </div>
                </CardHeader>
                
                <CardContent className="flex-grow">
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="h-5 w-5 text-robinEggBlue shrink-0 mr-2" />
                        <span className="text-lightGray">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    variant={plan.ctaVariant} 
                    size="default" 
                    className="w-full"
                    asChild
                  >
                    <Link href="/signup">
                      {plan.cta}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
