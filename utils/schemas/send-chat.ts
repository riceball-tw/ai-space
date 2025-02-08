import * as z from 'zod'

export const sendChatSchema = z.object({
  message: z.string(),
  })