import * as z from 'zod'

export const userProfileFieldConfig = {
  username: {
    label: 'Username'
  },
}

type UserProfileSchemaOptions = { defaultUsername: string };
const defaultUserProfile = { defaultUsername: 'User' }

export const userProfileSchema = ({ defaultUsername }: UserProfileSchemaOptions = defaultUserProfile) => {
  return z.object({
    username: 
      z.string({
        required_error: 'Username is required.',
      })
      .trim()
      .min(1, { message: 'Username is required' })
      .max(20, { message: 'Username is longer than 20 characters'})
      .default(defaultUsername)
      ,
  })
} 