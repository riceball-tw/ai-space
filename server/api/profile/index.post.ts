import { userProfileSchema } from '@/utils/schemas/profile';
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)
  const body = await readBody(event);
  const validatedBody = userProfileSchema().safeParse(body);
  
  if (!validatedBody.success) {
    return createError({ statusCode: 400, statusMessage: 'Invalid input' });
  }

  // Get User
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw createError({ statusCode: 500, statusMessage: 'Unable to get user' })

  // Update User
  const { error } = await supabase.auth.updateUser({
    data: { ...user.user_metadata, username: validatedBody.data.username }
  })
  if (error) {
    return createError({ statusCode: 401, statusMessage: error.message });
  }
  return { message: 'User Profile Edited' };
});