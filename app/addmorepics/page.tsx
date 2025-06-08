import { createClient } from '@/app/utils/supabase/server'
import UploadMorePics from './UploadMorePics'
import type { User } from '@supabase/auth-js'

export default async function Page() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-lg">
        Please log in to upload your profile images.
      </div>
    );
  }

  return <UploadMorePics user={user} />;
}
