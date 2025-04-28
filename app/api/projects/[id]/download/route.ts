import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { 
  generateFileContents, 
  generateZipFile, 
  ProjectDetails 
} from '@/lib/services/ai-service'
import { Readable } from 'stream'

export async function GET(
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
    
    // Check if project is completed
    if (project.status !== 'completed') {
      return NextResponse.json({ error: 'Project generation is not complete' }, { status: 400 })
    }
    
    // Check if download URL already exists
    if (project.download_url && project.download_url.startsWith('http')) {
      // Redirect to existing download URL
      return NextResponse.redirect(project.download_url)
    }
    
    // Create project details from project data
    const projectDetails: ProjectDetails = {
      name: project.name,
      description: project.description,
      techStack: project.tech_stack as any,
      files: [],
      structure: project.structure as string[] || []
    }
    
    // Generate file contents
    const fileContents = await generateFileContents(project.prompt, projectDetails)
    
    // Generate zip file
    const zipBlob = await generateZipFile(project.name, fileContents)
    
    // Store the file in Supabase Storage (if not already there)
    const filePath = `project-zips/${projectId}/${project.name.toLowerCase().replace(/\s+/g, '-')}.zip`
    
    // Convert Blob to Buffer for Node.js environment
    const arrayBuffer = await zipBlob.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    const { error: uploadError } = await supabase.storage
      .from('project-files')
      .upload(filePath, buffer, {
        contentType: 'application/zip',
        upsert: true
      })
    
    if (uploadError) throw uploadError
    
    // Get public URL
    const { data: publicUrl } = supabase.storage
      .from('project-files')
      .getPublicUrl(filePath)
    
    // Update project with download URL
    await supabase
      .from('projects')
      .update({ download_url: publicUrl.publicUrl })
      .eq('id', projectId)
    
    // Redirect to the download URL
    return NextResponse.redirect(publicUrl.publicUrl)
  } catch (error) {
    console.error('Error generating download:', error)
    return NextResponse.json({ error: 'Error generating download' }, { status: 500 })
  }
}
