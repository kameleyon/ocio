import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { getProjectsByUserId } from '@/lib/services/project-service'
import { generateProjectName, generateProjectDetails } from '@/lib/services/ai-service'

export async function GET(request: NextRequest) {
  const cookieStore = cookies()
  const supabase = createClient()
  
  try {
    // Check auth status
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get user's projects
    const projects = await getProjectsByUserId(session.user.id)
    
    return NextResponse.json(projects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const cookieStore = cookies()
  const supabase = createClient()
  
  try {
    // Check auth status
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get request body
    const { prompt } = await request.json()
    
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }
    
    // Check user's generation limit (free tier: 5/day, pro tier: unlimited)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('subscription_tier, generation_count')
      .eq('id', session.user.id)
      .single()
    
    if (profileError) {
      throw profileError
    }
    
    const isFreeUser = !profile.subscription_tier || profile.subscription_tier === 'free'
    if (isFreeUser && profile.generation_count >= 5) {
      return NextResponse.json({ 
        error: 'Generation limit reached for free tier', 
        limitReached: true 
      }, { status: 403 })
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
    
    if (error) throw error
    
    // Increment user's generation count
    await supabase.rpc('increment_generation_count', {
      user_id: session.user.id
    })
    
    // Start background generation process
    // For MVP, we simulate a background process with a status update
    // In production, this would be a background job, serverless function, or webhook
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
          
      } catch (genError) {
        console.error('Error in background generation:', genError)
        
        // Update project as failed
        await supabase
          .from('projects')
          .update({ status: 'failed' })
          .eq('id', projectId)
      }
    }, 1000)
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
