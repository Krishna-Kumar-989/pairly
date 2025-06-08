import { createClient } from '@/app/utils/supabase/server';
import type { AuthError } from '@supabase/supabase-js';

interface NotificationsRow {
  user_id: string;
  pending_request_count: number;
  updated_at: string;
}

export async function syncPendingRequestsCount(): Promise<number | null> {
  const supabase = await createClient();

  const { data, error: userError }: { data: { user: { id: string } | null }; error: AuthError | null } = await supabase.auth.getUser();

  const user = data.user;

  if (userError || !user) {
    console.error('Failed to get authenticated user:', userError);
    return null;
  }

  const userId = user.id;

  const { count, error: countError } = await supabase
    .from('interactions')
    .select('*', { count: 'exact', head: true })
    .eq('receiver_id', userId)
    .eq('status', 'pending');

  if (countError) {
    console.error('Error counting pending interactions:', countError);
    return null;
  }

  const notificationsRow: NotificationsRow = {
    user_id: userId,
    pending_request_count: count ?? 0,
    updated_at: new Date().toISOString(),
  };

  const { error: upsertError } = await supabase
    .from('notifications')
    .upsert(notificationsRow, { onConflict: 'user_id' });

  if (upsertError) {
    console.error('Error upserting notifications:', upsertError);
    return null;
  }

  return count ?? 0;
}
