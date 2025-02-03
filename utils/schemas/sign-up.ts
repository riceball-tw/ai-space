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
  username: 
    z.string({
      required_error: 'Username is required.',
    })
    .trim()
    .min(1, { message: 'Username is required' })
    .max(20, { message: 'Username is longer than 20 characters'})
    ,
  email: 
    z.string({
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