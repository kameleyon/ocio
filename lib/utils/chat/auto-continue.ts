/**
 * AutoContinue utility for OptimusCode.io
 * 
 * This utility allows for automatic continuation of long-running operations
 * without requiring manual user intervention. It's used for tasks like project generation
 * that can take a significant amount of time.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

// Define state type for continuation
export interface ContinuationState {
  projectId?: string
  userId?: string
  operationType?: 'generate' | 'regenerate' | 'download'
  startTime?: number
  step?: number
  completed?: boolean
  error?: string
  data?: Record<string, any>
}

export class AutoContinue {
  /**
   * Check if a long-running operation needs to be continued
   * @param projectId The ID of the project
   * @returns Promise with the continuation state
   */
  static async checkContinuation(projectId: string): Promise<ContinuationState | null> {
    try {
      const cookieStore = cookies()
      const supabase = createClient(cookieStore)
      
      // Check auth status
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        return null
      }
      
      // Check project status
      const { data: project, error } = await supabase
        .from('projects')
        .select('id, status, user_id, created_at')
        .eq('id', projectId)
        .eq('user_id', session.user.id)
        .single()
      
      if (error || !project) {
        return null
      }
      
      // If project is still generating, return continuation state
      if (project.status === 'generating' || project.status === 'pending') {
        const createdAt = new Date(project.created_at).getTime()
        const now = Date.now()
        const elapsedSeconds = Math.floor((now - createdAt) / 1000)
        
        return {
          projectId: project.id,
          userId: project.user_id,
          operationType: 'generate',
          startTime: createdAt,
          step: Math.min(Math.floor(elapsedSeconds / 10), 10), // Simulate progress steps
          completed: false,
          data: { project }
        }
      }
      
      return null
    } catch (error) {
      console.error('Error checking continuation:', error)
      return null
    }
  }
  
  /**
   * Initiate a continuation for a long-running operation
   * @param state The continuation state
   * @returns Promise with the updated state
   */
  static async initiateContinuation(state: ContinuationState): Promise<ContinuationState> {
    try {
      const cookieStore = cookies()
      const supabase = createClient(cookieStore)
      
      // Check auth status
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        return { ...state, error: 'Unauthorized' }
      }
      
      // If no project ID, nothing to continue
      if (!state.projectId) {
        return { ...state, error: 'No project ID provided' }
      }
      
      // Poll for project status
      const { data: project, error } = await supabase
        .from('projects')
        .select('id, status, user_id, created_at, name, tech_stack, structure')
        .eq('id', state.projectId)
        .eq('user_id', session.user.id)
        .single()
      
      if (error || !project) {
        return { ...state, error: 'Project not found' }
      }
      
      // Update state based on project status
      const updatedState: ContinuationState = {
        ...state,
        userId: project.user_id,
        data: { ...state.data, project }
      }
      
      if (project.status === 'completed') {
        updatedState.completed = true
        updatedState.step = 10
      } else if (project.status === 'failed') {
        updatedState.error = 'Project generation failed'
        updatedState.completed = true
      } else {
        // Still in progress, update step
        const createdAt = new Date(project.created_at).getTime()
        const now = Date.now()
        const elapsedSeconds = Math.floor((now - createdAt) / 1000)
        updatedState.step = Math.min(Math.floor(elapsedSeconds / 10), 9) // Max 9 for in-progress
      }
      
      return updatedState
    } catch (error) {
      console.error('Error initiating continuation:', error)
      return { ...state, error: (error as Error).message }
    }
  }
  
  /**
   * Create a summary for the continuation
   * @param state The continuation state
   * @returns String summary of the continuation state
   */
  static createSummary(state: ContinuationState): string {
    if (state.error) {
      return `Error during ${state.operationType || 'operation'}: ${state.error}`
    }
    
    if (state.completed) {
      const projectName = state.data?.project?.name || 'your project'
      return `Successfully completed generating ${projectName}. The project is now ready for download.`
    }
    
    const projectName = state.data?.project?.name || 'your project'
    const step = state.step || 0
    const progressMap = [
      'Initializing project generation',
      'Analyzing your requirements',
      'Planning project structure',
      'Designing API endpoints',
      'Creating database schema',
      'Generating backend code',
      'Building frontend components',
      'Configuring routing and state management',
      'Finalizing project assets',
      'Packaging for download'
    ]
    
    return `Still working on generating ${projectName}. Current step: ${progressMap[step]}. Progress: ${step * 10}% complete.`
  }
  
  /**
   * Handle auto continuation via API route
   * @param request The NextRequest object
   * @returns NextResponse with continuation info
   */
  static async handleContinuationRequest(request: NextRequest): Promise<NextResponse> {
    try {
      // Parse the request body
      const { state, newState } = await request.json()
      
      // If a new state is provided, update it
      if (newState) {
        const updatedState = await AutoContinue.initiateContinuation(newState)
        const summary = AutoContinue.createSummary(updatedState)
        
        return NextResponse.json({
          success: true,
          state: updatedState,
          summary
        })
      }
      
      // If a projectId is provided, check for continuation
      if (state && state.projectId) {
        const continuationState = await AutoContinue.checkContinuation(state.projectId)
        
        if (continuationState) {
          const summary = AutoContinue.createSummary(continuationState)
          
          return NextResponse.json({
            success: true,
            state: continuationState,
            summary,
            shouldContinue: true
          })
        }
      }
      
      // No continuation needed
      return NextResponse.json({
        success: true,
        shouldContinue: false
      })
    } catch (error) {
      console.error('Error handling continuation request:', error)
      return NextResponse.json(
        { success: false, error: (error as Error).message },
        { status: 500 }
      )
    }
  }
}
