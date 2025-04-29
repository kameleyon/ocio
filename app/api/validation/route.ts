import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@/lib/supabase/server';
import { validateCode } from '@/lib/services/generators/code-validator';

// POST /api/validation - Validate a code file
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
    
    if (!body.code || !body.path) {
      return NextResponse.json(
        { error: 'Missing required fields: code and path' },
        { status: 400 }
      );
    }
    
    // Validate the code
    const validationResult = await validateCode(body.code, body.path);
    
    return NextResponse.json({
      validation: validationResult
    });
  } catch (error) {
    console.error('Error validating code:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
