<template>
  <div :class="`flex gap-2 ${direction === 'right' ? 'flex-row-reverse' : ''}`">
    <Avatar>
      <AvatarImage :src="avatar.src" :alt="avatar.alt" />
      <AvatarFallback>{{ avatar.alt }}</AvatarFallback>
    </Avatar>
    <ChatBubble :time="time">
      <slot />
    </ChatBubble>
  </div>
</template>

<script setup lang="ts">
  import ChatBubble from '@/components/chat/ChatBubble.vue';

  const { avatar, direction = 'left' } = defineProps<{
    avatar: {
      src: string;
      alt: string;
    };
    direction?: 'left' | 'right';
    time?: string
  }>()

</script>