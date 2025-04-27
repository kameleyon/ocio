import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { getProjectById } from '@/lib/services/project-service'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  
  try {
    // Check auth status
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Check if project exists and belongs to user
    const project = await getProjectById(params.id)
    
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }
    
    if (project.user_id !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }
    
    // Update project status to regenerating
    const { error } = await supabase
      .from('projects')
      .update({ status: 'generating' })
      .eq('id', params.id)
    
    if (error) throw error
    
    // Simulate regeneration (in real app, this would trigger a background job)
    setTimeout(async () => {
      await supabase
        .from('projects')
        .update({
          status: 'completed',
          tech_stack: {
            frontend: 'React, TypeScript, Tailwind CSS',
            backend: 'Node.js, Express',
            database: 'MongoDB',
            deployment: 'Vercel'
          }
        })
        .eq('id', params.id)
    }, 8000)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error regenerating project:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
