import { createClient } from '@/app/utils/supabase/server'

import type { User } from '@supabase/auth-js'
import NavbarClient from './navbarclient';

export default async function Page() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();


    return <NavbarClient user={user} />;
}
