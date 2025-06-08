import Navbar from '../instruments/navbar'
import EditProfileButton from './EditProfileButton'
import { createClient } from '@/app/utils/supabase/server'
import type { JSX } from 'react'

interface UserProfile {
  user_id: string
  full_name: string
  username: string
  gender?: string | null
  age?: number | null
  bio?: string | null
  profile_pic?: string | null
}

interface UserLocation {
  city?: string | null
  country?: string | null
}

interface MorePics {
  user_id: string
  image_1_url?: string | null
  image_2_url?: string | null
  image_3_url?: string | null
  image_4_url?: string | null
  image_5_url?: string | null
  image_6_url?: string | null
}

export default async function ViewProfilePage(): Promise<JSX.Element> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-200 via-violet-200 to-rose-200 text-center text-xl text-gray-700">
        Please log in to view your profile.
      </div>
    )
  }

  // Fetch user profile
  const { data: profile, error: profileError } = await supabase
    //.from<UserProfile>('user_profiles')
    .from('user_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (profileError || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 via-pink-100 to-yellow-100 text-red-600 text-xl text-center">
        Failed to load profile: {profileError?.message || 'Unknown error'}
      </div>
    )
  }

  // Fetch user location
  const { data: locationData, error: locationError } = await supabase
    //.from<UserLocation>('user_location')
    .from('user_location')
    .select('city, country')
    .eq('user_id', user.id)
    .single()

  if (locationError) {
    console.warn('Failed to fetch location:', locationError.message)
  }

  // Fetch additional pictures
  const { data: picsData, error: picsError } = await supabase
   // .from<MorePics>('morepics')
   .from('morepics')
    .select(
      'user_id, image_1_url, image_2_url, image_3_url, image_4_url, image_5_url, image_6_url'
    )
    .eq('user_id', user.id)
    .single()

  if (picsError) {
    console.warn('Failed to fetch additional pics:', picsError.message)
  }

  const locationString =
    locationData && (locationData.city || locationData.country)
      ? `${locationData.city ?? ''}${locationData.city && locationData.country ? ', ' : ''}${locationData.country ?? ''}`
      : 'Not specified'

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-pink-100 via-rose-100 to-violet-100 relative pt-14">
      <Navbar />

      <div className="flex items-center justify-center pt-20 px-4">
        <div className="w-full max-w-4xl bg-white text-black rounded-3xl shadow-2xl overflow-hidden relative">
          <div className="absolute right-6 top-8 z-10">
            <EditProfileButton />
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 p-10 bg-gradient-to-r from-rose-400 via-pink-400 to-violet-500 text-white rounded-t-3xl">
            {profile.profile_pic ? (
              <img
                src={profile.profile_pic}
                alt={`${profile.full_name} Profile Picture`}
                className="w-44 h-44 rounded-3xl object-cover shadow-xl border-4 border-white"
              />
            ) : (
              <div className="w-44 h-44 rounded-3xl bg-white bg-opacity-30 flex items-center justify-center text-white text-2xl font-semibold shadow-xl border-4 border-white">
                No Image
              </div>
            )}
            <div className="flex flex-col gap-2 text-center md:text-left">
              <h1 className="text-4xl font-extrabold drop-shadow-lg">{profile.full_name}</h1>
              <p className="text-lg font-medium">
                <span className="font-semibold">Username:</span> {profile.username}
              </p>
              <p className="text-lg font-medium">
                <span className="font-semibold">Gender:</span> {profile.gender ?? 'Not specified'}
              </p>
              <p className="text-lg font-medium">
                <span className="font-semibold">Age:</span> {profile.age ?? 'Not specified'}
              </p>
              <p className="text-lg font-medium">
                <span className="font-semibold">Location:</span> {locationString}
              </p>
            </div>
          </div>

          <section className="p-10 bg-white rounded-b-3xl shadow-inner min-h-[180px]">
            <h2 className="text-3xl font-bold text-rose-600 mb-4 border-b border-rose-200 pb-2">
              About Me
            </h2>
            <p className="text-gray-800 text-lg leading-relaxed whitespace-pre-wrap">
              {profile.bio ?? 'No bio available.'}
            </p>
          </section>

         {/* More Pics Section */}
{picsData && (
  <section className="p-10 bg-white rounded-b-3xl shadow-inner mt-6">
    <h2 className="text-3xl font-bold text-rose-600 mb-4 border-b border-rose-200 pb-2">
      More Photos
    </h2>
    <div className="grid grid-cols-3 gap-6">
      {[
        picsData.image_1_url,
        picsData.image_2_url,
        picsData.image_3_url,
        picsData.image_4_url,
        picsData.image_5_url,
        picsData.image_6_url,
      ].map((url, idx) =>
        url ? (
          <img
            key={idx}
            src={url}
            alt={`Additional pic ${idx + 1}`}
            className="w-full h-48 object-cover rounded-lg shadow-md"
            loading="lazy"
          />
        ) : (
          <div
            key={idx}
            className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center text-gray-300 select-none"
          >
            No Image
          </div>
        )
      )}
    </div>
  </section>
)}

        </div>
      </div>
    </main>
  )
}
