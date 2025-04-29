-- Database schema optimization for OptimusCode.io

-- Enable Row Level Security
alter table public.projects enable row level security;
alter table public.profiles enable row level security;

-- Projects table indexes
create index if not exists idx_projects_user_id on public.projects(user_id);
create index if not exists idx_projects_status on public.projects(status);
create index if not exists idx_projects_created_at on public.projects(created_at);

-- Projects table constraints
alter table public.projects
  add constraint fk_projects_user_id
  foreign key (user_id)
  references auth.users(id)
  on delete cascade;

-- Profile related indexes
create index if not exists idx_profiles_subscription_tier on public.profiles(subscription_tier);

-- RLS Policies for projects
create policy "Users can view their own projects"
  on public.projects for select
  using (auth.uid() = user_id);

create policy "Users can insert their own projects"
  on public.projects for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own projects"
  on public.projects for update
  using (auth.uid() = user_id);

create policy "Users can delete their own projects"
  on public.projects for delete
  using (auth.uid() = user_id);

-- RLS Policies for profiles
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Function to increment generation count
create or replace function public.increment_generation_count(user_id uuid)
returns void as $$
begin
  update public.profiles
  set 
    generation_count = generation_count + 1,
    updated_at = now()
  where id = user_id;
end;
$$ language plpgsql security definer;

-- Generation limit function
create or replace function public.check_generation_limit(user_id uuid)
returns boolean as $$
declare
  user_tier text;
  gen_count int;
  current_day date := current_date;
  limit_reached boolean := false;
begin
  -- Get user's subscription tier and generation count
  select subscription_tier, generation_count
  into user_tier, gen_count
  from public.profiles
  where id = user_id;
  
  -- Check if limit is reached based on tier
  if user_tier = 'free' and gen_count >= 5 then
    limit_reached := true;
  elsif user_tier = 'pro' and gen_count >= 50 then
    limit_reached := true;
  end if;
  
  return limit_reached;
end;
$$ language plpgsql security definer;

-- Reset generation counts daily via cron job
create extension if not exists pg_cron;

select cron.schedule(
  'reset-daily-generation-counts',
  '0 0 * * *',  -- Midnight every day
  $$
    update public.profiles
    set generation_count = 0
    where subscription_tier = 'free';
  $$
);

-- Function to clean up old projects based on tier
create or replace function public.cleanup_old_projects()
returns void as $$
begin
  -- For free tier, keep projects for 30 days
  delete from public.projects
  where user_id in (
    select id from public.profiles 
    where subscription_tier = 'free' or subscription_tier is null
  )
  and created_at < now() - interval '30 days';
  
  -- For pro tier, keep projects for 90 days
  delete from public.projects
  where user_id in (
    select id from public.profiles 
    where subscription_tier = 'pro'
  )
  and created_at < now() - interval '90 days';
  
  -- For enterprise tier, keep projects for 365 days
  delete from public.projects
  where user_id in (
    select id from public.profiles 
    where subscription_tier = 'enterprise'
  )
  and created_at < now() - interval '365 days';
end;
$$ language plpgsql security definer;

-- Schedule cleanup function to run weekly
select cron.schedule(
  'cleanup-old-projects',
  '0 0 * * 0',  -- Midnight on Sundays
  $$
    select public.cleanup_old_projects();
  $$
);

-- Add audit trail for important actions
create table if not exists public.audit_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  details jsonb,
  ip_address text,
  created_at timestamptz default now()
);

create index if not exists idx_audit_logs_user_id on public.audit_logs(user_id);
create index if not exists idx_audit_logs_created_at on public.audit_logs(created_at);

-- Audit trail function
create or replace function public.add_audit_log(
  p_user_id uuid,
  p_action text,
  p_entity_type text,
  p_entity_id uuid,
  p_details jsonb,
  p_ip_address text
)
returns uuid as $$
declare
  log_id uuid;
begin
  insert into public.audit_logs(
    user_id, action, entity_type, entity_id, details, ip_address
  )
  values (
    p_user_id, p_action, p_entity_type, p_entity_id, p_details, p_ip_address
  )
  returning id into log_id;
  
  return log_id;
end;
$$ language plpgsql security definer;
