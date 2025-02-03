<template>
  <nav class="fixed top-0 left-0 right-0 z-10 flex justify-between items-center mx-auto container">
    <NuxtLink class="p-4 inline-block text-xl font-medium" to="/">iSpace</NuxtLink>
    <ul class="flex gap-4 text-lg">
      <!-- <li><NuxtLink to="/">iSpace</NuxtLink></li> -->
      <li><NuxtLink class="p-4 inline-block" to="/">Home</NuxtLink></li>
      <li><NuxtLink class="p-4 inline-block" to="/profile">Profile</NuxtLink></li>
      <li><NuxtLink class="p-4 inline-block" to="/chat">Chat</NuxtLink></li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
</script>