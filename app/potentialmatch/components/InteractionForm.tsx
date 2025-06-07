'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import type { PostgrestError } from '@supabase/supabase-js';
import type { JSX } from 'react';

interface Props {
  senderId: string;
  receiverId: string;
}

export default function InteractionForm({ senderId, receiverId }: Props): JSX.Element {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sent' | 'rejected'>('idle');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSend = async (): Promise<void> => {
    if (!message.trim()) return;

    setLoading(true);

    const { error }: { error: PostgrestError | null } = await supabase.from('interactions').insert([
      {
        sender_id: senderId,
        receiver_id: receiverId,
        content: message.trim(),
        status: 'pending',
      },
    ]);

    setLoading(false);

    if (!error) {
      setStatus('sent');
    } else {
      console.error('Send error:', error);
    }
  };

  const handleReject = async (): Promise<void> => {
    setLoading(true);

    const { error }: { error: PostgrestError | null } = await supabase.from('interactions').insert([
      {
        sender_id: senderId,
        receiver_id: receiverId,
        status: 'rejected',
      },
    ]);

    setLoading(false);

    if (!error) {
      setStatus('rejected');
    } else {
      console.error('Reject error:', error);
    }
  };

  const handleNext = (): void => {
    router.push(`/potentialmatch?ts=${Date.now()}`);
  };

  if (status === 'sent') {
    return (
      <div className="mt-6 text-center">
        <p className="text-green-600 font-semibold">✅ Request sent!</p>
        <button
          onClick={handleNext}
          className="mt-4 bg-pink-500 text-white px-6 py-2 rounded-full font-semibold shadow-md hover:bg-pink-600 transition"
        >
          Next
        </button>
      </div>
    );
  }

  if (status === 'rejected') {
    return (
      <div className="mt-6 text-center">
        <p className="text-red-600 font-semibold">❌ Match rejected.</p>
        <button
          onClick={handleNext}
          className="mt-4 bg-pink-500 text-white px-6 py-2 rounded-full font-semibold shadow-md hover:bg-pink-600 transition"
        >
          Next
        </button>
      </div>
    );
  }

  return (
    <div className="mt-6 w-full max-w-md mx-auto">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write a thoughtful message..."
        rows={4}
        disabled={loading}
        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400
                   focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400
                   resize-none shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
      />
      <div className="flex justify-center gap-6 mt-4">
        <button
          onClick={handleSend}
          disabled={loading || !message.trim()}
          className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600
                     text-white px-6 py-2 rounded-full font-semibold shadow-md
                     hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed
                     transition"
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
        <button
          onClick={handleReject}
          disabled={loading}
          className="bg-gray-200 text-gray-800 px-6 py-2 rounded-full font-semibold
                     hover:bg-gray-300 disabled:opacity-60 disabled:cursor-not-allowed
                     transition"
        >
          Reject
        </button>
      </div>
    </div>
  );
}
