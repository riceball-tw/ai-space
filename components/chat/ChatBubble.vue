<template>
  <div style="max-width: 40ch" class="flex flex-col bg-primary text-primary-foreground px-4 py-2 rounded">
    <p>
      <slot />
    </p>
    <time class="self-end text-sm" :datetime="time">{{ time }}</time>
  </div>
</template>

<script setup lang="ts">
  const { time } = defineProps<{
    time: string;
  }>();
</script>