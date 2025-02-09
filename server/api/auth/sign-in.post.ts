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
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return createError({ statusCode: 401, statusMessage: error.message });
  }
  // 1. For unknown reason, build-in redirect will not work when first time sign in...
  // 2. useSupabaseUser() is not updated until I leave the browser window or switch browser tabs
  // Related issues:
  // - useSupabaseUser() is not updated until I leave the browser window or switch browser tabs: https://github.com/nuxt-modules/supabase/issues/144
  // Solution: 
  // - Necessary to use client.auth.setSession() on login: https://github.com/nuxt-modules/supabase/issues/143
  supabase.auth.setSession(data.session)
  return { message: 'Sign In successful' };
});