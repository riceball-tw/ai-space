import * as z from 'zod'

export const chatHistoryBodySchema = z.object({
  role: z.string(),
  content: z.string(),
  botId: z.string(),
})