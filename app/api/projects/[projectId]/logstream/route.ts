import { createRouteHandlerClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/lib/supabase/types';

export const dynamic = 'force-dynamic'; // Ensures the route is not cached

// Helper function to construct SSE messages
function formatSseMessage(event: string, data: any): string {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient();
  const projectId = params.projectId;

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  // Verify user owns the project or has access
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('id, user_id')
    .eq('id', projectId)
    .eq('user_id', user.id)
    .single();

  if (projectError || !project) {
    return new NextResponse('Project not found or access denied', { status: 404 });
  }

  const stream = new ReadableStream({
    async start(controller) {
      const channel = supabase
        .channel(`project_logs_${projectId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'project_logs',
            filter: `project_id=eq.${projectId}`,
          },
          (payload: any) => {
            // console.log(`SSE: New log for ${projectId}:`, payload.new);
            controller.enqueue(formatSseMessage('log', payload.new));
          }
        )
        .subscribe((status: any, err: any) => {
          if (status === 'SUBSCRIBED') {
            // console.log(`SSE: Subscribed to logs for project ${projectId}`);
            // Optionally, send existing logs upon connection
            sendExistingLogs(supabase, projectId, controller);
          } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || err) {
            console.error(`SSE: Channel error for project ${projectId}`, err);
            controller.error(err || new Error(`Channel error: ${status}`));
            controller.close();
            channel.unsubscribe();
          }
        });

      // Function to send existing logs
      async function sendExistingLogs(
        client: SupabaseClient<Database>,
        pId: string,
        ctrl: ReadableStreamDefaultController<any>
      ) {
        const { data: existingLogs, error: logsError } = await client
          .from('project_logs')
          .select('*')
          .eq('project_id', pId)
          .order('created_at', { ascending: true });

        if (logsError) {
          console.error(`SSE: Error fetching existing logs for ${pId}:`, logsError);
          // Don't close the stream, just log the error
        } else if (existingLogs) {
          // console.log(`SSE: Sending ${existingLogs.length} existing logs for ${pId}`);
          existingLogs.forEach(log => {
            ctrl.enqueue(formatSseMessage('log', log));
          });
        }
      }
      
      // Handle client disconnect
      request.signal.addEventListener('abort', () => {
        // console.log(`SSE: Client disconnected for project ${projectId}, unsubscribing.`);
        channel.unsubscribe();
        controller.close();
      });
    },
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      // Optional: CORS headers if your frontend is on a different domain/port during development
      // 'Access-Control-Allow-Origin': '*', 
    },
  });
}