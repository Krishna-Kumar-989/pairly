// app/page.tsx
import { createClient } from '@/app/utils/supabase/server';
import Navbar from './instruments/navbar';
import type { JSX } from 'react';

export default async function HomePage(): Promise<JSX.Element> {
  const supabase = await createClient();

  // Call auth but don't destructure `user` since it's unused
  await supabase.auth.getUser();

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-100 to-white text-gray-800">
      <Navbar />
      <nav className="flex justify-between items-center px-8 py-6">
        <h1 className="text-2xl font-bold text-pink-600">Pairly</h1>
      </nav>

      <section className="flex flex-col items-center justify-center text-center mt-24 px-4">
        <h2 className="text-4xl font-bold mb-4 text-pink-700">Welcome to Pairly</h2>
        <p className="text-lg max-w-xl text-gray-600">
          Connect with real people. Find love, friendship, and everything in between — beautifully.
        </p>
      </section>
    </main>
  );
}
