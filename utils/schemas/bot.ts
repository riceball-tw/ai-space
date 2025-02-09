import * as z from 'zod'

export const botSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.object({
    avatar: z.object({
      src: z.string(),
      width: z.number(),
      height: z.number(),
    }),
    swipeCard: z.object({
      src: z.string(),
      width: z.number(),
      height: z.number(),
    }),
  }),
  bio: z.string(),
})

export const botChatSchema = z.object({
  bot: botSchema,
  history: z.array(
    z.object({
      role: z.string(),
      content: z.string()
    })
  ).optional()
})