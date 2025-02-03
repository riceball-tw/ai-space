<template>
  <div class="w-full lg:grid lg:grid-cols-2 min-h-screen">
    <div class="flex items-center justify-center py-12">
      <div class="mx-auto grid md:px-4 px-2 gap-6">
        <div class="grid gap-2 text-center">
          <h1 class="text-3xl font-bold">
            Sign In
          </h1>
          <p class="text-balance text-muted-foreground">
            Enter your info below to sign in to your account
          </p>
        </div>
        <AutoForm 
        class="space-y-2"
        :field-config="signInFieldConfig"
        :schema="signInSchema"
        @submit="handleSignIn"
        >
          <Button type="submit" class="w-full">
            Sign in
          </Button>
        </AutoForm>
        <div class="mt-4 text-center text-sm">
          Don't have an account?
          <a href="/sign-up" class="underline">
            Sign up
          </a>
        </div>
      </div>
    </div>
    <div class="hidden bg-muted lg:block">
      <img
        src="https://picsum.photos/1000/1000"
        alt="Image"
        width="1000"
        height="1000"
        class="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
      >
    </div>
  </div>
</template>

<script setup lang="ts">
  import * as z from 'zod'
  import { signInFieldConfig, signInSchema } from '@/utils/schemas/sign-in'

  type SignIn = z.infer<typeof signInSchema>

  const supabase = useSupabaseClient()

  // TODO: Add backend to better validate user input before send to database
  async function handleSignIn(signinValue: SignIn) {
    const { password, email } = signinValue
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (signInError) {
      console.error(signInError)
      return
    }
    
    navigateTo('/chat')
  }
</script>