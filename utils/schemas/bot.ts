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