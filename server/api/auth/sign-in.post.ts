import { signInSchema } from '@/utils/schemas/sign-in';
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)
  const body = await readBody(event);
  const validatedBody = signInSchema.safeParse(body);

  if (!validatedBody.success) {
    return createError({ statusCode: 400, statusMessage: 'Invalid input' });
  }

  const { email, password } = validatedBody.data;
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return createError({ statusCode: 401, statusMessage: error.message });
  }
  return { message: 'Sign In successful' };
});