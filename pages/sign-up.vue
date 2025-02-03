<template>
  <div class="w-full lg:grid lg:grid-cols-2 min-h-screen">
    <div class="flex items-center justify-center py-12">
      <div class="mx-auto grid md:px-4 px-2 gap-6">
        <div class="grid gap-2 text-center">
          <h1 class="text-3xl font-bold">
            Sign Up
          </h1>
          <p class="text-balance text-muted-foreground">
            Enter your info below to sign up an account
          </p>
        </div>

        <AutoForm 
        class="space-y-2"
        :field-config="signUpFieldConfig"
        :schema="signUpSchema"
        @submit="handleSignUp"
        >
          <Button type="submit" class="w-full">
            Create account
          </Button>
        </AutoForm>

        <div class="mt-4 text-center text-sm">
          Have an account?
          <a href="/sign-in" class="underline">
            Sign In
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
  import { signUpFieldConfig, signUpSchema } from '@/utils/schemas/sign-up'

  type SignUp = z.infer<typeof signUpSchema>

  async function handleSignUp(signupValue: SignUp) {
    const { password, email, username } = signupValue
    
    try {
      await $fetch('/api/auth/sign-up', {
        method: 'POST',
        body: {
          password,
          email,
          username
        } as SignUp
      })
      navigateTo('/chat')
    } catch(err) {
      alert(err)
    }
  }
</script>