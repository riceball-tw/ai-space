import { serverSupabaseClient } from '#supabase/server'
import type { Database } from '@/utils/type/database.types'
import { chatHistoryBodySchema } from '@/utils/schemas/chat-history'

/**
 *  Add new chat history
 */
export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient<Database>(event)
  const user = await supabase.auth.getUser()
  if (user.error) {
    return createError({ statusCode: user.error.status, statusMessage: user.error.message });
  }
  const body = await readBody(event);
  const validatedBody = chatHistoryBodySchema.safeParse(body)

  if (!validatedBody.success) {
    return createError({ statusCode: 400, message:  validatedBody.error?.message });
  }

  const userId = user.data.user.id
  const botId = validatedBody.data.botId

  const { data, error } = await supabase
  .from('chat_history')
  .insert([
    { role: validatedBody.data.role,
      content: validatedBody.data.content,
      bot_id: botId,
      user_id: userId
     },
  ])
  .select()

  if (error) {
    return createError({ statusCode: 500 });
  }

  return data[0]
});