'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/auth-js'

interface UserDataFormProps {
  user: User | null
}

export default function UploadMorePics({ user }: UserDataFormProps) {
  const supabase = createClientComponentClient()
  const router = useRouter()

  const [images, setImages] = useState<(File | null)[]>(Array(6).fill(null))
  const [previews, setPreviews] = useState<(string | null)[]>(Array(6).fill(null))
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)

 
  useEffect(() => {
    if (!user) return

    const fetchImages = async () => {
      const { data, error } = await supabase
        .from('morepics')
        .select(
          `
          image_1_url,
          image_2_url,
          image_3_url,
          image_4_url,
          image_5_url,
          image_6_url
          `
        )
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') { // ignore no rows found
        setError(error.message)
        return
      }

      if (data) {
      
        setPreviews([
          data.image_1_url || null,
          data.image_2_url || null,
          data.image_3_url || null,
          data.image_4_url || null,
          data.image_5_url || null,
          data.image_6_url || null,
        ])
      }
    }

    fetchImages()
  }, [user, supabase])

  const handleImageChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    if (file && file.size > 5 * 1024 * 1024) {
      setError('Image size exceeds 5MB limit.')
      return
    }

    const newImages = [...images]
    const newPreviews = [...previews]

    newImages[index] = file

    if (file) {
      newPreviews[index] = URL.createObjectURL(file)
    }

    setImages(newImages)
    setPreviews(newPreviews)
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsLoading(true)

    if (!user) {
      setError('User not authenticated.')
      setIsLoading(false)
      return
    }

    try {
      const urls: string[] = []

      for (let i = 0; i < 6; i++) {
        if (images[i]) {
          
          const { data, error: uploadError } = await supabase.storage
            .from('profile-images')
            .upload(`public/${user.id}/more/${Date.now()}_${images[i]?.name}`, images[i]!, {
              upsert: true,
            })

          if (uploadError) {
            throw new Error(uploadError.message)
          }

          const url = `https://axtqruryirfftmfmvxmr.supabase.co/storage/v1/object/public/profile-images/${data?.path}`
          urls.push(url)
        } else {
         
          urls.push(previews[i] ?? '')
        }
      }

      const insertData = {
        user_id: user.id,
        image_1_url: urls[0],
        image_2_url: urls[1],
        image_3_url: urls[2],
        image_4_url: urls[3],
        image_5_url: urls[4],
        image_6_url: urls[5],
      }

      const { error: insertError } = await supabase
        .from('morepics')
        .upsert(insertData, { onConflict: 'user_id' })

      if (insertError) {
        throw new Error(insertError.message)
      }

      setSuccess('Images uploaded successfully!')
      setImages(Array(6).fill(null))
      setPreviews(urls.map(url => (url === '' ? null : url)))
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-rose-200 px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl bg-white text-black p-10 rounded-3xl shadow-2xl space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-rose-600">Upload Up to 6 Photos</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border-2 border-dashed border-rose-300 rounded-xl p-4 text-center">
              <input
                type="file"
                accept="image/*"
                id={`file-${i}`}
                onChange={handleImageChange(i)}
                className="hidden"
              />
              <label htmlFor={`file-${i}`} className="cursor-pointer block">
                {previews[i] ? (
                  <img
                    src={previews[i]!}
                    alt={`Preview ${i + 1}`}
                    className="w-full h-40 object-cover rounded-xl"
                  />
                ) : (
                  <p className="text-gray-600">Click to upload image {i + 1}</p>
                )}
              </label>
            </div>
          ))}
        </div>

        {error && <p className="text-red-600 text-center">{error}</p>}
        {success && <p className="text-green-600 text-center">{success}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-rose-500 text-white py-3 rounded-lg text-lg hover:bg-rose-600 transition"
        >
          {isLoading ? 'Uploading...' : 'Save Photos'}
        </button>

        {success && (
          <button
            type="button"
            onClick={() => router.push('/homepage')}
            className="w-full mt-4 bg-green-500 text-white py-3 rounded-lg text-lg hover:bg-green-600 transition"
          >
            Next
          </button>
        )}
      </form>
    </div>
  )
}
