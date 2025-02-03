import * as z from 'zod'

export const signUpFieldConfig = {
  username: {
    label: 'Username'
  },
  email: {
    label: 'Email'
  },
  password: {
    label: 'Password',
    inputProps: {
      type: 'password',
    },
  },
}

export const signUpSchema = z.object({
  username: z.string({
      required_error: 'Username is required.',
    }),
  email: z.string({
      required_error: 'Email is required.',
    }),
  password: z
    .string({
      required_error: 'Password is required.',
    })
    .min(6, {
      message: 'Password must be at least 6 characters.',
    }),
})