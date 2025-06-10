// app/page.tsx
import { createClient } from '@/app/utils/supabase/server';
import Navbar from '../instruments/navbar';
import type { JSX } from 'react';
import { User } from '@supabase/supabase-js';
import SetCookiePage from './setcookiepage';

export default async function HomePage(): Promise<JSX.Element> {

 //get user 
  const supabase = await createClient();

 
   const {
     data: { user },
   }: { data: { user: User | null } } = await supabase.auth.getUser();

    if(!user)
    {
      console.log("No user found");

    }else{
      console.log(user.id);
    }
 

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-100 to-white text-gray-800">
      <Navbar />
      <nav className="flex justify-between items-center px-8 py-6">
        <h1 className="text-2xl font-bold text-pink-600">Pairly</h1>
      </nav>

      <section className="flex flex-col items-center justify-center text-center mt-24 px-4">
        <h2 className="text-4xl font-bold mb-4 text-pink-700">Welcome to Pairly</h2>
        <p className="text-lg max-w-xl text-gray-600">
          Connect with real people. 
        </p>
       
         <SetCookiePage userID={user?.id} />

          
      </section>
    </main>
  );
}
