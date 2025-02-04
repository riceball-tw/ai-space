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
          <Suspense>
            <UserInfo />
            <template #fallback>
              <Skeleton style="height: 264px" class="w-full" />
            </template>
          </Suspense>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
  import UserInfo from '@/components/profile/UserInfo.vue'
  
  definePageMeta({
    layout: 'basic'
  })
</script>