import * as z from 'zod'

export const signInFieldConfig = {
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

export const signInSchema = z.object({
  email: z.string({
      required_error: 'Email is required.',
    })
    .email({ message: 'Invalid Email format'}),
  password: z
    .string({
      required_error: 'Password is required.',
    })
    .min(6, {
      message: 'Password must be at least 6 characters.',
    }),
})