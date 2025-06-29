import React from 'react';
import { createClient } from '@/app/utils/supabase/server';
import MatchCard from './components/MatchCard';
import Navbar from '../instruments/navbar';
import type { JSX } from 'react';

// MatchCard expects these fields:
type UserProfile = {
  user_id: string;
  full_name: string;
  profile_pic: string | null;
  bio: string | null;
  age: number | null;
  gender: string | null;
  city?: string | null;
  country?: string | null;
};

type LocationData = {
  city: string | null;
  country: string | null;
};

export default async function PotentialMatchPage(): Promise<JSX.Element> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  const navbar = <Navbar />;

  if (userError || !user) {
    return (
      <>
        {navbar}
        <div className="p-4 text-center">Please log in to view matches.</div>
      </>
    );
  }

  const noPreviousMatch = true;

  let profiles: UserProfile[] | null = null;
  let profilesError: Error | null = null;

  if (noPreviousMatch) {
    const {
      data: previousInteractions,
      error: interactionError,
    } = await supabase
      .from('interactions')
      .select('receiver_id')
      .eq('sender_id', user.id);

    if (interactionError) {
      return (
        <>
          {navbar}
          <div className="p-4 text-center">Error checking interaction history.</div>
        </>
      );
    }

    const interactedIds =
      previousInteractions?.map((entry: { receiver_id: string }) => entry.receiver_id) || [];

    let query = supabase
      .from('user_profiles')
      .select('user_id, full_name, profile_pic, bio, age, gender')
      .neq('user_id', user.id);

    if (interactedIds.length > 0) {
      query = query.not('user_id', 'in', `(${interactedIds.join(',')})`);
    }

    const result = await query.limit(10);
    profiles = result.data as UserProfile[] | null;
    profilesError = result.error;
  } else {
    const result = await supabase
      .from('user_profiles')
      .select('user_id, full_name, profile_pic, bio, age, gender')
      .neq('user_id', user.id)
      .limit(10);

    profiles = result.data as UserProfile[] | null;
    profilesError = result.error;
  }

  if (profilesError) {
    return (
      <>
        {navbar}
        <div className="p-4 text-center">Error loading matches.</div>
      </>
    );
  }

  if (!profiles || profiles.length === 0) {
    return (
      <>
        {navbar}
        <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-400">
          <p className="text-center text-white text-lg font-semibold">
            No matches available at the moment.
          </p>
        </div>
      </>
    );
  }

  const randomProfile = profiles[Math.floor(Math.random() * profiles.length)];

  const {
    data: locationData,
    error: locationError,
  } = await supabase
    .from('user_location')
    .select('city, country')
    .eq('id', randomProfile.user_id)
    .single();

  if (locationError) {
    return (
      <>
        {navbar}
        <div className="p-4 text-center">Error loading location data.</div>
      </>
    );
  }

  const profileWithLocation: UserProfile = {
    ...randomProfile,
    city: (locationData as LocationData | null)?.city || null,
    country: (locationData as LocationData | null)?.country || null,
  };

  return (
    <>
      {navbar}
      <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-red-400 px-4 py-10">
        <MatchCard profile={profileWithLocation} senderId={user.id} />
      </main>
    </>
  );
}
