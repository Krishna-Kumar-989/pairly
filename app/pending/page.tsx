import { createClient } from '@/app/utils/supabase/server';
import PendingClient from './PendingClient';
import Navbar from '../instruments/navbar';

// Define TypeScript types for your data (adjust fields as per your schema)
interface UserProfile {
  id: string;
  full_name: string;
  username: string;
  avatar_url?: string | null;
  bio?: string | null;
  // add other user_profiles fields as needed
}

interface Interaction {
  id: string;
  sender_id: string;
  receiver_id: string;
  content?: string | null;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  // add other interactions fields as needed
}

export default async function PendingPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-red-400 px-4">
        <p className="text-white text-lg font-semibold">You must be signed in.</p>
      </div>
    );
  }

  // Fetch all profiles
  const { data: profiles, error: profilesError } = await supabase
    //.from<UserProfile>('user_profiles')
    .from('user_profiles')
    .select('*');

  if (profilesError) {
    console.error(profilesError);
    return <div>Error loading profiles.</div>;
  }

  // Fetch all pending interactions where current user is the receiver
  const { data: interactions, error: interactionsError } = await supabase
    //.from<Interaction>('interactions')
    .from('interactions')
    .select('*')
    .eq('receiver_id', user.id)
    .eq('status', 'pending');

  if (interactionsError) {
    console.error(interactionsError);
    return <div>Error loading interactions.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-400 flex flex-col">
      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-20 backdrop-blur-md shadow-md">
        <Navbar />
      </div>

      {/* Main Content */}
      <main className="pt-[60px] px-4 flex-grow flex justify-center overflow-auto">
        <div className="max-w-3xl w-full bg-pink-50 bg-opacity-90 rounded-3xl shadow-xl p-8 mt-8">
          {/* Pass typed props */}
          <PendingClient
             userId=''
            profiles={profiles ?? []}
            interactions={interactions ?? []}
          />
        </div>
      </main>
    </div>
  );
}
