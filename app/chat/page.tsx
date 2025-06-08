// app/chat/page.tsx
import Sender from './sender';
import { createClient } from '@/app/utils/supabase/server';
//import { Database } from '@/app/utils/supabase/types/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';
import type { JSX } from 'react';
import Navbar from '../instruments/navbar';

// Create a custom User type that matches what your Sender component expects
type User = Omit<SupabaseUser, 'email'> & {
  email: string | null;
};

export default async function Page(): Promise<JSX.Element> {
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  const supabaseUser: SupabaseUser | null = userData.user;

  if (userError) {
    console.error('Error getting user:', userError);
    return (
      <div className="p-4 text-center text-red-600">
        Error authenticating user.
      </div>
    );
  }

  if (!supabaseUser) {
    return (
      <div className="p-4 text-center text-red-600">
        You must be logged in to view the chat.
      </div>
    );
  }

  const { data: profiles, error } = await supabase
   // .from<Database['public']['Tables']['user_profiles']['Row']>('user_profiles')
    .from('user_profiles')
    .select('user_id, full_name, profile_pic')
    .neq('user_id', supabaseUser.id);

  if (error) {
    console.error('Error fetching user profiles:', error);
    return (
      <div className="p-4 text-center text-red-600">
        Could not load contacts.
      </div>
    );
  }

  // Transform the Supabase user to match your expected User type
  const user: User = {
    ...supabaseUser,
    email: supabaseUser.email ?? null
  };

  return (
    <div>
            <Navbar />
  <Sender user={user} profiles={profiles ?? []} />
  
  
    </div>
  
  );
}