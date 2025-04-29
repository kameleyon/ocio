import { NextRequest, NextResponse } from 'next/server';
import { templates, getTemplateById } from '@/lib/services/generators/templates';
import { createRouteHandlerClient } from '@/lib/supabase/server';

// GET /api/templates - Get all available templates
export async function GET(request: NextRequest) {
  try {
    // Get template id from query params if provided
    const { searchParams } = new URL(request.url);
    const templateId = searchParams.get('id');
    
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
    
    // If template ID is provided, return specific template
    if (templateId) {
      const template = getTemplateById(templateId);
      
      if (!template) {
        return NextResponse.json(
          { error: 'Template not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        template: {
          id: template.id,
          name: template.name,
          description: template.description,
          techStack: template.techStack,
          // Don't include the full structure and baseFiles to reduce response size
          structurePreview: template.structure.slice(0, 5),
        }
      });
    }
    
    // Otherwise return all templates (with limited info)
    const templateList = templates.templates.map(template => ({
      id: template.id,
      name: template.name,
      description: template.description,
      techStack: template.techStack,
    }));
    
    return NextResponse.json({
      templates: templateList,
      defaultTemplate: templates.default
    });
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
