import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@/lib/supabase/server';
import { getTemplateById, getDefaultTemplate } from '@/lib/services/generators/templates';

// POST /api/structure - Generate a directory structure for a project
export async function POST(request: NextRequest) {
  try {
    // Create Supabase client
    const supabase = createRouteHandlerClient();
    
    // Check authentication
    const { data: session } = await supabase.auth.getSession();
    
    if (!session.session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Get request body
    const body = await request.json();
    
    if (!body.projectName || !body.techStack) {
      return NextResponse.json(
        { error: 'Missing required fields: projectName and techStack' },
        { status: 400 }
      );
    }
    
    // Determine which template to use based on tech stack
    let template;
    const { techStack } = body;
    
    if (typeof techStack.frontend === 'string' && techStack.frontend.toLowerCase().includes('next')) {
      template = getTemplateById('next-js');
    } else if (
      (typeof techStack.backend === 'string' && techStack.backend.toLowerCase().includes('express')) || 
      (typeof techStack.database === 'string' && techStack.database.toLowerCase().includes('mongo'))
    ) {
      template = getTemplateById('mern-stack');
    } else {
      template = getTemplateById('react-vite');
    }
    
    // Fall back to default template if none matched
    if (!template) {
      template = getDefaultTemplate();
    }
    
    // Replace {project-name} placeholders with actual project name
    const normalizedProjectName = body.projectName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const structure = template.structure.map(line => 
      line.replace('{project-name}', normalizedProjectName)
    );
    
    return NextResponse.json({
      structure,
      template: {
        id: template.id,
        name: template.name
      }
    });
  } catch (error) {
    console.error('Error generating structure:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
