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
          <Button :disabled="signInStatus === 'loading'" type="submit" class="w-full">
            <!-- Loading state -->
            <div class="inline-flex items-center" v-if="signInStatus === 'loading'">
              <Loader2 class="w-4 h-4 mr-2 animate-spin" className="animate-spin" />Loading...
            </div>
            <!-- Other state -->
            <div v-else>Sign in</div>
          </Button>
        </AutoForm>
        <div class="mt-4 text-center text-sm">
          Don't have an account?
          <NuxtLink to="/sign-up" class="underline">
            Sign up
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
  import { signInFieldConfig, signInSchema } from '@/utils/schemas/sign-in'
  
  type SignIn = z.infer<typeof signInSchema>

  const signInStatus = ref<'loading' | 'idle'>('idle')

  async function handleSignIn(signinValue: SignIn) {
    const { password, email } = signinValue

    try {
      signInStatus.value = 'loading'
      const signInRes = await $fetch('/api/auth/sign-in', {
        method: 'POST',
        body: {
          email,
          password,
        } satisfies SignIn
      })
      toast.success(signInRes.message)
      navigateTo('/chat')
    } catch(err) {
      if (err instanceof Error) {
        toast.error(err.message);
      }
    } finally {
      signInStatus.value = 'idle'
    }
    
  }
</script>