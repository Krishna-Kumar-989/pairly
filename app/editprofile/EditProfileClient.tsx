'use client';

import { useState } from 'react';
import UploadProfileImage from './UploadProfileImage';
import { FaArrowLeft } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import Navbar from '../instruments/navbar';
import { supabase } from '../lib/supabase'; // make sure path is correct
import type { JSX } from 'react';

interface Profile {
  profile_pic: string | null;
  bio: string | null;
}

interface Props {
  userId: string;
  profile: Profile;
}

export default function EditProfileClient({ userId, profile }: Props): JSX.Element {
  const [bio, setBio] = useState<string>(profile.bio ?? '');
  const [profilePic, setProfilePic] = useState<string>(profile.profile_pic ?? '');
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const router = useRouter();

  async function handleSave(): Promise<void> {
    setSaving(true);
    setError('');

    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({ bio, profile_pic: profilePic })
      .eq('user_id', userId);

    if (updateError) {
      setError(updateError.message);
    } else {
      alert('Profile updated successfully!');
    }

    setSaving(false);
  }

  function handleBack(): void {
    router.push('/viewprofile');
  }

  function handleChangeLocation(): void {
    router.push('/selectlocation');
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-100 to-violet-100 flex flex-col items-center py-12 px-6">
      <Navbar />
      <div className="max-w-3xl w-full bg-pink-50 rounded-3xl shadow-2xl overflow-hidden relative p-10 flex flex-col gap-8">
        {/* Back Button */}
        <button
          onClick={handleBack}
          aria-label="Go back"
          className="flex items-center gap-3 text-violet-700 hover:text-violet-900 font-semibold transition self-start"
        >
          <FaArrowLeft size={18} />
          Back
        </button>

        <h1 className="text-4xl font-extrabold text-violet-800 text-center">
          Edit Profile
        </h1>

        <div className="flex justify-center">
          <UploadProfileImage profilePic={profilePic} setProfilePic={setProfilePic} />
        </div>

        <section>
          <label
            htmlFor="bio"
            className="block text-2xl font-semibold text-black mb-3 select-none"
          >
            About Me (Bio)
          </label>
          <textarea
            id="bio"
            rows={7}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full rounded-2xl border border-gray-300 p-5 text-lg text-black resize-y
              placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-rose-300
              shadow-sm transition"
            placeholder="Write something about yourself..."
          />
        </section>

        {error && (
          <p className="text-red-600 mt-1 text-center font-semibold select-none">
            {error}
          </p>
        )}

        <div className="flex flex-col items-center mt-6 gap-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-rose-600 hover:bg-rose-700 text-white px-10 py-4 rounded-3xl font-semibold shadow-xl
              transition disabled:opacity-50 disabled:cursor-not-allowed w-full max-w-xs"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>

          <button
            onClick={handleChangeLocation}
            type="button"
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-3xl font-semibold shadow-md transition w-full max-w-xs"
          >
            Change Location
          </button>
        </div>
      </div>
    </main>
  );
}
