import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { 
  generateProjectDetails, 
  generateFileContents, 
  generateZipFile 
} from '@/lib/services/ai-service'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const cookieStore = cookies()
  const supabase = createClient()
  
  try {
    // Check auth status
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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
        return NextResponse.json({ error: 'Project not found' }, { status: 404 })
      }
      throw error
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
    
    // Update status to generating
    await supabase
      .from('projects')
      .update({ status: 'generating' })
      .eq('id', projectId)
    
    // Increment user's generation count
    await supabase.rpc('increment_generation_count', {
      user_id: session.user.id
    })
    
    // Start background generation process
    // For MVP, we simulate a background process with a status update
    // In production, this would be a background job or serverless function
    setTimeout(async () => {
      try {
        // Generate project details
        const projectDetails = await generateProjectDetails(project.prompt)
        
        // Generate file contents
        const fileContents = await generateFileContents(project.prompt, projectDetails)
        
        // Generate zip file
        const zipBlob = await generateZipFile(projectDetails.name, fileContents)
        
        // Convert Blob to Buffer for Node.js environment
        const arrayBuffer = await zipBlob.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        
        // Store the file in Supabase Storage
        const timestamp = Date.now()
        const filePath = `project-zips/${projectId}/${timestamp}-${projectDetails.name.toLowerCase().replace(/\s+/g, '-')}.zip`
        
        const { error: uploadError } = await supabase.storage
          .from('project-files')
          .upload(filePath, buffer, {
            contentType: 'application/zip',
            upsert: true
          })
          
        if (uploadError) throw uploadError
        
        // Generate the public URL for the file
        const { data: publicUrl } = supabase.storage
          .from('project-files')
          .getPublicUrl(filePath)
        
        // Update project with completed status and download URL
        await supabase
          .from('projects')
          .update({
            status: 'completed',
            name: projectDetails.name,
            description: projectDetails.description,
            tech_stack: projectDetails.techStack,
            structure: projectDetails.structure,
            download_url: publicUrl.publicUrl,
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
    
    return NextResponse.json({ success: true, status: 'generating' })
  } catch (error) {
    console.error('Error regenerating project:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
