import * as z from 'zod'
import { signUpSchema } from '@/utils/schemas/sign-up';
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)
  const body = await readBody(event);
  const validatedBody = signUpSchema.safeParse(body);

  type SignUp = z.infer<typeof signUpSchema>
  type SignUpUserMetaData = Omit<SignUp, 'email' | 'password'>
  
  if (!validatedBody.success) {
    return createError({ statusCode: 400, statusMessage: 'Invalid input' });
  }

  const { email, password, username } = validatedBody.data;
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
      } satisfies SignUpUserMetaData
    }
  });
  if (error) {
    return createError({ statusCode: 401, statusMessage: error.message });
  }
  return { message: 'Sign Up successful' };
});