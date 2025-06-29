

import React from 'react';
import { createClient } from '@/app/utils/supabase/server';
import PreferencesClient from './PreferencesClient';
import type { JSX } from 'react';

export default async function PreferencesPage(): Promise<JSX.Element> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser(); 

  if (userError || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-700">
        <p className="text-center text-lg">Please log in to manage preferences.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <PreferencesClient userId={user.id} />
    </div>
  );
}
