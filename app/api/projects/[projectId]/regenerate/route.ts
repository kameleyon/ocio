import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@/lib/supabase/server'
import { withErrorHandling } from '@/lib/utils/api-error'
import { withRateLimit } from '@/lib/utils/rate-limiter'
import { ApiError } from '@/lib/utils/api-error'
import { ProjectService } from '@/lib/services/project-service'

export const POST = withErrorHandling(
  withRateLimit(
    async (
      request: NextRequest,
      { params }: { params: { projectId: string } } // Changed id to projectId
    ) => {
      const supabase = createRouteHandlerClient()
      
      // Check auth status
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw ApiError.unauthorized('Authentication required')
      }
      
      const projectId = params.projectId // Changed params.id to params.projectId
      
      // Check if project exists and belongs to user
      const { data: project, error: fetchError } = await supabase
        .from('projects')
        .select('id, user_id, prompt, status')
        .eq('id', projectId)
        .eq('user_id', session.user.id)
        .single()
      
      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          throw ApiError.notFound('Project not found')
        }
        throw ApiError.internal('Error fetching project')
      }
      
      // Check if project is already generating
      if (project.status === 'generating' || project.status === 'pending') {
        throw ApiError.badRequest('Project is already generating. Please wait for it to complete.')
      }
      
      // Check user's regeneration limit
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
        throw ApiError.forbidden('Regeneration limit reached for free tier', {
          code: 'LIMIT_REACHED',
          meta: {
            limitReached: true,
            tier: 'free',
            upgradeUrl: '/pricing'
          }
        })
      }
      
      try {
        // Create project service
        const projectService = new ProjectService(supabase)
        
        // Start regeneration process
        const success = await projectService.regenerateProject(projectId)
        
        if (!success) {
          throw new Error('Failed to start regeneration process')
        }
        
        // Increment user's generation count
        await projectService.incrementUserGenerationCount(session.user.id)
        
        // Add audit log for regeneration
        await supabase.rpc('add_audit_log', {
          p_user_id: session.user.id,
          p_action: 'regenerate',
          p_entity_type: 'project',
          p_entity_id: projectId,
          p_details: { prompt: project.prompt },
          p_ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
        })
        
        // Add a log entry for regeneration
        try {
            await supabase.from('project_logs').insert({
                project_id: projectId,
                level: 'command',
                message: 'Project regeneration initiated by user.'
            });
        } catch (logError) {
            console.error("Failed to add regeneration log:", logError);
        }
        
        return NextResponse.json({ success: true, id: projectId, status: 'generating' })
      } catch (error) {
        console.error('Error regenerating project:', error)
        throw ApiError.internal('Failed to regenerate project')
      }
    },
    // Custom rate limit for regeneration
    {
      limit: 5,
      window: 3600, // 1 hour window
      message: 'You can only regenerate 5 projects per hour. Please try again later.'
    }
  )
)