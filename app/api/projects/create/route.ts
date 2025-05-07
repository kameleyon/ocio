import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { ProjectService } from '@/lib/services/project-service';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      console.error('Error getting session or no session:', sessionError);
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
      return new NextResponse('Prompt is required', { status: 400 });
    }

    const userId = session.user.id;
    // Pass the supabase client to the ProjectService
    const projectService = new ProjectService(supabase);

    // Increment generation count before creating the project
    // You might want to handle the case where increment fails, e.g., user is over limit
    const incrementSuccess = await projectService.incrementUserGenerationCount(userId);
    if (!incrementSuccess) {
        // Consider what to do if increment fails. For now, let's log and continue,
        // but in a real app, you might prevent project creation.
        console.warn(`Failed to increment generation count for user ${userId}, but proceeding with project creation.`);
    }

    const newProject = await projectService.createProject(userId, prompt);

    if (!newProject) {
      console.error('Project creation failed in service for prompt:', prompt);
      return new NextResponse('Failed to create project', { status: 500 });
    }

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/projects/create:', error);
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