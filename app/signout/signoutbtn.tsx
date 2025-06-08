// components/signoutbtn.tsx

'use client';

import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { LogOut } from 'lucide-react';

interface SignOutButtonProps {
  className?: string;
}

export default function SignOutButton({ className = '' }: SignOutButtonProps) {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out failed:', error.message);
    } else {
      router.push('/login');
    }
  };

  return (
    <button
      onClick={handleSignOut}
      className={`${className} flex items-center justify-center gap-2 rounded-lg bg-red-500 px-6 py-3 text-black font-medium hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition`}
    >
      <LogOut className="h-5 w-5" />
      <span>Sign Out</span>
    </button>
  );
}
