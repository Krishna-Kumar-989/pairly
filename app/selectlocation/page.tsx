import { createClient } from '@/app/utils/supabase/server'
import SelectLocationClient from './SelectLocationClient'
import Navbar from '../instruments/navbar'
import { User } from '@supabase/supabase-js'

export default async function Page() {
  const supabase = await createClient()

  const {
    data: { user },
  }: { data: { user: User | null } } = await supabase.auth.getUser()

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="mt-10 text-center text-red-500">Please log in to select your location.</div>
      </>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
      <Navbar />
      <main className="px-4 pt-6 pb-12">
        <SelectLocationClient user={user} />
      </main>
    </div>
  )
}
