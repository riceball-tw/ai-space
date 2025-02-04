<template>
  <div class="flex min-h-screen w-full flex-col">
    <main class="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
      <div class="mx-auto grid w-full max-w-6xl gap-2">
        <h1 class="text-3xl font-semibold">
          Settings
        </h1>
      </div>
      <div class="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <nav class="grid gap-4 text-sm text-muted-foreground">
          <a href="#" class="font-semibold text-primary">
            General
          </a>
          <button disabled class="text-primary text-left opacity-40">
            Security
          </button>
          <button disabled class="text-primary text-left opacity-40">
            Advance
          </button>
        </nav>
        <div class="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
              <CardDescription>
                Your info show to others
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AutoForm 
                id="user-profile"
                class="space-y-2"
                :field-config="userProfileFieldConfig"
                :schema="userProfileSchema({
                  defaultUsername: user?.user_metadata.username,
                  })"
                @submit="handleSubmitUserProfile"
              />
            </CardContent>
            <CardFooter class="border-t px-6 py-4">
              <Button :disabled="profileStatus === 'loading'" type="submit"  form="user-profile">
                <!-- Loading state -->
                <div class="inline-flex items-center" v-if="profileStatus === 'loading'">
                  <Loader2 class="w-4 h-4 mr-2 animate-spin" className="animate-spin" />Loading...
                </div>
                <!-- Other state -->
                <div v-else>Save</div>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
  import * as z from 'zod'
  import { Loader2 } from 'lucide-vue-next'
  import { userProfileFieldConfig, userProfileSchema } from '@/utils/schemas/profile'

  definePageMeta({
    layout: 'basic'
  })

  const profileStatus = ref<'loading' | 'idle'>('idle')
  const client = useSupabaseClient()
  const { data: { user } } = await client.auth.getUser()

  type UserProfile = z.infer<ReturnType<typeof userProfileSchema>>

  async function handleSubmitUserProfile({username}: UserProfile) {
    try {
      profileStatus.value = 'loading'
      const profileRes = await $fetch('/api/profile', {
        method: 'POST',
        body: {
          username,
        } as UserProfile
      })
      alert(profileRes.message)
    } catch(err) {
      alert(err)
    } finally {
      profileStatus.value = 'idle'
    }
  }
</script>