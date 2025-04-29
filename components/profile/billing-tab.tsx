"use client"

import React, { useState } from 'react'
import { Profile } from '@/lib/services/auth-service'
import { Card } from '@/components/ui/card'
import { Calendar, CreditCard, Download, FileText, Receipt } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BillingTabProps {
  profile: Profile
}

// Mock billing data
const BILLING_HISTORY = [
  {
    id: 'inv-001',
    date: '2025-04-01',
    amount: '$19.00',
    status: 'Paid',
    description: 'Pro Plan - Monthly Subscription'
  },
  {
    id: 'inv-002',
    date: '2025-03-01',
    amount: '$19.00',
    status: 'Paid',
    description: 'Pro Plan - Monthly Subscription'
  },
  {
    id: 'inv-003',
    date: '2025-02-01',
    amount: '$19.00',
    status: 'Paid',
    description: 'Pro Plan - Monthly Subscription'
  },
  {
    id: 'top-001',
    date: '2025-02-15',
    amount: '$19.00',
    status: 'Paid',
    description: '25 Tokens - Developer Pack'
  }
]

export default function BillingTab({ profile }: BillingTabProps) {
  const currentDate = new Date()
  const nextBillingDate = new Date(currentDate)
  nextBillingDate.setDate(1)
  nextBillingDate.setMonth(nextBillingDate.getMonth() + 1)
  
  const nextBillingFormatted = nextBillingDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-berkeleyBlue/40 backdrop-blur-md border border-slateBlue/20 rounded-xl">
        <h2 className="text-xl font-comfortaa font-semibold text-whiteSmoke mb-4">
          Payment Method
        </h2>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-8 bg-slateBlue/30 rounded flex items-center justify-center">
              <CreditCard className="text-robinEggBlue w-5 h-5" />
            </div>
            <div>
              <p className="text-whiteSmoke font-medium">Visa ending in 4242</p>
              <p className="text-lightGray text-sm">Expires 12/2026</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-slateBlue/30 text-lightGray hover:text-whiteSmoke hover:border-slateBlue"
            >
              Edit
            </Button>
            <Button
              variant="outline"
              className="border-slateBlue/30 text-lightGray hover:text-whiteSmoke hover:border-slateBlue"
            >
              Remove
            </Button>
          </div>
        </div>
      </Card>
      
      <Card className="p-6 bg-berkeleyBlue/40 backdrop-blur-md border border-slateBlue/20 rounded-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h2 className="text-xl font-comfortaa font-semibold text-whiteSmoke">
            Subscription Details
          </h2>
          
          <Button 
            variant="outline"
            className="border-slateBlue/30 text-lightGray hover:text-whiteSmoke hover:border-slateBlue"
          >
            Manage Subscription
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-lightGray text-sm">Current Plan</p>
            <p className="text-whiteSmoke font-medium">{profile.subscription_tier === 'free' ? 'Free Plan' : profile.subscription_tier === 'pro' ? 'Pro Plan' : 'Enterprise Plan'}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-lightGray text-sm">Billing Cycle</p>
            <p className="text-whiteSmoke font-medium">{profile.subscription_tier === 'free' ? 'N/A' : 'Monthly'}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-lightGray text-sm">Next Billing Date</p>
            <p className="text-whiteSmoke font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slateBlue" />
              {profile.subscription_tier === 'free' ? 'N/A' : nextBillingFormatted}
            </p>
          </div>
          
          <div className="space-y-1">
            <p className="text-lightGray text-sm">Next Payment</p>
            <p className="text-whiteSmoke font-medium">{profile.subscription_tier === 'free' ? 'N/A' : profile.subscription_tier === 'pro' ? '$19.00' : '$99.00'}</p>
          </div>
        </div>
      </Card>
      
      <Card className="p-6 bg-berkeleyBlue/40 backdrop-blur-md border border-slateBlue/20 rounded-xl">
        <h2 className="text-xl font-comfortaa font-semibold text-whiteSmoke mb-4">
          Billing History
        </h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slateBlue/20">
                <th className="text-left py-3 px-2 text-lightGray font-medium text-sm">Invoice</th>
                <th className="text-left py-3 px-2 text-lightGray font-medium text-sm">Date</th>
                <th className="text-left py-3 px-2 text-lightGray font-medium text-sm">Amount</th>
                <th className="text-left py-3 px-2 text-lightGray font-medium text-sm">Status</th>
                <th className="text-left py-3 px-2 text-lightGray font-medium text-sm">Description</th>
                <th className="text-right py-3 px-2 text-lightGray font-medium text-sm">Action</th>
              </tr>
            </thead>
            <tbody>
              {BILLING_HISTORY.map((invoice) => (
                <tr key={invoice.id} className="border-b border-slateBlue/10 hover:bg-slateBlue/5">
                  <td className="py-3 px-2 text-whiteSmoke">
                    <div className="flex items-center gap-2">
                      <Receipt className="h-4 w-4 text-slateBlue" />
                      {invoice.id}
                    </div>
                  </td>
                  <td className="py-3 px-2 text-whiteSmoke">
                    {new Date(invoice.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                  <td className="py-3 px-2 text-whiteSmoke">{invoice.amount}</td>
                  <td className="py-3 px-2">
                    <span 
                      className={`px-2 py-1 rounded-full text-xs ${
                        invoice.status === 'Paid' 
                          ? 'bg-green-500/10 text-green-400' 
                          : 'bg-yellow-500/10 text-yellow-400'
                      }`}
                    >
                      {invoice.status}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-whiteSmoke">{invoice.description}</td>
                  <td className="py-3 px-2 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slateBlue/30 text-lightGray hover:text-whiteSmoke hover:border-slateBlue"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      PDF
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
