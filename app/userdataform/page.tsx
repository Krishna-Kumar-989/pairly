import { createClient } from '@/app/utils/supabase/server'
import UserDataForm from './UserDataForm'

export default async function Page() {
  const supabase = await createClient() // Remove the cookieStore argument

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return <UserDataForm user={user ?? null} />
}