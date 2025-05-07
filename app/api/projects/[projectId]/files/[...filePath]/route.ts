import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { ProjectService } from '@/lib/services/project-service';
import path from 'path'; // For path normalization and security

export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string; filePath: string[] } }
) {
  try {
    const projectId = params.projectId;
    const filePathArray = params.filePath;

    if (!projectId) {
      return new NextResponse(JSON.stringify({ error: 'Project ID is required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    if (!filePathArray || filePathArray.length === 0) {
      return new NextResponse(JSON.stringify({ error: 'File path is required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    // Reconstruct the file path and normalize it for security
    // This helps prevent directory traversal attacks by resolving '..'
    const relativeFilePath = path.normalize(filePathArray.join('/'));

    // Basic security check: ensure the normalized path doesn't try to go "up"
    if (relativeFilePath.startsWith('..') || path.isAbsolute(relativeFilePath)) {
        return new NextResponse(JSON.stringify({ error: 'Invalid file path' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      console.error('Error getting session or no session for file access:', sessionError);
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const projectService = new ProjectService(supabase);
    
    // First, verify the user owns the project
    const project = await projectService.getProjectById(projectId);
    if (!project) {
      return new NextResponse(JSON.stringify({ error: 'Project not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }
    if (project.user_id !== session.user.id) {
      return new NextResponse(JSON.stringify({ error: 'Forbidden: You do not own this project' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
    }

    // Use the new ProjectService method to get file content
    const fileContent = await projectService.getProjectFileContent(projectId, relativeFilePath);

    if (fileContent === null) {
      return new NextResponse(JSON.stringify({ error: 'File not found within the project or unable to read' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }

    // Determine content type based on file extension
    let contentType = 'text/plain';
    const ext = path.extname(relativeFilePath).toLowerCase();
    if (ext === '.json') contentType = 'application/json';
    else if (ext === '.html' || ext === '.htm') contentType = 'text/html';
    else if (ext === '.css') contentType = 'text/css';
    else if (ext === '.js' || ext === '.mjs') contentType = 'application/javascript';
    else if (ext === '.ts' || ext === '.tsx') contentType = 'application/typescript'; // Or text/plain
    // Add more types as needed

    return new NextResponse(fileContent, {
      status: 200,
      headers: { 'Content-Type': contentType },
    });

  } catch (error) {
    console.error(`Error fetching file for project ${params.projectId}, path ${params.filePath.join('/')}:`, error);
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