-- Create profiles table with basic structure
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'free',
  generation_count INTEGER DEFAULT 0
);

-- Add foreign key constraint
ALTER TABLE public.profiles 
  ADD CONSTRAINT profiles_id_fkey 
  FOREIGN KEY (id) REFERENCES auth.users(id) 
  ON DELETE CASCADE;

-- Create index
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_tier 
  ON public.profiles(subscription_tier);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create basic increment function
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
