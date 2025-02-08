import { serverSupabaseClient } from '#supabase/server'
import type { Database } from '@/utils/type/database.types'

/**
 * Get current user all chat history
 */
export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient<Database>(event)
  const user = await supabase.auth.getUser()
  
  if (user.error) {
    return createError({ statusCode: user.error.status, statusMessage: user.error.message });
  }

  const { data, error } = await supabase
  .from('chat_history')
  .select('*')
  .eq('user_id', user.data.user.id)


  if (error) {
    return createError({ statusCode: 500 });
  }

  return data;
});