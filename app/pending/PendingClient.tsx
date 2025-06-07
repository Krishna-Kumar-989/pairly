'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabase';
import type { JSX } from 'react';

type Interaction = {
  id: string;
  sender_id: string;
  content: string;
  status: string;
  created_at: string;
};

type Profile = {
  user_id: string;
  full_name: string;
  profile_pic: string | null;
};

type Props = {
  userId: string;
  profiles: Profile[];
  interactions: Interaction[];
};

export default function PendingClient({profiles, interactions }: Props): JSX.Element {
  const [pending, setPending] = useState<Interaction[]>(interactions);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const updateStatus = async (id: string, status: 'accepted' | 'rejected'): Promise<void> => {
    setLoadingId(id);

    const { error } = await supabase
      .from('interactions')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error(`Failed to update interaction ${id}:`, error);
    } else {
      setPending((prev) => prev.filter((i) => i.id !== id));
    }

    setLoadingId(null);
  };

  if (pending.length === 0) {
    return (
      <div className="flex-grow flex items-center justify-center text-gray-600 text-lg select-none">
        No pending interactions.
      </div>
    );
  }

  return (
    <div className="min-h-full flex flex-col">
      <h2 className="text-3xl font-semibold tracking-wide text-pink-700 border-b-4 border-pink-400 pb-3 select-none mb-10">
        Pending Requests
      </h2>

      <ul className="space-y-8 overflow-auto flex-grow pr-2">
        {pending.map((i) => {
          const sender = profiles.find((p) => p.user_id === i.sender_id);
          return (
            <li
              key={i.id}
              className="p-6 bg-white rounded-2xl shadow-md flex items-start gap-6"
            >
              {sender?.profile_pic ? (
                <img
                  src={sender.profile_pic}
                  alt={sender.full_name}
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-pink-300"
                />
              ) : (
                <div className="w-14 h-14 bg-pink-100 rounded-full flex items-center justify-center text-pink-300 text-2xl font-bold select-none">
                  ?
                </div>
              )}
              <div className="flex-1">
                <p className="font-semibold text-black text-lg">{sender?.full_name ?? 'Unknown User'}</p>
                <p className="text-gray-800 mt-1">{i.content}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(i.created_at).toLocaleString()}
                </p>
                <div className="mt-4 flex gap-4">
                  <button
                    onClick={() => updateStatus(i.id, 'accepted')}
                    disabled={loadingId === i.id}
                    className="px-5 py-2 text-sm rounded-full bg-pink-600 text-white hover:bg-pink-700 disabled:opacity-50 transition"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => updateStatus(i.id, 'rejected')}
                    disabled={loadingId === i.id}
                    className="px-5 py-2 text-sm rounded-full bg-gray-300 text-gray-700 hover:bg-gray-400 disabled:opacity-50 transition"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
