import Navbar from '@/app/instruments/navbar'
import { createClient } from '@/app/utils/supabase/server'
import { notFound } from 'next/navigation'
import type { JSX } from 'react';

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
  user_id: string
  city?: string | null
  country?: string | null
}

type Props = {
  params: Promise<{ id: string }>
  searchParams?: Promise<{ user?: string }>
}

export default async function ViewOthersProfilePage({
  params,
  searchParams,
}: Props): Promise<JSX.Element> {
  const { id } = await params
  const resolvedSearchParams = await searchParams
  const user = resolvedSearchParams?.user
  const supabase = await createClient()
  const userId = user ?? id

  if (!userId) {
    return (
      <div className="text-center py-10 text-red-600 text-lg">
        No user ID provided in query.
      </div>
    )
  }

  const { data: profile, error: profileError } = await supabase
    //.from<UserProfile>('user_profiles')
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (profileError || !profile) {
    return notFound()
  }

  const { data: locationData, error: locationError } = await supabase
   // .from<UserLocation>('user_location')
    .from('user_location')
    .select('city, country')
    .eq('user_id', userId) 
    .single()

  if (locationError) {
    console.warn('Failed to fetch location:', locationError.message)
  }

  const location =
    locationData && (locationData.city || locationData.country)
      ? [locationData.city, locationData.country].filter(Boolean).join(', ')
      : 'Location not specified'

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-100 to-violet-100 flex flex-col items-center py-12 px-6">
      <Navbar />

      <div className="max-w-3xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden relative">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 p-10 bg-gradient-to-r from-pink-400 via-rose-400 to-violet-500 text-white rounded-t-3xl">
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
            <h1 className="text-4xl font-extrabold drop-shadow-lg">
              {profile.full_name}
            </h1>
            <p className="text-lg font-semibold tracking-wide opacity-90">
              Username:{' '}
              <span className="font-normal">{profile.username}</span>
            </p>
            <p className="text-lg font-semibold tracking-wide opacity-90">
              Gender:{' '}
              <span className="font-normal capitalize">
                {profile.gender ?? 'Not specified'}
              </span>
            </p>
            <p className="text-lg font-semibold tracking-wide opacity-90">
              Age: <span className="font-normal">{profile.age ?? 'Not specified'}</span>
            </p>
            <p className="text-lg font-semibold tracking-wide opacity-90">
              Location: <span className="font-normal">{location}</span>
            </p>
          </div>
        </div>

        <section className="p-10 bg-white rounded-b-3xl shadow-inner">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b border-pink-300 pb-2">
            About
          </h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg min-h-[150px]">
            {profile.bio ?? 'No bio available.'}
          </p>
        </section>
      </div>
    </main>
  )
}