'use client';

import { useState } from 'react';
import { supabase } from '@/app/lib/supabase'; // adjust path as needed

interface Props {
  profilePic: string;
  setProfilePic: (url: string) => void;
}

export default function UploadProfileImage({ profilePic, setProfilePic }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    setError('');
    const file = event.target.files?.[0];
    if (!file) return;

    const maxFileSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxFileSize) {
      setError('File size must be less than 5MB.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Only image files are allowed.');
      return;
    }

    const fileExt = file.name.split('.').pop() ?? 'png';
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `profile_pics/${fileName}`;

    setUploading(true);

    try {
      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('profile-images').getPublicUrl(filePath);
      if (!data?.publicUrl) throw new Error('Failed to get public URL.');

      setProfilePic(data.publicUrl);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Upload failed.');
      }
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative w-44 h-44 rounded-full overflow-hidden border-4 border-indigo-500 shadow-2xl
        cursor-pointer transition-transform hover:scale-[1.05] hover:shadow-indigo-600/40"
        aria-label="Profile picture upload"
      >
        {profilePic ? (
          <img
            src={profilePic}
            alt="Profile Pic"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div
            className="w-full h-full bg-gradient-to-tr from-indigo-300 via-purple-300 to-pink-300
            flex items-center justify-center text-indigo-800 font-bold text-xl select-none"
          >
            No Image
          </div>
        )}

        <label
          htmlFor="single"
          className="absolute bottom-3 right-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-1.5
          rounded-full cursor-pointer select-none shadow-lg transition-shadow"
          title="Change Profile Picture"
        >
          {uploading ? 'Uploading...' : 'Change'}
        </label>

        <input
          type="file"
          id="single"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={uploading}
        />
      </div>

      {error && (
        <p
          className="mt-3 text-red-600 font-semibold select-none animate-fadeIn"
          aria-live="polite"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}
