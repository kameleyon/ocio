-- Table: project_logs
-- Stores individual log entries for each project generation process.

CREATE TABLE IF NOT EXISTS public.project_logs (
    id BIGSERIAL PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    level TEXT NOT NULL CHECK (level IN ('info', 'error', 'warning', 'command', 'debug', 'success')),
    message TEXT NOT NULL,
    details JSONB NULL,
    -- Optional: if you want to associate logs with specific generation steps
    -- step_id TEXT NULL 
);

-- Enable RLS
ALTER TABLE public.project_logs ENABLE ROW LEVEL SECURITY;

-- Policies for project_logs:
-- 1. Users can read logs for projects they own.
-- 2. Service role (used by backend ProjectService) can insert logs.

CREATE POLICY "Users can read logs for their own projects"
ON public.project_logs
FOR SELECT
USING (auth.uid() = (SELECT user_id FROM public.projects WHERE id = project_id));

-- Allow service_role to insert (backend operations)
-- Note: For direct inserts from ProjectService, it will use the service_role key which bypasses RLS.
-- If you were to allow users to insert logs (not typical for this scenario), you'd need a different policy.

-- Optional: Indexes for performance
CREATE INDEX IF NOT EXISTS idx_project_logs_project_id_created_at ON public.project_logs(project_id, created_at DESC);

-- Grant usage on the sequence for the id column to the authenticated role
-- This might be needed if inserts are done by 'authenticated' role, though service_role bypasses this.
GRANT USAGE, SELECT ON SEQUENCE project_logs_id_seq TO authenticated;

COMMENT ON TABLE public.project_logs IS 'Stores individual log entries for project generation processes.';
COMMENT ON COLUMN public.project_logs.level IS 'Log level: info, error, warning, command, debug, success.';
COMMENT ON COLUMN public.project_logs.details IS 'Optional structured data associated with the log entry.';

-- After creating this table, you'll need to enable it for Supabase Realtime via the Supabase Dashboard:
-- Go to Database -> Replication, find 'public' schema, and add 'project_logs' to the list of broadcasted tables.
-- Or, you can run: alter publication supabase_realtime add table project_logs; (if you have direct DB access)