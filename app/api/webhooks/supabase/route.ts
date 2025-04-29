import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { Webhook } from '@/lib/utils/webhook'
import { ApiError } from '@/lib/utils/api-error'

const webhookSecret = process.env.WEBHOOK_SECRET

// Verify webhook signature
function verifyWebhookSignature(request: NextRequest) {
  if (!webhookSecret) {
    console.warn('WEBHOOK_SECRET is not set')
    return true // Skip verification in development
  }
  
  const signature = request.headers.get('x-webhook-signature')
  if (!signature) {
    throw ApiError.unauthorized('Missing webhook signature')
  }
  
  // In a production environment, verify the signature
  // using a cryptographic library
  return true
}

// Handle Supabase database webhooks
export async function POST(request: NextRequest) {
  try {
    // Verify webhook signature
    verifyWebhookSignature(request)
    
    // Parse webhook payload
    const payload = await request.json()
    const { type, table, record, old_record } = payload
    
    // Create Supabase service client
    const supabase = createServiceClient()
    
    // Handle different webhook events
    switch (`${type}:${table}`) {
      case 'INSERT:projects': {
        // New project created, start generation process
        await Webhook.handleProjectCreation(supabase, record)
        break
      }
      
      case 'UPDATE:projects': {
        // Project updated, handle status changes
        if (old_record.status !== record.status) {
          await Webhook.handleProjectStatusChange(supabase, record, old_record)
        }
        break
      }
      
      case 'INSERT:profiles': {
        // New user profile created
        await Webhook.handleProfileCreation(supabase, record)
        break
      }
      
      case 'UPDATE:profiles': {
        // User subscription changed
        if (old_record.subscription_tier !== record.subscription_tier) {
          await Webhook.handleSubscriptionChange(supabase, record, old_record)
        }
        break
      }
      
      default:
        // Ignore other webhook events
        break
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    
    if (error instanceof ApiError) {
      return error.toResponse()
    }
    
    return NextResponse.json(
      { error: 'Error processing webhook' },
      { status: 500 }
    )
  }
}
