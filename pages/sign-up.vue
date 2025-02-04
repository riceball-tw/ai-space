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
          <Button :disabled="signUpStatus === 'loading'" type="submit" class="w-full">
            <!-- Loading state -->
            <div class="inline-flex items-center" v-if="signUpStatus === 'loading'">
              <Loader2 class="w-4 h-4 mr-2 animate-spin" className="animate-spin" />Loading...
            </div>
            <!-- Other state -->
            <div v-else>Create Account</div>
          </Button>
        </AutoForm>

        <div class="mt-4 text-center text-sm">
          Have an account?
          <NuxtLink to="/sign-in" class="underline">
            Sign In
          </NuxtLink>
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
  import { toast } from 'vue-sonner'
  import { Loader2 } from 'lucide-vue-next'
  import { signUpFieldConfig, signUpSchema } from '@/utils/schemas/sign-up'

  type SignUp = z.infer<typeof signUpSchema>

  const signUpStatus = ref<'loading' | 'idle'>('idle')

  async function handleSignUp(signupValue: SignUp) {
    const { password, email, username } = signupValue
    
    try {
      signUpStatus.value = 'loading'
      const signUpRes = await $fetch('/api/auth/sign-up', {
        method: 'POST',
        body: {
          password,
          email,
          username
        } as SignUp
      })
      toast.success(signUpRes.message)
      navigateTo('/chat')
    } catch(err) {
      alert(err)
      if (err instanceof Error) {
        toast.error(err.message);
      }
    } finally {
      signUpStatus.value = 'idle'
    }
  }
</script>