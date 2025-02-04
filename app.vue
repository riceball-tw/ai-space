<template>
  <div>
    <!-- vue-sonner Persitent accross layouts in Nuxt 3 -->
    <!-- https://github.com/xiaoluoboding/vue-sonner/issues/53 -->
    <ClientOnly>
      <Toaster richColors />
    </ClientOnly>
    <NuxtLayout>
      <NuxtPage/>
    </NuxtLayout>
  </div>
</template>