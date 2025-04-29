import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { getProjectsByUserId } from '@/lib/services/project-service'
import { generateProjectName, generateProjectDetails } from '@/lib/services/ai-service'
import { withErrorHandling } from '@/lib/utils/api-error'
import { withRateLimit } from '@/lib/utils/rate-limiter'
import { ApiError } from '@/lib/utils/api-error'

export const GET = withErrorHandling(
  withRateLimit(async (request: NextRequest) => {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    
    // Check auth status
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw ApiError.unauthorized('Authentication required')
    }
    
    // Get user's projects
    const projects = await getProjectsByUserId(session.user.id)
    
    return NextResponse.json(projects)
  })
)

export const POST = withErrorHandling(
  withRateLimit(
    async (request: NextRequest) => {
      const cookieStore = cookies()
      const supabase = createClient(cookieStore)
      
      // Check auth status
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw ApiError.unauthorized('Authentication required')
      }
      
      // Get request body
      const body = await request.json()
      const { prompt } = body
      
      if (!prompt) {
        throw ApiError.badRequest('Prompt is required')
      }
      
      // Check user's generation limit (free tier: 5/day, pro tier: unlimited)
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('subscription_tier, generation_count')
        .eq('id', session.user.id)
        .single()
      
      if (profileError) {
        throw ApiError.internal('Error fetching user profile')
      }
      
      const isFreeUser = !profile.subscription_tier || profile.subscription_tier === 'free'
      if (isFreeUser && profile.generation_count >= 5) {
        throw ApiError.forbidden('Generation limit reached for free tier', {
          code: 'LIMIT_REACHED',
          meta: {
            limitReached: true,
            tier: 'free',
            upgradeUrl: '/pricing'
          }
        })
      }
      
      // Generate initial project name
      const projectName = await generateProjectName(prompt)
      
      // Create new project
      const { data, error } = await supabase
        .from('projects')
        .insert([
          {
            user_id: session.user.id,
            name: projectName,
            description: prompt,
            prompt: prompt,
            status: 'pending',
            tech_stack: {},
          }
        ])
        .select()
        .single()
      
      if (error) {
        throw ApiError.internal('Error creating project')
      }
      
      // Increment user's generation count
      await supabase.rpc('increment_generation_count', {
        user_id: session.user.id
      })
      
      // Start background generation process
      // In production, this would trigger a webhook or background job
      const projectId = data.id
      
      // Immediately update status to generating
      await supabase
        .from('projects')
        .update({ status: 'generating' })
        .eq('id', projectId)
      
      // Start async generation process
      setTimeout(async () => {
        try {
          // Generate project details
          const projectDetails = await generateProjectDetails(prompt)
          
          // Update project with details
          await supabase
            .from('projects')
            .update({
              name: projectDetails.name,
              description: projectDetails.description,
              tech_stack: projectDetails.techStack,
              structure: projectDetails.structure,
              status: 'completed',
              download_url: `/api/projects/${projectId}/download` // Placeholder URL
            })
            .eq('id', projectId)
            
          // Add audit log
          await supabase.rpc('add_audit_log', {
            p_user_id: session.user.id,
            p_action: 'create',
            p_entity_type: 'project',
            p_entity_id: projectId,
            p_details: { prompt },
            p_ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
          })
            
        } catch (genError) {
          console.error('Error in background generation:', genError)
          
          // Update project as failed
          await supabase
            .from('projects')
            .update({ 
              status: 'failed',
              tech_stack: { error: (genError as Error).message }
            })
            .eq('id', projectId)
        }
      }, 1000)
      
      return NextResponse.json(data)
    },
    // Custom rate limit for project creation
    {
      limit: 10,
      window: 3600, // 1 hour window
      message: 'You can only create 10 projects per hour. Please try again later.'
    }
  )
)
