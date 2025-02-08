import { serverSupabaseClient } from '#supabase/server'
import type { Database } from '@/utils/type/database.types'

/**
 *  Get current user related bots
 */
export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient<Database>(event)
  const user = await supabase.auth.getUser()
  
  if (user.error) {
    return createError({ statusCode: user.error.status, statusMessage: user.error.message });
  }

  const { data: bots, error } = await supabase
  .from('bots')
  .select('*') 
  .eq('user_id', user.data.user.id)


  if (error) {
    console.log('error', error);
  }
  
  return bots
});
