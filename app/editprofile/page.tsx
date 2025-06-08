import { createClient } from '@/app/utils/supabase/server';
import EditProfileClient from './EditProfileClient';
import Navbar from '../instruments/navbar'; // Adjust the path based on your project structure
import type { User } from '@supabase/supabase-js';
import type { JSX } from 'react';

interface Profile {
  profile_pic: string | null;
  bio: string | null;
}

export default async function EditProfilePage(): Promise<JSX.Element> {
  const supabase = await createClient();

  const {
    data: { user },
  }: { data: { user: User | null } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-100 to-violet-100 p-8">
        <Navbar />
        <div className="flex items-center justify-center h-full text-center">
          <p className="text-red-600 text-lg font-semibold">Please log in to edit your profile.</p>
        </div>
      </div>
    );
  }

  const { data: profile, error } = await supabase
    .from('user_profiles')
    .select('profile_pic,bio')
    .eq('user_id', user.id)
    .single();

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-100 via-pink-100 to-yellow-100 p-8">
        <Navbar />
        <div className="flex items-center justify-center h-full text-center">
          <p className="text-red-600 text-lg font-semibold">
            Failed to load profile: {error?.message || 'Unknown error'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen w-full bg-gradient-to-br from-pink-100 via-rose-100 to-violet-100 pt-14 flex items-center justify-center px-4">
        <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-8">
          <EditProfileClient userId={user.id} profile={profile} />
        </div>
      </main>
    </>
  );
}
