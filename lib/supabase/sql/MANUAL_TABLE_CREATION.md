# Manual Supabase Table Creation Guide

Since the SQL scripts are encountering syntax errors, follow these steps to manually create the profiles table through the Supabase dashboard:

## Creating the Profiles Table

1. Log in to your Supabase dashboard: https://app.supabase.io/
2. Select your project: `cfovctpyutyvyqzvypwx`
3. Go to **Table Editor** in the left sidebar
4. Click the **Create a new table** button

## Table Configuration

Use these settings:

- **Name**: `profiles`
- **Description**: `User profiles and subscription information`
- **Enable Row Level Security (RLS)**: Check this box

## Define Columns

Add the following columns:

1. **id**
   - Type: `uuid`
   - Default Value: `uuid_generate_v4()`
   - Primary Key: Yes
   - Note: This will be linked to auth.users

2. **created_at**
   - Type: `timestamptz`
   - Default Value: `now()`

3. **updated_at**
   - Type: `timestamptz`
   - Default Value: `now()`

4. **email**
   - Type: `text`
   - Is Nullable: No

5. **full_name**
   - Type: `text`
   - Is Nullable: Yes

6. **avatar_url**
   - Type: `text`
   - Is Nullable: Yes

7. **subscription_tier**
   - Type: `text`
   - Default Value: `'free'`

8. **generation_count**
   - Type: `integer`
   - Default Value: `0`

Click **Save** to create the table.

## Add Foreign Key Constraint

After creating the table:

1. Go to the **SQL Editor** in the left sidebar
2. Create a new query
3. Run this SQL:

```sql
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_id_fkey
  FOREIGN KEY (id)
  REFERENCES auth.users(id)
  ON DELETE CASCADE;
```

## Add RLS Policies

Create these policies in the SQL Editor:

```sql
-- Allow users to view their own profile
CREATE POLICY "Users can view their own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);
```

## Create Function for Generation Count

Run this SQL to create the generation count function:

```sql
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
```

## Create User Trigger (Optional)

Create a trigger to automatically create profiles for new users:

```sql
-- Create function for the trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## Test the Setup

After completing these steps, try using your application to see if the error is resolved.
