import { serverSupabaseClient } from '#supabase/server'
import type { Database } from '@/utils/type/database.types'
import { botSchema } from '@/utils/schemas/bot'

/**
 * Delete target bot
 */
export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient<Database>(event)
  const user = await supabase.auth.getUser()
  
  if (user.error) {
    return createError({ statusCode: user.error.status, statusMessage: user.error.message });
  }
  const body = await readBody(event);
  const validatedBody = botSchema.safeParse(body)
  
  if (!validatedBody.success) {
    return createError({ statusCode: 400, message:  validatedBody.error?.message });
  }

  const { data, error } = await supabase
  .from('bots')
  .delete()
  .eq('id', validatedBody.data.id)
          

  if (error) {
    return createError({ statusCode: 500 });
  }

  return data;
});