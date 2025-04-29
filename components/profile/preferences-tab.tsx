"use client"

import React, { useState } from 'react'
import { Profile, updateProfile } from '@/lib/services/auth-service'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'
import { AlertCircle, Check, Loader2, Sparkles, X } from 'lucide-react'

interface PreferencesTabProps {
  profile: Profile
}

// Mock LLM models
const LLM_MODELS = [
  {
    id: 'claude-3-7-sonnet',
    name: 'Claude 3.7 Sonnet',
    description: 'Latest model with advanced reasoning capabilities',
    provider: 'Anthropic',
    tier: 'pro',
    popularity: 'Most Popular'
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    description: 'Versatile model with strong overall performance',
    provider: 'OpenAI',
    tier: 'pro'
  },
  {
    id: 'llama-3-70b',
    name: 'Llama 3 70B',
    description: 'Open source model with good code generation',
    provider: 'Meta',
    tier: 'free'
  },
  {
    id: 'mistral-large',
    name: 'Mistral Large',
    description: 'Fast model with excellent programming abilities',
    provider: 'Mistral AI',
    tier: 'pro'
  },
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    description: 'Highest quality model for enterprise use cases',
    provider: 'Anthropic',
    tier: 'enterprise'
  }
]

export default function PreferencesTab({ profile }: PreferencesTabProps) {
  const { refreshProfile } = useAuth()
  const [preferredModel, setPreferredModel] = useState(
    // Read from profile.preferred_model if it existed
    'claude-3-7-sonnet'
  )
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [updateError, setUpdateError] = useState('')

  const handleModelChange = async (modelId: string) => {
    setIsUpdating(true)
    setUpdateSuccess(false)
    setUpdateError('')
    
    try {
      // In a real implementation, you would update the profile with the preferred model
      // await updateProfile(profile.id, { preferred_model: modelId })
      
      // For now, just update the local state
      setPreferredModel(modelId)
      setUpdateSuccess(true)
      
      // Refresh profile data
      await refreshProfile()
    } catch (error: any) {
      setUpdateError(error.message || 'Failed to update preferences')
    } finally {
      setIsUpdating(false)
      // Clear success message after 5 seconds
      setTimeout(() => setUpdateSuccess(false), 5000)
    }
  }

  const canUseModel = (modelTier: string) => {
    const userTier = profile.subscription_tier || 'free'
    
    // Free users can only use free models
    if (userTier === 'free') return modelTier === 'free'
    
    // Pro users can use free and pro models
    if (userTier === 'pro') return modelTier === 'free' || modelTier === 'pro'
    
    // Enterprise users can use all models
    return true
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-berkeleyBlue/40 backdrop-blur-md border border-slateBlue/20 rounded-xl">
        <h2 className="text-xl font-comfortaa font-semibold text-whiteSmoke mb-4">
          AI Model Preferences
        </h2>
        
        <p className="text-lightGray text-sm mb-4">
          Select your preferred AI model for app generation. Available models depend on your subscription tier.
        </p>
        
        {updateSuccess && (
          <div className="flex items-center gap-2 text-green-500 text-sm p-2 rounded-md bg-green-500/10 mb-4">
            <Check className="w-4 h-4" />
            <span>Preferences updated successfully!</span>
          </div>
        )}

        {updateError && (
          <div className="flex items-center gap-2 text-red-500 text-sm p-2 rounded-md bg-red-500/10 mb-4">
            <X className="w-4 h-4" />
            <span>{updateError}</span>
          </div>
        )}
        
        <div className="space-y-3">
          {LLM_MODELS.map((model) => {
            const isSelected = preferredModel === model.id
            const canUse = canUseModel(model.tier)
            
            return (
              <div 
                key={model.id}
                className={`p-4 rounded-lg border ${
                  isSelected 
                    ? 'border-robinEggBlue bg-slateBlue/20' 
                    : 'border-slateBlue/20 hover:border-slateBlue/40'
                } ${
                  canUse ? 'cursor-pointer' : 'opacity-60 cursor-not-allowed'
                }`}
                onClick={() => canUse && handleModelChange(model.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${isSelected ? 'bg-robinEggBlue' : 'border border-slateBlue/40'}`}>
                      {isSelected && <Check className="w-3 h-3 text-richBlack" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-comfortaa font-semibold text-whiteSmoke">{model.name}</h3>
                        {model.popularity && (
                          <span className="bg-slateBlue/20 text-robinEggBlue text-xs py-0.5 px-2 rounded-full">
                            {model.popularity}
                          </span>
                        )}
                      </div>
                      <p className="text-lightGray text-sm">{model.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <span className="text-lightGray text-sm">{model.provider}</span>
                    {!canUse && (
                      <span className="text-xs text-slateBlue flex items-center gap-1 mt-1">
                        <Sparkles className="w-3 h-3" />
                        {model.tier === 'pro' ? 'Pro Plan' : 'Enterprise Plan'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        
        {!profile.subscription_tier || profile.subscription_tier === 'free' ? (
          <div className="mt-4 p-3 rounded-lg bg-slateBlue/10 border border-slateBlue/20 flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-slateBlue shrink-0 mt-0.5" />
            <div>
              <p className="text-whiteSmoke text-sm font-medium">Upgrade to access more models</p>
              <p className="text-lightGray text-sm">
                Pro and Enterprise plans unlock access to more powerful AI models for better generation results.
              </p>
              <Button
                className="mt-2 bg-slateBlue hover:bg-slateBlue/80 text-whiteSmoke"
                size="sm"
                onClick={() => {
                  // Redirect to subscription tab
                  const element = document.querySelector('button[value="subscription"]');
                  if (element instanceof HTMLElement) {
                    element.click();
                  }
                }}
              >
                View Plans
              </Button>
            </div>
          </div>
        ) : null}
      </Card>
      
      <Card className="p-6 bg-berkeleyBlue/40 backdrop-blur-md border border-slateBlue/20 rounded-xl">
        <h2 className="text-xl font-comfortaa font-semibold text-whiteSmoke mb-4">
          Account Settings
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-slateBlue/20">
            <div>
              <p className="text-whiteSmoke font-medium">Clear Session Cache</p>
              <p className="text-lightGray text-sm">
                Clear all cached data and session information from your browser
              </p>
            </div>
            <Button
              variant="outline"
              className="border-slateBlue/30 text-lightGray hover:text-whiteSmoke hover:border-slateBlue"
              onClick={() => {
                // Clear session cache logic would go here
                localStorage.clear()
                sessionStorage.clear()
              }}
            >
              Clear Cache
            </Button>
          </div>
          
          <div className="flex items-center justify-between py-2 border-b border-slateBlue/20">
            <div>
              <p className="text-whiteSmoke font-medium">Email Notifications</p>
              <p className="text-lightGray text-sm">
                Receive email notifications about app generation and updates
              </p>
            </div>
            <div 
              className={`w-12 h-6 rounded-full transition-colors flex items-center p-1 ${
                true ? 'bg-robinEggBlue justify-end' : 'bg-slateBlue/40 justify-start'
              }`}
              onClick={() => {
                // Toggle notification setting
              }}
            >
              <div className="w-4 h-4 rounded-full bg-whiteSmoke" />
            </div>
          </div>
          
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-whiteSmoke font-medium">Delete Account</p>
              <p className="text-lightGray text-sm">
                Permanently delete your account and all associated data
              </p>
            </div>
            <Button
              variant="outline"
              className="border-red-500/30 text-red-400 hover:text-red-300 hover:border-red-500/50"
            >
              Delete Account
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
