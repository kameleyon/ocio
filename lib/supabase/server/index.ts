import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '../types';

export function createServerSupabaseClient() {
  const cookieStore = cookies();

  return createServerClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );
}

export async function getSession() {
  const supabase = createServerSupabaseClient();
  
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    
    return session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

export async function getUserDetails() {
  const session = await getSession();
  
  if (!session?.user) {
    return null;
  }
  
  return session.user;
}

export async function requireAuth() {
  const user = await getUserDetails();
  
  if (!user) {
    throw new Error('Authentication required');
  }
  
  return user;
}
