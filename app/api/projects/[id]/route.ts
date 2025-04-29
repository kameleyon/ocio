import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { generateFileContents, generateZipFile } from '@/lib/services/ai-service'
import { withErrorHandling } from '@/lib/utils/api-error'
import { withRateLimit } from '@/lib/utils/rate-limiter'
import { ApiError } from '@/lib/utils/api-error'

export const GET = withErrorHandling(
  withRateLimit(async (
    request: NextRequest,
    { params }: { params: { id: string } }
  ) => {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    
    // Check auth status
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw ApiError.unauthorized('Authentication required')
    }
    
    const projectId = params.id
    
    // Get project
    const { data: project, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .eq('user_id', session.user.id)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        throw ApiError.notFound('Project not found')
      }
      throw ApiError.internal('Error fetching project')
    }
    
    // Add audit log for project view
    await supabase.rpc('add_audit_log', {
      p_user_id: session.user.id,
      p_action: 'view',
      p_entity_type: 'project',
      p_entity_id: projectId,
      p_details: {},
      p_ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
    })
    
    return NextResponse.json(project)
  })
)

export const PUT = withErrorHandling(
  withRateLimit(async (
    request: NextRequest,
    { params }: { params: { id: string } }
  ) => {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    
    // Check auth status
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw ApiError.unauthorized('Authentication required')
    }
    
    const projectId = params.id
    
    // Check if project exists and belongs to user
    const { data: existingProject, error: fetchError } = await supabase
      .from('projects')
      .select('id, user_id, status')
      .eq('id', projectId)
      .eq('user_id', session.user.id)
      .single()
    
    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        throw ApiError.notFound('Project not found')
      }
      throw ApiError.internal('Error fetching project')
    }
    
    // Only allow updates for projects that are not in progress
    if (existingProject.status === 'generating' || existingProject.status === 'pending') {
      throw ApiError.badRequest('Cannot update a project that is currently generating')
    }
    
    // Get update data from request
    const updates = await request.json()
    
    // Validate updates
    const allowedFields = ['name', 'description', 'tech_stack']
    const filteredUpdates = Object.keys(updates)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key]
        return obj
      }, {} as Record<string, any>)
    
    // Make sure there are valid fields to update
    if (Object.keys(filteredUpdates).length === 0) {
      throw ApiError.badRequest('No valid fields to update')
    }
    
    // Update project
    const { data, error } = await supabase
      .from('projects')
      .update(filteredUpdates)
      .eq('id', projectId)
      .select()
      .single()
    
    if (error) {
      throw ApiError.internal('Error updating project')
    }
    
    // Add audit log for project update
    await supabase.rpc('add_audit_log', {
      p_user_id: session.user.id,
      p_action: 'update',
      p_entity_type: 'project',
      p_entity_id: projectId,
      p_details: { updates: filteredUpdates },
      p_ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
    })
    
    return NextResponse.json(data)
  })
)

export const DELETE = withErrorHandling(
  withRateLimit(async (
    request: NextRequest,
    { params }: { params: { id: string } }
  ) => {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    
    // Check auth status
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw ApiError.unauthorized('Authentication required')
    }
    
    const projectId = params.id
    
    // Check if project exists and belongs to user
    const { data: existingProject, error: fetchError } = await supabase
      .from('projects')
      .select('id, user_id, name')
      .eq('id', projectId)
      .eq('user_id', session.user.id)
      .single()
    
    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        throw ApiError.notFound('Project not found')
      }
      throw ApiError.internal('Error fetching project')
    }
    
    // Store project info for audit log
    const projectInfo = {
      id: existingProject.id,
      name: existingProject.name
    }
    
    // Delete files from storage
    const { data: files } = await supabase.storage
      .from('project-files')
      .list(`project-zips/${projectId}`)
    
    if (files && files.length > 0) {
      const filePaths = files.map(file => `project-zips/${projectId}/${file.name}`)
      await supabase.storage
        .from('project-files')
        .remove(filePaths)
    }
    
    // Delete project record
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId)
    
    if (error) {
      throw ApiError.internal('Error deleting project')
    }
    
    // Add audit log for project deletion
    await supabase.rpc('add_audit_log', {
      p_user_id: session.user.id,
      p_action: 'delete',
      p_entity_type: 'project',
      p_entity_id: projectId,
      p_details: projectInfo,
      p_ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
    })
    
    return NextResponse.json({ success: true })
  })
)
