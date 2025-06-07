'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/auth-js'

interface UserDataFormProps {
  user: User | null
}

export default function UploadProfileImage({ user }: UserDataFormProps) {
  const supabase = createClientComponentClient()
  const router = useRouter()

  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('')
    setSuccess('')
    const file = e.target.files ? e.target.files[0] : null
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size exceeds 5MB limit.')
        return
      }

      setImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsLoading(true)

    if (!user) {
      setError('User not authenticated. Please log in.')
      setIsLoading(false)
      return
    }

    if (!image) {
      setError('Please select an image to upload.')
      setIsLoading(false)
      return
    }

    try {
      const { data, error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(`public/${user.id}/${image.name}`, image)

      if (uploadError) {
        setError(uploadError.message)
        setIsLoading(false)
        return
      }

      const imageUrl = `https://axtqruryirfftmfmvxmr.supabase.co/storage/v1/object/public/profile-images/${data?.path}`

      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ profile_pic: imageUrl })
        .eq('user_id', user.id)

      if (updateError) {
        setError(updateError.message)
      } else {
        setSuccess('Profile image updated successfully!')
        setImage(null)
        setImagePreview(null)
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('An unexpected error occurred.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleNextClick = () => {
    router.push('/selectlocation')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-rose-200 px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-white text-black p-10 rounded-3xl shadow-2xl space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-rose-600">Upload Profile Picture</h2>

        <div
          onClick={() => document.getElementById('file-input')?.click()}
          className="border-2 border-dashed border-rose-300 rounded-xl p-8 text-center cursor-pointer hover:border-rose-500 transition"
        >
          <input
            type="file"
            id="file-input"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImageChange}
          />

          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Image Preview"
              className="w-40 h-40 mx-auto rounded-full object-cover shadow-md"
            />
          ) : (
            <p className="text-gray-600">Click to select or drag and drop your profile image</p>
          )}
        </div>

        {error && <p className="text-red-600 text-center">{error}</p>}
        {success && <p className="text-green-600 text-center">{success}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-rose-500 text-white py-3 rounded-lg text-lg hover:bg-rose-600 transition"
        >
          {isLoading ? 'Uploading...' : 'Save Profile Image'}
        </button>

        {success && (
          <button
            type="button"
            onClick={handleNextClick}
            disabled={isLoading}
            className="w-full mt-4 bg-green-500 text-white py-3 rounded-lg text-lg hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        )}
      </form>
    </div>
  )
}