<template>
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
</template>

<script setup lang="ts">
  import * as z from 'zod'
  import { toast } from 'vue-sonner'
  import { Loader2 } from 'lucide-vue-next'
  import { userProfileFieldConfig, userProfileSchema } from '@/utils/schemas/profile'

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
      toast.success(profileRes.message)
    } catch(err) {
      if (err instanceof Error) {
        toast.error(err.message);
      }
    } finally {
      profileStatus.value = 'idle'
    }
  }
</script>