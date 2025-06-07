'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/auth-js'

interface UserDataFormProps {
  user: User | null
}

type FormData = {
  username: string
  fullName: string
  bio: string
  profilePic: string
  gender: string
  age: string
}

export default function UserDataForm({ user }: UserDataFormProps) {
  const supabase = createClientComponentClient()
  const router = useRouter()

  const [formData, setFormData] = useState<FormData>({
    username: '',
    fullName: '',
    bio: '',
    profilePic:
      'https://axtqruryirfftmfmvxmr.supabase.co/storage/v1/object/public/profile-images//user.png',
    gender: '',
    age: '',
  })

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    if (!user) {
      setError('User not authenticated. Please log in.')
      setLoading(false)
      return
    }

    const ageNum = Number(formData.age)
    if (isNaN(ageNum) || ageNum <= 0) {
      setError('Please enter a valid age')
      setLoading(false)
      return
    }

    const { error: upsertError } = await supabase.from('user_profiles').upsert(
      {
        user_id: user.id,
        email: user.email,
        username: formData.username,
        full_name: formData.fullName,
        bio: formData.bio,
        profile_pic: formData.profilePic,
        gender: formData.gender,
        age: ageNum,
      },
      {
        onConflict: 'user_id',
      }
    )

    setLoading(false)

    if (upsertError) {
      setError(upsertError.message)
    } else {
      setSuccess('Profile saved successfully!')
      router.push('/uploadprofileimage')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-rose-200 px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-white text-black p-10 rounded-3xl shadow-2xl space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-rose-600">
          Complete Your Profile
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-rose-200 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-400"
          />

          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-rose-200 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-400"
          />

          <input
            type="number"
            name="age"
            placeholder="Age"
            value={formData.age}
            onChange={handleChange}
            required
            min={1}
            className="w-full px-4 py-3 border border-rose-200 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-400"
          />

          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-rose-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-rose-400"
          >
            <option value="" disabled>
              Select Gender
            </option>
            <option value="m">Male</option>
            <option value="f">Female</option>
            <option value="others">Others</option>
          </select>
        </div>

        <textarea
          name="bio"
          placeholder="Short Bio"
          value={formData.bio}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-3 border border-rose-200 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-rose-400"
        />

        {error && <p className="text-red-600 text-center">{error}</p>}
        {success && <p className="text-green-600 text-center">{success}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-rose-500 text-white py-3 rounded-md text-lg hover:bg-rose-600 transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  )
}