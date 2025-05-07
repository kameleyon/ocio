import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@/lib/supabase/server'
import { generateZipFile } from '@/lib/services/ai-service'
import { withErrorHandling } from '@/lib/utils/api-error'
import { withRateLimit } from '@/lib/utils/rate-limiter'
import { ApiError } from '@/lib/utils/api-error'
import { ProjectService } from '@/lib/services/project-service'

export const GET = withErrorHandling(
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
        .select('id, user_id, name, description, status, tech_stack, structure, files, download_url')
        .eq('id', projectId)
        .eq('user_id', session.user.id)
        .single()
      
      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          throw ApiError.notFound('Project not found')
        }
        throw ApiError.internal('Error fetching project')
      }
      
      // Check if project has a download URL
      if (project.download_url) {
        // Add audit log for download
        await supabase.rpc('add_audit_log', {
          p_user_id: session.user.id,
          p_action: 'download',
          p_entity_type: 'project',
          p_entity_id: projectId,
          p_details: { project_name: project.name },
          p_ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
        })
        
        // Redirect to the pre-generated download URL
        return NextResponse.redirect(project.download_url)
      }
      
      // Check if project is completed
      if (project.status !== 'completed') {
        throw ApiError.badRequest('Project is not ready for download. Current status: ' + project.status)
      }
      
      try {
        // Create project service
        const projectService = new ProjectService(supabase)
        
        // Get the files for the project
        const files = await projectService.getProjectFiles(projectId)
        
        if (!files || files.length === 0) {
          throw ApiError.internal('No files found for project')
        }
        
        // Generate the zip file
        const zipBlob = await generateZipFile(project.name, files)
        
        // Store the zip file in Supabase Storage
        const timestamp = Date.now()
        const normalizedName = project.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
        const filePath = `project-zips/${projectId}/${timestamp}-${normalizedName}.zip`
        
        const { error: uploadError } = await supabase.storage
          .from('project-files')
          .upload(filePath, zipBlob, {
            contentType: 'application/zip',
            upsert: true
          })
          
        if (uploadError) {
          throw new Error(`Error uploading zip file: ${uploadError.message}`)
        }
        
        // Generate the public URL for the file
        const { data: publicUrl } = supabase.storage
          .from('project-files')
          .getPublicUrl(filePath)
        
        // Update project with download URL
        await supabase
          .from('projects')
          .update({ download_url: publicUrl.publicUrl })
          .eq('id', projectId)
        
        // Add audit log for download
        await supabase.rpc('add_audit_log', {
          p_user_id: session.user.id,
          p_action: 'download',
          p_entity_type: 'project',
          p_entity_id: projectId,
          p_details: { project_name: project.name },
          p_ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
        })
        
        // Redirect to the download URL
        return NextResponse.redirect(publicUrl.publicUrl)
      } catch (error) {
        console.error('Error generating zip file:', error)
        throw ApiError.internal('Failed to generate download file')
      }
    },
    // Custom rate limit for downloads
    {
      limit: 10,
      window: 60, // 1 minute window
      message: 'You can only download 10 projects per minute. Please try again later.'
    }
  )
)