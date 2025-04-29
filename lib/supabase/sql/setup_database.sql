-- Create projects table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  prompt TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'generating', 'completed', 'failed')),
  tech_stack JSONB DEFAULT '{}'::JSONB,
  download_url TEXT,
  structure JSONB DEFAULT '{}'::JSONB,
  files JSONB DEFAULT '[]'::JSONB
);

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  subscription_tier TEXT CHECK (subscription_tier IN ('free', 'pro', 'enterprise')),
  generation_count INT DEFAULT 0
);

-- Create audit_logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Projects table indexes
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON public.projects(created_at);

-- Profile related indexes
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_tier ON public.profiles(subscription_tier);

-- Audit logs indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at);

-- Enable Row Level Security
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for projects
CREATE POLICY IF NOT EXISTS "Users can view their own projects"
  ON public.projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert their own projects"
  ON public.projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update their own projects"
  ON public.projects FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can delete their own projects"
  ON public.projects FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for profiles
CREATE POLICY IF NOT EXISTS "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create functions

-- Function to increment generation count
CREATE OR REPLACE FUNCTION public.increment_generation_count(user_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles
  SET 
    generation_count = generation_count + 1,
    updated_at = now()
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check generation limit
CREATE OR REPLACE FUNCTION public.check_generation_limit(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_tier TEXT;
  gen_count INT;
  limit_reached BOOLEAN := false;
BEGIN
  -- Get user's subscription tier and generation count
  SELECT subscription_tier, generation_count
  INTO user_tier, gen_count
  FROM public.profiles
  WHERE id = user_id;
  
  -- Check if limit is reached based on tier
  IF user_tier = 'free' AND gen_count >= 5 THEN
    limit_reached := true;
  ELSIF user_tier = 'pro' AND gen_count >= 50 THEN
    limit_reached := true;
  END IF;
  
  RETURN limit_reached;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up old projects
CREATE OR REPLACE FUNCTION public.cleanup_old_projects()
RETURNS VOID AS $$
BEGIN
  -- For free tier, keep projects for 30 days
  DELETE FROM public.projects
  WHERE user_id IN (
    SELECT id FROM public.profiles 
    WHERE subscription_tier = 'free' OR subscription_tier IS NULL
  )
  AND created_at < now() - INTERVAL '30 days';
  
  -- For pro tier, keep projects for 90 days
  DELETE FROM public.projects
  WHERE user_id IN (
    SELECT id FROM public.profiles 
    WHERE subscription_tier = 'pro'
  )
  AND created_at < now() - INTERVAL '90 days';
  
  -- For enterprise tier, keep projects for 365 days
  DELETE FROM public.projects
  WHERE user_id IN (
    SELECT id FROM public.profiles 
    WHERE subscription_tier = 'enterprise'
  )
  AND created_at < now() - INTERVAL '365 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function for audit logging
CREATE OR REPLACE FUNCTION public.add_audit_log(
  p_user_id UUID,
  p_action TEXT,
  p_entity_type TEXT,
  p_entity_id UUID,
  p_details JSONB,
  p_ip_address TEXT
)
RETURNS UUID AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO public.audit_logs(
    user_id, action, entity_type, entity_id, details, ip_address
  )
  VALUES (
    p_user_id, p_action, p_entity_type, p_entity_id, p_details, p_ip_address
  )
  RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for profile creation on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, subscription_tier, generation_count)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    'free',
    0
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger if it doesn't exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
