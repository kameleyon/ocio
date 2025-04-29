# OptimusCode.io Supabase Setup Guide

This guide explains how to set up the required Supabase tables for OptimusCode.io.

## Issue

The application is experiencing errors because the `projects` table doesn't exist:

```
ERROR: relation "public.projects" does not exist
```

## Solution

### Option 1: Using Supabase Dashboard (Recommended)

1. Log in to your Supabase Dashboard at https://app.supabase.io/
2. Select your project: `cfovctpyutyvyqzvypwx`
3. Go to the SQL Editor in the left sidebar
4. Create a new query
5. Copy and paste the contents of `create_projects_table_simple.sql` file
6. Run the query

The SQL script will:
- Create the projects table if it doesn't exist
- Enable Row Level Security (RLS)
- Create appropriate RLS policies for user access

### Option 2: Using Node.js Script

If you have direct access to the Supabase database or prefer using code:

1. Make sure you have Node.js installed
2. Run the following commands:

```bash
cd C:\Users\Administrator\myAPP\ocioweb
npm install @supabase/supabase-js dotenv
node fix-projects-table.js
```

## Verifying the Fix

After running either solution, you can verify the fix by:

1. Restarting your application
2. Check if the error `relation "public.projects" does not exist` has disappeared
3. Test the projects functionality in the application

## Table Structure

The `projects` table has the following structure:

```sql
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  prompt TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  tech_stack JSONB DEFAULT '{}'::JSONB,
  download_url TEXT,
  structure JSONB DEFAULT '{}'::JSONB,
  files JSONB DEFAULT '[]'::JSONB
);
```

This matches the TypeScript types defined in your application.
