import { GoogleGenerativeAI } from "@google/generative-ai";
import { serverSupabaseClient } from '#supabase/server'
import type { Database } from '@/utils/type/database.types'
import { botSchema } from '@/utils/schemas/bot';

/**
 * Start a AI bot chat
 */
export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient<Database>(event)
  const user = await supabase.auth.getUser()
  
  if (user.error) {
    return createError({ statusCode: user.error.status, statusMessage: user.error.message });
  }

  const userName = user.data.user.user_metadata.username
  const body = await readBody(event);
  const validatedBody = botSchema.safeParse(body);

  if (!validatedBody.success) {
    return createError({ statusCode: 400, message:  validatedBody.error?.message });
  }

  const { GEMINI_API_KEY } = useRuntimeConfig(event)
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

  const chat = model.startChat({
    history: [],
    systemInstruction: {
      role: 'system',
      parts: [{ text: `You are ${validatedBody.data.name}, your bio is ${validatedBody.data.bio}` }]
    }
  });

  return await chat.sendMessage(`Hello, I'm ${userName}, maybe you can tell me more about yourself?`);
});