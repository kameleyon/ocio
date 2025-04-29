"use client"

import React, { useState } from 'react'
import { Profile, updateProfile } from '@/lib/services/auth-service'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useAuth } from '@/contexts/auth-context'
import { 
  ArrowRight, 
  BadgeCheck, 
  Crown, 
  Check, 
  Zap, 
  Download, 
  BarChart, 
  Rocket
} from 'lucide-react'

interface SubscriptionTabProps {
  profile: Profile
}

const SUBSCRIPTION_TIERS = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Basic app generation for personal projects',
    features: [
      '5 app generations per month',
      'Basic tech stack options',
      'Standard response time',
      '5MB max app size',
      'Community support'
    ],
    cta: 'Current Plan',
    icon: BadgeCheck,
    value: 'free'
  },
  {
    name: 'Pro',
    price: '$19',
    period: 'per month',
    description: 'Enhanced features for professional developers',
    features: [
      '50 app generations per month',
      'All tech stack options',
      'Priority response time',
      '50MB max app size',
      'Email support',
      'Custom domains'
    ],
    cta: 'Upgrade to Pro',
    icon: Crown,
    value: 'pro'
  },
  {
    name: 'Enterprise',
    price: '$99',
    period: 'per month',
    description: 'Full-featured solution for teams and businesses',
    features: [
      'Unlimited app generations',
      'Advanced tech stack options',
      'Fastest response time',
      'Unlimited app size',
      'Priority support',
      'Custom branding',
      'Team collaboration',
      'API access'
    ],
    cta: 'Upgrade to Enterprise',
    icon: Rocket,
    value: 'enterprise'
  }
]

interface TokenPackage {
  name: string
  tokens: number
  price: string
  discount: string
}

const TOKEN_PACKAGES: TokenPackage[] = [
  {
    name: 'Starter Pack',
    tokens: 10,
    price: '$9',
    discount: ''
  },
  {
    name: 'Developer Pack',
    tokens: 25,
    price: '$19',
    discount: 'Save 15%'
  },
  {
    name: 'Team Pack',
    tokens: 100,
    price: '$69',
    discount: 'Save 30%'
  }
]

export default function SubscriptionTab({ profile }: SubscriptionTabProps) {
  const { refreshProfile } = useAuth()
  const [isUpdating, setIsUpdating] = useState(false)
  const [currentTier, setCurrentTier] = useState<'free' | 'pro' | 'enterprise'>(
    (profile.subscription_tier as 'free' | 'pro' | 'enterprise') || 'free'
  )

  const handleUpgradeSubscription = async (tier: string) => {
    // This would connect to a payment gateway in a real implementation
    // For now, we'll just update the profile
    setIsUpdating(true)
    
    try {
      await updateProfile(profile.id, {
        subscription_tier: tier as any
      })
      
      setCurrentTier(tier as 'free' | 'pro' | 'enterprise')
      await refreshProfile()
    } catch (error) {
      console.error('Error upgrading subscription:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleBuyTokens = (tokenPackage: TokenPackage) => {
    // This would open a payment flow in a real implementation
    console.log(`Buying ${tokenPackage.tokens} tokens for ${tokenPackage.price}`)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-comfortaa font-semibold text-whiteSmoke">
        Subscription Plans
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {SUBSCRIPTION_TIERS.map((tier) => {
          const isCurrentPlan = currentTier === tier.value
          const Icon = tier.icon
          
          return (
            <Card 
              key={tier.value}
              className={`p-6 border ${
                isCurrentPlan 
                  ? 'border-robinEggBlue/50 bg-berkeleyBlue/60' 
                  : 'border-slateBlue/20 bg-berkeleyBlue/40'
              } backdrop-blur-md rounded-xl transition-all duration-200 hover:shadow-md ${
                tier.value === 'pro' ? 'md:transform md:-translate-y-2' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-comfortaa font-bold text-xl text-whiteSmoke flex items-center gap-2">
                  <Icon className={`h-5 w-5 ${isCurrentPlan ? 'text-robinEggBlue' : 'text-slateBlue'}`} />
                  {tier.name}
                </h3>
                {tier.value === 'pro' && (
                  <span className="bg-slateBlue/20 text-robinEggBlue text-xs py-1 px-2 rounded-full">
                    Popular
                  </span>
                )}
              </div>
              
              <div className="mb-4">
                <span className="text-2xl font-bold text-whiteSmoke">{tier.price}</span>
                <span className="text-lightGray text-sm"> {tier.period}</span>
              </div>
              
              <p className="text-lightGray text-sm mb-4">{tier.description}</p>
              
              <ul className="mb-6 space-y-2">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-robinEggBlue shrink-0 mt-0.5" />
                    <span className="text-whiteSmoke">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button
                className={`w-full ${
                  isCurrentPlan
                    ? 'bg-slateBlue/50 cursor-default'
                    : 'bg-slateBlue hover:bg-slateBlue/80'
                } text-whiteSmoke`}
                disabled={isCurrentPlan || isUpdating}
                onClick={() => handleUpgradeSubscription(tier.value)}
              >
                {isCurrentPlan ? (
                  <>
                    <BadgeCheck className="h-4 w-4 mr-2" />
                    Current Plan
                  </>
                ) : (
                  <>
                    {tier.cta}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </Card>
          )
        })}
      </div>
      
      <h2 className="text-xl font-comfortaa font-semibold text-whiteSmoke mt-8">
        Top Up Tokens
      </h2>
      <p className="text-lightGray text-sm">
        Need extra tokens? Purchase token packs to generate more apps beyond your monthly limit.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {TOKEN_PACKAGES.map((pkg) => (
          <Card
            key={pkg.name}
            className="p-6 border border-slateBlue/20 bg-berkeleyBlue/40 backdrop-blur-md rounded-xl transition-all duration-200 hover:shadow-md"
          >
            <h3 className="font-comfortaa font-semibold text-lg text-whiteSmoke mb-2">
              {pkg.name}
            </h3>
            
            <div className="flex items-end gap-2 mb-4">
              <span className="text-2xl font-bold text-whiteSmoke">{pkg.price}</span>
              {pkg.discount && (
                <span className="text-robinEggBlue text-xs py-1 px-2 rounded-full bg-robinEggBlue/10 mb-1">
                  {pkg.discount}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2 mb-6 text-lightGray">
              <Zap className="h-4 w-4 text-robinEggBlue" />
              <span className="text-whiteSmoke font-medium">{pkg.tokens} tokens</span>
            </div>
            
            <Button
              className="w-full bg-slateBlue hover:bg-slateBlue/80 text-whiteSmoke"
              onClick={() => handleBuyTokens(pkg)}
            >
              Purchase Tokens
              <Download className="h-4 w-4 ml-2" />
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )
}
