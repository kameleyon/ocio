import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { ApiError } from '@/lib/utils/api-error';
import { ProjectService } from '@/lib/services/project-service';

export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const projectId = params.projectId;
    if (!projectId) {
      return new NextResponse('Project ID is required', { status: 400 });
    }

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      console.error('Error getting session or no session for status:', sessionError);
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

    return NextResponse.json({ id: project.id, status: project.status })
  } catch (error) {
    console.error('Error getting project status:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const projectId = params.projectId;
    if (!projectId) {
      return new NextResponse('Project ID is required', { status: 400 });
    }

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      console.error('Error getting session or no session for status:', sessionError);
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

    return NextResponse.json({ id: project.id, status: project.status })
  } catch (error) {
    console.error('Error getting project status:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}