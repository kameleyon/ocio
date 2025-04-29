"use client"

import React, { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import ProfileTab from './profile-tab'
import SubscriptionTab from './subscription-tab'
import BillingTab from './billing-tab'
import PreferencesTab from './preferences-tab'
import UsageTab from './usage-tab'
import HelpTab from './help-tab'
import LegalTab from './legal-tab'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'

type TabType = 'profile' | 'subscription' | 'billing' | 'preferences' | 'usage' | 'help' | 'legal'

export default function UserProfile() {
  const { profile } = useAuth()
  const [activeTab, setActiveTab] = useState<TabType>('profile')

  if (!profile) {
    return (
      <Card className="p-8 text-center">
        <p className="text-lightGray">Loading profile information...</p>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-comfortaa font-bold text-whiteSmoke">Account Management</h1>
      
      <Tabs defaultValue="profile" onValueChange={(value) => setActiveTab(value as TabType)}>
        <TabsList className="w-full bg-berkeleyBlue border border-slateBlue/20 rounded-xl p-1">
          <TabsTrigger 
            value="profile" 
            className="data-[state=active]:bg-richBlack data-[state=active]:text-whiteSmoke rounded-lg"
          >
            Profile
          </TabsTrigger>
          <TabsTrigger 
            value="subscription" 
            className="data-[state=active]:bg-richBlack data-[state=active]:text-whiteSmoke rounded-lg"
          >
            Subscription
          </TabsTrigger>
          <TabsTrigger 
            value="billing" 
            className="data-[state=active]:bg-richBlack data-[state=active]:text-whiteSmoke rounded-lg"
          >
            Billing
          </TabsTrigger>
          <TabsTrigger 
            value="preferences" 
            className="data-[state=active]:bg-richBlack data-[state=active]:text-whiteSmoke rounded-lg"
          >
            Preferences
          </TabsTrigger>
          <TabsTrigger 
            value="usage" 
            className="data-[state=active]:bg-richBlack data-[state=active]:text-whiteSmoke rounded-lg"
          >
            Usage
          </TabsTrigger>
          <TabsTrigger 
            value="help" 
            className="data-[state=active]:bg-richBlack data-[state=active]:text-whiteSmoke rounded-lg"
          >
            Help
          </TabsTrigger>
          <TabsTrigger 
            value="legal" 
            className="data-[state=active]:bg-richBlack data-[state=active]:text-whiteSmoke rounded-lg"
          >
            Legal
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <ProfileTab profile={profile} />
        </TabsContent>
        
        <TabsContent value="subscription">
          <SubscriptionTab profile={profile} />
        </TabsContent>
        
        <TabsContent value="billing">
          <BillingTab profile={profile} />
        </TabsContent>
        
        <TabsContent value="preferences">
          <PreferencesTab profile={profile} />
        </TabsContent>
        
        <TabsContent value="usage">
          <UsageTab profile={profile} />
        </TabsContent>
        
        <TabsContent value="help">
          <HelpTab />
        </TabsContent>
        
        <TabsContent value="legal">
          <LegalTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
