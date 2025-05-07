import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { ApiError } from '@/lib/utils/api-error';
import { ProjectService } from '@/lib/services/project-service';

// This endpoint currently only sets the project status to 'failed'.
// A more robust implementation would involve actually stopping the background
// generation process (e.g., by sending a signal to the MCP server).
export async function POST(
  request: NextRequest,
  { params }: { params: { projectId: string } } // Changed id to projectId
) {
  try {
    const projectId = params.projectId; // Changed params.id to params.projectId
    if (!projectId) {
      return new NextResponse('Project ID is required', { status: 400 });
    }

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      console.error('Error getting session or no session for cancel:', sessionError);
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const projectService = new ProjectService(supabase);
    const project = await projectService.getProjectById(projectId);

    if (!project) {
      return new NextResponse('Project not found', { status: 404 });
    }

    if (project.user_id !== session.user.id) {
      return new NextResponse('Forbidden: You do not own this project', { status: 403 });
    }

    if (project.status !== 'generating') {
      return new NextResponse('Project is not currently generating', { status: 400 });
    }

    // In a real implementation, you would send a signal to the background
    // process (e.g., MCP server) to stop generation.
    // For now, we simply update the project status to 'failed'.
    const { error: updateError } = await supabase
      .from('projects')
      .update({ status: 'failed', current_generation_step: 'cancelled' }) // Also update step
      .eq('id', projectId);

    if (updateError) {
      console.error('Error updating project status to failed:', updateError);
      return new NextResponse('Failed to cancel project generation', { status: 500 });
    }
    
    // Add a log entry for cancellation
    try {
        await supabase.from('project_logs').insert({
            project_id: projectId,
            level: 'warning',
            message: 'Project generation cancelled by user.'
        });
    } catch (logError) {
        console.error("Failed to add cancellation log:", logError);
    }


    return NextResponse.json({ success: true, message: 'Project generation cancelled' });

  } catch (error) {
    console.error(`Error cancelling project ${params.projectId}:`, error); // Changed params.id
    let message = 'Internal Server Error';
    if (error instanceof Error) {
      message = error.message;
    }
    return new NextResponse(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}