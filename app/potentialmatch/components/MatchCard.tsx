'use client';

import InteractionForm from './InteractionForm';
import type { JSX } from 'react';

type MatchCardProps = {
  profile: {
    user_id: string;
    full_name: string;
    profile_pic: string | null;
    bio: string | null;
    age: number | null;
    gender: string | null;
    city?: string | null;
    country?: string | null;
  };
  senderId: string;
};

export default function MatchCard({ profile, senderId }: MatchCardProps): JSX.Element {
  const isBioPlaceholder = !profile.bio;
  const hasLocation = Boolean(profile.city || profile.country);
  const locationText = [profile.city, profile.country].filter(Boolean).join(', ');

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden mx-auto transition-transform hover:scale-[1.03] duration-300">
      {/* Profile Header */}
      <div className="flex flex-col items-center bg-gradient-to-br from-purple-600 via-pink-500 to-red-400 p-10 relative">
        <div className="relative group rounded-full overflow-hidden w-40 h-40 shadow-2xl ring-8 ring-white transition-transform duration-300 group-hover:scale-105">
          {profile.profile_pic ? (
            <img
              src={profile.profile_pic}
              alt={profile.full_name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-400 text-6xl select-none">
              ?
            </div>
          )}
        </div>
        <h2 className="mt-6 text-4xl font-extrabold text-white drop-shadow-lg tracking-wide">
          {profile.full_name}
        </h2>
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          {profile.age !== null && profile.age !== undefined && (
            <span className="px-6 py-2 bg-white/25 backdrop-blur-sm text-white rounded-full text-lg font-semibold select-none shadow-md">
              {profile.age} yrs
            </span>
          )}
          {profile.gender && (
            <span className="px-6 py-2 bg-white/25 backdrop-blur-sm text-white rounded-full text-lg font-semibold capitalize select-none shadow-md">
              {profile.gender}
            </span>
          )}
          {hasLocation && (
            <span className="px-6 py-2 bg-white/25 backdrop-blur-sm text-white rounded-full text-lg font-semibold capitalize select-none shadow-md">
              {locationText}
            </span>
          )}
        </div>
      </div>

      {/* Bio Section */}
      <div className="px-10 py-8 border-b border-gray-200 bg-gray-50">
        <p
          className={`text-center text-base max-w-prose mx-auto ${
            isBioPlaceholder ? 'text-gray-400 italic' : 'text-gray-700'
          }`}
          style={{ lineHeight: 1.6 }}
        >
          {profile.bio || 'This user hasn’t added a bio yet.'}
        </p>
      </div>

      {/* Interaction Form */}
      <div className="px-10 py-8 bg-white">
        <InteractionForm
          key={profile.user_id}
          receiverId={profile.user_id}
          senderId={senderId}
        />
      </div>
    </div>
  );
}
