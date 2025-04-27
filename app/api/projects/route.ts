import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { getProjectsByUserId } from '@/lib/services/project-service'

export async function GET(request: NextRequest) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  
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
  const supabase = createClient(cookieStore)
  
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
    
    // Create new project
    const { data, error } = await supabase
      .from('projects')
      .insert([
        {
          user_id: session.user.id,
          name: 'New Project',
          description: prompt,
          prompt: prompt,
          status: 'pending',
          tech_stack: {},
        }
      ])
      .select()
      .single()
    
    if (error) throw error
    
    // Start generation process (in real app, this would trigger a background job)
    // For MVP, we'll simulate this with a status update
    setTimeout(async () => {
      await supabase
        .from('projects')
        .update({
          status: 'completed',
          name: 'Generated App',
          tech_stack: {
            frontend: 'React, TypeScript, Tailwind CSS',
            backend: 'Node.js, Express',
            database: 'MongoDB',
            deployment: 'Vercel'
          }
        })
        .eq('id', data.id)
    }, 10000)
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
